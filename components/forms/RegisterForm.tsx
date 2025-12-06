"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
};

export default function RegisterForm() {
  const [name, setName] = useState(""); // maps to username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 400 = Zod validation error (details object)
        if (res.status === 400 && data.details) {
          const details = data.details as {
            username?: string[];
            email?: string[];
            password?: string[];
          };

          setFieldErrors({
            username: details.username?.[0],
            email: details.email?.[0],
            password: details.password?.[0],
          });

          setGeneralError(data.error || "Please fix the errors below.");
          toast.error(data.error || "Please fix the errors below.");

          setIsSubmitting(false);
          return;
        }

        // 409 = email already used
        if (res.status === 409) {
          setFieldErrors((prev) => ({
            ...prev,
            email: data.error || "Email already in use",
          }));
          toast.error("Email already in use.");
          setGeneralError("Email already in use.");
          setIsSubmitting(false);
          return;
        }

        // other server errors
        setGeneralError(data.error || "Registration failed.");
        toast.error(data.error || "Registration failed.");
        setIsSubmitting(false);
        return;
      }

      // success 🎉
      setSuccessMessage("Registration successful! You are now logged in.");
      toast.success("Account created! Redirecting to your dashboard...");

      // Redirect user based on role returned from API
      if (data.redirectTo) {
        router.push(data.redirectTo);
      }
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setGeneralError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const baseInput =
    "border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary border-border";
  const errorInput = "border-red-500 focus:ring-red-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-card rounded-xl shadow-card p-6 space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">Create an Account</h1>

      {/* Global messages */}
      {generalError && (
        <p className="text-sm text-red-500 text-center">{generalError}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600 text-center">{successMessage}</p>
      )}

      {/* Username */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm">Name</label>
        <input
          type="text"
          className={`${baseInput} ${fieldErrors.username ? errorInput : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {fieldErrors.username && (
          <p className="text-xs text-red-500">{fieldErrors.username}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
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
        {isSubmitting ? "Registering..." : "Register"}
      </button>

      <p className="text-center text-sm text-muted-fore">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
