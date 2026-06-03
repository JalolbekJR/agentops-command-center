import type { SetupHealthCheck, SetupStep } from "@/types/setup";
import type { Tone } from "@/lib/status";

export function getSetupHealthTone(status: SetupHealthCheck["status"]): Tone {
  switch (status) {
    case "healthy":
      return "success";
    case "warning":
      return "warning";
    case "not_configured":
      return "neutral";
    case "future":
      return "info";
    default:
      return "neutral";
  }
}

export function getSetupStepTone(status: SetupStep["status"]): Tone {
  switch (status) {
    case "ready":
      return "success";
    case "needs_input":
      return "warning";
    case "blocked_by_plan":
      return "danger";
    case "future_backend":
      return "info";
    default:
      return "neutral";
  }
}

export function summarizeSetupHealth(checks: SetupHealthCheck[]) {
  const healthy = checks.filter((check) => check.status === "healthy").length;
  const needsWork = checks.filter((check) => check.status === "warning" || check.status === "not_configured").length;
  const future = checks.filter((check) => check.status === "future").length;

  return `${healthy} healthy, ${needsWork} need setup, ${future} future backend checks.`;
}
