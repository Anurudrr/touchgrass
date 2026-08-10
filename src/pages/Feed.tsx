import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, SlidersHorizontal, X } from 'lucide-react'
import { TaskCard } from '../components/TaskCard'
import { Skeleton } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { useDB } from '../lib/db'
import { CATEGORIES, type Task } from '../lib/types'

const CITY_CENTER = { lat: 12.9716, lng: 77.5946 }

function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)))
}

export default function Feed() {
  const db = useDB()
  const [loading, setLoading] = useState(true)
  const [cats, setCats] = useState<string[]>([])
  const [radius, setRadius] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [sort, setSort] = useState<'newest' | 'price_high' | 'price_low' | 'urgency'>('newest')
  const [q, setQ] = useState('')

  useMemo(() => {
    setTimeout(() => setLoading(false), 700)
  }, [])

  const tasks = useMemo(() => {
    let list: Task[] = db.tasks.filter((t) => t.status === 'open' || t.status === 'accepted' || t.status === 'in_progress')
    if (cats.length) list = list.filter((t) => cats.includes(t.category))
    if (maxPrice > 0) list = list.filter((t) => t.price <= maxPrice)
    if (radius > 0) list = list.filter((t) => kmBetween(CITY_CENTER, t) <= radius)
    if (q.trim()) {
      const qq = q.toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(qq) || t.description.toLowerCase().includes(qq) || t.location.toLowerCase().includes(qq))
    }
    switch (sort) {
      case 'newest':
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        break
      case 'price_high':
        list.sort((a, b) => b.price - a.price)
        break
      case 'price_low':
        list.sort((a, b) => a.price - b.price)
        break
      case 'urgency':
        list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        break
    }
    return list
  }, [db.tasks, cats, radius, maxPrice, sort, q])

  const toggleCat = (c: string) => setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-6xl leading-none">
            Open <span className="grad-text">tasks</span>
          </h1>
          <p className="mt-2 text-muted font-body font-semibold text-sm">
            <span className="inline-flex items-center gap-1.5 text-sage mr-1.5">
              <span className="size-2 rounded-full bg-sage animate-pulse" /> live
            </span>
            {tasks.length} tasks near Bengaluru · sorted by {sort.replace('_', ' ')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-orange font-body font-bold">
          <MapPin className="size-4" /> Showing radius: {radius ? `${radius} km` : 'all city'}
        </div>
      </div>

      {/* filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-7 bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[20px] p-4 flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-5 shrink-0" />
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => toggleCat(c.label)}
              className={`px-3 py-1.5 rounded-full font-body font-bold text-xs border border-ink/15 transition-colors ${
                cats.includes(c.label) ? 'bg-coral text-white shadow-[0_8px_16px_rgba(232,125,74,0.35)]' : 'bg-white hover:bg-soft'
              }`}
            >
              {c.label}
            </button>
          ))}
          {cats.length > 0 && (
            <button onClick={() => setCats([])} className="px-3 py-1.5 rounded-full font-body font-bold text-xs bg-coral text-white border border-ink/15 flex items-center gap-1 hover:bg-rose">
              <X className="size-3" /> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="flex-1 min-w-48 bg-white border border-ink/15 rounded-xl px-4 py-2.5 font-body font-semibold text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-blush/50"
            placeholder="Search tasks, keywords, area…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="flex items-center gap-2 text-xs font-body font-bold uppercase">
            Radius
            <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="bg-white border border-ink/15 rounded-xl px-3 py-2 font-body font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blush/50">
              <option value={0}>All city</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={15}>15 km</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-body font-bold uppercase">
            Max ₹
            <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="bg-white border border-ink/15 rounded-xl px-3 py-2 font-body font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blush/50">
              <option value={0}>Any</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="bg-white border border-ink/15 rounded-xl px-3 py-2 font-body font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blush/50">
            <option value="newest">Newest first</option>
            <option value="urgency">Most urgent</option>
            <option value="price_high">Price: high → low</option>
            <option value="price_low">Price: low → high</option>
          </select>
        </div>
      </motion.div>

      {/* grid */}
      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-warm-paper border border-border shadow-[0_8px_28px_rgba(31,27,24,0.07)] rounded-[22px] p-5 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="mt-14 text-center bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-14">
          <Grassbot size={88} mood="wave" className="mx-auto" />
          <p className="font-display text-4xl">nothing matches. the feed is playing hard to get.</p>
          <p className="mt-3 text-neutral-600 font-body font-semibold">loosen the filters, or post the task yourself — grassbot believes in you.</p>
          <a href="/post" className="inline-block mt-6 bg-coral text-white rounded-full px-6 py-3 font-body font-bold uppercase shadow-[0_10px_25px_rgba(232,125,74,0.4)] hover:bg-rose transition-colors">
            Post a Task
          </a>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((t, i) => (
            <TaskCard key={t.id} task={t} i={i} />
          ))}
        </div>
      )}
    </div>
  )
}
