import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, LayoutDashboard, LogOut, User as UserIcon, ArrowUpRight } from 'lucide-react'
import { store } from '../lib/db'
import { CATEGORIES } from '../lib/types'
import { categoryIcon } from './icons'
import { toast, ScrollProgress } from './ui'

export function Logo({ dark = false, onClick }: { dark?: boolean; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="group inline-flex items-baseline gap-1" data-cursor="home">
      <span className={`font-display font-extrabold tracking-tight text-2xl sm:text-[1.7rem] leading-none ${dark ? 'text-white' : 'text-ink'}`}>
        touch<span className="text-teal">grass</span>
      </span>
      <motion.span
        whileHover={{ rotate: 360, scale: 1.3 }}
        transition={{ duration: 0.5 }}
        className={`size-2.5 inline-block ${dark ? 'text-yellow' : 'text-teal'}`}
      >
        ✦
      </motion.span>
    </Link>
  )
}

function Popout({ children, label, icon, origin = 'left' }: { children: React.ReactNode; label: string; icon?: React.ReactNode; origin?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body font-semibold text-sm transition-colors border-2 border-ink ${open ? 'bg-ink text-cream' : 'bg-cream text-ink hover:bg-yellow'}`}
      >
        {icon}
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0, opacity: 0, transformOrigin: origin === 'left' ? 'left top' : 'right top' }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full mt-3 w-72 rounded-2xl bg-cream border-2 border-ink shadow-[6px_6px_0_rgba(23,19,15,0.9)] p-4 ${origin === 'left' ? 'left-0' : 'right-0'}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const user = store.sessionUser()
  const [onDark, setOnDark] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setOnDark(y < window.innerHeight * 0.6)
      setHidden(y > lastScrollY && y > 80)
      setLastScrollY(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  const dark = onDark && location.pathname === '/'

  return (
    <>
      <ScrollProgress />
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: hidden ? 0.25 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-[90] transition-colors duration-300 ${dark ? 'bg-ink/95 backdrop-blur text-white' : 'bg-cream/95 backdrop-blur text-ink'} border-b-2 border-ink`}
      >
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 max-w-[1600px] mx-auto">
        {/* left: browse popout */}
        <Popout
          label="browse"
          icon={<UserIcon className="size-4" />}
        >
          <p className="px-2 pt-1 pb-2 font-display font-bold text-xs uppercase tracking-widest text-muted">Need something done?</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((c) => {
              const Icon = categoryIcon(c.key)
              return (
                <Link
                  key={c.key}
                  to="/tasks"
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-yellow transition-colors border border-ink/20"
                >
                  <span className="size-8 rounded-full bg-sage flex items-center justify-center shrink-0 border-2 border-ink">
                    <Icon className="size-4 text-ink" />
                  </span>
                  <span className="text-[11px] font-display font-bold leading-tight">{c.label.split(' ')[0]}</span>
                </Link>
              )
            })}
          </div>
          <Link to="/tasks" className="mt-3 flex items-center justify-between rounded-xl bg-ink text-cream px-4 py-3 font-display font-bold text-sm hover:bg-charcoal border-2 border-ink shadow-[3px_4px_0_rgba(23,19,15,0.9)]">
            See all open tasks <ArrowUpRight className="size-4" />
          </Link>
        </Popout>

        {/* center: logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo dark={dark} />
        </div>

        {/* right: post task + auth */}
        <div className="flex items-center gap-2">
          <Popout
            label="post a task"
            icon={<Plus className="size-4" />}
            origin="right"
          >
            <p className="px-2 pt-1 pb-2 font-display font-bold text-xs uppercase tracking-widest text-muted">Got a chore?</p>
            <Link to="/post" className="flex items-center justify-between rounded-xl bg-coral text-cream px-4 py-3.5 font-display font-bold text-sm hover:bg-rose border-2 border-ink shadow-[3px_4px_0_rgba(23,19,15,0.9)]">
              Post a task now <ArrowUpRight className="size-4" />
            </Link>
            <Link to="/tasks" className="mt-2 flex items-center gap-2 rounded-xl px-4 py-2.5 hover:bg-yellow font-body font-semibold text-sm border-2 border-ink">
              or browse & earn
            </Link>
          </Popout>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body font-semibold text-sm hover:bg-yellow border-2 border-ink bg-cream text-ink"
                title="My tasks"
              >
                <LayoutDashboard className="size-4" /> my tasks
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full px-2.5 py-1.5 hover:bg-yellow border-2 border-ink bg-cream text-ink"
                title="Profile"
              >
                <span className={`size-7 rounded-full flex items-center justify-center font-display font-bold text-xs border-2 border-ink ${dark ? 'bg-yellow text-ink' : 'bg-ink text-yellow'}`}>
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
              </Link>
              <button
                onClick={() => {
                  store.logout()
                  toast('Logged out', 'Go touch grass. See you soon.')
                  navigate('/')
                }}
                className="rounded-full p-2 hover:bg-yellow border-2 border-ink bg-cream text-ink"
                title="Log out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:inline-block rounded-full px-4 py-1.5 font-body font-semibold text-sm hover:bg-yellow border-2 border-ink bg-cream text-ink">
                log in
              </Link>
              <Link
                to="/auth"
                className={`inline-block rounded-full px-4 py-1.5 font-display font-bold text-sm border-2 border-ink ${dark ? 'bg-white text-ink hover:bg-yellow' : 'bg-ink text-white hover:bg-charcoal'}`}
              >
                become a doer
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
    </>
  )
}

