import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, BadgeCheck, FileCheck2, Lock, Phone, ShieldCheck, Smartphone, UserRound } from 'lucide-react'
import { BrutButton, Field, inputCls, toast } from '../components/ui'
import { store } from '../lib/db'
import type { Role } from '../lib/types'

type Step = 'phone' | 'otp' | 'onboard' | 'verify'

export default function Auth() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('both')
  const [area, setArea] = useState('')
  const [bio, setBio] = useState('')
  const [idFile, setIdFile] = useState<string | null>(null)

  const sendOtp = () => {
    if (phone.replace(/\D/g, '').length < 10) return toast('Enter a valid 10-digit number', undefined, 'error')
    const code = String(Math.floor(1000 + Math.random() * 9000))
    setSentOtp(code)
    setStep('otp')
    toast('OTP sent ✨', `code: ${code} — paste it in, bestie`)
  }

  const verifyOtp = () => {
    if (otp !== sentOtp) return toast('Wrong OTP, try again', 'numbers are hard, we know', 'error')
    const existing = store.userByPhone(phone)
    if (existing) {
      store.login(phone, existing.name, existing.role, existing.area, existing.bio)
      toast('Welcome back 🌱', `${existing.name}, you're in.`)
      navigate('/tasks')
    } else {
      setStep('onboard')
    }
  }

  const finishOnboard = () => {
    if (!name.trim()) return toast('Tell us your name', 'can\'t call you "user" forever', 'error')
    store.login(phone, name.trim(), role, area.trim() || "Bengaluru", bio.trim())
    if (role !== 'poster') {
      setStep('verify')
    } else {
      toast('Welcome to touchgrass', `You're in, ${name.split(' ')[0]}. Go touch some grass.`)
      navigate('/tasks')
    }
  }

  const submitId = () => {
    if (!idFile) return toast('Upload your ID first', 'grassbot needs to see it', 'error')
    store.verifyId(store.sessionUser()!.id)
    toast('ID verified ✅', 'You can now accept tasks. Ratings will follow.')
    navigate('/tasks')
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-20">
      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div key="phone" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <CardShell title="Log in / Sign up" sub="Phone + OTP. No passwords, no drama.">
              <Field label="Phone number">
                <div className="flex items-center gap-2">
                  <span className="font-body font-bold text-lg bg-warm-paper border border-ink/10 rounded-xl px-3 py-3">+91</span>
                  <input className={inputCls} placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))} />
                </div>
              </Field>
              <BrutButton className="w-full mt-6" pulse onClick={sendOtp}>
                <Phone className="size-5 inline mr-2 -mt-0.5" /> Send OTP
              </BrutButton>
            </CardShell>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <CardShell title="Enter OTP" sub={`Sent to +91 ${phone}`}>
              <Field label="4-digit code">
                <div className="flex items-center gap-2">
                  <Smartphone className="size-5 text-neutral-400" />
                  <input
                    className={inputCls}
                    placeholder="0000"
                    inputMode="numeric"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                  />
                </div>
              </Field>
              <div className="mt-4 rounded-xl bg-ink border border-white/15 p-3 text-center font-body font-bold text-orange text-sm">
                Demo mode — your OTP is {sentOtp}
              </div>
              <div className="flex gap-3 mt-6">
                <BrutButton variant="ghost" onClick={() => setStep('phone')}>
                  <ArrowLeft className="size-4" />
                </BrutButton>
                <BrutButton className="flex-1" onClick={verifyOtp} pulse>
                  Verify & Continue <ArrowRight className="size-4 inline ml-2" />
                </BrutButton>
              </div>
            </CardShell>
          </motion.div>
        )}

        {step === 'onboard' && (
          <motion.div key="onboard" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <CardShell title="Set up your profile" sub="What brings you to kaamdo?">
              <div className="space-y-5">
                <Field label="Your name">
                  <input className={inputCls} placeholder="e.g. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="I'm here to…">
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { key: 'poster', label: 'Post tasks' },
                        { key: 'doer', label: 'Do tasks' },
                        { key: 'both', label: 'Both' },
                      ] as { key: Role; label: string }[]
                    ).map((r) => (
                      <button
                        key={r.key}
                        onClick={() => setRole(r.key)}
                        className={`rounded-2xl px-2 py-3 font-body font-bold text-sm border border-ink/15 transition-all ${
                          role === r.key ? 'bg-coral text-white shadow-[0_8px_16px_rgba(232,125,74,0.35)]' : 'bg-white text-ink hover:bg-soft'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Area / locality">
                  <input className={inputCls} placeholder="e.g. Koramangala, Bengaluru" value={area} onChange={(e) => setArea(e.target.value)} />
                </Field>
                <Field label="One-liner about you">
                  <input className={inputCls} placeholder="e.g. Errand ninja, fast and friendly" value={bio} onChange={(e) => setBio(e.target.value)} />
                </Field>
                <BrutButton className="w-full" onClick={finishOnboard} pulse>
                  Continue <ArrowRight className="size-4 inline ml-2" />
                </BrutButton>
              </div>
            </CardShell>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div key="verify" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <CardShell title="Verify your ID" sub="Doers must verify before accepting tasks. Takes 30 seconds.">
              <div className="flex items-center gap-3 rounded-2xl bg-ink border border-white/15 p-4 mb-5">
                <ShieldCheck className="size-10 text-orange" />
                <p className="text-sm text-cocoa/70 font-body font-medium">
                  This protects everyone. Strangers meet strangers here — verified doers only.
                </p>
              </div>
              <label className="block cursor-pointer">
                <div className={`rounded-2xl border-2 border-dashed border-ink/15 p-6 text-center transition-colors ${idFile ? 'bg-sage/10 border-sage/40' : 'bg-white hover:bg-soft'}`}>
                  {idFile ? (
                    <>
                      <FileCheck2 className="size-10 mx-auto text-ok" />
                      <p className="mt-2 font-body font-bold text-sm text-neutral-700">{idFile}</p>
                      <p className="text-xs text-neutral-500 mt-1">Looks good — submit to verify.</p>
                    </>
                  ) : (
                    <>
                      <UserRound className="size-10 mx-auto text-neutral-400" />
                      <p className="mt-2 font-body font-bold text-sm text-neutral-700">Upload government ID</p>
                      <p className="text-xs text-neutral-500 mt-1">Aadhaar / Passport / Driving licence · JPG, PNG or PDF</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setIdFile(e.target.files?.[0]?.name ?? null)}
                  />
                </div>
              </label>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted font-body font-semibold">
                <Lock className="size-3.5" /> Encrypted, never shown publicly. Not used for anything else.
              </div>
              <BrutButton className="w-full mt-6" onClick={submitId} pulse>
                <BadgeCheck className="size-5 inline mr-2 -mt-0.5" /> Verify & Start
              </BrutButton>
            </CardShell>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-muted">
        Just browsing? <Link to="/tasks" className="text-orange font-body font-bold hover:underline">Browse open tasks →</Link>
      </p>
    </div>
  )
}

function CardShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="bg-white text-cocoa shadow-[0_10px_25px_rgba(0,0,0,0.12)] rounded-[24px] p-7 sm:p-9">
      <h1 className="font-display text-3xl leading-none">{title}</h1>
      <p className="mt-1.5 text-sm text-neutral-600 font-body font-medium mb-7">{sub}</p>
      {children}
    </div>
  )
}
