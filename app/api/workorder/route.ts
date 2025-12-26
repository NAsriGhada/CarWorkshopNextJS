import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import prisma  from "@/lib/prisma";
import { WorkOrderStatus } from "@/lib/generated/prisma/enums";
import { verifyToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const mongoUserId = payload.sub;

    const body = await req.json();

    const dateIn =
      body.dateIn && typeof body.dateIn === "string" && body.dateIn.trim()
        ? new Date(body.dateIn)
        : undefined;

    const workOrder = await prisma.workOrder.create({
      data: {
        createdByUserId: mongoUserId,
        aoNumber: body.aoNumber?.trim() || null,
        customerName: body.customerName?.trim(),
        vin: body.vin?.trim(),
        customerComplaint: body.customerComplaint?.trim() || null,
        make: body.make?.trim() || null,
        model: body.model?.trim() || null,
        year: typeof body.year === "number" ? body.year : null,
        engine: body.engine?.trim() || null,
        vehicleApiSource: body.vehicleApiSource ?? null,
        vehicleApiRawData: body.vehicleApiRawData ?? undefined,
        status: WorkOrderStatus.PENDING_REVIEW,
        dateIn: dateIn ?? new Date(),
      },
      select: { id: true, status: true, createdAt: true },
    });

    return NextResponse.json(workOrder, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "CREATE_WORKORDER_FAILED";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
