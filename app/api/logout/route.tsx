import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // delete cookie (must match the name + options you used when setting it)
  res.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  // If you also have refresh token, clear it too
  // res.cookies.set("refreshToken", "", { path: "/", httpOnly: true, sameSite:"lax", secure: ..., maxAge: 0 });

  return res;
}
