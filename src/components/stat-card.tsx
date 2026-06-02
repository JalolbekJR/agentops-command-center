import type { Tone } from "@/lib/status";

const toneClasses: Record<Tone, string> = {
  neutral: "",
  info: "stat-card-tone-info",
  success: "stat-card-tone-success",
  warning: "stat-card-tone-warning",
  danger: "stat-card-tone-danger"
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
    <article className={["stat-card", toneClasses[tone]].join(" ")}>
      <p className="meta-label">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-slate-50 sm:text-[1.7rem]">{value}</p>
      <p className="subtle-copy mt-2 text-sm leading-5">{detail}</p>
    </article>
  );
}
