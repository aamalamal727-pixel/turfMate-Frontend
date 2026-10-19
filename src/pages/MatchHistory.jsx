import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getAllMatchesAPI } from '../services/allAPI'
import EmptyState from '../components/common/EmptyState'
import { Badge } from '../components/ui/badge'
import { Trophy } from 'lucide-react'
import { cn } from 'cn'

function MatchHistory() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllMatchesAPI().then((res) => {
      if (res.status === 200) {
        setMatches(res.data)
      } else {
        Toast.error(res.response?.data || 'Failed to load matches')
      }
      setLoading(false)
    })
  }, [])

  // Determine which side won to highlight the winner
  const winnerOf = (m) => {
    if (m.scoreA > m.scoreB) return 'A'
    if (m.scoreB > m.scoreA) return 'B'
    return null
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          History
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Match History
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All your recorded matches and final scores.
        </p>
      </div>

      {loading ? (
        <Loading text="Loading matches..." />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No matches recorded yet"
          description="Match results will appear here after your games are logged."
        />
      ) : (
        <div className="space-y-4">
          {matches.map((m) => {
            const winner = winnerOf(m)
            return (
              <div
                key={m._id}
                className="overflow-hidden rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex-1 text-center sm:text-right">
                    <h3
                      className={cn(
                        'truncate font-heading text-lg font-bold',
                        winner === 'A' ? 'text-emerald-400' : 'text-foreground'
                      )}
                    >
                      {m.teamA}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-border bg-background px-8 py-3 text-center">
                    <span className="font-heading text-3xl font-bold text-foreground">
                      {m.scoreA} - {m.scoreB}
                    </span>
                    <p className="mt-1 text-[10px] tracking-widest text-muted-foreground uppercase">
                      FT
                    </p>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3
                      className={cn(
                        'truncate font-heading text-lg font-bold',
                        winner === 'B' ? 'text-emerald-400' : 'text-foreground'
                      )}
                    >
                      {m.teamB}
                    </h3>
                  </div>
                </div>

                {m.result && (
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Result:{' '}
                    <span className="font-bold text-emerald-400">{m.result}</span>
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-muted-foreground">
                  {m.booking && (
                    <Badge variant="secondary" className="rounded-lg text-muted-foreground">
                      {m.booking.date} • {m.booking.startTime}
                    </Badge>
                  )}
                  <span className="capitalize">
                    {new Date(m.playedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MatchHistory