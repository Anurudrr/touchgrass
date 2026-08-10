import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, ImagePlus } from 'lucide-react'
import { BrutButton, Field, Select, inputCls, toast } from '../components/ui'
import { store } from '../lib/db'
import { CATEGORIES } from '../lib/types'
import { categoryIcon } from '../components/icons'
import { timeLeft } from '../lib/utils'

export default function PostTask() {
  const navigate = useNavigate()
  const user = store.sessionUser()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState<string>('Printing & Documents')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [hours, setHours] = useState('24')
  const [urgent, setUrgent] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const previewDeadline = useMemo(() => new Date(Date.now() + Number(hours) * 3600000).toISOString(), [hours])

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-16 text-center">
        <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-10">
          <p className="font-display text-3xl">Log in first</p>
          <p className="mt-3 text-neutral-600 font-body font-semibold">You need an account to post tasks. Takes 60 seconds.</p>
          <Link to="/auth">
            <BrutButton className="mt-6 w-full" pulse>
              Log in / Sign up <ArrowRight className="size-4 inline ml-2" />
            </BrutButton>
          </Link>
        </div>
      </div>
    )
  }

  const submit = () => {
    if (title.trim().length < 8) return toast('Title too short 😅', 'Give doers a clear idea — 8 chars min', 'error')
    if (desc.trim().length < 20) return toast('Add more detail', 'What, where, when — be specific (20+)', 'error')
    const p = Number(price)
    if (!p || p < 20) return toast('Set a fair price', 'Minimum ₹20, grassbot won\'t budge', 'error')
    if (!location.trim()) return toast('Add a location', 'So nearby doers can find you', 'error')
    store.postTask(user.id, {
      title: title.trim(),
      description: desc.trim(),
      category,
      price: Math.round(p),
      location: location.trim(),
      lat: 12.9716 + (Math.random() - 0.5) * 0.1,
      lng: 77.5946 + (Math.random() - 0.5) * 0.1,
      deadline: previewDeadline,
      urgent,
      photoUrl: photo ?? undefined,
    })
    toast('Task posted! 🎉', 'Doers near you can now accept it. Go touch grass.')
    navigate('/tasks')
  }

  const Icon = categoryIcon(category)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl leading-none">
          Post a <span className="text-orange">task</span>
        </h1>
        <p className="mt-2 text-muted font-body font-semibold text-sm">Describe it once. Doers compete to do it. You relax.</p>

        <div className="mt-7 bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6 space-y-5">
          <Field label="Title">
            <input className={inputCls} placeholder="e.g. Print 60 pages and spiral-bind 3 copies" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="What's the job?">
            <textarea
              className={`${inputCls} min-h-32 resize-y`}
              placeholder="Give every detail — what needs doing, where, how long, any access notes. Specific = fewer messages."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Price (₹)">
              <input className={inputCls} inputMode="numeric" placeholder="150" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, '').slice(0, 5))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location / area">
              <input className={inputCls} placeholder="e.g. Indiranagar 100ft Road" value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="Deadline">
              <Select value={hours} onChange={(e) => setHours(e.target.value)}>
                <option value="3">In 3 hours</option>
                <option value="12">In 12 hours</option>
                <option value="24">Tomorrow</option>
                <option value="72">In 3 days</option>
                <option value="168">This week</option>
              </Select>
            </Field>
          </div>

          <button
            onClick={() => setUrgent(!urgent)}
            className={`w-full flex items-center justify-between rounded-2xl border border-ink/15 p-4 transition-all ${
              urgent ? 'bg-coral text-white shadow-[0_8px_16px_rgba(232,125,74,0.3)]' : 'bg-white hover:bg-soft'
            }`}
          >
            <span className="flex items-center gap-3 font-body font-bold">
              <Flame className={urgent ? 'text-white' : 'text-rose'} /> Urgent — needs doing fast
            </span>
            <span className={`size-5 rounded-full border-2 ${urgent ? 'bg-white border-white' : 'border-ink/30'}`} />
          </button>

          <label className="block">
            <div className="rounded-2xl border-2 border-dashed border-ink/15 p-4 bg-white hover:bg-soft transition-colors cursor-pointer">
              {photo ? (
                <img src={photo} alt="task preview" className="max-h-40 rounded-xl mx-auto" />
              ) : (
                <div className="flex items-center gap-3 font-body font-bold text-neutral-500">
                  <ImagePlus className="size-5" /> Add a photo (optional)
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    const r = new FileReader()
                    r.onload = () => setPhoto(String(r.result))
                    r.readAsDataURL(f)
                  }
                }}
              />
            </div>
          </label>

          <BrutButton className="w-full" size="lg" onClick={submit} pulse>
            Post Task — ₹{Number(price) || 0} <ArrowRight className="size-5 inline ml-2" />
          </BrutButton>
          <p className="text-center text-xs text-neutral-500 font-body font-semibold">
            Free to post · 15% platform fee only when it's done
          </p>
        </div>
      </div>

      {/* live preview */}
      <div className="lg:sticky lg:top-28 self-start">
        <p className="font-body font-bold uppercase text-xs tracking-widest text-orange mb-3">Live preview</p>
        <motion.div
          layout
          className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-6 max-w-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl border border-ink/10 bg-orange flex items-center justify-center">
                <Icon className="size-6" />
              </div>
              <div>
                <p className="font-body font-bold text-sm">{category}</p>
                <p className="text-xs text-neutral-500 font-semibold">{location || 'Your area'} · {timeLeft(previewDeadline)}</p>
              </div>
            </div>
            <span className="font-display text-3xl">{Number(price) ? `₹${Number(price).toLocaleString('en-IN')}` : '₹?'}</span>
          </div>
          <h2 className="mt-4 font-display text-2xl leading-tight min-h-14">
            {title || 'Your task title appears here…'}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 min-h-20">{desc || 'Your description appears here. Doers will read this before accepting.'}</p>
          {photo && <img src={photo} alt="" className="mt-3 max-h-40 rounded-xl mx-auto" />}
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="size-7 rounded-full bg-ink text-orange flex items-center justify-center text-xs font-body font-bold">
                {user.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="font-body font-semibold text-sm">{user.name}</span>
            </div>
            {urgent && <span className="px-2.5 py-1 rounded-lg bg-danger text-white text-xs font-body font-bold uppercase border-2 border-cocoa/90 shadow-[2px_3px_0_rgba(0,0,0,0.9)] -rotate-3">URGENT</span>}
          </div>
        </motion.div>
        <div className="mt-4 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-2xl p-4 text-sm text-muted font-body font-medium">
          💡 Tip: "urgent" tasks get ~3x more acceptances. Price fairly and set a realistic deadline.
        </div>
      </div>
    </div>
  )
}