export function Footer() {
  const [credits, setCredits] = useState(false)
  return (
    <footer className="bg-ink text-white mt-24 rounded-t-[36px] relative overflow-hidden border-t-4 border-teal">
      {/* giant wordmark */}
      <div className="text-center pt-16 pb-6">
        <h2 className="font-display font-extrabold tracking-tighter text-[16vw] leading-[0.85] select-none">
          touch<span className="text-teal">grass</span>
        </h2>
        <motion.div className="mt-4 inline-flex items-center gap-3" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          <span className="text-yellow text-2xl">✦</span>
          <span className="font-display font-bold uppercase tracking-widest text-xs text-white/50">printed in india</span>
          <span className="text-yellow text-2xl">✦</span>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-4 pb-14">
        <div className="md:col-span-2">
          <p className="font-display font-bold text-2xl leading-snug max-w-md">
            Do less scrolling. <em className="font-serif italic text-teal">Do more living.</em>
          </p>
          <p className="mt-3 text-white/60 font-body max-w-md">
            Post a task, a verified doer in your city handles it while you go touch grass. Escrow payments, two-way ratings, zero drama.
          </p>
          <div className="mt-6 flex gap-3">
            {['Instagram', 'LinkedIn', 'TikTok', 'X'].map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-xl border-2 border-white/20 px-4 py-1.5 text-xs font-display font-bold hover:bg-white hover:text-ink transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display font-bold uppercase text-xs tracking-widest text-coral mb-4">Marketplace</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link to="/tasks" className="hover:text-white underline decoration-2 underline-offset-2">Browse tasks</Link></li>
            <li><Link to="/post" className="hover:text-white underline decoration-2 underline-offset-2">Post a task</Link></li>
            <li><Link to="/auth" className="hover:text-white underline decoration-2 underline-offset-2">Become a doer</Link></li>
            <li><Link to="/dashboard" className="hover:text-white underline decoration-2 underline-offset-2">My tasks</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display font-bold uppercase text-xs tracking-widest text-coral mb-4">Company</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><a href="#" className="hover:text-white underline decoration-2 underline-offset-2">Trust & safety</a></li>
            <li><a href="#" className="hover:text-white underline decoration-2 underline-offset-2">Commission</a></li>
            <li><a href="#" className="hover:text-white underline decoration-2 underline-offset-2">Disputes</a></li>
            <li><a href="#" className="hover:text-white underline decoration-2 underline-offset-2">Contact</a></li>
          </ul>

          {/* credits popout */}
          <div className="mt-6">
            <motion.button
              onHoverStart={() => setCredits(true)}
              onHoverEnd={() => setCredits(false)}
              onClick={() => setCredits(!credits)}
              className="rounded-xl bg-white/10 px-4 py-3 font-display font-bold text-sm hover:bg-white/20 transition-colors border-2 border-white/20"
            >
              credits
            </motion.button>
            <AnimatePresence>
              {credits && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-xl bg-white/10 p-4 text-xs text-white/70 space-y-1.5">
                    <p className="font-display font-bold text-white">credits — v1.0</p>
                    <p>design & build: touchgrass team</p>
                    <p>aesthetic: 2024 portfolio graphic design</p>
                    <p>stack: react 19 · mongodb atlas · razorpay-ready</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40 font-body">
        © 2026 touchgrass — go outside. every task, every corner.
      </div>
    </footer>
  )
}
