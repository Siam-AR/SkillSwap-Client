import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

export async function POST(req, { params }) {
  try {
    const db = await getAppDb();
    const tasksCollection = db.collection("tasks");
    const usersCollection = db.collection("user");
    
    // Verify client authorization (using headers)
    const userEmail = req.headers.get("x-user-email")?.trim() || "";
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized: Missing user identity" }, { status: 401 });
    }

    const resolvedParams = params ? await params : {};
    const id = resolvedParams.id;
    if (!id) {
      return NextResponse.json({ success: false, message: "Task ID is required" }, { status: 400 });
    }

    const { rating, feedback } = await req.json().catch(() => ({}));
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: "Valid rating (1-5) is required" }, { status: 400 });
    }

    const taskIdFilter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
    const task = await tasksCollection.findOne(taskIdFilter);

    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

    // Verify ownership
    const taskClientEmail = task.clientEmail || task.client_email || task.client?.email;
    if (String(taskClientEmail).toLowerCase() !== String(userEmail).toLowerCase()) {
      return NextResponse.json({ success: false, message: "Unauthorized to review this task" }, { status: 403 });
    }

    if (task.status !== "completed") {
      return NextResponse.json({ success: false, message: "Task must be completed before submitting a review" }, { status: 400 });
    }

    if (task.review) {
      return NextResponse.json({ success: false, message: "This task has already been reviewed" }, { status: 400 });
    }

    // Update Task
    const reviewData = { rating: Number(rating), feedback: feedback || "", reviewedAt: new Date() };
    await tasksCollection.updateOne(
      { _id: task._id },
      { $set: { review: reviewData } }
    );

    // Update Freelancer Profile
    const freelancerFilter = {
      $or: [
        { email: task.freelancerEmail || task.freelancer_email },
        { _id: ObjectId.isValid(task.freelancerId) ? new ObjectId(task.freelancerId) : task.freelancerId }
      ].filter(Boolean)
    };
    
    const freelancer = await usersCollection.findOne(freelancerFilter);
    if (freelancer) {
      const newTotalPoints = (freelancer.totalRatingPoints || 0) + Number(rating);
      const newCount = (freelancer.reviewCount || freelancer.reviewsCount || 0) + 1;
      const newAverage = Number((newTotalPoints / newCount).toFixed(1));

      await usersCollection.updateOne(
        { _id: freelancer._id },
        {
          $set: { 
            totalRatingPoints: newTotalPoints,
            reviewCount: newCount,
            rating: newAverage
          }
        }
      );
    }

    return NextResponse.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
