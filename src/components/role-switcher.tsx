"use client";

import { demoRoles } from "@/lib/rbac";
import { useDemoState } from "@/lib/demo-state";
import type { RoleName } from "@/types/rbac";

export function RoleSwitcher() {
  const { selectedRole, setSelectedRole } = useDemoState();

  return (
    <label htmlFor="demo-role-switcher" className="flex w-full flex-col gap-1 text-xs font-medium text-slate-400 sm:w-64">
      Role view
      <select
        id="demo-role-switcher"
        name="demoRole"
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value as RoleName)}
        className="h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
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
