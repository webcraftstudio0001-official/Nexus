import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxCalculator, NxTrash, NxRefresh } from '@/components/icons/NexusIcons'

type CalcMode = 'basic' | 'scientific'

const HISTORY_MAX = 20

interface HistoryEntry { expr: string; result: string }

const BTN_GRID_BASIC = [
  ['AC', '+/-', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
]

const BTN_GRID_SCI = [
  ['sin', 'cos', 'tan', 'π'],
  ['√', 'x²', 'xʸ', 'e'],
  ['log', 'ln', '(', ')'],
  ['AC', '+/-', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
]

function getBtnStyle(label: string) {
  if (label === '=')    return { bg: 'linear-gradient(135deg, var(--accent1), var(--accent2))', color: '#fff', bold: true }
  if (['÷','×','−','+'].includes(label)) return { bg: 'rgba(108,99,255,0.18)', color: 'var(--accent2)', bold: true }
  if (['AC','⌫','+/-','%'].includes(label)) return { bg: 'rgba(255,107,157,0.15)', color: 'var(--accent3)', bold: false }
  if (['sin','cos','tan','π','√','x²','xʸ','e','log','ln','(',')',' '].includes(label))
    return { bg: 'rgba(6,214,160,0.12)', color: 'var(--accent5)', bold: false }
  return { bg: 'var(--card)', color: 'var(--text)', bold: false }
}

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expr, setExpr] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [mode, setMode] = useState<CalcMode>('basic')
  const [justCalc, setJustCalc] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const calculate = useCallback((expression: string): string => {
    try {
      let e = expression
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-')
        .replace(/π/g, String(Math.PI))
        .replace(/e(?![0-9])/g, String(Math.E))
      // Handle scientific functions
      e = e.replace(/sin\(([^)]+)\)/g, (_, a) => String(Math.sin(parseFloat(a) * Math.PI / 180)))
      e = e.replace(/cos\(([^)]+)\)/g, (_, a) => String(Math.cos(parseFloat(a) * Math.PI / 180)))
      e = e.replace(/tan\(([^)]+)\)/g, (_, a) => String(Math.tan(parseFloat(a) * Math.PI / 180)))
      e = e.replace(/√\(([^)]+)\)/g, (_, a) => String(Math.sqrt(parseFloat(a))))
      e = e.replace(/log\(([^)]+)\)/g, (_, a) => String(Math.log10(parseFloat(a))))
      e = e.replace(/ln\(([^)]+)\)/g, (_, a) => String(Math.log(parseFloat(a))))
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + e + ')')()
      if (typeof result !== 'number' || isNaN(result)) return 'Error'
      return result % 1 === 0 ? String(result) : result.toFixed(10).replace(/0+$/, '').replace(/\.$/, '')
    } catch { return 'Error' }
  }, [])

  const press = useCallback((label: string) => {
    if (label === 'AC') {
      setDisplay('0'); setExpr(''); setJustCalc(false); return
    }
    if (label === '⌫') {
      if (justCalc) { setDisplay('0'); setExpr(''); setJustCalc(false); return }
      const nd = expr.length <= 1 ? '0' : expr.slice(0, -1)
      setExpr(nd === '' ? '0' : nd)
      setDisplay(nd === '' ? '0' : nd)
      return
    }
    if (label === '=') {
      const result = calculate(expr || display)
      setHistory(h => [{ expr: expr || display, result }, ...h].slice(0, HISTORY_MAX))
      setDisplay(result)
      setExpr(result)
      setJustCalc(true)
      return
    }
    if (label === '+/-') {
      const negated = display.startsWith('-') ? display.slice(1) : '-' + display
      setDisplay(negated); setExpr(negated); return
    }
    if (label === '%') {
      const pct = String(parseFloat(display) / 100)
      setDisplay(pct); setExpr(pct); return
    }
    // Scientific
    if (['sin','cos','tan','log','ln','√'].includes(label)) {
      const newExpr = (justCalc ? '' : expr) + label + '('
      setExpr(newExpr); setDisplay(newExpr); setJustCalc(false); return
    }
    if (label === 'x²') {
      const base = justCalc ? expr : display
      const newExpr = '(' + base + ')²'
      const result = String(Math.pow(parseFloat(base), 2))
      setHistory(h => [{ expr: newExpr, result }, ...h].slice(0, HISTORY_MAX))
      setDisplay(result); setExpr(result); setJustCalc(true); return
    }
    if (label === 'xʸ') {
      setExpr((justCalc ? expr : expr) + '^'); setDisplay((justCalc ? expr : expr) + '^'); return
    }

    const isOp = ['÷','×','−','+','(',')','.','π','e'].includes(label)
    if (justCalc && !isOp) {
      setExpr(label); setDisplay(label); setJustCalc(false); return
    }
    const newExpr = (expr === '0' && !isOp) ? label : (expr || '0') + label
    setExpr(newExpr)
    setDisplay(newExpr)
    setJustCalc(false)
  }, [expr, display, justCalc, calculate])

  const grid = mode === 'scientific' ? BTN_GRID_SCI : BTN_GRID_BASIC

  return (
    <div className="flex h-full" style={{ background: 'var(--bg)' }}>
      {/* Calculator panel */}
      <div className="flex flex-col flex-1 max-w-sm mx-auto p-4 gap-3 justify-end">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <NxCalculator size={22} color="var(--accent1)" />
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>Calculator</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: showHistory ? 'rgba(108,99,255,0.2)' : 'var(--card)', border: '1px solid var(--border)', color: showHistory ? 'var(--accent1)' : 'var(--muted)' }}>
              History
            </button>
            <button
              onClick={() => setMode(m => m === 'basic' ? 'scientific' : 'basic')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: mode === 'scientific' ? 'rgba(0,212,255,0.15)' : 'var(--card)', border: '1px solid var(--border)', color: mode === 'scientific' ? 'var(--accent2)' : 'var(--muted)' }}>
              {mode === 'basic' ? 'Sci' : 'Basic'}
            </button>
          </div>
        </div>

        {/* Display */}
        <motion.div
          layout
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', minHeight: '120px' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.06), rgba(0,212,255,0.04))' }} />
          <p className="text-xs mb-2 font-mono truncate" style={{ color: 'var(--muted)' }}>
            {expr !== display ? expr : ' '}
          </p>
          <motion.p
            key={display}
            initial={{ opacity: 0.7, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display font-black text-right truncate"
            style={{
              fontSize: display.length > 12 ? '24px' : display.length > 8 ? '32px' : '42px',
              background: 'linear-gradient(135deg, var(--accent1), var(--accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            {display}
          </motion.p>
        </motion.div>

        {/* Button grid */}
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {grid.flat().map((label, i) => {
            const s = getBtnStyle(label)
            return (
              <motion.button
                key={`${mode}-${i}`}
                onClick={() => press(label)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.88 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.012 }}
                className="flex items-center justify-center rounded-2xl font-display font-bold select-none"
                style={{
                  background: s.bg,
                  color: s.color,
                  fontWeight: s.bold ? 700 : 500,
                  fontSize: label.length > 2 ? '12px' : '18px',
                  height: '58px',
                  border: '1px solid var(--border)',
                  boxShadow: label === '=' ? '0 4px 20px rgba(108,99,255,0.3)' : 'none',
                }}>
                {label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            className="w-64 flex flex-col p-4 gap-3 border-l overflow-y-auto"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-center justify-between">
              <p className="nx-label">History</p>
              <button onClick={() => setHistory([])} style={{ color: 'var(--muted)' }}><NxTrash size={16} /></button>
            </div>
            {history.length === 0 && (
              <p className="text-xs text-center py-8" style={{ color: 'var(--muted)' }}>No calculations yet</p>
            )}
            {history.map((h, i) => (
              <motion.button key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setDisplay(h.result); setExpr(h.result); setJustCalc(true) }}
                className="text-left p-3 rounded-xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{h.expr}</p>
                <p className="font-display font-bold text-base" style={{ color: 'var(--accent2)' }}>{h.result}</p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
