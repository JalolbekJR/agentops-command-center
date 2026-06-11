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

const labelByAccess: Record<AccessLevel, string> = {
  full: "Owner access",
  configure: "Workspace access",
  read: "View access",
  redacted: "Redacted view",
  locked: "Role locked"
};

export function getAccessLevelLabel(level: AccessLevel) {
  return labelByAccess[level];
}

export function PermissionBadge({ level }: { level: AccessLevel }) {
  return <StatusBadge label={getAccessLevelLabel(level)} tone={toneByAccess[level]} />;
}
