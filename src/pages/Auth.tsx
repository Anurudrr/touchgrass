import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BadgeCheck, FileCheck2, Lock, Phone, ShieldCheck, Smartphone, UserRound } from 'lucide-react'
import { toast } from '../components/ui'
import { store } from '../lib/db'
import type { Role } from '../lib/types'

/* ─── Arrow icon ─── */
function ArrowIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  )
}

/* ─── Ear notch SVGs ─── */
function LeftEar({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 44 45"
      style={{ position: 'absolute', top: -1, left: -1, width: 40, height: 'auto', zIndex: 2, pointerEvents: 'none' }}>
      <path fill={color} d="M1.335.198c.671-.316 1.5-.254 2.186.187C27.678 16.847 39.839 36.953 44 45h-6.048c-2.382-1.604-6.964-3.674-15.652-4.814C2.999 37.666-.665 14.174.09 2.04.152 1.28.589.515 1.335.198Z" />
    </svg>
  )
}

function RightEar({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 29 80"
      style={{ position: 'absolute', top: -1, right: -1, width: 26, height: 'auto', zIndex: 2, pointerEvents: 'none' }}>
      <path fill={color} d="M19.388.879c.667-.771 1.647-1.018 2.559-.807.912.21 1.682.956 1.926 1.861C34.595 38.09 25.79 69.237 21.823 80h-4.188c-.17-4.22-2.739-13.318-10.975-22.064-8.493-9.099-8.88-21.913-1.063-37.23C11.221 9.603 19.091 1.266 19.388.879Z" />
    </svg>
  )
}

type Step = 'phone' | 'otp' | 'onboard' | 'verify'

/* ─── Card shell ─── */
function CardShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#FFF9F0',
        border: '1.5px solid #E8E2D4',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(15,14,10,0.07)',
      }}
    >
      <LeftEar color="#FFF9F0" />
      <RightEar color="#FFF9F0" />
      <h1
        style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--color-fg)',
          lineHeight: 1.1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {title}
      </h1>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.95rem', color: 'var(--color-fg-muted)', marginTop: '0.5rem', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
        {sub}
      </p>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

/* ─── Submit button (Aardvark split-pill) ─── */
function SubmitBtn({ onClick, children, type = 'button' }: { onClick?: () => void; children: React.ReactNode; type?: 'button' | 'submit' }) {
  return (
    <button type={type} onClick={onClick} className="avy-btn avy-btn--lg" style={{ width: '100%', justifyContent: 'center' }}>
      <span className="avy-btn__text" style={{ flex: 1, justifyContent: 'center' }}>{children}</span>
      <span className="avy-btn__icon"><ArrowIcon size={14} /></span>
    </button>
  )
}

/* ─── Back button ─── */
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
        color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer',
        padding: '0.5rem 0', marginBottom: '0.75rem',
      }}
    >
      <ArrowLeft size={14} /> Back
    </button>
  )
}

