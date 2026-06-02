"use client";

import { demoRoles } from "@/lib/rbac";
import { useDemoState } from "@/lib/demo-state";
import type { RoleName } from "@/types/rbac";

export function RoleSwitcher() {
  const { selectedRole, setSelectedRole } = useDemoState();

  return (
    <label className="flex min-w-64 flex-col gap-1 text-xs font-medium text-slate-400">
      Demo role
      <select
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value as RoleName)}
        className="h-10 rounded-lg border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
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
