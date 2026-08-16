import { useEffect, useState, Suspense, lazy, useCallback } from 'react'
import { Route, Routes, useLocation, Navigate, useNavigation } from 'react-router-dom'
import { AnimatePresence, motion, type TargetAndTransition, type Transition } from 'framer-motion'
import Lenis from 'lenis'
import { Navbar, Footer } from './components/Navbar'
import { CursorBubble, GrassRain, ToastHost, Spotlight } from './components/ui'
import { ThemeProvider } from './lib/theme.tsx'
import { ReduceMotionProvider, useReduceMotion } from './lib/reduceMotion.tsx'
import { NotificationsProvider } from './lib/notifications.tsx'
import { ThemeSwitcher } from './components/ThemeSwitcher'
import { OnboardingModal } from './components/OnboardingModal'
import Cursor from './components/Cursor'
import { CommandPalette } from './components/CommandPalette'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Feed from './pages/Feed'

const PostTask = lazy(() => import('./pages/PostTask'))
const TaskDetail = lazy(() => import('./pages/TaskDetail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const PublicProfile = lazy(() => import('./pages/PublicProfile'))

function PageSkeleton() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--color-grass)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-[var(--color-muted)]">Loading...</p>
      </div>
    </div>
  )
}

/* konami → grass rain easter egg */
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
function Konami() {
  const { reduceMotion } = useReduceMotion()
  const [i, setI] = useState(0)
  const [rain, setRain] = useState(false)
  useEffect(() => {
    if (rain) {
      const t = setTimeout(() => setRain(false), 6500)
      return () => clearTimeout(t)
    }
    if (reduceMotion) return
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
  }, [i, rain, reduceMotion])
  return rain ? <GrassRain /> : null
}

/* subtle genz click pops (fine pointers only, no autoplay) */
function ClickSounds() {
  const { reduceMotion } = useReduceMotion()
  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer:fine)').matches) return
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
  }, [reduceMotion])
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
  const navigation = useNavigation()
  
  useEffect(() => {
    if (!document.startViewTransition) {
      window.scrollTo(0, 0)
      return
    }
    
    const transition = document.startViewTransition(() => {
      window.scrollTo(0, 0)
    })
    
    transition.ready.then(() => {
      // Transition complete
    })
  }, [pathname, navigation.state])
  
  return null
}

function SmoothScroll() {
  const { reduceMotion } = useReduceMotion()
  useEffect(() => {
    if (reduceMotion) return
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
  }, [reduceMotion])
  return null
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-fg)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:bg-[var(--color-grass)] focus:text-white focus:rounded-md focus:font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-ink)]">
        Skip to main content
      </a>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const routeKey = getRouteKey(location.pathname)
  const variants = routeVariants[routeKey] ?? routeVariants['/']
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleRouteChange = useCallback(async (pathname: string) => {
    if (!document.startViewTransition) return false
    
    setIsTransitioning(true)
    await document.startViewTransition(async () => {
      // Navigation will happen via router
    }).ready
    
    setIsTransitioning(false)
    return true
  }, [])

  return (
    <ThemeProvider>
      <ReduceMotionProvider>
        <NotificationsProvider>
          <ScrollToTop />
          <SmoothScroll />
          <CursorBubble />
          <Spotlight />
          <ClickSounds />
          <Konami />
          <CommandPalette />
          <Shell>
          <AnimatePresence mode="wait">
            <motion.div
              key={routeKey}
              initial={isTransitioning ? { opacity: 1 } : variants.initial}
              animate={variants.animate}
              exit={isTransitioning ? { opacity: 1 } : variants.exit}
              transition={variants.transition}
              style={{ viewTransitionName: 'page-content' }}
            >
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/tasks" element={<Feed />} />
              <Route path="/post" element={<Suspense fallback={<PageSkeleton />}><PostTask /></Suspense>} />
              <Route path="/task/:id" element={<Suspense fallback={<PageSkeleton />}><TaskDetail /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<PageSkeleton />}><Profile /></Suspense>} />
              <Route path="/u/:username" element={<Suspense fallback={<PageSkeleton />}><PublicProfile /></Suspense>} />
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Shell>
        <ToastHost />
        <ThemeSwitcher />
        <OnboardingModal onComplete={() => {}} />
        </NotificationsProvider>
      </ReduceMotionProvider>
    </ThemeProvider>
  )
}