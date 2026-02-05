// // proxy.ts
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth/jwt";

// const ROLE_HOME: Record<string, string> = {
//   admin: "/admin",
//   advisor: "/dashboard/advisor",
//   agent: "/dashboard/agent",
//   technician: "/dashboard/technician",
//   stock: "/dashboard/stock",
//   visitor: "/dashboard/visitor",
// };

// export function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   console.log("🔥 PROXY HIT", pathname);

//   const token = req.cookies.get("token")?.value ?? null;

//   const isAuthPage =
//     pathname.startsWith("/login") || pathname.startsWith("/register");

//   const isDashboard = pathname.startsWith("/dashboard");
//   const isDashboardRoot = pathname === "/dashboard";
//   const isAdminDashboard = pathname.startsWith("/admin");
//   const isWorkshop = pathname.startsWith("/dashboard/workshop");

//   // ========== NO TOKEN ==========
//   if (!token) {
//     if (isDashboard || isAdminDashboard) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("from", pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//     return NextResponse.next();
//   }

//   // ========== HAS TOKEN ==========
//   try {
//     const decoded = verifyToken(token) as { role?: string };
//     const rawRole = decoded.role ?? "visitor";

//     // normalize role (in case of "Technician" etc.)
//     const role = String(rawRole).toLowerCase();

//     // Logged-in user on /login or /register → send to their home
//     if (isAuthPage) {
//       const dest = ROLE_HOME[role] ?? ROLE_HOME.visitor;
//       return NextResponse.redirect(new URL(dest, req.url));
//     }

//     // ✅ If user visits /dashboard (root) redirect by role
//     if (isDashboardRoot) {
//       const dest = ROLE_HOME[role] ?? ROLE_HOME.visitor;
//       return NextResponse.redirect(new URL(dest, req.url));
//     }

//     // Admin-only protection
//     if (isAdminDashboard && role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     // ❌ Block visitors from workshop
//     if (isWorkshop && role === "visitor") {
//       return NextResponse.redirect(new URL(ROLE_HOME.visitor, req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("PROXY JWT ERROR:", err);

//     if (isDashboard || isAdminDashboard) {
//       const loginUrl = new URL("/login", req.url);
//       loginUrl.searchParams.set("from", pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     return NextResponse.next();
//   }
// }

// // ✅ matcher is allowed in proxy.ts
// export const config = {
//   matcher: [
//     "/dashboard/:path*", // all dashboards
//     "/admin/:path*", // admin area
//     "/login",
//     "/register",
//   ],
// };


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

type Role = keyof typeof ROLE_HOME;

// Role-based access for dashboard sections
const DASHBOARD_RULES: Array<{ prefix: string; allow: Role[] }> = [
  { prefix: "/dashboard/advisor", allow: ["advisor", "admin"] },
  { prefix: "/dashboard/technician", allow: ["technician", "admin"] },
  { prefix: "/dashboard/stock", allow: ["stock", "admin"] },
  { prefix: "/dashboard/agent", allow: ["agent", "admin"] },
  { prefix: "/dashboard/visitor", allow: ["visitor", "admin"] },
];

function redirectToLogin(req: NextRequest, pathname: string) {
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);

  const res = NextResponse.redirect(loginUrl);
  // optional hardening: wipe bad/expired token so it doesn't loop
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value ?? null;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isDashboard = pathname.startsWith("/dashboard");
  const isDashboardRoot = pathname === "/dashboard";
  const isAdminArea = pathname.startsWith("/admin");

  // ========== NO TOKEN ==========
  if (!token) {
    // protect dashboards + admin
    if (isDashboard || isAdminArea) return redirectToLogin(req, pathname);
    return NextResponse.next();
  }

  // ========== HAS TOKEN ==========
  try {
    const decoded = verifyToken(token) as { role?: string };
    const role = (String(decoded.role ?? "visitor").toLowerCase() ||
      "visitor") as Role;

    const home = ROLE_HOME[role] ?? ROLE_HOME.visitor;

    // Logged-in user on /login or /register → send to their home
    if (isAuthPage) return NextResponse.redirect(new URL(home, req.url));

    // /dashboard root → redirect by role
    if (isDashboardRoot) return NextResponse.redirect(new URL(home, req.url));

    // Admin-only protection
    if (isAdminArea && role !== "admin") {
      return NextResponse.redirect(new URL(home, req.url));
    }

    // ✅ Role-based dashboard section protection
    if (isDashboard) {
      const rule = DASHBOARD_RULES.find((r) => pathname.startsWith(r.prefix));

      // If it's a known section, enforce allowed roles
      if (rule && !rule.allow.includes(role)) {
        return NextResponse.redirect(new URL(home, req.url));
      }

      // If it's an unknown /dashboard/* route, you can decide:
      // Option A (strict): only admin can access unknown dashboard routes
      // if (!rule && role !== "admin") return NextResponse.redirect(new URL(home, req.url));
      //
      // Option B (loose): allow it
    }

    return NextResponse.next();
  } catch {
    // token invalid/expired
    if (isDashboard || isAdminArea) return redirectToLogin(req, pathname);
    return NextResponse.next();
  }
}

// ✅ matcher is allowed here
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
