// proxy.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("🔥 PROXY HIT", pathname);

  const token = req.cookies.get("token")?.value ?? null;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isDashboard = pathname.startsWith("/dashboard");
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
    const decoded = verifyToken(token) as any;
    const role = decoded.role as string | undefined;

    // Logged-in user on /login or /register → send to main dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin-only protection
    if (isAdminDashboard && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ❌ Block visitors from workshop
    if (isWorkshop && role === "visitor") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
