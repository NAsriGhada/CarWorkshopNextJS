import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaPrimaryHref?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryHref?: string;
  ctaSecondaryLabel?: string;
  showStats?: boolean;
};

export default function Hero({
  eyebrow = "Same-day appointments",
  title = "Trusted Car Workshop in Trondheim",
  subtitle = "Diagnostics, maintenance, and repairs with transparent pricing.",
  ctaPrimaryHref = "/booking",
  ctaPrimaryLabel = "Book Appointment",
  ctaSecondaryHref = "/services",
  ctaSecondaryLabel = "View Services",
  showStats = true,
}: HeroProps) {
  return (
    <section className="relative border-b border-border bg-bg">
      <div className="container py-16 md:py-20 grid gap-10 md:grid-cols-2 items-center">
        {/* Left: copy */}
        <div>
          {eyebrow && (
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-accent text-accent-fore text-xs font-medium">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-[hsl(var(--color-muted-fore))]">
              {subtitle}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={ctaPrimaryHref}
              className="px-5 py-3 rounded-xl bg-primary text-white shadow-card"
            >
              {ctaPrimaryLabel}
            </Link>
            <Link
              href={ctaSecondaryHref}
              className="px-5 py-3 rounded-xl border border-border bg-card"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>

          {showStats && (
            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat k="Years" v="10+" />
              <Stat k="5★ Reviews" v="1,200" />
              <Stat k="Cars Serviced" v="15k" />
            </div>
          )}
        </div>

        {/* Right: image (use your own asset when ready) */}
        <div className="relative">
          {/* If you don’t have an image yet, keep the placeholder box */}
          {/* <div className="aspect-16/10 w-full rounded-xl bg-card border border-border shadow-subtle grid place-items-center">
            <span className="text-sm text-[hsl(var(--color-muted-fore))]">
              Hero image / workshop photo
            </span>
          </div> */}

          {/* Example with Image component (uncomment when you have /public/images/hero.jpg) */}

          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border shadow-subtle">
            <Image
              src="/hero.png"
              alt="Mechanic working in a clean workshop"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 text-center">
      <div className="text-2xl font-semibold">{v}</div>
      <div className="text-xs uppercase tracking-wide text-[hsl(var(--color-muted-fore))]">
        {k}
      </div>
    </div>
  );
}
