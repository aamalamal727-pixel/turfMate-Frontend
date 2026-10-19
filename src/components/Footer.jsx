import { Link } from 'react-router-dom'
import { AtSign, MessageCircle, Share2, MapPin, Users, CalendarDays } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Find Turfs', to: '/turfs' },
      { label: 'My Bookings', to: '/my-bookings' },
      { label: 'Teams', to: '/teams' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Support', to: '/contact' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    title: 'Sports',
    links: ['5-a-side Football', 'Box Cricket', 'Badminton', 'Tennis'],
  },
]

const socials = [
  { label: 'Instagram', icon: AtSign },
  { label: 'Discord', icon: MessageCircle },
  { label: 'Community', icon: Share2 },
]

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-heading text-sm font-bold text-emerald-950">
              TM
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Turf<span className="text-emerald-400">Mate</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Premier booking platform for high-grade synthetic sports turfs and arenas. Find turf,
            build teams, play more.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <span
                key={s.label}
                title={`${s.label} — coming soon`}
                className="flex size-8 cursor-default items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
              >
                <s.icon className="size-4" />
                <span className="sr-only">{s.label}</span>
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) =>
                typeof link === 'object' ? (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {link}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:px-6 md:flex-row lg:px-8">
          <p>© 2026 TurfMate Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3" />
            Made for players
            <Users className="size-3" />
            by players
            <CalendarDays className="size-3" />
            every day.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer