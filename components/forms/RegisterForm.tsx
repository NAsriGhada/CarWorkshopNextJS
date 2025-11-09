"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // later: call /api/register
    console.log({ name, email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-card rounded-xl shadow-card p-6 space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">Create an Account</h1>

      <div className="flex flex-col space-y-1">
        <label className="text-sm">Name</label>
        <input
          type="text"
          className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm">Email</label>
        <input
          type="email"
          className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm">Password</label>
        <input
          type="password"
          className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white rounded-lg py-2 font-medium hover:opacity-90 transition"
      >
        Register
      </button>

      <p className="text-center text-sm text-muted-fore">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-primary hover:underline"
        >
          Login
        </a>
      </p>
    </form>
  );
}
