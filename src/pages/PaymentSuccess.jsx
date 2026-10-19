import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getStripeSessionAPI } from '../services/allAPI'
import { getFirstTurfImage } from '../utils/helpers'
import { Button } from '../components/ui/button'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Ticket,
} from 'lucide-react'

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{children}</span>
    </div>
  )
}

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  const pollRef = useRef(null)
  const inFlight = useRef(false)

  useEffect(() => {
    if (!sessionId) return

    const stopPolling = () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
    const isTerminal = (d) =>
      d.paymentStatus !== 'pending' ||
      d.bookingStatus === 'cancelled' ||
      d.bookingStatus === 'rejected'

    const fetchSession = async () => {
      if (inFlight.current) return
      inFlight.current = true
      try {
        const res = await getStripeSessionAPI(sessionId)
        if (res.status === 200) {
          setData(res.data)
          if (isTerminal(res.data)) stopPolling()
          return
        }
        setFailed(true)
        stopPolling()
        Toast.error(res.response?.data || 'Unable to verify payment')
      } finally {
        inFlight.current = false
      }
    }

    stopPolling()
    fetchSession()
    pollRef.current = setInterval(fetchSession, 2500)
    return stopPolling
  }, [sessionId, retry])

  if (!sessionId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Missing Payment Reference</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn't verify this payment. Check your bookings to see the latest status.
        </p>
        <Button asChild className="rounded-xl px-6">
          <Link to="/my-bookings">Go to My Bookings</Link>
        </Button>
      </div>
    )
  }

  if (failed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Unable to Verify Payment</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn't confirm this payment. Check your bookings to see the latest status.
        </p>
        <Button asChild className="rounded-xl px-6">
          <Link to="/my-bookings">Go to My Bookings</Link>
        </Button>
      </div>
    )
  }

  if (!data) {
    return <Loading text="Verifying payment..." />
  }

  const isPaid = data.paymentStatus === 'paid'
  const notConfirmed =
    data.paymentStatus === 'failed' ||
    data.paymentStatus === 'refunded' ||
    data.bookingStatus === 'cancelled' ||
    data.bookingStatus === 'rejected'

  if (notConfirmed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Payment Not Confirmed</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {data.bookingStatus === 'cancelled' || data.bookingStatus === 'rejected'
            ? 'This booking is no longer active.'
            : 'Your payment could not be confirmed. Check your bookings to see the latest status.'}
        </p>
        <Button asChild className="rounded-xl px-6">
          <Link to="/my-bookings">Go to My Bookings</Link>
        </Button>
      </div>
    )
  }

  if (!isPaid) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <Loader2 className="size-8 animate-spin" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Confirming your payment...</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Stripe is processing your test payment. This usually takes just a few seconds.
        </p>
        <Button asChild variant="outline" className="rounded-xl px-6">
          <Link to="/my-bookings">View My Bookings</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-xl text-xs"
          onClick={() => setRetry((r) => r + 1)}
        >
          <RotateCcw className="size-3.5" />
          Refresh status
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-emerald-500/30 bg-card p-8 text-center shadow-xl shadow-black/20">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 animate-in zoom-in-95">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
          Payment Successful
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your turf booking is confirmed.
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <ShieldCheck className="size-3.5" />
          Stripe Test Mode
        </span>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border text-left">
          <div className="relative h-40">
            <img
              src={getFirstTurfImage(data.turf)}
              alt={data.turf?.name}
              className="size-full object-cover"
              onError={(e) => {
                e.target.src = getFirstTurfImage({})
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground">
                <MapPin className="size-4 text-emerald-400" />
                {data.turf?.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{data.turf?.location}</p>
            </div>
          </div>
          <div className="bg-background p-5">
            <Row label="Date">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-emerald-400" />
                {data.date}
              </span>
            </Row>
            <Row label="Time">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-emerald-400" />
                {data.startTime} – {data.endTime} hrs
              </span>
            </Row>
            <Row label="Amount">₹{data.amount}</Row>
            <Row label="Booking ID">
              <span className="inline-flex items-center gap-1.5 font-mono text-emerald-400">
                <Ticket className="size-3.5" />
                {String(data.bookingId ?? '').slice(-8) || '—'}
              </span>
            </Row>
            <Row label="Payment">
              <span className="text-emerald-400">Stripe Test Mode</span>
            </Row>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-xl px-6">
            <Link to="/my-bookings">
              <CreditCard className="size-4" />
              View My Bookings
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-6">
            <Link to="/">
              <Home className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess