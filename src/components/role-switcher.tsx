"use client";

import { useEffect, useRef, useState } from "react";
import { demoRoles } from "@/lib/rbac";
import { useDemoState } from "@/lib/demo-state";
import type { RoleName } from "@/types/rbac";

export function RoleSwitcher() {
  const { selectedRole, setSelectedRole } = useDemoState();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = Math.max(0, demoRoles.indexOf(selectedRole));

  useEffect(() => {
    function handleDocumentPointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleDocumentKey(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleDocumentPointer);
    document.addEventListener("keydown", handleDocumentKey);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointer);
      document.removeEventListener("keydown", handleDocumentKey);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      optionRefs.current[selectedIndex]?.focus();
    }
  }, [isOpen, selectedIndex]);

  function chooseRole(role: RoleName) {
    setSelectedRole(role);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function moveFocus(direction: 1 | -1, currentIndex: number) {
    const nextIndex = (currentIndex + direction + demoRoles.length) % demoRoles.length;
    optionRefs.current[nextIndex]?.focus();
  }

  return (
    <div ref={containerRef} className="role-switcher relative w-full sm:w-64">
      <label id="demo-role-switcher-label" htmlFor="demo-role-switcher" className="mb-1 block text-xs font-semibold text-slate-500">
        Role view
      </label>
      <input type="hidden" name="demoRole" value={selectedRole} readOnly />
      <button
        ref={triggerRef}
        id="demo-role-switcher"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="demo-role-switcher-listbox"
        aria-labelledby="demo-role-switcher-label demo-role-switcher-value"
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className="role-trigger focus-ring"
      >
        <span id="demo-role-switcher-value" className="min-w-0 truncate">
          {selectedRole}
        </span>
        <svg aria-hidden="true" viewBox="0 0 20 20" className={["size-4 shrink-0 transition", isOpen ? "rotate-180" : ""].join(" ")} fill="none">
          <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="role-menu shadow-command" role="presentation">
          <div id="demo-role-switcher-listbox" role="listbox" aria-labelledby="demo-role-switcher-label" className="sidebar-scroll max-h-72 overflow-y-auto p-1">
            {demoRoles.map((role, index) => {
              const isSelected = role === selectedRole;

              return (
                <button
                  key={role}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => chooseRole(role)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      moveFocus(1, index);
                    }

                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      moveFocus(-1, index);
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      chooseRole(role);
                    }
                  }}
                  className={["role-option focus-ring", isSelected ? "role-option-selected" : ""].join(" ")}
                >
                  <span className="min-w-0 truncate">{role}</span>
                  {isSelected ? (
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0" fill="none">
                      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
