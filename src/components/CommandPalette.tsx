import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Search, Command, X, KeyK, ArrowRight, Home, FolderOpen, User, Settings, Plus, List, MapPin, Bell } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { store } from '../lib/db'
import { toast } from './ui'
import { playHoverSound, playClickSound } from '../lib/audio'
import { useReduceMotion } from '../lib/reduceMotion.tsx'

const COMMANDS = [
  { id: 'home', label: 'Go Home', description: 'Return to landing page', icon: Home, action: () => navigate('/'), shortcut: 'G H' },
  { id: 'browse', label: 'Browse Tasks', description: 'View all available tasks', icon: List, action: () => navigate('/tasks'), shortcut: 'G T' },
  { id: 'post', label: 'Post a Task', description: 'Create a new task', icon: Plus, action: () => navigate('/post'), shortcut: 'G P' },
  { id: 'dashboard', label: 'My Dashboard', description: 'View your tasks and stats', icon: FolderOpen, action: () => navigate('/dashboard'), shortcut: 'G D' },
  { id: 'profile', label: 'My Profile', description: 'View and edit your profile', icon: User, action: () => navigate('/profile'), shortcut: 'G U' },
  { id: 'search', label: 'Search Tasks', description: 'Find tasks by keyword', icon: Search, action: () => navigate('/tasks'), shortcut: '⌘ K' },
  { id: 'notifications', label: 'Notifications', description: 'View your notifications', icon: Bell, action: () => navigate('/dashboard'), shortcut: 'G N' },
]

export function CommandPalette() {
  const { reduceMotion } = useReduceMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const user = store.sessionUser()

  const filteredCommands = COMMANDS.filter(cmd => {
    if (!user && ['dashboard', 'profile', 'notifications'].includes(cmd.id)) return false
    const q = query.toLowerCase()
    return cmd.label.toLowerCase().includes(q) || 
           cmd.description.toLowerCase().includes(q) ||
           cmd.shortcut.toLowerCase().includes(q)
  })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setQuery('')
        setSelectedIndex(0)
        playClickSound()
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        playHoverSound()
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
        playHoverSound()
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          setIsOpen(false)
          setQuery('')
          setSelectedIndex(0)
          playClickSound()
        }
        break
      case 'Tab':
        e.preventDefault()
        break
    }
  }, [isOpen, filteredCommands, selectedIndex])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const modifier = isMac ? e.metaKey : e.ctrlKey
      
      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setQuery('')
        setSelectedIndex(0)
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
        setSelectedIndex(0)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen && typeof document !== 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="fixed inset-0 z-[999] bg-[var(--color-ink)]/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setQuery(''); setSelectedIndex(0); }}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[1000] w-full max-w-2xl pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-[1.5rem] shadow-[12px_12px_0_rgba(15,14,10,0.95)] overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b-2 border-[var(--color-ink)] bg-[var(--color-warm-paper)]">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search..."
                    className="w-full pl-12 pr-12 py-3 bg-[var(--color-cream)] border-2 border-[var(--color-ink)] rounded-xl font-body text-[var(--color-ink)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-grass)]"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {query && (
                    <button
                      onClick={() => { setQuery(''); setSelectedIndex(0); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-rose)] transition-colors"
                      aria-label="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                <kbd className="px-3 py-1.5 bg-[var(--color-ink)] text-[var(--color-cream)] rounded-lg font-body text-xs font-bold border-2 border-[var(--color-ink)]">
                  <Command size={12} /> K
                </kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-[var(--color-muted)] font-body">
                    No commands found
                  </div>
                ) : (
                  <ul role="listbox" aria-label="Commands">
                    {filteredCommands.map((cmd, i) => (
                      <li key={cmd.id} role="option" aria-selected={i === selectedIndex}>
                        <button
                          onClick={() => { cmd.action(); setIsOpen(false); setQuery(''); setSelectedIndex(0); playClickSound(); }}
                          onMouseEnter={() => { setSelectedIndex(i); playHoverSound(); }}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-body text-left transition-all ${
                            i === selectedIndex 
                              ? 'bg-[var(--color-warm-paper)] shadow-[3px_4px_0_rgba(15,14,10,0.9)]' 
                              : 'hover:bg-[var(--color-soft)]'
                          }`}
                          style={{ border: i === selectedIndex ? '2px solid var(--color-ink)' : '2px solid transparent' }}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[var(--color-ink)]">
                            <cmd.icon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[var(--color-ink)] truncate">{cmd.label}</p>
                            <p className="text-xs text-[var(--color-muted)] truncate">{cmd.description}</p>
                          </div>
                          <kbd className="px-2 py-1 bg-[var(--color-ink)] text-[var(--color-cream)] rounded font-body text-[10px] font-bold border border-[var(--color-ink)] opacity-60">
                            {cmd.shortcut}
                          </kbd>
                          <ArrowRight className="text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t-2 border-[var(--color-ink)] p-4 bg-[var(--color-warm-paper)]">
                <p className="font-body text-xs text-[var(--color-muted)] text-center">
                  Press <kbd className="px-1.5 py-0.5 bg-[var(--color-ink)] text-[var(--color-cream)] rounded font-bold border border-[var(--color-ink)]">Esc</kbd> to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}