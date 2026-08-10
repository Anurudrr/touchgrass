import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock3 } from 'lucide-react'
import type { Task } from '../lib/types'
import { store } from '../lib/db'
import { categoryIcon, categoryColor } from './icons'
import { Chip, Tilt } from './ui'
import { timeLeft } from '../lib/utils'

export function TaskCard({ task, i = 0 }: { task: Task; i?: number }) {
  const poster = store.user(task.posterId)
  const Icon = categoryIcon(task.category)
  const urgent = task.urgent || Date.now() > new Date(task.deadline).getTime() - 6 * 3600000
  const tile = categoryColor(task.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/task/${task.id}`} className="block h-full [perspective:900px]">
        <Tilt className="h-full">
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative h-full bg-white text-ink border border-border shadow-[0_8px_28px_rgba(31,27,24,0.07)] rounded-[22px] p-5 flex flex-col gap-3"
          >
{urgent && <Chip color="rose" rotate={-6} className="absolute -top-3 -right-3 z-10">URGENT</Chip>}
{task.status === 'open' && !urgent && <Chip color="ink" rotate={5} className="absolute -top-3 -right-3 z-10">NEW</Chip>}
{task.status !== 'open' && (
  <Chip color="sage" rotate={5} className="absolute -top-3 -right-3 z-10">{task.status.replace('_', ' ')}</Chip>
)}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`size-9 rounded-xl border border-ink/10 ${tile} flex items-center justify-center`}>
                <Icon className="size-5" />
              </div>
              <div className="text-[11px] font-body font-bold uppercase tracking-wide leading-tight">
                {task.category}
                <div className="flex items-center gap-1 text-muted font-semibold normal-case">
                  <MapPin className="size-3" /> {task.location.split(',')[0]}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl leading-none">₹{task.price.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-muted font-body font-bold uppercase flex items-center gap-1 justify-end mt-0.5">
                <Clock3 className="size-3" /> {timeLeft(task.deadline)}
              </div>
            </div>
          </div>

          <h3 className="font-body font-bold text-lg leading-snug line-clamp-2">{task.title}</h3>
          <p className="text-sm text-muted line-clamp-2">{task.description}</p>

          <div className="mt-auto pt-2 flex items-center justify-between border-t border-ink/10">
            <div className="flex items-center gap-1.5 text-sm">
              <div className="size-6 rounded-full bg-cocoa text-cream flex items-center justify-center text-[10px] font-body font-bold">
                {(poster?.name ?? '?').slice(0, 1).toUpperCase()}
              </div>
              <span className="font-body font-semibold">{poster?.name.split(' ')[0] ?? 'User'}</span>
              <span className="flex items-center gap-0.5 text-xs font-bold text-muted">
                <Star className="size-3.5 fill-orange text-orange" />
                {poster ? (poster.ratingCount ? poster.ratingAvg.toFixed(1) : 'new') : '—'}
              </span>
            </div>
            <span className="text-xs font-body font-bold uppercase text-muted">Accept →</span>
          </div>
        </motion.div>
        </Tilt>
      </Link>
    </motion.div>
  )
}