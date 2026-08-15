import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useSpring } from 'framer-motion'

interface MagneticProps {
  children: React.ReactElement
  strength?: number
  className?: string
}

export default function Magnetic({ children, strength = 0.5, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    // Distance from center
    const x = (clientX - centerX) * strength
    const y = (clientY - centerY) * strength
    
    setPosition({ x, y })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  const springConfig = useMemo(() => ({ stiffness: 150, damping: 15, mass: 0.1 }), [])
  const x = useSpring(position.x, springConfig)
  const y = useSpring(position.y, springConfig)

  // Sync springs with position state
  useMemo(() => {
    x.set(position.x)
    y.set(position.y)
  }, [position, x, y])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
