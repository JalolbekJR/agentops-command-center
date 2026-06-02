import type { Tone } from "@/lib/status";

const toneClasses: Record<Tone, string> = {
  neutral: "border-white/10 bg-slate-900/65",
  info: "border-cyan-300/20 bg-cyan-300/[0.08]",
  success: "border-emerald-300/20 bg-emerald-300/[0.08]",
  warning: "border-amber-300/20 bg-amber-300/[0.08]",
  danger: "border-rose-300/20 bg-rose-300/[0.08]"
};

export function StatCard({
  label,
  value,
  detail,
  tone = "neutral"
}: {
  label: string;
  value: string;
  detail: string;
  tone?: Tone;
}) {
  return (
    <article className={["rounded-lg border p-4 shadow-command transition hover:border-white/20", toneClasses[tone]].join(" ")}>
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-white sm:text-3xl">{value}</p>
      <p className="mt-2 text-sm leading-5 text-slate-400">{detail}</p>
    </article>
  );
}
