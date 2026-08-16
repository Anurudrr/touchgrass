import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { prisma, fullDB, id, nowIso } from '../server/src/db.js'
import { seedDB } from '../server/src/seed.js'
import type { Role, Task, User } from '../src/lib/types.js'
import { COMMISSION_RATE } from '../src/lib/types.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const sendDB = (res: express.Response) => fullDB().then((db) => res.json(db))

app.get('/api/db', (_req, res) => sendDB(res))

app.post('/api/db/reset', async (_req, res) => {
  await seedDB()
  await sendDB(res)
})

app.post('/api/users/login', async (req, res) => {
  const body = req.body as { id?: string; phone: string; name?: string; email?: string; role?: Role; bio?: string; area?: string }
  if (!body.phone) return res.status(400).json({ error: 'phone required' })

  let user = await prisma.user.findUnique({ where: { phone: body.phone } })
  if (!user) {
    const role = body.role ?? 'poster'
    user = await prisma.user.create({
      data: {
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
      },
    })
  }
  res.json({ user, db: await fullDB() })
})

app.post('/api/users/:id/update', async (req, res) => {
  const { patch } = req.body as { patch: Partial<User> }
  if (!patch || typeof patch !== 'object') return res.status(400).json({ error: 'patch required' })
  await prisma.user.update({ where: { id: req.params.id }, data: patch })
  await sendDB(res)
})

app.post('/api/tasks', async (req, res) => {
  const { posterId, task } = req.body as { posterId: string; task: Omit<Task, 'posterId' | 'status' | 'createdAt'> }
  await prisma.task.create({
    data: { ...task, id: task.id ?? 't' + id(), posterId, status: 'open', createdAt: nowIso() },
  })
  await sendDB(res)
})

app.post('/api/tasks/:taskId/accept', async (req, res) => {
  const { doerId, assignmentId, paymentId } = req.body as { doerId: string; assignmentId?: string; paymentId?: string }
  const task = await prisma.task.findUnique({ where: { id: req.params.taskId } })
  if (!task) return res.status(404).json({ error: 'task not found' })
  if (task.status !== 'open') return res.json(await fullDB())

  const commission = Math.round(task.price * COMMISSION_RATE)
  await prisma.$transaction([
    prisma.task.update({ where: { id: task.id }, data: { status: 'accepted' } }),
    prisma.assignment.create({
      data: { id: assignmentId ?? 'a' + id(), taskId: task.id, doerId, acceptedAt: nowIso(), status: 'active' },
    }),
    prisma.payment.create({
      data: {
        id: paymentId ?? 'p' + id(),
        taskId: task.id,
        amount: task.price,
        commissionRate: COMMISSION_RATE,
        commission,
        doerNet: task.price - commission,
        status: 'held',
        razorpayOrderId: 'order_' + id().toUpperCase(),
      },
    }),
  ])
  await sendDB(res)
})

app.post('/api/tasks/:taskId/status', async (req, res) => {
  const { status } = req.body as { status: Task['status'] }
  const task = await prisma.task.findUnique({ where: { id: req.params.taskId } })
  if (!task) return res.status(404).json({ error: 'task not found' })

  const data: Partial<Task> = { status }
  if (status === 'completed' || status === 'paid') data.completedAt = nowIso()
  await prisma.task.update({ where: { id: task.id }, data })

  if (status === 'completed') {
    const assignment = await prisma.assignment.findUnique({ where: { taskId: task.id } })
    if (assignment) {
      await prisma.assignment.update({ where: { taskId: task.id }, data: { status: 'done', completedAt: nowIso() } })
      await prisma.user.update({ where: { id: assignment.doerId }, data: { tasksDone: { increment: 1 } } })
    }
  }
  if (status === 'paid') {
    await prisma.payment.update({ where: { taskId: task.id }, data: { status: 'released', releasedAt: nowIso() } })
  }
  await sendDB(res)
})

app.post('/api/tasks/:taskId/messages', async (req, res) => {
  const { senderId, content, messageId } = req.body as { senderId: string; content: string; messageId?: string }
  await prisma.message.create({
    data: { id: messageId ?? 'm' + id(), taskId: req.params.taskId, senderId, content, createdAt: nowIso() },
  })
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
  await prisma.review.create({
    data: { id: reviewId ?? 'r' + id(), taskId: req.params.taskId, reviewerId, revieweeId, rating, comment, createdAt: nowIso() },
  })
  const allReviews = await prisma.review.findMany({ where: { revieweeId } })
  const avg = Math.round((allReviews.reduce((s, x) => s + x.rating, 0) / allReviews.length) * 10) / 10
  await prisma.user.update({ where: { id: revieweeId }, data: { ratingAvg: avg, ratingCount: allReviews.length } })
  await sendDB(res)
})

// Only serve static files and SPA fallback in local development
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const distDir = path.resolve(process.cwd(), 'dist')
  app.use(express.static(distDir))
  app.get('/*splat', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'server error' })
})

const port = Number(process.env.PORT ?? 4000)

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`touchgrass → http://localhost:${port} (Supabase PostgreSQL)`)
  })
}

// Export for Vercel serverless functions
export default app