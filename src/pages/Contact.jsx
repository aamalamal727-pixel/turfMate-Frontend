import { useState } from 'react'
import {
  Building2,
  Clock4,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react'
import Toast from '../components/Toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'

const INFO = [
  {
    icon: Mail,
    title: 'Email us',
    lines: ['support@turfmate.com'],
  },
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+91 98765 43210'],
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    lines: ['TurfMate Sports Private Limited', 'Kochi, Kerala, India'],
  },
  {
    icon: Clock4,
    title: 'Support hours',
    lines: ['Monday – Sunday', '9:00 AM – 9:00 PM IST'],
  },
]

const FAQS = [
  {
    q: 'How do I book a turf?',
    a: 'Search for a venue, pick a date and an available time slot, then confirm with the demo checkout. The booking is locked instantly.',
  },
  {
    q: 'Can I cancel a booking?',
    a: "Yes. Pending bookings can be cancelled from your My Bookings dashboard. Cancellation is free up to 24 hours before your slot.",
  },
  {
    q: 'How does the demo payment work?',
    a: 'Payments are simulated for testing — no real money is charged. The checkout flow validates the full booking pipeline end-to-end.',
  },
  {
    q: 'I own a turf. How do I list it?',
    a: "Register as an owner, sign in and use Add Turf from your dashboard to publish your venue details, photos and hourly pricing.",
  },
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setForm({ name: '', email: '', subject: '', message: '' })
      Toast.success('Message sent! We will get back to you soon.')
    }, 700)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
          <Sparkles className="size-3.5" />
          Contact TurfMate
        </span>
        <h1 className="mt-6 font-heading text-4xl leading-[1.1] font-bold text-foreground sm:text-5xl">
          We'd love to hear from you
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Questions about a booking, feedback on a venue, or interested in listing your ground?
          Drop us a line and our team will respond within one business day.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Info cards */}
        <div className="space-y-4">
          {INFO.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <item.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                {item.lines.map((l) => (
                  <p key={l} className="mt-0.5 text-xs text-muted-foreground">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-emerald-300">
              <Building2 className="size-4" />
              Own a turf?
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Join our venue partner program and get your ground listed, managed and discovered by
              players — at no setup cost.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Your Name *</Label>
              <Input
                id="c-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email Address *</Label>
              <Input
                id="c-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="player@turfmate.com"
                className="h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-subject">Subject</Label>
            <Input
              id="c-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Booking query, partnership, feedback..."
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-message">Message *</Label>
            <Textarea
              id="c-message"
              rows={6}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message here..."
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={sending} className="h-12 rounded-xl px-8">
              <Send />
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquareText className="size-3.5 text-emerald-400" />
              We reply within one business day.
            </p>
          </div>
        </form>
      </div>

      {/* FAQ */}
      <section className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm font-semibold text-foreground">{f.q}</span>
                <span
                  className={`text-emerald-400 transition-transform ${
                    open === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="border-t border-border px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Contact