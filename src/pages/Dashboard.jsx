import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import {
  getMyBookingsAPI,
  getMyTeamsAPI,
  getOwnerEarningsAPI,
  getMyTurfsAPI,
  getAdminStatsAPI,
} from '../services/allAPI'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import {
  BadgeCheck,
  Building2,
  ClipboardList,
  Compass,
  Home,
  IndianRupee,
  LayoutGrid,
  ShieldCheck,
  StickyNote,
  Ticket,
  Trophy,
  UserCircle,
  Users,
  PlusCircle,
  TrendingUp,
  Timer,
} from 'lucide-react'

const roleOptions = {
  user: {
    label: 'Players Hub',
    icon: UserCircle,
    links: [
      { to: '/turfs', title: 'Explore Turfs', desc: 'Discover and book venues', icon: Compass },
      { to: '/my-bookings', title: 'My Bookings', desc: 'View and cancel bookings', icon: Ticket },
      { to: '/teams', title: 'My Teams', desc: 'Manage your squad', icon: Users },
      { to: '/matches', title: 'Match History', desc: 'Past results', icon: Trophy },
    ],
  },
  owner: {
    label: 'Owner Studio',
    icon: Building2,
    links: [
      { to: '/my-turfs', title: 'My Turfs', desc: 'Add and manage venues', icon: LayoutGrid },
      { to: '/owner-bookings', title: 'Bookings', desc: 'Accept and reject bookings', icon: ClipboardList },
      { to: '/add-turf', title: 'Add Turf', desc: 'List a new venue', icon: PlusCircle },
    ],
  },
  admin: {
    label: 'Admin Console',
    icon: ShieldCheck,
    links: [
      { to: '/admin', title: 'Manage Users', desc: 'Promote owners and more', icon: Users },
      { to: '/admin', title: 'Manage Turfs', desc: 'Monitor all venues', icon: Home },
      { to: '/admin', title: 'Payments', desc: 'Monitor transactions', icon: BadgeCheck },
    ],
  },
}

function QuickLink({ to, title, desc, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40"
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-110">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-400">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Link>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    if (!user) return
    if (user.role === 'user') {
      Promise.all([getMyBookingsAPI(), getMyTeamsAPI()]).then(([bkRes, teamRes]) => {
        const bks = bkRes.status === 200 ? bkRes.data : []
        const teams = teamRes.status === 200 ? teamRes.data : []
        setRecentBookings(bks.slice(0, 3))
        setData({
          totalBookings: bks.length,
          upcoming: bks.filter(
            (b) =>
              (b.status === 'pending' || b.status === 'confirmed') &&
              new Date(b.date) >= new Date().toISOString().split('T')[0]
          ).length,
          teams: teams.length,
        })
        setLoading(false)
      })
    } else if (user.role === 'owner') {
      Promise.all([getOwnerEarningsAPI(), getMyTurfsAPI()]).then(([earnRes, turfRes]) => {
        const earn = earnRes.status === 200 ? earnRes.data : {}
        const turfs = turfRes.status === 200 ? turfRes.data : []
        setData({
          totalTurfs: turfs.length,
          totalEarnings: earn.totalEarnings || 0,
          pending: earn.pendingCount || 0,
          totalBookings: earn.totalBookings || 0,
        })
        setLoading(false)
      })
    } else if (user.role === 'admin') {
      getAdminStatsAPI().then((res) => {
        if (res.status === 200) {
          setData(res.data)
        }
        setLoading(false)
      })
    }
  }, [user])

  const opts = roleOptions[user?.role] || roleOptions.user

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-heading text-2xl font-bold text-emerald-950 shadow-lg shadow-emerald-500/30">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            {user?.role} Dashboard
          </p>
          <h1 className="mt-0.5 font-heading text-3xl font-bold text-foreground capitalize">
            Welcome, {user?.username}
          </h1>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 uppercase">
          <opts.icon className="size-3.5" />
          {opts.label}
        </span>
      </div>

      {loading || !data ? (
        <Loading text="Loading dashboard..." />
      ) : (
        <>
          <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {user.role === 'user' && (
              <>
                <StatCard label="Total Bookings" value={data.totalBookings} icon={Ticket} />
                <StatCard label="Upcoming" value={data.upcoming} icon={Timer} accent="amber" />
                <StatCard label="My Teams" value={data.teams} icon={Users} accent="sky" />
                <StatCard label="Favourite Sport" value={user?.favoriteSports?.[0] || '—'} icon={Trophy} accent="purple" />
              </>
            )}
            {user.role === 'owner' && (
              <>
                <StatCard label="My Turfs" value={data.totalTurfs} icon={LayoutGrid} />
                <StatCard label="Total Bookings" value={data.totalBookings} icon={ClipboardList} accent="sky" />
                <StatCard label="Pending" value={data.pending} icon={Timer} accent="amber" />
                <StatCard label="Revenue (₹)" value={data.totalEarnings} icon={TrendingUp} />
              </>
            )}
            {user.role === 'admin' && (
              <>
                <StatCard label="Users" value={data.userCount} icon={Users} />
                <StatCard label="Owners" value={data.ownerCount} icon={Building2} accent="sky" />
                <StatCard label="Turfs" value={data.turfCount} icon={Home} accent="amber" />
                <StatCard label="Revenue (₹)" value={data.revenue} icon={IndianRupee} accent="purple" />
              </>
            )}
          </div>

          <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Quick Links</h2>
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickLink to="/account" title="My Profile" desc="Update account details" icon={UserCircle} />
            {opts.links.map((l) => (
              <QuickLink key={l.to + l.title} {...l} />
            ))}
          </div>

          {user.role === 'user' && recentBookings.length > 0 && (
            <>
              <h2 className="mb-4 font-heading text-xl font-bold text-foreground">Recent Bookings</h2>
              <div className="space-y-3">
                {recentBookings.map((b) => (
                  <div
                    key={b._id}
                    className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <StickyNote className="size-3.5 text-emerald-400" />
                        {b.turf?.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {b.date} • {b.startTime} - {b.endTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <StatusBadge status={b.status} />
                      <StatusBadge status={b.paymentStatus === 'paid' ? 'paid' : 'pending'} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard