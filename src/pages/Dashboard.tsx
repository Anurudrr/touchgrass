import { useMemo, useState } from 'react'
import { Link } from "react-router-dom"
import { motion } from 'framer-motion'
import { CheckCircle2, ClipboardList, Flame, ShieldAlert, Sparkles, Trophy, UserRound } from 'lucide-react'
import { TaskCard } from '../components/TaskCard'
import { BrutButton, Chip, Pill, toast } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { store, useDB } from '../lib/db'
import { grassStreak, levelFor, xpFor } from '../lib/gamify'
import type { Task, TaskStatus } from '../lib/types'

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
      <div className="max-w-md mx-auto px-4 pt-16 text-center">
        <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-10">
          <p className="font-display text-3xl">Log in to see your tasks</p>
          <Link to="/auth">
            <BrutButton className="mt-6 w-full" pulse>Log in / Sign up</BrutButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl leading-none">
            Hey, <span className="text-teal">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="mt-2 text-muted font-body font-semibold text-sm">
            {posted.length} posted · {doing.length} doing · wallet ready when work's done
          </p>
        </div>
        <Link to="/post">
          <motion.span whileHover={{ y: -3 }} whileTap={{ scale: 0.94 }} className="inline-block bg-teal text-white rounded-full px-6 py-3 font-body font-bold uppercase shadow-[0_10px_25px_rgba(13,115,119,0.35)]">
            + Post a Task
          </motion.span>
        </Link>
      </div>

      {/* grass / level strip */}
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-[20px] bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] p-4 sm:p-5">
        <Grassbot size={54} mood={streak > 0 ? 'happy' : 'idle'} />
        <div className="flex-1 min-w-56">
          <div className="flex flex-wrap items-center gap-2">
<Chip color="sage" rotate={-2}><Trophy className="size-3.5 inline mr-1 -mt-0.5" /> L{lvl.level.lvl} · {lvl.level.name}</Chip>
<Chip color="coral" rotate={2}><Flame className="size-3.5 inline mr-1 -mt-0.5" /> {streak}-day grass streak</Chip>
            <span className="text-xs font-body font-semibold text-muted">xp {xp}</span>
          </div>
          <div className="mt-2.5 h-2 rounded-full bg-soft overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green to-lightblue"
              initial={{ width: 0 }}
              animate={{ width: `${lvl.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-[11px] font-body font-semibold text-muted">
            {lvl.xpNeeded > 0 ? `${lvl.xpNeeded} xp to ${LEVEL_HINT}` : 'maxed out. mad respect.'}
          </p>
        </div>
        <Sparkles className="size-5 text-orange hidden sm:block" />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Pill active={tab === 'posted'} onClick={() => setTab('posted')}>
          <ClipboardList className="size-4 inline mr-1.5 -mt-0.5" /> Posted by me
        </Pill>
        <Pill active={tab === 'doing'} onClick={() => setTab('doing')}>
          <UserRound className="size-4 inline mr-1.5 -mt-0.5" /> I'm doing
        </Pill>
        <span className="mx-2 h-5 w-0.5 bg-ink/10" />
        {FILTERS.map((f) => (
          <Pill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Pill>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tab === 'posted' &&
          (posted.length === 0 ? (
            <Empty msg="nothing here yet. post your first task and stop scrolling." cta="Post a task" to="/post" />
          ) : (
            posted.map((t, i) => <TaskCard key={t.id} task={t} i={i} />)
          ))}
        {tab === 'doing' &&
          (doing.length === 0 ? (
            <Empty msg="no tasks accepted yet. the feed is full of easy money, bestie." cta="Browse tasks" to="/tasks" />
          ) : (
            doing.map((t, i) => (
              <div key={t.id}>
                <TaskCard task={t} i={i} />
                <div className="mt-2 flex gap-2">
                  {t.status === 'in_progress' && (
                    <button
                      onClick={() => {
                        store.setStatus(t.id, 'completed')
                        toast('Marked complete ✅', 'Poster needs to confirm. No pressure.')
                      }}
                      className="flex-1 rounded-xl bg-green text-white border-brut px-3 py-2 font-body font-bold text-sm hover:shadow-brut-sm transition-all"
                    >
                      <CheckCircle2 className="size-4 inline mr-1 -mt-0.5" /> Mark complete
                    </button>
                  )}
                  {t.status === 'completed' && (
                    <button
                      onClick={() => toast('Dispute raised', 'Our team will review within 24 hrs. Stay calm.', 'error')}
                      className="flex-1 rounded-xl bg-danger text-white border-brut px-3 py-2 font-body font-bold text-sm hover:shadow-brut-sm transition-all"
                    >
                      <ShieldAlert className="size-4 inline mr-1 -mt-0.5" /> Dispute
                    </button>
                  )}
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  )
}

function Empty({ msg, cta, to }: { msg: string; cta: string; to: string }) {
  return (
    <div className="col-span-full bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-12 text-center">
      <div className="mx-auto w-fit"><Grassbot size={80} mood="wave" /></div>
      <p className="mt-4 font-body font-bold text-lg text-neutral-600">{msg}</p>
      <Link to={to} className="inline-block mt-5 bg-orange text-white border-brut-4 rounded-2xl px-6 py-3 font-body font-bold uppercase hover:bg-maroon">
        {cta}
      </Link>
    </div>
  )
}
