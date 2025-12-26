"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { BookingForm } from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function VisitorPage() {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState<string | null>(null);

  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<MyWorkOrder[]>([]);

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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

  // Load history when opening (first time)
  React.useEffect(() => {
    if (historyOpen && items.length === 0) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyOpen]);

  // ESC to close
  React.useEffect(() => {
    if (!historyOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHistoryOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [historyOpen]);

  const historyDrawer =
    mounted && historyOpen
      ? createPortal(
          <div
            className="fixed inset-0"
            style={{
              // nuclear z-index so NOTHING beats it
              zIndex: 2147483647,
            }}
          >
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
              style={{
                // ensure drawer is above backdrop
                zIndex: 2147483647,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="My submissions"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
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

                {/* Actions */}
                <div className="flex items-center justify-between px-6 py-3">
                  <Badge variant="outline">{items.length} items</Badge>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={loadHistory}
                      disabled={historyLoading}
                    >
                      {historyLoading ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>
                </div>

                {/* Body */}
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

      {/* Top actions row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Visitor</h1>
          <p className="text-sm text-muted-foreground">
            Submit a new complaint and track your submissions.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setHistoryOpen(true)}
          type="button"
        >
          My submissions
        </Button>
      </div>

      {/* Booking form */}
      <BookingForm
        onSubmit={async (values) => {
          setStatus("loading");
          setMessage(null);

          try {
            const res = await fetch("/api/workorder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Submit failed");

            setStatus("success");

            // refresh list if drawer is open
            if (historyOpen) await loadHistory();
          } catch (err: unknown) {
            setStatus("error");
            setMessage(err instanceof Error ? err.message : "Submit failed");
          }
        }}
      />

      {/* Drawer portal */}
      {historyDrawer}
    </div>
  );
}
