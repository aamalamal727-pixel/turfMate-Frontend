import { TriangleAlert, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'

function ErrorState({ title = "We couldn't load this.", description, onRetry, className }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-border bg-card/40 px-6 py-16 text-center ${className || ''}`}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onRetry}>
          <RotateCcw />
          Retry
        </Button>
      )}
    </div>
  )
}

export default ErrorState