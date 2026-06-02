import type { Tone } from "@/lib/status";

const toneClasses: Record<Tone, string> = {
  neutral: "before:bg-slate-400/50",
  info: "before:bg-sky-300/65",
  success: "before:bg-emerald-300/65",
  warning: "before:bg-amber-300/70",
  danger: "before:bg-rose-300/70"
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
    <article className={["relative overflow-hidden rounded-lg border border-white/[0.07] bg-[#0b0f17]/84 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.2)] transition before:absolute before:inset-x-0 before:top-0 before:h-px hover:bg-[#0d121c]", toneClasses[tone]].join(" ")}>
      <p className="text-[11px] font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-slate-50 sm:text-[1.7rem]">{value}</p>
      <p className="mt-2 text-sm leading-5 text-slate-500">{detail}</p>
    </article>
  );
}
