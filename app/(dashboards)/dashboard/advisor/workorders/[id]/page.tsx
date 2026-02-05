import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import OperationTable from "@/components/advisor/OperationTable";

type PageProps = {
  params: Promise<{ id: string }>;
};

function statusBadgeVariant(status: string) {
  switch (status) {
    case "PENDING_REVIEW":
      return "secondary";
    case "APPROVED":
      return "outline";
    case "IN_PROGRESS":
      return "default";
    case "DONE":
      return "default";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
}

function vehicleLabel(w: {
  make: string | null;
  model: string | null;
  year: number | null;
  engine: string | null;
}) {
  const left = [w.make, w.model, w.year].filter(Boolean).join(" ");
  const engine = w.engine ? `• ${w.engine}` : "";
  return `${left || "—"} ${engine}`.trim();
}

export default async function AdvisorWorkOrderDetailsPage({
  params,
}: PageProps) {
  const guard = await requireRole(["advisor", "admin"]);
  if (!guard.ok) return guard.res;

  const { id } = await params;
  if (!id) notFound();

  const [workOrder, technicians] = await Promise.all([
    prisma.workOrder.findUnique({
      where: { id },
      include: {
        appointment: true,
        operations: {
          orderBy: { createdAt: "asc" },
          include: {
            technician: true,
            parts: { include: { part: true } },
            timeLogs: true,
          },
        },
      },
    }),
    prisma.technician.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, techCode: true },
      take: 200,
    }),
  ]);

  if (!workOrder) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top bar */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Work order details</h1>
          <p className="text-sm text-muted-foreground">
            Advisor view: review complaint, confirm status, assign technicians.
          </p>
        </div>

        <Button asChild variant="secondary">
          <a href="/dashboard/advisor">← Back</a>
        </Button>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base">
              {workOrder.aoNumber ? `AO: ${workOrder.aoNumber}` : "No AO yet"}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Badge variant={statusBadgeVariant(workOrder.status)}>
                {workOrder.status}
              </Badge>
              <Badge variant="outline" className="font-mono">
                {workOrder.id.slice(0, 8)}…
              </Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Created: {new Date(workOrder.createdAt).toLocaleString()}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Customer */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Customer</p>
              <p className="font-medium">{workOrder.customerName}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">VIN</p>
              <p className="font-mono text-sm">{workOrder.vin}</p>
            </div>
          </div>

          <Separator />

          {/* Vehicle */}
          <div>
            <p className="text-xs text-muted-foreground">Vehicle</p>
            <p className="font-medium">{vehicleLabel(workOrder)}</p>
          </div>

          {/* Complaint */}
          <div>
            <p className="text-xs text-muted-foreground">Customer complaint</p>
            <p className="mt-1 rounded-md border bg-muted/20 p-3 text-sm leading-relaxed">
              {workOrder.customerComplaint?.trim() || "—"}
            </p>
          </div>

          {/* Appointment */}
          <div className="rounded-md border p-3">
            <p className="text-sm font-medium">Appointment</p>

            {workOrder.appointment ? (
              <div className="mt-2 grid gap-2 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline">
                    {workOrder.appointment.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="text-sm">
                    {new Date(workOrder.appointment.startAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End</p>
                  <p className="text-sm">
                    {new Date(workOrder.appointment.endAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No appointment linked.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operations (Advisor actions happen here) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Operations</CardTitle>
            <Badge variant="outline">{workOrder.operations.length} items</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <OperationTable
            operations={workOrder.operations}
            technicians={technicians}
          />
        </CardContent>
      </Card>
    </div>
  );
}
