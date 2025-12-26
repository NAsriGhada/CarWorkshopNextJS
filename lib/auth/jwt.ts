// lib/auth/jwt.ts
import jwt from "jsonwebtoken";
import type { Role } from "@/lib/models/users";


export interface AuthTokenPayload {
  sub: string; // userId (comes from `subject`)
  role: Role;
  username: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

// You can extend this later if you want extra fields
export function signToken(userId: string, role: Role, username: string) {
  return jwt.sign({ role, username }, JWT_SECRET, {
    subject: userId,
    expiresIn: JWT_EXPIRES_IN,
  });
}

function isAuthTokenPayload(payload: unknown): payload is AuthTokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "sub" in payload &&
    "role" in payload &&
    "username" in payload
  );
}

// ✅ typed verifyToken
export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!isAuthTokenPayload(decoded)) {
    throw new Error("Invalid token payload shape");
  }

  return decoded;
}
