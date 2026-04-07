import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxCheckSquare, NxPlus, NxX, NxTrash, NxTrendUp } from '@/components/icons/NexusIcons'

interface Habit { id: string; name: string; color: string; icon: string; streak: number; completedDates: string[] }

const KEY = 'nx-habits'
const load = (): Habit[] => JSON.parse(localStorage.getItem(KEY) ?? '[]')
const saveAll = (h: Habit[]) => localStorage.setItem(KEY, JSON.stringify(h))

const COLORS = ['#6c63ff','#00d4ff','#ff6b9d','#ffd166','#06d6a0','#b04aff','#ff4757','#0090ff']
const ICONS  = ['◈','◉','◎','◆','●','✦','◐','◑','▣','◇']
const todayStr = () => new Date().toDateString()

export function Habits() {
  const [habits, setHabits] = useState<Habit[]>(load)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', color: COLORS[0], icon: ICONS[0] })

  const toggle = (id: string) => {
    const today = todayStr()
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h
        const done = h.completedDates.includes(today)
        const newDates = done
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today]
        // Recalculate streak
        let streak = 0
        const d = new Date()
        while (true) {
          if (newDates.includes(d.toDateString())) { streak++; d.setDate(d.getDate() - 1) }
          else break
        }
        return { ...h, completedDates: newDates, streak }
      })
      saveAll(updated); return updated
    })
  }

  const add = () => {
    if (!form.name.trim()) return
    const newHabit: Habit = { id: crypto.randomUUID(), name: form.name.trim(), color: form.color, icon: form.icon, streak: 0, completedDates: [] }
    const updated = [...habits, newHabit]
    setHabits(updated); saveAll(updated)
    setForm({ name: '', color: COLORS[0], icon: ICONS[0] }); setShowForm(false)
  }

  const del = (id: string) => {
    const updated = habits.filter(h => h.id !== id)
    setHabits(updated); saveAll(updated)
  }

  const today = todayStr()
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length
  const last7 = (h: Habit) => Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return h.completedDates.includes(d.toDateString())})

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent5))' }}>
          <NxCheckSquare size={22} color="#fff" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Habits</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{completedToday} / {habits.length} done today</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowForm(true)}
          className="ml-auto nx-btn nx-btn-primary">
          <NxPlus size={16} color="#fff" /> Add Habit
        </motion.button>
      </motion.div>

      {/* Today's progress */}
      {habits.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="nx-card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Today&apos;s Progress</p>
            <p className="text-sm font-bold" style={{ color: 'var(--accent2)' }}>
              {Math.round(completedToday / Math.max(habits.length, 1) * 100)}%
            </p>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completedToday / Math.max(habits.length, 1) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ background: 'linear-gradient(90deg, var(--accent1), var(--accent5))' }} />
          </div>
        </motion.div>
      )}

      {/* Habits list */}
      {habits.length === 0 && (
        <div className="text-center py-16">
          <NxTrendUp size={48} color="var(--border2)" className="mx-auto mb-4" />
          <p className="font-display font-bold text-lg" style={{ color: 'var(--muted)' }}>No habits yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Build your first habit to start tracking</p>
        </div>
      )}

      <div className="space-y-3">
        {habits.map((h, i) => {
          const doneToday = h.completedDates.includes(today)
          const week = last7(h)
          return (
            <motion.div key={h.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="nx-card p-4">
              <div className="flex items-center gap-3">
                {/* Check button */}
                <motion.button whileTap={{ scale: 0.82 }} onClick={() => toggle(h.id)}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: doneToday ? h.color : 'var(--card2)',
                    border: `2px solid ${doneToday ? h.color : 'var(--border)'}`,
                  }}>
                  {doneToday
                    ? <span style={{ color: '#fff', fontSize: '18px' }}>✓</span>
                    : <span style={{ color: h.color, fontSize: '20px' }}>{h.icon}</span>
                  }
                </motion.button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{h.name}</p>
                    {h.streak > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `${h.color}20`, color: h.color }}>
                        {h.streak} day streak
                      </span>
                    )}
                  </div>
                  {/* 7-day dots */}
                  <div className="flex gap-1">
                    {week.map((done, wi) => (
                      <div key={wi} className="w-5 h-5 rounded-md"
                        style={{ background: done ? h.color : 'var(--border)', opacity: done ? 1 : 0.4 }} />
                    ))}
                    <span className="text-xs ml-1 self-center" style={{ color: 'var(--muted)' }}>7d</span>
                  </div>
                </div>

                <button onClick={() => del(h.id)} className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--muted)' }}>
                  <NxTrash size={15} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add habit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md nx-card p-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>New Habit</h3>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
              </div>
              <div className="space-y-4">
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Habit name (e.g. Drink water, Exercise, Read)" className="nx-input" autoFocus />
                <div>
                  <p className="nx-label mb-2">Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                        className="w-8 h-8 rounded-full transition-transform"
                        style={{ background: c, transform: form.color === c ? 'scale(1.25)' : 'scale(1)', boxShadow: form.color === c ? `0 0 0 2px var(--bg), 0 0 0 4px ${c}` : 'none' }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="nx-label mb-2">Icon</p>
                  <div className="flex gap-2 flex-wrap">
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setForm(p => ({ ...p, icon: ic }))}
                        className="w-9 h-9 rounded-xl text-lg transition-all"
                        style={{ background: form.icon === ic ? `${form.color}25` : 'var(--card2)', border: `1px solid ${form.icon === ic ? form.color : 'var(--border)'}`, color: form.icon === ic ? form.color : 'var(--text)' }}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={add} className="nx-btn nx-btn-primary w-full">
                  <NxPlus size={16} color="#fff" /> Create Habit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
