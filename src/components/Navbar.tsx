import { useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, X, Leaf, Bell } from 'lucide-react'
import { store } from '../lib/db'
import { toast, ScrollProgress } from './ui'
import { playRustleSound, playHoverSound } from '../lib/audio'
import { useNotifications } from '../lib/notifications.tsx'

/* ─── Aardvark Logo SVG ─── */
export function LogoMark({ size = 36, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill={dark ? '#FFF9F0' : '#0F0E0A'}
        d="m199.994 209.658-36.789-82.687c4.7-11.517 16.632-47.147 4.249-91.594a3.17 3.17 0 0 0-2.26-2.25c-1.085-.27-2.26 0-3.073.9-.362.45-9.943 10.167-16.903 23.214-9.672 17.995-9.491 33.2.452 44.177 10.937 11.967 11.479 20.334 10.846 24.113l-2.079.18c-3.705-7.917-16.089-30.231-46.912-51.825-.813-.54-1.807-.63-2.621-.27-.904.36-1.446 1.26-1.536 2.16-1.176 14.395 2.711 42.377 25.851 45.796 14.553 2.16 19.434 6.299 20.97 8.008-.452 3.059-1.536 7.018-3.706 12.147l-27.297 62.442h-.091c-.09.36-.271.72-.452 1.08l-.361.72c-4.339 9.267-19.976 25.373-26.213 31.671-1.537 1.619-2.621 2.699-2.983 3.149-.361.45-1.446 2.159.633 4.409 2.892 3.149 11.931 7.108 16.179 4.139 1.266-.9 1.989-1.8 2.803-2.88 2.35-3.059 15.004-17.095 35.342-34.73 0 0 6.598-8.188 16.631-9.447h6.056c4.52 0 8.135 1.079 10.214 5.668l3.345 7.648c3.163 7.288 3.163 11.247-7.502 12.956v4.859h43.658v-4.679c-8.859-1.619-10.757-6.478-16.451-19.074m-49.624-27.263c-4.7 0-8.587-3.779-8.587-8.547 0-4.679 3.796-8.548 8.587-8.548 4.7 0 8.587 3.779 8.587 8.548 0 4.678-3.887 8.547-8.587 8.547"
      />
      <path
        fill={dark ? '#FFF9F0' : '#0F0E0A'}
        fillRule="evenodd"
        d="M153.456 0C238.208 0 300 69.006 300 154.128 300 239.251 238.208 300 153.456 300 68.705 300 0 239.251 0 154.128 0 69.006 68.705 0 153.456 0m85.715 58.863c-51.815-50.528-135.876-51.577-186.636 0S7.633 188.921 59.447 239.45c51.814 50.526 138.641 59.833 189.401 8.256s42.137-138.316-9.677-188.843"
        clipRule="evenodd"
      />
    </svg>
  )
}

/* ─── Logo wordmark ─── */
export function Logo({ dark = false, onClick }: { dark?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <Link
      to="/"
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); playRustleSound() }}
      onMouseLeave={() => setHovered(false)}
      className="group relative inline-flex items-center gap-2.5"
      data-cursor="home"
    >
      <LogoMark size={34} dark={dark} />
      <span
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          color: dark ? '#FFF9F0' : '#0F0E0A',
          fontStyle: 'italic',
        }}
      >
        touch<em style={{ color: '#F9A220', fontStyle: 'normal' }}>grass</em>
      </span>

      {/* Logo Sweep Grass Animation */}
      <div className="absolute inset-x-0 -bottom-2 h-4 pointer-events-none flex justify-center gap-1 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, rotate: 0 }}
            animate={hovered ? { y: 0, rotate: [0, 15, -15, 0] } : { y: 20 }}
            transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Leaf size={12} className="text-[#2FAE4E]" />
          </motion.div>
        ))}
      </div>
    </Link>
  )
}

/* ─── Arrow icon (Aardvark style) ─── */
/*
function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}
*/

