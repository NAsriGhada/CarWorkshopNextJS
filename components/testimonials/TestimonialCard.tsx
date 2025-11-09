type Testimonial = {
  quote: string;
  name: string;
  role?: string; // e.g., “Audi A4 owner”
  avatarSrc?: string; // optional /public/avatars/*
  rating?: number; // 1–5
};

export default function TestimonialCard({
  quote,
  name,
  role,
  avatarSrc,
  rating = 5,
}: Testimonial) {
  return (
    <article className="rounded-xl bg-card border border-border p-5 shadow-subtle h-full flex flex-col">
      {/* header */}
      <div className="flex items-center gap-3">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt={name}
            className="h-10 w-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="h-10 w-10 rounded-full grid place-items-center border border-border bg-muted text-sm">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <div className="font-medium leading-tight">{name}</div>
          {role && (
            <div className="text-xs text-[hsl(var(--color-muted-fore))]">
              {role}
            </div>
          )}
        </div>
      </div>

      {/* rating */}
      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < rating} />
        ))}
      </div>

      {/* quote */}
      <p className="mt-3 text-sm text-[hsl(var(--color-fg))]">“{quote}”</p>
    </article>
  );
}

/* helper */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${
        filled ? "text-accent" : "text-[hsl(var(--color-muted-fore))]"
      }`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M10 2.5l2.5 5.2 5.7.8-4.1 4 1 5.8L10 15.8 4.9 19l1-5.8-4.1-4 5.7-.8L10 2.5z" />
    </svg>
  );
}
