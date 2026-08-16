import { useEffect, useRef, useState } from 'react'
import { useReduceMotion } from '../lib/reduceMotion.tsx'

export function useScrollObserver(options: IntersectionObserverInit = {}) {
  const { reduceMotion } = useReduceMotion()
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    if (reduceMotion) {
      setIsVisible(true)
      return
    }

    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(element)
      }
    }, {
      threshold: 0.1,
      rootMargin: '-50px',
      ...optionsRef.current,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [reduceMotion])

  return { ref: elementRef, isVisible }
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const { reduceMotion } = useReduceMotion()

  useEffect(() => {
    if (reduceMotion) return

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(scrollProgress)
      document.documentElement.style.setProperty('--scroll-y', `${scrollTop}px`)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion])

  return progress
}

export function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0)
  const { reduceMotion } = useReduceMotion()
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduceMotion || !elementRef.current) return

    const element = elementRef.current
    const onScroll = () => {
      const rect = element.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const distance = (elementCenter - viewportCenter) * speed
      setOffset(distance)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [speed, reduceMotion])

  return { ref: elementRef, offset }
}