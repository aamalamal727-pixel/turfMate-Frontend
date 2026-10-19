import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { cn } from 'cn'
import {
  Bell,
  CalendarDays,
  Home as HomeIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  User,
  Users,
  ShieldCheck,
  Store,
  Info,
  Mail,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import Toast from './Toast'
import { getImageUrl } from '../utils/helpers'

const brand = (
  <Link to="/" className="group flex items-center gap-2.5">
    <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-heading text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
      TM
    </div>
    <span className="font-heading text-xl font-bold tracking-tight text-foreground">
      Turf<span className="text-emerald-400">Mate</span>
    </span>
  </Link>
)

function NavLinkItem({ to, label, icon: Icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group/nav relative flex items-center gap-1.5 px-1 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
          isActive && 'text-emerald-400 hover:text-emerald-400'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="size-4 lg:hidden" />
          {label}
          <span
            className={cn(
              'absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-emerald-400 transition-transform duration-300 group-hover/nav:scale-x-100',
              isActive && 'scale-x-100'
            )}
          />
        </>
      )}
    </NavLink>
  )
}

function usePublicAndRoleLinks(user) {
  const base = [
    { to: '/', label: 'Home', icon: HomeIcon, end: true },
    { to: '/turfs', label: 'Turfs', icon: MapPin },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
  ]

  if (!user) return base

  if (user.role === 'user') {
    return [
      { to: '/', label: 'Home', icon: HomeIcon, end: true },
      { to: '/turfs', label: 'Turfs', icon: MapPin },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/my-bookings', label: 'Bookings', icon: CalendarDays },
      { to: '/teams', label: 'Teams', icon: Users },
      { to: '/about', label: 'About', icon: Info },
      { to: '/contact', label: 'Contact', icon: Mail },
    ]
  }

  if (user.role === 'owner') {
    return [
      { to: '/', label: 'Home', icon: HomeIcon, end: true },
      { to: '/turfs', label: 'Turfs', icon: MapPin },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/my-turfs', label: 'My Turfs', icon: Store },
      { to: '/owner-bookings', label: 'Bookings', icon: CalendarDays },
      { to: '/about', label: 'About', icon: Info },
      { to: '/contact', label: 'Contact', icon: Mail },
    ]
  }

  return [
    { to: '/', label: 'Home', icon: HomeIcon, end: true },
    { to: '/turfs', label: 'Turfs', icon: MapPin },
    { to: '/admin', label: 'Admin', icon: ShieldCheck },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
  ]
}

function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    Toast.success('Logged out successfully')
    navigate('/')
  }

  const roleLinks =
    user?.role === 'user'
      ? [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/my-bookings', label: 'My Bookings', icon: CalendarDays },
          { to: '/teams', label: 'My Teams', icon: Users },
        ]
      : user?.role === 'owner'
        ? [
            { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { to: '/my-turfs', label: 'My Turfs', icon: Store },
            { to: '/owner-bookings', label: 'Bookings', icon: CalendarDays },
          ]
        : [{ to: '/admin', label: 'Admin', icon: ShieldCheck }]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="Open profile menu"
        >
          <Avatar size="lg" className="border border-border">
            {user?.profileImage ? (
              <AvatarImage src={getImageUrl(user.profileImage)} alt={user?.username} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 font-heading font-bold text-emerald-50">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate font-heading font-semibold text-foreground">{user?.username}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roleLinks.map((link) => (
          <DropdownMenuItem key={link.to} asChild>
            <Link to={link.to} className="cursor-pointer">
              <link.icon />
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild>
          <Link to="/account" className="cursor-pointer">
            <User />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} className="text-destructive">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Notifications() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
          <Bell />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-emerald-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-heading">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <Bell className="size-6 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const links = usePublicAndRoleLinks(user)
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    Toast.success('Logged out successfully')
    navigate('/')
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>{brand}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isActive && 'bg-muted/70 text-emerald-400'
                )
              }
            >
              <link.icon className="size-4" />
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto border-t border-border p-4">
          {user && token ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  {user?.profileImage ? (
                    <AvatarImage src={getImageUrl(user.profileImage)} alt={user?.username} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 font-bold text-emerald-50">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user?.username}</p>
                  <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link to="/account" onClick={() => setOpen(false)}>
                  <User />
                  My Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full text-destructive" onClick={handleLogout}>
                <LogOut />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/login?mode=register">Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Navbar() {
  const { user, token } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const links = usePublicAndRoleLinks(user)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-all duration-300',
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-xl'
          : 'border-transparent bg-background/40 backdrop-blur-md'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {brand}

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLinkItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && token ? (
            <>
              <Notifications />
              <ProfileMenu />
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost" size="sm" className="font-medium">
                <Link to="/login?mode=register">Register</Link>
              </Button>
              <Button asChild size="sm" className="h-9 rounded-lg px-5">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default Navbar
