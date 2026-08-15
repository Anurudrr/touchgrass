import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useDB } from '../lib/db'
import { useNotifications } from '../lib/notifications.tsx'
const SAVED_SEARCHES_KEY = 'touchgrass-saved-searches';


function SavedSearchModalContent({
  _showModal,
  setShowModal,
  newSearch,
  setNewSearch,
  savedSearches,
  setSavedSearches,
  addNotification,
}: any) {
  void _showModal;
  const saveSearch = () => {
    if (!newSearch.query.trim()) return
    
    const search = {
      ...newSearch,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    
    const updated = [search, ...savedSearches]
    setSavedSearches(updated)
    
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      /* noop */
    }
    
    setNewSearch({ query: '', category: '', radius: 0, maxPrice: 0, alertsEnabled: true })
    setShowModal(false)
    
    addNotification({
      title: 'Search saved!',
      body: `"${search.query}" will notify you of new matches.`,
      type: 'success',
      actionUrl: '/tasks',
      actionLabel: 'View tasks',
    })
  }

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id)
    setSavedSearches(updated)
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      /* noop */
    }
  }

  void saveSearch; void deleteSearch;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-ink)]/80 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md bg-[var(--color-cream)] rounded-[1.5rem] border-2 border-[var(--color-ink)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">Save Search</h2>
            <button
              onClick={() => setShowModal(false)}
              className="w-10 h-10 rounded-full bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-body font-semibold text-sm text-[var(--color-ink)] mb-2">
                Search query
              </label>
              <input
                type="text"
                value={newSearch.query}
                onChange={(e) => setNewSearch(prev => ({ ...prev, query: e.target.value }))}
                placeholder="e.g. printing, delivery, cleaning..."
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:ring-4 focus:ring-[var(--color-sage)]/60 transition-shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body font-semibold text-sm text-[var(--color-ink)] mb-2">
                  Category
                </label>
                <select
                  value={newSearch.category}
                  onChange={(e) => setNewSearch(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:ring-4 focus:ring-[var(--color-sage)]/60 transition-shadow"
                >
                  <option value="">All categories</option>
                  <option value="Printing & Documents">Printing & Documents</option>
                  <option value="Parcel Pickup/Delivery">Parcel Pickup/Delivery</option>
                  <option value="Minor Repairs & Handyman">Minor Repairs & Handyman</option>
                  <option value="Tutoring & Assignment Help">Tutoring & Assignment Help</option>
                  <option value="Event & Setup Help">Event & Setup Help</option>
                  <option value="General Errands">General Errands</option>
                  <option value="Elderly Assistance">Elderly Assistance</option>
                  <option value="Document Help (Online)">Document Help (Online)</option>
                </select>
              </div>
              <div>
                <label className="block font-body font-semibold text-sm text-[var(--color-ink)] mb-2">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={newSearch.maxPrice}
                  onChange={(e) => setNewSearch(prev => ({ ...prev, maxPrice: parseInt(e.target.value) || 0 }))}
                  placeholder="Any"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:ring-4 focus:ring-[var(--color-sage)]/60 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold text-sm text-[var(--color-ink)] mb-2">
                Radius (km)
              </label>
              <select
                value={newSearch.radius}
                onChange={(e) => setNewSearch(prev => ({ ...prev, radius: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-cream)] text-[var(--color-ink)] font-body text-sm placeholder:text-[var(--color-muted)]/70 focus:outline-none focus:ring-4 focus:ring-[var(--color-sage)]/60 transition-shadow"
              >
                <option value={0}>Any distance</option>
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newSearch.alertsEnabled}
                onChange={(e) => setNewSearch(prev => ({ ...prev, alertsEnabled: e.target.checked }))}
                className="w-5 h-5 rounded border-2 border-[var(--color-ink)] text-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-grass)]"
              />
              <span className="font-body text-sm text-[var(--color-ink)]">
                Get notifications when new tasks match
              </span>
            </label>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl font-body font-semibold text-sm bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveSearch}
                className="flex-1 px-4 py-2.5 rounded-xl font-body font-semibold text-sm bg-[var(--color-ink)] text-[var(--color-cream)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-charcoal)] hover:border-[var(--color-charcoal)] transition-all"
              >
                Save & Alert
              </button>
            </div>
          </div>

          {/* Saved searches list */}
          {savedSearches.length > 0 && (
            <div className="mt-8 border-t-2 border-[var(--color-ink)] pt-6">
              <h3 className="font-display text-lg font-bold text-[var(--color-ink)] mb-4">Your Saved Searches</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {savedSearches.map(search => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-[var(--color-ink)] truncate">{search.query}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {search.category && (
                          <span className="text-[10px] font-body font-bold uppercase text-[var(--color-muted)] bg-[var(--color-cream)] px-2 py-0.5 rounded">
                            {search.category}
                          </span>
                        )}
                        {search.maxPrice && (
                          <span className="text-[10px] font-body font-bold uppercase text-[var(--color-muted)] bg-[var(--color-cream)] px-2 py-0.5 rounded">
                            ≤₹{search.maxPrice}
                          </span>
                        )}
                        {search.radius && (
                          <span className="text-[10px] font-body font-bold uppercase text-[var(--color-muted)] bg-[var(--color-cream)] px-2 py-0.5 rounded">
                            {search.radius}km
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={search.alertsEnabled}
                          onChange={() => {
                            setSavedSearches(prev => prev.map(s => 
                              s.id === search.id ? { ...s, alertsEnabled: !s.alertsEnabled } : s
                            ))
                            try {
                              localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(
                                savedSearches.map(s => s.id === search.id ? { ...s, alertsEnabled: !s.alertsEnabled } : s)
                              ))
                            } catch {
                              /* noop */
                            }
                          }}
                          className="w-4 h-4 rounded border-2 border-[var(--color-ink)] text-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-grass)]"
                        />
                        <svg className="size-4 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.035-.586 1.421L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </label>
                      <button
                        onClick={() => {
                          setSavedSearches(prev => prev.filter(s => s.id !== search.id))
                          try {
                            localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(
                              savedSearches.filter(s => s.id !== search.id)
                            ))
                          } catch {
                            /* noop */
                          }
                        }}
                        className="p-2 text-[var(--color-muted)] hover:text-[var(--color-rose)] transition-colors"
                        aria-label="Delete search"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}


export function SavedSearchManager() {
  const { addNotification } = useNotifications()
  const db = useDB()
  const [showModal, setShowModal] = useState(false)
  const [savedSearches, setSavedSearches] = useState<Array<{
    id: string
    query: string
    category?: string
    radius?: number
    maxPrice?: number
    alertsEnabled: boolean
    createdAt: string
  }>>([])
  const [newSearch, setNewSearch] = useState({
    query: '',
    category: '',
    radius: 0,
    maxPrice: 0,
    alertsEnabled: true,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_SEARCHES_KEY)
      if (stored) {
        setSavedSearches(JSON.parse(stored))
      }
    } catch {
      /* noop */
    }
  }, [])

  const saveSearch = () => {
    if (!newSearch.query.trim()) return
    
    const search = {
      ...newSearch,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    
    const updated = [search, ...savedSearches]
    setSavedSearches(updated)
    
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      /* noop */
    }
    
    setNewSearch({ query: '', category: '', radius: 0, maxPrice: 0, alertsEnabled: true })
    setShowModal(false)
    
    addNotification({
      title: 'Search saved!',
      body: `"${search.query}" will notify you of new matches.`,
      type: 'success',
      actionUrl: '/tasks',
      actionLabel: 'View tasks',
    })
  }

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id)
    setSavedSearches(updated)
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      /* noop */
    }
  }

  const toggleAlerts = (id: string) => {
    const updated = savedSearches.map(s => 
      s.id === id ? { ...s, alertsEnabled: !s.alertsEnabled } : s
    )
    setSavedSearches(updated)
    try {
      localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated))
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    if (savedSearches.length === 0) return
    
    const checkMatches = () => {
      savedSearches.forEach(search => {
        if (!search.alertsEnabled) return
        
        const matches = db.tasks.filter(task => {
          if (task.status !== 'open' && task.status !== 'accepted') return false
          if (search.query && !task.title.toLowerCase().includes(search.query.toLowerCase()) && 
              !task.description.toLowerCase().includes(search.query.toLowerCase())) return false
          if (search.category && task.category !== search.category) return false
          if (search.maxPrice && task.price > search.maxPrice) return false
          return true
        })
        
        if (matches.length > 0) {
          const notifiedKey = `notified-${search.id}`
          const lastNotified = localStorage.getItem(notifiedKey)
          const newMatches = matches.filter(m => 
            !lastNotified || new Date(m.createdAt) > new Date(lastNotified)
          )
          
          if (newMatches.length > 0) {
            addNotification({
              title: 'New tasks match your search!',
              body: `${newMatches.length} new task${newMatches.length > 1 ? 's' : ''} for "${search.query}"`,
              type: 'info',
              actionUrl: '/tasks',
              actionLabel: 'View matches',
            })
            localStorage.setItem(notifiedKey, new Date().toISOString())
          }
        }
      })
    }
    
    checkMatches()
    const interval = setInterval(checkMatches, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [savedSearches, db.tasks, addNotification])

  void saveSearch; void deleteSearch; void toggleAlerts;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-body font-semibold text-sm bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-all"
      >
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Save Search
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-ink)]/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <SavedSearchModalContent
              showModal={showModal}
              setShowModal={setShowModal}
              newSearch={newSearch}
              setNewSearch={setNewSearch}
              savedSearches={savedSearches}
              setSavedSearches={setSavedSearches}
              addNotification={addNotification}
              db={db}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
