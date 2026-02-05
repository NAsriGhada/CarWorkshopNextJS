// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireRole } from "@/lib/auth/requireRole";

// export async function POST(
//   _req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const guard = await requireRole(["advisor", "admin"]);
//   if (!guard.ok) return guard.res;

//   const workOrderId = params.id;

//   try {
//     const updated = await prisma.workOrder.update({
//       where: { id: workOrderId },
//       data: { status: "CANCELLED" },
//       select: { id: true, status: true },
//     });

//     return NextResponse.json(updated);
//   } catch (e: any) {
//     return NextResponse.json(
//       { error: e?.message ?? "REJECT_FAILED" },
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!id) return jsonError("Missing work order id", 400);

  // optional reason
  const body = await req.json().catch(() => ({}));
  const reason =
    typeof body?.reason === "string" ? body.reason.slice(0, 500) : null;

  const updated = await prisma.workOrder.update({
    where: { id },
    data: {
      status: "CANCELLED",
      // If you later add a column like "advisorNote" you can store reason there.
      // advisorNote: reason ?? undefined,
    },
  });

  return NextResponse.json({ item: updated, reason });
}