/* ─── Field wrapper ─── */
function AuthField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    color: 'var(--color-fg)',
    background: '#FFFFFF',
    border: '1.5px solid #E8E2D4',
    borderRadius: '0.75rem',
    fontFamily: '"DM Sans", sans-serif',
    outline: 'none',
    transition: 'border-color 200ms',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        background: '#F9E84A',
        minHeight: '100vh',
        paddingTop: '6rem',
        paddingBottom: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blob background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg viewBox="0 0 1920 1000" fill="none" style={{ position: 'absolute', bottom: 0, width: '100%', opacity: 0.15 }}>
          <path d="M1695.07 151.632c64.24-31.904 131.73-7.088 176.11 42.102 40.17 44.528 55.82 98.753 61.56 156.949 6.14 62.16-2.03 123.84-5.58 185.677-3.39 59.179-3.64 118.025 17.39 174.679 10.72 28.85 25.42 55.218 51.77 73.069 37.97 25.728 81.74 25.202 122.06-1.291" fill="#E8D900" />
        </svg>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 400,
              color: 'var(--color-fg)',
              lineHeight: 1.1,
            }}
          >
            Join the club
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '1rem', color: 'rgba(15,14,10,0.65)', marginTop: '0.5rem' }}>
            Phone + OTP. No passwords, no drama.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' && (
            <motion.div key="phone" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <CardShell title="Log in / Sign up" sub="We'll send you a one-time code.">
                <AuthField label="Phone number">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span
                      style={{
                        display: 'flex', alignItems: 'center',
                        fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '1rem',
                        background: '#FFF4E2', border: '1.5px solid #E8E2D4',
                        borderRadius: '0.75rem', padding: '0.75rem 1rem',
                        color: 'var(--color-fg)', flexShrink: 0,
                      }}
                    >
                      +91
                    </span>
                    <input
                      style={inputStyle}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0E0A' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E8E2D4' }}
                    />
                  </div>
                </AuthField>
                <SubmitBtn onClick={sendOtp}>
                  <Phone size={16} style={{ marginRight: 8, display: 'inline', verticalAlign: 'middle' }} />
                  Send OTP
                </SubmitBtn>
              </CardShell>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <CardShell title="Enter OTP" sub={`Sent to +91 ${phone}`}>
                <BackBtn onClick={() => setStep('phone')} />
                <AuthField label="4-digit code">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Smartphone size={20} color="#9A968C" style={{ flexShrink: 0, alignSelf: 'center' }} />
                    <input
                      style={inputStyle}
                      placeholder="0000"
                      inputMode="numeric"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0E0A' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E8E2D4' }}
                    />
                  </div>
                </AuthField>
                <div
                  style={{
                    background: 'var(--color-ink)', color: 'var(--color-gold)',
                    borderRadius: '0.75rem', padding: '0.875rem 1rem',
                    fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem',
                    textAlign: 'center', marginBottom: '1.25rem',
                  }}
                >
                  Demo mode — your OTP is {sentOtp}
                </div>
                <SubmitBtn onClick={verifyOtp}>Verify &amp; Continue</SubmitBtn>
              </CardShell>
            </motion.div>
          )}

          {step === 'onboard' && (
            <motion.div key="onboard" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <CardShell title="Set up your profile" sub="Tell us a bit about yourself.">
                <AuthField label="Your name">
                  <input style={inputStyle} placeholder="e.g. Priya Sharma" value={name} onChange={(e) => setName(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0E0A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E8E2D4' }}
                  />
                </AuthField>
                <AuthField label="I'm here to…">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    {(
                      [
                        { key: 'poster', label: 'Post tasks' },
                        { key: 'doer', label: 'Do tasks' },
                        { key: 'both', label: 'Both' },
                      ] as { key: Role; label: string }[]
                    ).map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRole(r.key)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: '0.75rem',
                          border: '1.5px solid',
                          borderColor: role === r.key ? '#0F0E0A' : '#E8E2D4',
                          background: role === r.key ? '#0F0E0A' : '#FFF9F0',
                          color: role === r.key ? '#FFF9F0' : '#0F0E0A',
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 200ms',
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </AuthField>
                <AuthField label="Area / locality">
                  <input style={inputStyle} placeholder="e.g. Koramangala, Bengaluru" value={area} onChange={(e) => setArea(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0E0A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E8E2D4' }}
                  />
                </AuthField>
                <AuthField label="One-liner about you">
                  <input style={inputStyle} placeholder="e.g. Errand ninja, fast and friendly" value={bio} onChange={(e) => setBio(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#0F0E0A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#E8E2D4' }}
                  />
                </AuthField>
                <SubmitBtn onClick={finishOnboard}>Continue</SubmitBtn>
              </CardShell>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div key="verify" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <CardShell title="Verify your ID" sub="Doers must verify before accepting tasks. Takes 30 seconds.">
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: 'var(--color-ink)', borderRadius: '0.875rem',
                    padding: '1rem 1.25rem', marginBottom: '1.25rem',
                  }}
                >
                  <ShieldCheck size={36} color="#F9A220" style={{ flexShrink: 0 }} />
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: 'rgba(255,249,240,0.7)', lineHeight: 1.5 }}>
                    This protects everyone. Verified doers only — strangers meet strangers here.
                  </p>
                </div>
                <label style={{ display: 'block', cursor: 'pointer', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      borderRadius: '0.875rem',
                      border: `2px dashed ${idFile ? '#4cad7d' : '#E8E2D4'}`,
                      padding: '2rem',
                      textAlign: 'center',
                      background: idFile ? 'rgba(76,173,125,0.08)' : '#FFFFFF',
                      transition: 'all 200ms',
                    }}
                  >
                    {idFile ? (
                      <>
                        <FileCheck2 size={36} color="#4cad7d" style={{ margin: '0 auto 0.75rem' }} />
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-fg)' }}>{idFile}</p>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'var(--color-fg-muted)', marginTop: '0.25rem' }}>Looks good — submit to verify.</p>
                      </>
                    ) : (
                      <>
                        <UserRound size={36} color="#9A968C" style={{ margin: '0 auto 0.75rem' }} />
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-fg)' }}>Upload government ID</p>
                        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'var(--color-fg-muted)', marginTop: '0.25rem' }}>Aadhaar / Passport / Driving licence · JPG, PNG or PDF</p>
                      </>
                    )}
                    <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => setIdFile(e.target.files?.[0]?.name ?? null)} />
                  </div>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'var(--color-fg-muted)', marginBottom: '1.25rem' }}>
                  <Lock size={12} /> Encrypted, never shown publicly.
                </div>
                <SubmitBtn onClick={submitId}>
                  <BadgeCheck size={16} style={{ marginRight: 8, display: 'inline', verticalAlign: 'middle' }} />
                  Verify &amp; Start
                </SubmitBtn>
              </CardShell>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', color: 'rgba(15,14,10,0.55)' }}>
          Just browsing?{' '}
          <Link to="/tasks" style={{ color: 'var(--color-fg)', fontWeight: 600, textDecoration: 'underline' }}>
            Browse open tasks →
          </Link>
        </p>
      </div>
    </div>
  )
}
