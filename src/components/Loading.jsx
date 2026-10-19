import { Loader2 } from 'lucide-react'

function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

export default Loading