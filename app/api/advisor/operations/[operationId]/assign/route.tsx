import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ operationId: string }> },
) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { operationId } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const technicianId =
    typeof (body as any)?.technicianId === "string"
      ? (body as any).technicianId
      : null;

  // allow "unassigned"
  const technicianConnect =
    technicianId && technicianId !== "unassigned"
      ? { connect: { id: technicianId } }
      : undefined;

  const technicianDisconnect =
    !technicianId || technicianId === "unassigned" ? true : undefined;

  try {
    const updated = await prisma.operation.update({
      where: { id: operationId },
      data: {
        technician: technicianDisconnect
          ? { disconnect: true }
          : technicianConnect,
      },
      select: { id: true, technicianId: true },
    });

    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ error: "ASSIGN_FAILED" }, { status: 400 });
  }
}
