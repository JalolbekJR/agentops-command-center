import type { Tone } from "@/lib/status";
import type { OwnerControlAction, OwnerControlSetting } from "@/types/owner-control";

export function isOwnerOnlyAction(action: OwnerControlAction | OwnerControlSetting) {
  return action.ownerOnly === true;
}

export function isWorkspaceLevelAction(action: OwnerControlAction) {
  return action.workspaceConfigurable && !action.ownerOnly;
}

export function getOwnerControlTone(setting: OwnerControlSetting): Tone {
  switch (setting.status) {
    case "demo_visible":
      return "info";
    case "planned_backend_enforced":
      return "warning";
    case "future":
      return "neutral";
    default:
      return "neutral";
  }
}

export function summarizeOwnerControls(settings: OwnerControlSetting[]) {
  const demoVisible = settings.filter((setting) => setting.status === "demo_visible").length;
  const backendEnforced = settings.filter((setting) => setting.status === "planned_backend_enforced").length;
  const future = settings.filter((setting) => setting.status === "future").length;

  return `${demoVisible} demo-visible controls, ${backendEnforced} planned backend-enforced controls, ${future} future controls.`;
}
