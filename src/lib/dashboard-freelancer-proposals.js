import { ObjectId } from "mongodb";
import { getAppDb } from "@/lib/server-db";

const normalizeId = (value) => {
  if (!value && value !== 0) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    if (typeof value.toHexString === "function") {
      return value.toHexString();
    }

    if (typeof value.toString === "function") {
      return value.toString().trim();
    }
  }

  return String(value).trim();
};

const normalizeDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
};

export async function getFreelancerProposals(freelancerEmail) {
  const db = await getAppDb();
  const proposalsCollection = db.collection("proposals");
  const tasksCollection = db.collection("tasks");

  const normalizedEmail = String(freelancerEmail || "").trim().toLowerCase();
  const filter = normalizedEmail
    ? {
        $or: [
          { freelancerEmail: normalizedEmail },
          { freelancer_email: normalizedEmail },
          { freelancerEmail: freelancerEmail },
          { freelancer_email: freelancerEmail },
          { freelancerId: freelancerEmail },
          { freelancer_id: freelancerEmail },
        ],
      }
    : {};

  const proposals = await proposalsCollection
    .find(filter)
    .sort({ createdAt: -1, submitted_at: -1 })
    .toArray();

  const taskIds = proposals
    .map((proposal) => normalizeId(proposal.taskId || proposal.task_id || proposal.task || ""))
    .filter(Boolean);

  const uniqueTaskIds = [...new Set(taskIds)];
  const objectIds = uniqueTaskIds
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const taskQuery = [];
  if (objectIds.length) {
    taskQuery.push({ _id: { $in: objectIds } });
  }

  if (uniqueTaskIds.length) {
    taskQuery.push({ id: { $in: uniqueTaskIds } });
  }

  const taskDocs = taskQuery.length
    ? await tasksCollection.find({ $or: taskQuery }).project({ _id: 1, id: 1, title: 1, category: 1, clientEmail: 1, client_email: 1, budget: 1, price: 1 }).toArray()
    : [];

  const taskDetailsById = new Map();
  taskDocs.forEach((task) => {
    const key = normalizeId(task._id) || normalizeId(task.id);
    taskDetailsById.set(key, task);
  });

  return proposals.map((proposal) => {
    const taskKey = normalizeId(proposal.taskId || proposal.task_id || proposal.task || "");
    const submittedAt = normalizeDateValue(proposal.createdAt ?? proposal.submitted_at);
    const taskInfo = taskDetailsById.get(taskKey) || {};

    return {
      id: normalizeId(proposal._id),
      taskId: taskKey,
      taskTitle: taskInfo.title || proposal.task_title || proposal.taskTitle || "Unknown task",
      taskCategory: taskInfo.category || "General",
      clientEmail: taskInfo.clientEmail || taskInfo.client_email || proposal.clientEmail || "Unknown client",
      taskBudget: Number(taskInfo.budget ?? taskInfo.price ?? 0),
      proposedBudget: Number(proposal.expectedAmount ?? proposal.proposed_budget ?? proposal.proposedBudget ?? proposal.budget ?? 0),
      coverLetter: proposal.cover_note || proposal.coverLetter || proposal.message || proposal.proposal || proposal.description || "",
      submittedAt,
      status: String(proposal.status || "pending").toLowerCase(),
    };
  });
}
