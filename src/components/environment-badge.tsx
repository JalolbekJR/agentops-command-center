export function EnvironmentBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-white/[0.055] px-2 py-1 text-xs font-semibold text-slate-300">
      {label}
    </span>
  );
}
