"use client";

import { useState } from "react";

type Props = {
  placeholder?: string;
  buttonText?: string;
  compact?: boolean; // smaller padding variant
  className?: string;
};

export default function NewsletterForm({
  placeholder = "Email address",
  buttonText = "Join",
  compact = false,
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // very light client-side check
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return setStatus("error");

    // TODO: call a server action or /api/newsletter
    // await subscribe(email)
    setStatus("ok");
  }

  const pad = compact ? "px-2 py-1.5" : "px-3 py-2";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`rounded-xl bg-card border border-border p-3 shadow-subtle ${className}`}
    >
      <label
        htmlFor="newsletter-email"
        className="block text-xs font-medium mb-1"
      >
        Newsletter
      </label>

      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-border bg-card ${pad} text-sm`}
          aria-invalid={status === "error"}
          aria-describedby="newsletter-help"
        />
        <button
          type="submit"
          className={`rounded-lg bg-primary text-white ${pad} text-sm`}
        >
          {buttonText}
        </button>
      </div>

      <p
        id="newsletter-help"
        className="mt-1 text-[11px] text-[hsl(var(--color-muted-fore))]"
      >
        No spam. Unsubscribe any time.
      </p>

      {status === "ok" && (
        <p className="mt-2 text-xs text-[hsl(var(--color-success))]">
          Thanks! You’re in.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-[hsl(var(--color-error))]">
          Please enter a valid email.
        </p>
      )}
    </form>
  );
}
