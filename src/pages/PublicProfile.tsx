import { Link, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Trophy, Flame, ShieldCheck, Briefcase } from 'lucide-react'
import { Counter } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { store, useDB } from '../lib/db'
import { levelFor, xpFor, grassStreak } from '../lib/gamify'
import { fmtDate } from '../lib/utils'
import type { Task } from '../lib/types'

export default function PublicProfile() {
  const { username } = useParams()
  const db = useDB()
  const user = store.userByName(username ?? '')

  if (!user) {
    return (
      <div className="bg-[var(--color-cream)] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1.5rem] p-10 shadow-brutal-lg">
          <Grassbot size={72} mood="wave" style={{ margin: '0 auto 1.5rem' }} />
          <p className="font-display text-3xl text-[var(--color-ink)]">User not found</p>
          <Link to="/tasks" className="avy-btn avy-btn--lg mt-6 mx-auto w-fit">
            <span className="avy-btn__text">Browse tasks →</span>
          </Link>
        </div>
      </div>
    )
  }

  const myDone = db.assignments
    .filter((a) => a.doerId === user.id)
    .map((a) => db.tasks.find((t) => t.id === a.taskId))
    .filter((t): t is Task => !!t && (t.status === 'completed' || t.status === 'paid'))
  const xp = xpFor(user.tasksDone, user.ratingCount, user.idVerification === 'verified')
  const lvl = levelFor(xp)
  const streak = grassStreak(myDone)

  const postedTasks = db.tasks.filter((t) => t.posterId === user.id)
  const completedAsDoer = myDone.length
  const reviews = store.reviewsFor(user.id)

  return (
    <div className="bg-[var(--color-cream)] min-h-screen">
      {/* Hero header */}
      <div className="bg-[var(--color-yellow)] border-b-2 border-[var(--color-ink)] pt-24 pb-10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <Link to="/tasks" className="inline-flex items-center gap-2 text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] font-body font-bold text-sm transition-colors border-2 border-transparent hover:border-[var(--color-ink)] bg-transparent hover:bg-[var(--color-yellow)] px-3 py-1.5 rounded-full mb-6">
            <ArrowLeft className="size-4" /> Back to tasks
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            {/* Avatar */}
            <div className="size-24 rounded-2xl bg-[var(--color-ink)] text-[var(--color-yellow)] border-2 border-[var(--color-ink)] shadow-brutal flex items-center justify-center font-display text-5xl shrink-0">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-normal text-[var(--color-ink)] leading-tight flex flex-wrap items-center gap-3">
                {user.name}
                <span className="tag-pill border-2 border-[var(--color-ink)] text-sm shadow-brutal" style={{ background: 'var(--color-ink)', color: 'var(--color-yellow)' }}>
                  L{lvl.level.lvl} · {lvl.level.name}
                </span>
              </h1>
              <p className="mt-1.5 flex items-center gap-2 font-body font-bold text-sm text-[var(--color-ink)]/75">
                <Star className="size-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                {user.ratingCount ? `${user.ratingAvg.toFixed(1)} · ${user.ratingCount} ratings` : 'No ratings yet'} · {user.tasksDone} tasks done · {completedAsDoer} as doer
              </p>
              <p className="text-xs text-[var(--color-ink)]/50 font-body font-semibold mt-1">{user.area} · joined {fmtDate(user.joinedAt)}</p>
              {/* XP bar */}
              <div className="mt-3 max-w-xs">
                <div className="flex justify-between text-[10px] font-body font-bold uppercase text-[var(--color-ink)]/50 mb-1">
                  <span>{lvl.xpNeeded > 0 ? `${lvl.xpNeeded} xp to next level` : 'maxed out ✨'}</span>
                  <span>{xp} xp</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-ink)]/15 overflow-hidden border border-[var(--color-ink)]/20">
                  <motion.div className="h-full bg-[var(--color-ink)]" initial={{ width: 0 }} animate={{ width: `${lvl.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
            {/* Verification badge */}
            <div className="ml-auto">
              {user.idVerification === 'verified' ? (
                <span className="tag-pill border-2 border-[var(--color-sage)] shadow-brutal text-sm" style={{ background: 'var(--color-sage)', color: '#fff' }}>
                  <ShieldCheck className="size-3.5 inline mr-1 -mt-0.5" /> ID Verified
                </span>
              ) : (
                <span className="tag-pill border-2 border-[var(--color-rose)] shadow-brutal text-sm" style={{ background: 'var(--color-rose)', color: '#fff' }}>
                  <ShieldCheck className="size-3.5 inline mr-1 -mt-0.5" /> Not Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 pb-24 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Bio */}
          {user.bio && (
            <div className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1.25rem] p-6 shadow-brutal">
              <h2 className="font-display text-lg text-[var(--color-ink)] mb-3">About</h2>
              <p className="font-body font-medium text-[var(--color-ink)]/80">{user.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: user.tasksDone, l: 'Posted' },
              { v: completedAsDoer, l: 'Completed' },
              { v: user.ratingCount, l: 'Ratings' },
            ].map((s) => (
              <div key={s.l} className="rounded-[1.25rem] bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] shadow-brutal p-5 text-center">
                <p className="font-display text-2xl text-[var(--color-ink)]">
                  <Counter to={s.v} />
                </p>
                <p className="text-[10px] font-body font-bold uppercase text-[var(--color-muted)] mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Recent activity as poster */}
          {postedTasks.length > 0 && (
            <div className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1.25rem] p-6 shadow-brutal">
              <h2 className="font-display text-xl text-[var(--color-ink)] mb-4 flex items-center gap-2">
                <Briefcase className="size-5 text-[var(--color-gold)]" /> Recent tasks posted
              </h2>
              <div className="space-y-3">
                {postedTasks.slice(0, 5).map((t) => (
                  <Link key={t.id} to={`/task/${t.id}`} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] shadow-brutal hover:shadow-brutal-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-ink)] text-[var(--color-fg-light)] flex items-center justify-center text-sm">
                        <Briefcase className="size-5" />
                      </div>
                      <div>
                        <p className="font-body font-bold text-sm text-[var(--color-ink)] line-clamp-1">{t.title}</p>
                        <p className="text-[11px] font-body font-semibold text-[var(--color-muted)]">{t.location} · {fmtDate(t.createdAt)}</p>
                      </div>
                    </div>
                    <span className="font-display text-[var(--color-sage)]">₹{t.price.toLocaleString('en-IN')}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1.25rem] p-6 shadow-brutal">
            <h2 className="font-display text-xl text-[var(--color-ink)] mb-4">Reviews</h2>
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.slice(0, 5).map((r) => {
                  const reviewer = store.user(r.reviewerId)
                  return (
                    <div key={r.id} className="rounded-[1rem] bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] shadow-brutal p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-body font-bold text-sm text-[var(--color-ink)]">{reviewer?.name ?? 'User'}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-[var(--color-gold)] text-[var(--color-gold)]' : 'text-[var(--color-ink)]/20'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1.5 font-body font-medium text-sm text-[var(--color-ink)]/75">{r.comment}</p>
                    </div>
                  )
                })
              ) : (
                <p className="font-body font-medium text-sm text-[var(--color-muted)]">
                  No reviews yet. Complete tasks with {user.name} — they'll follow you.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level / Streak */}
          <div className="bg-[var(--color-ink)] text-[var(--color-fg-light)] rounded-[1.25rem] border-2 border-[var(--color-ink)] shadow-brutal p-6">
            <div className="flex items-center gap-4">
              <Grassbot size={60} mood={streak > 0 ? 'happy' : 'idle'} />
              <div className="flex-1 min-w-[14rem]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tag-pill border-2 border-[var(--color-yellow)] shadow-brutal-accent" style={{ background: 'var(--color-yellow)', color: 'var(--color-ink)' }}>
                    <Trophy className="size-3.5 inline mr-1 -mt-0.5" /> L{lvl.level.lvl} · {lvl.level.name}
                  </span>
                  <span className="tag-pill border-2 border-[var(--color-gold)]" style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}>
                    <Flame className="size-3.5 inline mr-1 -mt-0.5" /> {streak}-day streak
                  </span>
                </div>
                <div className="mt-2.5 h-2 rounded-full bg-[var(--color-fg-light)]/10 overflow-hidden border border-[var(--color-fg-light)]/20">
                  <motion.div className="h-full bg-[var(--color-yellow)]" initial={{ width: 0 }} animate={{ width: `${lvl.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                </div>
                <p className="mt-1 text-[11px] font-body font-semibold text-[var(--color-fg-light)]/40">
                  {lvl.xpNeeded > 0 ? `${lvl.xpNeeded} xp to next level` : 'maxed out. mad respect.'}
                </p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1.25rem] p-6 shadow-brutal">
            <h3 className="font-display text-lg text-[var(--color-ink)] mb-4 flex items-center gap-2">
              <Trophy className="size-5 text-[var(--color-gold)]" /> Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.idVerification === 'verified' && (
                <span className="tag-pill border-2 border-[var(--color-sage)]" style={{ background: 'var(--color-sage)', color: '#fff' }}>
                  <ShieldCheck className="size-3 inline mr-1 -mt-0.5" /> Verified
                </span>
              )}
              {user.tasksDone >= 50 && (
                <span className="tag-pill border-2 border-[var(--color-gold)]" style={{ background: 'var(--color-gold)', color: 'var(--color-ink)' }}>
                  <Trophy className="size-3 inline mr-1 -mt-0.5" /> 50+ tasks
                </span>
              )}
              {user.tasksDone >= 100 && (
                <span className="tag-pill border-2 border-[var(--color-rose)]" style={{ background: 'var(--color-rose)', color: '#fff' }}>
                  <Trophy className="size-3 inline mr-1 -mt-0.5" /> 100+ tasks
                </span>
              )}
              {user.ratingCount >= 20 && user.ratingAvg >= 4.8 && (
                <span className="tag-pill border-2 border-[var(--color-periwinkle)]" style={{ background: 'var(--color-periwinkle)', color: '#fff' }}>
                  <Star className="size-3 inline mr-1 -mt-0.5" /> Top Rated
                </span>
              )}
              {streak >= 7 && (
                <span className="tag-pill border-2 border-[var(--color-coral)]" style={{ background: 'var(--color-coral)', color: '#fff' }}>
                  <Flame className="size-3 inline mr-1 -mt-0.5" /> Week Streak
                </span>
              )}
              {streak >= 30 && (
                <span className="tag-pill border-2 border-[var(--color-orange)]" style={{ background: 'var(--color-orange)', color: '#fff' }}>
                  <Flame className="size-3 inline mr-1 -mt-0.5" /> Month Streak
                </span>
              )}
            </div>
            {user.idVerification !== 'verified' && user.role !== 'poster' && (
              <p className="mt-4 text-sm text-[var(--color-muted)] font-body font-semibold">
                Verify your ID to unlock more badges and accept tasks.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}