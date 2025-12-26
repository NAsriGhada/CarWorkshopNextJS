// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import type { Role } from "@/lib/models/users";
// import { verifyToken } from "@/lib/auth/jwt";


// const ROLE_HOME: Record<Role, string> = {
//   admin: "/admin",
//   visitor: "/dashboard/visitor",
//   agent: "/dashboard/agent",
//   Technician: "/dashboard/technician",
//   stockManager: "/dashboard/stock",
//   advisor: "/dashboard/advisor",
// };

// export default async function DashboardIndexPage() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   let role: Role = "visitor";

//   if (token) {
//     try {
//       role = verifyToken(token).role ?? "visitor";
//     } catch {
//       role = "visitor";
//     }
//   }

//   redirect(ROLE_HOME[role] ?? "/dashboard/visitor");
// }
