// lib/auth/users.ts
import { connectDB } from "@/lib/mongodb";
import User from "../models/users"; // make sure this matches the actual filename
import { PublicUser } from "./types";
import { signToken } from "./jwt";
import { hashPassword, verifyPassword } from "./password";

function toPublicUser(user: any): PublicUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    roles: user.roles,
    img: user.img,
  };
}

// REGISTER
// Throws Error("EMAIL_IN_USE") if email already exists
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<{ user: PublicUser; token: string }> {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) throw new Error("EMAIL_IN_USE");

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    passwordHash,
    roles: ["visitor"], // default role
  });

  const token = signToken(user.id, user.roles[0] || "visitor", user.username);

  return {
    user: toPublicUser(user),
    token,
  };
}

// LOGIN
// Throws Error("INVALID_CREDENTIALS") for wrong email or password
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: PublicUser; token: string }> {
  await connectDB();

  // IMPORTANT: select passwordHash explicitly
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = signToken(user.id, user.roles[0] || "visitor", user.username);

  return {
    user: toPublicUser(user),
    token,
  };
}
