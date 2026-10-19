import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import {
  getAdminStatsAPI,
  getAllUsersAPI,
  getAllAdminTurfsAPI,
  getAllAdminBookingsAPI,
  getAllAdminPaymentsAPI,
  promoteAPI,
  toggleUserAPI,
  deleteUserAPI,
  deleteTurfAPI,
} from '../services/allAPI'
import { getImageUrl } from '../utils/helpers'
import StatCard from '../components/common/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  ArrowUpDown,
  CalendarDays,
  CreditCard,
  Eye,
  Home,
  IndianRupee,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'
import { cn } from 'cn'

const TABS = [
  { id: 'Overview', icon: Eye },
  { id: 'Users', icon: Users },
  { id: 'Turfs', icon: Home },
  { id: 'Bookings', icon: CalendarDays },
  { id: 'Payments', icon: CreditCard },
]

const roleBadge = (role) => {
  const map = {
    user: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    owner: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    admin: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  }
  return map[role] || map.user
}

function Admin() {
  const [tab, setTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [turfs, setTurfs] = useState([])
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabLoading, setTabLoading] = useState(false)

  useEffect(() => {
    getAdminStatsAPI().then((res) => {
      if (res.status === 200) setStats(res.data)
      setLoading(false)
    })
  }, [])

  const loadUsers = () => {
    setTabLoading(true)
    getAllUsersAPI()
      .then((res) => {
        if (res.status === 200) setUsers(res.data)
      })
      .finally(() => setTabLoading(false))
  }
  const loadTurfs = () => {
    setTabLoading(true)
    getAllAdminTurfsAPI()
      .then((res) => {
        if (res.status === 200) setTurfs(res.data)
      })
      .finally(() => setTabLoading(false))
  }
  const loadBookings = () => {
    setTabLoading(true)
    getAllAdminBookingsAPI()
      .then((res) => {
        if (res.status === 200) setBookings(res.data)
      })
      .finally(() => setTabLoading(false))
  }
  const loadPayments = () => {
    setTabLoading(true)
    getAllAdminPaymentsAPI()
      .then((res) => {
        if (res.status === 200) setPayments(res.data)
      })
      .finally(() => setTabLoading(false))
  }

  const switchTab = (t) => {
    setTab(t)
    if (t === 'Users') loadUsers()
    if (t === 'Turfs') loadTurfs()
    if (t === 'Bookings') loadBookings()
    if (t === 'Payments') loadPayments()
  }

  const handlePromote = async (id) => {
    const res = await promoteAPI(id)
    if (res.status === 200) {
      Toast.success('Role updated')
      loadUsers()
    } else {
      Toast.error(res.response?.data || 'Failed to update role')
    }
  }

  const handleToggle = async (id) => {
    const res = await toggleUserAPI(id)
    if (res.status === 200) {
      Toast.success('User status updated')
      loadUsers()
    } else {
      Toast.error(res.response?.data || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (id) => {
    const res = await deleteUserAPI(id)
    if (res.status === 200) {
      Toast.success('User deleted')
      loadUsers()
    } else {
      Toast.error(res.response?.data || 'Failed to delete user')
    }
  }

  const handleDeleteTurf = async (id) => {
    const res = await deleteTurfAPI(id)
    if (res.status === 200) {
      Toast.success('Turf deleted')
      loadTurfs()
    } else {
      Toast.error(res.response?.data || 'Failed to delete turf')
    }
  }

  const renderLoading = () => (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Admin</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Control Center
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Overview of platform activity, users, venues, bookings and payments.
        </p>
      </div>

      <Tabs value={tab} onValueChange={switchTab} className="gap-4">
        <TabsList variant="line" className="w-full justify-start gap-1 rounded-xl border border-border bg-card px-3 py-2">
          {TABS.map(({ id, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="rounded-lg px-4 py-2 text-sm"
            >
              <Icon />
              {id}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Overview">
          {loading ? (
            <Loading text="Loading stats..." />
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <StatCard label="Users" value={stats.userCount} icon={Users} accent="sky" />
              <StatCard label="Owners" value={stats.ownerCount} icon={ShieldCheck} accent="amber" />
              <StatCard label="Turfs" value={stats.turfCount} icon={Home} />
              <StatCard label="Bookings" value={stats.bookingCount} icon={CalendarDays} accent="purple" />
              <StatCard label="Payments" value={stats.paymentCount} icon={CreditCard} accent="red" />
              <StatCard label="Revenue (₹)" value={stats.revenue} icon={IndianRupee} />
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">No stats available.</p>
          )}
        </TabsContent>

        <TabsContent value="Users">
          {tabLoading ? (
            renderLoading()
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No users.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted font-heading font-bold text-muted-foreground">
                            {u.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{u.username}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-sm text-foreground">{u.email}</p>
                        <p className="text-xs text-muted-foreground">{u.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('rounded-full', roleBadge(u.role))}>{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                            u.isActive
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-red-500/30 bg-red-500/10 text-red-300'
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              u.isActive ? 'bg-emerald-400' : 'bg-red-400'
                            )}
                          />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1.5">
                          {u.role !== 'admin' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg text-amber-400"
                                onClick={() => handlePromote(u._id)}
                              >
                                {u.role === 'owner' ? 'Demote' : 'Promote'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  'h-8 rounded-lg',
                                  u.isActive
                                    ? 'text-sky-400'
                                    : 'text-emerald-400'
                                )}
                                onClick={() => handleToggle(u._id)}
                              >
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                <Trash2 />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="Turfs">
          {tabLoading ? (
            renderLoading()
          ) : turfs.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No turfs.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venue</TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead>Price / hr</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turfs.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(t.images?.[0])}
                            alt={t.name}
                            className="h-10 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{t.sport}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-foreground">{t.owner?.username}</p>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₹{t.pricePerHour}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                            t.isAvailable
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-red-500/30 bg-red-500/10 text-red-300'
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              t.isAvailable ? 'bg-emerald-400' : 'bg-red-400'
                            )}
                          />
                          {t.isAvailable ? 'Available' : 'Hidden'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-lg border-red-500/30 p-0 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteTurf(t._id)}
                            aria-label={`Delete ${t.name}`}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="Bookings">
          {tabLoading ? (
            renderLoading()
          ) : bookings.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No bookings.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead className="hidden sm:table-cell">Schedule</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b._id}>
                      <TableCell>
                        <p className="font-semibold text-foreground">
                          {b.user?.username} <ArrowUpDown className="inline size-3 text-emerald-400" /> {b.turf?.name}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-sm text-foreground">{b.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.startTime} – {b.endTime}
                        </p>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₹{b.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={b.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="Payments">
          {tabLoading ? (
            renderLoading()
          ) : payments.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No payments.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden sm:table-cell">Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>
                        <p className="font-semibold text-foreground">{p.user?.username}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {p.transactionId}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="font-mono text-sm text-emerald-400">
                          {p.transactionId}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₹{p.amount}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {p.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Admin