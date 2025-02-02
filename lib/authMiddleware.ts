import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "hehe"; // Use an env variable in production

export function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    return jwt.verify(token, SECRET_KEY) as { team_id: number; team_name: string; enrollmentNumber: string };
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
