import 'dotenv/config'
import { MongoClient, type Db, type Collection } from 'mongodb'
import type { Assignment, Message, Payment, Review, Task, User } from '../../src/lib/types'

let client: MongoClient | null = null
let db: Db | null = null

export const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/touchgrass'
export const MONGODB_DB = process.env.MONGODB_DB ?? 'touchgrass'

export async function connect(): Promise<Db> {
  if (db) return db
  let lastErr: unknown
  for (let attempt = 1; attempt <= 8; attempt++) {
    const c = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    })
    try {
      await c.connect()
      client = c
      db = c.db(MONGODB_DB)
      await ensureIndexes(db)
      return db
    } catch (err) {
      lastErr = err
      console.warn(`mongodb connect attempt ${attempt}/8 failed: ${(err as Error).message.slice(0, 120)}`)
      await c.close().catch(() => {})
      await new Promise((r) => setTimeout(r, 5000 * attempt))
    }
  }
  throw lastErr
}

async function ensureIndexes(d: Db) {
  await d.collection('users').createIndex({ phone: 1 }, { unique: true, background: true }).catch(() => {})
  await d.collection('tasks').createIndex({ status: 1 }).catch(() => {})
  await d.collection('messages').createIndex({ taskId: 1 }).catch(() => {})
}

export async function close() {
  await client?.close()
  client = null
  db = null
}

export const users = (): Collection<User> => db!.collection<User>('users')
export const tasks = (): Collection<Task> => db!.collection<Task>('tasks')
export const assignments = (): Collection<Assignment> => db!.collection<Assignment>('assignments')
export const messages = (): Collection<Message> => db!.collection<Message>('messages')
export const reviews = (): Collection<Review> => db!.collection<Review>('reviews')
export const payments = (): Collection<Payment> => db!.collection<Payment>('payments')

export async function fullDB() {
  const [u, t, a, m, r, p] = await Promise.all([
    users().find().toArray(),
    tasks().find().toArray(),
    assignments().find().toArray(),
    messages().find().toArray(),
    reviews().find().toArray(),
    payments().find().toArray(),
  ])
  return { users: u, tasks: t, assignments: a, messages: m, reviews: r, payments: p }
}

export const id = () => Math.random().toString(36).slice(2, 10)
export const nowIso = () => new Date().toISOString()
