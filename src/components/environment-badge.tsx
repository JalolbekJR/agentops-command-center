export function EnvironmentBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-1 text-xs font-semibold text-slate-300">
      {label}
    </span>
  );
}
