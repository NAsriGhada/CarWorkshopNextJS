"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/models/users";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Wrench,
  LayoutDashboard,
  Users,
  Package,
  Activity,
} from "lucide-react";
import { LogoutButton } from "../logout/Logout";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[]; // if omitted => visible to everyone
};

const navMain: NavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Workshop",
    href: "/dashboard/workshop",
    icon: Wrench,
    roles: ["admin", "advisor", "agent"],
  },
  {
    title: "Technicians",
    href: "/dashboard/technicians",
    icon: Activity,
    roles: ["admin", "Technician", "advisor"],
  },
  {
    title: "Parts in stock",
    href: "/dashboard/stock",
    icon: Package,
    roles: ["admin", "stockManager", "advisor"],
  },
];

const navAdmin: NavItem[] = [
  {
    title: "Admin · Users",
    href: "/dashboard/admin",
    icon: Users,
    roles: ["admin"],
  },
];

function canSee(item: NavItem, role: Role) {
  if (!item.roles) return true;
  return item.roles.includes(role);
}

export function MainSidebar({
  role,
  username,
}: {
  role: Role;
  username: string;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const visibleMain = navMain.filter((i) => canSee(i, role));
  const visibleAdmin = navAdmin.filter((i) => canSee(i, role));

  return (
    <Sidebar className="border-r bg-slate-950 text-slate-50 dark:bg-slate-950">
      <SidebarHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 px-2 pt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold">
            AC
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
              AutoCare
            </span>
            <span className="text-xs text-slate-400">
              Internal workshop portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* MAIN SECTION */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <LogoutButton />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMain.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-9 rounded-lg text-sm"
                    >
                      <Link href={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ADMIN SECTION (ONLY if admin links exist) */}
        {visibleAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleAdmin.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="h-9 rounded-lg text-sm"
                      >
                        <Link href={item.href}>
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 px-2 py-3 text-[11px] text-slate-500">
        <p>Signed in as</p>
        <p className="font-medium text-slate-300">{username}</p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
