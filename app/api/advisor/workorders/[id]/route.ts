import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }, // Next 16: params can be a Promise
) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!id) return jsonError("Missing work order id", 400);

  const workOrder = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      appointment: true,
      operations: {
        include: {
          technician: true,
          parts: { include: { part: true } },
          timeLogs: true,
        },
      },
    },
  });

  if (!workOrder) return jsonError("Work order not found", 404);

  return NextResponse.json({ item: workOrder });
}

/**
 * Optional: advisor edits on the details page (no tech assignment yet)
 * - customerComplaint
 * - make/model/year/engine
 * - dateOut
 * - status (if you want to allow transitions here later)
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { id } = await context.params;
  if (!id) return jsonError("Missing work order id", 400);

  const body = await req.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON body", 400);

  const updated = await prisma.workOrder.update({
    where: { id },
    data: {
      customerComplaint:
        typeof body.customerComplaint === "string"
          ? body.customerComplaint
          : undefined,

      make: typeof body.make === "string" ? body.make : undefined,
      model: typeof body.model === "string" ? body.model : undefined,
      engine: typeof body.engine === "string" ? body.engine : undefined,

      year:
        body.year === null
          ? null
          : typeof body.year === "number"
            ? body.year
            : undefined,

      dateOut:
        body.dateOut === null
          ? null
          : typeof body.dateOut === "string"
            ? new Date(body.dateOut)
            : undefined,
    },
  });

  return NextResponse.json({ item: updated });
}
