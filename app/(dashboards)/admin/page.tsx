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

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  if (loading && !users.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold">Admin · Users</h1>
        <div className="rounded-xl border bg-white/60 p-6 text-sm text-muted-foreground">
          Loading users…
        </div>
      </main>
    );
  }

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
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
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
      </header>

      {/* Data table */}
      <UsersDataTable data={users} columns={columns} />

      {/* External API pagination controls */}
      <div className="mt-2 flex items-center justify-end gap-3 text-sm text-muted-foreground">
        <span className="mr-2">
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
    </main>
  );
}
