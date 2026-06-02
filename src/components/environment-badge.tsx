export function EnvironmentBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs font-semibold text-cyan-100">
      {label}
    </span>
  );
}
