// // app/(dashboards)/layout.tsx
// import type { ReactNode } from "react";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import { MainSidebar } from "@/components/sideBar/SideBar";

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen bg-slate-50">
//         {/* Left sidebar */}
//         <MainSidebar />

//         {/* Right side: dashboard shell */}
//         <SidebarInset className="flex min-h-screen flex-1 flex-col w-full max-w-none">
//           {/* Top bar */}
//           <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:px-6">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mx-2 hidden h-6 md:block"
//             />
//             <div className="flex flex-1 items-center justify-between">
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//                   Internal · Workshop access only
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Manage orders, technicians, stock and KPIs from one place.
//                 </p>
//               </div>

//               {/* Right-side actions: env badge, date range, etc. */}
//               {/* <EnvBadge />  */}
//             </div>
//           </header>
//           {/* Page content */}
//           <main className="flex-1 w-full max-w-none px-2 md:px-3 md:py-5">
//             <div className="w-full max-w-none">{children}</div>
//           </main>{" "}
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// }

// app/(dashboards)/layout.tsx
// import type { ReactNode } from "react";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import { MainSidebar } from "@/components/sideBar/SideBar";

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   return (
//     <SidebarProvider>
//       {/* Full-width flex row: sidebar + main area */}
//       <div className="flex min-h-screen w-full bg-slate-50">
//         {/* Left sidebar */}
//         <MainSidebar />

//         {/* Right side: dashboard shell */}
//         <SidebarInset className="flex min-h-screen flex-1 flex-col">
//           {/* Top bar */}
//           <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:px-6">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mx-2 hidden h-6 md:block"
//             />
//             <div className="flex flex-1 items-center justify-between">
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
//                   Internal · Workshop access only
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Manage orders, technicians, stock and KPIs from one place.
//                 </p>
//               </div>
//               {/* Right-side actions (optional) */}
//             </div>
//           </header>

//           {/* Page content: make sure children have full width */}
//           <main className="flex-1 w-full max-w-none px-4 py-6 md:px-8 md:py-8">
//             {children}
//           </main>
//         </SidebarInset>
//       </div>
//     </SidebarProvider>
//   );
// }

import type { ReactNode } from "react";
import { cookies } from "next/headers";
import type { Role } from "@/lib/models/users";
import { MainSidebar } from "@/components/sideBar/SideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { verifyToken } from "@/lib/auth/jwt"; // wherever yours is
import { LogoutButton } from "@/components/logout/Logout";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let role: Role = "visitor";
  let username = "user";

  if (token) {
    try {
      const decoded = verifyToken(token); // <-- no generics
      role = decoded.role ?? "visitor";
      username = decoded.username ?? username;
    } catch {}
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <MainSidebar role={role} username={username} />

        <SidebarInset className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 hidden h-6 md:block"
            />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Welcome, {username}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Internal access only
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage orders, technicians, stock and KPIs from one place.
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 w-full max-w-none px-4 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
