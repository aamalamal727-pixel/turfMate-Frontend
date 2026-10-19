import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getMyBookingsAPI, cancelBookingAPI } from '../services/allAPI'
import { getFirstTurfImage } from '../utils/helpers'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { getMyBookingsCount } from '../utils/helpers'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CalendarDays, CalendarX2, Clock, IndianRupee, MapPin, Ticket } from 'lucide-react'
import { cn } from 'cn'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = () => {
    getMyBookingsAPI().then((res) => {
      if (res.status === 200) {
        setBookings(res.data)
      } else {
        Toast.error(res.response?.data || 'Failed to load bookings')
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const handleCancel = async (id) => {
    const res = await cancelBookingAPI(id)
    if (res.status === 200) {
      Toast.success('Booking cancelled')
      loadBookings()
    } else {
      Toast.error(res.response?.data || 'Failed to cancel booking')
    }
  }

  const summary = getMyBookingsCount(bookings)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Your Reservations
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track, pay and manage all your turf reservations.
        </p>
      </div>

      {loading ? (
        <Loading text="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="Explore turfs and secure your first slot — it only takes a minute."
          action={
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/turfs">Explore Turfs</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total bookings" value={summary.total} icon={Ticket} />
            <StatCard label="Pending" value={summary.pending} icon={CalendarDays} accent="amber" />
            <StatCard label="Confirmed" value={summary.confirmed} icon={CalendarDays} accent="sky" />
            <StatCard label="Spent (₹)" value={summary.spent} icon={IndianRupee} accent="purple" />
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <article
                key={b._id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-emerald-500/30 sm:flex-row sm:items-center"
              >
                <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
                  <img
                    src={getFirstTurfImage(b.turf)}
                    alt={b.turf.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      e.target.src = getFirstTurfImage({})
                    }}
                  />
                  <Badge
                    variant="secondary"
                    className="absolute bottom-1.5 left-1.5 bg-background/80 text-foreground backdrop-blur"
                  >
                    {b.turf.sport}
                  </Badge>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading text-base font-semibold text-foreground">
                    {b.turf.name}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5 text-emerald-400" />
                      {b.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5 text-emerald-400" />
                      {b.startTime} – {b.endTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-emerald-400" />
                      {b.turf.location}
                    </span>
                  </p>
                  <p className="mt-1.5 font-semibold text-foreground">₹{b.amount}</p>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={b.status} />
                    <StatusBadge status={b.paymentStatus === 'paid' ? 'paid' : 'pending'} />
                  </div>
                  {b.status === 'pending' && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(
                        'rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleCancel(b._id)}
                        className="inline-flex items-center gap-1.5"
                      >
                        <CalendarX2 />
                        Cancel
                      </button>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MyBookings