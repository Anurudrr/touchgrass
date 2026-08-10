import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from 'framer-motion'
import Lenis from 'lenis'
import { Navbar, Footer } from './components/Navbar'
import { CursorBubble, GrassRain, ToastHost, Spotlight } from './components/ui'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Feed from './pages/Feed'
import PostTask from './pages/PostTask'
import TaskDetail from './pages/TaskDetail'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

/* konami → grass rain easter egg */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
function Konami() {
  const [i, setI] = useState(0)
  const [rain, setRain] = useState(false)
  useEffect(() => {
    if (rain) {
      const t = setTimeout(() => setRain(false), 6500)
      return () => clearTimeout(t)
    }
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (k === KONAMI[i]) {
        const next = i + 1
        if (next === KONAMI.length) {
          setI(0)
          setRain(true)
        } else {
          setI(next)
        }
      } else {
        setI(k === KONAMI[0] ? 1 : 0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [i, rain])
  return rain ? <GrassRain /> : null
}

/* subtle genz click pops (fine pointers only, no autoplay) */
function ClickSounds() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !window.matchMedia('(pointer:fine)').matches) return
    let ctx: AudioContext | null = null
    const onDown = () => {
      ctx = ctx ?? new AudioContext()
      if (ctx.state === 'suspended') void ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = ctx.currentTime
      osc.type = 'sine'
      osc.frequency.setValueAtTime(180 + Math.random() * 90, t)
      gain.gain.setValueAtTime(0.045, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.08)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])
  return null
}

/* per-route transition variants */
type RouteVariant = { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition; transition: Transition }
const routeVariants: Record<string, RouteVariant> = {
  '/': { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  '/tasks': { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  '/post': { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  '/auth': { initial: { opacity: 0, rotateX: 15 }, animate: { opacity: 1, rotateX: 0 }, exit: { opacity: 0, rotateX: -15 }, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  '/dashboard': { initial: { opacity: 0, y: 30, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -30, scale: 0.98 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  '/profile': { initial: { opacity: 0, x: -40, scale: 0.98 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 40, scale: 0.98 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  '/task': { initial: { opacity: 0, y: 20, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.98 }, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
}

function getRouteKey(pathname: string) {
  if (pathname.startsWith('/task/')) return '/task'
  return pathname
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    let id: number
    const raf = (time: number) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])
  return null
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const routeKey = getRouteKey(location.pathname)
  const variants = routeVariants[routeKey] ?? routeVariants['/']
  return (
    <>
      <ScrollToTop />
      <SmoothScroll />
      <CursorBubble />
      <Spotlight />
      <ClickSounds />
      <Konami />
      <div className="grain" aria-hidden="true" />
      <Shell>
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={variants.transition}
          >
            <Routes location={location}>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/tasks" element={<Feed />} />
              <Route path="/post" element={<PostTask />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Shell>
      <ToastHost />
    </>
  )
}