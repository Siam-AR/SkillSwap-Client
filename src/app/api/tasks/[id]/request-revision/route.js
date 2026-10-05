import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

export async function POST(req, { params }) {
  try {
    const db = await getAppDb();
    const tasksCollection = db.collection("tasks");
    
    // Verify client authorization (using headers)
    const userEmail = req.headers.get("x-user-email")?.trim() || "";
    if (!userEmail) {
      return NextResponse.json({ success: false, message: "Unauthorized: Missing user identity" }, { status: 401 });
    }

    const { id } = params;
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
      return NextResponse.json({ success: false, message: "Unauthorized to request revision for this task" }, { status: 403 });
    }

    if (task.status !== "under_review") {
      return NextResponse.json({ success: false, message: "Task deliverable is not pending review" }, { status: 400 });
    }

    const body = await req.json();

    await tasksCollection.updateOne(
      { _id: task._id },
      {
        $set: {
          status: "revision_requested",
          clientRevisionNotes: body.notes || "",
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true, message: "Revision requested successfully" });
  } catch (error) {
    console.error("Error requesting revision:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
