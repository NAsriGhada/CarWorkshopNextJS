"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { BookingForm } from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type MyWorkOrder = {
  id: string;
  createdAt: string;
  status: string;
  vin: string;
  aoNumber: string | null;
  customerComplaint: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
};

type AppointmentDraft = {
  date: Date;
  startAtLocal: Date;
  endAtLocal: Date;
};

function buildSlotsForDay(day: Date) {
  const slots: { start: Date; end: Date; label: string }[] = [];

  // ✅ change these later to your workshop hours
  const startHour = 9;
  const endHour = 16;
  const stepMinutes = 30;

  const base = new Date(day);
  base.setHours(0, 0, 0, 0);

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const start = new Date(base);
      start.setHours(h, m, 0, 0);

      const end = new Date(start);
      end.setMinutes(end.getMinutes() + stepMinutes);

      const label = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      slots.push({ start, end, label });
    }
  }

  return slots;
}

export default function VisitorPage() {
  // ----- Status banners (your original) -----
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  // ----- My submissions drawer (your original portal approach) -----
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<MyWorkOrder[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  async function loadHistory() {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch("/api/mine");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not load history");
      setItems(data.items ?? []);
    } catch (e: unknown) {
      setHistoryError(
        e instanceof Error ? e.message : "Could not load history"
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  React.useEffect(() => {
    if (historyOpen && items.length === 0) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen]);

  React.useEffect(() => {
    if (!historyOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHistoryOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [historyOpen]);

  // ----- Calendar (Option B: book → then fill) -----
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    new Date()
  );
  const [selectedSlotStart, setSelectedSlotStart] = React.useState<Date | null>(
    null
  );
  const [appointment, setAppointment] = React.useState<AppointmentDraft | null>(
    null
  );

  const slots = React.useMemo(() => {
    if (!selectedDay) return [];
    return buildSlotsForDay(selectedDay);
  }, [selectedDay]);

  function confirmAppointment() {
    if (!selectedDay || !selectedSlotStart) return;

    const end = new Date(selectedSlotStart);
    end.setMinutes(end.getMinutes() + 30);

    setAppointment({
      date: selectedDay,
      startAtLocal: selectedSlotStart,
      endAtLocal: end,
    });
  }

  function resetAppointment() {
    setAppointment(null);
    setSelectedSlotStart(null);
  }

  // ----- Drawer portal -----
  const historyDrawer =
    mounted && historyOpen
      ? createPortal(
          <div className="fixed inset-0" style={{ zIndex: 2147483647 }}>
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close submissions panel"
              onClick={() => setHistoryOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            {/* Drawer */}
            <aside
              className="absolute right-0 top-0 h-full w-full max-w-[92vw] bg-white text-foreground shadow-2xl border-l"
              style={{ zIndex: 2147483647 }}
              role="dialog"
              aria-modal="true"
              aria-label="My submissions"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4 p-6 pb-3 border-b">
                  <div>
                    <h2 className="text-lg font-semibold">My submissions</h2>
                    <p className="text-sm text-muted-foreground">
                      Your latest work orders/complaints (only you can see
                      these).
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setHistoryOpen(false)}
                    aria-label="Close"
                  >
                    ✕
                  </Button>
                </div>

                <div className="flex items-center justify-between px-6 py-3">
                  <Badge variant="outline">{items.length} items</Badge>

                  <Button
                    variant="ghost"
                    onClick={loadHistory}
                    disabled={historyLoading}
                  >
                    {historyLoading ? "Refreshing..." : "Refresh"}
                  </Button>
                </div>

                <div className="flex-1 overflow-auto px-6 pb-6">
                  {historyError && (
                    <p className="mb-3 rounded-md bg-red-100 p-3 text-red-700">
                      ❌ {historyError}
                    </p>
                  )}

                  <div className="w-full overflow-x-auto rounded-md border">
                    <Table className="w-full table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-44">Date</TableHead>
                          <TableHead className="w-60">Vehicle</TableHead>
                          <TableHead className="w-[190px]">VIN</TableHead>
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
                              No submissions yet.
                            </TableCell>
                          </TableRow>
                        ) : (
                          items.map((w) => (
                            <TableRow key={w.id} className="align-top">
                              <TableCell className="whitespace-nowrap">
                                {new Date(w.createdAt).toLocaleString()}
                              </TableCell>

                              <TableCell className="wrap-break-word">
                                {[w.make, w.model, w.year]
                                  .filter(Boolean)
                                  .join(" ") || "—"}
                                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                  {w.customerComplaint || "—"}
                                </div>
                              </TableCell>

                              <TableCell className="font-mono whitespace-nowrap">
                                {w.vin}
                              </TableCell>

                              <TableCell>
                                <Badge variant="secondary">{w.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Status banners */}
      {status === "success" && (
        <p className="rounded-md bg-green-100 p-3 text-green-700">
          ✅ Booking submitted successfully. Our team will review it shortly.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-md bg-red-100 p-3 text-red-700">
          ❌ {message ?? "Something went wrong"}
        </p>
      )}

      {/* Top header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Visitor</h1>
          <p className="text-sm text-muted-foreground">
            Step 1: book an appointment. Step 2: fill the complaint form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {appointment ? (
            <Badge variant="secondary">Appointment selected</Badge>
          ) : (
            <Badge variant="outline">No appointment</Badge>
          )}

          <Button
            variant="secondary"
            onClick={() => setHistoryOpen(true)}
            type="button"
          >
            My submissions
          </Button>
        </div>
      </div>

      {/* STEP 1: Appointment UI */}
      <Card className="border-muted/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1) Book an appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex justify-center items-center">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16 lg:gap-24">
            <div className="w-fit">
              <Calendar
                mode="single"
                className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                selected={selectedDay}
                onSelect={(d) => {
                  setSelectedDay(d);
                  setSelectedSlotStart(null);
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const d = new Date(date);
                  d.setHours(0, 0, 0, 0);
                  return d < today;
                }}
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full items-center justify-between gap-3">
                <h3 className="text-sm font-medium whitespace-nowrap">
                  Available time slots
                </h3>
                {selectedDay && (
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {selectedDay.toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {slots.map((s) => {
                  const active =
                    selectedSlotStart &&
                    s.start.getTime() === selectedSlotStart.getTime();

                  return (
                    <Button
                      key={s.start.toISOString()}
                      type="button"
                      variant={active ? "default" : "secondary"}
                      onClick={() => setSelectedSlotStart(s.start)}
                      className="justify-center"
                    >
                      {s.label}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  onClick={confirmAppointment}
                  disabled={!selectedDay || !selectedSlotStart}
                >
                  Confirm appointment
                </Button>

                {appointment && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetAppointment}
                  >
                    Change
                  </Button>
                )}
              </div>

              {appointment && (
                <p className="text-sm text-muted-foreground">
                  ✅ Selected:{" "}
                  <span className="font-medium text-foreground">
                    {appointment.startAtLocal.toLocaleString([], {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* STEP 2: Booking form (disabled until appointment confirmed) */}
      <Card className="border-muted/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            2) Fill the complaint form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!appointment ? (
            <p className="text-sm text-muted-foreground">
              Please book an appointment first. Then the form will be enabled.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Appointment locked:{" "}
              <span className="font-medium text-foreground">
                {appointment.startAtLocal.toLocaleString()}
              </span>
            </p>
          )}

          <div className={!appointment ? "pointer-events-none opacity-50" : ""}>
            <BookingForm
              onDecodeVin={async (vin) => {
                const qs = new URLSearchParams({ vin });
                // if (modelYear) qs.set("modelYear", String(modelYear));

                const res = await fetch(`/api/vehicle?${qs.toString()}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error ?? "Decode failed");

                return {
                  make: data.make ?? "",
                  model: data.model ?? "",
                  year: data.year ?? undefined,
                  engine: data.engine ?? "",
                };
              }}
              onSubmit={async (values) => {
                setStatus("loading");
                setMessage(null);

                try {
                  const res = await fetch("/api/workorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...values,
                      appointmentStartAt:
                        appointment?.startAtLocal.toISOString(),
                      appointmentEndAt: appointment?.endAtLocal.toISOString(),
                    }),
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error ?? "Submit failed");

                  setStatus("success");

                  toast.success("Booking submitted successfully", {
                    description: "Our team will review your request shortly.",
                  });

                  // If drawer is open, refresh it so user sees the new item
                  if (historyOpen) await loadHistory();
                } catch (err: unknown) {
                  const msg =
                    err instanceof Error ? err.message : "Submit failed";

                  setStatus("error");
                  setMessage(msg);

                  toast.error("Submission failed", {
                    description: msg,
                  });
                }

              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submissions Drawer */}
      {historyDrawer}
    </div>
  );
}
