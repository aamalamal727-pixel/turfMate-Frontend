import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
  Sparkles,
  Users2,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react'
import TurfCard from '../components/turf/TurfCard'
import TurfCardSkeleton from '../components/turf/TurfCardSkeleton'
import TurfSearch from '../components/turf/TurfSearch'
import { getAllTurfsAPI } from '../services/allAPI'
import Toast from '../components/Toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1920&auto=format&fit=crop'

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis']

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Find a Turf',
    text: 'Search and filter premium venues by sport, city and price.',
  },
  {
    icon: CalendarDays,
    step: '02',
    title: 'Choose a Slot',
    text: 'Pick a date and an available time slot on your turf.',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Book & Play',
    text: 'Confirm with a demo payment and get on the field instantly.',
  },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Slots',
    text: 'Real-time scheduling prevents slot conflicts and delays.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Venues',
    text: 'High-intensity lighting, professional surfaces and top amenities.',
  },
  {
    icon: Users,
    title: 'Squad Matchups',
    text: 'Easily build teams, track matches and set up weekend games.',
  },
]

function StatPill({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-heading text-2xl font-bold text-white sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs tracking-wider text-emerald-200/60 uppercase">{label}</p>
    </div>
  )
}

function Home() {
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ venues: 0, cities: 0, sports: 0 })

  useEffect(() => {
    getAllTurfsAPI().then((res) => {
      if (res.status === 200) {
        setTurfs(res.data.slice(0, 6))
        setStats({
          venues: res.data.length,
          cities: new Set(res.data.map((t) => t.location)).size,
          sports: new Set(res.data.map((t) => t.sport)).size,
        })
      }
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden
            className="size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div className="absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
              <Sparkles className="size-3.5" />
              Instant Turf Reservations
            </span>

            <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl">
              Find Your Turf.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Own the Game.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Discover top-rated sports grounds near you, secure slots in seconds, build your squad
              and play under the lights.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 w-full rounded-xl px-8 sm:w-auto">
                <Link to="/turfs">
                  Find a Turf
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl border-slate-600 bg-background/40 px-8 backdrop-blur sm:w-auto dark:bg-input/30"
              >
                <Link to="/teams">
                  <Users2 />
                  Create Team
                </Link>
              </Button>
            </div>

            <div className="mt-10">
              <TurfSearch />
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 sm:gap-12">
              <StatPill value={loading ? '—' : stats.venues} label="Venues" />
              <div className="h-8 w-px bg-white/10" />
              <StatPill value={loading ? '—' : stats.cities} label="City hubs" />
              <div className="h-8 w-px bg-white/10" />
              <StatPill value={loading ? '—' : stats.sports} label="Sports" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SPORTS CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            Play Your Favourite Sport
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Pick a Game
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SPORTS.map((sport, i) => (
            <Link
              key={sport}
              to={`/turfs?sport=${sport}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 font-heading text-lg font-bold text-emerald-400 transition-transform group-hover:scale-110">
                {sport.charAt(0)}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{sport}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Book slots {i + 1}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED TURFS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Featured Venues
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Handpicked Grounds
            </h2>
          </div>
          <Button asChild variant="link" className="text-emerald-400">
            <Link to="/turfs">
              View all turfs
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TurfCardSkeleton key={i} />
            ))}
          </div>
        ) : turfs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center">
            <MapPin className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No turfs listed yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {turfs.map((turf) => (
              <TurfCard key={turf._id} turf={turf} />
            ))}
          </div>
        )}
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              How It Works
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Book in Three Easy Steps
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.step}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-emerald-500/30"
              >
                <span className="absolute -top-1 right-4 font-heading text-6xl font-bold text-muted/60">
                  {s.step}
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <s.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute top-1/2 -right-3 hidden size-5 -translate-y-1/2 text-muted-foreground/30 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY TURFMATE ================= */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Why TurfMate
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Connecting players to pitches
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              TurfMate eliminates double bookings and manual coordination. Experience real-time
              slot availability, verified venue details and seamless reservation — so all you have
              to think about is the game.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
                  <f.icon className="size-5 text-emerald-400" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-8 h-11 rounded-xl px-6">
              <Link to="/about">
                More about us
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-emerald-500/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <img
                src={HERO_IMAGE}
                alt="Synthetic turf arena"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-4 backdrop-blur">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Built for the game</p>
                  <p className="text-xs text-muted-foreground">
                    {loading ? 'Loading venues...' : `${stats.venues} venues, ${stats.cities} city hubs`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/80 via-background to-background px-6 py-16 text-center sm:px-12">
          <div className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
          <Trophy className="mx-auto size-10 text-emerald-400" />
          <h2 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Your next match starts here.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Find a turf, bring your team and get on the field. Slots book fast — grab yours now.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-8">
              <Link to="/turfs">
                Explore Turfs
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8">
              <Link to="/teams">Create a Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= CONTACT TEASER ================= */}
      <section id="contact" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              Support &amp; Partnering
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Have a question or want to list your venue? Drop us a message.
            </p>
          </div>

          <form
            className="mt-10 space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              Toast.success('Message sent! We will get back to you soon.')
              e.currentTarget.reset()
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="home-name">Your Name</Label>
                <Input id="home-name" placeholder="John Doe" required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="home-email">Email Address</Label>
                <Input
                  id="home-email"
                  type="email"
                  placeholder="player@turfmate.com"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="home-message">Message</Label>
              <Textarea
                id="home-message"
                rows={4}
                placeholder="Write your message here..."
                required
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" className="h-11 rounded-xl px-6">
                <Send />
                Send Message
              </Button>
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link to="/contact">
                  <Mail className="size-4" />
                  Open contact page
                </Link>
              </Button>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              A member of the team responds within one business day.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home