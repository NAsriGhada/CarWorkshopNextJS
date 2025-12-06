"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Role =
  | "admin"
  | "visitor"
  | "agent"
  | "Technician"
  | "stockManager"
  | "advisor";

const ALL_ROLES: Role[] = [
  "admin",
  "visitor",
  "agent",
  "Technician",
  "stockManager",
  "advisor",
];

type RoleSelectProps = {
  value: Role;
  disabled?: boolean;
  onChange: (role: Role) => void;
};

export function RoleSelect({ value, disabled, onChange }: RoleSelectProps) {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(newRole: Role) => onChange(newRole)}
    >
      <SelectTrigger className="h-9 w-[180px] text-sm capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="bg-card border border-border shadow-md z-50"
        // keeps list as floating popper, not stacked
        position="popper"
      >
        {ALL_ROLES.map((role) => (
          <SelectItem key={role} value={role} className="capitalize text-sm">
            {role === "stockManager"
              ? "Stock manager"
              : role === "Technician"
              ? "Technician"
              : role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
