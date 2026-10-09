import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const authDbName = process.env.AUTH_DB_NAME;
const appDbName = process.env.APP_DB_NAME || authDbName;

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

let clientPromise;

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalThis._mongoClient = client;
  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

function normalizePage(page) {
  const parsedPage = Number.parseInt(page, 10);
  return Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
}

async function attachClientInfo(tasks, authDb, reviewsCollection) {
  const usersCollection = authDb.collection("user");
  const clientEmails = [...new Set(tasks.map((task) => task.client_email || task.clientEmail).filter(Boolean))];

  const clientUsers = clientEmails.length
    ? await usersCollection
        .find({ email: { $in: clientEmails } })
        .project({ email: 1, name: 1, image: 1, avatar: 1 })
        .toArray()
    : [];

  const clientByEmail = new Map(clientUsers.map((user) => [user.email, user]));

  let reviewStats = {};
  if (reviewsCollection && clientEmails.length > 0) {
    const reviewDocs = await reviewsCollection.find({ 
      $or: [
        { reviewee_email: { $in: clientEmails } },
        { revieweeEmail: { $in: clientEmails } }
      ]
    }).toArray();
    
    reviewStats = reviewDocs.reduce((acc, review) => {
      const key = review.reviewee_email || review.revieweeEmail;
      if (!key) return acc;
      const current = acc[key] || { total: 0, count: 0 };
      acc[key] = {
        total: current.total + Number(review.rating || 0),
        count: current.count + 1,
      };
      return acc;
    }, {});
  }

  return tasks.map((task) => {
    const email = task.client_email || task.clientEmail;
    const clientData = clientByEmail.get(email) || {};
    const stats = reviewStats[email] || { total: 0, count: 0 };
    const averageRating = stats.count ? Number((stats.total / stats.count).toFixed(1)) : 0;
    
    return {
      ...task,
      client: {
        name: clientData.name || email || "Unknown client",
        email: email,
        image: clientData.image || clientData.avatar || null,
        rating: averageRating,
        reviewCount: stats.count,
      },
    };
  });
}

