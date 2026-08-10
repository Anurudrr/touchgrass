import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, LogOut, ShieldAlert, Star, Wallet, ArrowDownToLine, History } from 'lucide-react'
import { BrutButton, Chip, Counter, inputCls, toast } from '../components/ui'
import { Grassbot } from '../components/Grassbot'
import { store, useDB } from '../lib/db'
import { levelFor, xpFor } from '../lib/gamify'
import { fmtDate } from '../lib/utils'

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
      <div className="max-w-md mx-auto px-4 pt-16 text-center">
        <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-10">
          <p className="font-display text-3xl">Log in to view your profile</p>
          <Link to="/auth"><BrutButton className="mt-6 w-full" pulse>Log in / Sign up</BrutButton></Link>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* identity card */}
        <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-ink text-teal border-2 border-ink/10 flex items-center justify-center font-display text-3xl">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-3xl flex items-center gap-2.5 flex-wrap">
                  {user.name}
                  <Chip color="sage" rotate={-3} className="!text-xs"><Grassbot size={16} className="inline -mt-0.5" /> L{lvl.level.lvl} · {lvl.level.name}</Chip>
                </h1>
                <p className="mt-1 flex items-center gap-2 text-sm font-body font-bold">
                  <Star className="size-4 fill-teal text-teal" />
                  {user.ratingCount ? `${user.ratingAvg.toFixed(1)} · ${user.ratingCount} ratings` : 'No ratings yet'} · {user.tasksDone} tasks done
                </p>
                <p className="text-xs text-neutral-500 font-body font-semibold mt-1">{user.area} · joined {fmtDate(user.joinedAt)}</p>
                <div className="mt-3 max-w-sm">
                  <div className="flex justify-between text-[10px] font-body font-bold uppercase text-muted">
                    <span>{lvl.xpNeeded > 0 ? `${lvl.xpNeeded} xp to the next level` : 'maxed out ✨'}</span>
                    <span>{xp} xp</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-soft overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-green to-lightblue" initial={{ width: 0 }} animate={{ width: `${lvl.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                  </div>
                </div>
              </div>
            </div>
            {user.idVerification === 'verified' ? (
              <Chip color="sage" rotate={3}><BadgeCheck className="size-3.5 inline mr-1 -mt-0.5" /> ID Verified</Chip>
            ) : (
              <Chip color="rose" rotate={-3}><ShieldAlert className="size-3.5 inline mr-1 -mt-0.5" /> ID not verified</Chip>
            )}
          </div>
          {user.bio && <p className="mt-4 text-neutral-700 font-body font-medium">{user.bio}</p>}

          {user.idVerification !== 'verified' && user.role !== 'poster' && (
            <div className="mt-5 rounded-2xl bg-ink text-white border border-white/15 p-4 flex items-center justify-between gap-3">
              <p className="text-sm font-body font-semibold text-cocoa/80">
                Verify your ID to start accepting tasks.
              </p>
              <BrutButton size="sm" variant="coral" onClick={() => store.verifyId(user.id)}>Verify now</BrutButton>
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { v: user.tasksDone, l: 'Tasks done' },
              { v: user.ratingCount, l: 'Ratings' },
              { v: balance, l: 'Earned (₹)', money: true },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-warm-paper border border-border p-4">
                <p className="font-display text-2xl">{s.money ? `₹${s.v.toLocaleString('en-IN')}` : <Counter to={s.v} />}</p>
                <p className="text-[10px] font-body font-bold uppercase text-neutral-500 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* reviews */}
        <div className="bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6">
          <h2 className="font-display text-xl">Reviews about you</h2>
          <div className="mt-4 space-y-3">
            {reviews.length === 0 && (
              <p className="text-sm text-muted font-body font-medium">No reviews yet. Complete tasks with a smile — they follow you. Grassbot believes in you.</p>
            )}
            {reviews.map((r) => {
              const reviewer = store.user(r.reviewerId)
              return (
                <div key={r.id} className="rounded-2xl bg-warm-paper border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-body font-bold text-sm">{reviewer?.name ?? 'User'}</p>
                    <div className="flex gap-0.5 text-orange">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-orange text-orange' : 'text-cocoa/20'}`} />)}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-cocoa/75 font-body font-medium">{r.comment}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* wallet */}
      <div className="space-y-6">
        <div className="bg-coral text-white rounded-[24px] p-6 shadow-[0_15px_40px_rgba(232,125,74,0.35)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl flex items-center gap-2"><Wallet className="size-6" /> Wallet</h2>
            <span className="size-10 rounded-full bg-ink text-orange flex items-center justify-center"><Counter to={balance} /></span>
          </div>
          <p className="mt-1 font-display text-5xl">₹{balance.toLocaleString('en-IN')}</p>
          <p className="text-xs font-body font-bold text-white/75 mt-1">Earned from released payments</p>
          <button
            onClick={() => setWithdrawOpen(!withdrawOpen)}
            className="mt-5 w-full rounded-full bg-ink text-white py-3 font-body font-bold uppercase hover:bg-charcoal active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ArrowDownToLine className="size-5" /> Withdraw
          </button>
          {withdrawOpen && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
              <input className={inputCls} placeholder="UPI ID (e.g. name@upi)" value={upi} onChange={(e) => setUpi(e.target.value)} />
              <input className={inputCls} placeholder={`Amount (max ₹${balance})`} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))} />
              <BrutButton className="w-full" size="sm" onClick={withdraw}>Request withdrawal</BrutButton>
            </motion.div>
          )}
        </div>

        {/* payment history */}
        <div className="bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6">
          <h3 className="font-display text-lg flex items-center gap-2"><History className="size-5 text-orange" /> Payment history</h3>
          <div className="mt-4 space-y-2.5">
            {earnings.length === 0 && <p className="text-sm text-muted font-body font-medium">No payments yet. Accept a task, finish it, money lands here. Grassbot is waiting.</p>}
            {earnings.map((p) => {
              const task = db.tasks.find((t) => t.id === p.taskId)
              return (
                <div key={p.id} className="rounded-xl bg-warm-paper border border-border px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-body font-bold">{task?.title.slice(0, 40)}…</p>
                    <p className="text-[11px] text-muted font-body font-semibold">{p.releasedAt ? fmtDate(p.releasedAt) : ''} · released</p>
                  </div>
                  <span className="font-display text-orange">+₹{p.doerNet}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => {
            store.logout()
            navigate('/')
          }}
          className="w-full rounded-2xl border-2 border-danger/50 text-danger font-body font-bold py-3 hover:bg-danger hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </div>
  )
}
