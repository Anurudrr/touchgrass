import { motion, useInView, useMotionValue, useMotionTemplate, useSpring, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, TriangleAlert, X } from 'lucide-react'

/* ---------------- Button ---------------- */
export function BrutButton({
  children,
  variant = 'coral',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled,
  pulse,
}: {
  children: ReactNode
  variant?: 'coral' | 'periwinkle' | 'sage' | 'ink' | 'paper' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  pulse?: boolean
}) {
  const sizes = { sm: 'px-5 py-2 text-sm', md: 'px-7 py-3 text-base', lg: 'px-9 py-4 text-lg' }
  const looks = {
    coral: 'bg-coral text-cream border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)] hover:bg-[var(--color-coral)] hover:shadow-[7px_8px_0_rgba(23,19,15,0.95)]',
    periwinkle: 'bg-periwinkle text-white border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)] hover:bg-[var(--color-periwinkle)] hover:shadow-[7px_8px_0_rgba(23,19,15,0.95)]',
    sage: 'bg-sage text-ink border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)] hover:bg-[var(--color-sage)] hover:shadow-[7px_8px_0_rgba(23,19,15,0.95)]',
    ink: 'bg-ink text-cream border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)] hover:bg-charcoal hover:shadow-[7px_8px_0_rgba(23,19,15,0.95)]',
    paper: 'bg-cream text-ink border-[3px] border-ink shadow-[5px_6px_0_rgba(23,19,15,0.95)] hover:bg-yellow hover:shadow-[7px_8px_0_rgba(23,19,15,0.95)]',
    ghost: 'bg-transparent text-ink border-[3px] border-ink hover:bg-ink hover:text-cream hover:shadow-[5px_6px_0_rgba(23,19,15,0.95)]',
  }
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95, rotate: -2 }}
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`font-display font-bold tracking-tight ${sizes[size]} ${looks[variant]} rounded-xl disabled:opacity-40 disabled:cursor-not-allowed ${pulse ? 'pulse-cta' : ''} ${className}`}
    >
      {children}
    </motion.button>
  )
}

