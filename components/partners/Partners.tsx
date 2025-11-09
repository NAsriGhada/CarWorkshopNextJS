import Image from "next/image";
import Link from "next/link";

type Partner = {
  name: string;
  href?: string;
  logoSrc?: string; // e.g. "/partners/bosch.png"
};

const partners: Partner[] = [
  { name: "Bosch", logoSrc: "/partners/bosch.png" },
  { name: "Castrol", logoSrc: "/partners/castrol.png" },
  { name: "Michelin", logoSrc: "/partners/michelin.png" },
  { name: "NGK", logoSrc: "/partners/ngk.png" }, // white bg (intended)
  { name: "Continental", logoSrc: "/partners/continental.jpg" },
];

export default function PartnersSection() {
  return (
    <section className="py-12 border-t border-border bg-card">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold">Our Partners</h2>
            <p className="mt-1 text-sm text-[hsl(var(--color-muted-fore))]">
              We work with trusted brands and OEM-grade suppliers.
            </p>
          </div>
          <Link
            href="/contact"
            className="hidden md:inline-block text-sm underline underline-offset-4"
          >
            Become a partner
          </Link>
        </div>

        {/* Logo grid */}
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {partners.map((p) => (
            <li key={p.name} className="flex items-center justify-center">
              <PartnerLogo partner={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Helpers ---------- */

function PartnerLogo({ partner }: { partner: Partner }) {
  const wrapper =
    "group inline-flex items-center justify-center rounded-lg border border-border/60 bg-white shadow-subtle px-4 py-3 w-full h-24"; // brighter base

  const content = (
    <Image
      src={partner.logoSrc!}
      alt={partner.name}
      width={200}
      height={60}
      sizes="(min-width: 768px) 200px, 40vw"
      className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
      priority={false}
    />
  );

  return partner.href ? (
    <Link href={partner.href} className={wrapper}>
      {content}
    </Link>
  ) : (
    <div className={wrapper}>{content}</div>
  );
}

