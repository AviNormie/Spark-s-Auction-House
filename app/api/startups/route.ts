import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";
import Counter from "@/models/Counter";
import { StartupSchema } from "@/lib/validations/startup";
import { adminAuth } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await adminAuth(req); // This will throw an error if unauthorized

    await connectToDatabase();
    const startups = await Startup.find().select("startup_id name description valuation highest_bid owner_team currentBidAmount industry problem_it_solves businessModel bid_session funding_companies");

    return NextResponse.json({ success: true, startups }, { status: 200 });
  } catch (error) {
    console.error("GET /api/startups Error:", error);
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await adminAuth(req); // This will throw an error if unauthorized

    await connectToDatabase();
    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  } catch (error) {
    console.error("POST /api/startups Error:", error);
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}
