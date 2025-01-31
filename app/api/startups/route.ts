import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";
import Counter from "@/models/Counter";
import { StartupSchema } from "@/lib/validations/startup";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    const startups = await Startup.find();
    return NextResponse.json({ success: true, startups }, { status: 200 });
  } catch (error) {
    console.error("GET /api/startups Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch startups" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json().catch(() => {
      throw new Error("Invalid JSON format");
    });

    const { startup_id, ...dataWithoutId } = body;
    
    const validationResult = StartupSchema.safeParse(dataWithoutId);
    if (!validationResult.success) {
      return NextResponse.json({ success: false, error: validationResult.error.errors }, { status: 400 });
    }

    const counter = await Counter.findByIdAndUpdate(
      { _id: "startup_id" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const newStartup = new Startup({
      ...validationResult.data,
      startup_id: counter.seq, 
    });

    await newStartup.save();

    return NextResponse.json({ success: true, startup: newStartup }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/startups Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to add startup" }, { status: 500 });
  }
}
