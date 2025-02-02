import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import { verifyAuth } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const decodedToken = verifyAuth(req);
  if (!decodedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const team = await Team.findOne({ team_id: decodedToken.team_id }).select("-password");
    
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch team data." },
      { status: 500 }
    );
  }
}
