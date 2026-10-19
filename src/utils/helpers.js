import { server_url } from '../services/server_url'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop'

export const getImageUrl = (filename, fallback = DEFAULT_IMAGE) => {
    if (filename) return `${server_url}/uploads/${filename}`
    return fallback
}

export const getFirstTurfImage = (turf, fallback = DEFAULT_IMAGE) => {
    if (turf?.images && turf.images.length > 0) {
        return `${server_url}/uploads/${turf.images[0]}`
    }
    return fallback
}

export const statusBadge = (status) => {
    const map = {
        pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
        refunded: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
        completed: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        failed: 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    return map[status] || 'bg-slate-500/20 text-slate-300 border-slate-400/30'
}

export const getMyBookingsCount = (bookings = []) => {
    const counts = {
        total: bookings.length,
        pending: 0,
        confirmed: 0,
        spent: 0,
        noOfCancellations: 0
    }
    bookings.forEach((b) => {
        if (b.status === 'pending') counts.pending += 1
        if (b.status === 'confirmed') counts.confirmed += 1
        if (b.paymentStatus === 'paid') counts.spent += b.amount || 0
        if (b.status === 'cancelled') counts.noOfCancellations += 1
    })
    return counts
}