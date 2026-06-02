"use client";

import { demoRoles } from "@/lib/rbac";
import { useDemoState } from "@/lib/demo-state";
import type { RoleName } from "@/types/rbac";

export function RoleSwitcher() {
  const { selectedRole, setSelectedRole } = useDemoState();

  return (
    <label htmlFor="demo-role-switcher" className="flex w-full flex-col gap-1 text-xs font-medium text-slate-500 sm:w-64">
      Role view
      <select
        id="demo-role-switcher"
        name="demoRole"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value as RoleName)}
        className="h-10 w-full rounded-md border border-white/[0.08] bg-white/[0.045] px-3 text-sm font-medium text-slate-100 outline-none transition hover:bg-white/[0.06] focus:border-slate-400/40 focus:ring-2 focus:ring-slate-400/20"
      >
        {demoRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </label>
  );
}
