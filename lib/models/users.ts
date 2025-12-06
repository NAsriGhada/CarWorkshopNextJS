import { Schema, model, models } from "mongoose";

// 1) Role constants (string union)
export const ROLES = [
  "admin",
  "visitor",
  "agent",
  "Technician",
  "stockManager",
  "advisor",
] as const;
export type Role = (typeof ROLES)[number];

// 2) User interface
export interface IUser {
  username: string;
  email: string;
  passwordHash: string; // store the hash, not raw password
  img?: string;
  roles: Role[]; // multiple roles supported
  createdAt?: Date;
  updatedAt?: Date;
}

// 3) Schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // hide by default in queries unless .select('+passwordHash')
    },
    img: { type: String },
    roles: {
      type: [String],
      enum: ROLES,
      default: ["visitor"],
      index: true,
    },
  },
  { timestamps: true }
);


// Indexes (ensure unique)
// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ username: 1 }, { unique: true });

const User = models.User || model<IUser>("User", userSchema);
export default User;
