import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NexusLogo } from '@/components/icons/NexusIcons'
import { getAnalytics } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

// Social link button
function SocialBtn({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <motion.a href={href} target="_blank" rel="noreferrer"
      whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
      <span style={{ color }}>{icon}</span>
      {label}
    </motion.a>
  )
}

// Stat card
function StatCard({ value, label, color, delay }: { value: string|number; label: string; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="nx-card p-5 text-center">
      <p className="font-display font-black text-3xl" style={{ color }}>{value}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
    </motion.div>
  )
}

// Feature block
function FeatureRow({ icon, title, desc, color }: { icon: string; title: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

export function About() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<{ totalUsers: number; onlineNow: number; deviceCounts: Record<string,number> } | null>(null)

  useEffect(() => {
    getAnalytics().then(setAnalytics)
  }, [])

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 pb-12">

      {/* ── HERO ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-8 text-center overflow-hidden"
        style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,255,0.06), rgba(255,107,157,0.06))' }} />

        {/* Rotating rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-64 h-64 rounded-full border opacity-10"
            style={{ borderColor: 'var(--accent1)', borderStyle: 'dashed' }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="absolute w-96 h-96 rounded-full border opacity-5"
            style={{ borderColor: 'var(--accent2)' }} />
        </div>

        <div className="relative z-10">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
            className="inline-flex mb-4">
            <NexusLogo size={64} />
          </motion.div>
          <h1 className="font-display font-black text-4xl mb-2"
            style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Nexus
          </h1>
          <p className="text-base font-semibold mb-1" style={{ color: 'var(--text2)' }}>Your All-in-One Universe</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Version 1.0.0 · Built by WebCraft Studio</p>
        </div>
      </motion.div>

      {/* ── LIVE STATS ── */}
      <div>
        <p className="nx-label mb-3">Live Analytics</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard value={analytics?.totalUsers ?? '—'} label="Total Users" color="var(--accent2)" delay={0.1} />
          <StatCard value={analytics?.onlineNow ?? '—'} label="Online Now" color="var(--accent5)" delay={0.15} />
          <StatCard value="19" label="Built-in Tools" color="var(--accent4)" delay={0.2} />
          <StatCard value="24+" label="Languages" color="var(--accent3)" delay={0.25} />
        </div>
      </div>

      {/* ── WHY I BUILT NEXUS ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="nx-card p-6">
        <p className="nx-label mb-4">Why Nexus Was Built</p>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
          <p>
            Nexus was built with one mission: <strong style={{ color: 'var(--text)' }}>to give everyone — from a 5-year-old to a 90-year-old — a single place where technology feels simple, powerful, and welcoming.</strong>
          </p>
          <p>
            The web is full of apps that do one thing well. You need a calculator — one app. An AI assistant — another. A journal — yet another. Music, news, health tracking, budgeting... each a separate download, a separate login, a separate learning curve.
          </p>
          <p style={{ color: 'var(--text)' }} className="font-semibold">
            Nexus breaks that pattern. Everything you need, in one installable app, that works offline, in your language, on any device.
          </p>
          <p>
            As a solo developer at <a href="https://webcraft-studioo.netlify.app" target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--accent2)' }}>WebCraft Studio</a>, building this was a statement: great software doesn&apos;t require a large team. It requires the right vision, relentless attention to detail, and genuine care for the people who use it.
          </p>
          <p>
            Nexus is free, open to everyone, and will keep growing. New tools, new AI features, more languages — this is just version 1.0.
          </p>
        </div>
      </motion.div>

      {/* ── FEATURES ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="nx-card p-6">
        <p className="nx-label mb-2">What Makes Nexus Different</p>
        <div>
          {[
            { icon: '⚡', title: 'Works Offline', desc: 'Core tools are cached — use Nexus anywhere, even without internet.', color: 'var(--accent4)' },
            { icon: '◈', title: '19 Built-in Tools', desc: 'AI chat, games, health, music, calculator, journal, budget, and much more.', color: 'var(--accent1)' },
            { icon: '◉', title: 'AI-Powered', desc: 'Powered by OpenRouter (free models) and Gemini — bring your own key for unlimited use.', color: 'var(--accent2)' },
            { icon: '✦', title: 'For Every Age', desc: 'Designed to be usable by children and seniors alike. Simple, intuitive, fast.', color: 'var(--accent5)' },
            { icon: '◆', title: '5 Themes', desc: 'Personalize your experience with Dark Glass, Vibrant Light, Midnight Purple, and more.', color: 'var(--accent3)' },
            { icon: '●', title: 'Installable PWA', desc: 'Add to any home screen — iPhone, Android, Windows, Mac. No app store required.', color: 'var(--accent4)' },
          ].map(f => <FeatureRow key={f.title} {...f} />)}
        </div>
      </motion.div>

      {/* ── WEBCRAFT STUDIO ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="relative nx-card p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(6,214,160,0.04))' }} />
        <div className="relative z-10">
          <p className="nx-label mb-4">Built by WebCraft Studio</p>
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <h3 className="font-display font-black text-xl mb-1" style={{ color: 'var(--text)' }}>WebCraft Studio</h3>
              <p className="text-sm italic mb-3" style={{ color: 'var(--accent2)' }}>"Your Vision. Engineered to Perfection."</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text2)' }}>
                WebCraft Studio is a solo development studio specializing in custom websites, PWAs, and frontend development. Every project is handled personally — from discovery to deployment — with precision, speed, and care.
              </p>

              {/* Services promo */}
              <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>
                <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--accent2)' }}>Services Available</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Custom Websites', 'Progressive Web Apps', 'Frontend Development', 'UI/UX Design', 'Performance & SEO', 'Website Maintenance'].map(s => (
                    <div key={s} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--accent5)' }}>→</span> {s}
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://webcraft-studioo.netlify.app/hire" target="_blank" rel="noreferrer"
                className="nx-btn nx-btn-primary inline-flex text-sm">
                Hire WebCraft Studio →
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── SOCIALS ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="nx-card p-6">
        <p className="nx-label mb-4">Follow WebCraft Studio</p>
        <div className="flex flex-wrap gap-2">
          <SocialBtn href="https://www.facebook.com/share/17mG4Xw1YK/" icon="f" label="Facebook" color="var(--accent1)" />
          <SocialBtn href="https://www.instagram.com/webcraft_studi0" icon="◈" label="Instagram" color="var(--accent3)" />
          <SocialBtn href="https://www.threads.com/@webcraft_studi0" icon="◉" label="Threads" color="var(--text)" />
          <SocialBtn href="https://x.com/WebCraftStudioo" icon="✕" label="X / Twitter" color="var(--text)" />
          <SocialBtn href="https://www.linkedin.com/in/webcraft-studio-4b43623ba" icon="in" label="LinkedIn" color="var(--accent2)" />
          <SocialBtn href="https://webcraft-studioo.netlify.app" icon="◆" label="Website" color="var(--accent5)" />
        </div>
      </motion.div>

      {/* ── DONATE CTA ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="relative rounded-3xl p-6 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,157,0.12), rgba(255,209,102,0.08))', border: '1px solid rgba(255,107,157,0.2)' }}>
        <p className="font-display font-black text-xl mb-2" style={{ color: 'var(--text)' }}>Love Nexus? Support It</p>
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          Nexus is free for everyone. If it helps you, consider buying me a coffee — it keeps the servers running and new features coming.
        </p>
        <button onClick={() => navigate('/donate')} className="nx-btn nx-btn-primary">
          ♥ Support Nexus
        </button>
      </motion.div>

      {/* Footer */}
      <div className="text-center py-2">
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          © 2026 WebCraft Studio · All rights reserved · Nexus v1.0.0
        </p>
      </div>
    </div>
  )
}
