import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import { TeamSchema } from "@/lib/validations/team";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    await connectToDatabase();
  
    try {
      const body = await req.json();
      const { name, enrollmentNumber, password, team_name, additionalMembers } = body;
  
      // Validate input
      if (!name || !enrollmentNumber || !password || !team_name || !Array.isArray(additionalMembers)) {
        return NextResponse.json({ error: "Invalid input. All fields are required." }, { status: 400 });
      }
  
      // Ensure at least 1 additional member and max 4 additional members (total 5)
      if (additionalMembers.length < 1 || additionalMembers.length > 4) {
        return NextResponse.json({ error: "A team must have at least 2 members and at most 5 members." }, { status: 400 });
      }
  
      const existingTeam = await Team.findOne({ team_name });
      const existingUser = await Team.findOne({ "members.enrollmentNumber": enrollmentNumber });
  
      if (existingTeam) {
        return NextResponse.json({ error: "Team name already exists." }, { status: 400 });
      }
      // removing the existing user check so that a user can join multiple teams
    //   if (existingUser) {
    //     return NextResponse.json({ error: "Enrollment number already used." }, { status: 400 });
    //   }
  
      // Generate unique team_id
      const lastTeam = await Team.findOne().sort("-team_id");
      const team_id = lastTeam ? lastTeam.team_id + 1 : 1;
  
      // Create team with creator + additional members
      const members = [{ name, enrollmentNumber }, ...additionalMembers];
  
      const newTeam = await Team.create({
        team_id,
        team_name,
        password,
        members,
        credits: 5000,
        purchased_startups: [],
      });
  
      // Generate JWT token
      const token = jwt.sign(
        { team_id: newTeam.team_id, team_name: newTeam.team_name, enrollmentNumber },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
  
      return NextResponse.json({ team: newTeam, token }, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to create team." },
        { status: 400 }
      );
    }
  }
  