export async function getHomepageData() {
  const client = await clientPromise;
  const authDb = client.db(authDbName);
  const appDb = client.db(appDbName);

  const usersCollection = authDb.collection("user");
  const tasksCollection = appDb.collection("tasks");
  const reviewsCollection = appDb.collection("reviews");
  const paymentsCollection = appDb.collection("payments");
  const proposalsCollection = appDb.collection("proposals");

  const latestTasks = await tasksCollection
    .find({ status: "open" })
    .sort({ createdAt: -1 })
    .limit(40)
    .toArray();

  const latestTasksWithClient = await attachClientInfo(latestTasks, authDb, reviewsCollection);

  for (const task of latestTasksWithClient) {
    const taskIdStr = task._id?.toString() || task.id?.toString();
    if (taskIdStr) {
      task.proposalsCount = await proposalsCollection.countDocuments({
        $or: [{ taskId: taskIdStr }, { task_id: taskIdStr }]
      });
    } else {
      task.proposalsCount = 0;
    }
  }

  const freelancerUsers = await usersCollection
    .find({ role: { $regex: /^freelancer$/i } })
    .project({ name: 1, email: 1, image: 1, avatar: 1, skills: 1, hourlyRate: 1, designation: 1, title: 1, headline: 1, professionalTitle: 1, role: 1, rating: 1, reviewCount: 1, reviewsCount: 1, completedTasks: 1, finishedJobs: 1, status: 1, availabilityStatus: 1 })
    .toArray();

  const reviewDocs = await reviewsCollection.find({}).toArray();
  const reviewStats = reviewDocs.reduce((acc, review) => {
    if (!review.reviewee_email) return acc;
    const key = review.reviewee_email;
    const current = acc[key] || { total: 0, count: 0 };
    acc[key] = {
      total: current.total + Number(review.rating || 0),
      count: current.count + 1,
    };
    return acc;
  }, {});

  const topFreelancers = freelancerUsers
    .map((freelancer) => {
      const stats = reviewStats[freelancer.email] || { total: 0, count: 0 };
      const averageRating = stats.count ? stats.total / stats.count : 0;
      
      const computedRating = freelancer.rating || (stats.count ? Number(averageRating.toFixed(1)) : 0);
      const computedReviewCount = freelancer.reviewCount || freelancer.reviewsCount || stats.count || 0;
      const computedFinishedJobs = Math.max(
        freelancer.completedTasks || 0,
        freelancer.finishedJobs || 0,
        stats.count || 0
      );

      return {
        ...freelancer,
        skills: freelancer.skills || [],
        rating: computedRating,
        reviewCount: computedReviewCount,
        finishedJobs: computedFinishedJobs,
      };
    })
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.finishedJobs - a.finishedJobs;
    })
    .slice(0, 8);

  const totalUsers = await usersCollection.countDocuments();
  const totalTasks = await tasksCollection.countDocuments();

  const payoutAggregation = await paymentsCollection
    .aggregate([
      { $match: { payment_status: { $in: ["complete", "completed", "paid"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    .toArray();

  const totalPayout = payoutAggregation.length ? payoutAggregation[0].total : 0;
  const openTasksCount = await tasksCollection.countDocuments({ status: "open" });

  const taskStatusBreakdown = await tasksCollection
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  const chartData = taskStatusBreakdown.map((entry) => ({
    name:
      entry._id === "open"
        ? "Open"
        : entry._id === "in progress"
          ? "In Progress"
          : entry._id === "completed"
            ? "Completed"
            : entry._id,
    value: entry.count,
  }));

  return {
    latestTasks: latestTasksWithClient,
    topFreelancers,
    stats: {
      totalUsers,
      totalTasks,
      totalPayout,
      openTasks: openTasksCount,
      taskStatusChartData: chartData,
    },
  };
}

export async function getBrowseTasks({ search = "", category = "", page = 1, limit = 6 } = {}) {
  const client = await clientPromise;
  const authDb = client.db(authDbName);
  const appDb = client.db(appDbName);
  const tasksCollection = appDb.collection("tasks");

  const normalizedPage = normalizePage(page);
  const normalizedLimit = Number.parseInt(limit, 10) || 6;
  const trimmedSearch = search?.trim() || "";
  const trimmedCategory = category?.trim() || "";

  const query = {};

  if (trimmedCategory) {
    query.category = trimmedCategory;
  }

  if (trimmedSearch) {
    query.$or = [
      { title: { $regex: trimmedSearch, $options: "i" } },
      { description: { $regex: trimmedSearch, $options: "i" } },
      { category: { $regex: trimmedSearch, $options: "i" } },
    ];
  }

  const totalTasks = await tasksCollection.countDocuments(query);
  const totalPages = Math.max(1, Math.ceil(totalTasks / normalizedLimit));

  const tasks = await tasksCollection
    .find(query)
    .sort({ createdAt: -1, _id: -1 })
    .skip((normalizedPage - 1) * normalizedLimit)
    .limit(normalizedLimit)
    .toArray();

  const tasksWithClient = await attachClientInfo(tasks, authDb, appDb.collection("reviews"));
  const categories = (await tasksCollection.distinct("category")).filter(Boolean).sort();

  return {
    tasks: tasksWithClient,
    totalTasks,
    totalPages,
    currentPage: Math.min(normalizedPage, totalPages),
    categories,
  };
}

export async function getTaskById(taskId) {
  const client = await clientPromise;
  const authDb = client.db(authDbName);
  const appDb = client.db(appDbName);
  const usersCollection = authDb.collection("user");
  const tasksCollection = appDb.collection("tasks");

  let task = null;

  if (ObjectId.isValid(taskId)) {
    task = await tasksCollection.findOne({ _id: new ObjectId(taskId) });
  }

  if (!task) {
    task = await tasksCollection.findOne({ _id: taskId });
  }

  if (!task) {
    return null;
  }

  const clientUser = task.client_email
    ? await usersCollection.findOne({ email: task.client_email }, { projection: { email: 1, name: 1, image: 1 } })
    : null;

  return {
    ...task,
    client: clientUser || {
      name: task.client_email || "Unknown client",
      email: task.client_email || null,
    },
  };
}
