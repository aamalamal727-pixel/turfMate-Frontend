import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getMyTurfsAPI, deleteTurfAPI } from '../services/allAPI'
import { getFirstTurfImage } from '../utils/helpers'
import EmptyState from '../components/common/EmptyState'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Building2, Eye, Pencil, Plus, Star, Trash2 } from 'lucide-react'

function MyTurfs() {
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTurfs = () => {
    getMyTurfsAPI().then((res) => {
      if (res.status === 200) {
        setTurfs(res.data)
      } else {
        Toast.error(res.response?.data || 'Failed to load turfs')
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    loadTurfs()
  }, [])

  const handleDelete = async (id) => {
    const res = await deleteTurfAPI(id)
    if (res.status === 200) {
      Toast.success('Turf deleted')
      loadTurfs()
    } else {
      Toast.error(res.response?.data || 'Failed to delete turf')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Owner</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            My Turfs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your listed venues and availability.
          </p>
        </div>
        <Button asChild className="rounded-xl px-6">
          <Link to="/add-turf">
            <Plus />
            Add New Turf
          </Link>
        </Button>
      </div>

      {loading ? (
        <Loading text="Loading your turfs..." />
      ) : turfs.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="You haven't added any turfs yet"
          description="List your first venue on TurfMate and start receiving bookings."
          action={
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/add-turf">
                <Plus />
                Add Your First Turf
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {turfs.map((t) => (
            <div
              key={t._id}
              className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
                <img
                  src={getFirstTurfImage(t)}
                  alt={t.name}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.target.src = getFirstTurfImage({})
                  }}
                />
                {!t.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-bold tracking-wider text-red-300 uppercase">
                    Hidden
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-heading text-lg font-bold text-foreground">
                  {t.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.location} • ₹{t.pricePerHour} /hour
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="secondary" className="rounded-lg text-xs">
                    {t.sport}
                  </Badge>
                  <Badge variant="secondary" className="rounded-lg text-xs">
                    {t.surface}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-lg text-xs text-amber-400"
                  >
                    <Star className="size-3 fill-current" />
                    {t.rating > 0 ? Number(t.rating).toFixed(1) : 'New'}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`rounded-lg text-xs ${
                      t.isAvailable ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {t.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-lg">
                  <Link to={`/turfs/${t._id}`}>
                    <Eye />
                    View
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-lg">
                  <Link to={`/edit-turf/${t._id}`}>
                    <Pencil />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => handleDelete(t._id)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTurfs