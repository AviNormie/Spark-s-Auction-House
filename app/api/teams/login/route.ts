import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { enrollmentNumber, password } = await req.json();

    if (!enrollmentNumber || !password) {
      return NextResponse.json({ error: "Enrollment number and password are required." }, { status: 400 });
    }

    // Find the user in any team
    const team = await Team.findOne({ "members.enrollmentNumber": enrollmentNumber }).select("+password");

    if (!team) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Find the specific member in the team
    interface Member {
        enrollmentNumber: string;
        password?: string;
    }

    const member: Member | undefined = team.members.find((m: Member) => m.enrollmentNumber === enrollmentNumber);
    if (!member) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { team_id: team.team_id, team_name: team.team_name, enrollmentNumber },
      "hehe",
      { expiresIn: "7d" }
    );

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to login." },
      { status: 400 }
    );
  }
}
