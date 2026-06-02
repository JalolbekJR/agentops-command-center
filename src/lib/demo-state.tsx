"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { RoleName } from "@/types/rbac";
import { getRoleDefinition } from "@/lib/rbac";

interface DemoStateContextValue {
  selectedRole: RoleName;
  setSelectedRole: (role: RoleName) => void;
  roleNote: string;
}

const DemoStateContext = createContext<DemoStateContextValue | undefined>(undefined);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<RoleName>("Founder/Admin");

  const value = useMemo(
    () => ({
      selectedRole,
      setSelectedRole,
      roleNote: getRoleDefinition(selectedRole).demoNote
    }),
    [selectedRole]
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
