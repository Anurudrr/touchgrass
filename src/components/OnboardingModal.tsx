import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Sparkles, ShieldCheck, MapPin } from 'lucide-react'
import { Grassbot } from './Grassbot'

const STORAGE_KEY = 'touchgrass-onboarding-complete'

const STEPS = [
  {
    title: 'Welcome to touchgrass',
    description: 'The easiest way to get things done by real people nearby.',
    icon: Sparkles,
    graphic: <Grassbot size={120} mood="wave" />,
  },
  {
    title: 'Post a task in seconds',
    description: 'Describe what you need, set a fair price, and pick a deadline. Doers compete to help you.',
    icon: MapPin,
    graphic: (
      <div className="w-full max-w-xs mx-auto aspect-square bg-[var(--color-warm-paper)] rounded-[1rem] border-2 border-[var(--color-ink)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-ink)] text-[var(--color-fg-light)] flex items-center justify-center mx-auto mb-3 text-2xl">➕</div>
          <p className="font-body text-sm text-[var(--color-muted)]">Tap "Post a Task" to start</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Verified doers only',
    description: 'Every doer verifies their ID. Your money stays in escrow until the job is done right.',
    icon: ShieldCheck,
    graphic: (
      <div className="w-full max-w-xs mx-auto aspect-square bg-[var(--color-warm-paper)] rounded-[1rem] border-2 border-[var(--color-ink)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-sage)] text-white flex items-center justify-center mx-auto mb-3 text-2xl">
            <ShieldCheck className="size-8" />
          </div>
          <p className="font-body text-sm text-[var(--color-muted)]">Safe, secure, transparent</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Ready to touch grass?',
    description: 'Stop scrolling. Post your first task and get back to what matters.',
    icon: Sparkles,
    graphic: <Grassbot size={120} mood="happy" />,
  },
]

export function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY)
    if (!completed) {
      setShowModal(true)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setShowModal(false)
    onComplete()
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!showModal) return null

  const step = STEPS[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-ink)]/80 backdrop-blur-sm"
        onClick={() => completeOnboarding()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md bg-[var(--color-cream)] rounded-[1.5rem] border-2 border-[var(--color-ink)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={completeOnboarding}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="size-5" />
          </button>

          <div className="p-8">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-8">
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 18 }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= currentStep ? 'bg-[var(--color-ink)]' : 'bg-[var(--color-border)]'
                  }`}
                />
              ))}
            </div>

            {/* Icon/Graphic */}
            <div className="mb-6">
              {step.graphic}
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] rounded-full px-4 py-1.5 mb-4">
                <step.icon className="size-5 text-[var(--color-ink)]" />
                <span className="font-display text-xs uppercase tracking-widest text-[var(--color-ink)]">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-ink)] mb-3">
                {step.title}
              </h2>
              <p className="font-body text-[var(--color-muted)] leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[var(--color-warm-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]"
              >
                <ArrowRight className="size-4 rotate-180" /> Back
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-body font-semibold text-sm bg-[var(--color-ink)] text-[var(--color-cream)] border-2 border-[var(--color-ink)] hover:bg-[var(--color-charcoal)] hover:border-[var(--color-charcoal)] transition-all"
              >
                {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}