import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  NxHome, NxBot, NxBookOpen, NxGamepad, NxMusic, NxHeart,
  NxCalculator, NxNewspaper, NxNotebook, NxWallet, NxPalette,
  NxTimer, NxLanguages, NxQrCode, NxFlashlight, NxSmile,
  NxCheckSquare, NxChefHat, NxBook, NxWifi, NxWifiOff
} from '@/components/icons/NexusIcons'
import { useAppStore } from '@/store'

// ── Animated counter ──
function Counter({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = to / (duration * 60)
    const t = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(t) }
      else setVal(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(t)
  }, [to, duration])
  return <>{val.toLocaleString()}</>
}

// ── Floating orb background decoration ──
function FloatingOrb({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={style}
      animate={{ y: [0, -20, 0], scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

// ── Quick access card ──
function QuickCard({
  icon: Icon, label, desc, path, gradient, badge, delay
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>
  label: string; desc: string; path: string
  gradient: string; badge?: string; delay: number
}) {
  const navigate = useNavigate()
  return (
    <motion.button
      onClick={() => navigate(path)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col gap-3 p-5 rounded-2xl text-left overflow-hidden"
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: gradient }}
      />
      {/* Glow at top-left */}
      <div
        className="absolute -top-4 -left-4 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: gradient }}
      />

      {badge && (
        <span
          className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-lg font-bold"
          style={{
            background: 'rgba(108,99,255,0.25)',
            color: 'var(--accent2)',
            fontSize: '10px',
            letterSpacing: '0.05em',
            border: '1px solid rgba(108,99,255,0.3)',
          }}
        >
          {badge}
        </span>
      )}

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border2)' }}
      >
        <Icon size={22} color="var(--text)" />
      </div>

      <div>
        <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{label}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
      </div>
    </motion.button>
  )
}

// ── Tool chip ──
function ToolChip({
  icon: Icon, label, path, color, delay
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>
  label: string; path: string; color: string; delay: number
}) {
  const navigate = useNavigate()
  return (
    <motion.button
      onClick={() => navigate(path)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.94 }}
      className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        minWidth: 0,
      }}
    >
      <Icon size={22} color={color} />
      <span className="text-xs font-medium truncate w-full text-center" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
    </motion.button>
  )
}

// ── Activity progress bar ──
function ActivityBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay * 1000 + 200)
    return () => clearTimeout(t)
  }, [value, delay])

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-24 flex-shrink-0" style={{ color: 'var(--muted)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ width: `${width}%`, background: color, transition: 'width 0.8s ease' }}
        />
      </div>
      <span className="text-xs font-bold w-10 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  )
}

