// app/dashboard/admin/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { UsersDataTable } from "@/components/admin/users/UsersDataTable";
import {
  createAdminColumns,
  type AdminUser,
} from "@/components/admin/users/columns";
import type { Role } from "@/components/admin/RoleSelect";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/skeleton/Skeleton";

const PAGE_SIZE = 10;

// 🔹 helper to format "Last updated X ago"
function formatRelativeTime(date: Date | null) {
  if (!date) return "Never";
  const now = new Date().getTime();
  const diffMs = now - date.getTime();

  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec} seconds ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 new: track when data last successfully loaded
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // --------------------------------------------------------
  // LOAD USERS (API pagination)
  // --------------------------------------------------------
  const fetchUsers = useCallback(async (pageToLoad: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/admin/users?page=${pageToLoad}&pageSize=${PAGE_SIZE}`
      );
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || "Failed to load users";
        setError(msg);
        toast.error(msg);
        return;
      }

      setUsers(data.users as AdminUser[]);
      setTotalPages(data.totalPages || 1);

      // 🔹 record successful refresh time
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      const msg = "Something went wrong while loading users";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  // --------------------------------------------------------
  // CHANGE ROLE
  // --------------------------------------------------------
  const handleRoleChange = useCallback(
    async (userId: string, newRole: Role) => {
      try {
        setSavingId(userId);

        const res = await fetch(`/api/admin/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roles: [newRole] }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to update user role");
          return;
        }

        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, roles: data.user.roles } : u
          )
        );

        toast.success(`Updated role to "${newRole}"`);

        // 🔹 optionally also refresh "last updated" on role change
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while updating role");
      } finally {
        setSavingId(null);
      }
    },
    []
  );

  // --------------------------------------------------------
  // COLUMNS (wired with role change + savingId)
  // --------------------------------------------------------
  const columns = useMemo(
    () =>
      createAdminColumns({
        onRoleChange: handleRoleChange,
        savingId,
      }),
    [handleRoleChange, savingId]
  );

  // --------------------------------------------------------
  // UI STATES
  // --------------------------------------------------------
  if (error && !users.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold">Admin · Users</h1>
        <div className="flex flex-col gap-3 rounded-xl border bg-white/60 p-6 text-sm">
          <span className="text-red-500">{error}</span>
          <Button variant="outline" size="sm" onClick={() => fetchUsers(page)}>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------
  return (
    <div className="flex flex-1 flex-col space-y-6 p-4 md:p-8 w-full max-w-none">
    {/* Page header */}
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Users &amp; Roles
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage user roles for the entire workshop platform.
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated:{" "}
        <span className="font-medium">{formatRelativeTime(lastUpdated)}</span>
      </p>
    </header>

    {/* Data table or skeleton */}
    {loading && !users.length ? (
      <SkeletonCard />
    ) : (
      <UsersDataTable data={users} columns={columns} />
    )}

    {/* External API pagination controls */}
    <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-sm text-muted-foreground">
      <span className="mr-auto text-xs sm:text-sm">
        Last updated:{" "}
        <span className="font-medium">{formatRelativeTime(lastUpdated)}</span>
      </span>

      <span>
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      >
        Next
      </Button>
    </div>
  </div>
);
}
