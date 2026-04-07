import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxTimer, NxPlay, NxPause, NxRefresh, NxPlus, NxX } from '@/components/icons/NexusIcons'

type Mode = 'timer' | 'stopwatch'

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`
}

const PRESETS = [
  { label: '1 min',  ms: 60000 },
  { label: '5 min',  ms: 300000 },
  { label: '10 min', ms: 600000 },
  { label: '15 min', ms: 900000 },
  { label: '25 min', ms: 1500000 },
  { label: '30 min', ms: 1800000 },
]

export function TimerPage() {
  const [mode, setMode] = useState<Mode>('timer')
  // Timer
  const [timerDuration, setTimerDuration] = useState(300000) // 5 min default
  const [timerRemaining, setTimerRemaining] = useState(300000)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  // Stopwatch
  const [swElapsed, setSwElapsed] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  // Custom timer input
  const [customH, setCustomH] = useState('')
  const [customM, setCustomM] = useState('')
  const [customS, setCustomS] = useState('')

  const intervalRef = useRef<number | null>(null)
  const lastTick = useRef(0)

  useEffect(() => {
    if (timerRunning && mode === 'timer') {
      lastTick.current = Date.now()
      intervalRef.current = window.setInterval(() => {
        const now = Date.now()
        const delta = now - lastTick.current
        lastTick.current = now
        setTimerRemaining(prev => {
          if (prev <= delta) {
            setTimerRunning(false)
            setTimerDone(true)
            clearInterval(intervalRef.current!)
            return 0
          }
          return prev - delta
        })
      }, 50)
    } else if (swRunning && mode === 'stopwatch') {
      lastTick.current = Date.now()
      intervalRef.current = window.setInterval(() => {
        const now = Date.now()
        setSwElapsed(e => e + (now - lastTick.current))
        lastTick.current = now
      }, 50)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning, swRunning, mode])

  const setCustomTimer = () => {
    const h = parseInt(customH) || 0
    const m = parseInt(customM) || 0
    const s = parseInt(customS) || 0
    const ms = (h * 3600 + m * 60 + s) * 1000
    if (ms > 0) { setTimerDuration(ms); setTimerRemaining(ms); setTimerRunning(false); setTimerDone(false) }
  }

  const resetTimer = () => { setTimerRemaining(timerDuration); setTimerRunning(false); setTimerDone(false) }
  const resetSw = () => { setSwElapsed(0); setSwRunning(false); setLaps([]) }
  const lap = () => { setLaps(l => [swElapsed, ...l]) }

  const progress = timerRemaining / timerDuration
  const SIZE = 220, STROKE = 14
  const r = (SIZE - STROKE) / 2
  const circ = 2 * Math.PI * r

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-5 pb-12">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {(['timer','stopwatch'] as Mode[]).map(m => (
          <motion.button key={m} whileTap={{ scale: 0.96 }}
            onClick={() => setMode(m)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
            style={{
              background: mode === m ? 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,255,0.1))' : 'transparent',
              border: mode === m ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
              color: mode === m ? 'var(--text)' : 'var(--muted)',
            }}>
            {m}
          </motion.button>
        ))}
      </div>

      {/* Timer mode */}
      {mode === 'timer' && (
        <div className="space-y-5">
          {/* Ring */}
          <div className="flex justify-center">
            <div className="relative" style={{ width: SIZE, height: SIZE }}>
              <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
                <motion.circle
                  cx={SIZE/2} cy={SIZE/2} r={r} fill="none"
                  stroke={timerDone ? '#ff4757' : 'url(#tg)'}
                  strokeWidth={STROKE} strokeLinecap="round"
                  strokeDasharray={circ}
                  animate={{ strokeDashoffset: circ * (1 - progress) }}
                  transition={{ duration: 0.1 }}
                />
                <defs>
                  <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent1)" />
                    <stop offset="100%" stopColor="var(--accent2)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <NxTimer size={28} color={timerDone ? '#ff4757' : 'var(--accent1)'} />
                <motion.p
                  animate={timerDone ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: timerDone ? Infinity : 0, duration: 0.5 }}
                  className="font-mono font-black text-3xl mt-1"
                  style={{ color: timerDone ? '#ff4757' : 'var(--text)' }}>
                  {fmt(timerRemaining)}
                </motion.p>
                {timerDone && <p className="text-xs font-bold" style={{ color: '#ff4757' }}>Time&apos;s up!</p>}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <motion.button whileTap={{ scale: 0.88 }} onClick={resetTimer}
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              <NxRefresh size={22} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.88 }}
              onClick={() => { setTimerRunning(!timerRunning); setTimerDone(false) }}
              disabled={timerRemaining === 0 && !timerDone}
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: timerRunning ? 'rgba(255,71,87,0.2)' : 'linear-gradient(135deg, var(--accent1), var(--accent2))', border: 'none' }}>
              {timerRunning ? <NxPause size={30} color={timerRunning ? '#ff4757' : '#fff'} /> : <NxPlay size={30} color="#fff" />}
            </motion.button>
          </div>

          {/* Presets */}
          <div>
            <p className="nx-label mb-2">Quick Presets</p>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map(p => (
                <motion.button key={p.ms} whileTap={{ scale: 0.95 }}
                  onClick={() => { setTimerDuration(p.ms); setTimerRemaining(p.ms); setTimerRunning(false); setTimerDone(false) }}
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: timerDuration === p.ms ? 'rgba(108,99,255,0.2)' : 'var(--card)',
                    border: `1px solid ${timerDuration === p.ms ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`,
                    color: timerDuration === p.ms ? 'var(--accent2)' : 'var(--text2)',
                  }}>
                  {p.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom */}
          <div className="nx-card p-4">
            <p className="nx-label mb-3">Custom Duration</p>
            <div className="flex gap-2 items-end">
              {[{label:'HH', val:customH, set:setCustomH},{label:'MM', val:customM, set:setCustomM},{label:'SS', val:customS, set:setCustomS}].map(f => (
                <div key={f.label} className="flex-1">
                  <label className="text-xs" style={{ color: 'var(--muted)' }}>{f.label}</label>
                  <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
                    placeholder="00" className="nx-input text-center text-lg font-mono font-bold" min="0" />
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.9 }} onClick={setCustomTimer}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', color: '#fff', flexShrink: 0 }}>
                Set
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Stopwatch mode */}
      {mode === 'stopwatch' && (
        <div className="space-y-5">
          <div className="nx-card p-8 text-center">
            <motion.p
              className="font-mono font-black text-5xl"
              animate={swRunning ? { opacity: 1 } : { opacity: 0.7 }}
              style={{ color: 'var(--accent2)' }}>
              {fmt(swElapsed)}
            </motion.p>
            {laps.length > 0 && (
              <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                Last lap: {fmt(laps[0] - (laps[1] ?? 0))}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <motion.button whileTap={{ scale: 0.88 }}
              onClick={swRunning ? lap : resetSw}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '12px', fontWeight: 700 }}>
              {swRunning ? 'LAP' : <NxRefresh size={22} />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setSwRunning(!swRunning)}
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: swRunning ? 'rgba(255,71,87,0.2)' : 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
              {swRunning ? <NxPause size={30} color="#ff4757" /> : <NxPlay size={30} color="#fff" />}
            </motion.button>
          </div>

          {/* Laps */}
          {laps.length > 0 && (
            <div className="nx-card p-4">
              <p className="nx-label mb-3">Laps</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {laps.map((lap, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>Lap {laps.length - i}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: i === 0 ? 'var(--accent2)' : 'var(--text)' }}>
                      {fmt(lap - (laps[i+1] ?? 0))}
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'var(--muted)' }}>{fmt(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
