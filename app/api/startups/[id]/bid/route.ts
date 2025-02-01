import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";
import Team from "@/models/Team";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Extract the 'id' param from the URL
    const id = req.nextUrl.pathname.split("/").pop(); // Correctly extracts `id`

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing startup ID" }, { status: 400 });
    }

    const { teamId, bidAmount } = await req.json();

    if (!teamId || !bidAmount || typeof bidAmount !== "number") {
      return NextResponse.json({ success: false, error: "Invalid bid data" }, { status: 400 });
    }

    const startup = await Startup.findById(id);
    const team = await Team.findById(teamId);

    if (!startup || !team) {
      return NextResponse.json({ success: false, error: "Startup or Team not found" }, { status: 404 });
    }

    if (team.credits < bidAmount) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 });
    }

    startup.currentBidAmount = bidAmount;
    if (bidAmount > startup.highest_bid) {
      startup.highest_bid = bidAmount;
    }

    team.credits -= bidAmount;
    team.purchased_startups.push(startup._id);

    await startup.save();
    await team.save();

    return NextResponse.json({ success: true, message: "Bid placed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Bid Processing Error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Error processing bid" }, { status: 500 });
  }
}