/* ─── Mobile menu blob SVG ─── */
/*
function MenuBlobSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      fill="none"
      viewBox="0 0 386 712"
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 'auto', opacity: 0.12, pointerEvents: 'none' }}
    >
      <path
        fill="#F9A220"
        d="M115.415-56.646c27.361-10.951 55.489-16.17 84.985-10.076 40.714 8.42 64.637 33.98 75.035 73.257 9.349 35.348 3.777 70.616-.769 105.961-4.86 37.766-10.042 75.565-12.734 113.514-1.993 28.09 5.481 54.869 20.638 79.162 14.419 23.106 34.405 37.375 61.693 41.433 30.041 4.465 59.172-.835 88.412-6.653 26.135-5.192 52.289-10.684 78.69-13.939 22.265-2.747 44.838-1.383 65.775 8.431 38.064 17.842 51.287 57.852 44.901 96.147-5.782 34.664-24.948 61.621-49.555 85.474-26.279 25.482-57.556 44.224-87.22 65.142-28.385 20.025-55.476 41.366-73.798 71.673-9.327 15.437-16.063 31.796-14.646 50.393 2.044 26.803 18.243 46.689 45.101 55.529a130 130 0 0 0 4.836 1.485l-139.704 55.662a1143 1143 0 0 1-16.076-9.954c-23.207-14.664-45.445-30.911-63.44-51.988-21.556-25.244-32.204-53.705-17.969-85.831 6.78-15.297 16.202-30.236 27.474-42.541 21.248-23.189 45.199-43.868 67.023-66.553 10.99-11.421 21.425-24.013 29.233-37.716 15.33-26.925 5.653-54.263-21.962-68.343-17.177-8.762-35.531-13.481-54.297-17.195-27.909-5.514-56.046-10.232-83.497-17.516-15.707-4.173-31.138-11.277-45.104-19.692-22.108-13.327-29.728-34.941-28.254-60.155 1.445-24.649 11.284-46.711 20.765-68.939 5.78-13.545 11.193-27.25 16.537-40.967 1.371-3.514 2.093-7.336 2.693-11.083 3.859-24.009-7.353-38.23-31.777-36.443-20.635 1.512-40.986 6.805-61.477 10.321-25.248 4.332-50.38 9.871-75.818 12.53-15.074 1.576-29.77 1.044-44.109-1.173V63.588q.326-.19.651-.383c28.317-16.804 55.126-36.258 81.9-55.513 33.66-24.207 67.019-48.8 105.864-64.338"
      />
    </svg>
  )
}
*/

/* ─── Liquid Underline ─── */
function LiquidUnderline({ activeRect, containerRect }: { activeRect: DOMRect | null, containerRect: DOMRect | null }) {
  if (!activeRect || !containerRect) return null
  
  return (
    <motion.div
      layoutId="liquid-nav"
      className="absolute bg-[#2FAE4E]/15 rounded-full z-[-1]"
      initial={false}
      transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.8 }}
      style={{
        left: activeRect.left - containerRect.left - 12,
        top: activeRect.top - containerRect.top - 6,
        width: activeRect.width + 24,
        height: activeRect.height + 12,
      }}
    />
  )
}

