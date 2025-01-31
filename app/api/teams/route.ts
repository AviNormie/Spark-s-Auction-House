import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import { TeamSchema } from "@/lib/validations/team";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  
  try {
    const body = await req.json();
    const parsedBody = TeamSchema.parse(body);

    const lastTeam = await Team.findOne().sort("-team_id");
    const team_id = lastTeam ? lastTeam.team_id + 1 : 1;
    
    const newTeam = await Team.create({ ...parsedBody, team_id });
    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create team." }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  
  try {
    const body = await req.json();
    const parsedBody = TeamSchema.partial().parse(body);

    if (!parsedBody.team_id) {
      return NextResponse.json({ error: "Team ID is required." }, { status: 400 });
    }

    const updatedTeam = await Team.findOneAndUpdate(
      { team_id: parsedBody.team_id },
      parsedBody,
      { new: true }
    );

    if (!updatedTeam) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }
    
    return NextResponse.json(updatedTeam);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update team." }, { status: 400 });
  }
}
