import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BadgeCheck, FileCheck2, Lock, Phone, ShieldCheck, Smartphone, UserRound, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '../components/ui'
import { store } from '../lib/db'
import type { Role } from '../lib/types'
import { BrutButton } from '../components/ui'

/* ─── Card shell ─── */
function CardShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden p-8 bg-[var(--color-cream)] border-2 border-[var(--color-border)] rounded-[1.5rem] shadow-[6px_6px_0_rgba(15,14,10,0.9)]">
      <h1 className="font-display font-bold text-[1.75rem] text-[var(--color-ink)] leading-tight mb-2">
        {title}
      </h1>
      <p className="font-body text-[0.95rem] text-[var(--color-fg-muted)] mb-6">
        {sub}
      </p>
      <div>{children}</div>
    </div>
  )
}

/* ─── Back button ─── */
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-body text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5 mb-6"
    >
      <ArrowLeft size={16} /> Back
    </button>
  )
}

/* ─── Field wrapper ─── */
function AuthField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-6">
      <label className="form-label">{label}</label>
      {children}
      {hint && <p className="form-hint mt-1.5">{hint}</p>}
    </div>
  )
}

/* ─── Input wrapper ─── */
function AuthInput({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { style?: React.CSSProperties }) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '0.875rem 1rem',
        fontSize: '1rem',
        color: 'var(--color-ink)',
        background: '#FFFFFF',
        border: '2px solid var(--color-border)',
        borderRadius: '0.875rem',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        outline: 'none',
        transition: 'border-color 200ms, box-shadow 200ms',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => { 
        e.currentTarget.style.borderColor = 'var(--color-grass)';
        e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-grass)/20';
      }}
      onBlur={(e) => { 
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  )
}

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
    toast('OTP sent ✨', `code: ${code} — paste it in`)
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
    if (!name.trim()) return toast('Tell us your name', "can't call you \"user\" forever", 'error')
    store.login(phone, name.trim(), role, area.trim() || 'Bengaluru', bio.trim())
    if (role !== 'poster') {
      setStep('verify')
    } else {
      toast('Welcome', `You're in, ${name.split(' ')[0]}.`)
      navigate('/tasks')
    }
  }

  const submitId = () => {
    if (!idFile) return toast('Upload your ID first', 'we need to see it', 'error')
    store.verifyId(store.sessionUser()!.id)
    toast('ID verified ✅', 'You can now accept tasks.')
    navigate('/tasks')
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
        <svg viewBox="0 0 1920 1000" fill="none" style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}>
          <path d="M1695.07 151.632c64.24-31.904 131.73-7.088 176.11 42.102 40.17 44.528 55.82 98.753 61.56 156.949 6.14 62.16-2.03 123.84-5.58 185.677-3.39 59.179-3.64 118.025 17.39 174.679 10.72 28.85 25.42 55.218 51.77 73.069 37.97 25.728 81.74 25.202 122.06-1.291" fill="#E8D900" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-[var(--color-fg-light)] text-[clamp(2rem,5vw,3rem)] leading-[1.1]">
            Join the club
          </h1>
          <p className="font-body text-[var(--color-fg-light)]/60 mt-2 text-base">
            Phone + OTP. No passwords, no drama.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <CardShell title="Log in / Sign up" sub="We'll send you a one-time code.">
                <AuthField label="Phone number">
                  <div className="flex gap-2">
                    <span className="flex items-center font-body font-bold bg-[var(--color-warm-paper)] border-2 border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-ink)] shrink-0">
                      +91
                    </span>
                    <AuthInput
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                    />
                  </div>
                </AuthField>
                <BrutButton variant="ink" size="lg" className="w-full" onClick={sendOtp}>
                  <Phone size={18} className="mr-2" />
                  Send OTP
                  <ChevronRight size={18} />
                </BrutButton>
              </CardShell>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <CardShell title="Enter OTP" sub={`Sent to +91 ${phone}`}>
                <BackBtn onClick={() => setStep('phone')} />
                <AuthField label="4-digit code">
                  <div className="flex gap-2">
                    <Smartphone size={20} className="text-[var(--color-fg-muted)] shrink-0 self-center mt-1.5" />
                    <AuthInput
                      placeholder="0000"
                      inputMode="numeric"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                    />
                  </div>
                </AuthField>
                <div className="mb-6 p-4 rounded-xl bg-[var(--color-ink)] text-[var(--color-gold)] font-body font-semibold text-center">
                  Demo mode — your OTP is {sentOtp}
                </div>
                <BrutButton variant="ink" size="lg" className="w-full" onClick={verifyOtp}>
                  Verify & Continue
                  <ChevronRight size={18} />
                </BrutButton>
              </CardShell>
            </motion.div>
          )}

          {step === 'onboard' && (
            <motion.div key="onboard" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <CardShell title="Set up your profile" sub="Tell us a bit about yourself.">
                <AuthField label="Your name">
                  <AuthInput
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </AuthField>
                <AuthField label="I'm here to…">
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: 'poster', label: 'Post tasks' },
                      { key: 'doer', label: 'Do tasks' },
                      { key: 'both', label: 'Both' },
                    ] as { key: Role; label: string }[]).map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRole(r.key)}
                        className={`px-4 py-3 rounded-xl border-2 font-body font-semibold text-sm transition-all ${
                          role === r.key
                            ? 'bg-[var(--color-ink)] text-[var(--color-cream)] border-[var(--color-ink)]'
                            : 'bg-[var(--color-cream)] text-[var(--color-ink)] border-[var(--color-border)] hover:border-[var(--color-ink)]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </AuthField>
                <AuthField label="Area / locality">
                  <AuthInput
                    placeholder="e.g. Koramangala, Bengaluru"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </AuthField>
                <AuthField label="One-liner about you">
                  <AuthInput
                    placeholder="e.g. Errand ninja, fast and friendly"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </AuthField>
                <BrutButton variant="ink" size="lg" className="w-full" onClick={finishOnboard}>
                  Continue
                  <ChevronRight size={18} />
                </BrutButton>
              </CardShell>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <CardShell title="Verify your ID" sub="Doers must verify before accepting tasks. Takes 30 seconds.">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-ink)] mb-6">
                  <ShieldCheck size={36} className="text-[var(--color-gold)] shrink-0" />
                  <p className="font-body text-sm text-[var(--color-cream)]/70 leading-relaxed">
                    This protects everyone. Verified doers only — strangers meet strangers here.
                  </p>
                </div>
                <label className="block cursor-pointer mb-6">
                  <div className={`rounded-xl border-2 p-8 text-center transition-all ${
                    idFile
                      ? 'border-[var(--color-sage)] bg-[var(--color-sage)]/10'
                      : 'border-[var(--color-border)] bg-[var(--color-cream)]'
                  }`}>
                    {idFile ? (
                      <>
                        <FileCheck2 size={36} className="text-[var(--color-sage)] mx-auto mb-3" />
                        <p className="font-body font-semibold text-sm text-[var(--color-ink)]">{idFile}</p>
                        <p className="font-body text-xs text-[var(--color-fg-muted)] mt-1">Looks good — submit to verify.</p>
                      </>
                    ) : (
                      <>
                        <UserRound size={36} className="text-[var(--color-fg-muted)] mx-auto mb-3" />
                        <p className="font-body font-semibold text-sm text-[var(--color-ink)]">Upload government ID</p>
                        <p className="font-body text-xs text-[var(--color-fg-muted)] mt-1">Aadhaar / Passport / Driving licence · JPG, PNG or PDF</p>
                      </>
                    )}
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setIdFile(e.target.files?.[0]?.name ?? null)} />
                  </div>
                </label>
                <div className="flex items-center gap-2 font-body text-xs text-[var(--color-fg-muted)] mb-6">
                  <Lock size={12} /> Encrypted, never shown publicly.
                </div>
                <BrutButton variant="ink" size="lg" className="w-full" onClick={submitId}>
                  <BadgeCheck size={18} className="mr-2" />
                  Verify & Start
                  <ChevronRight size={18} />
                </BrutButton>
              </CardShell>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center font-body text-sm text-[var(--color-fg-light)]/50">
          Just browsing?{' '}
          <Link to="/tasks" className="font-semibold underline hover:text-[var(--color-gold)] transition-colors">
            Browse open tasks →
          </Link>
        </p>
      </div>
    </div>
  )
}