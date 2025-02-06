import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";
import Team from "@/models/Team";
import mongoose from "mongoose";

// GET: Fetch startup by ID
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const startupId = req.nextUrl.pathname.split("/").at(-2);
    if (!startupId || !mongoose.Types.ObjectId.isValid(startupId)) {
      return NextResponse.json({ success: false, error: "Invalid startup ID" }, { status: 400 });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return NextResponse.json({ success: false, error: "Startup not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, startup }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch startup" }, { status: 500 });
  }
}

// POST: Place a bid on a startup
export async function POST(req: NextRequest) {
  try {
    const { teamId, bidAmount } = await req.json();

    const startupId = req.nextUrl.pathname.split("/").at(-2);
    if (!startupId || !teamId || !bidAmount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(startupId) || !mongoose.Types.ObjectId.isValid(teamId)) {
      return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
    }

    await connectToDatabase();

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return NextResponse.json({ success: false, error: "Startup not found" }, { status: 404 });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    if (team.credits < bidAmount) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 400 });
    }

    // Log the initial data before the update
    // console.log("Before Bid:");
    // console.log("Team Credits:", team.credits);
    // console.log("Startup Current Bid:", startup.currentBidAmount);
    // console.log("Team Purchased Startups:", team.purchased_startups);

    // Update the startup's owner_team and bid information
    startup.owner_team = team._id;
    startup.highest_bid = Math.max(startup.highest_bid || 0, bidAmount);
    startup.currentBidAmount = bidAmount;

    // Save the startup changes
    await startup.save();

    // Deduct credits from the team
    team.credits -= bidAmount;

    // Add the startup to the team's purchased_startups array
    team.purchased_startups.push(startup._id);

    // Save the team changes
    await team.save();

    return NextResponse.json({ success: true, message: "Bid placed successfully" }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to place bid" }, { status: 500 });
  }
}
