import Link from "next/link";

export type ServiceKey =
  | "oil"
  | "brake"
  | "diagnostic"
  | "tire"
  | "battery"
  | "ac";


type Props = {
  icon: ServiceKey;
  title: string;
  description: string;
  href?: string;
};

const icons: Record<Props["icon"], React.ReactNode> = {
  oil: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 13v-3a4 4 0 1 0-8 0v3" />
      <path d="M12 17h.01" />
      <rect x="5" y="13" width="14" height="8" rx="2" />
    </svg>
  ),
  brake: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  ),
  diagnostic: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 10h18M9 14h6" />
    </svg>
  ),
  tire: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
    </svg>
  ),
  battery: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <line x1="22" y1="11" x2="22" y2="13" />
      <line x1="6" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="18" y2="12" />
    </svg>
  ),
  ac: (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M6 12h12M8.5 8.5l7 7M15.5 8.5l-7 7" />
    </svg>
  ),
};

export default function ServiceCard({
  icon,
  title,
  description,
  href = "/booking",
}: Props) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 shadow-subtle flex flex-col">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted">
          {icons[icon]}
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-[hsl(var(--color-muted-fore))]">
        {description}
      </p>
      <Link
        href={href}
        className="mt-4 inline-block text-sm text-primary underline underline-offset-4"
      >
        Book this service
      </Link>
    </div>
  );
}