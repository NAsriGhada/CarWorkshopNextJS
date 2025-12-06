// app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/mongodb";
import User, { ROLES } from "@/lib/models/users";

// Small helper to ensure the caller is an admin
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const decoded = verifyToken(token) as any;

  if (!decoded || decoded.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return decoded; // has sub (user id), role, username…
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // ⬅ note: params is a Promise
) {
  try {
    const { id } = await ctx.params; // ⬅ unwrap the Promise

    const admin = await requireAdmin();
    await connectDB();

    const body = await req.json();
    const rolesFromBody = (body.roles ?? []) as string[];

    const validRoles = rolesFromBody.filter((r) => ROLES.includes(r as any));

    if (!validRoles.length) {
      return NextResponse.json(
        { error: "At least one valid role is required" },
        { status: 400 }
      );
    }

    // Optional: prevent removing your own admin role
    if (id === admin.sub && !validRoles.includes("admin")) {
      return NextResponse.json(
        { error: "You cannot remove your own admin role" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { roles: validRoles },
      { new: true }
    ).select("username email roles createdAt");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Role(s) updated",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PATCH /api/admin/users/[id] error:", err);

    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
