import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { team_name, password } = await req.json();

    if (!team_name || !password) {
      return NextResponse.json({ error: "Team name and password are required." }, { status: 400 });
    }

    // Find team and select password for verification
    const team = await Team.findOne({ team_name }).select("+password");
    if (!team) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check password
    const isMatch = await team.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ team_id: team.team_id, team_name: team.team_name }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed." }, { status: 500 });
  }
}
