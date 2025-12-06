// lib/validation/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username cannot be longer than 20 characters" }),

  email: z
    .email() 
    .regex(z.regexes.unicodeEmail, {
      message: "Invalid email address",
    })
    .max(100, { message: "Email cannot be longer than 100 characters" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password cannot be longer than 50 characters" }),
});


export const loginSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(6),
});




export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
