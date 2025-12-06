// // app/api/login/route.ts
// import { NextResponse } from "next/server";
// import { loginUser } from "@/lib/auth/users";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     const { user, token } = await loginUser(email, password);

//     const res = NextResponse.json(
//       {
//         message: "Login successful",
//         user,
//       },
//       { status: 200 }
//     );

//     // httpOnly auth cookie
//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     return res;
//   } catch (err: any) {
//     if (err.message === "INVALID_CREDENTIALS") {
//       return NextResponse.json(
//         { error: "Invalid email or password" },
//         { status: 401 }
//       );
//     }

//     console.error("LOGIN ERROR:", err);
//     return NextResponse.json({ error: "Login failed" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/auth";
import { loginUser } from "@/lib/auth/users";
import { ROLE_REDIRECTS } from "@/lib/auth/roleRedirects";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with Zod
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Auth logic
    const { user, token } = await loginUser(email, password);

    // Choose redirect based on role
    const redirectTo = ROLE_REDIRECTS[user.roles[0]] || "/dashboard";

    const res = NextResponse.json({
      message: "Login successful",
      redirectTo,
      user,
    });

    // Set cookie
    res.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
