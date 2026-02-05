"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type WorkOrderStatus =
  | "PENDING_REVIEW"
  | "APPROVED"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

type AdvisorWorkOrder = {
  id: string;
  createdAt: string;
  updatedAt: string;

  status: WorkOrderStatus;
  aoNumber: string | null;

  customerName: string;
  vin: string;

  customerComplaint: string | null;

  make: string | null;
  model: string | null;
  year: number | null;
  engine: string | null;

  // appointment preview (optional)
  appointment?: {
    startAt: string;
    endAt: string;
    status: "HELD" | "BOOKED" | "CANCELLED" | "COMPLETED";
  } | null;
};

function statusBadgeVariant(s: WorkOrderStatus) {
  switch (s) {
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

function formatVehicle(w: AdvisorWorkOrder) {
  const label = [w.make, w.model, w.year].filter(Boolean).join(" ");
  return label || "—";
}

export default function AdvisorPage() {
  const router = useRouter();

  const [status, setStatus] = React.useState<WorkOrderStatus>("PENDING_REVIEW");
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<AdvisorWorkOrder[]>([]);

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = React.useMemo(
    () => items.find((x) => x.id === selectedId) ?? null,
    [items, selectedId]
  );

  // debounce search
  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q.trim()), 250);
    return () => window.clearTimeout(t);
  }, [q]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("status", status);
      if (debouncedQ) params.set("q", debouncedQ);

      const res = await fetch(`/api/advisor/workorders?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Could not load work orders");

      const list: AdvisorWorkOrder[] = data.items ?? [];
      setItems(list);

      // keep selection if still exists, else select first
      if (list.length === 0) {
        setSelectedId(null);
      } else if (!selectedId || !list.some((x) => x.id === selectedId)) {
        setSelectedId(list[0].id);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load work orders");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, debouncedQ]);

  async function approveSelected() {
    if (!selected) return;
    try {
      const res = await fetch(
        `/api/advisor/workorders/${selected.id}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Approve failed");
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Approve failed");
    }
  }

  async function cancelSelected() {
    if (!selected) return;
    try {
      const res = await fetch(`/api/advisor/workorders/${selected.id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Cancel failed");
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Cancel failed");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Advisor</h1>
          <p className="text-sm text-muted-foreground">
            Review bookings/complaints, approve them, and assign technicians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-100 p-3 text-red-700">❌ {error}</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* LEFT: LIST */}
        <Card className="h-fit">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Work orders</CardTitle>
              <Badge variant="outline">{items.length} items</Badge>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search VIN, customer name, AO..."
                className="sm:flex-1"
              />

              <Select
                value={status}
                onValueChange={(v) => setStatus(v as WorkOrderStatus)}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING_REVIEW">Pending review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <div className="w-full overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[170px]">Created</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="w-[200px]">VIN</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        No work orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((w) => {
                      const active = w.id === selectedId;
                      return (
                        <TableRow
                          key={w.id}
                          onClick={() => setSelectedId(w.id)}
                          className={`cursor-pointer align-top ${
                            active ? "bg-muted/50" : ""
                          }`}
                        >
                          <TableCell className="whitespace-nowrap">
                            {new Date(w.createdAt).toLocaleString()}
                          </TableCell>

                          <TableCell>
                            <div className="font-medium">{w.customerName}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {formatVehicle(w)}
                            </div>
                          </TableCell>

                          <TableCell className="font-mono whitespace-nowrap">
                            {w.vin}
                          </TableCell>

                          <TableCell>
                            <Badge variant={statusBadgeVariant(w.status)}>
                              {w.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Tip: click a row to preview and take actions.
            </p>
          </CardContent>
        </Card>

        {/* RIGHT: DETAILS */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {!selected ? (
              <p className="text-sm text-muted-foreground">
                Select a work order from the list.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {selected.aoNumber ? (
                        <span>
                          AO:{" "}
                          <span className="font-mono text-foreground">
                            {selected.aoNumber}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          AO not assigned yet
                        </span>
                      )}
                    </div>

                    <div className="text-lg font-semibold">
                      {selected.customerName}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Vehicle:{" "}
                      <span className="text-foreground">
                        {formatVehicle(selected)}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      VIN:{" "}
                      <span className="font-mono text-foreground">
                        {selected.vin}
                      </span>
                    </div>
                  </div>

                  <Badge variant={statusBadgeVariant(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Customer complaint</div>
                  <div className="rounded-md border p-3 text-sm">
                    {selected.customerComplaint || "—"}
                  </div>
                </div>

                {selected.appointment && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Appointment</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(
                          selected.appointment.startAt
                        ).toLocaleString()}{" "}
                        –{" "}
                        {new Date(
                          selected.appointment.endAt
                        ).toLocaleTimeString()}
                      </div>
                      <Badge variant="outline">
                        {selected.appointment.status}
                      </Badge>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={approveSelected}
                    disabled={selected.status !== "PENDING_REVIEW"}
                  >
                    Approve (generate AO)
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={cancelSelected}
                    disabled={
                      selected.status === "CANCELLED" ||
                      selected.status === "DONE"
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      router.push(`/dashboard/advisor/workorders/${selected.id}`)
                    }
                  >
                    Open full page
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  “Assign technician” + operations table will be inside the full
                  page next.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
