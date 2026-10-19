import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis']

function TurfSearch({ defaults = {}, variant = 'hero', onSearch }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState(defaults.search || '')
  const [location, setLocation] = useState(defaults.location || '')
  const [sport, setSport] = useState(defaults.sport || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ search, location, sport })
      return
    }
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (sport && sport !== 'all') params.set('sport', sport)
    navigate(`/turfs${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        variant === 'hero'
          ? 'mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-border bg-card/70 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center'
          : 'flex flex-col gap-2 lg:flex-row lg:items-center'
      }`}
    >
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search turf name or sport..."
          className="h-12 rounded-xl pl-9"
          aria-label="Search turfs"
        />
      </div>

      <div className="relative flex-1">
        <MapPin className="absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Kochi)"
          className="h-12 rounded-xl pl-9"
          aria-label="Turf location"
        />
      </div>

      <Select value={sport} onValueChange={setSport}>
        <SelectTrigger className="h-12 w-full rounded-xl bg-background sm:w-44" aria-label="Sport">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <SelectValue placeholder="All sports" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sports</SelectItem>
          {SPORTS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="lg" className="h-12 rounded-xl px-6">
        <Search />
        Search
      </Button>
    </form>
  )
}

export default TurfSearch