import type { Tone } from "@/lib/status";
import { titleCase } from "@/lib/format";

const toneClasses: Record<Tone, string> = {
  neutral: "status-neutral",
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
  danger: "status-danger"
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <span className={["status-badge", toneClasses[tone]].join(" ")}>
      {titleCase(label)}
    </span>
  );
}
