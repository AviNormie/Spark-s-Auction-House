import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";

// ✅ Extract the ID using NextRequest instead of relying on params
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // ✅ Correctly extract the "id" from the request URL
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
