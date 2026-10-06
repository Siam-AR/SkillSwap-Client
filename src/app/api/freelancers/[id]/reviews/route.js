import { NextResponse } from "next/server";

import { getAppDb } from "@/lib/server-db";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const db = await getAppDb();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");

    const reviewsCollection = db.collection("reviews");

    // Match reviews by email variations or ObjectId
    const query = {
      $or: [
        ...(emailParam
          ? [
            { email: emailParam },
            { freelancer_email: emailParam },
            { freelancerEmail: emailParam },
            { reviewee_email: emailParam },
            { revieweeEmail: emailParam }
          ]
          : []),
        ...(ObjectId.isValid(id)
          ? [{ freelancerId: new ObjectId(id) }, { reviewee_id: new ObjectId(id) }, { freelancerId: id }]
          : []),
        { email: id },
        { freelancer_email: id },
        { freelancerEmail: id },
      ],
    };

    const reviews = await reviewsCollection
      .find(query)
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();

    const normalizedReviews = reviews.map((r) => ({
      _id: r._id.toString(),
      rating: Number(r.rating) || 5,
      comment: r.comment || r.feedback || "",
      clientEmail: r.client_email || r.reviewer_email || r.clientEmail || r.email || "Verified Client",
      clientName: r.client_name || r.reviewer_name || r.clientName || "Client",
      createdAt: r.created_at || r.createdAt || new Date(),
    }));

    return NextResponse.json({ success: true, data: normalizedReviews });
  } catch (error) {
    console.error("Failed to fetch freelancer reviews:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
