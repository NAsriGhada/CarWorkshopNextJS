// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // your singleton prisma
// import { requireRole } from "@/lib/auth/requireRole";

// export async function GET() {
//   const guard = await requireRole(["advisor", "admin"]);
//   if (!guard.ok) return guard.res;

//   const items = await prisma.workOrder.findMany({
//     orderBy: { createdAt: "desc" },
//     where: {
//       status: "PENDING_REVIEW",
//     },
//     select: {
//       id: true,
//       createdAt: true,
//       customerName: true,
//       vin: true,
//       customerComplaint: true,
//       make: true,
//       model: true,
//       year: true,
//       engine: true,
//       status: true,
//       aoNumber: true,
//       createdByUserId: true,
//       appointment: {
//         select: { startAt: true, endAt: true, status: true },
//       },
//     },
//     take: 100,
//   });

//   return NextResponse.json({ items });
// }


// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireRole } from "@/lib/auth/requireRole";

// const allowedStatuses = new Set([
//   "PENDING_REVIEW",
//   "APPROVED",
//   "IN_PROGRESS",
//   "DONE",
//   "CANCELLED",
// ]);

// export async function GET(req: NextRequest) {
//   const guard = await requireRole(["advisor", "admin"]);
//   if (!guard.ok) return guard.res;

//   const url = new URL(req.url);
//   const status = url.searchParams.get("status") ?? "PENDING_REVIEW";
//   const q = (url.searchParams.get("q") ?? "").trim();

//   const normalizedStatus = allowedStatuses.has(status)
//     ? status
//     : "PENDING_REVIEW";

//   const items = await prisma.workOrder.findMany({
//     orderBy: { createdAt: "desc" },
//     where: {
//       status: normalizedStatus as any,
//       ...(q
//         ? {
//             OR: [
//               { vin: { contains: q, mode: "insensitive" } },
//               { customerName: { contains: q, mode: "insensitive" } },
//               { aoNumber: { contains: q, mode: "insensitive" } },
//             ],
//           }
//         : {}),
//     },
//     select: {
//       id: true,
//       createdAt: true,
//       updatedAt: true,
//       customerName: true,
//       vin: true,
//       customerComplaint: true,
//       make: true,
//       model: true,
//       year: true,
//       engine: true,
//       status: true,
//       aoNumber: true,
//       createdByUserId: true,
//       appointment: {
//         select: { startAt: true, endAt: true, status: true },
//       },
//     },
//     take: 200,
//   });

//   return NextResponse.json({ items });
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";
import { WorkOrderStatus } from "@/lib/generated/prisma/enums";

const ALLOWED_STATUSES: WorkOrderStatus[] = [
  "PENDING_REVIEW",
  "APPROVED",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
];

function parseStatus(raw: string | null): WorkOrderStatus {
  if (!raw) return "PENDING_REVIEW";
  const upper = raw.toUpperCase();
  return ALLOWED_STATUSES.includes(upper as WorkOrderStatus)
    ? (upper as WorkOrderStatus)
    : "PENDING_REVIEW";
}

export async function GET(req: Request) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { searchParams } = new URL(req.url);

  const status = parseStatus(searchParams.get("status"));
  const q = (searchParams.get("q") ?? "").trim();

  const where = {
    status,
    ...(q
      ? {
          OR: [
            { vin: { contains: q, mode: "insensitive" as const } },
            { customerName: { contains: q, mode: "insensitive" as const } },
            { aoNumber: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const items = await prisma.workOrder.findMany({
    orderBy: { createdAt: "desc" },
    where,
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      aoNumber: true,
      customerName: true,
      vin: true,
      customerComplaint: true,
      make: true,
      model: true,
      year: true,
      engine: true,
      appointment: { select: { startAt: true, endAt: true, status: true } },
    },
    take: 100,
  });

  return NextResponse.json({ items });
}
