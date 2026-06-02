export function EmptyState({
  title,
  body
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-white/12 bg-white/[0.026] p-6 text-center">
      <p className="text-sm font-semibold text-slate-50">{title}</p>
      <p className="muted-copy mx-auto mt-2 max-w-xl text-sm">{body}</p>
    </div>
  );
}
