import { cn } from 'cn'

const accents = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
  sky: 'bg-sky-500/10 text-sky-400',
  purple: 'bg-purple-500/10 text-purple-400',
  red: 'bg-red-500/10 text-red-400',
}

function StatCard({ label, value, icon: Icon, accent = 'emerald', className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl border border-border bg-card p-5',
        className
      )}
    >
      <div>
        <p className="font-heading text-3xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
      </div>
      {Icon && (
        <div className={cn('flex size-10 items-center justify-center rounded-xl', accents[accent])}>
          <Icon className="size-4" />
        </div>
      )}
    </div>
  )
}

export default StatCard