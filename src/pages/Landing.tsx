import { motion } from 'framer-motion'
import { ArrowRight, Check, MapPin, ShieldCheck, Heart, Truck, Sparkles, ShoppingBag, Hammer, Leaf, Calendar, Shield } from 'lucide-react'
import { Reveal, Magnetic, RotatingCircle, TiltCard, DrawUnderline, inputCls } from '../components/ui'
import { playRustleSound } from '../lib/audio'

/* ─── Reusable Marker Highlight ─── */
function Highlight({ children, color = 'var(--color-grass)', rotation = '-2deg' }: { children: React.ReactNode, color?: string, rotation?: string }) {
  return (
    <span className="relative z-10 inline-block px-1">
      <span 
        className="absolute bottom-[0.15em] left-[-0.1em] right-[-0.1em] h-[0.45em] z-[-1] opacity-80"
        style={{ backgroundColor: color, transform: `rotate(${rotation})`, borderRadius: '2px' }}
      />
      {children}
    </span>
  )
}

/* ─── Signature Stamp Badge ─── */
function StampBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={`relative w-[120px] h-[120px] flex items-center justify-center cursor-pointer group ${className}`}
    >
      <svg className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
        <defs>
          <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-fg/20" />
        <text className="text-[10px] font-bold uppercase tracking-widest fill-fg/40">
          <textPath xlinkHref="#circlePath">
            TOUCHGRASS · VERIFIED DOERS · TOUCHGRASS · VERIFIED DOERS ·
          </textPath>
        </text>
      </svg>
      <div className="bg-grass text-white p-3 rounded-full shadow-lg transition-transform group-hover:rotate-12">
        <Leaf size={24} />
      </div>
    </motion.div>
  )
}

