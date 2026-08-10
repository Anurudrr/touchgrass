import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, FileText, Hand, Rocket, ShieldCheck, Smile, Sparkles, Star as StarIcon, Wallet } from 'lucide-react'
import { CircleBadge, Counter, DrawUnderline, Magnetic, Marquee, Polaroid, Reveal, Stamp, Sticker, toast } from '../components/ui'
import { categoryIcon } from '../components/icons'
import { Grassbot } from '../components/Grassbot'
import { useDB } from '../lib/db'
import { timeLeft } from '../lib/utils'

/* ============================================================
   ✪ 2024 PORTFOLIO | GRAPHIC DESIGN ✪
   touchgrass — rebranded as a graphic-design-portfolio poster
   ============================================================ */

const EVE = '\u2726' // ✦ little star

/* ============ top marquee strip ============ */
const HERO_WORDS = ['touchgrass', 'est. 2024', 'go outside', 'post it', 'get it done', 'no weirdos', 'escrow protected', 'printed in india']
const COLOR_WORDS = ['text-[var(--color-yellow)]', 'text-[var(--color-teal)]', 'text-[var(--color-sage)]', 'text-[var(--color-periwinkle)]', 'text-[var(--color-coral)]', 'text-[var(--color-cream)]']

function HeroStrip({ words = HERO_WORDS, className = '' }: { words?: string[]; className?: string }) {
  const row = [...words, ...words, ...words]
  const content = (
    <>
      {row.map((w, i) => (
        <span key={i} className={`flex items-center gap-2.5 ${COLOR_WORDS[i % COLOR_WORDS.length]} ${i % 5 === 3 ? 'text-[var(--color-teal)]' : ''}`}>
          {w} <span className="text-white/40">{EVE}</span>
        </span>
      ))}
    </>
  )
  return (
    <div className={`hero-strip ${className}`}>
      <div className="hero-strip-track items-center">{content}{content}</div>
    </div>
  )
}

