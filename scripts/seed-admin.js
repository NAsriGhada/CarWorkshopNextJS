// // scripts/seed-admin.ts
// import dotenv from "dotenv";
// import { connectDB } from "../lib/mongodb";
// import User from "../lib/models/users";
// import { hashPassword } from "../lib/auth/password";

// dotenv.config({ path: ".env.local" });

// async function main() {
//   console.log("🔧 Running admin seed...");

//   await connectDB();

//   // Check if an admin already exists
//   const existingAdmin = await User.findOne({ roles: "admin" });

//   if (existingAdmin) {
//     console.log("✅ Admin already exists:", existingAdmin.email);
//     process.exit(0);
//   }

//   const email = process.env.INIT_ADMIN_EMAIL;
//   const username = process.env.INIT_ADMIN_USERNAME || "admin";
//   const plainPassword = process.env.INIT_ADMIN_PASSWORD;

//   if (!email || !plainPassword) {
//     console.error(
//       "❌ Please set INIT_ADMIN_EMAIL and INIT_ADMIN_PASSWORD in your .env.local or .env file."
//     );
//     process.exit(1);
//   }

//   const passwordHash = await hashPassword(plainPassword);

//   const admin = await User.create({
//     username,
//     email,
//     passwordHash,
//     roles: ["admin"],
//   });

//   console.log("🎉 Admin created:");
//   console.log("   email:   ", admin.email);
//   console.log("   username:", admin.username);
//   console.log("   roles:   ", admin.roles);

//   process.exit(0);
// }

// main().catch((err) => {
//   console.error("❌ Seed admin failed:", err);
//   process.exit(1);
// });

// scripts/seed-admin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.local" });

// 1) Get Mongo URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env.local");
  process.exit(1);
}

// 2) Roles (same as your TS User model)
const ROLES = [
  "admin",
  "visitor",
  "agent",
  "Technician",
  "stockManager",
  "advisor",
];

// 3) Minimal User schema (copied from your TS model)
const userSchema = new mongoose.Schema(
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
      select: false,
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

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

async function main() {
  console.log("🔧 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  console.log("🔍 Checking for existing admin...");
  const existingAdmin = await User.findOne({ roles: "admin" });

  if (existingAdmin) {
    console.log("✅ Admin already exists:", existingAdmin.email);
    await mongoose.disconnect();
    process.exit(0);
  }

  const email = process.env.INIT_ADMIN_EMAIL;
  const username = process.env.INIT_ADMIN_USERNAME || "admin";
  const plainPassword = process.env.INIT_ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    console.error(
      "❌ Please set INIT_ADMIN_EMAIL and INIT_ADMIN_PASSWORD in .env.local"
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log("🔐 Hashing password...");
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  console.log("✨ Creating admin user...");
  const admin = await User.create({
    username,
    email,
    passwordHash,
    roles: ["admin"],
  });

  console.log("🎉 Admin created successfully:");
  console.log("   email:   ", admin.email);
  console.log("   username:", admin.username);
  console.log("   roles:   ", admin.roles);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("❌ Seed admin failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});