/* ─── Polaroid Stack ─── */
function PolaroidStack({ photos, className = "" }: { photos: { src: string, caption: string, rotation: string }[], className?: string }) {
  return (
    <div className={`relative h-[300px] w-full max-w-[400px] mx-auto ${className}`}>
      {photos.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: p.rotation }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="absolute inset-0 bg-white p-3 pb-10 shadow-xl border border-fg/5 rounded-sm flex flex-col"
          style={{ zIndex: photos.length - i }}
        >
          <div className="flex-1 bg-gray-100 overflow-hidden rounded-xs">
            <img src={p.src} alt={p.caption} className="w-full h-full object-cover grayscale-[0.2]" />
          </div>
          <p className="mt-3 font-display font-bold text-fg text-center text-sm">{p.caption}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="container-wide pt-28 pb-10">
      <Reveal y={40}>
        <div className="section-card grain-overlay bg-section-base min-h-[85vh] flex flex-col items-center justify-center p-8 md:p-20 text-center relative">
          
          {/* Decorative Background Elements */}
          <RotatingCircle className="absolute -top-20 -left-20 text-grass" size={400} opacity={0.1} />
          <RotatingCircle className="absolute -bottom-40 -right-40 text-gold" size={600} opacity={0.05} />

          {/* Doodles */}
          <div className="absolute top-16 left-1/4 opacity-20 hidden md:block">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <path d="M5 35 C15 5, 25 5, 55 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-20 hidden md:block rotate-12">
            <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
              <path d="M5 5 C35 15, 35 25, 5 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Floating Stamp */}
          <StampBadge className="absolute top-10 right-10 hidden lg:flex" />

          <div className="max-w-[1100px] z-10">
            <h1 className="text-hero font-black text-fg leading-[1.05] tracking-tight mb-8">
              Post any task
              <span className="inline-flex items-center mx-3 align-middle">
                <div className="h-[0.9em] w-[0.9em] rounded-full overflow-hidden border-[4px] border-white shadow-xl">
                  <img src="/images/hero_circle.jpg" alt="Task" className="w-full h-full object-cover" />
                </div>
              </span>
              & a verified doer
              <span className="inline-flex items-center mx-3 align-middle">
                <div className="h-[0.9em] w-[2.2em] rounded-full overflow-hidden border-[4px] border-white shadow-xl bg-gray-200">
                  <img src="/images/hero_pill.jpg" alt="Doer" className="w-full h-full object-cover" />
                </div>
              </span>
              near you <span className="relative inline-block px-1">
                gets it done.
                <DrawUnderline color="var(--color-grass)" className="absolute -bottom-2 left-0 w-full h-4" strokeWidth={4} delay={0.8} />
              </span>
              </h1>
            <p className="font-body text-xl text-fg-muted max-w-2xl mx-auto mb-12">
              The platform for people who need things done, by people who actually enjoy doing them. Secure, verified, and local.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mx-auto">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-fg)]/30" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter your city..." 
                  className={`${inputCls} rounded-full py-5 pl-14 pr-6 font-body font-semibold`}
                />
              </div>
              <Magnetic strength={0.2}>
                <button className="btn-pill btn-pill-black w-full sm:w-auto h-[66px] px-10 text-lg group">
                  Find a doer
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Magnetic>
            </div>
          </div>

        {/* Bottom accents */}
        <div className="absolute bottom-10 left-10 hidden lg:block text-left">
          <div className="bg-fg text-white p-6 rounded-[32px] w-60 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-grass rounded-full flex items-center justify-center">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <ul className="space-y-3 font-body font-bold text-sm">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-grass flex items-center justify-center">
                  <Check size={12} strokeWidth={4} />
                </div>
                Verified doers only
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-grass flex items-center justify-center">
                  <Check size={12} strokeWidth={4} />
                </div>
                Escrow-protected pay
              </li>
            </ul>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4">
          <div className="bg-fg text-white badge-pill py-3 px-6 shadow-xl">
             Live in your city
          </div>
          <div className="w-24 h-16 bg-grass rounded-l-full relative flex items-center justify-center">
             <Sparkles className="text-white/40" />
             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] pointer-events-none" />
          </div>
        </div>
        </div>
      </Reveal>
    </section>
  )
}

        /* ─── Category Grid Section ─── */
        function Categories() {
        const categories = [
        { title: 'Moving & Hauling', doers: '120+', icon: Truck, featured: false },
        { title: 'Home Cleaning', doers: '85+', icon: Heart, featured: false },
        { title: 'Errands & Delivery', doers: '200+', icon: ShoppingBag, featured: true },
        { title: 'Assembly & Repairs', doers: '64+', icon: Hammer, featured: false },
        { title: 'Yard Work', doers: '42+', icon: Leaf, featured: false },
        { title: 'Event Help', doers: '38+', icon: Calendar, featured: false },
        ]

        return (
        <section className="container-wide py-10">
        <Reveal y={30}>
        <div className="section-card grain-overlay bg-white p-8 md:p-20 text-center border border-fg/5">
          <h2 className="text-h1 mb-16 max-w-2xl mx-auto">
            Popular tasks to <Highlight>get off</Highlight> your list today.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((c, i) => (
              <TiltCard key={i} className="h-full">
                <motion.div 
                  onMouseEnter={playRustleSound}
                  className={`group p-8 rounded-[32px] text-left transition-all h-full ${c.featured ? 'bg-grass text-white' : 'bg-section-base text-fg border border-fg/5'}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-10 ${c.featured ? 'bg-white text-grass' : 'bg-fg text-white'}`}>
                    <c.icon size={28} />
                  </div>
                  <p className={`text-sm font-bold mb-2 ${c.featured ? 'text-white/70' : 'text-fg-muted'}`}>{c.doers} doers nearby</p>
                  <div className="flex items-end justify-between">
                    <h3 className={`text-2xl font-black ${c.featured ? 'text-white' : 'text-fg'}`}>{c.title}</h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:scale-110 ${c.featured ? 'bg-white text-grass' : 'bg-fg text-white'}`}>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>

          <Magnetic>
            <button className="btn-pill btn-pill-black mt-20 px-12 h-[66px] text-lg">
              Browse all categories
            </button>
          </Magnetic>
        </div>
        </Reveal>
        </section>
        )
        }


/* ─── How It Works Section ─── */
function HowItWorks() {
  const polaroids = [
    { src: '/images/hero_pill.jpg', caption: 'Post it', rotation: '-6deg' },
    { src: '/images/hero_circle.jpg', caption: 'Get matched', rotation: '4deg' },
    { src: '/images/hero_pill.jpg', caption: 'Task done', rotation: '-2deg' },
  ]

  return (
    <section className="container-wide py-10">
      <Reveal y={40}>
        <div className="section-card grain-overlay bg-grass p-8 md:p-20 text-center relative">
          
          <div className="relative mb-24 max-w-md mx-auto">
            <PolaroidStack photos={polaroids} />
            {/* Chat bubble overlay */}
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="absolute -right-10 top-1/2 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 z-10 border-2 border-fg"
            >
              <div className="w-10 h-10 rounded-full bg-gold border-2 border-fg overflow-hidden">
                 <img src="/images/hero_circle.jpg" className="w-full h-full object-cover" alt="avatar" />
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black text-fg-muted uppercase tracking-tighter">Status Update</p>
                 <p className="text-xs font-bold text-fg">Doer accepted in 4 min</p>
              </div>
            </motion.div>
          </div>

          <h2 className="text-h1 text-fg mb-16">
            how it <Highlight color="white" rotation="3deg">works</Highlight>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <Magnetic>
              <button className="btn-circle bg-white text-fg text-lg shadow-xl hover:scale-105">
                Post a<br/>task
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn-circle bg-white text-fg text-lg shadow-xl hover:scale-105">
                Browse<br/>doers
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn-circle bg-fg text-white text-lg shadow-xl hover:scale-105 border-4 border-white/20">
                Learn<br/>more
              </button>
            </Magnetic>
          </div>

        </div>
      </Reveal>
    </section>
  )
}

/* ─── Trust Section ─── */
function Trust() {
  const polaroids = [
    { src: '/images/hero_circle.jpg', caption: '5-star doers', rotation: '-4deg' },
    { src: '/images/hero_pill.jpg', caption: 'Same-day tasks', rotation: '6deg' },
    { src: '/images/hero_circle.jpg', caption: 'Escrow protected', rotation: '-2deg' },
  ]

  return (
    <section className="container-wide py-10">
      <Reveal y={40}>
        <div className="section-card grain-overlay bg-white p-8 md:p-20 border border-fg/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <PolaroidStack photos={polaroids} />
               <div className="absolute -bottom-10 -left-10 hidden xl:block">
                  <StampBadge />
               </div>
            </div>
            
            <div className="text-left">
              <div className="w-16 h-16 rounded-full border-2 border-fg flex items-center justify-center mb-10">
                 <Shield className="text-grass" size={32} />
              </div>
              <h2 className="text-h1 mb-8">Why touchgrass</h2>
              <div className="space-y-6 max-w-md">
                <p className="font-body text-lg text-fg-muted">
                  Every doer on our platform goes through a rigorous identity verification process. We don't just let anyone join; we only accept those with proven skills and a "can-do" attitude.
                </p>
                <p className="font-body text-lg text-fg-muted">
                  Your money is held in escrow until you're 100% satisfied. No awkward cash exchanges, no hidden fees. Just transparent, commission-based trust that keeps everyone honest.
                </p>
              </div>
              <Magnetic strength={0.15}>
                <button className="btn-pill btn-pill-outline mt-12 group">
                  Read our transparency report
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── Final CTA ─── */
function FinalCTA() {
  return (
    <section className="container-wide py-10 mb-20">
      <Reveal y={50}>
        <div className="section-card grain-overlay bg-fg p-8 md:p-32 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <Leaf className="absolute -top-10 -left-10 text-white w-64 h-64 rotate-12" />
             <Leaf className="absolute -bottom-10 -right-10 text-white w-64 h-64 -rotate-12" />
          </div>

          <h2 className="text-hero font-black text-white leading-[1.05] tracking-tight mb-16 max-w-[900px] mx-auto">
            Stop scrolling.
            <span className="inline-flex items-center mx-4 align-middle">
               <div className="w-16 h-16 rounded-full bg-grass flex items-center justify-center shadow-2xl">
                  <Leaf size={32} className="text-white" />
               </div>
            </span>
            <span className="relative inline-block px-2">
              Go outside.
              <DrawUnderline color="var(--color-grass)" className="absolute -bottom-4 left-0 w-full h-6" strokeWidth={5} delay={0.5} />
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
             <Magnetic strength={0.25}>
               <button className="btn-pill btn-pill-grass h-[74px] px-12 text-xl shadow-2xl group">
                  Post your first task
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
               </button>
             </Magnetic>
             <Magnetic strength={0.15}>
               <button className="btn-pill border-2 border-white/20 text-white hover:bg-white/10 h-[74px] px-10 text-lg">
                  for doers, tap here
               </button>
             </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export default function Landing() {
  return (
    <main className="bg-canvas overflow-hidden">
      <Hero />
      <Categories />
      <HowItWorks />
      <Trust />
      <FinalCTA />
      
      {/* Footer hint */}
      <div className="text-center pb-20 opacity-30">
         <p className="font-display font-bold text-white tracking-widest text-xs uppercase">
            touchgrass © 2026 · Built for the real world
         </p>
      </div>
    </main>
  )
}
