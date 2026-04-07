import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingProps {
  onComplete: () => void
}

// Animated hexagon logo geometry — pure SVG, no emojis
function NexusLogoAnimated() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_24px_rgba(108,99,255,0.8)]"
    >
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c63ff" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b9d" />
          <stop offset="100%" stopColor="#ffd166" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Outer hexagon */}
      <path
        d="M40 4L72 22V58L40 76L8 58V22L40 4Z"
        stroke="url(#lg1)"
        strokeWidth="2"
        fill="rgba(108,99,255,0.1)"
        filter="url(#glow)"
      />
      {/* Inner hexagon rotated */}
      <path
        d="M40 16L62 28V52L40 64L18 52V28L40 16Z"
        stroke="url(#lg2)"
        strokeWidth="1.5"
        fill="rgba(255,107,157,0.05)"
        strokeDasharray="4 2"
      />
      {/* Center N letterform */}
      <path
        d="M28 52V28L40 48L52 28V52"
        stroke="url(#lg1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
      />
      {/* Corner dots */}
      {[
        [40, 4], [72, 22], [72, 58], [40, 76], [8, 58], [8, 22]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="url(#lg1)" opacity="0.8" />
      ))}
    </svg>
  )
}

// Floating particle dot
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      style={style}
      className="absolute rounded-full pointer-events-none"
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  )
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  style: {
    width: `${4 + Math.random() * 6}px`,
    height: `${4 + Math.random() * 6}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: ['#6c63ff', '#00d4ff', '#ff6b9d', '#ffd166', '#06d6a0'][i % 5],
    opacity: 0.4,
  },
}))

export function OnboardingSplash({ onComplete }: OnboardingProps) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Phase sequence: enter → show → auto-dismiss after 3.5s
    const t1 = setTimeout(() => setPhase('show'), 100)
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / 35, 100))
    }, 100)
    const t2 = setTimeout(() => {
      setPhase('exit')
      clearInterval(interval)
    }, 3500)
    const t3 = setTimeout(() => onComplete(), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(interval) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'var(--bg)' }}
        >
          {/* Background mesh glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 600px 600px at 50% 50%, rgba(108,99,255,0.15) 0%, transparent 70%),
                radial-gradient(ellipse 300px 300px at 20% 80%, rgba(0,212,255,0.1) 0%, transparent 70%),
                radial-gradient(ellipse 300px 300px at 80% 20%, rgba(255,107,157,0.1) 0%, transparent 70%)
              `
            }}
          />

          {/* Floating particles */}
          {PARTICLES.map((p) => (
            <Particle key={p.id} style={p.style} />
          ))}

          {/* Rotating ring */}
          <motion.div
            className="absolute rounded-full border border-[rgba(108,99,255,0.2)]"
            style={{ width: 300, height: 300 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute rounded-full border border-[rgba(0,212,255,0.15)]"
            style={{ width: 400, height: 400, borderStyle: 'dashed' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: 'spring', bounce: 0.4 }}
            >
              <NexusLogoAnimated />
            </motion.div>

            {/* Nexus wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col items-center gap-1"
            >
              <h1
                className="text-6xl font-display font-black tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #6c63ff 0%, #00d4ff 50%, #ff6b9d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(108,99,255,0.5))',
                }}
              >
                NEXUS
              </h1>
              <p className="text-sm font-body tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
                Your All-in-One Universe
              </p>
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="h-px w-48"
              style={{ background: 'linear-gradient(90deg, transparent, var(--accent1), transparent)' }}
            />

            {/* WebCraft Studio credit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
                Built by
              </p>
              <div className="flex items-center gap-2">
                {/* WebCraft Studio mini logo SVG */}
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <linearGradient id="wcs" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#06d6a0" />
                    </linearGradient>
                  </defs>
                  {/* Code brackets < > */}
                  <path d="M14 14L6 20L14 26" stroke="url(#wcs)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M26 14L34 20L26 26" stroke="url(#wcs)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Up arrow */}
                  <path d="M20 8V32M20 8L15 14M20 8L25 14" stroke="url(#wcs)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <span
                  className="text-base font-display font-bold"
                  style={{ color: 'var(--text2)' }}
                >
                  WebCraft Studio
                </span>
              </div>
              <p
                className="text-xs italic"
                style={{ color: 'var(--muted)' }}
              >
                "Your Vision. Engineered to Perfection."
              </p>
            </motion.div>

            {/* Loading progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="w-48 flex flex-col items-center gap-2"
            >
              <div
                className="w-full h-0.5 rounded-full overflow-hidden"
                style={{ background: 'var(--border2)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--accent1), var(--accent2))',
                    width: `${progress}%`,
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Loading your universe...
              </p>
            </motion.div>
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={() => { setPhase('exit'); setTimeout(onComplete, 700) }}
            className="absolute bottom-10 text-xs px-4 py-2 rounded-full transition-all"
            style={{
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              background: 'var(--glass)',
            }}
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
