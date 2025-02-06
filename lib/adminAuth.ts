import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";

export async function adminAuth(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    await connectToDatabase();
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      throw new Error("Unauthorized");
    }

    return admin; // Return admin if authenticated
  } catch (error) {
    throw new Error("Unauthorized");
  }
}
