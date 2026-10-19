import { cn } from 'cn'

function PageHeader({ eyebrow, title, description, children, className }) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

export default PageHeader