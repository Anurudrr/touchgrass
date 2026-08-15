/* ─── ThemeSwitcher ───
 * Floating bottom-left pill that cycles the 3 seasonal palettes.
 * Auto-hides on touch devices, respects reduced motion, and pulses
 * briefly when the theme changes to confirm the swap.
 */

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Palette, Accessibility } from 'lucide-react'
import { useTheme, themes, themeOrder } from '../lib/theme.tsx'
import { useReduceMotion } from '../lib/reduceMotion.tsx'
import { playClickSound, playHoverSound } from '../lib/audio'
import { toast } from './ui'

export function ThemeSwitcher() {
  const { theme, cycle, next } = useTheme()
  const { reduceMotion, toggle } = useReduceMotion()
  const [touch, setTouch] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia?.('(pointer: coarse)').matches ?? false)
  }, [])

  const onClick = () => {
    playClickSound()
    cycle()
    const nextName = themes[next].name
    toast(`Theme · ${nextName}`, 'seasonal palette swapped', 'success')
    setPulse(true)
    window.setTimeout(() => setPulse(false), 700)
  }

  if (touch) return null

  return (
    <div className="fixed bottom-5 left-5 z-[90] flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence>
        {pulse && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto rounded-full bg-ink/90 backdrop-blur px-3 py-1.5 text-cream text-xs font-display font-bold uppercase tracking-widest shadow-lg"
          >
            {themes[theme].name} <span className="opacity-50">·</span> {themes[next].name}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        <motion.button
          onClick={onClick}
          onMouseEnter={playHoverSound}
          whileHover={reduceMotion ? undefined : { y: -2, rotate: -4 }}
          whileTap={reduceMotion ? undefined : { scale: 0.9, rotate: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          aria-label={`Cycle theme (current: ${themes[theme].name})`}
          title={`Theme: ${themes[theme].name} — click to cycle`}
          className="pointer-events-auto group flex items-center gap-2 rounded-full border-2 border-ink/80 bg-cream/95 backdrop-blur shadow-brutal px-3 py-2 font-display font-bold text-ink"
        >
          <span className="grid grid-cols-3 gap-1">
            {themeOrder.map((k) => (
              <span
                key={k}
                className="size-2.5 rounded-full border border-ink/40 transition-transform"
                style={{
                  background: themes[k].grass,
                  transform: k === theme ? 'scale(1.35)' : 'scale(1)',
                  boxShadow: k === theme ? `0 0 0 2px ${themes[k].gold}` : 'none',
                }}
              />
            ))}
          </span>
          <Palette className="size-3.5 text-ink/60 group-hover:text-ink transition-colors" />
          <span className="text-[10px] uppercase tracking-widest opacity-70">{themes[theme].name}</span>
        </motion.button>

        <motion.button
          onClick={toggle}
          onMouseEnter={playHoverSound}
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          aria-label={reduceMotion ? 'Enable animations' : 'Reduce motion'}
          title={reduceMotion ? 'Enable animations' : 'Reduce motion (disables non-essential animations)'}
          className="pointer-events-auto group flex items-center gap-2 rounded-full border-2 border-ink/80 bg-cream/95 backdrop-blur shadow-brutal px-3 py-2 font-display font-bold text-ink"
        >
          <Accessibility className="size-3.5 text-ink/60 group-hover:text-ink transition-colors" />
          <span className="text-[10px] uppercase tracking-widest opacity-70">
            {reduceMotion ? 'Motion On' : 'Motion Off'}
          </span>
        </motion.button>
      </div>
    </div>
  )
}
