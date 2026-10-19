import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import {
  getOwnerBookingsAPI,
  getOwnerEarningsAPI,
  updateBookingStatusAPI,
} from '../services/allAPI'
import { getFirstTurfImage } from '../utils/helpers'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { Button } from '../components/ui/button'
import { CalendarDays, CheckCircle2, IndianRupee, Timer, XCircle } from 'lucide-react'

function OwnerBookings() {
  const [bookings, setBookings] = useState([])
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([getOwnerBookingsAPI(), getOwnerEarningsAPI()]).then(([bkRes, earnRes]) => {
      if (bkRes.status === 200) setBookings(bkRes.data)
      if (earnRes.status === 200) setEarnings(earnRes.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id, status) => {
    const res = await updateBookingStatusAPI(id, status)
    if (res.status === 200) {
      Toast.success(`Booking ${status}`)
      load()
    } else {
      Toast.error(res.response?.data || 'Failed to update booking')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Owner</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Bookings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage incoming requests and track your venue revenue.
        </p>
      </div>

      {loading ? (
        <Loading text="Loading bookings..." />
      ) : (
        <>
          {earnings && (
            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
              <StatCard label="Revenue (₹)" value={earnings.totalEarnings} icon={IndianRupee} />
              <StatCard label="Pending" value={earnings.pendingCount} icon={Timer} accent="amber" />
              <StatCard label="Total Bookings" value={earnings.totalBookings} icon={CalendarDays} accent="sky" />
            </div>
          )}

          {bookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No bookings on your turfs yet"
              description="Share your turf listings to start receiving booking requests."
            />
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center"
                >
                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl md:h-16 md:w-24">
                    <img
                      src={getFirstTurfImage(b.turf)}
                      alt={b.turf?.name}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.target.src = getFirstTurfImage({})
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {b.user?.username}
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        ({b.user?.email})
                      </span>
                    </h3>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{b.turf?.name}</span>
                      <span>{b.date}</span>
                      <span>
                        {b.startTime} – {b.endTime}
                      </span>
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      ₹{b.amount} • Payment:{' '}
                      <span className="font-semibold text-emerald-400">{b.paymentStatus}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <StatusBadge status={b.status} />
                    <div className="flex flex-wrap gap-2">
                      {b.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="rounded-lg"
                            onClick={() => updateStatus(b._id, 'confirmed')}
                          >
                            <CheckCircle2 />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => updateStatus(b._id, 'rejected')}
                          >
                            <XCircle />
                            Reject
                          </Button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                          onClick={() => updateStatus(b._id, 'completed')}
                        >
                          <CheckCircle2 />
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OwnerBookings