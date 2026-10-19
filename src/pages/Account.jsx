import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { updateProfileAPI } from '../services/allAPI'
import { getImageUrl } from '../utils/helpers'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  Sparkles,
  User,
  X,
} from 'lucide-react'

const roleStyles = {
  user: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  owner: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  admin: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
}

function Account() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    username: '',
    phone: '',
    bio: '',
    location: '',
    favoriteSports: '',
  })

  const startEditing = () => {
    setForm({
      username: user?.username || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      favoriteSports: user?.favoriteSports?.join(', ') || '',
    })
    setEditing(true)
  }

  const handleLogout = () => {
    logout()
    Toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      username: form.username,
      phone: form.phone,
      bio: form.bio,
      location: form.location,
      favoriteSports: form.favoriteSports
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    }
    const res = await updateProfileAPI(payload)
    if (res.status === 200) {
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
      setEditing(false)
      Toast.success('Profile updated')
    } else {
      Toast.error(res.response?.data || 'Failed to update profile')
    }
    setSaving(false)
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Please login to view your profile.</p>
        <Button asChild size="sm" className="rounded-xl">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          {user.role} Dashboard
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground capitalize sm:text-4xl">
          My Profile
        </h1>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20 sm:p-8">
        <div className="mb-8 flex flex-wrap items-center gap-5">
          {user.profileImage ? (
            <img
              src={getImageUrl(user.profileImage)}
              alt={user.username}
              className="size-20 rounded-2xl border border-border object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-heading text-3xl font-bold text-emerald-950 shadow-lg shadow-emerald-500/30">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate font-heading text-2xl font-bold text-foreground">
              {user?.username}
            </h2>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold uppercase ${roleStyles[user?.role] || roleStyles.user}`}
            >
              <Sparkles className="size-3" />
              {user?.role}
            </span>
            <button
              type="button"
              onClick={editing ? () => setEditing(false) : startEditing}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-username">Username</Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-username"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="edit-location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-sports">Favorite Sports (comma separated)</Label>
                <Input
                  id="edit-sports"
                  value={form.favoriteSports}
                  onChange={(e) => setForm({ ...form, favoriteSports: e.target.value })}
                  placeholder="Football, Cricket"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="resize-none rounded-xl"
              />
            </div>
            <Button type="submit" disabled={saving} className="h-12 w-full rounded-xl">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {[
              { icon: Phone, label: 'Phone', value: user?.phone || 'Not provided' },
              { icon: MapPin, label: 'Location', value: user?.location || 'Not provided' },
              { icon: Sparkles, label: 'Favorite Sports', value: user?.favoriteSports?.length ? user.favoriteSports.join(', ') : 'Not provided' },
              {
                icon: CalendarDays,
                label: 'Member Since',
                value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—',
              },
            ].map((f) => (
              <div key={f.label} className="rounded-2xl border border-border bg-background p-4">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <f.icon className="size-3.5 text-emerald-400" />
                  {f.label}
                </p>
                <p className="mt-1.5 font-semibold text-foreground">{f.value}</p>
              </div>
            ))}
            {user?.bio && (
              <div className="rounded-2xl border border-border bg-background p-4 sm:col-span-2">
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="mt-1.5 text-sm font-medium text-foreground">{user.bio}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          <Button asChild variant="outline" className="flex-1 rounded-xl">
            <Link to="/dashboard">
              <LayoutDashboard />
              Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut />
            Logout
          </Button>
        </div>

        {editing && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <X className="size-3 text-emerald-400" />
            Profile edits are saved to your account.
          </p>
        )}
      </div>
    </div>
  )
}

export default Account