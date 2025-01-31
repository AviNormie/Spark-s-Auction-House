import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Team, { ITeam } from "@/models/Team";
import { z } from "zod";
import { verifyToken } from "@/lib/auth";

const AddMemberSchema = z.object({
  name: z.string().min(1, "Member name cannot be empty"),
  enrollmentNumber: z.string().min(5, "Enrollment number is required"),
});

export async function PUT(req: NextRequest) {
  await connectToDatabase();

  try {
    // Verify JWT token
    const decoded = verifyToken(req);

    const body = await req.json();
    const parsedBody = AddMemberSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error.errors[0].message }, { status: 400 });
    }

    const { name, enrollmentNumber } = parsedBody.data;

    // Find the team of the requester
    const team: ITeam | null = await Team.findOne({ team_id: decoded.team_id });

    if (!team) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    // Check if the team is already full (max 5 members)
    if (team.members.length >= 5) {
      return NextResponse.json({ error: "Team is already full (max 5 members)." }, { status: 400 });
    }

    // Check if the enrollment number is already in another team
    const existingUser = await Team.findOne({ "members.enrollmentNumber": enrollmentNumber });

    if (existingUser) {
      return NextResponse.json({ error: "Enrollment number already used in another team." }, { status: 400 });
    }

    // Add the new member
    team.members.push({ name, enrollmentNumber });
    await team.save();

    return NextResponse.json({ message: "Member added successfully", team }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add member." },
      { status: 400 }
    );
  }
}
