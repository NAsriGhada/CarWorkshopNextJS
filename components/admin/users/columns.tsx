"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { RoleSelect, Role } from "@/components/admin/RoleSelect";

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  createdAt: string | null;
};

type CreateColumnsArgs = {
  onRoleChange: (userId: string, newRole: Role) => void;
  savingId: string | null;
};

export function createAdminColumns(
  args: CreateColumnsArgs
): ColumnDef<AdminUser>[] {
  const { onRoleChange, savingId } = args;

  return [
    {
      id: "username", // <-- add clean ID
      accessorKey: "username",
      header: "Username", // <-- clean human label
      cell: ({ row }) => {
        const user = row.original;
        const isAdmin = user.roles?.includes("admin");

        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{user.username}</span>
            {isAdmin && (
              <Badge
                variant="outline"
                className="h-5 px-2 text-[10px] uppercase tracking-wide
                           border-primary/50 text-primary bg-primary/5"
              >
                Admin
              </Badge>
            )}
          </div>
        );
      },
    },

    {
      id: "email", // <-- add clean ID
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },

    {
      id: "role", // <-- keep explicit ID
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        const primaryRole = (user.roles[0] as Role) || "visitor";

        return (
          <RoleSelect
            value={primaryRole}
            disabled={savingId === user.id}
            onChange={(newRole) => onRoleChange(user.id, newRole)}
          />
        );
      },
    },

    {
      id: "createdAt", // <-- add clean ID
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const value = row.original.createdAt;
        return (
          <span className="text-xs text-muted-foreground">
            {value ? new Date(value).toLocaleDateString() : "—"}
          </span>
        );
      },
    },
  ];
}
