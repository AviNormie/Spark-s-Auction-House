// api/startups/[id]/bid.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";
import Team from "@/models/Team";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const { teamId, bidAmount } = await req.json();

    if (!teamId || !bidAmount || typeof bidAmount !== "number") {
      return NextResponse.json({ success: false, error: "Invalid bid data" }, { status: 400 });
    }

    const startup = await Startup.findById(params.id);
    const team = await Team.findById(teamId);

    if (!startup || !team) {
      return NextResponse.json({ success: false, error: "Startup or Team not found" }, { status: 404 });
    }

    // Check if team has enough credits
    if (team.credits < bidAmount) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 });
    }

    // Update startup with new bid amount
    startup.currentBidAmount = bidAmount;
    if (bidAmount > startup.highest_bid) {
      startup.highest_bid = bidAmount;
    }

    // Update team credits and add startup to purchased startups
    team.credits -= bidAmount;
    team.purchased_startups.push(startup._id);

    await startup.save();
    await team.save();

    return NextResponse.json({ success: true, message: "Bid placed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error processing bid" }, { status: 500 });
  }
}
