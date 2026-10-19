import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import Toast from '../components/Toast'
import { getTurfAPI, updateTurfAPI } from '../services/allAPI'
import { getImageUrl } from '../utils/helpers'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Switch } from '../components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { ChevronLeft, ImagePlus, Save } from 'lucide-react'

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Tennis']

function EditTurf() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    location: '',
    sport: 'Football',
    surface: '',
    pricePerHour: '',
    description: '',
    facilities: '',
    rating: '',
    isAvailable: true,
  })
  const [existingImages, setExistingImages] = useState([])
  const [newPreview, setNewPreview] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTurfAPI(id).then((res) => {
      if (res.status === 200) {
        const t = res.data
        setForm({
          name: t.name,
          location: t.location,
          sport: t.sport,
          surface: t.surface,
          pricePerHour: t.pricePerHour,
          description: t.description || '',
          facilities: t.facilities?.join(', ') || '',
          rating: t.rating,
          isAvailable: t.isAvailable,
        })
        setExistingImages(t.images || [])
      } else {
        Toast.error(res.response?.data || 'Turf not found')
      }
      setLoading(false)
    })
  }, [id])

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 4)
    setNewFiles(files)
    setNewPreview(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('location', form.location)
    formData.append('sport', form.sport)
    formData.append('surface', form.surface)
    formData.append('pricePerHour', Number(form.pricePerHour))
    formData.append('description', form.description)
    formData.append('facilities', form.facilities)
    formData.append('rating', Number(form.rating || 0))
    formData.append('isAvailable', form.isAvailable)
    newFiles.forEach((f) => formData.append('images', f))

    const res = await updateTurfAPI(id, formData)
    if (res.status === 200) {
      Toast.success('Turf updated successfully')
      navigate('/my-turfs')
    } else {
      Toast.error(res.response?.data?.error || 'Failed to update turf')
    }
    setSubmitting(false)
  }

  if (loading) {
    return <Loading text="Loading turf..." />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
        <Link to="/my-turfs">
          <ChevronLeft />
          Back to My Turfs
        </Link>
      </Button>

      <div className="mb-8 text-center">
        <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Owner</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Edit Turf
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/20 sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Turf Name *</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-location">Location *</Label>
            <Input
              id="edit-location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-sport">Sport *</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger id="edit-sport" className="h-11 w-full rounded-xl bg-background">
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
            <Label htmlFor="edit-surface">Surface *</Label>
            <Input
              id="edit-surface"
              value={form.surface}
              onChange={(e) => setForm({ ...form, surface: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-price">Price Per Hour (₹) *</Label>
            <Input
              id="edit-price"
              type="number"
              min="0"
              value={form.pricePerHour}
              onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-rating">Rating (0-5)</Label>
            <Input
              id="edit-rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-desc">Description</Label>
          <Textarea
            id="edit-desc"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="resize-none rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-facilities">Facilities (comma separated)</Label>
          <Input
            id="edit-facilities"
            value={form.facilities}
            onChange={(e) => setForm({ ...form, facilities: e.target.value })}
            className="h-11 rounded-xl"
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Available for booking</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Toggle to hide or show this turf publicly
            </p>
          </div>
          <Switch
            checked={form.isAvailable}
            onCheckedChange={(v) => setForm({ ...form, isAvailable: v })}
            aria-label="Toggle turf availability"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Images</Label>
          {existingImages.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={`${form.name} ${i + 1}`}
                  className="size-20 rounded-xl border border-border object-cover"
                />
              ))}
            </div>
          )}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted-foreground transition-colors hover:border-emerald-500/50">
            <ImagePlus className="size-5 text-emerald-400" />
            Add new photos (up to 4)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImages}
              className="sr-only"
            />
          </label>
          {newPreview.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {newPreview.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`new ${i + 1}`}
                  className="size-20 rounded-xl border border-emerald-500/50 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)]"
        >
          <Save />
          {submitting ? 'Updating Turf...' : 'Update Turf'}
        </Button>
      </form>
    </div>
  )
}

export default EditTurf