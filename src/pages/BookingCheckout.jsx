import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getBookingAPI, createCheckoutSessionAPI } from '../services/allAPI'
import { getFirstTurfImage } from '../utils/helpers'
import { Button } from '../components/ui/button'
import StatusBadge from '../components/common/StatusBadge'
import {
  AlertTriangle,
  Ban,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  Loader2,
  MapPin,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{children}</span>
    </div>
  )
}

function BookingCheckout() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    getBookingAPI(id).then((res) => {
      if (res.status === 200) {
        setBooking(res.data)
      } else {
        Toast.error(res.response?.data || 'Booking not found')
      }
      setLoading(false)
    })
  }, [id])

  const handlePay = async () => {
    setPaying(true)
    const res = await createCheckoutSessionAPI(id)
    if (res.status === 200 && res.data?.url) {
      window.location.href = res.data.url
      return
    }
    Toast.error('Unable to start payment')
    setPaying(false)
  }

  if (loading) {
    return <Loading text="Loading booking..." />
  }

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Booking not found.</p>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link to="/my-bookings">Go to My Bookings</Link>
        </Button>
      </div>
    )
  }

  const isPaid = booking.paymentStatus === 'paid'
  const isFailed = booking.paymentStatus === 'failed'
  const isRefunded = booking.paymentStatus === 'refunded'
  const canPay =
    (booking.paymentStatus === 'pending' || booking.paymentStatus === 'failed') &&
    booking.status === 'pending'
  const notAvailable = !isPaid && !canPay
  const unavailableTitle = isRefunded
    ? 'Booking Refunded'
    : booking.status === 'cancelled'
      ? 'Booking Cancelled'
      : booking.status === 'rejected'
        ? 'Booking Rejected'
        : 'Booking No Longer Available'
  const unavailableMessage = isRefunded
    ? 'Your payment was refunded and this booking is no longer active.'
    : 'This booking can no longer be paid online. If you still want the slot, create a new booking.'

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Checkout
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Booking Summary
        </h1>
      </div>

      {isPaid ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-card p-8 text-center shadow-xl shadow-black/20">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your slot is locked and the payment was successful.
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-background p-5 text-left">
            <Row label="Turf">{booking.turf.name}</Row>
            <Row label="Date">{booking.date}</Row>
            <Row label="Time Slot">
              {booking.startTime} – {booking.endTime} hrs
            </Row>
            <Row label="Amount">₹{booking.amount}</Row>
            <Row label="Payment">
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <Banknote className="size-3.5" />
                Stripe Test Mode
              </span>
            </Row>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-xl px-6">
              <Link to="/my-bookings">
                <CreditCard className="size-4" />
                View My Bookings
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-6">
              <Link to="/dashboard">
                <LayoutDashboard className="size-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      ) : notAvailable ? (
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl shadow-black/20">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <Ban className="size-8" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">
            {unavailableTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{unavailableMessage}</p>
          <div className="mt-8 flex justify-center">
            <Button asChild className="rounded-xl px-6">
              <Link to="/my-bookings">
                <CreditCard className="size-4" />
                Go to My Bookings
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Booking summary */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative h-48">
              <img
                src={getFirstTurfImage(booking.turf)}
                alt={booking.turf.name}
                className="size-full object-cover"
                onError={(e) => {
                  e.target.src = getFirstTurfImage({})
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {booking.turf.name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {booking.turf.location}
                </p>
              </div>
            </div>
            <div className="p-6">
              <Row label="Date">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-emerald-400" />
                  {booking.date}
                </span>
              </Row>
              <Row label="Time Slot">
                {booking.startTime} – {booking.endTime} hrs
              </Row>
              <Row label="Status">
                <StatusBadge status={booking.status} />
              </Row>
              <Row label="Payment">
                <StatusBadge status={booking.paymentStatus} />
              </Row>
              <Row label="Booking ID">
                <span className="font-mono">{booking._id.slice(-8)}</span>
              </Row>
            </div>
          </div>

          {/* Payment */}
          <div className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              <Wallet className="size-4 text-emerald-400" />
              Confirm Your Booking
            </h3>

            <div className="mt-5 flex items-center justify-between border-b border-border pb-6">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="font-heading text-3xl font-bold text-foreground">
                ₹{booking.amount}
              </span>
            </div>

            {isFailed && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
                <div>
                  <p className="text-xs font-bold text-red-300">Previous payment failed</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your booking has not been confirmed. You can try again.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <Banknote className="mt-0.5 size-4 shrink-0 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-300">Payment Method</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Secure checkout powered by Stripe (test mode).
                </p>
              </div>
            </div>

            <Button
              type="button"
              disabled={paying}
              onClick={handlePay}
              className="mt-6 h-12 w-full gap-2 rounded-xl text-sm shadow-[0_0_24px_rgba(16,185,129,0.25)]"
            >
              {paying ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating secure checkout...
                </>
              ) : (
                <>
                  <CreditCard className="size-4" />
                  Pay securely with Stripe
                </>
              )}
            </Button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              Test mode &bull; No real charge
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCheckout