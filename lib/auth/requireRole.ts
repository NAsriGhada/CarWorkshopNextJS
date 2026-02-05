import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function requireRole(roles: string[]) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }),
    };
  }

  const payload = verifyToken(token);
  const role = payload.role;

  if (!roles.includes(role)) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }),
    };
  }

  return { ok: true as const, payload };
}
