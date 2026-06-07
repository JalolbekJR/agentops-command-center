"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { RoleName } from "@/types/rbac";
import { demoRoles, getRoleDefinition } from "@/lib/rbac";

const roleStorageKey = "agentops-command-center:selected-role";

function isDemoRole(value: string | null): value is RoleName {
  return Boolean(value && demoRoles.includes(value as RoleName));
}

interface DemoStateContextValue {
  selectedRole: RoleName;
  setSelectedRole: (role: RoleName) => void;
  isRoleReady: boolean;
  roleNote: string;
}

const DemoStateContext = createContext<DemoStateContextValue | undefined>(undefined);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRoleState] = useState<RoleName>("Founder/Admin");
  const [isRoleReady, setIsRoleReady] = useState(false);

  useEffect(() => {
    let storedRole: RoleName | null = null;

    try {
      const value = window.localStorage.getItem(roleStorageKey);
      storedRole = isDemoRole(value) ? value : null;
    } catch {
      // Storage can be unavailable in hardened browser modes. Keep the deterministic default.
    }

    const timeoutId = window.setTimeout(() => {
      if (storedRole) {
        setSelectedRoleState(storedRole);
      }

      setIsRoleReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const setSelectedRole = useCallback((role: RoleName) => {
    setSelectedRoleState(role);

    try {
      window.localStorage.setItem(roleStorageKey, role);
    } catch {
      // Role switching must still work as in-memory demo state when storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedRole,
      setSelectedRole,
      isRoleReady,
      roleNote: getRoleDefinition(selectedRole).demoNote
    }),
    [isRoleReady, selectedRole, setSelectedRole]
  );

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>;
}

export function useDemoState() {
  const context = useContext(DemoStateContext);

  if (!context) {
    throw new Error("useDemoState must be used inside DemoStateProvider");
  }

  return context;
}
