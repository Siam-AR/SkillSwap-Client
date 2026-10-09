import { NextResponse } from "next/server";
import { getAuthDb } from "@/lib/server-auth-db";
import { getServerSession } from "@/lib/session";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const resolveUserIdentity = async (request) => {
  const session = await getServerSession().catch(() => null);
  const sessionEmail = session?.user?.email?.trim();
  const sessionRole = String(session?.user?.role || "").toLowerCase();

  const headerEmail = request.headers.get("x-user-email")?.trim();
  const headerRole = request.headers.get("x-user-role")?.trim()?.toLowerCase() || "";

  return {
    email: normalizeEmail(sessionEmail || headerEmail || ""),
    role: sessionRole || headerRole,
  };
};

export async function GET(request) {
  try {
    const { email: userEmail } = await resolveUserIdentity(request);

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity" }, { status: 401 });
    }

    const db = await getAuthDb();
    const usersCollection = db.collection("user");
    const user = await usersCollection.findOne({ email: normalizeEmail(userEmail) }, { projection: { password: 0 } });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (String(user.role || "").toLowerCase() === "client") {
      const appDbName = process.env.APP_DB_NAME || process.env.AUTH_DB_NAME || "taskify";
      // Ensure we get the appDb if it's different. In most cases db.client is available.
      const appDb = db.client ? db.client.db(appDbName) : db;
      
      const tasksCollection = appDb.collection("tasks");
      const paymentsCollection = appDb.collection("payments");

      const postedTasks = await tasksCollection.find({ 
        $or: [
          { client_email: user.email },
          { clientEmail: user.email }
        ]
      }).sort({ createdAt: -1 }).toArray();
      
      const activeTasksCount = postedTasks.filter(t => t.status === "in progress" || t.status === "open").length;

      const payoutAggregation = await paymentsCollection
        .aggregate([
          { $match: { 
              $or: [{ client_email: user.email }, { clientEmail: user.email }], 
              payment_status: { $in: ["complete", "completed", "paid"] } 
          } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
        .toArray();

      user.postedTasksCount = postedTasks.length;
      user.activeTasksCount = activeTasksCount;
      user.postedTasks = postedTasks.slice(0, 10);
      user.totalSpent = payoutAggregation.length ? payoutAggregation[0].total : 0;
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { email: userEmail, role: userRole } = await resolveUserIdentity(request);

    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Missing user identity" }, { status: 401 });
    }

    if (userRole && userRole !== "freelancer" && userRole !== "client") {
      return NextResponse.json({ success: false, message: "Invalid user role" }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const image = String(body.image || "").trim();
    const designation = String(body.designation || "").trim();
    const skills = Array.isArray(body.skills) ? body.skills.map((skill) => String(skill || "").trim()).filter(Boolean) : [];
    const bio = String(body.bio || "").trim();
    const location = String(body.location || "").trim();
    const hourlyRate = Number(body.hourlyRate ?? body.hourly_rate ?? body.hourlyRateUSD ?? 0);
    let status = String(body.status || "").trim().toLowerCase();
    if (!["available", "busy", "unavailable"].includes(status)) {
      status = "available";
    }

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    if (userRole === "freelancer" && hourlyRate < 0) {
      return NextResponse.json({ success: false, message: "Hourly rate must be a positive number" }, { status: 400 });
    }

    const db = await getAuthDb();
    const usersCollection = db.collection("user");
    const normalizedEmail = normalizeEmail(userEmail);

    const setPayload = {
      name,
      image,
      bio,
      location,
      updatedAt: new Date(),
    };

    if (userRole === "freelancer") {
      setPayload.designation = designation;
      setPayload.skills = skills;
      setPayload.hourlyRate = hourlyRate;
      setPayload.status = status;
    }

    const updateResult = await usersCollection.updateOne(
      { email: normalizedEmail },
      { $set: setPayload }
    );

    if (!updateResult.matchedCount) {
      return NextResponse.json({ success: false, message: "Profile update failed" }, { status: 500 });
    }

    const updatedUser = await usersCollection.findOne({ email: normalizedEmail }, { projection: { password: 0 } });
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || "Failed to update profile" }, { status: 500 });
  }
}
