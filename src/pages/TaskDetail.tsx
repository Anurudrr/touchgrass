import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Flame, MapPin, MessageCircle, Send, ShieldAlert, Star, Wallet, Clock3, Zap, Share2, Map, Image } from 'lucide-react'
import { BrutButton, ConfettiBurst, Field, StarRatingInput, inputCls, toast } from '../components/ui'
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

/* ---------------- Image Gallery Component ---------------- */
function ImageGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 0) return null

  return (
    <div className="mt-5 relative">
      <div className="relative rounded-[1rem] overflow-hidden border-2 border-[#0F0E0A] shadow-brutal">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={photos[currentIndex]}
            alt={`${alt} - image ${currentIndex + 1}`}
            className="w-full max-h-72 object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur border-2 border-[#0F0E0A] flex items-center justify-center text-[#0F0E0A] hover:bg-white shadow-brutal transition-all"
              aria-label="Previous image"
            >
              <Image className="size-5 rotate-180" />
            </button>
            <button
              onClick={() => setCurrentIndex((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur border-2 border-[#0F0E0A] flex items-center justify-center text-[#0F0E0A] hover:bg-white shadow-brutal transition-all"
              aria-label="Next image"
            >
              <Image className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <p className="text-center text-xs text-[#0F0E0A]/50 mt-2 font-body">
          Image {currentIndex + 1} of {photos.length}
        </p>
      )}
    </div>
  )
}

/* ---------------- Map Preview Component ---------------- */
function MapPreview({ location, lat, lng, className = '' }: { location: string; lat: number; lng: number; className?: string }) {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x200&maptype=roadmap&markers=color:0x2FAE4E%7Clabel:T%7C${lat},${lng}&format=png&visual_refresh=true`

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-body font-bold text-xs uppercase tracking-widest text-[#5A574F] flex items-center gap-1.5">
          <MapPin className="size-3.5" /> Location
        </span>
        <a
          href={`https://maps.google.com/?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs text-[#2FAE4E] hover:underline flex items-center gap-1"
        >
          <Map className="size-3.5" /> Open in Maps
        </a>
      </div>
      <div className="rounded-[1rem] overflow-hidden border-2 border-[#0F0E0A] shadow-brutal">
        <img
          src={mapUrl}
          alt={`Map showing ${location}`}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      </div>
    </div>
  )
}

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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff]/20 to-[#0033ff]/20 blur-3xl -z-10 rounded-full animate-pulse" />
        <div className="max-w-xl mx-auto px-4 pt-20 text-center">
          <p className="font-display text-4xl text-cocoa/70">Task not found</p>
          <Link to="/tasks" className="text-orange font-body font-bold mt-4 inline-block underline">Back to browse →</Link>
        </div>
      </div>
)
}