export function Pill({
  children,
  active,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full font-body font-semibold text-sm transition-all ${
        active ? 'bg-ink text-white scale-105' : 'bg-warm-paper text-ink hover:bg-soft'
      }`}
    >
      {children}
    </button>
  )
}

/* ---------------- Card ---------------- */
export function Brut({ children, className = '', tilt }: { children: ReactNode; className?: string; tilt?: boolean }) {
  return (
    <motion.div
      whileHover={tilt ? { y: -6, rotate: 1.5, scale: 1.02 } : { y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`rounded-[18px] surface ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Sticker-style badges ---------------- */
export function Chip({
  children,
  color = 'coral',
  rotate = 0,
  className = '',
  border = true,
}: {
  children: ReactNode
  color?: string
  rotate?: number
  className?: string
  border?: boolean
}) {
  const colors: Record<string, string> = {
    coral: 'bg-coral text-cream',
    periwinkle: 'bg-periwinkle text-white',
    sage: 'bg-sage text-ink',
    rose: 'bg-rose text-white',
    blush: 'bg-blush text-ink',
    lavender: 'bg-lavender text-ink',
    peach: 'bg-peach text-ink',
    ink: 'bg-ink text-cream',
    cream: 'bg-cream text-ink',
    yellow: 'bg-yellow text-ink',
  }
  return (
    <motion.span
      whileHover={{ rotate: rotate + 6, scale: 1.08 }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-block px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wide ${colors[color] ?? colors.coral} ${border ? 'border-2 border-ink shadow-[3px_4px_0_rgba(23,19,15,0.9)]' : ''} ${className}`}
    >
      {children}
    </motion.span>
  )
}

export function CircleBadge({ children, className = '', rotate = 0 }: { children: ReactNode; className?: string; rotate?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, rotate: rotate + 4 }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`rounded-full flex items-center justify-center text-center leading-tight size-28 sm:size-32 border-2 border-ink shadow-[6px_6px_0_rgba(23,19,15,0.85)] font-display font-bold text-ink ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Inputs ---------------- */
const inputBase =
  'w-full rounded-xl px-4 py-3 bg-cream text-ink font-body focus:outline-none focus:ring-4 focus:ring-sage/60 transition-shadow placeholder:text-muted/70 border-[3px] border-ink shadow-[3px_4px_0_rgba(23,19,15,0.85)]'

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block font-display font-bold text-[11px] uppercase tracking-widest text-muted mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted mt-1">{hint}</span>}
    </label>
  )
}

export const inputCls = inputBase
export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={inputBase}>
      {children}
    </select>
  )
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

/* ---------------- Counter ---------------- */
export function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const spring = useSpring(0, { stiffness: 60, damping: 18 })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (inView) {
      spring.set(to)
      const unsub = spring.on('change', (v) => setVal(Math.round(v)))
      return unsub
    }
  }, [inView, to, spring])
  return (
    <span ref={ref}>
      {val.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

/* ---------------- Marquee (horizontal ticker) ---------------- */
export function Marquee({ items, className = '', sep = '✦' }: { items: string[]; className?: string; sep?: string }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden marquee-x-paused whitespace-nowrap py-3 ${className}`}>
      <div className="marquee-x-track">
        {row.map((item, i) => (
          <span key={i} className="mx-5 font-display font-bold text-xl uppercase flex items-center gap-2 text-ink">
            {item} <span className="opacity-40 text-sm">{sep}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Vertical double marquee ---------------- */
export function VerticalMarquee({ columns, className = '' }: { columns: ReactNode[][]; className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {columns.map((col, i) => (
        <div key={i} className={`flex-1 overflow-hidden marquee-col ${i % 2 ? 'marq-down' : 'marq-up'}`}>
          <div className="marquee-col-track">
            {[...col, ...col].map((item, j) => (
              <div key={j}>{item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Toast ---------------- */
export type Toast = { id: number; message: string; body?: string; kind?: 'success' | 'error' }
let toastId = 0
const toastListeners = new Set<(t: Toast) => void>()
export function toast(message: string, body?: string, kind: 'success' | 'error' = 'success') {
  const t = { id: ++toastId, message, body, kind }
  toastListeners.forEach((l) => l(t))
}
export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([])
  useEffect(() => {
    const l = (t: Toast) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3800)
    }
    toastListeners.add(l)
    return () => {
      toastListeners.delete(l)
    }
  }, [])
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-[min(90vw,360px)]">
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          className="relative overflow-hidden bg-cream border-2 border-ink rounded-2xl p-4 shadow-[5px_6px_0_rgba(23,19,15,0.9)]"
        >
          <div className="flex items-start gap-3">
            {t.kind === 'success' ? <CheckCircle2 className="text-sage shrink-0" /> : <TriangleAlert className="text-rose shrink-0" />}
            <div>
              <p className="font-display font-bold text-ink">{t.message}</p>
              {t.body && <p className="text-sm text-muted">{t.body}</p>}
            </div>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="ml-auto text-muted hover:text-ink">
              <X className="size-4" />
            </button>
          </div>
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3.8, ease: 'linear' }}
            className="absolute bottom-0 left-0 h-1 bg-coral"
          />
        </motion.div>
      ))}
    </div>,
    document.body
  )
}

/* ---------------- Reveal ---------------- */
export function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Confetti ---------------- */
export function ConfettiBurst() {
  const colors = ['var(--color-coral)', 'var(--color-periwinkle)', 'var(--color-sage)', 'var(--color-rose)', 'var(--color-blush)', 'var(--color-lavender)', 'var(--color-peach)']
  const pieces = Array.from({ length: 40 })
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 overflow-visible flex justify-center">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: `calc(50% + ${(Math.random() - 0.5) * 240}px)`,
            top: 0,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.25}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

/* ---------------- Star rating ---------------- */
export function StarRatingInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className="transition-transform hover:scale-125 active:scale-90" aria-label={`${n} stars`}>
          <svg viewBox="0 0 24 24" className={`size-8 ${n <= value ? 'fill-coral text-coral' : 'fill-none stroke-ink'}`} strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

/* ---------------- Wiggle on hover ---------------- */
export function Wiggle({ children, deg = 4, className = '' }: { children: ReactNode; deg?: number; className?: string }) {
  const [w, setW] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  return (
    <motion.div
      ref={ref}
      onHoverStart={() => setW(true)}
      onHoverEnd={() => setW(false)}
      animate={{ rotate: w ? deg : 0 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Hand-drawn scribble underline ---------------- */
export function DrawUnderline({ color = '#1a1a1a', className = '', strokeWidth = 3, delay = 0 }: { color?: string; className?: string; strokeWidth?: number; delay?: number }) {
  return (
    <svg viewBox="0 0 634 28" fill="none" className={className} aria-hidden="true">
      <motion.path
        d="M2 26C41 23.2 80 19.9 118.6 15.6C169.1 10 227.3 2.4 275.2 2C280.5 2.6 264.8 5 262.5 5.6C257.8 6.4 252.5 7.5 247.3 8.6C239.6 10.4 212.5 15.8 226.9 19.8C239.6 22.6 263.7 22 281 21.4C314.8 20 349.3 16.7 383.2 14.8C465.9 9.5 549.2 10.5 632 14.1"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.3, delay, ease: 'easeOut' }}
      />
    </svg>
  )
}

/* ---------------- Cursor bubble ---------------- */
export function CursorBubble() {
  const reduced = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 })
  const sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)

  useEffect(() => {
    if (reduced || typeof window === 'undefined' || !window.matchMedia('(pointer:fine)').matches) return
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement
      const interactive = t.closest('a,button,[role="button"],input,select,textarea,[data-cursor]')
      if (interactive) {
        setHovering(true)
        setLabel((interactive as HTMLElement).dataset.cursor ?? '')
      } else {
        setHovering(false)
      }
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [reduced, x, y])

  if (reduced) return null
  return (
    <motion.div
      className="fixed top-0 left-0 z-[200] pointer-events-none"
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <motion.div
        animate={{
          scale: down ? 0.7 : hovering ? 2.4 : 1,
          rotate: down ? 0 : hovering ? 180 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="size-6 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <span className="text-ink font-display text-lg select-none">✦</span>
        {hovering && label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 font-display font-bold text-[9px] text-ink whitespace-nowrap bg-cream border-2 border-ink px-2 py-0.5 rounded shadow-[3px_4px_0_rgba(23,19,15,0.9)]"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ---------------- Sticker (colored blob with icon) ---------------- */
export function Sticker({ icon, color = 'blush', rotate = 0, className = '', size = 'md' }: { icon: ReactNode; color?: string; rotate?: number; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const bg: Record<string, string> = {
    coral: 'bg-coral text-white',
    periwinkle: 'bg-periwinkle text-white',
    sage: 'bg-sage text-ink',
    rose: 'bg-rose text-white',
    blush: 'bg-blush text-ink',
    lavender: 'bg-lavender text-ink',
    peach: 'bg-peach text-ink',
    ink: 'bg-ink text-white',
    white: 'bg-cream text-ink',
    orange: 'bg-orange text-cream',
    pink: 'bg-rose text-white',
    lightgreen: 'bg-sage text-ink',
    lightblue: 'bg-periwinkle text-white',
    yellow: 'bg-yellow text-ink',
    green: 'bg-sage text-ink',
    darkblue: 'bg-periwinkle text-white',
  }
  const sizes = { sm: 'size-10', md: 'size-14', lg: 'size-20' }
  return (
    <motion.div
      whileHover={{ rotate: rotate + 10, scale: 1.1 }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`${sizes[size]} ${bg[color] ?? bg.blush} rounded-full border-2 border-ink shadow-[3px_4px_0_rgba(23,19,15,0.9)] flex items-center justify-center ${className}`}
    >
      {icon}
    </motion.div>
  )
}

export const motionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

/* ---------------- Polaroid ---------------- */
export function Polaroid({ children, caption, className = '', rotate = -3 }: { children: ReactNode; caption?: string; className?: string; rotate?: number }) {
  return (
    <motion.div
      whileHover={{ rotate: 0, scale: 1.04, y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative bg-cream p-3 pb-5 rounded-md border-2 border-ink shadow-[6px_6px_0_rgba(23,19,15,0.85)] ${className}`}
    >
      <span className="tape" aria-hidden="true" />
      {children}
      {caption && (
        <p className="mt-3 text-center font-serif italic text-muted text-sm leading-snug px-2">{caption}</p>
      )}
    </motion.div>
  )
}

