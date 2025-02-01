import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team from "@/models/Team";
import { MemberSchema } from "@/lib/validations/team";
import jwt from "jsonwebtoken";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(1, "Member name cannot be empty"),
  enrollmentNumber: z.string().min(5, "Enrollment number is required"),
  password: z.string().min(3, "Password must be at least 3 characters"),
  team_name: z.string().min(3, "Team name must be at least 3 characters"),
  additionalMembers: z
    .array(MemberSchema)
    .min(1, "A team must have at least 2 members")
    .max(4, "A team cannot have more than 5 members in total"),
});

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    
    // Validate input using Zod
    const parsedBody = SignupSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error.errors[0].message }, { status: 400 });
    }

    const { name, enrollmentNumber, password, team_name, additionalMembers } = parsedBody.data;

    // Check if team name already exists
    const existingTeam = await Team.findOne({ team_name });
    if (existingTeam) {
      return NextResponse.json({ error: "Team name already exists." }, { status: 400 });
    }

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
      "hehe",
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
