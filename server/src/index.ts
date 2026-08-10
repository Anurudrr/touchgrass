import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { connect, fullDB, id, nowIso, users, tasks, assignments, messages, reviews, payments } from './db'
import { seedMongo } from './seed'
import type { Role, Task, User } from '../../src/lib/types'
import { COMMISSION_RATE } from '../../src/lib/types'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const sendDB = (res: express.Response) => fullDB().then((db) => res.json(db))

app.get('/api/db', (_req, res) => sendDB(res))

app.post('/api/db/reset', async (_req, res) => {
  await seedMongo()
  await sendDB(res)
})

app.post('/api/users/login', async (req, res) => {
  const body = req.body as { id?: string; phone: string; name?: string; email?: string; role?: Role; bio?: string; area?: string }
  if (!body.phone) return res.status(400).json({ error: 'phone required' })
  const query = { phone: body.phone }
  const existing = await users().findOne(query)
  let user: User | null = existing
  if (!existing) {
    const role = body.role ?? ('poster' as const)
    user = {
      id: body.id ?? 'u' + id(),
      name: body.name ?? 'Grass Goer',
      phone: body.phone,
      email: body.email,
      role,
      idVerification: role === 'poster' ? 'verified' : 'none',
      ratingAvg: 0,
      ratingCount: 0,
      tasksDone: 0,
      bio: body.bio ?? '',
      area: body.area ?? 'Bengaluru',
      joinedAt: nowIso(),
      createdAt: nowIso(),
    }
    await users().insertOne(user)
  }
  res.json({ user, db: await fullDB() })
})

app.post('/api/users/:id/update', async (req, res) => {
  const { patch } = req.body as { patch: Partial<User> }
  if (!patch || typeof patch !== 'object') return res.status(400).json({ error: 'patch required' })
  await users().updateOne({ id: req.params.id }, { $set: patch })
  await sendDB(res)
})

app.post('/api/tasks', async (req, res) => {
  const { posterId, task } = req.body as { posterId: string; task: Omit<Task, 'posterId' | 'status' | 'createdAt'> }
  const doc: Task = { ...task, id: task.id ?? 't' + id(), posterId, status: 'open', createdAt: nowIso() }
  await tasks().insertOne(doc)
  await sendDB(res)
})

app.post('/api/tasks/:taskId/accept', async (req, res) => {
  const { doerId, assignmentId, paymentId } = req.body as { doerId: string; assignmentId?: string; paymentId?: string }
  const task = await tasks().findOne({ id: req.params.taskId })
  if (!task) return res.status(404).json({ error: 'task not found' })
  if (task.status !== 'open') return res.json(await fullDB())
  const commission = Math.round(task.price * COMMISSION_RATE)
  await Promise.all([
    tasks().updateOne({ id: task.id }, { $set: { status: 'accepted' } }),
    assignments().insertOne({ id: assignmentId ?? 'a' + id(), taskId: task.id, doerId, acceptedAt: nowIso(), status: 'active' }),
    payments().insertOne({
      id: paymentId ?? 'p' + id(),
      taskId: task.id,
      amount: task.price,
      commissionRate: COMMISSION_RATE,
      commission,
      doerNet: task.price - commission,
      status: 'held',
      razorpayOrderId: 'order_' + id().toUpperCase(),
    }),
  ])
  await sendDB(res)
})

app.post('/api/tasks/:taskId/status', async (req, res) => {
  const { status } = req.body as { status: Task['status'] }
  const task = await tasks().findOne({ id: req.params.taskId })
  if (!task) return res.status(404).json({ error: 'task not found' })
  const set: Partial<Task> = { status }
  if (status === 'completed' || status === 'paid') set.completedAt = nowIso()
  await tasks().updateOne({ id: task.id }, { $set: set })

  if (status === 'completed') {
    const a = await assignments().findOne({ taskId: task.id })
    if (a) {
      await assignments().updateOne({ taskId: task.id }, { $set: { status: 'done', completedAt: nowIso() } })
      await users().updateOne({ id: a.doerId }, { $inc: { tasksDone: 1 } })
    }
  }
  if (status === 'paid') {
    await payments().updateOne({ taskId: task.id }, { $set: { status: 'released', releasedAt: nowIso() } })
  }
  await sendDB(res)
})

app.post('/api/tasks/:taskId/messages', async (req, res) => {
  const { senderId, content, messageId } = req.body as { senderId: string; content: string; messageId?: string }
  const doc = { id: messageId ?? 'm' + id(), taskId: req.params.taskId, senderId, content, createdAt: nowIso() }
  await messages().insertOne(doc)
  await sendDB(res)
})

app.post('/api/tasks/:taskId/reviews', async (req, res) => {
  const { reviewerId, revieweeId, rating, comment, reviewId } = req.body as {
    reviewerId: string
    revieweeId: string
    rating: number
    comment: string
    reviewId?: string
  }
  await reviews().insertOne({ id: reviewId ?? 'r' + id(), taskId: req.params.taskId, reviewerId, revieweeId, rating, comment, createdAt: nowIso() })
  const all = await reviews().find({ revieweeId }).toArray()
  const avg = Math.round((all.reduce((s, x) => s + x.rating, 0) / all.length) * 10) / 10
  await users().updateOne({ id: revieweeId }, { $set: { ratingAvg: avg, ratingCount: all.length } })
  await sendDB(res)
})

const distDir = path.resolve(process.cwd(), 'dist')
app.use(express.static(distDir))
app.get('/*splat', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'server error' })
})

const port = Number(process.env.PORT ?? 4000)

await connect()
app.listen(port, () => {
  console.log(`touchgrass → http://localhost:${port} (MongoDB Atlas, dist: ${distDir})`)
})