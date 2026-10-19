import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  Handshake,
  ListChecks,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'
import { getAllTurfsAPI } from '../services/allAPI'
import { Button } from '../components/ui/button'

const VALUES = [
  {
    icon: Handshake,
    title: 'Fair Play',
    text: 'No double bookings, no hidden charges. Transparent pricing from verified venues.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    text: 'Real availability, honest ratings and clear slot pricing across every turf.',
  },
  {
    icon: Users,
    title: 'Community First',
    text: 'We build features around players, captains and local venue owners — not around ads.',
  },
  {
    icon: Trophy,
    title: 'Game-Quality',
    text: 'Every listed venue is reviewed for surface, lighting and safety standards.',
  },
]

const AUDIENCES = [
  {
    icon: Users,
    title: 'For Players',
    points: ['Book slots in seconds', 'Build and manage squads', 'Track match history'],
  },
  {
    icon: MapPin,
    title: 'For Turf Owners',
    points: ['Add and manage venues', 'Accept or reject bookings', 'Monitor earnings live'],
  },
  {
    icon: ShieldCheck,
    title: 'For The Community',
    points: ['Verified venue standards', 'Safe demo-payment checkout', 'Active matchmaking culture'],
  },
]

function StatTile({ value, label, delay }) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 text-center"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="font-heading text-2xl font-bold text-emerald-400 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">{label}</p>
    </div>
  )
}

function About() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAllTurfsAPI().then((res) => {
      if (res.status === 200) {
        setStats({
          venues: res.data.length,
          cities: new Set(res.data.map((t) => t.location)).size,
          sports: new Set(res.data.map((t) => t.sport)).size,
        })
      }
    })
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
          <Sparkles className="size-3.5" />
          About TurfMate
        </span>
        <h1 className="mt-6 font-heading text-4xl leading-[1.1] font-bold text-foreground sm:text-5xl">
          We're connecting players to their
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {' '}
            perfect pitch.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          TurfMate started with a simple frustration: finding, booking and managing a sports turf
          was painfully manual. We built one platform where players, captains and venue owners
          coordinate on the same page — literally.
        </p>
      </div>

      {/* Live stats */}
      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4">
        <StatTile value={stats ? stats.venues : '—'} label="Venues live" delay={0} />
        <StatTile value={stats ? stats.cities : '—'} label="City hubs" delay={100} />
        <StatTile value={stats ? stats.sports : '—'} label="Sports" delay={200} />
      </div>

      {/* Mission */}
      <section className="mx-auto mt-20 max-w-4xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Our Mission
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground">
              Get everyone off the sidelines
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We believe every city has amazing playing grounds hidden behind spreadsheets and
              phone calls. TurfMate surfaces them in one searchable, bookable network — so a
              casual five-a-side on Wednesday night is as easy as ordering food.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For owners, that means smarter bookings, fewer empty hours and clear revenue
              dashboards. For players, it means your turf, your slot, locked in seconds.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative flex flex-col gap-4">
              {[
                { icon: ListChecks, title: 'Slot-level booking engine', text: 'Real-time this turf today, cancelled instantly.' },
                { icon: ShoppingBag, title: 'One-page checkout', text: 'Demo payment flow, instant confirmation.' },
                { icon: Users, title: 'Squad & match tools', text: 'Teams, players and full match history.' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <f.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-semibold text-foreground">{f.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mt-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            What drives us
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Our Core Values
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-emerald-500/30"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <v.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="mt-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            Built for everyone in the game
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Who TurfMate Serves
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-card p-6">
              <a.icon className="size-6 text-emerald-400" />
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{a.title}</h3>
              <ul className="mt-3 space-y-2">
                {a.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-background to-background px-6 py-14 text-center">
          <div className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          <h2 className="relative font-heading text-3xl font-bold text-foreground">
            New to TurfMate? Lace up.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Find a venue near you, create your team and lock in your next match in under a minute.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-8">
              <Link to="/turfs">
                Explore Turfs
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8">
              <Link to="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About