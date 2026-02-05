"use client";

import * as React from "react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TechnicianLite = { id: string; name: string; techCode: string };

type OperationLite = {
  id: string;
  operationNumber: number;
  operationCode: string;
  description: string;
  customerMinutes: number | null;
  technician: { id: string; name: string; techCode: string } | null;
  parts: Array<unknown>;
  timeLogs: Array<unknown>;
};

export default function OperationTable({
  operations,
  technicians,
}: {
  operations: OperationLite[];
  technicians: TechnicianLite[];
}) {
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // local selection per row (so you can change before saving)
  const [draftTech, setDraftTech] = React.useState<Record<string, string>>({});

  async function assignTechnician(operationId: string) {
    setError(null);
    setSavingId(operationId);

    const technicianId = draftTech[operationId] ?? null;

    try {
      const res = await fetch(`/api/advisor/operations/${operationId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "ASSIGN_FAILED");

      // easiest way (for now): refresh the page to show updated tech in server data
      window.location.reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "ASSIGN_FAILED");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">
          ❌ {error}
        </p>
      )}

      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">#</TableHead>
              <TableHead className="w-[140px]">Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[260px]">Technician</TableHead>
              <TableHead className="w-[140px]">Customer time</TableHead>
              <TableHead className="w-[140px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {operations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No operations yet. (Next: advisor adds operations.)
                </TableCell>
              </TableRow>
            ) : (
              operations.map((op) => {
                const current =
                  draftTech[op.id] ??
                  (op.technician ? op.technician.id : "unassigned");

                return (
                  <TableRow key={op.id} className="align-top">
                    <TableCell className="font-mono">
                      {op.operationNumber}
                    </TableCell>

                    <TableCell className="font-mono">
                      {op.operationCode}
                    </TableCell>

                    <TableCell>
                      <p className="font-medium">{op.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Parts: {op.parts.length} • Time logs:{" "}
                        {op.timeLogs.length}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-sm">
                          {op.technician ? (
                            <span className="font-medium">
                              {op.technician.name}{" "}
                              <span className="text-xs text-muted-foreground">
                                ({op.technician.techCode})
                              </span>
                            </span>
                          ) : (
                            <Badge variant="secondary">Unassigned</Badge>
                          )}
                        </div>

                        <Select
                          value={current}
                          onValueChange={(v) =>
                            setDraftTech((prev) => ({ ...prev, [op.id]: v }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Assign technician" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">
                              Unassigned
                            </SelectItem>
                            {technicians.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.name} ({t.techCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>

                    <TableCell>
                      {typeof op.customerMinutes === "number" ? (
                        <span className="font-medium">
                          {op.customerMinutes} min
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => assignTechnician(op.id)}
                        disabled={savingId === op.id}
                      >
                        {savingId === op.id ? "Saving..." : "Save"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
