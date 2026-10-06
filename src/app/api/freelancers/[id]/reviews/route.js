import { NextResponse } from "next/server";
import clientPromise from "@/lib/server-db";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const emailQuery = searchParams.get("email");

    const appDbName = process.env.APP_DB_NAME || process.env.AUTH_DB_NAME || "skill-swap";
    const db = client.db(appDbName);
    const reviewsCollection = db.collection("reviews");

    // Match by email or ObjectId across standard schema variations
    const query = {
      $or: [
        ...(emailQuery ? [
          { email: emailQuery },
          { freelancer_email: emailQuery },
          { freelancerEmail: emailQuery },
          { reviewee_email: emailQuery },
          { revieweeEmail: emailQuery }
        ] : []),
        ...(ObjectId.isValid(id) ? [
          { freelancerId: new ObjectId(id) },
          { reviewee_id: new ObjectId(id) },
          { freelancerId: id }
        ] : []),
        { email: id },
        { freelancer_email: id },
        { freelancerEmail: id },
      ],
    };

    const reviews = await reviewsCollection
      .find(query)
      .sort({ created_at: -1, createdAt: -1 })
      .toArray();

    // Normalize keys for the frontend
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
    console.error("Reviews API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
