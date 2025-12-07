"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navBar/NavBar";
import Footer from "@/components/footer/Footer";

export function BodyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isDashboard) {
    // dashboard-only layout, no navbar/footer
    return <>{children}</>;
  }

  // public pages
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
