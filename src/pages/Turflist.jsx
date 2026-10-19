import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, SearchX, RotateCcw } from 'lucide-react'
import TurfCard from '../components/turf/TurfCard'
import TurfCardSkeleton from '../components/turf/TurfCardSkeleton'
import TurfSearch from '../components/turf/TurfSearch'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import { getAllTurfsAPI } from '../services/allAPI'
import Toast from '../components/Toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from '../components/ui/sheet'
import { cn } from 'cn'

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis']

const PAGE_SIZE = 9

function FilterField({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function TurfList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [sport, setSport] = useState(searchParams.get('sport') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '')
  const [availableOnly, setAvailableOnly] = useState(true)
  const [sortBy, setSortBy] = useState('relevance')

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (sport) params.set('sport', sport)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minRating) params.set('rating', minRating)
    return params.toString() ? `?${params.toString()}` : ''
  }, [search, location, sport, maxPrice, minRating])

  const buildParams = (vals) => {
    const params = new URLSearchParams()
    if (vals.search) params.set('search', vals.search)
    if (vals.location) params.set('location', vals.location)
    if (vals.sport && vals.sport !== 'all') params.set('sport', vals.sport)
    if (vals.maxPrice) params.set('maxPrice', vals.maxPrice)
    if (vals.rating && vals.rating !== 'any') params.set('rating', vals.rating)
    return params
  }

  const load = useCallback(() => {
    getAllTurfsAPI(query)
      .then((res) => {
        if (res.status === 200) {
          setTurfs(res.data)
        } else {
          Toast.error(res.response?.data || 'Failed to load turfs')
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [query])

  useEffect(() => {
    load()
  }, [load])

  const handleApply = (e) => {
    if (e) e.preventDefault()
    setSearchParams(buildParams({ search, location, sport, maxPrice, rating: minRating }))
    setLoading(true)
  }

  const handleClear = () => {
    setSearch('')
    setLocation('')
    setSport('')
    setMaxPrice('')
    setMinRating('')
    setAvailableOnly(true)
    setSortBy('relevance')
    setSearchParams({})
    setLoading(true)
  }

  const visibleTurfs = useMemo(() => {
    let list = [...turfs]
    if (availableOnly) list = list.filter((t) => t.isAvailable)
    if (minRating) {
      const min = Number(minRating)
      list = list.filter((t) => t.rating >= min)
    }
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.pricePerHour - b.pricePerHour)
        break
      case 'price-desc':
        list.sort((a, b) => b.pricePerHour - a.pricePerHour)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    return list
  }, [turfs, availableOnly, minRating, sortBy])

  const totalPages = Math.max(1, Math.ceil(visibleTurfs.length / PAGE_SIZE))
  const pagedTurfs = visibleTurfs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const filterPanel = (
    <form onSubmit={handleApply} className="space-y-5">
      <FilterField label="Location">
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Any city"
          className="h-10 rounded-xl"
        />
      </FilterField>
      <FilterField label="Sport">
        <Select value={sport} onValueChange={setSport}>
          <SelectTrigger className="h-10 w-full rounded-xl bg-background">
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
      </FilterField>
      <FilterField label="Max price / hr (₹)">
        <Input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="No limit"
          className="h-10 rounded-xl"
        />
      </FilterField>
      <FilterField label="Minimum rating">
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger className="h-10 w-full rounded-xl bg-background">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="4.5">4.5 &amp; up</SelectItem>
            <SelectItem value="4.0">4.0 &amp; up</SelectItem>
            <SelectItem value="3.5">3.5 &amp; up</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>

      <button
        type="button"
        onClick={() => setAvailableOnly((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground"
      >
        <span>Available only</span>
        <span
          className={cn(
            'relative h-5 w-9 rounded-full transition-colors',
            availableOnly ? 'bg-emerald-500' : 'bg-muted'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-4 rounded-full bg-white transition-all',
              availableOnly ? 'left-4.5' : 'left-0.5'
            )}
          />
        </span>
      </button>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button type="submit" className="h-10 rounded-xl">
          Apply
        </Button>
        <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </form>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Explore Venues
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Find Your Turf
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search, filter and sort premium grounds near you.
        </p>
      </div>

      <div className="mb-8">
        <TurfSearch
          variant="list"
          defaults={{ search, location, sport }}
          onSearch={(vals) => {
            const next = buildParams({
              search: vals.search,
              location: vals.location,
              sport: vals.sport === 'all' ? '' : vals.sport,
            })
            setSearch(vals.search)
            setLocation(vals.location)
            setSport(vals.sport === 'all' ? '' : vals.sport)
            setMaxPrice('')
            setMinRating('')
            setSearchParams(next)
            setLoading(true)
          }}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Sidebar filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-emerald-400" />
              <h2 className="font-heading text-sm font-semibold text-foreground">Filters</h2>
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading venues...' : `${visibleTurfs.length} venue${visibleTurfs.length === 1 ? '' : 's'} found`}
            </p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your turf search.</SheetDescription>
                  </SheetHeader>
                  <div className="px-4">{filterPanel}</div>
                  <SheetFooter>
                    <Button asChild variant="link" onClick={handleClear} className="text-muted-foreground">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Clear all filters
                      </a>
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 w-fit rounded-lg bg-background text-sm sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TurfCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="We couldn't load turfs."
              description="Please check your connection and try again."
              onRetry={load}
            />
          ) : pagedTurfs.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No turfs found"
              description="Try changing your filters or search area."
              action={
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RotateCcw />
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {pagedTurfs.map((turf) => (
                  <TurfCard key={turf._id} turf={turf} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-10">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.max(1, p - 1))
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={i + 1 === page}
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(i + 1)
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.min(totalPages, p + 1))
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TurfList