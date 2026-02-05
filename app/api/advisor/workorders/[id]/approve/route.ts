// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireRole } from "@/lib/auth/requireRole";

// function formatAo(n: number) {
//   // AO-000123 style
//   return `AO-${String(n).padStart(6, "0")}`;
// }

// export async function POST(
//   _req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const guard = await requireRole(["advisor", "admin"]);
//   if (!guard.ok) return guard.res;

//   const workOrderId = params.id;

//   try {
//     const result = await prisma.$transaction(async (tx) => {
//       // 1) fetch WO
//       const wo = await tx.workOrder.findUnique({
//         where: { id: workOrderId },
//         select: { id: true, status: true, aoNumber: true },
//       });

//       if (!wo) {
//         throw new Error("WORKORDER_NOT_FOUND");
//       }

//       if (wo.status !== "PENDING_REVIEW") {
//         throw new Error("WORKORDER_NOT_PENDING");
//       }

//       // if already has aoNumber, keep it (idempotent)
//       if (wo.aoNumber) {
//         const updated = await tx.workOrder.update({
//           where: { id: workOrderId },
//           data: { status: "APPROVED" },
//           select: { id: true, aoNumber: true, status: true },
//         });
//         return updated;
//       }

//       // 2) ensure counter row exists
//       await tx.aoCounter.upsert({
//         where: { id: 1 },
//         update: {},
//         create: { id: 1, nextNumber: 1 },
//       });

//       // 3) get + increment counter
//       const counter = await tx.aoCounter.update({
//         where: { id: 1 },
//         data: { nextNumber: { increment: 1 } },
//         select: { nextNumber: true },
//       });

//       // counter.nextNumber is AFTER increment, so the assigned one is (nextNumber-1)
//       const assignedNumber = counter.nextNumber - 1;
//       const aoNumber = formatAo(assignedNumber);

//       // 4) update workorder
//       const updated = await tx.workOrder.update({
//         where: { id: workOrderId },
//         data: {
//           aoNumber,
//           status: "APPROVED",
//         },
//         select: { id: true, aoNumber: true, status: true },
//       });

//       return updated;
//     });

//     return NextResponse.json(result, { status: 200 });
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: e?.message ?? "APPROVE_FAILED" },
//       { status: 400 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function formatAo(n: number) {
  // choose your format:
  // AO-000001, AO-000002 ...
  return `AO-${String(n).padStart(6, "0")}`;
}

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!id) return jsonError("Missing work order id", 400);

  const result = await prisma
    .$transaction(async (tx) => {
      const wo = await tx.workOrder.findUnique({ where: { id } });
      if (!wo) throw new Error("NOT_FOUND");

      // Already cancelled/done? block
      if (wo.status === "CANCELLED" || wo.status === "DONE") {
        throw new Error("INVALID_STATUS");
      }

      // If AO missing, generate it atomically using AoCounter
      let aoNumber = wo.aoNumber;

      if (!aoNumber) {
        // Ensure counter row exists
        const counter = await tx.aoCounter.upsert({
          where: { id: 1 },
          update: {},
          create: { id: 1, nextNumber: 1 },
        });

        const next = counter.nextNumber;
        aoNumber = formatAo(next);

        // increment counter
        await tx.aoCounter.update({
          where: { id: 1 },
          data: { nextNumber: { increment: 1 } },
        });
      }

      const updated = await tx.workOrder.update({
        where: { id },
        data: {
          aoNumber,
          status: "APPROVED",
        },
      });

      return updated;
    })
    .catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : "UNKNOWN";
      if (msg === "NOT_FOUND") return null;
      if (msg === "INVALID_STATUS") throw new Error("INVALID_STATUS");
      throw e;
    });

  if (!result) return jsonError("Work order not found", 404);

  return NextResponse.json({ item: result });
}
