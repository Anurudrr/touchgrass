import { useRef, useState, useCallback } from 'react'

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number
  maxPull?: number
}

export function usePullToRefresh({ onRefresh, threshold = 80, maxPull = 120 }: PullToRefreshOptions) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef<number | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return
    const scrollTop = elementRef.current?.scrollTop ?? 0
    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [isRefreshing])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || startY.current === null || isRefreshing) return
    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)
    const cappedDistance = Math.min(distance, maxPull)
    setPullDistance(cappedDistance)
    
    if (distance > 0) {
      e.preventDefault()
    }
  }, [isPulling, isRefreshing, maxPull])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || isRefreshing) return
    
    setIsPulling(false)
    startY.current = null
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      setPullDistance(0)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    } else {
      setPullDistance(0)
    }
  }, [isPulling, isRefreshing, pullDistance, threshold, onRefresh])

  return {
    ref: elementRef,
    isPulling,
    pullDistance,
    isRefreshing,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    progress: Math.min(pullDistance / threshold, 1),
  }
}

export function PullToRefreshIndicator({ 
  progress, 
  isRefreshing 
}: { 
  progress: number
  isRefreshing: boolean
}) {
  const rotate = progress * 180
  
  return (
    <div className="flex items-center justify-center py-4 px-4">
      <div className="relative w-8 h-8">
        <div 
          className="w-8 h-8 rounded-full border-3 border-current border-t-transparent animate-spin transition-transform duration-200"
          style={{ transform: 'rotate(' + rotate + 'deg)' }}
        />
        {!isRefreshing && progress > 0 && (
          <div 
            className="absolute inset-0 w-8 h-8 rounded-full border-3 border-transparent border-t-current transition-opacity duration-300"
            style={{ opacity: progress }}
          />
        )}
      </div>
      <span className="ml-3 text-xs font-body font-semibold text-[var(--color-muted)]">
        {isRefreshing ? 'Refreshing...' : progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
      </span>
    </div>
  )
}