/* ─── Navbar ─── */
export function Navbar() {
  const user = store.sessionUser()
  const { notifications, unreadCount, markAsRead, removeNotification } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const NAV_LINKS = [
    { to: '/tasks', label: 'Browse' },
    { to: '/post', label: 'Post Task' },
    { to: '/auth', label: 'FAQ' },
  ]

  const containerRect = navRef.current?.getBoundingClientRect() ?? null
  const activeLinkRect = hoveredLink !== null ? linkRefs.current[hoveredLink]?.getBoundingClientRect() ?? null : null

  return (
    <>
      <ScrollProgress />
      <header className="absolute top-0 left-0 right-0 z-50 pt-6 px-4 md:px-12 w-full max-w-[1400px] mx-auto pointer-events-none">
        <div className="flex items-center justify-between w-full pointer-events-auto">
          {/* Logo */}
          <Logo />

          {/* Centered nav links */}
          <nav ref={navRef} className="hidden md:flex items-center gap-10 relative px-4">
            <LiquidUnderline activeRect={activeLinkRect} containerRect={containerRect} />
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                ref={(el) => { linkRefs.current[i] = el }}
                onMouseEnter={() => { setHoveredLink(i); playHoverSound() }}
                onMouseLeave={() => setHoveredLink(null)}
                className="font-body font-bold text-[0.95rem] text-[#191919] hover:text-[#4AA861] transition-colors relative z-10"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Auth / Action */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="font-body font-semibold text-sm hover:text-[var(--color-grass)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]" onMouseEnter={playHoverSound}>
                  my tasks
                </Link>
                
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    onMouseEnter={playHoverSound}
                    className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg)] hover:bg-[var(--color-ink)] hover:text-[var(--color-fg-light)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]"
                    aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-rose)] text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute right-0 mt-2 w-80 bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1rem] shadow-brutal overflow-hidden z-50"
                      >
                        <div className="p-4 border-b-2 border-[var(--color-ink)] flex items-center justify-between">
                          <h3 className="font-display font-bold text-[var(--color-ink)]">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => {
                                notifications.filter(n => !n.read).forEach(n => markAsRead(n.id))
                              }}
                              className="font-body text-xs text-[var(--color-grass)] hover:underline"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-[var(--color-muted)] font-body">
                              No notifications yet
                            </div>
                          ) : (
                            <ul className="divide-y divide-[var(--color-border)]">
                              {notifications.map((n) => (
                                <li
                                  key={n.id}
                                  className={`p-4 transition-colors ${!n.read ? 'bg-[var(--color-warm-paper)]' : ''}`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.read ? 'bg-[var(--color-muted)]' : 'bg-[var(--color-grass)]'}`} />
                                    <div className="flex-1 min-w-0">
                                      <p className={`font-display text-sm ${n.read ? 'text-[var(--color-muted)]' : 'text-[var(--color-ink)] font-bold'}`}>
                                        {n.title}
                                      </p>
                                      <p className="font-body text-xs text-[var(--color-muted)] mt-1 line-clamp-2">{n.body}</p>
                                      <p className="font-body text-[10px] text-[var(--color-muted)] mt-2">
                                        {new Date(n.createdAt).toLocaleString()}
                                      </p>
                                      {n.actionUrl && n.actionLabel && (
                                        <button
                                          onClick={() => { navigate(n.actionUrl!); setNotifOpen(false) }}
                                          className="font-body text-xs text-[var(--color-grass)] hover:underline mt-2 inline-block"
                                        >
                                          {n.actionLabel}
                                        </button>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => { if (!n.read) markAsRead(n.id); removeNotification(n.id) }}
                                      className="text-[var(--color-muted)] hover:text-[var(--color-rose)] flex-shrink-0"
                                      aria-label="Dismiss"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Link to="/profile" className="w-9 h-9 rounded-full bg-[var(--color-ink)] text-[var(--color-fg-light)] flex items-center justify-center font-display font-bold text-sm" onMouseEnter={playHoverSound} aria-label={`View profile for ${user.name}`} tabIndex={0}>
                  {user.name.slice(0, 1).toUpperCase()}
                </Link>
                <button
                  onClick={() => { store.logout(); toast('Logged out', 'See you soon.'); navigate('/') }}
                  onMouseEnter={playHoverSound}
                  className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-fg)] hover:bg-[var(--color-ink)] hover:text-[var(--color-fg-light)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]"
                  aria-label="Log out"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <Link to="/auth" onMouseEnter={playHoverSound} className="px-6 py-2.5 rounded-[20px] border-[1.5px] border-[var(--color-ink)] font-body font-bold text-[0.9rem] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-fg-light)] transition-all shadow-[0_4px_0_var(--color-ink)] active:shadow-none active:translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]">
                Log in
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-[var(--color-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-grass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 500, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="md:hidden mt-4 bg-[#F8F8F8] rounded-[24px] shadow-2xl overflow-hidden border border-[#191919]/10 pointer-events-auto"
            >
              <nav className="flex flex-col p-6 gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="font-display font-bold text-xl text-[#191919]"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-[1px] bg-[#191919]/10 my-2" />
                {user ? (
                  <>
                    <Link to="/dashboard" className="font-display font-bold text-xl text-[#191919]">My Tasks</Link>
                    <Link to="/profile" className="font-display font-bold text-xl text-[#191919]">Profile</Link>
                    <button onClick={() => { store.logout(); navigate('/') }} className="font-display font-bold text-xl text-[#191919] text-left">Log out</button>
                  </>
                ) : (
                  <Link to="/auth" className="font-display font-bold text-xl text-[#4AA861]">Log in / Sign up</Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

function MenuIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  )
}


/* ─── Footer ─── */
export function Footer() {
  const [credits, setCredits] = useState(false)

  return (
    <footer style={{ background: '#0F0E0A', color: '#FFF9F0', position: 'relative', overflow: 'hidden' }}>
      {/* Blob background */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 386 712"
        fill="none"
        style={{ position: 'absolute', bottom: 0, right: '-10%', width: '55%', maxWidth: 460, opacity: 0.07, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <path fill="#F9A220" d="M115.415-56.646c27.361-10.951 55.489-16.17 84.985-10.076 40.714 8.42 64.637 33.98 75.035 73.257 9.349 35.348 3.777 70.616-.769 105.961-4.86 37.766-10.042 75.565-12.734 113.514-1.993 28.09 5.481 54.869 20.638 79.162 14.419 23.106 34.405 37.375 61.693 41.433 30.041 4.465 59.172-.835 88.412-6.653 26.135-5.192 52.289-10.684 78.69-13.939 22.265-2.747 44.838-1.383 65.775 8.431 38.064 17.842 51.287 57.852 44.901 96.147-5.782 34.664-24.948 61.621-49.555 85.474-26.279 25.482-57.556 44.224-87.22 65.142-28.385 20.025-55.476 41.366-73.798 71.673-9.327 15.437-16.063 31.796-14.646 50.393 2.044 26.803 18.243 46.689 45.101 55.529l4.836 1.485-139.704 55.662a1143 1143 0 0 1-16.076-9.954c-23.207-14.664-45.445-30.911-63.44-51.988-21.556-25.244-32.204-53.705-17.969-85.831 6.78-15.297 16.202-30.236 27.474-42.541 21.248-23.189 45.199-43.868 67.023-66.553 10.99-11.421 21.425-24.013 29.233-37.716 15.33-26.925 5.653-54.263-21.962-68.343-17.177-8.762-35.531-13.481-54.297-17.195-27.909-5.514-56.046-10.232-83.497-17.516-15.707-4.173-31.138-11.277-45.104-19.692-22.108-13.327-29.728-34.941-28.254-60.155 1.445-24.649 11.284-46.711 20.765-68.939 5.78-13.545 11.193-27.25 16.537-40.967 1.371-3.514 2.093-7.336 2.693-11.083 3.859-24.009-7.353-38.23-31.777-36.443-20.635 1.512-40.986 6.805-61.477 10.321-25.248 4.332-50.38 9.871-75.818 12.53-15.074 1.576-29.77 1.044-44.109-1.173V63.588q.326-.19.651-.383c28.317-16.804 55.126-36.258 81.9-55.513 33.66-24.207 67.019-48.8 105.864-64.338" />
      </svg>

      {/* Main grid */}
      <div
        style={{ maxWidth: 1400, margin: '0 auto', padding: '5rem 2rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', position: 'relative', zIndex: 1 }}
      >
        {/* Brand */}
        <div>
          <Logo dark />
          <p style={{ marginTop: '1.25rem', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', lineHeight: 1.65, color: 'rgba(255,249,240,0.45)', maxWidth: 260 }}>
            The soft, local, human errand that used to take forever is now done in minutes. Real people. Real city. Real simple.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            {['Instagram', 'Facebook', 'X'].map((s) => (
              <a
                key={s}
                href="#"
                style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,249,240,0.35)', transition: 'color 200ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,0.9)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,0.35)' }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {[
          {
            heading: 'Marketplace',
            links: [
              { label: 'Browse tasks', to: '/tasks' },
              { label: 'Post a task', to: '/post' },
              { label: 'Become a doer', to: '/auth' },
              { label: 'My tasks', to: '/dashboard' },
            ],
          },
          {
            heading: 'Navigate',
            links: [
              { label: 'Home', to: '/' },
              { label: 'Browse', to: '/tasks' },
              { label: 'Post a Task', to: '/post' },
              { label: 'Join Us', to: '/auth' },
            ],
          },
          {
            heading: 'Company',
            links: [
              { label: 'Trust & safety', to: '#' },
              { label: 'Commission', to: '#' },
              { label: 'Disputes', to: '#' },
              { label: 'Contact', to: '#' },
            ],
          },
        ].map((col) => (
          <div key={col.heading}>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F9A220', marginBottom: '1.25rem' }}>
              {col.heading}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: 'rgba(255,249,240,0.5)', transition: 'color 200ms' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,0.5)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,249,240,0.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', color: 'rgba(255,249,240,0.25)', fontSize: '0.75rem', fontFamily: '"DM Sans", sans-serif', position: 'relative', zIndex: 1 }}
      >
        <p>© 2026 Touchgrass — All Rights Reserved</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ transition: 'color 200ms' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,0.6)' }} onMouseLeave={(e) => { e.currentTarget.style.color = '' }}>Privacy Policy</a>
          <a href="#" style={{ transition: 'color 200ms' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,0.6)' }} onMouseLeave={(e) => { e.currentTarget.style.color = '' }}>Terms of Use</a>
          <button onClick={() => setCredits(!credits)} style={{ transition: 'color 200ms', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,249,240,0.6)' }} onMouseLeave={(e) => { e.currentTarget.style.color = '' }}>
            Credits
          </button>
        </div>
      </div>

      <AnimatePresence>
        {credits && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,249,240,0.06)', maxWidth: 1400, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}
          >
            <div style={{ padding: '1rem 0', fontSize: '0.75rem', fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,249,240,0.35)' }}>
              <span style={{ fontWeight: 600, color: 'rgba(255,249,240,0.5)' }}>credits — v1.0 </span>
              · design &amp; build: touchgrass team · stack: react 19 · inspired by aardvarkbookclub.com
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