/* ============ hero ============ */
function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yBig = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yStar = useTransform(scrollYProgress, [0, 1], [0, -90])
  const heroRotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 6]), { stiffness: 80, damping: 20 })

  return (
    <section ref={ref} className="relative overflow-hidden">
      <HeroStrip />

      <div className="relative px-5 sm:px-10 pt-14 pb-24 max-w-[1700px] mx-auto w-full">
        {/* giant background watermark */}
        <motion.div style={{ y: yBig }} className="absolute -right-10 top-8 opacity-[0.06] pointer-events-none select-none hidden lg:block" aria-hidden="true">
          <span className="font-display text-[34vw] leading-none tracking-tight text-ink">TG</span>
        </motion.div>

        {/* floating stickers */}
        <motion.div style={{ y: yStar }} className="absolute top-10 right-[16%] hidden md:block">
          <motion.div animate={reduced ? {} : { y: [0, -14, 0], rotate: [-6, 6, -6] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            <Sticker size="lg" color="pink" rotate={-8} icon={<Smile className="size-9" />} />
          </motion.div>
        </motion.div>
        <motion.div style={{ y: yStar }} className="absolute top-24 left-[10%] hidden md:block">
          <motion.div animate={reduced ? {} : { y: [0, 12, 0], rotate: [5, -5, 5] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}>
            <Sticker size="lg" color="orange" rotate={9} icon={<Rocket className="size-9" />} />
          </motion.div>
        </motion.div>
        <motion.div className="absolute top-16 left-[46%] hidden lg:block">
          <motion.span animate={reduced ? {} : { rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="inline-block">
            <StarIcon className="size-12 text-yellow fill-yellow" />
          </motion.span>
        </motion.div>
        <motion.div className="absolute top-[38%] right-[6%] hidden xl:block">
          <motion.span animate={reduced ? {} : { y: [0, -10, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }} className="inline-block border-4 border-ink bg-teal text-cream rounded-full size-24 flex items-center justify-center font-display shadow-[6px_6px_0_rgba(23,19,15,0.9)]">
            <span className="text-xl leading-none">₹</span>
            <span className="text-[9px] uppercase block">escrow</span>
          </motion.span>
        </motion.div>
        <motion.div style={{ y: yBig }} className="absolute bottom-12 right-[20%] hidden xl:block">
          <Sticker size="md" color="white" rotate={-10} icon={<span className="text-5xl leading-none">✌️</span>} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-6 left-[16%] hidden lg:block rotate-[-6deg] font-display font-extrabold uppercase tracking-wide text-ink/70"
        >
          no weirdos ★
        </motion.div>

        {/* main headline */}
        <div className="relative pt-20 sm:pt-24">
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-body font-bold uppercase tracking-[0.35em] text-muted text-sm"
          >
            simple errands · real humans · your city
          </motion.p>

          <h1 className="mt-4 font-display font-normal tracking-tight text-ink leading-[0.86]" style={{ fontSize: 'clamp(4rem, 15.5vw, 15rem)' }}>
            <span className="block overflow-hidden">
              <motion.span className="block" initial={reduced ? {} : { y: '112%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                TOUCH
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span style={heroRotate as unknown as React.CSSProperties} className="block outline-text" initial={reduced ? {} : { y: '112%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                GRASS<span className="text-[var(--color-teal)] outline-none">.</span>
              </motion.span>
            </span>
          </h1>
        </div>

        {/* tagline row */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 max-w-[1700px]">
          <motion.div initial={reduced ? {} : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="flex items-center gap-3">
            <span className="spin-star inline-block text-3xl text-[var(--color-teal)]">✦</span>
            <p className="font-serif italic text-2xl sm:text-4xl text-cocoa">
              stop scrolling. <span className="grad-text not-italic font-display uppercase text-3xl sm:text-5xl">start doing.</span>
            </p>
          </motion.div>
          <motion.div initial={reduced ? {} : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="ml-auto hidden sm:block">
            <DrawUnderline color="#0d7377" className="w-40 sm:w-56 -mb-1" />
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div initial={reduced ? {} : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <Link to="/post">
              <motion.span whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 bg-teal text-cream rounded-xl px-8 py-4 font-display uppercase tracking-wide text-lg border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)]">
                post a task <ArrowRight className="size-5" />
              </motion.span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link to="/tasks">
              <motion.span whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 bg-cream text-ink rounded-xl px-8 py-4 font-display uppercase tracking-wide text-lg border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)] hover:bg-yellow">
                browse tasks <ArrowUpRight className="size-5" />
              </motion.span>
            </Link>
          </Magnetic>
          <span className="inline-flex items-center gap-2 text-ink font-body text-sm font-bold bg-white/70 border-2 border-ink px-4 py-2 rounded-lg shadow-[3px_4px_0_rgba(23,19,15,0.9)]">
            <span className="size-2 rounded-full bg-teal animate-pulse" /> avg 20 min response · escrow protected
          </span>
        </motion.div>


        {/* mascot row */}
        <motion.div initial={reduced ? {} : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-12 flex items-center gap-4">
          <Grassbot size={70} mood="wave" />
          <p className="font-body font-semibold text-muted text-sm max-w-xs">hi, i'm grassbot. i keep this city running on 〈3 favours.</p>
        </motion.div>
      </div>

      <HeroStrip />
    </section>
  )
}

/* ============ manifesto / intro ============ */
function Manifesto() {
  const points = [
    { title: 'Hand Made', desc: 'Real humans in your city, doing things right.', icon: 'hand' },
    { title: 'Escrow Protected', desc: 'Your money is safe until the task is done.', icon: 'shield' },
    { title: 'No Weirdos', desc: 'Verified doers only. 2-way ratings ensure trust.', icon: 'check' },
  ]
  return (
    <section className="px-5 sm:px-10 pt-20 pb-10 relative">
      <Reveal className="text-center mb-16">
        <p className="font-body font-bold uppercase tracking-[0.35em] text-[var(--color-teal)] text-[11px]">manifesto / 001</p>
        <h2 className="mt-4 font-display font-normal uppercase tracking-tight text-cocoa leading-[0.9] text-[10vw] sm:text-7xl lg:text-[6.5rem]">
          your to-do list,<br/>
          <em className="font-serif italic font-normal normal-case grad-text">outsourced.</em>
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {points.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1}>
            <div className="bg-white border-[3px] border-ink rounded-[20px] p-8 shadow-[6px_6px_0_rgba(23,19,15,0.9)]">
              <div className="size-12 rounded-full bg-teal flex items-center justify-center mb-6">
                {p.icon === 'hand' && <Hand className="size-6 text-cream" />}
                {p.icon === 'shield' && <ShieldCheck className="size-6 text-cream" />}
                {p.icon === 'check' && <Check className="size-6 text-cream" />}
              </div>
              <h3 className="font-display text-2xl uppercase tracking-tight">{p.title}</h3>
              <p className="font-body text-muted mt-2">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ============================================================ */
/* ============ open tasks → live marquee boards =============== */
const TASK_TILES = ['bg-teal text-cream', 'bg-periwinkle text-white', 'bg-rose text-white', 'bg-sage text-ink', 'bg-yellow text-ink', 'bg-ink text-cream']

function LiveTasks() {
  const db = useDB()
  const open = db.tasks.filter((t) => t.status === 'open')
  const colA = open.filter((_, i) => i % 2 === 0)
  const colB = open.filter((_, i) => i % 2 === 1)

  const card = (t: (typeof open)[number], c: string) => (
    <Link to={`/task/${t.id}`} className="block">
      <div className={`h-44 rounded-xl border-[3px] border-ink p-4 flex flex-col justify-between shadow-[6px_6px_0_rgba(23,19,15,0.85)] hover:scale-[1.03] hover:rotate-1 transition-transform ${c} ${c.includes('bg-ink') ? 'halftone-light' : 'halftone'}`}>
        <div className="flex items-center justify-between">
          <span className="font-display font-normal text-[11px] uppercase tracking-widest opacity-90 border-2 border-ink/30 rounded-md px-2 py-0.5">{t.category}</span>
          <span className="font-display text-3xl leading-none">₹{t.price}</span>
        </div>
        <div>
          <p className="font-display text-sm tracking-wide leading-snug line-clamp-2">{t.title}</p>
          <p className="text-[11px] font-body font-semibold opacity-70 mt-1">{timeLeft(t.deadline)} · {t.location.split(',')[0]}</p>
        </div>
      </div>
    </Link>
  )

  return (
    <section className="px-5 sm:px-10 py-20 grid gap-14 lg:grid-cols-[430px_1fr] items-start max-w-7xl mx-auto">
      <div className="lg:sticky lg:top-24">
        <Reveal>
          <p className="font-body font-bold uppercase tracking-[0.35em] text-muted text-[11px]">projects / 002</p>
          <h2 className="mt-3 font-display uppercase tracking-tight text-[13vw] sm:text-6xl leading-[0.92]">
            open tasks
            <br />
            in your <em className="font-serif italic normal-case text-teal">city</em>
          </h2>
          <DrawUnderline className="mt-4 w-52" color="#0d7377" />
          <motion.div animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }} className="mt-8 inline-block">
            <Sticker size="lg" color="lightgreen" rotate={-6} icon={<Hand className="size-9" />} />
          </motion.div>
          <p className="mt-6 max-w-sm font-body text-muted font-medium">
            {open.length} tasks live in your city right now. prices set by posters, money held in escrow until done.
          </p>
          <Link to="/tasks" className="mt-5 inline-flex items-center gap-2 font-display uppercase tracking-wide text-ink underline decoration-4 decoration-teal underline-offset-8 hover:text-teal">
            see all → <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="flex gap-4 h-[620px] overflow-hidden rounded-2xl">
          <div className="flex-1 overflow-hidden">
            <div className="marquee-col-track" style={{ animation: 'marquee-up 28s linear infinite' }}>
              {[...colA, ...colA, ...colA].map((t, i) => (
                <div key={i}>{card(t, TASK_TILES[i % TASK_TILES.length])}</div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="marquee-col-track" style={{ animation: 'marquee-down 28s linear infinite' }}>
              {[...colB, ...colB, ...colB].map((t, i) => (
                <div key={i}>{card(t, TASK_TILES[(i + 3) % TASK_TILES.length])}</div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ============================================================ */
/* fling + tilt poster card (copy of original physics)          */
function FlingCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const r = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 140, damping: 13 })
  const sy = useSpring(y, { stiffness: 140, damping: 13 })
  const sr = useSpring(r, { stiffness: 140, damping: 13 })
  const srx = useSpring(rx, { stiffness: 180, damping: 16 })
  const sry = useSpring(ry, { stiffness: 180, damping: 16 })
  const vel = useRef({ vx: 0, vy: 0, lx: 0, ly: 0 })

  const onMove = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    vel.current.vx = e.clientX - vel.current.lx
    vel.current.vy = e.clientY - vel.current.ly
    vel.current.lx = e.clientX
    vel.current.ly = e.clientY
    const cx = (e.clientX - rect.left) / rect.width - 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5
    x.set(cx * 10)
    y.set(vel.current.vy * 0.2)
    ry.set(cx * 14)
    rx.set(-cy * 14)
  }
  const onLeave = () => {
    x.set(vel.current.vx * 22)
    y.set(vel.current.vy * 22)
    r.set(vel.current.vx * 1.4)
    rx.set(0)
    ry.set(0)
    setTimeout(() => {
      x.set(0)
      y.set(0)
      r.set(0)
    }, 90)
  }

  return (
    <motion.div
      style={{ x: sx, y: sy, rotate: sr, rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const FLOATERS = [
  { text: 'printing is someone else\'s problem now', color: 'bg-pink' },
  { text: 'money in escrow = zero awkwardness', color: 'bg-lightgreen' },
  { text: 'verified doers only. no weirdos.', color: 'bg-lightblue' },
]

function Posters() {
  const big = { title: 'printing', sub: 'documents, bindings, photocopies', color: 'bg-teal text-cream', rotate: -3 }
  const small = [
    { title: 'delivery', sub: 'parcels, pickups, meds', color: 'bg-darkblue text-white', rotate: 2 },
    { title: 'repairs', sub: 'taps, shelves, small fixes', color: 'bg-orange text-cream', rotate: -2 },
    { title: 'tutoring', sub: 'assignments, help', color: 'bg-sage text-ink', rotate: 1 },
  ]
  return (
    <section className="px-5 sm:px-10 py-20 max-w-7xl mx-auto">
      <Reveal className="mb-16">
        <p className="font-body font-bold uppercase tracking-[0.35em] text-muted text-[11px]">services / 003</p>
        <h2 className="mt-3 font-display uppercase tracking-tight text-ink text-[10vw] sm:text-6xl lg:text-7xl">
          built for humans, <em className="font-serif italic normal-case grad-text">not bots.</em>
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
          <FlingCard className="md:col-span-2">
            <Reveal>
              <Link to="/tasks" className="block h-full">
                <div className={`h-[400px] rounded-[20px] border-[3px] border-ink p-8 flex flex-col justify-between shadow-[10px_10px_0_rgba(23,19,15,0.9)] ${big.color}`}>
                  <div>
                    <h3 className="font-display font-normal text-6xl tracking-tight uppercase">{big.title}</h3>
                    <p className="font-body font-medium opacity-80 mt-2 text-lg">{big.sub}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          </FlingCard>

          <div className="flex flex-col gap-6">
            {small.map((c, i) => (
                <FlingCard key={c.title}>
                    <Reveal delay={i * 0.1}>
                    <Link to="/tasks" className="block h-full">
                        <div className={`h-[188px] rounded-[20px] border-[3px] border-ink p-6 flex flex-col justify-between shadow-[10px_10px_0_rgba(23,19,15,0.9)] ${c.color}`}>
                            <h3 className="font-display uppercase tracking-tight text-2xl">{c.title}</h3>
                            <p className="font-body font-medium opacity-80 mt-1 text-sm">{c.sub}</p>
                        </div>
                    </Link>
                    </Reveal>
                </FlingCard>
            ))}
          </div>
      </div>
    </section>
  )
}

/* ============================================================ how it works */
const HOW = [
  { n: '01', title: 'post it', color: 'bg-green text-ink', list: ['60-second form', 'set price & deadline', 'free to post'], Icon: FileText, sticker: 'bg-yellow', rotate: 4 },
  { n: '02', title: 'get matched', color: 'bg-lightblue text-cream', list: ['verified doers nearby', 'escrow holds the money', 'chat to coordinate'], Icon: Rocket, sticker: 'bg-orange', rotate: -5 },
  { n: '03', title: 'get it done', color: 'bg-orange text-cream', list: ['status timeline', 'mark complete', 'payment released'], Icon: ShieldCheck, sticker: 'bg-pink', rotate: 3 },
  { n: '04', title: 'rate & repeat', color: 'bg-pink text-ink', list: ['two-way ratings', 'wallet withdraw', 'UPI in 1-2 days'], Icon: StarIcon, sticker: 'bg-green', rotate: -3 },
]

function HowItWorks() {
  return (
    <section className="px-5 sm:px-10 py-20 relative">
      <Reveal className="text-center mb-16">
        <p className="font-body font-bold uppercase tracking-[0.35em] text-muted text-[11px]">process / 004</p>
        <h2 className="mt-3 font-display uppercase tracking-tight font-normal text-[10vw] sm:text-6xl lg:text-7xl inline-block relative">
          how it <em className="font-serif italic normal-case text-teal">works</em>
          <DrawUnderline className="absolute -bottom-3 right-0 w-32 sm:w-48" color="#d8ebea" />
        </h2>
      </Reveal>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((c, i) => {
            const Icon = c.Icon
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30, rotate: c.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: c.rotate }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={{ y: -8, rotate: 0, scale: 1.04 }}
                className={`relative h-[360px] rounded-[20px] border-[3px] border-ink p-6 flex flex-col justify-between shadow-[10px_10px_0_rgba(23,19,15,0.9)] ${c.color}`}
              >
                <Sticker size="md" color={c.sticker} rotate={6} className="absolute -top-5 left-6" icon={<Icon className="size-6" />} />
                <span className="font-display text-5xl opacity-30 self-end">{c.n}</span>
                <div>
                  <h3 className="font-display uppercase tracking-tight text-3xl">{c.title}</h3>
                  <ul className="mt-4 space-y-2.5 font-body font-medium opacity-90 text-sm">
                    {c.list.map((li) => (
                      <li key={li} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 rounded-full bg-current shrink-0" />
                        {li}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================================================ stats */
function Stats() {
  const db = useDB()
  const tasksDone = db.users.reduce((s, u) => s + u.tasksDone, 0)
  const doers = db.users.filter((u) => u.role !== 'poster').length
  const open = db.tasks.filter((t) => t.status === 'open').length
  return (
    <section className="px-5 sm:px-10 py-16 flex flex-wrap justify-center gap-8 sm:gap-14">
      <Reveal delay={0}>
        <CircleBadge rotate={-4} className="bg-green border-ink/25 text-ink">
          <div><Counter to={tasksDone} /><span className="block text-[10px] uppercase mt-1 opacity-80">tasks done</span></div>
        </CircleBadge>
      </Reveal>
      <Reveal delay={0.1}>
        <CircleBadge rotate={5} className="bg-lightblue text-white">
          <div><Counter to={doers} /><span className="block text-[10px] uppercase mt-1 opacity-80">active doers</span></div>
        </CircleBadge>
      </Reveal>
      <Reveal delay={0.2}>
        <CircleBadge rotate={-3} className="bg-orange text-cream">
          <div><Counter to={20} suffix=" min" /><span className="block text-[10px] uppercase mt-1 opacity-80">avg response</span></div>
        </CircleBadge>
      </Reveal>
      <Reveal delay={0.3}>
        <CircleBadge rotate={6} className="bg-pink text-ink">
          <div><Counter to={open} /><span className="block text-[10px] uppercase mt-1 opacity-80">open now</span></div>
        </CircleBadge>
      </Reveal>
    </section>
  )
}

/* ============================================================ touch-the-grass button */
const GRASS_BURSTS = ['\u{1F331}', '\u{1F33F}', '\u{1F49A}', '\u{1F33C}', '\u{2728}']

function TouchGrass() {
  const [grow, setGrow] = useState(0)
  const [bloomed, setBloomed] = useState(false)
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; emoji: string }[]>([])
  const timer = useRef<number>(0)
  const idRef = useRef(0)

  const clearTimer = () => {
    if (timer.current) {
      window.clearInterval(timer.current)
      timer.current = 0
    }
  }

  const start = () => {
    clearTimer()
    setBloomed(false)
    setGrow(0)
    let g = 0
    timer.current = window.setInterval(() => {
      g += 6
      setGrow(g)
      if (g >= 100) {
        clearTimer()
        setBloomed(true)
        toast('+grass grown \u{1F331}', 'you just mentally went outside. now go physically.')
        const btn = document.querySelector('[data-grass-btn]')?.getBoundingClientRect()
        const cx = btn ? btn.left + btn.width / 2 : window.innerWidth / 2
        const cy = btn ? btn.top : window.innerHeight / 2
        const next: typeof sparks = []
        for (let i = 0; i < 8; i++) {
          idRef.current += 1
          next.push({ id: idRef.current, x: cx + (Math.random() - 0.5) * 220, y: cy + (Math.random() - 0.5) * 40, emoji: GRASS_BURSTS[i % GRASS_BURSTS.length] })
        }
        setSparks((a) => [...a, ...next])
      }
    }, 30)
  }

  useEffect(() => {
    if (sparks.length) {
      const t = setTimeout(() => setSparks([]), 1200)
      return () => clearTimeout(t)
    }
  }, [sparks])

  return (
    <div className="relative inline-block">
      <motion.button
        data-grass-btn
        onPointerDown={start}
        onPointerUp={clearTimer}
        onPointerLeave={clearTimer}
        whileHover={{ y: -3, scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        className="relative inline-flex items-center gap-2 border-[3px] border-dashed border-orange rounded-xl px-7 py-3.5 font-display uppercase tracking-wider text-orange"
      >
        <motion.span animate={{ rotate: bloomed ? 0 : [0, -14, 10, -8, 0] }} transition={{ duration: 0.5 }}>
          {bloomed ? '\u{1F33C}' : '\u{1F331}'}
        </motion.span>
        {bloomed ? 'grass grown. go outside.' : 'hold to touch the grass'}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.span className="absolute inset-y-0 left-0 bg-[var(--color-sage)]" style={{ width: `${grow}%` }} />
        </span>
      </motion.button>

      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -80, scale: 1.25 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute pointer-events-none text-3xl"
            style={{ left: s.x, top: s.y }}
          >
            {s.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================ final CTA */
function CTA() {
  return (
    <section className="px-5 sm:px-10 py-5">
      <Reveal>
        <div className="relative bg-cocoa rounded-[28px] px-8 py-16 sm:p-20 text-center overflow-hidden border-[3px] border-ink shadow-[10px_10px_0_rgba(23,19,15,0.9)]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }} className="absolute -top-16 -left-16 size-64 rounded-full border-2 border-white/15" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-24 -right-16 size-80 rounded-full border-orange/30" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-8 right-10 hidden sm:block">
            <Sticker size="lg" color="orange" rotate={8} icon={<Sparkles className="size-9" />} />
          </motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-10 left-8 hidden sm:block">
            <Grassbot size={72} mood="happy" />
          </motion.div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute top-16 left-16 hidden md:block">
            <span className="text-4xl text-[var(--color-yellow)]">✦</span>
          </motion.div>

          <p className="font-body font-bold uppercase tracking-[0.35em] text-white/50 text-[11px]">contact / 005</p>
          <h2 className="mt-4 font-display uppercase tracking-tight text-white text-[14vw] sm:text-8xl leading-[0.9]">
            stop doing stuff <em className="font-serif italic normal-case grad-text">you hate.</em>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-white/60 font-body text-lg">
            post it in 60 seconds. a verified doer in your city does it. you go touch grass. simple.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link to="/post">
                <motion.span whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.94 }} className="inline-flex items-center gap-2 bg-coral text-cream rounded-xl px-9 py-4 font-display uppercase tracking-wide text-lg border-[3px] border-white shadow-[6px_6px_0_rgba(255,255,255,0.22)]">
                  post your first task <ArrowRight className="size-5" />
                </motion.span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/auth">
                <motion.span whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.94 }} className="inline-flex items-center gap-2 bg-white text-ink rounded-xl px-9 py-4 font-display uppercase tracking-wide text-lg shadow-[6px_6px_0_rgba(255,255,255,0.22)] hover:bg-[var(--color-yellow)]">
                  <Wallet className="size-5" /> become a doer
                </motion.span>
              </Link>
            </Magnetic>
          </div>
          <div className="mt-10 flex flex-col items-center gap-5">
            <TouchGrass />
            <div className="flex flex-wrap justify-center gap-6 text-xs font-body font-semibold text-white/50">
              <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-[var(--color-sage)]" /> ID-verified doers</span>
              <span className="flex items-center gap-1.5"><Wallet className="size-4 text-[var(--color-sage)]" /> Escrow payments</span>
              <span className="flex items-center gap-1.5"><StarIcon className="size-4 text-[var(--color-sage)]" /> Two-way ratings</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ============================================================ */
export default function Landing() {
  return (
    <div>
      <Hero />
      <Manifesto />
      <LiveTasks />
      <Posters />
      <HowItWorks />
      <Stats />
      <CTA />
    </div>
  )
}