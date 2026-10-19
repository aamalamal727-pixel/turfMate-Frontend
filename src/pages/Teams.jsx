import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getMyTeamsAPI, createTeamAPI, deleteTeamAPI } from '../services/allAPI'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import EmptyState from '../components/common/EmptyState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Plus, Shield, Trash2, Users, ArrowRight, Crown } from 'lucide-react'

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis']

function Teams() {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', sport: 'Football' })
  const [creating, setCreating] = useState(false)

  const loadTeams = () => {
    getMyTeamsAPI().then((res) => {
      if (res.status === 200) {
        setTeams(res.data)
      } else {
        Toast.error(res.response?.data || 'Failed to load teams')
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      Toast.error('Team name is required')
      return
    }
    setCreating(true)
    const res = await createTeamAPI(form)
    if (res.status === 200) {
      Toast.success('Team created successfully')
      setForm({ name: '', sport: 'Football' })
      setShowForm(false)
      loadTeams()
    } else {
      Toast.error(res.response?.data || 'Failed to create team')
    }
    setCreating(false)
  }

  const handleDelete = async (id) => {
    const res = await deleteTeamAPI(id)
    if (res.status === 200) {
      Toast.success('Team deleted')
      loadTeams()
    } else {
      Toast.error(res.response?.data || 'Failed to delete team')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Teams</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            My Teams
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create squads, invite players and organise friendly matchups.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-xl px-6">
          {showForm ? 'Close' : (
            <>
              <Plus />
              Create Team
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-10 grid grid-cols-1 gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-[1fr_180px_auto]"
        >
          <div className="space-y-1.5">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Thunder FC"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="team-sport">Sport</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger id="team-sport" className="h-11 w-full rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPORTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={creating} className="h-11 w-full rounded-xl">
              {creating ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading text="Loading teams..." />
      ) : teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="You have no teams yet"
          description="Create your first squad and get ready to play."
          action={
            <Button onClick={() => setShowForm(true)} size="sm" className="rounded-xl">
              <Plus />
              Create your first team
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {teams.map((team) => (
            <div key={team._id} className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-emerald-500/30">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-heading text-xl font-bold text-emerald-950 shadow-lg shadow-emerald-500/20">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading text-lg font-bold text-foreground">
                    {team.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {team.sport} • {team.players.length + 1} players
                  </p>
                </div>
                {user?._id === team.captain?._id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(team._id)}
                    aria-label={`Delete ${team.name}`}
                    className="flex size-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <p className="mb-5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Crown className="size-3.5 text-amber-400" />
                Captain: {team.captain?.username}
              </p>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link to={`/teams/${team._id}`}>
                  <Shield />
                  Manage Team
                  <ArrowRight className="ml-auto transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Teams