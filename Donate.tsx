import { useState } from 'react'
import { motion } from 'framer-motion'
import { NexusLogo } from '@/components/icons/NexusIcons'

type Method = 'paypal' | 'wise'

function DonateCard({ method, active, onClick }: { method: Method; active: boolean; onClick: () => void }) {
  const config = {
    paypal: {
      name: 'PayPal',
      icon: '◈',
      color: 'var(--accent2)',
      desc: 'Fast, secure, trusted worldwide',
      gradient: 'linear-gradient(135deg, rgba(0,112,200,0.15), rgba(0,212,255,0.08))',
      border: 'rgba(0,112,200,0.3)',
    },
    wise: {
      name: 'Wise',
      icon: '◆',
      color: 'var(--accent5)',
      desc: 'Great for international transfers',
      gradient: 'linear-gradient(135deg, rgba(6,214,160,0.12), rgba(0,212,255,0.06))',
      border: 'rgba(6,214,160,0.3)',
    },
  }[method]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex-1 p-5 rounded-2xl text-left transition-all"
      style={{
        background: active ? config.gradient : 'var(--card)',
        border: active ? `2px solid ${config.border}` : '2px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${config.color}18`, border: `1px solid ${config.color}30`, color: config.color }}>
          {config.icon}
        </div>
        <div>
          <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>{config.name}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{config.desc}</p>
        </div>
      </div>
      {active && (
        <div className="mt-1 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.color }} />
          <span className="text-xs font-semibold" style={{ color: config.color }}>Selected</span>
        </div>
      )}
    </motion.button>
  )
}

// Preset amounts
const AMOUNTS = [1, 3, 5, 10, 20, 50]

export function Donate() {
  const [method, setMethod] = useState<Method>('paypal')
  const [amount, setAmount] = useState(5)
  const [customAmount, setCustomAmount] = useState('')

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount

  // IMPORTANT: Replace these placeholder links with your real PayPal and Wise donation links
  const PAYPAL_LINK = 'https://paypal.me/WebCraftStudio' // ← Replace with your real PayPal.me link
  const WISE_LINK = 'https://wise.com/pay/me/WebCraftStudio' // ← Replace with your real Wise link

  const handleDonate = () => {
    const link = method === 'paypal' ? PAYPAL_LINK : WISE_LINK
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-12">

      {/* ── HERO ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-8 text-center overflow-hidden"
        style={{ background: 'var(--glass)', border: '1px solid var(--border)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,107,157,0.1), rgba(255,209,102,0.06), rgba(108,99,255,0.06))' }} />

        {/* Floating hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div key={i}
            className="absolute text-sm pointer-events-none"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 40}%`,
              color: ['var(--accent3)', 'var(--accent4)', 'var(--accent1)'][i % 3],
              opacity: 0.15,
              fontSize: `${12 + i * 2}px`,
            }}
            animate={{ y: [-8, 0, -8], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}>
            ♥
          </motion.div>
        ))}

        <div className="relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="text-5xl mb-4 inline-block">
            <NexusLogo size={56} />
          </motion.div>
          <h1 className="font-display font-black text-3xl mb-2" style={{ color: 'var(--text)' }}>
            Support <span style={{ background: 'linear-gradient(135deg,var(--accent3),var(--accent4))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Nexus</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Keep Nexus free, growing, and ad-free for everyone
          </p>
        </div>
      </motion.div>

      {/* ── WHY DONATE ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="nx-card p-6">
        <p className="nx-label mb-4">Why Your Support Matters</p>
        <div className="space-y-3 text-sm" style={{ color: 'var(--text2)' }}>
          <p>
            Nexus is completely <strong style={{ color: 'var(--text)' }}>free to use, forever.</strong> There are no ads, no subscriptions, no hidden fees. Every tool — all 19 of them — available to anyone, on any device, in any language.
          </p>
          <p>
            But building and maintaining Nexus takes real work: server costs, AI API costs, design, development, and continuous updates. As a solo developer at WebCraft Studio, every donation — no matter how small — directly funds the next feature, the next language, the next tool.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {[
              { amount: '$1', what: 'Covers 1 day of server costs', color: 'var(--accent5)' },
              { amount: '$5', what: 'Funds a new feature or tool', color: 'var(--accent2)' },
              { amount: '$10+', what: 'Supports a full month of development', color: 'var(--accent4)' },
            ].map(item => (
              <div key={item.amount} className="p-3 rounded-xl text-center"
                style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}>
                <p className="font-display font-black text-xl" style={{ color: item.color }}>{item.amount}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{item.what}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── DONATION METHOD ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="nx-card p-6">
        <p className="nx-label mb-4">Choose Payment Method</p>
        <div className="flex gap-3">
          <DonateCard method="paypal" active={method === 'paypal'} onClick={() => setMethod('paypal')} />
          <DonateCard method="wise" active={method === 'wise'} onClick={() => setMethod('wise')} />
        </div>
      </motion.div>

      {/* ── AMOUNT PICKER ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="nx-card p-6">
        <p className="nx-label mb-4">Choose an Amount</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {AMOUNTS.map(a => (
            <motion.button key={a}
              onClick={() => { setAmount(a); setCustomAmount('') }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: amount === a && !customAmount ? 'linear-gradient(135deg, var(--accent3), var(--accent4))' : 'var(--card2)',
                border: amount === a && !customAmount ? '1px solid rgba(255,107,157,0.4)' : '1px solid var(--border)',
                color: amount === a && !customAmount ? '#fff' : 'var(--text)',
              }}>
              ${a}
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: 'var(--muted)' }}>$</span>
          <input
            type="number"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); setAmount(0) }}
            placeholder="Custom amount"
            className="nx-input pl-8"
            min="0.5"
            step="0.5"
          />
        </div>

        {/* Donate button */}
        <motion.button
          onClick={handleDonate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 w-full py-4 rounded-2xl font-display font-black text-lg text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent4))', boxShadow: '0 8px 32px rgba(255,107,157,0.3)' }}>
          <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity" />
          <span className="relative">
            Donate ${finalAmount > 0 ? finalAmount.toFixed(2) : '—'} via {method === 'paypal' ? 'PayPal' : 'Wise'} ♥
          </span>
        </motion.button>

        <p className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
          You will be redirected to {method === 'paypal' ? 'PayPal' : 'Wise'} to complete your donation securely. No account required for PayPal.
        </p>
      </motion.div>

      {/* ── WHAT YOU GET ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="nx-card p-6">
        <p className="nx-label mb-4">What Every Donor Gets</p>
        <div className="space-y-3">
          {[
            { icon: '♥', text: 'Genuine gratitude from a solo developer who built this for you', color: 'var(--accent3)' },
            { icon: '◆', text: 'The satisfaction of keeping free tools alive for millions of people', color: 'var(--accent4)' },
            { icon: '✦', text: 'Future updates, new tools, and new AI features fuelled by your support', color: 'var(--accent1)' },
            { icon: '◉', text: 'A cleaner internet — no ads, no tracking, no monetization of your data', color: 'var(--accent2)' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-lg flex-shrink-0" style={{ color: item.color }}>{item.icon}</span>
              <p className="text-sm" style={{ color: 'var(--text2)' }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer note */}
      <div className="text-center py-2 space-y-1">
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Donations go directly to WebCraft Studio to support Nexus development.
        </p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Not a charity — donations are not tax-deductible. Thank you from the bottom of my heart. ♥
        </p>
        <a href="https://webcraft-studioo.netlify.app" target="_blank" rel="noreferrer"
          className="text-xs hover:underline" style={{ color: 'var(--accent2)' }}>
          webcraft-studioo.netlify.app
        </a>
      </div>
    </div>
  )
}
