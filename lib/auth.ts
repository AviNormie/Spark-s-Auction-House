import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  team_id: number;
  team_name: string;
  enrollmentNumber: string;
}

export function verifyToken(req: NextRequest): DecodedToken {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token structure.");
    }

    // Ensure decoded contains the expected properties
    if (!("team_id" in decoded) || !("team_name" in decoded) || !("enrollmentNumber" in decoded)) {
      throw new Error("Invalid token data.");
    }

    return decoded as DecodedToken;
  } catch (error: any) {
    throw new Error("Unauthorized: Invalid or expired token.");
  }
}
