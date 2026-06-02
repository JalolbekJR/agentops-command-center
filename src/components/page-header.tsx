export function PageHeader({
  title,
  description,
  eyebrow,
  action
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/70 p-4 shadow-command sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="text-xs font-semibold uppercase text-cyan-200">{eyebrow}</p> : null}
          <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-normal text-white sm:text-3xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}
