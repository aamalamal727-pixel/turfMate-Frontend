import { cn } from 'cn'
import { statusBadge } from '../../utils/helpers'
import { Dot } from 'lucide-react'

function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase',
        statusBadge(status),
        className
      )}
    >
      <Dot className="size-3 -ml-0.5" />
      {status}
    </span>
  )
}

export default StatusBadge