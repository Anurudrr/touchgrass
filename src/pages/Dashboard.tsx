import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ClipboardList, Flame, ShieldAlert, Sparkles, Trophy, UserRound } from 'lucide-react'
import { TaskCard } from '../components/TaskCard'
import { Pill, toast } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { store, useDB } from '../lib/db'
import { grassStreak, levelFor, xpFor } from '../lib/gamify'
import type { Task, TaskStatus } from '../lib/types'

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

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}

const LEVEL_HINT = 'the next grass level ✨'

const FILTERS: { key: 'all' | TaskStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'completed', label: 'Done' },
  { key: 'paid', label: 'Paid' },
]

export default function Dashboard() {
  const db = useDB()
  const user = store.sessionUser()
  const [tab, setTab] = useState<'posted' | 'doing'>('posted')
  const [filter, setFilter] = useState<typeof FILTERS[number]['key']>('all')

  const posted = useMemo(
    () =>
      db.tasks
        .filter((t) => t.posterId === user?.id)
        .filter((t) => filter === 'all' || t.status === filter)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [db.tasks, user?.id, filter]
  )

  const doing = useMemo(
    () =>
      db.assignments
        .filter((a) => a.doerId === user?.id)
        .map((a) => db.tasks.find((t) => t.id === a.taskId))
        .filter(Boolean)
        .filter((t) => filter === 'all' || t!.status === filter)
        .sort((a, b) => b!.createdAt.localeCompare(a!.createdAt)) as NonNullable<typeof posted[number]>[],
    [db.assignments, db.tasks, user?.id, filter]
  )

  const myDone = useMemo(
    () =>
      db.assignments
        .filter((a) => a.doerId === user?.id)
        .map((a) => db.tasks.find((t) => t.id === a.taskId))
        .filter((t): t is Task => !!t && (t.status === 'completed' || t.status === 'paid')),
    [db.assignments, db.tasks, user?.id]
  )
  const xp = user ? xpFor(user.tasksDone, user.ratingCount, user.idVerification === 'verified') : 0
  const lvl = levelFor(xp)
  const streak = grassStreak(myDone)

  if (!user) {
    return (
      <div className="bg-[#FFF9F0] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-[#FFF9F0] border-2 border-[var(--color-ink)] rounded-[1.5rem] p-10 shadow-brutal-lg">
          <Grassbot size={72} mood="wave" style={{ margin: '0 auto 1.5rem' }} />
          <p className="font-display text-3xl text-[var(--color-fg)]">Log in to see your tasks</p>
          <Link to="/auth" className="avy-btn avy-btn--lg mt-6 mx-auto w-fit">
            <span className="avy-btn__text">Log in / Sign up</span>
            <span className="avy-btn__icon"><ArrowIcon /></span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#FFF9F0] min-h-screen">
      {/* Yellow hero header */}
      <div className="bg-[#F9E84A] border-b-2 border-[var(--color-ink)] pt-24 pb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[35%] opacity-10 pointer-events-none">
          <svg viewBox="0 0 386 400" fill="none"><path fill="#0F0E0A" d="M115.415-56.646c27.361-10.951 55.489-16.17 84.985-10.076 40.714 8.42 64.637 33.98 75.035 73.257 9.349 35.348 3.777 70.616-.769 105.961-4.86 37.766-10.042 75.565-12.734 113.514-1.993 28.09 5.481 54.869 20.638 79.162 14.419 23.106 34.405 37.375 61.693 41.433 30.041 4.465 59.172-.835 88.412-6.653 26.135-5.192 52.289-10.684 78.69-13.939 22.265-2.747 44.838-1.383 65.775 8.431 38.064 17.842 51.287 57.852 44.901 96.147z" /></svg>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-normal text-[var(--color-fg)] leading-none">
                Hey, <em className="italic">{user.name.split(' ')[0]}</em> 👋
              </h1>
              <p className="mt-2 font-body font-semibold text-sm text-[var(--color-fg)]/65">
                {posted.length} posted · {doing.length} doing · wallet ready when work's done
              </p>
            </div>
            <Link to="/post" className="avy-btn avy-btn--lg">
              <span className="avy-btn__text">+ Post a Task</span>
              <span className="avy-btn__icon"><ArrowIcon size={16} /></span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 pb-24">
        {/* Level / streak strip */}
        <div className="flex flex-wrap items-center gap-4 rounded-[1.25rem] bg-[var(--color-ink)] border-2 border-[var(--color-ink)] shadow-brutal p-5 mb-8">
          <Grassbot size={54} mood={streak > 0 ? 'happy' : 'idle'} />
          <div className="flex-1 min-w-[14rem]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tag-pill border-2 border-[#F9E84A] shadow-brutal-accent" style={{ background: '#F9E84A', color: 'var(--color-fg)' }}>
                <Trophy className="size-3.5 inline mr-1 -mt-0.5" /> L{lvl.level.lvl} · {lvl.level.name}
              </span>
              <span className="tag-pill border-2 border-[#F9A220]" style={{ background: '#F9A220', color: 'var(--color-fg)' }}>
                <Flame className="size-3.5 inline mr-1 -mt-0.5" /> {streak}-day grass streak
              </span>
              <span className="font-body text-xs font-semibold text-[#FFF9F0]/50">xp {xp}</span>
            </div>
            <div className="mt-2.5 h-2 rounded-full bg-[#FFF9F0]/10 overflow-hidden border border-[#FFF9F0]/20">
              <motion.div
                className="h-full bg-[#F9E84A]"
                initial={{ width: 0 }}
                animate={{ width: `${lvl.pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-1 text-[11px] font-body font-semibold text-[#FFF9F0]/40">
              {lvl.xpNeeded > 0 ? `${lvl.xpNeeded} xp to ${LEVEL_HINT}` : 'maxed out. mad respect.'}
            </p>
          </div>
          <Sparkles className="size-5 text-[#F9A220] hidden sm:block" />
        </div>

        {/* Tab + filter row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Pill active={tab === 'posted'} onClick={() => setTab('posted')}>
            <ClipboardList className="size-4 inline mr-1.5 -mt-0.5" /> Posted by me
          </Pill>
          <Pill active={tab === 'doing'} onClick={() => setTab('doing')}>
            <UserRound className="size-4 inline mr-1.5 -mt-0.5" /> I'm doing
          </Pill>
          <span className="mx-2 h-5 w-0.5 bg-[var(--color-ink)]/10" />
          {FILTERS.map((f) => (
            <Pill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </Pill>
          ))}
        </div>

        {/* Task grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tab === 'posted' &&
            (posted.length === 0 ? (
              <Empty msg="nothing here yet. post your first task and stop scrolling." cta="Post a task" to="/post" />
            ) : (
              posted.map((t, i) => (
                <motion.div key={t.id} variants={itemVariants}>
                  <TaskCard task={t} i={i} />
                </motion.div>
              ))
            ))}
          {tab === 'doing' &&
            (doing.length === 0 ? (
              <Empty msg="no tasks accepted yet. the feed is full of easy money, bestie." cta="Browse tasks" to="/tasks" />
            ) : (
              doing.map((t, i) => (
                <motion.div key={t.id} variants={itemVariants}>
                  <TaskCard task={t} i={i} />
                  <div className="mt-2 flex gap-2">
                    {t.status === 'in_progress' && (
                      <button
                        onClick={() => {
                          store.setStatus(t.id, 'completed')
                          toast('Marked complete ✅', 'Poster needs to confirm. No pressure.')
                        }}
                        className="flex-1 rounded-xl bg-[#4cad7d] text-white border-2 border-[var(--color-ink)] shadow-brutal px-3 py-2 font-body font-bold text-sm hover:-translate-y-0.5 hover:shadow-brutal-lg transition-all"
                      >
                        <CheckCircle2 className="size-4 inline mr-1 -mt-0.5" /> Mark complete
                      </button>
                    )}
                    {t.status === 'completed' && (
                      <button
                        onClick={() => toast('Dispute raised', 'Our team will review within 24 hrs. Stay calm.', 'error')}
                        className="flex-1 rounded-xl bg-[#c8254a] text-white border-2 border-[var(--color-ink)] shadow-brutal px-3 py-2 font-body font-bold text-sm hover:-translate-y-0.5 hover:shadow-brutal-lg transition-all"
                      >
                        <ShieldAlert className="size-4 inline mr-1 -mt-0.5" /> Dispute
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ))}
        </motion.div>
      </div>
    </div>
  )
}

function Empty({ msg, cta, to }: { msg: string; cta: string; to: string }) {
  function ArrowIcon({ size = 13 }: { size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
        <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <div className="col-span-full py-16 text-center bg-[#FFF9F0] border-2 border-[var(--color-ink)] shadow-brutal rounded-[1.5rem] flex flex-col items-center">
      <Grassbot size={64} mood="idle" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
      <p className="font-display text-2xl text-[var(--color-fg)]">{msg}</p>
      <Link to={to} className="avy-btn avy-btn--sm mt-5 mx-auto w-fit border-2 border-[var(--color-ink)] shadow-[2px_2px_0_#0F0E0A]" style={{ background: 'var(--color-ink)', color: 'var(--color-fg-light)' }}>
        <span className="avy-btn__text">{cta}</span>
        <span className="avy-btn__icon"><ArrowIcon /></span>
      </Link>
    </div>
  )
}
