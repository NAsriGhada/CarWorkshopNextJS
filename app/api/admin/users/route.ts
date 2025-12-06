// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/users";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const decoded = verifyToken(token) as any;
  if (decoded.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return decoded;
}

export async function GET(req: Request) {
  try {
    // 🔐 Auth first (no need to touch DB if not admin)
    await requireAdmin();
    await connectDB();

    // 🔢 Read pagination query params
    const { searchParams } = new URL(req.url);
    let page = Number(searchParams.get("page") ?? "1");
    let pageSize = Number(searchParams.get("pageSize") ?? "10");

    // basic validation / sane defaults
    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 50) {
      pageSize = 10;
    }

    const query = {}; // later you can add filters/search here

    const [users, total] = await Promise.all([
      User.find(query)
        .select("username email roles createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages =
      total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

    const payload = users.map((u: any) => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email,
      roles: u.roles,
      createdAt: u.createdAt, // stays as before (Date → JSON)
    }));

    return NextResponse.json({
      users: payload,
      page,
      pageSize,
      total,
      totalPages,
    });
  } catch (err: any) {
    console.error("ADMIN USERS GET ERROR:", err);

    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