function ShareButton({ task }: { task: { id: string; title: string; location: string; price: number } }) {
  const shareUrl = `${window.location.origin}/task/${task.id}`
  const shareText = `Check out this task: ${task.title} in ${task.location} for ₹${task.price.toLocaleString('en-IN')}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // fallback to clipboard
        }
      }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      toast('Copied to clipboard! 📋', 'Share the link with anyone.')
    } catch {
      toast('Unable to share', 'Please copy the link manually.', 'error')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-body font-semibold text-sm hover:bg-white/20 transition-colors"
    >
      <Share2 className="size-4" />
      Share this task
    </button>
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
    <div className="relative min-h-screen bg-[#FFF9F0]">
      {/* Neo-brutalist dot pattern background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#0F0E0A 2px, transparent 2px)', backgroundSize: '24px 24px' }} 
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-[#0F0E0A]/60 hover:text-[#0F0E0A] font-body font-bold text-sm transition-colors border-2 border-transparent hover:border-[#0F0E0A] bg-transparent hover:bg-[#F9E84A] px-3 py-1.5 rounded-full">
          <ArrowLeft className="size-4" /> Back to tasks
        </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* left column */}
        <div className="space-y-6">
          {/* main card */}
          <div className="bg-[#FFFFFF] border-2 border-[#0F0E0A] shadow-brutal rounded-[1.25rem] p-6 sm:p-8 text-[#0F0E0A]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-2xl border-2 border-[#0F0E0A] bg-[#F9A220] flex items-center justify-center shadow-brutal">
                  <Icon className="size-7 text-[#0F0E0A]" />
                </div>
                <div>
                  <span className="tag-pill border-2 border-[#0F0E0A] bg-[#0F0E0A] text-[#FFF9F0] shadow-brutal">{task.category}</span>
                  <div className="mt-2.5 flex items-center gap-2 text-xs font-body font-bold text-[#5A574F]">
                    <MapPin className="size-3.5" /> {task.location} · <Clock3 className="size-3.5" /> {timeLeft(task.deadline)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-5xl text-[#0F0E0A] relative inline-block">
                  ₹{task.price.toLocaleString('en-IN')}
                </div>
                {payment && (
                  <div className="mt-1 text-[11px] font-body font-bold text-[#5A574F]">
                    Doer gets ₹{payment.doerNet.toLocaleString('en-IN')} · platform fee ₹{payment.commission}
                  </div>
                )}
              </div>
            </div>

            <h1 className="mt-5 font-display text-3xl sm:text-4xl leading-tight text-[#0F0E0A]">{task.title}</h1>
            <p className="mt-3 text-[#0F0E0A]/80 font-body font-medium leading-relaxed whitespace-pre-line">{task.description}</p>

            {/* Image Gallery / Map Preview */}
            {task.photoUrl && (
              <ImageGallery photos={[task.photoUrl]} alt={task.title} />
            )}
            <MapPreview 
              location={task.location} 
              lat={task.lat} 
              lng={task.lng} 
              className="mt-5"
            />

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-body font-bold text-[#0F0E0A]">
              <span className="bg-[#FFF4E2] border-2 border-[#0F0E0A] rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#0F0E0A]">Posted {timeAgo(task.createdAt)}</span>
              <span className="bg-[#FFF4E2] border-2 border-[#0F0E0A] rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_#0F0E0A]">Deadline {fmtDate(task.deadline)}</span>
              {task.urgent && <span className="bg-[#c8254a] border-2 border-[#0F0E0A] text-white rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-[2px_2px_0px_#0F0E0A]"><Flame className="size-3" /> URGENT</span>}
            </div>
          </div>

          {/* timeline */}
          <div className="bg-[#FFF9F0] border-2 border-[#0F0E0A] shadow-brutal rounded-[1.25rem] p-6 sm:p-8 text-[#0F0E0A]">
            <h2 className="font-display text-xl text-[#0F0E0A]">Status</h2>
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
          <div className="bg-[#FFF4E2] border-2 border-[#0F0E0A] shadow-brutal rounded-[1.25rem] overflow-hidden text-[#0F0E0A]">
            <button onClick={() => setChatOpen(!chatOpen)} className="w-full px-6 py-4 flex items-center justify-between font-display text-xl border-b-2 border-[#0F0E0A] bg-[#0F0E0A] text-[#FFF9F0]">
              <span className="flex items-center gap-2">
                <MessageCircle className="size-6 text-[#F9E84A]" /> Task chat
              </span>
              <span className="text-xs font-body font-bold bg-[#F9E84A] text-[#0F0E0A] border-2 border-[#F9E84A] rounded-full px-3 py-1">
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

            {/* Share Task Button - visible to all parties */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <ShareButton task={task} />
            </div>
          </div>

          {/* payment breakdown */}
          {payment && (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[24px] p-6 text-cocoa">
              <h3 className="font-display text-lg flex items-center gap-2"><Wallet className="size-5 text-orange" /> Payment</h3>
              <div className="mt-4 space-y-2 text-sm font-body font-semibold text-[#0F0E0A]/70">
                <div className="flex justify-between"><span>Task price</span><span className="text-ink">₹{payment.amount.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>Platform fee ({(payment.commissionRate * 100).toFixed(0)}%)</span><span className="text-ink">−₹{payment.commission}</span></div>
                <div className="flex justify-between border-t-2 border-[#0F0E0A]/10 pt-2 font-bold text-[#0F0E0A]"><span>Doer receives</span><span>₹{payment.doerNet.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-xs"><span>Status</span><span className="uppercase text-orange">{payment.status === 'held' ? 'Held in escrow' : 'Released'}</span></div>
              </div>
            </div>
          )}

          {/* poster card */}
          <div className="bg-[#FFFFFF] border-2 border-[#0F0E0A] shadow-brutal rounded-[1.25rem] p-6 text-[#0F0E0A]">
            <h3 className="font-body font-bold uppercase text-xs tracking-widest text-[#5A574F]">Posted by</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-[#0F0E0A] text-[#F9A220] border-2 border-[#0F0E0A] flex items-center justify-center font-display text-xl">
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
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[24px] p-6 text-cocoa">
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
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[24px] p-6 text-cocoa">
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
