import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Wrench,
  Calendar,
  Users,
  ClipboardList,
  Clock,
  Package,
  Truck,
  ShoppingCart,
  FileText,
  Receipt,
  Shield,
  KeyRound,
  Settings,
  ScrollText,
} from "lucide-react";

export type Role =
  | "admin"
  | "visitor"
  | "agent"
  | "Technician"
  | "stockManager"
  | "advisor";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: Role[]; // who can see it
  group: "Operations" | "Inventory" | "Finance" | "Admin";
};

export const NAV_ITEMS: NavItem[] = [
  // ── OPERATIONS ─────────────────────────────
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "Operations",
    roles: [
      "admin",
      "advisor",
      "agent",
      "Technician",
      "stockManager",
      "visitor",
    ],
  },
  {
    title: "Workshop",
    href: "/dashboard/workshop",
    icon: Wrench,
    group: "Operations",
    roles: ["admin", "advisor", "agent", "Technician", "stockManager"], // ❌ visitor hidden
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
    group: "Operations",
    roles: ["admin", "advisor", "agent"],
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    group: "Operations",
    roles: ["admin", "advisor", "agent"],
  },
  {
    title: "My Jobs",
    href: "/dashboard/my-jobs",
    icon: ClipboardList,
    group: "Operations",
    roles: ["admin", "Technician"],
  },
  {
    title: "Time Tracking",
    href: "/dashboard/time",
    icon: Clock,
    group: "Operations",
    roles: ["admin", "Technician"],
  },

  // ── INVENTORY ──────────────────────────────
  {
    title: "Parts & Stock",
    href: "/dashboard/stock",
    icon: Package,
    group: "Inventory",
    roles: ["admin", "stockManager"],
  },
  {
    title: "Parts Requests",
    href: "/dashboard/parts-requests",
    icon: Truck,
    group: "Inventory",
    roles: ["admin", "Technician", "stockManager"],
  },
  {
    title: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Truck,
    group: "Inventory",
    roles: ["admin", "stockManager"],
  },
  {
    title: "Purchase Orders",
    href: "/dashboard/purchase-orders",
    icon: ShoppingCart,
    group: "Inventory",
    roles: ["admin", "stockManager"],
  },

  // ── FINANCE ─────────────────────────────────
  {
    title: "Estimates",
    href: "/dashboard/estimates",
    icon: FileText,
    group: "Finance",
    roles: ["admin", "advisor"],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: Receipt,
    group: "Finance",
    roles: ["admin", "advisor"],
  },

  // ── ADMIN ──────────────────────────────────
  {
    title: "Admin · Users",
    href: "/dashboard/admin",
    icon: Shield,
    group: "Admin",
    roles: ["admin"],
  },
  {
    title: "Roles & Permissions",
    href: "/dashboard/admin/roles",
    icon: KeyRound,
    group: "Admin",
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
    group: "Admin",
    roles: ["admin"],
  },
  {
    title: "Audit Log",
    href: "/dashboard/admin/audit",
    icon: ScrollText,
    group: "Admin",
    roles: ["admin"],
  },
];

export function getNavForRole(role: Role) {
  return NAV_ITEMS.filter((i) => i.roles.includes(role));
}

export function groupNav(items: NavItem[]) {
  const groups: Record<string, NavItem[]> = {};
  for (const item of items) {
    groups[item.group] ??= [];
    groups[item.group].push(item);
  }
  return groups as Record<NavItem["group"], NavItem[]>;
}