/* ---------------- Rubber stamp ---------------- */
export function Stamp({ text, className = '', color = 'var(--color-coral)' }: { text: string; className?: string; color?: string }) {
  return (
    <span
      className={`inline-block rotate-[-8deg] border-[3px] rounded-lg px-3 py-1.5 font-display font-extrabold uppercase text-xs tracking-widest opacity-80 ${className}`}
      style={{ color, borderColor: color }}
    >
      {text}
    </span>
  )
}

/* ---------------- Grass rain (konami easter egg) ---------------- */
const GRASS_EMOJIS = ['\u{1F331}', '\u{1F33F}', '\u{1F340}', '\u{1F33C}', '\u{1F49A}']

export function GrassRain({ count = 48 }: { count?: number }) {
  if (typeof window === 'undefined') return null
  const drops = Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    dur: 2.4 + Math.random() * 2.4,
    size: 18 + Math.random() * 26,
    emoji: GRASS_EMOJIS[Math.floor(Math.random() * GRASS_EMOJIS.length)],
    spin: Math.random() > 0.5 ? 1 : -1,
  }))
  return (
    <div aria-hidden="true">
      {drops.map((d, i) => (
        <span
          key={i}
          className="grass-drop"
          style={{
            left: `${d.left}%`,
            fontSize: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
            ['--tw-spin' as string]: d.spin,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  )
}

/* ---------------- Grassbot Loader (branded loading) ---------------- */
export function GrassbotLoader({ size = 64, text = 'photosynthesizing...' }: { size?: number; text?: string }) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 8), 180)
    return () => clearInterval(id)
  }, [])
  const bounce = Math.sin(frame * 0.8) * 6
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <radialGradient id="loader-body" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#8fd11f" />
            <stop offset="70%" stopColor="#3b5bff" />
            <stop offset="100%" stopColor="#17130f" />
          </radialGradient>
        </defs>
        <g transform={`translate(50, 50) translate(0, ${bounce}) translate(-50, -50)`}>
          <path d="M20 30 C18 16 26 12 30 6 C31 14 32 18 38 24 C34 28 28 30 20 30 Z" fill="#3b5bff" />
          <path d="M62 18 C60 6 66 1 72 2 C71 12 74 14 80 18 C74 20 68 20 62 18 Z" fill="#3b5bff" />
          <path d="M84 22 C86 14 94 10 98 16 C96 22 92 26 84 22 Z" fill="#3b5bff" />
          <path d="M50 12 C70 8 88 18 90 40 C92 62 80 86 50 92 C20 86 8 62 10 40 C12 18 30 8 50 12 Z" fill="url(#loader-body)" />
          <ellipse cx="50" cy="58" rx="28" ry="22" fill="#17130f" opacity="0.25" />
          <g fill="#0f2020">
            <circle cx="36" cy="46" r="4.5" />
            <circle cx="64" cy="46" r="4.5" />
          </g>
          <g fill="#ffffff">
            <circle cx="37.5" cy="44" r="1.6" />
            <circle cx="65.5" cy="44" r="1.6" />
          </g>
          <ellipse cx="26" cy="52" rx="6" ry="4" fill="#ff2e93" opacity="0.8" />
          <ellipse cx="74" cy="52" rx="6" ry="4" fill="#ff2e93" opacity="0.8" />
          <path d="M42 55 Q50 51 58 55" fill="none" stroke="#0f2020" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <p className="font-body font-medium text-muted text-sm">{text}</p>
    </div>
  )
}

