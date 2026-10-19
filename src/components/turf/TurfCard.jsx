import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, ArrowRight } from 'lucide-react'
import { getFirstTurfImage } from '../../utils/helpers'
import { Button } from '../ui/button'
import { cn } from 'cn'

function TurfCard({ turf }) {
  const [favorite, setFavorite] = useState(false)

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-black/20">
      <Link to={`/turfs/${turf._id}`} className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={getFirstTurfImage(turf)}
          alt={turf.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = getFirstTurfImage({})
          }}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase backdrop-blur-sm">
            {turf.sport}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-black/50 px-2 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
            <Star className="size-3 fill-current" />
            {turf.rating > 0 ? Number(turf.rating).toFixed(1) : 'New'}
          </span>
        </div>
      </Link>

      <div className="relative -mt-8 p-5">
        <button
          type="button"
          onClick={() => setFavorite((f) => !f)}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={favorite}
          className={cn(
            'absolute top-1 right-4 flex size-9 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm backdrop-blur transition-all hover:scale-105',
            favorite ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'
          )}
        >
          <Heart className={cn('size-4', favorite && 'fill-current')} />
        </button>

        <h3 className="truncate font-heading text-lg font-semibold text-foreground">
          <Link to={`/turfs/${turf._id}`} className="transition-colors hover:text-emerald-400">
            {turf.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {turf.location}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
              From / hour
            </p>
            <p className="font-heading text-xl font-bold text-foreground">
              ₹{turf.pricePerHour}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-lg">
            <Link to={`/turfs/${turf._id}`}>
              View
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default TurfCard