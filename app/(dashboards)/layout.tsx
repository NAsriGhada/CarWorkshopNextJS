// app/(dashboards)/layout.tsx
import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MainSidebar } from "@/components/sideBar/SideBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Left sidebar */}
        <MainSidebar />

        {/* Right side: dashboard shell */}
        <SidebarInset className="flex min-h-screen flex-1 flex-col w-full max-w-none">
          {/* Top bar */}
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 hidden h-6 md:block"
            />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Internal · Workshop access only
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage orders, technicians, stock and KPIs from one place.
                </p>
              </div>

              {/* Right-side actions: env badge, date range, etc. */}
              {/* <EnvBadge />  */}
            </div>
          </header>
          {/* Page content */}
          <main className="flex-1 w-full max-w-none px-2 md:px-3 md:py-5">
            <div className="w-full max-w-none">{children}</div>
          </main>{" "}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
