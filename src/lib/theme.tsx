/* ─── Theme system: 3 seasonal palettes with smooth color tween ───
 * Each theme is a flat map of CSS variable overrides. The ThemeProvider
 * writes them onto <html> as inline custom-property values, and `index.css`
 * adds a `transition: background-color, color, border-color 350ms ease`
 * to surfaces so the swap feels organic, not jumpy.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeKey = 'moss' | 'sunset' | 'studio'

export type Theme = {
  /** Display name for the toast / overlay */
  name: string
  /** Accent palette */
  canvas: string
  section: string
  grass: string
  gold: string
  fg: string
  muted: string
  fgLight: string
  /** Optional extra "ink" surface (for shadows, dark cards) */
  ink: string
  /** Cream / paper */
  cream: string
  /** Extended palette for UI components */
  coral: string
  periwinkle: string
  sage: string
  rose: string
  blush: string
  lavender: string
  peach: string
  charcoal: string
  warmPaper: string
  soft: string
  yellow: string
  orange: string
  pink: string
  lightGreen: string
  lightBlue: string
  green: string
  darkBlue: string
  cocoa: string
  border: string
}

export const themes: Record<ThemeKey, Theme> = {
  moss: {
    name: 'Moss',
    canvas:   '#151515',
    section:  '#F4F3EF',
    grass:    '#2FAE4E',
    gold:     '#D4AF37',
    fg:       '#151515',
    muted:    '#6B6B6B',
    fgLight:  '#F4F3EF',
    ink:      '#0F0E0A',
    cream:    '#FFF9F0',
    coral:    '#E87D4A',
    periwinkle: '#7B84F6',
    sage:     '#4CAD7D',
    rose:     '#E85D4A',
    blush:    '#F5C6C6',
    lavender: '#C6C6F5',
    peach:    '#F5D6C6',
    charcoal: '#17130F',
    warmPaper: '#FFF4E2',
    soft:     '#F9F2E8',
    yellow:   '#F9E84A',
    orange:   '#E87D4A',
    pink:     '#E85D4A',
    lightGreen: '#4CAD7D',
    lightBlue:  '#7B84F6',
    green:    '#4CAD7D',
    darkBlue: '#7B84F6',
    cocoa:    '#5D4E3D',
    border:   '#E8E2D4',
  },
  sunset: {
    name: 'Sunset',
    canvas:   '#1A0F0A',
    section:  '#FFE7D6',
    grass:    '#E8613A',
    gold:     '#FFB347',
    fg:       '#1A0F0A',
    muted:    '#7A5A4A',
    fgLight:  '#FFE7D6',
    ink:      '#0F0606',
    cream:    '#FFF1E2',
    coral:    '#E87D4A',
    periwinkle: '#A78BFA',
    sage:     '#86EFAC',
    rose:     '#F87171',
    blush:    '#FECACA',
    lavender: '#DDD6FE',
    peach:    '#FED7AA',
    charcoal: '#1C1917',
    warmPaper: '#FFF7ED',
    soft:     '#FFF1EB',
    yellow:   '#FDE047',
    orange:   '#FB923C',
    pink:     '#FB7185',
    lightGreen: '#86EFAC',
    lightBlue:  '#A78BFA',
    green:    '#86EFAC',
    darkBlue: '#A78BFA',
    cocoa:    '#78716C',
    border:   '#FDEFE1',
  },
  studio: {
    name: 'Studio',
    canvas:   '#0A0A0A',
    section:  '#EDEDED',
    grass:    '#2D5BFF',
    gold:     '#FFD93D',
    fg:       '#0A0A0A',
    muted:    '#5A5A5A',
    fgLight:  '#EDEDED',
    ink:      '#0A0A0A',
    cream:    '#FAFAFA',
    coral:    '#3B82F6',
    periwinkle: '#8B5CF6',
    sage:     '#22C55E',
    rose:     '#EF4444',
    blush:    '#FBCFE8',
    lavender: '#C4B5FD',
    peach:    '#FCD6BB',
    charcoal: '#050505',
    warmPaper: '#F5F5F5',
    soft:     '#EEEEEE',
    yellow:   '#FFD93D',
    orange:   '#F97316',
    pink:     '#EC4899',
    lightGreen: '#4ADE80',
    lightBlue:  '#60A5FA',
    green:    '#22C55E',
    darkBlue: '#3B82F6',
    cocoa:    '#525252',
    border:   '#E5E5E5',
  },
}

export const themeOrder: ThemeKey[] = ['moss', 'sunset', 'studio']

const STORAGE_KEY = 'touchgrass-theme'

/** Read the user's saved theme (or fall back to OS pref / default). */
function getInitialTheme(): ThemeKey {
  if (typeof window === 'undefined') return 'moss'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null
    if (saved && saved in themes) return saved
  } catch {
    /* localStorage may throw in private mode — fall through */
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'studio'
  return 'moss'
}

/** Apply a theme by writing CSS vars onto <html>. */
function applyTheme(theme: ThemeKey) {
  if (typeof document === 'undefined') return
  const t = themes[theme]
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.setProperty('--color-canvas', t.canvas)
  root.style.setProperty('--color-section-base', t.section)
  root.style.setProperty('--color-grass', t.grass)
  root.style.setProperty('--color-gold', t.gold)
  root.style.setProperty('--color-fg', t.fg)
  root.style.setProperty('--color-fg-muted', t.muted)
  root.style.setProperty('--color-fg-light', t.fgLight)
  root.style.setProperty('--color-ink', t.ink)
  root.style.setProperty('--color-cream', t.cream)
  root.style.setProperty('--color-coral', t.coral)
  root.style.setProperty('--color-periwinkle', t.periwinkle)
  root.style.setProperty('--color-sage', t.sage)
  root.style.setProperty('--color-rose', t.rose)
  root.style.setProperty('--color-blush', t.blush)
  root.style.setProperty('--color-lavender', t.lavender)
  root.style.setProperty('--color-peach', t.peach)
  root.style.setProperty('--color-charcoal', t.charcoal)
  root.style.setProperty('--color-warm-paper', t.warmPaper)
  root.style.setProperty('--color-soft', t.soft)
  root.style.setProperty('--color-yellow', t.yellow)
  root.style.setProperty('--color-orange', t.orange)
  root.style.setProperty('--color-pink', t.pink)
  root.style.setProperty('--color-light-green', t.lightGreen)
  root.style.setProperty('--color-light-blue', t.lightBlue)
  root.style.setProperty('--color-green', t.green)
  root.style.setProperty('--color-dark-blue', t.darkBlue)
  root.style.setProperty('--color-cocoa', t.cocoa)
  root.style.setProperty('--color-border', t.border)
}

type ThemeContextValue = {
  theme: ThemeKey
  setTheme: (k: ThemeKey) => void
  cycle: () => void
  next: ThemeKey
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(getInitialTheme)

  /* Apply on mount + on change. Run before paint to avoid FOUC. */
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((k: ThemeKey) => {
    setThemeState(k)
    try { window.localStorage.setItem(STORAGE_KEY, k) } catch { /* noop */ }
  }, [])

  const cycle = useCallback(() => {
    setThemeState((curr) => {
      const idx = themeOrder.indexOf(curr)
      const next = themeOrder[(idx + 1) % themeOrder.length]
      try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* noop */ }
      return next
    })
  }, [])

  const next = useMemo<ThemeKey>(
    () => themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length],
    [theme]
  )

  const contextValue = useMemo<ThemeContextValue>(() => ({ 
    theme, 
    setTheme, 
    cycle, 
    next 
  }), [theme, setTheme, cycle, next])
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
