// Server component (no 'use client')
export default function WhyUsSection() {
  const features: { icon: React.ReactNode; title: string; desc: string }[] = [
    {
      icon: <ShieldCheckIcon />,
      title: "Certified Technicians",
      desc: "ASE-certified team with continuous training on all major brands.",
    },
    {
      icon: <BadgeIcon />,
      title: "OEM-Grade Parts",
      desc: "We default to OEM or equivalent parts with clear documentation.",
    },
    {
      icon: <ClockBoltIcon />,
      title: "Same-Day Service",
      desc: "For common maintenance jobs, get in and out the same day.",
    },
    {
      icon: <WalletIcon />,
      title: "Transparent Pricing",
      desc: "Upfront quotes, no surprises. Approve work before we start.",
    },
  ];

  const checklist = [
    "12-month warranty on parts & labor",
    "Digital inspection report with photos",
    "Free coffee, Wi-Fi & waiting area",
    "Pickup & drop-off on request",
  ];

  return (
    <section className="py-16 bg-card border-t border-border">
      <div className="container">
        {/* Heading */}
        <div className="max-w-2xl">
          <span className="inline-block mb-3 px-3 py-1 rounded-full bg-accent text-accent-fore text-xs font-medium">
            Why choose us
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Built on trust. Focused on quality.
          </h2>
          <p className="mt-2 text-[hsl(var(--color-muted-fore))]">
            From diagnostics to delivery, we keep everything simple,
            transparent, and reliable.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border p-5 bg-bg"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <div className="text-primary">{f.icon}</div>
              </div>
              <h3 className="mt-3 font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-[hsl(var(--color-muted-fore))]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Checklist + trust bar */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 items-start">
          {/* Checklist card */}
          <div className="rounded-xl border border-border p-6 bg-bg">
            <h3 className="font-medium">What you can expect</h3>
            <ul className="mt-4 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <CheckIcon />
                  </span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust / stats bar */}
          <div className="rounded-xl border border-border p-6 bg-bg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat v="10+" k="Years" />
              <Stat v="1.2k" k="5★ Reviews" />
              <Stat v="15k" k="Cars Serviced" />
            </div>
            <p className="mt-4 text-xs text-[hsl(var(--color-muted-fore))]">
              Verified reviews across Google & Facebook. Warranty honored on all
              work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */

function Stat({ v, k }: { v: string; k: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-2xl font-semibold">{v}</div>
      <div className="text-[11px] uppercase tracking-wide text-[hsl(var(--color-muted-fore))]">
        {k}
      </div>
    </div>
  );
}

/* Minimal inline icons (stroke follows currentColor) */
function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function BadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M7 14h10l2 6-5-2-2 2-2-2-5 2 2-6z" />
    </svg>
  );
}
function ClockBoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M17 12h2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}
