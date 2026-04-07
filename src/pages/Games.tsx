import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxGamepad, NxRefresh, NxX } from '@/components/icons/NexusIcons'

type GameId = 'menu' | 'memory' | 'math' | 'reaction'

// ── MEMORY MATCH ──────────────────────────────────────
const CARD_SYMBOLS = ['◈','◉','◎','◆','●','✦','◐','◑']
const ALL_CARDS = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
  .map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }))
  .sort(() => Math.random() - 0.5)

function MemoryGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState(ALL_CARDS.map((c, i) => ({ ...c, id: i })))
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (won) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(t)
  }, [won, startTime])

  const flip = (id: number) => {
    if (selected.length === 2) return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return
    const newSel = [...selected, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    setSelected(newSel)
    if (newSel.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newSel.map(id => cards.find(c => c.id === id)!)
      setTimeout(() => {
        if (a.symbol === b.symbol) {
          setCards(prev => {
            const updated = prev.map(c => newSel.includes(c.id) ? { ...c, matched: true } : c)
            if (updated.every(c => c.matched)) setWon(true)
            return updated
          })
        } else {
          setCards(prev => prev.map(c => newSel.includes(c.id) ? { ...c, flipped: false } : c))
        }
        setSelected([])
      }, 700)
    }
  }

  const reset = () => {
    setCards(ALL_CARDS.map((c, i) => ({ ...c, id: i })).sort(() => Math.random() - 0.5))
    setSelected([]); setMoves(0); setWon(false)
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
        <h2 className="font-display font-bold text-lg flex-1" style={{ color: 'var(--text)' }}>Memory Match</h2>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>{moves} moves · {elapsed}s</span>
        <button onClick={reset} style={{ color: 'var(--muted)' }}><NxRefresh size={18} /></button>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto w-full">
        {cards.map(card => (
          <motion.button key={card.id} onClick={() => flip(card.id)}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.06 }}
            whileTap={{ scale: 0.92 }}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="aspect-square rounded-2xl flex items-center justify-center text-2xl font-bold select-none"
            style={{
              background: card.matched ? 'rgba(6,214,160,0.2)' : card.flipped ? 'rgba(108,99,255,0.2)' : 'var(--card)',
              border: `2px solid ${card.matched ? 'rgba(6,214,160,0.5)' : card.flipped ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`,
              color: card.matched ? 'var(--accent5)' : card.flipped ? 'var(--accent1)' : 'transparent',
              cursor: card.matched ? 'default' : 'pointer',
            }}>
            {(card.flipped || card.matched) ? card.symbol : ''}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6">
            <p className="font-display font-black text-3xl mb-2" style={{
              background: 'linear-gradient(135deg, var(--accent1), var(--accent5))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>You Won!</p>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{moves} moves in {elapsed} seconds</p>
            <button onClick={reset} className="nx-btn nx-btn-primary">Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── MATH QUIZ ─────────────────────────────────────────
function MathQuiz({ onBack }: { onBack: () => void }) {
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [streak, setStreak] = useState(0)
  const [question, setQuestion] = useState({ a: 0, b: 0, op: '+', answer: 0, choices: [] as number[] })
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const timerRef = useRef<number>()

  const genQ = useCallback(() => {
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    let a = Math.floor(Math.random() * 12) + 1
    let b = Math.floor(Math.random() * 12) + 1
    if (op === '-' && b > a) [a, b] = [b, a]
    const answer = op === '+' ? a + b : op === '-' ? a - b : a * b
    const choices = new Set([answer])
    while (choices.size < 4) choices.add(answer + Math.floor(Math.random() * 20) - 10)
    setQuestion({ a, b, op, answer, choices: [...choices].sort(() => Math.random() - 0.5) })
    setTimeLeft(15)
  }, [])

  useEffect(() => { genQ() }, [genQ])

  useEffect(() => {
    clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setWrong(w => w + 1); setStreak(0); genQ(); return 15 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [question, genQ])

  const answer = (choice: number) => {
    clearInterval(timerRef.current)
    const correct = choice === question.answer
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) { setScore(s => s + 1 + Math.floor(streak / 3)); setStreak(s => s + 1) }
    else { setWrong(w => w + 1); setStreak(0) }
    setTimeout(() => { setFeedback(null); genQ() }, 600)
  }

  return (
    <div className="flex flex-col h-full p-4 gap-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
        <h2 className="font-display font-bold text-lg flex-1" style={{ color: 'var(--text)' }}>Math Quiz</h2>
        <div className="flex gap-3 text-sm">
          <span style={{ color: 'var(--accent5)' }}>✓ {score}</span>
          <span style={{ color: 'var(--accent3)' }}>✗ {wrong}</span>
          {streak > 2 && <span style={{ color: 'var(--accent4)' }}>🔥 {streak}</span>}
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div className="h-full rounded-full transition-all"
          style={{ width: `${(timeLeft / 15) * 100}%`, background: timeLeft > 7 ? 'var(--accent5)' : timeLeft > 4 ? 'var(--accent4)' : '#ff4757' }} />
      </div>

      {/* Question */}
      <motion.div key={`${question.a}${question.op}${question.b}`}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center gap-8">
        <motion.div
          animate={feedback === 'correct' ? { scale: [1, 1.1, 1], color: ['#f0f2ff', '#06d6a0', '#f0f2ff'] } :
                   feedback === 'wrong'   ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="font-display font-black text-6xl text-center"
          style={{ color: 'var(--text)' }}>
          {question.a} {question.op} {question.b} = ?
        </motion.div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {question.choices.map((choice, i) => (
            <motion.button key={`${choice}-${i}`}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
              onClick={() => answer(choice)}
              className="py-5 rounded-2xl font-display font-black text-2xl"
              style={{
                background: feedback === 'correct' && choice === question.answer ? 'rgba(6,214,160,0.25)' :
                             feedback === 'wrong'   && choice !== question.answer ? 'rgba(255,71,87,0.15)' :
                             'var(--card)',
                border: `2px solid ${feedback === 'correct' && choice === question.answer ? 'rgba(6,214,160,0.6)' :
                                     'var(--border)'}`,
                color: 'var(--text)',
              }}>
              {choice}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ── REACTION TIME ─────────────────────────────────────
function ReactionGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'wait' | 'ready' | 'go' | 'result'>('wait')
  const [times, setTimes] = useState<number[]>([])
  const [startTime, setStartTime] = useState(0)
  const timerRef = useRef<number>()

  const start = () => {
    setPhase('ready')
    const delay = 1500 + Math.random() * 3000
    timerRef.current = window.setTimeout(() => { setPhase('go'); setStartTime(Date.now()) }, delay)
  }

  const tap = () => {
    if (phase === 'ready') { clearTimeout(timerRef.current); setPhase('wait'); return }
    if (phase === 'go') {
      const rt = Date.now() - startTime
      setTimes(t => [...t, rt])
      setPhase('result')
    }
    if (phase === 'result' || phase === 'wait') start()
  }

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const best = times.length ? Math.min(...times) : 0

  const bgColor = phase === 'go' ? 'var(--accent5)' : phase === 'ready' ? 'var(--accent4)' : 'var(--card)'
  const msg = phase === 'wait' ? 'Tap to Start' : phase === 'ready' ? 'Wait for green...' : phase === 'go' ? 'TAP NOW!' : `${times[times.length-1]}ms`

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
        <h2 className="font-display font-bold text-lg flex-1" style={{ color: 'var(--text)' }}>Reaction Time</h2>
        {times.length > 0 && <span className="text-xs" style={{ color: 'var(--muted)' }}>Best: {best}ms · Avg: {avg}ms</span>}
      </div>

      <motion.button onClick={tap} className="flex-1 rounded-3xl flex flex-col items-center justify-center gap-4"
        animate={{ background: bgColor }} transition={{ duration: 0.15 }}
        style={{ border: '1px solid var(--border)', cursor: 'pointer' }}>
        <motion.p animate={phase === 'go' ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}
          className="font-display font-black text-4xl" style={{ color: phase === 'go' ? '#fff' : 'var(--text)' }}>
          {msg}
        </motion.p>
        {phase === 'result' && (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Tap to try again</p>
        )}
      </motion.button>

      {times.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {times.slice(-8).map((t, i) => (
            <div key={i} className="flex-shrink-0 px-3 py-2 rounded-xl text-center"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="font-mono text-sm font-bold" style={{ color: t < 200 ? 'var(--accent5)' : t < 300 ? 'var(--accent4)' : 'var(--accent3)' }}>{t}ms</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── GAME MENU ─────────────────────────────────────────
const GAMES = [
  { id: 'memory' as GameId, title: 'Memory Match', desc: 'Flip cards and match pairs', color: '#6c63ff', icon: '◈' },
  { id: 'math'   as GameId, title: 'Math Quiz',    desc: 'Quick fire arithmetic under pressure', color: '#00d4ff', icon: '◉' },
  { id: 'reaction' as GameId, title: 'Reaction Time', desc: 'How fast can you react?', color: '#06d6a0', icon: '◎' },
]

export function Games() {
  const [activeGame, setActiveGame] = useState<GameId>('menu')

  if (activeGame === 'memory')   return <MemoryGame onBack={() => setActiveGame('menu')} />
  if (activeGame === 'math')     return <MathQuiz onBack={() => setActiveGame('menu')} />
  if (activeGame === 'reaction') return <ReactionGame onBack={() => setActiveGame('menu')} />

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent4), var(--accent3))' }}>
          <NxGamepad size={22} color="#fff" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Games & Fun</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Mini-games for every age</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {GAMES.map((g, i) => (
          <motion.button key={g.id}
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setActiveGame(g.id)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl text-left"
            style={{ background: 'var(--card)', border: `1px solid ${g.color}20` }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `${g.color}18`, border: `1px solid ${g.color}30`, color: g.color }}>
              {g.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>{g.title}</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{g.desc}</p>
            </div>
            <span className="text-2xl" style={{ color: g.color }}>→</span>
          </motion.button>
        ))}
      </div>

      <div className="nx-card p-5 text-center">
        <p className="font-display font-bold text-base mb-1" style={{ color: 'var(--text)' }}>More Games Coming Soon</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Word Scramble, Sudoku, Snake, and more are in development.</p>
      </div>
    </div>
  )
}
