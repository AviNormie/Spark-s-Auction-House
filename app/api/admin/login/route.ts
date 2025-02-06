import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, error: "Failed to log in" }, { status: 500 });
  }
}
