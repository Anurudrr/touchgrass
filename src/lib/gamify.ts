import type { Task } from './types'

export const LEVELS = [
  { lvl: 1, name: 'seedling', emoji: '\u{1F331}', min: 0 },
  { lvl: 2, name: 'sprout', emoji: '\u{1F34A}', min: 120 },
  { lvl: 3, name: 'growing', emoji: '\u{1FAB4}', min: 280 },
  { lvl: 4, name: 'grassy', emoji: '\u{1F754}', min: 520 },
  { lvl: 5, name: 'lawn legend', emoji: '\u{1F331}\u{2728}', min: 900 },
  { lvl: 6, name: 'grass boss', emoji: '\u{1F3AF}', min: 1500 },
]

export function xpFor(tasksDone: number, ratingCount: number, verified: boolean) {
  return tasksDone * 40 + ratingCount * 5 + (verified ? 20 : 0)
}

export function levelFor(xp: number) {
  let cur = LEVELS[0]
  for (const l of LEVELS) if (xp >= l.min) cur = l
  const next = LEVELS.find((l) => l.min > xp)
  const nextMin = next?.min ?? cur.min
  const prevMin = cur.min
  return {
    level: cur,
    nextMin,
    pct: next ? Math.min(100, Math.round(((xp - prevMin) / (nextMin - prevMin)) * 100)) : 100,
    xpNeeded: next ? nextMin - xp : 0,
  }
}

export function grassStreak(tasks: Task[]): number {
  const done = tasks
    .filter((t) => (t.status === 'completed' || t.status === 'paid') && t.completedAt)
    .map((t) => new Date(t.completedAt as string).toDateString())
  const set = new Set(done)
  let streak = 0
  const cursor = new Date()
  if (!set.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1)
  while (set.has(cursor.toDateString())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export const LEVEL_HINTS = [
  'watering the grass works',
  'every task = virtual photosynthesis',
  'streaks grow. lazy streaks shrink.',
]