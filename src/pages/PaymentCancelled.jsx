import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Toast from '../components/Toast'
import { getBookingAPI } from '../services/allAPI'
import { Button } from '../components/ui/button'
import { AlertTriangle, RotateCcw, Ticket } from 'lucide-react'

function PaymentCancelled() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    if (!bookingId) return
    getBookingAPI(bookingId).then((res) => {
      if (res.status === 200) {
        setBooking(res.data)
      } else {
        Toast.error(res.response?.data || 'Booking not found')
      }
    })
  }, [bookingId])

  const retryPath = bookingId ? `/booking/${bookingId}` : '/my-bookings'

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-xl shadow-black/20">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your payment was not completed and your booking is still unpaid.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your reservation has been kept — you can try again below.
        </p>

        {booking && (
          <div className="mt-6 rounded-2xl border border-border bg-background p-5 text-left text-sm">
            <div className="flex items-center justify-between border-b border-border/60 py-2.5">
              <span className="text-muted-foreground">Turf</span>
              <span className="font-semibold text-foreground">{booking.turf?.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 py-2.5">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold text-foreground">{booking.date}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/60 py-2.5">
              <span className="text-muted-foreground">Time</span>
              <span className="font-semibold text-foreground">
                {booking.startTime} – {booking.endTime} hrs
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">₹{booking.amount}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-xl px-6">
            <Link to={retryPath}>
              <RotateCcw className="size-4" />
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-6">
            <Link to="/my-bookings">
              <Ticket className="size-4" />
              Back to Bookings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelled