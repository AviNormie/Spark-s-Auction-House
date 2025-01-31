import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const teams = await Team.find({}, { _id: 1, team_name: 1, credits: 1 }); // Select only necessary fields
    return NextResponse.json({ success: true, teams });
  } catch (error) {            
    return NextResponse.json({ success: false, error: "Failed to fetch teams" });
  }
}
