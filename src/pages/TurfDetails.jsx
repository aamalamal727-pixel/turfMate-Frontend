import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getTurfAPI, getTurfBookingsAPI, createBookingAPI } from '../services/allAPI'
import { getImageUrl, getFirstTurfImage } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb'
import { MapPin, Star, CalendarDays, Check, AlertTriangle, Clock, ChevronLeft } from 'lucide-react'
import { cn } from 'cn'

const SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
]

const getNextDays = (count) => {
  const days = []
  for (let i = 0; i < count; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    days.push({
      iso,
      label:
        i === 0
          ? 'Today'
          : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    })
  }
  return days
}

function TurfDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [turf, setTurf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookedSlots, setBookedSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(getNextDays(7)[0].iso)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const days = getNextDays(7)

  useEffect(() => {
    getTurfAPI(id).then((res) => {
      if (res.status === 200) {
        setTurf(res.data)
      } else {
        Toast.error(res.response?.data || 'Turf not found')
      }
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getTurfBookingsAPI(id, selectedDate).then((res) => {
      if (!cancelled && res.status === 200) {
        setBookedSlots(res.data.map((b) => b.startTime))
      }
    })
    return () => {
      cancelled = true
    }
  }, [selectedDate, id, token])

  const handleSelectDate = (iso) => {
    setSelectedDate(iso)
    setSelectedSlot('')
  }

  const handleBook = async () => {
    if (!token) {
      Toast.info('Please login to book a turf')
      navigate('/login')
      return
    }
    if (!selectedSlot) {
      Toast.error('Please select a time slot')
      return
    }
    setBookingInProgress(true)
    const start = selectedSlot
    const [h, m] = start.split(':').map(Number)
    const endHour = h + 1
    const end = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const res = await createBookingAPI({
      turfId: id,
      date: selectedDate,
      startTime: start,
      endTime: end,
      amount: turf.pricePerHour,
    })
    if (res.status === 200) {
      Toast.success('Slot locked! Proceed to payment.')
      setBookedSlots([...bookedSlots, start])
      navigate(`/booking/${res.data._id}`)
    } else {
      Toast.error(res.response?.data || 'Slot booking failed')
    }
    setBookingInProgress(false)
  }

  if (loading) {
    return <Loading text="Loading turf details..." />
  }

  if (!turf) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Turf not found.</p>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link to="/turfs">
            <ChevronLeft />
            Back to all turfs
          </Link>
        </Button>
      </div>
    )
  }

  const available = turf.isAvailable

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/turfs">Turfs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[240px]">{turf.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Gallery */}
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img
              src={getFirstTurfImage(turf)}
              alt={turf.name}
              className="aspect-[16/9] w-full object-cover"
              onError={(e) => {
                e.target.src = getFirstTurfImage({})
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            {available ? (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Available
              </span>
            ) : (
              <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/70 px-3 py-1 text-xs font-semibold text-red-300 backdrop-blur">
                <span className="size-1.5 rounded-full bg-red-400" />
                Currently Unavailable
              </span>
            )}

            {turf.images && turf.images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {turf.images.slice(0, 4).map((img, i) => (
                  <img
                    key={i}
                    src={getImageUrl(img)}
                    alt={`${turf.name} ${i + 1}`}
                    className="h-14 w-20 rounded-xl border-2 border-background object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title block */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                {turf.sport}
              </span>
              <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                {turf.surface}
              </span>
              {turf.rating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400">
                  <Star className="size-3 fill-current" />
                  {Number(turf.rating).toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {turf.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-emerald-400" />
              {turf.location}
            </p>
          </div>

          {/* About */}
          <section className="border-t border-border pt-6">
            <h2 className="font-heading text-xl font-bold text-foreground">About Venue</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {turf.description || 'A premium sports turf for your next match.'}
            </p>
          </section>

          {/* Amenities */}
          {turf.facilities && turf.facilities.length > 0 && (
            <section className="border-t border-border pt-6">
              <h2 className="font-heading text-xl font-bold text-foreground">Amenities</h2>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {turf.facilities.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground"
                  >
                    <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Check className="size-3.5" />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Booking panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20">
              <div className="border-b border-border pb-4">
                <p className="text-xs tracking-wider text-muted-foreground uppercase">Price</p>
                <p className="mt-1 font-heading text-3xl font-bold text-foreground">
                  ₹{turf.pricePerHour} <span className="text-sm font-normal text-muted-foreground">/hr</span>
                </p>
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold text-foreground">Select Date</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => handleSelectDate(d.iso)}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-xs font-bold transition-all',
                        selectedDate === d.iso
                          ? 'border-emerald-400 bg-emerald-500 text-emerald-950'
                          : 'border-border bg-background text-muted-foreground hover:border-emerald-500/50'
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Available Time Slots</label>
                  {selectedSlot && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <Clock className="size-3" />
                      {selectedSlot}
                    </span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {SLOTS.map((slot) => {
                    const booked = bookedSlots.includes(slot)
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={booked || !available}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          'rounded-xl border py-2 text-xs font-bold transition-all',
                          booked
                            ? 'cursor-not-allowed border-border bg-muted/40 text-muted-foreground/40 line-through'
                            : !available
                              ? 'cursor-not-allowed border-border bg-muted/40 text-muted-foreground/40'
                              : selectedSlot === slot
                                ? 'border-emerald-400 bg-emerald-500 text-emerald-950'
                                : 'border-border bg-background text-muted-foreground hover:border-emerald-500/50'
                        )}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                type="button"
                disabled={bookingInProgress || !available}
                onClick={handleBook}
                className="mt-6 h-12 w-full rounded-xl text-sm shadow-[0_0_24px_rgba(16,185,129,0.25)]"
              >
                {bookingInProgress ? 'Booking...' : available ? 'Book Turf' : 'Unavailable'}
              </Button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 text-emerald-400" />
                Free cancellation up to 24 hours before your slot.
              </p>
            </div>

            {!available && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                This venue is currently listed as unavailable. Please check back later.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurfDetails