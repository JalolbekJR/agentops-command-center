export function SectionCard({
  title,
  description,
  action,
  children
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="section-card">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-50">{title}</h2>
          {description ? <p className="muted-copy mt-1 text-sm">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
