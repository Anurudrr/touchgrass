import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, MapPin } from 'lucide-react'
import { useDB } from '../lib/db'
import { inputCls } from './ui'

const RECENT_SEARCHES_KEY = 'touchgrass-recent-searches'
const MAX_RECENT = 5

const POPULAR_SEARCHES = [
  'printing', 'parcel delivery', 'cleaning', 'assembly', 'tutoring',
  'grocery pickup', 'handyman', 'event help', 'elderly assistance',
]

export function SearchAutocomplete({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = 'Search tasks, keywords, area...',
  className = ''
}: { 
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const db = useDB()

  // Get recent searches from localStorage
  const getRecentSearches = useCallback(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  // Save recent search
  const saveRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return
    const recent = getRecentSearches()
    const filtered = recent.filter((s: string) => s.toLowerCase() !== search.toLowerCase())
    const updated = [search.trim(), ...filtered].slice(0, MAX_RECENT)
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      /* noop */
    }
  }, [getRecentSearches])

  // Get task-based suggestions from actual task titles
  const getTaskSuggestions = useCallback((query: string) => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const tasks = db.tasks
    const suggestions = new Set<string>()
    
    tasks.forEach((task) => {
      const title = task.title.toLowerCase()
      const desc = task.description.toLowerCase()
      const location = task.location.toLowerCase()
      
      if (title.includes(q) || desc.includes(q) || location.includes(q)) {
        // Extract relevant keywords
        const words = [...title.split(' '), ...desc.split(' '), ...location.split(' ')]
          .filter(w => w.length > 3 && w.toLowerCase().includes(q))
          .slice(0, 3)
        words.forEach(w => suggestions.add(w.charAt(0).toUpperCase() + w.slice(1)))
      }
    })
    
    return Array.from(suggestions).slice(0, 5)
  }, [db.tasks])

  // Handle input focus
  const handleFocus = () => {
    setShowSuggestions(true)
    setHighlightedIndex(-1)
  }

  // Handle input blur (with delay to allow click on suggestions)
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200)
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setHighlightedIndex(-1)
    setShowSuggestions(true)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const suggestions = getSuggestions()
    const maxIndex = suggestions.length - 1

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => Math.min(prev + 1, maxIndex))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          selectSuggestion(suggestions[highlightedIndex])
        } else if (value.trim()) {
          onSubmit(value.trim())
          saveRecentSearch(value.trim())
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        inputRef.current?.blur()
        break
    }
  }

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion)
    onSubmit(suggestion)
    saveRecentSearch(suggestion)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  const getSuggestions = () => {
    if (!value.trim()) {
      // Show popular + recent when empty
      const recent = getRecentSearches()
      return [...POPULAR_SEARCHES, ...recent].slice(0, 8)
    }
    return getTaskSuggestions(value)
  }

  const suggestions = getSuggestions()

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[var(--color-muted)]" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${inputCls} pl-11 pr-11 text-sm`}
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions && suggestions.length > 0}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            id="search-suggestions"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1rem] shadow-brutal overflow-hidden z-50"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 text-left font-body text-sm transition-colors flex items-center gap-3 ${
                  index === highlightedIndex 
                    ? 'bg-[var(--color-warm-paper)]' 
                    : 'hover:bg-[var(--color-warm-paper)]'
                }`}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                {suggestion.startsWith('@') || suggestion.includes(' ') ? (
                  <MapPin className="size-4 text-[var(--color-muted)] flex-shrink-0" />
                ) : (
                  <TrendingUp className="size-4 text-[var(--color-muted)] flex-shrink-0" />
                )}
                <span className="flex-1 text-[var(--color-ink)]">{suggestion}</span>
                {index === highlightedIndex && (
                  <span className="text-[var(--color-grass)] font-bold">→</span>
                )}
              </button>
            ))}
            {suggestions.length > 0 && (
              <div className="border-t-2 border-[var(--color-ink)] p-3">
                <button
                  onClick={() => {
                    if (value.trim()) {
                      onSubmit(value.trim())
                      saveRecentSearch(value.trim())
                    }
                    setShowSuggestions(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-body font-semibold text-[var(--color-grass)] hover:text-[var(--color-ink)]"
                >
                  <Search className="size-4" />
                  Search for "{value}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}