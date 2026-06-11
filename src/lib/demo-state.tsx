"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { RoleName } from "@/types/rbac";
import { demoRoles, getRoleDefinition } from "@/lib/rbac";

const roleStorageKey = "agentops-command-center:selected-role";
const uiModeStorageKey = "agentops-command-center:ui-mode";
const themeStorageKey = "agentops-command-center:theme";
const sidebarStorageKey = "agentops-command-center:sidebar-collapsed";

export type UiMode = "simple" | "professional";
export type ThemeMode = "dark" | "light";

function isDemoRole(value: string | null): value is RoleName {
  return Boolean(value && demoRoles.includes(value as RoleName));
}

function isUiMode(value: string | null): value is UiMode {
  return value === "simple" || value === "professional";
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light";
}

function isStoredBoolean(value: string | null) {
  return value === "true" || value === "false";
}

interface DemoStateContextValue {
  selectedRole: RoleName;
  setSelectedRole: (role: RoleName) => void;
  isRoleReady: boolean;
  uiMode: UiMode;
  setUiMode: (mode: UiMode) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  roleNote: string;
}

const DemoStateContext = createContext<DemoStateContextValue | undefined>(undefined);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedRole, setSelectedRoleState] = useState<RoleName>("Founder/Admin");
  const [uiMode, setUiModeState] = useState<UiMode>("professional");
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [isSidebarCollapsed, setSidebarCollapsedState] = useState(false);
  const [isRoleReady, setIsRoleReady] = useState(false);

  useEffect(() => {
    let storedRole: RoleName | null = null;
    let storedUiMode: UiMode | null = null;
    let storedThemeMode: ThemeMode | null = null;
    let storedSidebarCollapsed: boolean | null = null;

    try {
      const roleValue = window.localStorage.getItem(roleStorageKey);
      const uiModeValue = window.localStorage.getItem(uiModeStorageKey);
      const themeValue = window.localStorage.getItem(themeStorageKey);
      const sidebarValue = window.localStorage.getItem(sidebarStorageKey);

      storedRole = isDemoRole(roleValue) ? roleValue : null;
      storedUiMode = isUiMode(uiModeValue) ? uiModeValue : null;
      storedThemeMode = isThemeMode(themeValue) ? themeValue : null;
      storedSidebarCollapsed = isStoredBoolean(sidebarValue) ? sidebarValue === "true" : null;
    } catch {
      // Storage can be unavailable in hardened browser modes. Keep deterministic defaults.
    }

    const timeoutId = window.setTimeout(() => {
      if (storedRole) {
        setSelectedRoleState(storedRole);
      }

      if (storedUiMode) {
        setUiModeState(storedUiMode);
      }

      if (storedThemeMode) {
        setThemeModeState(storedThemeMode);
      }

      if (storedSidebarCollapsed !== null) {
        setSidebarCollapsedState(storedSidebarCollapsed);
      }

      setIsRoleReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.dataset.uiMode = uiMode;
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode, uiMode]);

  const setSelectedRole = useCallback((role: RoleName) => {
    setSelectedRoleState(role);

    try {
      window.localStorage.setItem(roleStorageKey, role);
    } catch {
      // Role switching must still work as in-memory demo state when storage is unavailable.
    }
  }, []);

  const setUiMode = useCallback((mode: UiMode) => {
    setUiModeState(mode);

    try {
      window.localStorage.setItem(uiModeStorageKey, mode);
    } catch {
      // UI mode should still work as in-memory demo state when storage is unavailable.
    }
  }, []);

  const setThemeMode = useCallback((theme: ThemeMode) => {
    setThemeModeState(theme);

    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Theme switching should still work as in-memory demo state when storage is unavailable.
    }
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);

    try {
      window.localStorage.setItem(sidebarStorageKey, String(collapsed));
    } catch {
      // Sidebar collapse should still work as in-memory demo state when storage is unavailable.
    }
  }, []);

  const value = useMemo(
    () => ({
      selectedRole,
      setSelectedRole,
      isRoleReady,
      uiMode,
      setUiMode,
      themeMode,
      setThemeMode,
      isSidebarCollapsed,
      setSidebarCollapsed,
      roleNote: getRoleDefinition(selectedRole).demoNote
    }),
    [isRoleReady, isSidebarCollapsed, selectedRole, setSelectedRole, setSidebarCollapsed, setThemeMode, setUiMode, themeMode, uiMode]
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
