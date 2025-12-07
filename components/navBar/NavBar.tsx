"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/register", label: "register" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <nav className="container h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary" />
          <span className="font-semibold">AutoCare</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "px-3 py-2 rounded-lg text-sm transition",
                  isActive(item.href)
                    ? "text-primary bg-card border border-border"
                    : "hover:bg-muted",
                ].join(" ")}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/booking"
            className="px-4 py-2 rounded-xl bg-primary text-white shadow-card text-sm"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border"
        >
          <span className="sr-only">Open menu</span>
          <div className="h-3.5 w-4 space-y-1.5">
            <span
              className={`block h-0.5 w-full bg-[hsl(var(--color-fg))] transition
                ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-[hsl(var(--color-fg))] transition
                ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-full bg-[hsl(var(--color-fg))] transition
                ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-3">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block w-full px-3 py-2 rounded-lg text-sm",
                      isActive(item.href)
                        ? "text-primary bg-muted"
                        : "hover:bg-muted",
                    ].join(" ")}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/booking"
                  className="block text-center px-4 py-2 rounded-xl bg-primary text-white shadow-card text-sm"
                  onClick={() => setOpen(false)}
                >
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
