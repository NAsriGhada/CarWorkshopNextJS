// lib/auth/types.ts

// export type PublicUser = {
//   id: string;
//   email: string;
//   fullName: string;
//   role: string;
// };


import type { Role } from "../models/users"; // or "../models/User" if you prefer relative

export type PublicUser = {
  id: string;
  email: string;
  username: string;
  roles: Role[];
  img?: string;
};