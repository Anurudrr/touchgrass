import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, ImagePlus } from 'lucide-react'
import { toast } from '../components/ui'
import { store } from '../lib/db'
import { CATEGORIES } from '../lib/types'
import { categoryIcon } from '../components/icons'
import { timeLeft } from '../lib/utils'
import { inputCls } from '../components/ui'

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}

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
      <div className="bg-[#FFF9F0] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-[#FFF9F0] border-2 border-[var(--color-ink)] rounded-[1.5rem] p-10 shadow-brutal-lg">
          <p className="font-display text-3xl text-[var(--color-fg)]">Log in first</p>
          <p className="mt-3 font-body font-semibold text-[#5A574F]">You need an account to post tasks. Takes 60 seconds.</p>
          <Link to="/auth" className="avy-btn avy-btn--lg mt-6 mx-auto w-fit">
            <span className="avy-btn__text">Log in / Sign up</span>
            <span className="avy-btn__icon"><ArrowIcon size={16} /></span>
          </Link>
        </div>
      </div>
    )
  }

  const submit = () => {
    if (title.trim().length < 8) return toast('Title too short 😅', 'Give doers a clear idea — 8 chars min', 'error')
    if (desc.trim().length < 20) return toast('Add more detail', 'What, where, when — be specific (20+)', 'error')
    const p = Number(price)
    if (!p || p < 20) return toast('Set a fair price', "Minimum ₹20, grassbot won't budge", 'error')
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
    <div className="bg-[#FFF9F0] min-h-screen">
      {/* Yellow hero header */}
      <div className="bg-[#F9E84A] border-b-2 border-[var(--color-ink)] pt-24 pb-10">
        <div className="max-w-[1400px] mx-auto px-8">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-normal text-[var(--color-fg)] leading-none">
            Post a <em className="italic">task</em>
          </h1>
          <p className="mt-2 font-body font-semibold text-sm text-[var(--color-fg)]/65">Describe it once. Doers compete to do it. You relax.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8 pb-24 grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div>
          <div className="bg-[#FFF9F0] border-2 border-[var(--color-ink)] rounded-[1.5rem] p-6 shadow-brutal space-y-5">
            {/* Title */}
            <div>
              <label className="label">Title</label>
              <input
                className={inputCls}
                placeholder="e.g. Print 60 pages and spiral-bind 3 copies"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">What's the job?</label>
              <textarea
                className={`${inputCls} min-h-32 resize-y`}
                placeholder="Give every detail — what needs doing, where, how long, any access notes. Specific = fewer messages."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            {/* Category + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select
                  className={inputCls}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Price (₹)</label>
                <input
                  className={inputCls}
                  inputMode="numeric"
                  placeholder="150"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
                />
              </div>
            </div>

            {/* Location + Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Location / area</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Indiranagar 100ft Road"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Deadline</label>
                <select className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)}>
                  <option value="3">In 3 hours</option>
                  <option value="12">In 12 hours</option>
                  <option value="24">Tomorrow</option>
                  <option value="72">In 3 days</option>
                  <option value="168">This week</option>
                </select>
              </div>
            </div>

            {/* Urgent toggle */}
            <button
              onClick={() => setUrgent(!urgent)}
              className={`w-full flex items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                urgent
                  ? 'bg-[#c8254a] text-white border-[var(--color-ink)] shadow-brutal'
                  : 'bg-[#FFF4E2] text-[var(--color-fg)] border-[#E8E2D4] hover:border-[var(--color-ink)]'
              }`}
            >
              <span className="flex items-center gap-3 font-body font-bold">
                <Flame className={urgent ? 'text-white' : 'text-[#c8254a]'} /> Urgent — needs doing fast
              </span>
              <span className={`size-5 rounded-full border-2 transition-all ${urgent ? 'bg-white border-white' : 'border-[var(--color-ink)]/30'}`} />
            </button>

            {/* Photo upload */}
            <label className="block cursor-pointer">
              <div className={`rounded-2xl border-2 border-dashed p-4 transition-colors ${photo ? 'border-[var(--color-ink)] bg-[#FFF4E2]' : 'border-[#E8E2D4] bg-[#FFF9F0] hover:bg-[#FFF4E2] hover:border-[var(--color-ink)]'}`}>
                {photo ? (
                  <img src={photo} alt="task preview" className="max-h-40 rounded-xl mx-auto" />
                ) : (
                  <div className="flex items-center gap-3 font-body font-bold text-[#5A574F]">
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

            {/* Submit */}
            <button onClick={submit} className="avy-btn avy-btn--lg w-full justify-center">
              <span className="avy-btn__text w-full text-center">Post Task — ₹{Number(price) || 0}</span>
              <span className="avy-btn__icon"><ArrowIcon size={16} /></span>
            </button>
            <p className="text-center text-xs text-[#9A968C] font-body font-semibold">
              Free to post · 15% platform fee only when it's done
            </p>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-28 self-start space-y-4">
          <p className="font-body font-bold uppercase text-xs tracking-widest text-[#F9A220]">Live preview</p>
          <motion.div
            layout
            className="bg-[#F9E84A] border-2 border-[var(--color-ink)] rounded-[1.5rem] shadow-brutal p-6 max-w-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl border-2 border-[var(--color-ink)] bg-[var(--color-ink)] flex items-center justify-center shadow-brutal">
                  <Icon className="size-6 text-[#F9E84A]" />
                </div>
                <div>
                  <p className="font-body font-bold text-sm text-[var(--color-fg)]">{category}</p>
                  <p className="text-xs text-[var(--color-fg)]/60 font-semibold">{location || 'Your area'} · {timeLeft(previewDeadline)}</p>
                </div>
              </div>
              <span className="font-display text-3xl text-[var(--color-fg)]">{Number(price) ? `₹${Number(price).toLocaleString('en-IN')}` : '₹?'}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl leading-tight min-h-14 text-[var(--color-fg)]">
              {title || 'Your task title appears here…'}
            </h2>
            <p className="mt-2 font-body text-sm text-[var(--color-fg)]/65 min-h-20">{desc || 'Your description appears here. Doers will read this before accepting.'}</p>
            {photo && <img src={photo} alt="" className="mt-3 max-h-40 rounded-xl mx-auto" />}
            <div className="mt-4 flex items-center justify-between border-t-2 border-[var(--color-ink)]/15 pt-3">
              <div className="flex items-center gap-1.5">
                <div className="size-7 rounded-full bg-[var(--color-ink)] text-[#F9E84A] border-2 border-[var(--color-ink)] flex items-center justify-center text-xs font-body font-bold">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="font-body font-semibold text-sm text-[var(--color-fg)]">{user.name}</span>
              </div>
              {urgent && (
                <span className="tag-pill border-2 border-[var(--color-ink)] shadow-brutal -rotate-3" style={{ background: '#c8254a', color: '#fff' }}>
                  URGENT
                </span>
              )}
            </div>
          </motion.div>

          <div className="bg-[#FFF9F0] border-2 border-[var(--color-ink)] rounded-2xl shadow-brutal p-4 font-body font-medium text-sm text-[#5A574F]">
            💡 Tip: "urgent" tasks get ~3x more acceptances. Price fairly and set a realistic deadline.
          </div>
        </div>
      </div>
    </div>
  )
}
