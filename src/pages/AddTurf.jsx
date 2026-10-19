import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import { addTurfAPI } from '../services/allAPI'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Building2, ImagePlus, X } from 'lucide-react'

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis']

const FACILITY_SUGGESTIONS = [
  'Floodlights',
  'Changing Room',
  'Parking',
  'Drinking Water',
  'First Aid',
  'Cafeteria',
]

function AddTurf() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    location: '',
    sport: 'Football',
    surface: '',
    pricePerHour: '',
    description: '',
    facilities: '',
    rating: '',
  })
  const [imageFiles, setImageFiles] = useState([])
  const [preview, setPreview] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 4)
    setImageFiles(files)
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreview(urls)
  }

  const removePreview = (i) => {
    setPreview((p) => {
      const next = [...p]
      URL.revokeObjectURL(next[i])
      next.splice(i, 1)
      return next
    })
    setImageFiles((files) => files.filter((_, idx) => idx !== i))
  }

  const toggleFacility = (f) => {
    const current = form.facilities
      ? form.facilities.split(',').map((s) => s.trim())
      : []
    const has = current.includes(f)
    const next = has ? current.filter((x) => x !== f) : [...current, f]
    setForm({ ...form, facilities: next.join(', ') })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.location || !form.surface || !form.pricePerHour) {
      Toast.error('Name, location, surface and price are required')
      return
    }
    setSubmitting(true)
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('location', form.location)
    formData.append('sport', form.sport)
    formData.append('surface', form.surface)
    formData.append('pricePerHour', Number(form.pricePerHour))
    formData.append('description', form.description)
    formData.append('facilities', form.facilities)
    if (form.rating) formData.append('rating', Number(form.rating))
    imageFiles.forEach((f) => formData.append('images', f))

    const res = await addTurfAPI(formData)
    if (res.status === 200) {
      Toast.success('Turf added successfully')
      navigate('/my-turfs')
    } else {
      Toast.error(res.response?.data?.error || 'Failed to add turf')
    }
    setSubmitting(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Owner</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Add New Turf
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in your venue details to list it on TurfMate.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20 sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="turf-name">Turf Name *</Label>
            <Input
              id="turf-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Green Arena"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turf-location">Location *</Label>
            <Input
              id="turf-location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Thiruvalla, Kerala"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turf-sport">Sport *</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger id="turf-sport" className="h-11 w-full rounded-xl bg-background">
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
          <div className="space-y-1.5">
            <Label htmlFor="turf-surface">Surface *</Label>
            <Input
              id="turf-surface"
              value={form.surface}
              onChange={(e) => setForm({ ...form, surface: e.target.value })}
              placeholder="Artificial Grass"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turf-price">Price Per Hour (₹) *</Label>
            <Input
              id="turf-price"
              type="number"
              min="0"
              value={form.pricePerHour}
              onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
              placeholder="1000"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="turf-rating">Rating (0-5)</Label>
            <Input
              id="turf-rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              placeholder="4.5"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="turf-desc">Description</Label>
          <Textarea
            id="turf-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your venue, size, lighting, etc."
            className="resize-none rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Facilities (comma separated)</Label>
          <Input
            value={form.facilities}
            onChange={(e) => setForm({ ...form, facilities: e.target.value })}
            placeholder="Floodlights, Changing Room, Parking, Drinking Water"
            className="h-11 rounded-xl"
          />
        </div>

        <div>
          <Label>Quick add</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {FACILITY_SUGGESTIONS.map((f) => {
              const active = form.facilities
                ? form.facilities.split(',').map((s) => s.trim()).includes(f)
                : false
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFacility(f)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-border bg-background text-muted-foreground hover:border-emerald-500/40'
                  }`}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Images (up to 4)</Label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background p-8 text-sm text-muted-foreground transition-colors hover:border-emerald-500/50">
            <ImagePlus className="size-5 text-emerald-400" />
            Choose turf photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="sr-only"
            />
          </label>
          {preview.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {preview.map((p, i) => (
                <div key={i} className="group relative">
                  <img
                    src={p}
                    alt={`preview ${i + 1}`}
                    className="size-20 rounded-xl border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    aria-label="Remove image"
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow hover:text-red-400"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          <Building2 />
          {submitting ? 'Adding Turf...' : 'Add Turf'}
        </Button>
      </form>
    </div>
  )
}

export default AddTurf