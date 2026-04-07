import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NxHeart, NxSteps, NxDroplet, NxSleep, NxPlus, NxTrendUp } from '@/components/icons/NexusIcons'

interface DayLog { steps: number; water: number; sleep: number; calories: number; date: string }

const STORAGE_KEY = 'nx-health-logs'

function getRing(value: number, max: number, color: string, size = 110, stroke = 10) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const progress = Math.min(value / max, 1)
  return { r, circumference, dashOffset: circumference * (1 - progress), color }
}

function HealthRing({ value, max, color, icon: Icon, label, unit, onAdd }: {
  value: number; max: number; color: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  label: string; unit: string; onAdd: (v: number) => void
}) {
  const SIZE = 120, STROKE = 11
  const { r, circumference, dashOffset } = getRing(value, max, color, SIZE, STROKE)
  const pct = Math.round((value / max) * 100)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      className="nx-card p-5 flex flex-col items-center gap-3">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
          <motion.circle
            cx={SIZE/2} cy={SIZE/2} r={r}
            fill="none" stroke={color} strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon size={22} color={color} />
          <p className="font-display font-black text-lg leading-none mt-1" style={{ color }}>
            {value.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{pct}%</p>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{label}</p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>Goal: {max.toLocaleString()} {unit}</p>
      </div>
      <div className="flex gap-2">
        {[label === 'Steps' ? 1000 : label === 'Water' ? 250 : label === 'Sleep' ? 0.5 : 100].concat(
          label === 'Steps' ? [5000] : label === 'Water' ? [500] : label === 'Sleep' ? [1] : [250]
        ).map(inc => (
          <motion.button key={inc} whileTap={{ scale: 0.9 }}
            onClick={() => onAdd(inc)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
            +{inc} {unit}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

const GOALS = { steps: 10000, water: 2000, sleep: 8, calories: 2000 }

export function Health() {
  const [today, setToday] = useState<DayLog>(() => {
    const date = new Date().toDateString()
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const logs: DayLog[] = JSON.parse(stored)
      const todayLog = logs.find(l => l.date === date)
      if (todayLog) return todayLog
    }
    return { steps: 0, water: 0, sleep: 0, calories: 0, date }
  })
  const [logs, setLogs] = useState<DayLog[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [customInput, setCustomInput] = useState({ steps: '', water: '', sleep: '', calories: '' })

  const save = (updated: DayLog) => {
    setToday(updated)
    const newLogs = [updated, ...logs.filter(l => l.date !== updated.date)].slice(0, 30)
    setLogs(newLogs)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs))
  }

  const add = (field: keyof typeof GOALS, amount: number) => {
    save({ ...today, [field]: today[field] + amount })
  }

  const overallPct = Math.round(
    (Object.keys(GOALS) as (keyof typeof GOALS)[])
      .reduce((sum, k) => sum + Math.min(today[k] / GOALS[k], 1), 0) / 4 * 100
  )

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ff4757, #ff6b9d)' }}>
          <NxHeart size={22} color="#fff" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Health Tracker</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-display font-black text-3xl" style={{ color: overallPct >= 75 ? 'var(--accent5)' : overallPct >= 50 ? 'var(--accent4)' : 'var(--accent3)' }}>
            {overallPct}%
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Daily Goal</p>
        </div>
      </motion.div>

      {/* Rings grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <HealthRing value={today.steps} max={GOALS.steps} color="#ff4757" icon={NxSteps} label="Steps" unit="steps" onAdd={v => add('steps', v)} />
        <HealthRing value={today.water} max={GOALS.water} color="var(--accent2)" icon={NxDroplet} label="Water" unit="ml" onAdd={v => add('water', v)} />
        <HealthRing value={today.sleep} max={GOALS.sleep} color="var(--accent1)" icon={NxSleep} label="Sleep" unit="hrs" onAdd={v => add('sleep', v)} />
        <HealthRing value={today.calories} max={GOALS.calories} color="var(--accent4)" icon={NxTrendUp} label="Calories" unit="kcal" onAdd={v => add('calories', v)} />
      </div>

      {/* Manual input */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="nx-card p-5">
        <p className="nx-label mb-4">Log Manually</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['steps','water','sleep','calories'] as const).map(field => (
            <div key={field}>
              <label className="text-xs font-semibold mb-1 block capitalize" style={{ color: 'var(--muted)' }}>{field}</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={customInput[field]}
                  onChange={e => setCustomInput(p => ({ ...p, [field]: e.target.value }))}
                  className="nx-input text-sm flex-1 min-w-0"
                  placeholder="0"
                />
                <motion.button whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    const v = parseFloat(customInput[field])
                    if (!isNaN(v) && v > 0) { add(field, v); setCustomInput(p => ({ ...p, [field]: '' })) }
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
                  <NxPlus size={16} color="#fff" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Week history */}
      {logs.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="nx-card p-5">
          <p className="nx-label mb-4">Past 7 Days</p>
          <div className="space-y-2">
            {logs.slice(0, 7).map((log, i) => {
              const pct = Math.round((['steps','water','sleep','calories'] as const)
                .reduce((s, k) => s + Math.min(log[k] / GOALS[k], 1), 0) / 4 * 100)
              return (
                <div key={i} className="flex items-center gap-3">
                  <p className="text-xs w-24 flex-shrink-0" style={{ color: 'var(--muted)' }}>
                    {new Date(log.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.07, duration: 0.6 }}
                      style={{ background: pct >= 75 ? 'var(--accent5)' : pct >= 50 ? 'var(--accent4)' : 'var(--accent3)' }} />
                  </div>
                  <p className="text-xs font-bold w-10 text-right" style={{ color: 'var(--text2)' }}>{pct}%</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