export function Home() {
  const navigate = useNavigate()
  const { isOnline } = useAppStore()
  const [greeting, setGreeting] = useState('Good morning')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const QUICK_CARDS = [
    { icon: NxBot,      label: 'Nexus AI',     desc: 'Ask anything — smart answers in seconds',      path: '/ai',      gradient: 'linear-gradient(135deg, #6c63ff, #00d4ff)', badge: 'AI',  delay: 0.1 },
    { icon: NxGamepad,  label: 'Games & Fun',   desc: 'Puzzles, arcade & mini-games for all ages',    path: '/games',   gradient: 'linear-gradient(135deg, #ff6b9d, #ffd166)',              delay: 0.15 },
    { icon: NxBookOpen, label: 'Study Hub',     desc: 'Flashcards, quizzes & AI tutor',               path: '/study',   gradient: 'linear-gradient(135deg, #06d6a0, #00d4ff)',              delay: 0.2 },
    { icon: NxHeart,    label: 'Health Tracker',desc: 'Steps, water, sleep & wellness goals',          path: '/health',  gradient: 'linear-gradient(135deg, #ff4757, #ff6b9d)',              delay: 0.25 },
    { icon: NxMusic,    label: 'Music Player',  desc: 'Your tunes, your vibe, offline-ready',          path: '/music',   gradient: 'linear-gradient(135deg, #ffd166, #ff6b9d)',              delay: 0.3 },
    { icon: NxPalette,  label: 'AI Art',        desc: 'Generate stunning visuals with AI',             path: '/ai-art',  gradient: 'linear-gradient(135deg, #b04aff, #ff6b9d)', badge: 'AI', delay: 0.35 },
  ]

  const TOOLS = [
    { icon: NxCalculator,  label: 'Calculator',  path: '/calculator', color: 'var(--accent1)', delay: 0.1 },
    { icon: NxNewspaper,   label: 'News',         path: '/news',       color: 'var(--accent2)', delay: 0.12 },
    { icon: NxNotebook,    label: 'Journal',      path: '/journal',    color: 'var(--accent4)', delay: 0.14 },
    { icon: NxWallet,      label: 'Budget',       path: '/budget',     color: 'var(--accent5)', delay: 0.16 },
    { icon: NxTimer,       label: 'Timer',        path: '/timer',      color: 'var(--accent1)', delay: 0.18 },
    { icon: NxLanguages,   label: 'Translate',    path: '/translator', color: 'var(--accent2)', delay: 0.20 },
    { icon: NxQrCode,      label: 'QR Scan',      path: '/qr',         color: 'var(--accent5)', delay: 0.22 },
    { icon: NxFlashlight,  label: 'Flashlight',   path: '/flashlight', color: 'var(--accent4)', delay: 0.24 },
    { icon: NxSmile,       label: 'Mood',         path: '/mood',       color: 'var(--accent3)', delay: 0.26 },
    { icon: NxCheckSquare, label: 'Habits',       path: '/habits',     color: 'var(--accent5)', delay: 0.28 },
    { icon: NxChefHat,     label: 'Recipes',      path: '/recipes',    color: 'var(--accent4)', delay: 0.30 },
    { icon: NxBook,        label: 'Dictionary',   path: '/dictionary', color: 'var(--accent1)', delay: 0.32 },
  ]

  return (
    <div className="relative min-h-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

      {/* Floating bg orbs */}
      <FloatingOrb style={{ width: 400, height: 400, top: -100, right: -100, background: 'var(--accent1)', opacity: 0.08 }} />
      <FloatingOrb style={{ width: 300, height: 300, bottom: 100, left: -80, background: 'var(--accent3)', opacity: 0.06 }} />

      {/* ── HERO GREETING ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl p-6 sm:p-8 overflow-hidden"
        style={{
          background: 'var(--glass)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(0,212,255,0.06) 50%, rgba(255,107,157,0.06) 100%)',
          }}
        />

        {/* Decorative hexagons */}
        <div className="absolute right-6 top-4 opacity-5">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M60 5L110 32.5V87.5L60 115L10 87.5V32.5L60 5Z" stroke="white" strokeWidth="2" fill="none" />
            <path d="M60 25L90 42.5V77.5L60 95L30 77.5V42.5L60 25Z" stroke="white" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display font-black text-2xl sm:text-3xl"
              style={{ color: 'var(--text)' }}
            >
              {greeting},{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--accent1), var(--accent2))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Explorer
              </span>{' '}
              ✦
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm mt-1"
              style={{ color: 'var(--muted)' }}
            >
              Your all-in-one universe — AI, tools, entertainment & more.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              {[
                { label: 'Active Users', value: 2841, color: 'var(--accent2)' },
                { label: 'Total Tools', value: 19,   color: 'var(--accent4)' },
                { label: 'Languages',   value: 24,   color: 'var(--accent5)' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="font-display font-black text-xl" style={{ color: stat.color }}>
                    <Counter to={stat.value} />
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Clock + status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center sm:items-end gap-2"
          >
            <p
              className="font-mono font-bold text-3xl tabular-nums"
              style={{
                background: 'linear-gradient(135deg, var(--accent1), var(--accent2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            {/* Online badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: isOnline ? 'rgba(6,214,160,0.12)' : 'rgba(255,71,87,0.12)',
                border: `1px solid ${isOnline ? 'rgba(6,214,160,0.3)' : 'rgba(255,71,87,0.3)'}`,
                color: isOnline ? 'var(--accent5)' : '#ff4757',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: isOnline ? 'var(--accent5)' : '#ff4757' }}
              />
              {isOnline ? <NxWifi size={12} /> : <NxWifiOff size={12} />}
              {isOnline ? 'Online · Offline mode ready' : 'Offline · Core tools available'}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── QUICK ACCESS ── */}
      <section>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-3"
        >
          <p className="nx-label">Quick Access</p>
          <button
            className="text-xs font-semibold transition-colors"
            style={{ color: 'var(--accent2)' }}
            onClick={() => navigate('/settings')}
          >
            Customize →
          </button>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_CARDS.map(card => (
            <QuickCard key={card.path} {...card} />
          ))}
        </div>
      </section>

      {/* ── ALL TOOLS ── */}
      <section>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="nx-label mb-3"
        >
          All Tools
        </motion.p>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
          {TOOLS.map(tool => (
            <ToolChip key={tool.path} {...tool} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM GRID: Activity + Tips ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="nx-card p-5"
        >
          <p className="nx-label mb-4">Today&apos;s Activity</p>
          <div className="space-y-3">
            <ActivityBar label="AI Chats"   value={72} color="var(--accent1)" delay={0.4} />
            <ActivityBar label="Study Time" value={45} color="var(--accent5)" delay={0.45} />
            <ActivityBar label="Games"      value={58} color="var(--accent3)" delay={0.5} />
            <ActivityBar label="Health"     value={30} color="#ff4757"         delay={0.55} />
          </div>
        </motion.div>

        {/* Tips / What's new */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="nx-card p-5"
        >
          <p className="nx-label mb-4">Tips & Highlights</p>
          <div className="space-y-3">
            {[
              { dot: 'var(--accent1)', text: 'AI Chat has 10 free messages/day — add your own key for unlimited.' },
              { dot: 'var(--accent2)', text: 'Works offline! Most tools are cached for use without internet.' },
              { dot: 'var(--accent5)', text: 'Install Nexus on your device for a native app experience.' },
              { dot: 'var(--accent4)', text: 'Switch between 5 themes in Settings to match your mood.' },
              { dot: 'var(--accent3)', text: '24+ languages supported — change language anytime in the top bar.' },
            ].map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-start gap-2.5"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: tip.dot }}
                />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── FOOTER CREDIT ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-4"
      >
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Nexus — Your All-in-One Universe ·{' '}
          <a
            href="https://webcraft-studioo.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="hover:underline transition-colors"
            style={{ color: 'var(--accent2)' }}
          >
            Built by WebCraft Studio
          </a>
          {' '}· v1.0.0
        </p>
      </motion.div>
    </div>
  )
}
