import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ─── Cursor: uses useMotionValue (zero re-renders on mousemove) ─── */
export default function Cursor() {
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)
  const scale = useMotionValue(1)

  const x = useSpring(rawX, { stiffness: 500, damping: 28, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 500, damping: 28, mass: 0.5 })
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX - 16)
      rawY.set(e.clientY - 16)
    }
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const interactive =
        el.tagName === 'BUTTON' ||
        el.tagName === 'A' ||
        el.tagName === 'INPUT' ||
        el.tagName === 'TEXTAREA' ||
        el.tagName === 'SELECT' ||
        !!el.closest('button') ||
        !!el.closest('a')
      scale.set(interactive ? 2.2 : 1)
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [rawX, rawY, scale])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-[#F9E84A] hidden sm:block"
      style={{ x, y, scale: springScale }}
    />
  )
}
