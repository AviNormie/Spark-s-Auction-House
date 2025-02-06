import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";

export async function GET() {
  await connectToDatabase();

  try {
    const teams = await Team.find(
      {},
      { _id: 1, team_name: 1, credits: 1, team_id: 1 }
    ); // Select only necessary fields
    return NextResponse.json({ success: true, teams });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch teams",
    });
  }
}
