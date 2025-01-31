import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import { TeamSchema } from "@/lib/validations/team";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const parsedBody = TeamSchema.parse(body);

    // Checking if team already exists
    const existingTeam = await Team.findOne({ team_name: parsedBody.team_name });
    if (existingTeam) {
      return NextResponse.json({ error: "Team name already exists." }, { status: 400 });
    }

    // Generate unique team_id
    const lastTeam = await Team.findOne().sort("-team_id");
    const team_id = lastTeam ? lastTeam.team_id + 1 : 1;

    const newTeam = await Team.create({ ...parsedBody, team_id });

    // Generating JWT token
    const token = jwt.sign({ team_id: newTeam.team_id, team_name: newTeam.team_name }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return NextResponse.json({ team: newTeam, token }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create team." }, { status: 400 });
  }
}
