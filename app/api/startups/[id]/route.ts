import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Startup from "@/models/Startup";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    if (!params.id || params.id.length !== 24) {
      return NextResponse.json({ success: false, error: "Invalid startup ID" }, { status: 400 });
    }

    const startup = await Startup.findById(params.id);
    if (!startup) {
      return NextResponse.json({ success: false, error: "Startup not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, startup }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch startup" }, { status: 500 });
  }
}
