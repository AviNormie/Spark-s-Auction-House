import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const teamCount = await Team.countDocuments();
    const memberCount = await Team.aggregate([{ $unwind: "$members" }, { $count: "totalMembers" }]);

    return NextResponse.json({
      totalTeams: teamCount,
      totalMembers: memberCount.length > 0 ? memberCount[0].totalMembers : 0,
    });
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
