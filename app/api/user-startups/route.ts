import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch only startups where bid_session is true
    const startups = await Startup.find({ bid_session: true }).select(
      "startup_id name description valuation highest_bid owner_team currentBidAmount industry problem_it_solves businessModel bid_session funding_companies"
    );

    return NextResponse.json({ success: true, startups }, { status: 200 });
  } catch (error) {
    console.error("GET /api/startups Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch startups" },
      { status: 500 }
    );
  }
}
