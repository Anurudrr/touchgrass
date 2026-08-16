import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MapPin, SlidersHorizontal, X, GripVertical } from 'lucide-react'
import { TaskCard } from '../components/TaskCard'
import { Skeleton, inputCls, toast } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { SearchAutocomplete } from '../components/SearchAutocomplete'
import { SavedSearchManager } from '../components/SavedSearchManager'
import { useDB } from '../lib/db'
import { CATEGORIES, type Task } from '../lib/types'
import { Link } from 'react-router-dom'
import { usePullToRefresh, PullToRefreshIndicator } from '../hooks/usePullToRefresh.tsx'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

/* ─── Arrow icon ─── */
function ArrowIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}

const CITY_CENTER = { lat: 12.9716, lng: 77.5946 }

function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)))
}

/* ─── Sortable Task Card Wrapper ─── */
interface SortableTaskCardProps {
  task: Task
  index: number
  id: string
}

function SortableTaskCard({ task, index, id }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={itemVariants}
      whileDrag={{ scale: 1.02, boxShadow: 'var(--shadow-brutal-lg)' }}
    >
      <div {...attributes} {...listeners} className="touch-none">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-[var(--color-muted)] cursor-grab active:cursor-grabbing">
          <GripVertical size={20} />
        </div>
        <TaskCard task={task} i={index} />
      </div>
    </motion.div>
  )
}

/* ─── Tag colors for filter pills ─── */
const CAT_PILL_COLORS: Record<string, { bg: string; color: string }> = {
  'Printing & Documents':      { bg: '#9e81e4', color: '#fff' },
  'Parcel Pickup/Delivery':    { bg: '#006fff', color: '#fff' },
  'Minor Repairs & Handyman':  { bg: '#F9A220', color: 'var(--color-fg)' },
  'Tutoring & Assignment Help':{ bg: '#e6ff2b', color: 'var(--color-fg)' },
  'Event & Setup Help':        { bg: '#c8254a', color: '#fff' },
  'General Errands':           { bg: '#4cad7d', color: '#fff' },
  'Elderly Assistance':        { bg: '#395f63', color: '#fff' },
  'Document Help (Online)':    { bg: '#0F0E0A', color: '#FFF9F0' },
}

