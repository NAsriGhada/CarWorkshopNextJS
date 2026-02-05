import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!id) return jsonError("Missing work order id", 400);

  const updated = await prisma.workOrder.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({ item: updated });
}
