import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxBookOpen, NxPlus, NxX, NxRefresh, NxChevronRight } from '@/components/icons/NexusIcons'
import { useNavigate } from 'react-router-dom'

interface Card { id: string; front: string; back: string }
interface Deck { id: string; name: string; color: string; cards: Card[] }

const KEY = 'nx-study'
const load = (): Deck[] => JSON.parse(localStorage.getItem(KEY) ?? '[]')
const saveAll = (d: Deck[]) => localStorage.setItem(KEY, JSON.stringify(d))

const DEMO_DECK: Deck = {
  id: 'demo', name: 'Quick Start', color: '#6c63ff',
  cards: [
    { id: '1', front: 'What is a PWA?', back: 'Progressive Web App — a web app with native-like features: offline support, installable, fast.' },
    { id: '2', front: 'What is React?', back: 'A JavaScript library for building user interfaces using components.' },
    { id: '3', front: 'What is TypeScript?', back: 'A typed superset of JavaScript that compiles to plain JavaScript.' },
    { id: '4', front: 'What is Supabase?', back: 'An open-source Firebase alternative with PostgreSQL, Auth, and Storage.' },
  ]
}

const COLORS = ['#6c63ff','#00d4ff','#ff6b9d','#ffd166','#06d6a0','#b04aff']

