// lib/auth/roleRedirects.ts
export const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin",
  visitor: "/dashboard",
  Technician: "/dashboard/technician",
  stockManager: "/dashboard/stock",
  advisor: "/dashboard/advisor",
  agent: "/dashboard/agent",
};
