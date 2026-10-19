import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getTeamAPI, addPlayerAPI, removePlayerAPI } from '../services/allAPI'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import {
  ChevronLeft,
  Crown,
  UserPlus,
  UserMinus,
  Users,
  Mail,
} from 'lucide-react'

function PlayerRow({ player, subtitle, isCaptain, canEdit, onRemove }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 ${
        isCaptain ? 'border-emerald-500/40 bg-card' : 'border-border bg-card'
      }`}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-heading font-bold ${
          isCaptain
            ? 'bg-amber-500/15 text-amber-400'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {player.username?.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
          {player.username}
          {isCaptain && <Crown className="size-3.5 text-amber-400" />}
        </p>
        {subtitle && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Mail className="size-3" />
            {subtitle}
          </p>
        )}
      </div>
      {isCaptain ? (
        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">Captain</Badge>
      ) : (
        canEdit && (
          <button
            type="button"
            onClick={() => onRemove(player._id)}
            className="flex size-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20"
            aria-label={`Remove ${player.username}`}
          >
            <UserMinus className="size-3.5" />
          </button>
        )
      )}
    </div>
  )
}

function TeamDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playerId, setPlayerId] = useState('')
  const [busy, setBusy] = useState(false)

  const loadTeam = useCallback(() => {
    getTeamAPI(id).then((res) => {
      if (res.status === 200) {
        setTeam(res.data)
      } else {
        Toast.error(res.response?.data || 'Team not found')
      }
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    loadTeam()
  }, [loadTeam])

  const isCaptain = team && user?._id === team.captain?._id

  const handleAddPlayer = async (e) => {
    e.preventDefault()
    if (!playerId.trim()) {
      Toast.error('Enter a valid player ID')
      return
    }
    setBusy(true)
    const res = await addPlayerAPI(id, playerId.trim())
    if (res.status === 200) {
      Toast.success('Player added to team')
      setPlayerId('')
      loadTeam()
    } else {
      Toast.error(res.response?.data || 'Failed to add player')
    }
    setBusy(false)
  }

  const handleRemovePlayer = async (playerIdToRemove) => {
    const res = await removePlayerAPI(id, playerIdToRemove)
    if (res.status === 200) {
      Toast.success('Player removed')
      loadTeam()
    } else {
      Toast.error(res.response?.data || 'Failed to remove player')
    }
  }

  if (loading) {
    return <Loading text="Loading team..." />
  }

  if (!team) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Team not found.</p>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link to="/teams">
            <ChevronLeft />
            Back to My Teams
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/teams">
          <ChevronLeft />
          Back to My Teams
        </Link>
      </Button>

      <div className="mb-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-heading text-3xl font-bold text-emerald-950 shadow-lg shadow-emerald-500/30">
            {team.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-heading text-3xl font-bold text-foreground">
              {team.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {team.sport} • Captain: {team.captain?.username}
            </p>
          </div>
        </div>

        {isCaptain && (
          <form
            onSubmit={handleAddPlayer}
            className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row"
          >
            <Input
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Paste player User ID to add..."
              className="flex-1 rounded-xl"
            />
            <Button type="submit" disabled={busy} className="rounded-xl">
              {busy ? 'Adding...' : (
                <>
                  <UserPlus />
                  Add Player
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
        <Users className="size-5 text-emerald-400" />
        Players ({team.players.length + 1})
      </h2>

      <div className="space-y-3">
        <PlayerRow
          player={team.captain}
          subtitle={team.captain?.email}
          isCaptain
          canEdit={false}
          onRemove={() => {}}
        />

        {team.players.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No players added yet.
          </p>
        ) : (
          team.players.map((p) => (
            <PlayerRow
              key={p._id}
              player={p}
              subtitle={p.email}
              isCaptain={false}
              canEdit={isCaptain}
              onRemove={handleRemovePlayer}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TeamDetails