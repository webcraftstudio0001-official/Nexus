import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxSmile, NxTrendUp, NxPlus } from '@/components/icons/NexusIcons'

interface MoodEntry { id: string; mood: number; note: string; date: string }

const KEY = 'nx-moods'
const load = (): MoodEntry[] => JSON.parse(localStorage.getItem(KEY) ?? '[]')
const saveAll = (e: MoodEntry[]) => localStorage.setItem(KEY, JSON.stringify(e))

const MOODS = [
  { level: 5, label: 'Amazing', color: '#06d6a0', icon: '◈', bg: 'rgba(6,214,160,0.15)' },
  { level: 4, label: 'Good',    color: '#00d4ff', icon: '◉', bg: 'rgba(0,212,255,0.12)' },
  { level: 3, label: 'Okay',    color: '#ffd166', icon: '◎', bg: 'rgba(255,209,102,0.12)' },
  { level: 2, label: 'Low',     color: '#ff6b9d', icon: '◐', bg: 'rgba(255,107,157,0.12)' },
  { level: 1, label: 'Rough',   color: '#ff4757', icon: '◑', bg: 'rgba(255,71,87,0.12)' },
]

export function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>(load)
  const [selected, setSelected] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)

  const todayStr = new Date().toDateString()
  const todayEntry = entries.find(e => new Date(e.date).toDateString() === todayStr)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const ds = d.toDateString()
    const entry = entries.find(e => new Date(e.date).toDateString() === ds)
    return { date: d, entry }
  })

  const avg = entries.length > 0
    ? (entries.slice(0, 30).reduce((s, e) => s + e.mood, 0) / Math.min(entries.length, 30)).toFixed(1)
    : '—'

  const log = () => {
    if (selected === null) return
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: selected,
      note: note.trim(),
      date: new Date().toISOString(),
    }
    const updated = [entry, ...entries.filter(e => new Date(e.date).toDateString() !== todayStr)]
    setEntries(updated); saveAll(updated)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
    setSelected(null); setNote('')
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent3), var(--accent4))' }}>
          <NxSmile size={22} color="#fff" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Mood Tracker</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>How are you feeling today?</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-display font-black text-2xl" style={{ color: 'var(--accent5)' }}>{avg}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>30-day avg</p>
        </div>
      </motion.div>

      {/* Today's check-in */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="nx-card p-5">
        <p className="nx-label mb-4">{todayEntry ? 'Update' : 'Log'} Today&apos;s Mood</p>
        <div className="flex gap-2 justify-between mb-4">
          {MOODS.map(m => (
            <motion.button key={m.level} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(m.level)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
              style={{
                background: selected === m.level ? m.bg : 'var(--card2)',
                border: `2px solid ${selected === m.level ? m.color : 'var(--border)'}`,
              }}>
              <span className="text-2xl font-bold" style={{ color: m.color }}>{m.icon}</span>
              <span className="text-xs font-semibold" style={{ color: selected === m.level ? m.color : 'var(--muted)' }}>{m.label}</span>
            </motion.button>
          ))}
        </div>
        <textarea value={note} onChange={e => setNote(e.target.value)}
          placeholder="Add a note (optional)..." className="nx-input text-sm w-full mb-3"
          style={{ minHeight: '70px', resize: 'none' }} />
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-2.5 rounded-xl text-center text-sm font-semibold"
              style={{ background: 'rgba(6,214,160,0.15)', color: 'var(--accent5)' }}>
              ◈ Mood logged!
            </motion.div>
          ) : (
            <motion.button key="log" whileTap={{ scale: 0.97 }} onClick={log} disabled={selected === null}
              className="nx-btn nx-btn-primary w-full">
              <NxPlus size={16} color="#fff" /> Log Mood
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 7-day chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="nx-card p-5">
        <p className="nx-label mb-4">Past 7 Days</p>
        <div className="flex items-end gap-2 h-24">
          {last7.map(({ date, entry }, i) => {
            const m = entry ? MOODS.find(mo => mo.level === entry.mood) : null
            const heightPct = entry ? (entry.mood / 5) * 100 : 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.5, origin: 'bottom' }}
                  className="w-full rounded-t-lg"
                  style={{
                    height: entry ? `${heightPct}%` : '4px',
                    background: m ? m.color : 'var(--border)',
                    minHeight: '4px',
                    transformOrigin: 'bottom',
                    opacity: entry ? 1 : 0.3,
                  }} />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {date.toLocaleDateString([], { weekday: 'narrow' })}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* History */}
      {entries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="nx-card p-5">
          <p className="nx-label mb-3">Recent Entries</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.slice(0, 20).map((entry, i) => {
              const m = MOODS.find(mo => mo.level === entry.mood)!
              return (
                <motion.div key={entry.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-xl flex-shrink-0 mt-0.5" style={{ color: m.color }}>{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: m.color }}>{m.label}</span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {entry.note && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text2)' }}>{entry.note}</p>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
