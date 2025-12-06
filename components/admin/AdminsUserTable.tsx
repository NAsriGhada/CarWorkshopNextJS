"use client";

import { RoleSelect, Role } from "./RoleSelect";

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  createdAt?: string | null;
};

type Props = {
  users: AdminUser[];
  savingId: string | null;
};

type Handlers = {
  onRoleChange: (userId: string, newRole: Role) => void;
};

export function AdminUsersTable({
  users,
  savingId,
  onRoleChange,
}: Props & Handlers) {
  if (!users.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-muted-fore">No users found.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-card shadow-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users &amp; Roles</h2>
        <p className="text-xs text-muted-fore">
          Click the role to change it for each user.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase text-muted-fore">
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const primaryRole = (u.roles[0] || "visitor") as Role;

              return (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium">{u.username}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">
                    <RoleSelect
                      value={primaryRole}
                      disabled={savingId === u.id}
                      onChange={(role) => onRoleChange(u.id, role)}
                    />
                  </td>
                  <td className="py-2 pr-4 text-xs text-muted-fore">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
