import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

export async function POST(req, { params }) {
  try {
    const db = await getAppDb();
    const tasksCollection = db.collection("tasks");
    const usersCollection = db.collection("users");
    const transactionsCollection = db.collection("transactions");
    
    // Verify client authorization (using headers)
    const userEmail = req.headers.get("x-user-email")?.trim() || "";
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized: Missing user identity" }, { status: 401 });
    }

    const resolvedParams = params ? await params : {};
    const body = await req.json().catch(() => ({}));
    
    const id = resolvedParams?.id || body?.taskId || body?.id;
    if (!id) {
      return NextResponse.json({ success: false, message: "Task ID is required" }, { status: 400 });
    }

    const taskIdFilter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const task = await tasksCollection.findOne(taskIdFilter);

    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    // Verify ownership
    const taskClientEmail = task.clientEmail || task.client_email || task.client?.email;
    if (String(taskClientEmail).toLowerCase() !== String(userEmail).toLowerCase()) {
      return NextResponse.json({ success: false, message: "Unauthorized to release payment for this task" }, { status: 403 });
    }

    if (task.status !== "under_review") {
      return NextResponse.json({ success: false, message: "Task deliverable is not pending review" }, { status: 400 });
    }

    const budget = Number(task.budget || task.proposedBudget || 0);

    // 1. Mark task completed
    await tasksCollection.updateOne(
      { _id: task._id },
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    // 2. Transfer funds to freelancer earnings / available balance
    // Wait, let's find the freelancer
    const freelancerFilter = {
      $or: [
        { email: task.freelancerEmail || task.freelancer_email },
        { _id: ObjectId.isValid(task.freelancerId) ? new ObjectId(task.freelancerId) : task.freelancerId }
      ].filter(Boolean)
    };
    
    const freelancer = await usersCollection.findOne(freelancerFilter);
    if (freelancer) {
      await usersCollection.updateOne(
        { _id: freelancer._id },
        {
          $inc: { 
            totalEarnings: budget,
            availableBalance: budget,
            completedTasks: 1 
          }
        }
      );
    }

    // 3. Record official cleared transaction / payment receipt
    await transactionsCollection.insertOne({
      taskId: String(task._id),
      taskTitle: task.title,
      clientId: String(task.clientId || taskClientEmail),
      freelancerId: String(freelancer?._id || task.freelancerEmail),
      amount: budget,
      status: "completed",
      type: "milestone_release",
      releasedAt: new Date()
    });

    return NextResponse.json({ success: true, message: "Funds released to freelancer successfully" });
  } catch (error) {
    console.error("Error releasing payment:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
