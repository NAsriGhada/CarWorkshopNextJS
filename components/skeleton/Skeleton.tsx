"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SkeletonCard() {
  const columns = ["User", "Email", "Role", "Created"];

  return (
    <div className="rounded-xl border bg-white/60 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/40">
      {/* ── Toolbar skeleton ─────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* search skeleton */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Skeleton className="h-10 w-[260px] rounded-lg" />
          </div>
        </div>

        {/* columns button skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[90px] rounded-lg" />
        </div>
      </div>

      {/* ── Table skeleton ──────────────────────────────── */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="border-b border-border/60 bg-white/70">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="h-11 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-border/40 bg-white/60"
              >
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex} className="px-6 py-3">
                    <Skeleton className="h-4 w-[70%] max-w-[220px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* footer skeleton / subtle hint */}
      <div className="flex items-center justify-between gap-3 border-t px-6 py-4 text-xs text-muted-foreground">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