/* ---------------- Scroll Progress Indicator ---------------- */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (progress === 0) return null
  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] h-1 bg-coral"
      style={{ width: `${progress * 100}%` }}
      animate={{ width: `${progress * 100}%` }}
      transition={{ duration: 0.1, ease: 'linear' }}
      aria-hidden="true"
    />
  )
}

/* ---------------- Parallax Wrapper ---------------- */
export function Parallax({ children, speed = 0.3, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const distance = (elementCenter - viewportCenter) * speed
      el.style.transform = `translateY(${distance}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])
  return <div ref={ref} className={className}>{children}</div>
}

/* ---------------- Magnetic (CTAs lean toward the cursor) ---------------- */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 220, damping: 14 })
  const sy = useSpring(my, { stiffness: 220, damping: 14 })
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}

/* ---------------- Tilt (3D card tilt that follows the mouse) ---------------- */
export function Tilt({ children, max = 8, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 220, damping: 16 })
  const sry = useSpring(ry, { stiffness: 220, damping: 16 })
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rx.set(-py * max)
    ry.set(px * max)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }
  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Spotlight (cursor-following ambient glow) ---------------- */
export function Spotlight() {
  const reduced = useReducedMotion()
  const x = useMotionValue(50)
  const y = useMotionValue(50)
  const sx = useSpring(x, { stiffness: 90, damping: 22 })
  const sy = useSpring(y, { stiffness: 90, damping: 22 })
  const bg = useMotionTemplate`radial-gradient(640px circle at ${sx}% ${sy}%, rgba(255,95,58,0.12), transparent 62%)`

  useEffect(() => {
    if (reduced || typeof window === 'undefined' || !window.matchMedia('(pointer:fine)').matches) return
    const onMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth) * 100)
      y.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, x, y])

  if (reduced || typeof window === 'undefined') return null
  if (!window.matchMedia('(pointer:fine)').matches) return null
  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[40]" style={{ background: bg }} />
  )
}

/* ---------------- Drag Marquee ---------------- */
export function DragMarquee({ items, className = '', itemRender }: { items: string[]; className?: string; itemRender: (item: string, i: number) => React.ReactNode }) {
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [velocity, setVelocity] = useState(0)
  const lastX = useRef(0)
  const lastTime = useRef(Date.now())
  const rafId = useRef<number | undefined>(undefined)

  const row = [...items, ...items, ...items]
  const itemWidth = 280
  const totalWidth = items.length * itemWidth

  useEffect(() => {
    if (!dragging) {
      const animate = () => {
        setVelocity(v => v * 0.985)
        setX(curr => {
          const next = curr + velocity
          if (next <= -totalWidth) return next + totalWidth
          if (next >= 0) return next - totalWidth
          return next
        })
        if (Math.abs(velocity) > 0.05) rafId.current = requestAnimationFrame(animate)
      }
      rafId.current = requestAnimationFrame(animate)
    }
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [dragging, velocity, totalWidth])

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true)
    lastX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
    lastTime.current = Date.now()
    setVelocity(0)
  }
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const delta = clientX - lastX.current
    const now = Date.now()
    const dt = now - lastTime.current
    setVelocity(delta / dt)
    setX(curr => curr + delta)
    lastX.current = clientX
    lastTime.current = now
  }
  const onUp = () => {
    setDragging(false)
    if (Math.abs(velocity) > 2) {
      setVelocity(v => v * 1200)
    }
  }

  return (
    <div className={`overflow-x-hidden ${className}`} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}>
      <div className="flex" style={{ transform: `translateX(${x}px)` }}>
        {row.map((item, i) => (
          <div key={i} className="w-[280px] flex-shrink-0 px-3">
            {itemRender(item, i % items.length)}
          </div>
        ))}
      </div>
    </div>
  )
}