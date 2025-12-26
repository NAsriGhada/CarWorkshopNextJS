import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma"; // your accelerate prisma singleton
import { verifyToken } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.sub;

    const items = await prisma.workOrder.findMany({
      where: { createdByUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        status: true,
        vin: true,
        aoNumber: true,
        customerComplaint: true,
        make: true,
        model: true,
        year: true,
      },
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "FETCH_FAILED";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
