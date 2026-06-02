import type { Tone } from "@/lib/status";
import { titleCase } from "@/lib/format";

const toneClasses: Record<Tone, string> = {
  neutral: "border-slate-400/20 bg-slate-400/10 text-slate-200",
  info: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
  success: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  warning: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  danger: "border-rose-300/25 bg-rose-300/10 text-rose-100"
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return (
    <span className={["inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold", toneClasses[tone]].join(" ")}>
      {titleCase(label)}
    </span>
  );
}
