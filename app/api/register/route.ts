// app/api/register/route.ts
import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth/users";
import { ROLE_REDIRECTS } from "@/lib/auth/roleRedirects";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required" },
        { status: 400 }
      );
    }

    const { user, token } = await registerUser(username, email, password);

    const redirectTo = ROLE_REDIRECTS[user.roles[0]] || "/dashboard";


    const res = NextResponse.json(
      {
        message: "User registered successfully",
        user,
        redirectTo
      },
      { status: 201 }
    );

    // httpOnly auth cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    if (err.message === "EMAIL_IN_USE") {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
