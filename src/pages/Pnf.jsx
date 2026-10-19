import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../components/ui/button'

function Pnf() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="relative mx-auto max-w-lg text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-3xl border border-border bg-card font-heading text-4xl font-bold text-emerald-400 shadow-xl shadow-black/20">
          404
        </div>
        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Out of Bounds!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page or turf location you are looking for doesn't exist or has been moved to another
          pitch.
        </p>
        <div className="mt-8">
          <Button asChild className="rounded-xl px-7">
            <Link to="/turfs">
              <Home />
              Back to All Turfs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pnf