import Link from "next/link";
import NewsletterForm from "../newsLetter/NewsLetterForm";

const links = {
  services: [
    { href: "/services", label: "All Services" },
    { href: "/services#diagnostics", label: "Diagnostics" },
    { href: "/services#brakes", label: "Brake Service" },
    { href: "/services#oil", label: "Oil & Filter" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/booking", label: "Book Appointment" },
    { href: "/faq", label: "FAQ" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-bg">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary" />
            <span className="font-semibold">AutoCare</span>
          </div>
          <p className="mt-3 text-sm text-[hsl(var(--color-muted-fore))]">
            Trusted diagnostics, maintenance, and repair with transparent
            pricing.
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              href="#"
              aria-label="Instagram"
              className="icon-button h-11 w-11"
            >
              <i className="lni lni-instagram icon-base icon-hover icon-lg" />
            </Link>

            <Link
              href="#"
              aria-label="Facebook"
              className="icon-button h-11 w-11 ml-2"
            >
              <i className="lni lni-facebook icon-base icon-hover icon-xl" />
            </Link>

            <Link
              href="#"
              aria-label="X"
              className="icon-button h-11 w-11 ml-2"
            >
              <i className="lni lni-x icon-base icon-hover icon-md" />
            </Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-[hsl(var(--color-muted-fore))]">
            Services
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {links.services.map((l) => (
              <li key={l.href}>
                <Link
                  className="hover:underline underline-offset-4"
                  href={l.href}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-[hsl(var(--color-muted-fore))]">
            Company
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {links.company.map((l) => (
              <li key={l.href}>
                <Link
                  className="hover:underline underline-offset-4"
                  href={l.href}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Reusable newsletter */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide uppercase text-[hsl(var(--color-muted-fore))]">
            Contact
          </h3>
          <div className="mt-3 text-sm">
            <p>Trondheim, Norway</p>
            <p>Mon–Sat 08:00–18:00</p>
            <p>
              <a className="hover:underline" href="tel:+4712345678">
                +47 12 34 56 78
              </a>
            </p>
            <p>
              <a
                className="hover:underline"
                href="mailto:hello@nomadica.autocare"
              >
                hello@contact.autocare
              </a>
            </p>
          </div>

          {/* Reusable form */}
          <NewsletterForm className="mt-4" compact />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-4 flex flex-col gap-2 md:flex-row items-center justify-between text-xs text-[hsl(var(--color-muted-fore))]">
          <p>© {year} AutoCare. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:underline">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
