import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock3, Star } from 'lucide-react'
import type { Task } from '../lib/types'
import { store } from '../lib/db'
import { timeLeft } from '../lib/utils'

/* ─── Arrow icon ─── */
function ArrowIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}

/* ─── Ear notch SVGs ─── */
function LeftEar({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 44 45"
      style={{ position: 'absolute', top: -1, left: -1, width: 36, height: 'auto', zIndex: 2, pointerEvents: 'none' }}>
      <path fill={color} d="M1.335.198c.671-.316 1.5-.254 2.186.187C27.678 16.847 39.839 36.953 44 45h-6.048c-2.382-1.604-6.964-3.674-15.652-4.814C2.999 37.666-.665 14.174.09 2.04.152 1.28.589.515 1.335.198Z" />
    </svg>
  )
}

function RightEar({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 29 80"
      style={{ position: 'absolute', top: -1, right: -1, width: 22, height: 'auto', zIndex: 2, pointerEvents: 'none' }}>
      <path fill={color} d="M19.388.879c.667-.771 1.647-1.018 2.559-.807.912.21 1.682.956 1.926 1.861C34.595 38.09 25.79 69.237 21.823 80h-4.188c-.17-4.22-2.739-13.318-10.975-22.064-8.493-9.099-8.88-21.913-1.063-37.23C11.221 9.603 19.091 1.266 19.388.879Z" />
    </svg>
  )
}

/* ─── Tag color config ─── */
const CAT_TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'Printing & Documents':      { bg: '#9e81e4', color: '#fff' },
  'Parcel Pickup/Delivery':    { bg: '#006fff', color: '#fff' },
  'Minor Repairs & Handyman':  { bg: '#F9A220', color: '#0F0E0A' },
  'Tutoring & Assignment Help':{ bg: '#e6ff2b', color: '#0F0E0A' },
  'Event & Setup Help':        { bg: '#c8254a', color: '#fff' },
  'General Errands':           { bg: '#4cad7d', color: '#fff' },
  'Elderly Assistance':        { bg: '#395f63', color: '#fff' },
  'Document Help (Online)':    { bg: '#0F0E0A', color: '#FFF9F0' },
}

const CARD_ACCENT_COLORS = [
  '#680036', '#4cad7d', '#325c13', '#FFF4E2', '#006fff', '#9e81e4', '#c8254a', '#395f63',
]

export function TaskCard({ task, i = 0 }: { task: Task; i?: number }) {
  const poster = store.user(task.posterId)
  const urgent = task.urgent || Date.now() > new Date(task.deadline).getTime() - 6 * 3600000
  const tagCfg = CAT_TAG_COLORS[task.category] ?? { bg: '#0F0E0A', color: '#FFF9F0' }
  const accent = CARD_ACCENT_COLORS[i % CARD_ACCENT_COLORS.length]
  const isDark = !['#FFF4E2', '#fde37d', '#e6ff2b'].includes(accent)
  const textOnAccent = isDark ? '#FFF9F0' : '#0F0E0A'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/task/${task.id}`} className="block no-underline">
        <div
          className="rounded-[1.25rem] relative overflow-hidden flex flex-col min-h-[260px] border-2 border-[#0F0E0A] shadow-brutal transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-0.5 group-hover:shadow-brutal-lg"
          style={{ background: accent, padding: '2rem 1.5rem 1.5rem' }}
        >
          {/* Ear notches */}
          <LeftEar color={accent} />
          <RightEar color={accent} />

          {/* Status badge */}
          {urgent && (
            <div className="absolute top-3 right-8 z-[3]">
              <span className="tag-pill border-2 border-[#0F0E0A] shadow-brutal" style={{ background: '#c8254a', color: '#fff' }}>URGENT</span>
            </div>
          )}
          {!urgent && task.status === 'open' && (
            <div className="absolute top-3 right-8 z-[3]">
              <span className="tag-pill border-2 border-[#0F0E0A]" style={{ background: '#0F0E0A', color: '#FFF9F0' }}>NEW</span>
            </div>
          )}

          {/* Category tag */}
          <div className="mb-4 relative z-10">
            <span className="tag-pill border border-[rgba(0,0,0,0.15)]" style={{ background: tagCfg.bg, color: tagCfg.color }}>
              {task.category}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mb-2 relative z-10">
            <MapPin size={12} color={textOnAccent} style={{ opacity: 0.6 }} />
            <span className="font-body text-[0.75rem] opacity-60" style={{ color: textOnAccent }}>
              {task.location.split(',')[0]}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-display text-[1.3rem] font-normal leading-tight mb-2 flex-1 line-clamp-2 relative z-10"
            style={{ color: textOnAccent }}
          >
            {task.title}
          </h3>

          <p
            className="font-body text-[0.82rem] leading-snug line-clamp-2 mb-5 relative z-10"
            style={{ color: textOnAccent, opacity: 0.65 }}
          >
            {task.description}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-auto pt-3 relative z-10"
            style={{ borderTop: `1px solid ${isDark ? 'rgba(255,249,240,0.15)' : 'rgba(15,14,10,0.12)'}` }}
          >
            <div>
              <div className="font-display text-[1.5rem] font-normal leading-none" style={{ color: textOnAccent }}>
                ₹{task.price.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock3 size={11} color={textOnAccent} style={{ opacity: 0.5 }} />
                <span className="font-body text-[0.7rem] opacity-50" style={{ color: textOnAccent }}>
                  {timeLeft(task.deadline)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Poster avatar */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-body font-bold text-[0.65rem]"
                  style={{
                    background: isDark ? 'rgba(255,249,240,0.2)' : 'rgba(15,14,10,0.1)',
                    color: textOnAccent,
                  }}
                >
                  {(poster?.name ?? '?').slice(0, 1).toUpperCase()}
                </div>
                <div className="flex items-center gap-0.5">
                  <Star size={11} fill="#F9A220" color="#F9A220" />
                  <span className="font-body text-[0.7rem] font-semibold opacity-70" style={{ color: textOnAccent }}>
                    {poster ? (poster.ratingCount ? poster.ratingAvg.toFixed(1) : 'new') : '—'}
                  </span>
                </div>
              </div>

              {/* Accept button */}
              <div className="avy-btn avy-btn--sm" style={{ borderColor: textOnAccent }}>
                <span className="avy-btn__text" style={{ background: textOnAccent, color: accent }}>Accept</span>
                <span className="avy-btn__icon" style={{ background: 'transparent', color: textOnAccent }}><ArrowIcon /></span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}