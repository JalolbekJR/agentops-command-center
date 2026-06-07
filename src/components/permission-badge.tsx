import { StatusBadge } from "@/components/status-badge";
import type { AccessLevel } from "@/lib/platform-permissions";
import type { Tone } from "@/lib/status";

const toneByAccess: Record<AccessLevel, Tone> = {
  full: "success",
  configure: "success",
  read: "info",
  redacted: "neutral",
  locked: "warning"
};

export function PermissionBadge({ level }: { level: AccessLevel }) {
  return <StatusBadge label={level === "configure" ? "workspace-level" : level} tone={toneByAccess[level]} />;
}
