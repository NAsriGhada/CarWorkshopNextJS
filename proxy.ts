// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin",
  advisor: "/dashboard/advisor",
  agent: "/dashboard/agent",
  technician: "/dashboard/technician",
  stock: "/dashboard/stock",
  visitor: "/dashboard/visitor",
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("🔥 PROXY HIT", pathname);

  const token = req.cookies.get("token")?.value ?? null;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isDashboard = pathname.startsWith("/dashboard");
  const isDashboardRoot = pathname === "/dashboard";
  const isAdminDashboard = pathname.startsWith("/admin");
  const isWorkshop = pathname.startsWith("/dashboard/workshop");

  // ========== NO TOKEN ==========
  if (!token) {
    if (isDashboard || isAdminDashboard) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ========== HAS TOKEN ==========
  try {
    const decoded = verifyToken(token) as { role?: string };
    const rawRole = decoded.role ?? "visitor";

    // normalize role (in case of "Technician" etc.)
    const role = String(rawRole).toLowerCase();

    // Logged-in user on /login or /register → send to their home
    if (isAuthPage) {
      const dest = ROLE_HOME[role] ?? ROLE_HOME.visitor;
      return NextResponse.redirect(new URL(dest, req.url));
    }

    // ✅ If user visits /dashboard (root) redirect by role
    if (isDashboardRoot) {
      const dest = ROLE_HOME[role] ?? ROLE_HOME.visitor;
      return NextResponse.redirect(new URL(dest, req.url));
    }

    // Admin-only protection
    if (isAdminDashboard && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ❌ Block visitors from workshop
    if (isWorkshop && role === "visitor") {
      return NextResponse.redirect(new URL(ROLE_HOME.visitor, req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("PROXY JWT ERROR:", err);

    if (isDashboard || isAdminDashboard) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

// ✅ matcher is allowed in proxy.ts
export const config = {
  matcher: [
    "/dashboard/:path*", // all dashboards
    "/admin/:path*", // admin area
    "/login",
    "/register",
  ],
};