function FlashCard({ card, onKnow, onReview }: { card: Card; onKnow: () => void; onReview: () => void }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <motion.div onClick={() => setFlipped(!flipped)}
        className="w-full rounded-3xl cursor-pointer select-none"
        style={{ perspective: '1000px', minHeight: '220px' }}>
        <motion.div animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '220px' }}>
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-3xl"
            style={{ backfaceVisibility: 'hidden', background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Question</p>
            <p className="font-display font-bold text-xl text-center" style={{ color: 'var(--text)' }}>{card.front}</p>
            <p className="text-xs mt-4" style={{ color: 'var(--muted)' }}>Tap to reveal answer</p>
          </div>
          {/* Back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-3xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(0,212,255,0.08))', border: '1px solid rgba(108,99,255,0.3)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Answer</p>
            <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text)' }}>{card.back}</p>
          </div>
        </motion.div>
      </motion.div>

      {flipped && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 w-full">
          <motion.button whileTap={{ scale: 0.95 }} onClick={onReview}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm"
            style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff4757' }}>
            Need Review
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onKnow}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm"
            style={{ background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.3)', color: 'var(--accent5)' }}>
            Got It!
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export function Study() {
  const navigate = useNavigate()
  const [decks, setDecks] = useState<Deck[]>(() => {
    const d = load()
    return d.length ? d : [DEMO_DECK]
  })
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null)
  const [cardIdx, setCardIdx] = useState(0)
  const [known, setKnown] = useState(0)
  const [review, setReview] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', color: COLORS[0] })
  const [done, setDone] = useState(false)

  const startDeck = (deck: Deck) => {
    setActiveDeck(deck); setCardIdx(0); setKnown(0); setReview(0); setDone(false)
  }

  const handleKnow = () => {
    setKnown(k => k + 1)
    if (cardIdx + 1 >= activeDeck!.cards.length) setDone(true)
    else setCardIdx(i => i + 1)
  }

  const handleReview = () => {
    setReview(r => r + 1)
    if (cardIdx + 1 >= activeDeck!.cards.length) setDone(true)
    else setCardIdx(i => i + 1)
  }

  const addDeck = () => {
    if (!form.name.trim()) return
    const deck: Deck = { id: crypto.randomUUID(), name: form.name.trim(), color: form.color, cards: [] }
    const updated = [...decks, deck]
    setDecks(updated); saveAll(updated)
    setForm({ name: '', color: COLORS[0] }); setShowForm(false)
  }

  // Session view
  if (activeDeck && !done) {
    const card = activeDeck.cards[cardIdx]
    const total = activeDeck.cards.length
    return (
      <div className="flex flex-col h-full p-4 gap-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveDeck(null)} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
          <div className="flex-1">
            <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>{activeDeck.name}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Card {cardIdx + 1} of {total}</p>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div className="h-full rounded-full" style={{ width: `${(cardIdx / total) * 100}%`, background: `linear-gradient(90deg, ${activeDeck.color}, var(--accent2))` }} />
        </div>
        <div className="flex-1 flex items-center">
          {card ? <FlashCard card={card} onKnow={handleKnow} onReview={handleReview} /> :
            <div className="text-center w-full"><p style={{ color: 'var(--muted)' }}>No cards in this deck yet.</p></div>}
        </div>
        <div className="flex gap-4 justify-center text-sm">
          <span style={{ color: 'var(--accent5)' }}>✓ {known} known</span>
          <span style={{ color: '#ff4757' }}>◎ {review} review</span>
        </div>
      </div>
    )
  }

  // Done screen
  if (done && activeDeck) {
    const total = activeDeck.cards.length
    const pct = Math.round((known / total) * 100)
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 gap-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: pct >= 70 ? 'rgba(6,214,160,0.2)' : 'rgba(255,209,102,0.2)', border: `2px solid ${pct >= 70 ? 'var(--accent5)' : 'var(--accent4)'}` }}>
          <span className="text-4xl font-black" style={{ color: pct >= 70 ? 'var(--accent5)' : 'var(--accent4)' }}>{pct}%</span>
        </motion.div>
        <div className="text-center">
          <h2 className="font-display font-black text-2xl mb-1" style={{ color: 'var(--text)' }}>
            {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Progress!' : 'Keep Practicing!'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{known} / {total} cards mastered</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startDeck(activeDeck)} className="nx-btn nx-btn-ghost"><NxRefresh size={16} /> Try Again</button>
          <button onClick={() => setActiveDeck(null)} className="nx-btn nx-btn-primary">All Decks</button>
        </div>
        <button onClick={() => navigate('/ai')} className="text-sm" style={{ color: 'var(--accent2)' }}>
          Ask Nexus AI to explain anything →
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent5), var(--accent2))' }}>
          <NxBookOpen size={22} color="#fff" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Study Hub</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Flashcards, quizzes & AI tutor</p>
        </div>
        <button onClick={() => setShowForm(true)} className="nx-btn nx-btn-primary"><NxPlus size={16} color="#fff" /> New Deck</button>
      </motion.div>

      {/* AI tutor CTA */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        onClick={() => navigate('/ai')}
        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
        style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,255,0.08))', border: '1px solid rgba(108,99,255,0.2)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
          <span className="text-white font-bold text-lg">✦</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Nexus AI Tutor</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Ask questions, get explanations, generate quiz content</p>
        </div>
        <NxChevronRight size={18} color="var(--muted)" />
      </motion.button>

      {/* Decks */}
      <div className="space-y-3">
        {decks.map((deck, i) => (
          <motion.button key={deck.id}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => startDeck(deck)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
            style={{ background: 'var(--card)', border: `1px solid ${deck.color}20` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-black text-2xl"
              style={{ background: `${deck.color}18`, color: deck.color }}>
              {deck.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold" style={{ color: 'var(--text)' }}>{deck.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{deck.cards.length} cards</p>
            </div>
            <NxChevronRight size={18} color="var(--muted)" />
          </motion.button>
        ))}
      </div>

      {/* New deck modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm nx-card p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>New Deck</h3>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
              </div>
              <div className="space-y-3">
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Deck name (e.g. Biology, Spanish)" className="nx-input" autoFocus />
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                      className="w-8 h-8 rounded-full transition-transform"
                      style={{ background: c, transform: form.color === c ? 'scale(1.25)' : 'scale(1)', boxShadow: form.color === c ? `0 0 0 2px var(--bg), 0 0 0 4px ${c}` : 'none' }} />
                  ))}
                </div>
                <button onClick={addDeck} className="nx-btn nx-btn-primary w-full"><NxPlus size={16} color="#fff" /> Create Deck</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
