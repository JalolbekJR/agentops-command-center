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
    <section className="page-hero">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow ? <p className="meta-label">{eyebrow}</p> : null}
          <h1 className="mt-2 max-w-4xl text-[1.45rem] font-semibold leading-tight tracking-normal text-[var(--text-strong)] sm:text-[1.85rem]">{title}</h1>
          {description ? <p className="page-header-copy mt-2 max-w-3xl text-sm leading-6">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}
