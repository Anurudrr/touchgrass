import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'touchgrass-reduce-motion'

function getInitialReduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return saved === 'true'
  } catch {
    /* localStorage may throw in private mode */
  }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

type ReduceMotionContextValue = {
  reduceMotion: boolean
  setReduceMotion: (value: boolean) => void
  toggle: () => void
}

const ReduceMotionContext = createContext<ReduceMotionContextValue | null>(null)

export function ReduceMotionProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotionState] = useState<boolean>(getInitialReduceMotion)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved === null) {
          setReduceMotionState(e.matches)
        }
      } catch {
        /* noop */
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value))
    } catch {
      /* noop */
    }
  }, [])

  const toggle = useCallback(() => {
    setReduceMotionState((prev) => !prev)
  }, [setReduceMotion])

  const contextValue = { reduceMotion, setReduceMotion, toggle }

  return (
    <ReduceMotionContext.Provider value={contextValue}>
      {children}
    </ReduceMotionContext.Provider>
  )
}

export function useReduceMotion() {
  const ctx = useContext(ReduceMotionContext)
  if (!ctx) throw new Error('useReduceMotion must be used inside <ReduceMotionProvider>')
  return ctx
}