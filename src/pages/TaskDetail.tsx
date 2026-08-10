import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Flame, MapPin, MessageCircle, Send, ShieldAlert, Star, Wallet, Clock3, Zap } from 'lucide-react'
import { BrutButton, Chip, ConfettiBurst, Field, StarRatingInput, inputCls, toast } from '../components/ui'
import { store, useDB } from '../lib/db'
import { categoryIcon } from '../components/icons'
import { fmtDate, timeAgo, timeLeft } from '../lib/utils'
import type { TaskStatus } from '../lib/types'

const STEPS: { key: TaskStatus; label: string }[] = [
  { key: 'open', label: 'Posted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'paid', label: 'Paid' },
]

export default function TaskDetail() {
  const { id } = useParams()
  const db = useDB()
  const task = store.getTask(id ?? '')
  const user = store.sessionUser()
  const [chatOpen, setChatOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [db.messages.length])

  const poster = task ? store.user(task.posterId) : undefined
  const assignment = task ? store.assignmentFor(task.id) : undefined
  const doer = assignment ? store.user(assignment.doerId) : undefined
  const payment = task ? store.paymentsForTask(task.id) : undefined
  const messages = task ? store.messagesFor(task.id) : []
  const posterReviews = poster ? store.reviewsFor(poster.id) : []
  const Icon = task ? categoryIcon(task.category) : undefined

  const isPoster = user?.id === task?.posterId
  const isDoer = user?.id === assignment?.doerId
  const isParty = isPoster || isDoer

  const stepIndex = useMemo(() => {
    if (!task) return 0
    const idx = STEPS.findIndex((s) => s.key === task.status)
    return idx >= 0 ? idx : 0
  }, [task?.status])

  if (!task || !poster) {
    return (
      <div className="max-w-xl mx-auto px-4 pt-20 text-center">
        <p className="font-display text-4xl text-cocoa/70">Task not found</p>
        <Link to="/tasks" className="text-orange font-body font-bold mt-4 inline-block underline">Back to browse →</Link>
      </div>
    )
  }

  const canDoer = !user ? false : (user.role === 'doer' || user.role === 'both') && user.idVerification === 'verified'

  const accept = () => {
    if (!user) return toast('Log in first', 'Create an account to accept tasks', 'error')
    if (!canDoer) return toast('Verify your ID first', 'Doers need ID verification to accept tasks', 'error')
    store.acceptTask(task.id, user.id)
    toast('Task accepted! 🎉', `₹${task.price} is now in escrow. No take-backs.`)
  }

  const send = (content: string) => {
    if (!user) return
    store.sendMessage(task.id, user.id, content)
  }

  const hasReviewed = (targetId: string) => db.reviews.some((r) => r.taskId === task.id && r.reviewerId === user?.id && r.revieweeId === targetId)
  const needsReview = task.status === 'paid' && user && isParty && !(isPoster && hasReviewed(doer?.id ?? '')) && !(isDoer && hasReviewed(poster.id))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-muted hover:text-orange font-body font-bold text-sm transition-colors">
        <ArrowLeft className="size-4" /> Back to tasks
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* left column */}
        <div className="space-y-6">
          {/* main card */}
          <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-2xl border-2 border-ink/10 bg-orange flex items-center justify-center">
                  <Icon className="size-7" />
                </div>
                <div>
                  <Chip color="ink" rotate={-2}>{task.category}</Chip>
                  <div className="mt-1.5 flex items-center gap-2 text-xs font-body font-bold text-neutral-500">
                    <MapPin className="size-3.5" /> {task.location} · <Clock3 className="size-3.5" /> {timeLeft(task.deadline)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-5xl text-teal relative inline-block">
                  ₹{task.price.toLocaleString('en-IN')}
                </div>
                {payment && (
                  <div className="mt-1 text-[11px] font-body font-bold text-neutral-500">
                    Doer gets ₹{payment.doerNet.toLocaleString('en-IN')} · platform fee ₹{payment.commission}
                  </div>
                )}
              </div>
            </div>

            <h1 className="mt-5 font-display text-3xl sm:text-4xl leading-tight">{task.title}</h1>
            <p className="mt-3 text-neutral-700 font-body font-medium leading-relaxed whitespace-pre-line">{task.description}</p>

            {task.photoUrl && <img src={task.photoUrl} alt="" className="mt-5 max-h-72 rounded-2xl border-brut" />}

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-body font-bold text-neutral-500">
              <span className="bg-soft rounded-lg px-3 py-1.5">Posted {timeAgo(task.createdAt)}</span>
              <span className="bg-soft rounded-lg px-3 py-1.5">Deadline {fmtDate(task.deadline)}</span>
              {task.urgent && <span className="bg-danger text-white rounded-lg px-3 py-1.5 flex items-center gap-1"><Flame className="size-3" /> URGENT</span>}
            </div>
          </div>

          {/* timeline */}
          <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6 sm:p-8">
            <h2 className="font-display text-xl">Status</h2>
            <div className="relative mt-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-5 left-6 right-6 h-2 bg-ink/10 rounded-full"
              >
                <div className="h-full bg-orange rounded-full" />
              </motion.div>
              <div className="relative flex justify-between px-6">
                {STEPS.map((s, i) => {
                  const done = i <= stepIndex
                  const current = i === stepIndex
                  return (
                    <div key={s.key} className="flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.15, type: 'spring', stiffness: 400, damping: 18 }}
                        className={`size-10 rounded-full border border-ink/10 flex items-center justify-center ${
                          done ? 'bg-orange text-white' : 'bg-white text-neutral-400'
                        } ${current && task.status === 'paid' ? 'relative' : ''}`}
                      >
                        {done ? <Check className="size-5" /> : <span className="font-body font-bold">{i + 1}</span>}
                        {current && task.status === 'paid' && <ConfettiBurst />}
                      </motion.div>
                      <span className={`text-[10px] sm:text-xs font-body font-bold uppercase ${done ? 'text-black' : 'text-neutral-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {task.status === 'disputed' && (
              <div className="mt-6 rounded-2xl bg-danger text-white p-4 font-body font-bold flex items-center gap-3">
                <ShieldAlert className="size-6" /> Dispute raised — our team is reviewing this task. Escrow stays held.
              </div>
            )}
          </div>

          {/* chat */}
          <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] overflow-hidden">
            <button onClick={() => setChatOpen(!chatOpen)} className="w-full px-6 py-4 flex items-center justify-between font-display text-xl border-b border-ink/10">
              <span className="flex items-center gap-2">
                <MessageCircle className="size-6" /> Task chat
              </span>
              <span className="text-xs font-body font-bold bg-soft rounded-full px-3 py-1">
                {isParty || task.status === 'open' ? 'visible to both parties' : 'locked'}
              </span>
            </button>
            <AnimatePresence>
              {chatOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3 }}>
                  {isParty ? (
                    <div className="p-5">
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {messages.length === 0 && (
                          <div className="text-center text-sm text-neutral-500 font-body font-semibold py-8">
                            No messages yet — say hi and coordinate the details here.
                          </div>
                        )}
                        {messages.map((m) => {
                          const mine = m.senderId === user?.id
                          const sender = store.user(m.senderId)
                          return (
                            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-2xl border border-ink/10 px-4 py-2.5 ${mine ? 'bg-coral text-white' : 'bg-warm-paper'}`}>
                                <p className="text-[10px] font-body font-bold uppercase mb-0.5">{mine ? 'You' : sender?.name ?? 'User'}</p>
                                <p className="text-sm font-body font-medium">{m.content}</p>
                                <p className="text-[10px] text-neutral-500 mt-1 font-semibold">{timeAgo(m.createdAt)}</p>
                              </div>
                            </div>
                          )
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                      <ChatInput onSend={send} />
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-neutral-500 font-body font-semibold">
                      Chat unlocks for the poster and the accepted doer only.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* right column */}
        <div className="space-y-6">
          {/* action card */}
          <div className="bg-orange text-white rounded-[24px] p-6 shadow-[0_15px_40px_rgba(232,125,74,0.35)]">
            {task.status === 'open' && (
              <>
                <p className="font-display text-2xl leading-tight">Need this done?</p>
                <p className="mt-1 text-sm font-body font-semibold text-white/80">Escrow holds ₹{task.price} until the job is confirmed.</p>
                <BrutButton variant="ink" size="lg" className="w-full mt-5" onClick={accept}>
                  <Zap className="size-5 inline mr-2" /> Accept this task
                </BrutButton>
                {user && !canDoer && user.idVerification !== 'verified' && (
                  <Link to="/profile" className="block mt-3 text-center text-xs font-body font-bold underline">
                    Verify ID to accept tasks →
                  </Link>
                )}
              </>
            )}

            {isDoer && task.status === 'accepted' && (
              <Action onClick={() => { store.setStatus(task.id, 'in_progress'); toast('Marked in progress 🏃', 'Go get it!') }} label="Start work" sub="Let the poster know you've begun." />
            )}
            {isDoer && task.status === 'in_progress' && (
              <Action onClick={() => { store.setStatus(task.id, 'completed'); toast('Marked complete ✅', 'Waiting for the poster to confirm. No pressure.') }} label="Mark complete" sub="Only mark done when the job is actually done." />
            )}
            {isPoster && task.status === 'completed' && (
              <>
                <Action onClick={() => { store.setStatus(task.id, 'paid'); toast('Payment released 💸', `${payment?.doerNet.toLocaleString('en-IN')} sent to ${doer?.name.split(' ')[0]}. Done!`) }} label="Confirm & release payment" sub={`₹${payment?.doerNet ?? 0} goes to the doer. Platform keeps ₹${payment?.commission ?? 0}.`} />
                <button
                  onClick={() => toast('Dispute raised', 'Our team will review within 24 hrs. Stay calm.', 'error')}
                  className="mt-3 w-full text-xs font-body font-bold text-white/75 underline underline-offset-2 hover:text-white"
                >
                  Problem with the work? Raise a dispute
                </button>
              </>
            )}
            {isDoer && task.status === 'completed' && (
              <div className="text-sm font-body font-semibold">Done — waiting for the poster to confirm and release ₹{payment?.doerNet}.</div>
            )}
            {task.status === 'paid' && (
              <div className="text-sm font-body font-semibold">Task complete & paid 🎉 Escrow released.</div>
            )}
            {task.status === 'disputed' && (
              <div className="text-sm font-body font-bold">Under review. Escrow stays held until resolution.</div>
            )}
            {!user && task.status === 'open' && (
              <Link to="/auth" className="block text-center text-sm font-body font-bold text-white underline">Log in to accept →</Link>
            )}
          </div>

          {/* payment breakdown */}
          {payment && (
            <div className="bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6">
              <h3 className="font-display text-lg flex items-center gap-2"><Wallet className="size-5 text-orange" /> Payment</h3>
              <div className="mt-4 space-y-2 text-sm font-body font-semibold text-cocoa/70">
                <div className="flex justify-between"><span>Task price</span><span className="text-ink">₹{payment.amount.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Platform fee ({(payment.commissionRate * 100).toFixed(0)}%)</span><span className="text-ink">−₹{payment.commission}</span></div>
                <div className="flex justify-between border-t-2 border-ink/10 pt-2 font-bold text-coral"><span>Doer receives</span><span>₹{payment.doerNet.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-xs"><span>Status</span><span className="uppercase text-coral">{payment.status === 'held' ? 'Held in escrow' : 'Released'}</span></div>
              </div>
            </div>
          )}

          {/* poster card */}
          <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6">
            <h3 className="font-body font-bold uppercase text-xs tracking-widest text-neutral-500">Posted by</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-ink text-orange border-2 border-ink/10 flex items-center justify-center font-display text-xl">
                {poster.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="font-body font-bold text-lg">{poster.name}</p>
                <p className="flex items-center gap-1 text-sm font-bold">
                  <Star className="size-4 fill-orange text-orange" />
                  {poster.ratingCount ? `${poster.ratingAvg.toFixed(1)} (${poster.ratingCount} ratings)` : 'New poster'}
                </p>
              </div>
            </div>
            {poster.bio && <p className="mt-3 text-sm text-neutral-600">{poster.bio}</p>}
            <div className="mt-3 text-xs font-body font-bold text-neutral-500">{poster.area}</div>
          </div>

          {/* reviews */}
          {posterReviews.length > 0 && (
            <div className="bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6">
              <h3 className="font-display text-lg">Recent reviews</h3>
              <div className="mt-3 space-y-3">
                {posterReviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-xl bg-warm-paper border border-border p-3 text-sm">
                    <div className="flex items-center gap-1 text-orange">{[...Array(5)].map((_, i) => <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-orange text-orange' : 'text-cocoa/20'}`} />)}</div>
                    <p className="mt-1 text-cocoa/80 font-body font-medium">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* review box */}
          {needsReview && (
            <ReviewBox
              targetId={isPoster ? (doer?.id ?? '') : poster.id}
              onSubmit={(rating, comment) => {
                store.addReview(task.id, user!.id, isPoster ? doer!.id : poster.id, rating, comment)
                toast('Thanks for the review! 🌱', 'Ratings keep the marketplace honest. Karma points +10.')
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Action({ onClick, label, sub }: { onClick: () => void; label: string; sub: string }) {
  return (
    <>
      <BrutButton variant="paper" size="lg" className="w-full !bg-white !text-ink" onClick={onClick}>
        {label}
      </BrutButton>
      <p className="mt-2 text-xs font-body font-semibold text-white/80 text-center">{sub}</p>
    </>
  )
}

function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState('')
  const submit = () => {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }
  return (
    <div className="mt-4 flex gap-2">
      <input
        className={`${inputCls} flex-1`}
        placeholder="Type a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <button onClick={submit} className="size-12 shrink-0 rounded-xl bg-ink text-orange border border-ink/10 flex items-center justify-center hover:bg-charcoal active:scale-90 transition-all">
        <Send className="size-5" />
      </button>
    </div>
  )
}

function ReviewBox({ onSubmit, targetId }: { onSubmit: (r: number, c: string) => void; targetId: string }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const target = store.user(targetId)
  return (
    <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6">
      <h3 className="font-display text-lg">Rate {target?.name.split(' ')[0]}</h3>
      <div className="mt-3">
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <Field label="Comment (optional)">
        <textarea className={`${inputCls} min-h-20`} placeholder="How did it go?" value={comment} onChange={(e) => setComment(e.target.value)} />
      </Field>
      <BrutButton className="w-full mt-3" size="sm" onClick={() => rating > 0 && onSubmit(rating, comment)}>
        Submit review
      </BrutButton>
    </div>
  )
}
