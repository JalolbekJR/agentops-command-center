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
    <section className="rounded-lg border border-white/[0.07] bg-[#0b0f17]/78 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="text-[11px] font-semibold uppercase text-slate-500">{eyebrow}</p> : null}
          <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-normal text-slate-50 sm:text-[1.9rem]">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}
