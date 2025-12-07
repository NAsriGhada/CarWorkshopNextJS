"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { AdminUser } from "./columns";

type UsersDataTableProps = {
  data: AdminUser[];
  columns: ColumnDef<AdminUser, unknown>[];
};

export function UsersDataTable({ data, columns }: UsersDataTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable<AdminUser>({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(), this is client side pagination
  });

  // const currentPage = table.getState().pagination.pageIndex + 1;
  // const pageCount = table.getPageCount() || 1;
  const totalFiltered = table.getFilteredRowModel().rows.length;

  return (
      <div className="w-full rounded-xl border bg-white/60 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/40">
        {/* ── Toolbar ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email…"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-10 w-[260px] rounded-lg bg-white/80 pl-9 text-sm shadow-inner"
              />
            </div>
          </div>

          {/* columns toggle */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-gray-300 bg-white/80 text-xs font-medium"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                // 🔥 make the menu fully opaque and above the table
                className="z-60 w-44 rounded-lg border bg-white dark:bg-slate-950 text-foreground shadow-xl"
              >
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const header = column.columnDef.header;
                    const label =
                      typeof header === "string" ? header : column.id;

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        className="text-xs"
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border/60 bg-white/70"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-11 px-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-border/40 bg-white/60 transition-colors hover:bg-gray-50/90"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-3 text-sm text-gray-800"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 px-6 text-center text-sm text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Footer / pagination ─────────────────────────────── */}
        {/* <div className="flex items-center justify-between gap-3 border-t px-6 py-4 text-xs text-muted-foreground">
        <div>
          {totalFiltered} user{totalFiltered === 1 ? "" : "s"}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-gray-300 bg-white/80 px-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </Button>

          {/* <span className="text-xs font-medium tabular-nums">
            Page {currentPage} of {pageCount}
          </span> */}

        {/* <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg border-gray-300 bg-white/80 px-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div> */}
        {/* </div> */}
        <div className="flex items-center justify-between gap-3 border-t px-6 py-4 text-xs text-muted-foreground">
          <div>
            {totalFiltered} user{totalFiltered === 1 ? "" : "s"} on this page
          </div>

          {/* you can put anything here later, like “Last synced …” or filters */}
        </div>
      </div>
  );
}
