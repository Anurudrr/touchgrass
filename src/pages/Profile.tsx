import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { BadgeCheck, LogOut, ShieldAlert, Star, Wallet, ArrowDownToLine, History } from 'lucide-react'
import { Counter, toast, inputCls } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { store, useDB } from '../lib/db'
import { levelFor, xpFor } from '../lib/gamify'
import { fmtDate } from '../lib/utils'

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}

export default function Profile() {
  const db = useDB()
  const navigate = useNavigate()
  const user = store.sessionUser()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [upi, setUpi] = useState('')
  const [amount, setAmount] = useState('')

  const earnings = useMemo(() => (user ? store.earningsFor(user.id) : []), [db.payments, user?.id])
  const reviews = user ? store.reviewsFor(user.id) : []
  const balance = earnings.reduce((s, p) => s + p.doerNet, 0)
  const xp = user ? xpFor(user.tasksDone, user.ratingCount, user.idVerification === 'verified') : 0
  const lvl = levelFor(xp)

  if (!user) {
    return (
      <div className="bg-[#FFF9F0] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-[#FFF9F0] border-2 border-[#0F0E0A] rounded-[1.5rem] p-10 shadow-brutal-lg">
          <Grassbot size={72} mood="wave" style={{ margin: '0 auto 1.5rem' }} />
          <p className="font-display text-3xl text-[#0F0E0A]">Log in to view your profile</p>
          <Link to="/auth" className="avy-btn avy-btn--lg mt-6 mx-auto w-fit">
            <span className="avy-btn__text">Log in / Sign up</span>
            <span className="avy-btn__icon"><ArrowIcon /></span>
          </Link>
        </div>
      </div>
    )
  }

  const withdraw = () => {
    if (!upi.includes('@')) return toast('Enter a valid UPI ID', 'format: name@upi', 'error')
    const amt = Number(amount)
    if (!amt || amt <= 0 || amt > balance) return toast('Enter a valid amount', `Your balance is ₹${balance}`, 'error')
    toast('Withdrawal requested 💸', `₹${amt} will hit your UPI in 1-2 days. Go buy a plant.`)
    setWithdrawOpen(false)
    setUpi('')
    setAmount('')
  }

  return (
    <div className="bg-[#FFF9F0] min-h-screen">
      {/* Yellow hero header */}
      <div className="bg-[#F9E84A] border-b-2 border-[#0F0E0A] pt-24 pb-10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-5">
            {/* Avatar */}
            <div className="size-20 rounded-2xl bg-[#0F0E0A] text-[#F9E84A] border-2 border-[#0F0E0A] shadow-brutal flex items-center justify-center font-display text-4xl shrink-0">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-normal text-[#0F0E0A] leading-tight flex flex-wrap items-center gap-3">
                {user.name}
                <span className="tag-pill border-2 border-[#0F0E0A] text-sm shadow-brutal" style={{ background: '#0F0E0A', color: '#F9E84A' }}>
                  L{lvl.level.lvl} · {lvl.level.name}
                </span>
              </h1>
              <p className="mt-1.5 flex items-center gap-2 font-body font-bold text-sm text-[#0F0E0A]/75">
                <Star className="size-4 fill-[#F9A220] text-[#F9A220]" />
                {user.ratingCount ? `${user.ratingAvg.toFixed(1)} · ${user.ratingCount} ratings` : 'No ratings yet'} · {user.tasksDone} tasks done
              </p>
              <p className="text-xs text-[#0F0E0A]/50 font-body font-semibold mt-1">{user.area} · joined {fmtDate(user.joinedAt)}</p>
              {/* XP bar */}
              <div className="mt-3 max-w-xs">
                <div className="flex justify-between text-[10px] font-body font-bold uppercase text-[#0F0E0A]/50 mb-1">
                  <span>{lvl.xpNeeded > 0 ? `${lvl.xpNeeded} xp to next level` : 'maxed out ✨'}</span>
                  <span>{xp} xp</span>
                </div>
                <div className="h-2 rounded-full bg-[#0F0E0A]/15 overflow-hidden border border-[#0F0E0A]/20">
                  <motion.div className="h-full bg-[#0F0E0A]" initial={{ width: 0 }} animate={{ width: `${lvl.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
            {/* Verification badge */}
            <div className="ml-auto">
              {user.idVerification === 'verified' ? (
                <span className="tag-pill border-2 border-[#4cad7d] shadow-brutal text-sm" style={{ background: '#4cad7d', color: '#fff' }}>
                  <BadgeCheck className="size-3.5 inline mr-1 -mt-0.5" /> ID Verified
                </span>
              ) : (
                <span className="tag-pill border-2 border-[#c8254a] shadow-brutal text-sm" style={{ background: '#c8254a', color: '#fff' }}>
                  <ShieldAlert className="size-3.5 inline mr-1 -mt-0.5" /> Not Verified
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
            <div className="bg-[#FFF9F0] border-2 border-[#0F0E0A] rounded-[1.25rem] p-6 shadow-brutal">
              <p className="font-body font-medium text-[#0F0E0A]/80">{user.bio}</p>
            </div>
          )}

          {/* ID Verification CTA */}
          {user.idVerification !== 'verified' && user.role !== 'poster' && (
            <div className="bg-[#0F0E0A] rounded-[1.25rem] border-2 border-[#0F0E0A] shadow-brutal p-5 flex items-center justify-between gap-3">
              <p className="font-body font-semibold text-sm text-[#FFF9F0]/80">
                Verify your ID to start accepting tasks.
              </p>
              <button
                onClick={() => store.verifyId(user.id)}
                className="avy-btn avy-btn--sm avy-btn--yellow shrink-0"
              >
                <span className="avy-btn__text">Verify now</span>
                <span className="avy-btn__icon"><ArrowIcon size={11} /></span>
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: user.tasksDone, l: 'Tasks done' },
              { v: user.ratingCount, l: 'Ratings' },
              { v: balance, l: 'Earned (₹)', money: true },
            ].map((s) => (
              <div key={s.l} className="rounded-[1.25rem] bg-[#FFF4E2] border-2 border-[#0F0E0A] shadow-brutal p-5 text-center">
                <p className="font-display text-2xl text-[#0F0E0A]">
                  {s.money ? `₹${(s.v as number).toLocaleString('en-IN')}` : <Counter to={s.v as number} />}
                </p>
                <p className="text-[10px] font-body font-bold uppercase text-[#5A574F] mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div className="bg-[#FFF9F0] border-2 border-[#0F0E0A] rounded-[1.25rem] p-6 shadow-brutal">
            <h2 className="font-display text-xl text-[#0F0E0A] mb-4">Reviews about you</h2>
            <div className="space-y-3">
              {reviews.length === 0 && (
                <p className="font-body font-medium text-sm text-[#5A574F]">
                  No reviews yet. Complete tasks with a smile — they follow you. Grassbot believes in you.
                </p>
              )}
              {reviews.map((r) => {
                const reviewer = store.user(r.reviewerId)
                return (
                  <div key={r.id} className="rounded-[1rem] bg-[#FFF4E2] border-2 border-[#0F0E0A] shadow-brutal p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-body font-bold text-sm text-[#0F0E0A]">{reviewer?.name ?? 'User'}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-[#F9A220] text-[#F9A220]' : 'text-[#0F0E0A]/20'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1.5 font-body font-medium text-sm text-[#0F0E0A]/75">{r.comment}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Wallet sidebar */}
        <div className="space-y-6">
          <div className="bg-[#0F0E0A] text-[#FFF9F0] rounded-[1.25rem] border-2 border-[#0F0E0A] shadow-brutal p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl flex items-center gap-2"><Wallet className="size-6 text-[#F9A220]" /> Wallet</h2>
              <span className="size-10 rounded-full bg-[#F9E84A] text-[#0F0E0A] border-2 border-[#F9E84A] flex items-center justify-center font-display text-sm">
                <Counter to={balance} />
              </span>
            </div>
            <p className="mt-2 font-display text-5xl">₹{balance.toLocaleString('en-IN')}</p>
            <p className="font-body text-xs font-bold text-[#FFF9F0]/50 mt-1">Earned from released payments</p>
            <button
              onClick={() => setWithdrawOpen(!withdrawOpen)}
              className="mt-5 w-full rounded-full bg-[#F9E84A] text-[#0F0E0A] border-2 border-[#F9E84A] py-3 font-body font-bold uppercase hover:bg-[#F9A220] hover:border-[#F9A220] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-brutal-accent"
            >
              <ArrowDownToLine className="size-5" /> Withdraw
            </button>
            {withdrawOpen && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
                <input
                  className={`${inputCls} bg-[var(--color-cream)]/10 border-[var(--color-border)]/20 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30`}
                  placeholder="UPI ID (e.g. name@upi)"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                />
                <input
                  className={`${inputCls} bg-[var(--color-cream)]/10 border-[var(--color-border)]/20 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/30`}
                  placeholder={`Amount (max ₹${balance})`}
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                />
                <button onClick={withdraw} className="avy-btn avy-btn--yellow w-full justify-center">
                  <span className="avy-btn__text w-full text-center">Request withdrawal</span>
                  <span className="avy-btn__icon"><ArrowIcon size={11} /></span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Payment history */}
          <div className="bg-[#FFF9F0] border-2 border-[#0F0E0A] rounded-[1.25rem] shadow-brutal p-6">
            <h3 className="font-display text-lg flex items-center gap-2 text-[#0F0E0A] mb-4">
              <History className="size-5 text-[#F9A220]" /> Payment history
            </h3>
            <div className="space-y-2.5">
              {earnings.length === 0 && (
                <p className="font-body font-medium text-sm text-[#5A574F]">
                  No payments yet. Accept a task, finish it, money lands here. Grassbot is waiting.
                </p>
              )}
              {earnings.map((p) => {
                const task = db.tasks.find((t) => t.id === p.taskId)
                return (
                  <div key={p.id} className="rounded-xl bg-[#FFF4E2] border-2 border-[#0F0E0A] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-body font-bold text-sm text-[#0F0E0A]">{task?.title.slice(0, 40)}…</p>
                      <p className="text-[11px] font-body font-semibold text-[#5A574F]">{p.releasedAt ? fmtDate(p.releasedAt) : ''} · released</p>
                    </div>
                    <span className="font-display text-[#4cad7d]">+₹{p.doerNet}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Log out */}
          <button
            onClick={() => { store.logout(); navigate('/') }}
            className="w-full rounded-2xl border-2 border-[#c8254a] text-[#c8254a] font-body font-bold py-3 hover:bg-[#c8254a] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-brutal"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </div>
    </div>
  )
}
