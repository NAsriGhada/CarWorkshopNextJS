"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 400 → Zod validation errors from backend
        if (res.status === 400 && data.details) {
          const details = data.details as {
            email?: string[];
            password?: string[];
          };

          setFieldErrors({
            email: details.email?.[0],
            password: details.password?.[0],
          });

          setGeneralError(data.error || "Please check your inputs.");
          setIsSubmitting(false);
          return;
        }

        // 401 → invalid credentials
        if (res.status === 401) {
          setGeneralError(data.error || "Invalid email or password.");
          setIsSubmitting(false);
          return;
        }

        // other server errors
        setGeneralError(data.error || "Login failed.");
        setIsSubmitting(false);
        return;
      }

      // ✅ success: redirect based on role
      const redirectTo = data.redirectTo || "/dashboard";
      router.push(redirectTo);
    } catch (err) {
      setGeneralError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const baseInput =
    "border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary";
  const errorInput = "border-red-500 focus:ring-red-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-card rounded-xl shadow-card p-6 space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">Login</h1>

      {/* Global error message */}
      {generalError && (
        <p className="text-sm text-red-500 text-center">{generalError}</p>
      )}

      <div className="flex flex-col space-y-1">
        <label className="text-sm">Email</label>
        <input
          type="email"
          className={`${baseInput} ${fieldErrors.email ? errorInput : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {fieldErrors.email && (
          <p className="text-xs text-red-500">{fieldErrors.email}</p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm">Password</label>
        <input
          type="password"
          className={`${baseInput} ${fieldErrors.password ? errorInput : ""}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {fieldErrors.password && (
          <p className="text-xs text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-muted-fore">
        Don’t have an account?{" "}
        <a href="/register" className="text-primary hover:underline">
          Register
        </a>
      </p>
    </form>
  );
}
