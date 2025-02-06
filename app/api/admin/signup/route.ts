import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ success: false, error: "Admin already exists" }, { status: 400 });
    }

    // Create and save new admin
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    return NextResponse.json({ success: true, message: "Admin registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ success: false, error: "Failed to register admin" }, { status: 500 });
  }
}
