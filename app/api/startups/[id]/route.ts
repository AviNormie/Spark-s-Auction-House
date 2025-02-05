import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";

// Handle GET Request (already defined)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, error: "Invalid startup ID" }, { status: 400 });
    }

    const startup = await Startup.findById(id);
    if (!startup) {
      return NextResponse.json({ success: false, error: "Startup not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, startup }, { status: 200 });
  } catch (error) {
    console.error("GET /api/startups/[id] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch startup" }, { status: 500 });
  }
}

// Handle POST request to toggle bid session
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, error: "Invalid startup ID" }, { status: 400 });
    }
    const startup = await Startup.findByIdAndUpdate(
      id,
      { bid_session: true },
      { new: true }
    );
    if (!startup) {
      return NextResponse.json({ success: false, error: "Startup not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Bid session started", startup }, { status: 200 });
  } catch (error) {
    console.error("POST /api/startups/[id] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to start bid session" }, { status: 500 });
  }
}