export default function Feed() {
  const db = useDB()
  const [loading, setLoading] = useState(true)
  const [cats, setCats] = useState<string[]>([])
  const [radius, setRadius] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [sort, setSort] = useState<'newest' | 'price_high' | 'price_low' | 'urgency'>('newest')
  const [q, setQ] = useState('')

  const refresh = useCallback(async () => {
    // Force a re-fetch by triggering a DB sync
    await new Promise(resolve => setTimeout(resolve, 500))
  }, [])

  const { ref, isRefreshing, progress, handlers } = usePullToRefresh({
    onRefresh: refresh,
    threshold: 80,
  })

  /* ─── FIX: use useEffect (not useMemo) for side-effects ─── */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
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
      case 'newest': list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
      case 'price_high': list.sort((a, b) => b.price - a.price); break
      case 'price_low': list.sort((a, b) => a.price - b.price); break
      case 'urgency': list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()); break
    }
    return list
  }, [db.tasks, cats, radius, maxPrice, sort, q])

  const toggleCat = (c: string) => setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      // Note: In a real app, you'd persist this order to the backend
      // For now, we'll just show a toast
      toast('Order updated', 'Drag to reorder is demo-only', 'success')
    }
  }

  return (
    <div className="bg-[#FFF9F0] min-h-screen">
      {/* Hero bar */}
      <div className="bg-[#F9E84A] border-b-2 border-[var(--color-ink)] pt-24 pb-10 relative overflow-hidden">
        {/* Subtle blob */}
        <div className="absolute right-0 top-0 w-[40%] opacity-[0.18] pointer-events-none">
          <svg viewBox="0 0 386 400" fill="none"><path fill="#0F0E0A" d="M115.415-56.646c27.361-10.951 55.489-16.17 84.985-10.076 40.714 8.42 64.637 33.98 75.035 73.257 9.349 35.348 3.777 70.616-.769 105.961-4.86 37.766-10.042 75.565-12.734 113.514-1.993 28.09 5.481 54.869 20.638 79.162 14.419 23.106 34.405 37.375 61.693 41.433 30.041 4.465 59.172-.835 88.412-6.653 26.135-5.192 52.289-10.684 78.69-13.939 22.265-2.747 44.838-1.383 65.775 8.431 38.064 17.842 51.287 57.852 44.901 96.147z" /></svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal text-[var(--color-fg)] leading-[1.05] tracking-[-0.01em]">
                Open <em className="italic">tasks</em>
              </h1>
              <p className="font-body text-[0.95rem] text-[var(--color-fg)]/65 mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[#4cad7d] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#4cad7d] inline-block animate-pulse" />
                  live
                </span>
                {tasks.length} tasks near Bengaluru · sorted by {sort.replace('_', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-body text-[0.85rem] font-semibold text-[var(--color-fg)]/65">
              <MapPin size={15} />
              Radius: {radius ? `${radius} km` : 'all city'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 pb-24">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#FFFFFF] border-2 border-[var(--color-ink)] rounded-[1.25rem] p-5 mb-8 flex flex-col gap-4 shadow-brutal"
        >
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={16} color="#5A574F" />
            {CATEGORIES.map((c) => {
              const cfg = CAT_PILL_COLORS[c.label] ?? { bg: '#0F0E0A', color: '#FFF9F0' }
              const active = cats.includes(c.label)
              return (
                <button
                  key={c.key}
                  onClick={() => toggleCat(c.label)}
                  className="tag-pill cursor-pointer transition-all duration-200 border-2"
                  style={{
                    background: active ? cfg.bg : '#FFF4E2',
                    color: active ? cfg.color : '#5A574F',
                    borderColor: active ? cfg.bg : '#E8E2D4',
                    fontSize: '0.72rem',
                    padding: '0.35rem 0.85rem',
                    boxShadow: active ? '2px 2px 0px #0F0E0A' : 'none',
                  }}
                >
                  {c.label}
                </button>
              )
            })}
            {cats.length > 0 && (
              <button
                onClick={() => setCats([])}
                className="tag-pill cursor-pointer flex items-center gap-1.5 border-2 border-[#c8254a] shadow-brutal"
                style={{ background: '#c8254a', color: '#fff', fontSize: '0.72rem', padding: '0.35rem 0.85rem' }}
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>

          {/* Search + filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <SearchAutocomplete
              value={q}
              onChange={setQ}
              onSubmit={setQ}
              placeholder="Search tasks, keywords, area…"
              className="flex-[1_1_220px]"
            />
            <SavedSearchManager />
            <label className="flex items-center gap-2 font-body text-xs font-bold tracking-[0.06em] uppercase text-[var(--color-muted)]">
              Radius
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className={`${inputCls} rounded-lg px-3 py-2 font-body font-semibold text-[0.8rem] cursor-pointer`}
              >
                <option value={0}>All city</option>
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
              </select>
            </label>
            <label className="flex items-center gap-2 font-body text-xs font-bold tracking-[0.06em] uppercase text-[var(--color-muted)]">
              Max ₹
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={`${inputCls} rounded-lg px-3 py-2 font-body font-semibold text-[0.8rem] cursor-pointer`}
              >
                <option value={0}>Any</option>
                <option value={100}>₹100</option>
                <option value={250}>₹250</option>
                <option value={500}>₹500</option>
                <option value={1000}>₹1000</option>
              </select>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className={`${inputCls} rounded-lg px-3 py-2 font-body font-semibold text-[0.8rem] cursor-pointer`}
            >
              <option value="newest">Newest first</option>
              <option value="urgency">Most urgent</option>
              <option value="price_high">Price: high → low</option>
              <option value="price_low">Price: low → high</option>
            </select>
          </div>
        </motion.div>

        {/* Task grid */}
        {loading ? (
          <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#FFF4E2] border-2 border-[var(--color-ink)] rounded-[1.25rem] p-6 flex flex-col gap-3 min-h-[240px] shadow-brutal">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 px-8 bg-[#FFF4E2] rounded-[1.5rem] border-2 border-[var(--color-ink)] shadow-brutal">
            <Grassbot size={88} mood="wave" style={{ margin: '0 auto 1.5rem' }} />
            <p className="font-display text-[2rem] font-normal text-[var(--color-fg)] mb-3">
              Nothing matches. The feed is playing hard to get.
            </p>
            <p className="font-body text-[1rem] text-[#5A574F] mb-8">
              Loosen the filters, or post the task yourself.
            </p>
            <Link to="/post" className="avy-btn">
              <span className="avy-btn__text">Post a Task</span>
              <span className="avy-btn__icon"><ArrowIcon /></span>
            </Link>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div ref={ref} {...handlers} className="touch-none">
              <PullToRefreshIndicator progress={progress} isRefreshing={isRefreshing} />
              <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {tasks.map((t, i) => (
                    <SortableTaskCard key={t.id} task={t} index={i} id={t.id} />
                  ))}
                </motion.div>
              </SortableContext>
              <DragOverlay>
                {(props: { active: { id: string } | null; dropAnimation?: { transform: { x: number; y: number; scaleX: number; scaleY: number } } }) => {
                  const { active, dropAnimation } = props
                  if (!active) return null
                  const task = tasks.find(t => t.id === active.id)
                  if (!task) return null
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ transform: CSS.Transform.toString(dropAnimation?.transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 }) }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <TaskCard task={task} i={0} />
                    </motion.div>
                  )
                }}
              </DragOverlay>
            </div>
          </DndContext>
        )}
      </div>
    </div>
  )
}
