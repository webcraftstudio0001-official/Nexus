import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxWallet, NxPlus, NxTrash, NxX, NxTrendUp } from '@/components/icons/NexusIcons'

interface BudgetItem {
  id: string
  type: 'income' | 'expense'
  category: string
  amount: number
  note: string
  date: string
}

const KEY = 'nx-budget'
const load = (): BudgetItem[] => JSON.parse(localStorage.getItem(KEY) ?? '[]')
const saveAll = (items: BudgetItem[]) => localStorage.setItem(KEY, JSON.stringify(items))

const EXPENSE_CATS = ['Food','Transport','Shopping','Entertainment','Health','Utilities','Rent','Other']
const INCOME_CATS  = ['Salary','Freelance','Gift','Investment','Other']
const CAT_COLORS: Record<string, string> = {
  Food:'#ff6b9d', Transport:'#ffd166', Shopping:'#b04aff', Entertainment:'#00d4ff',
  Health:'#ff4757', Utilities:'#06d6a0', Rent:'#ff6b9d', Salary:'#06d6a0',
  Freelance:'#00d4ff', Gift:'#ffd166', Investment:'#6c63ff', Other:'#7a7f9a',
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

function CategoryBar({ cat, amount, total, color }: { cat: string; amount: number; total: number; color: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-xs flex-shrink-0 w-24 truncate" style={{ color: 'var(--text2)' }}>{cat}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div className="h-full rounded-full"
          initial={{ width: 0 }} animate={{ width: `${(amount / total) * 100}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ background: color }} />
      </div>
      <span className="text-xs font-bold flex-shrink-0 w-20 text-right" style={{ color }}>{fmt(amount)}</span>
    </div>
  )
}

export function Budget() {
  const [items, setItems] = useState<BudgetItem[]>(load)
  const [showForm, setShowForm] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [form, setForm] = useState({ type: 'expense' as 'income' | 'expense', category: 'Food', amount: '', note: '' })

  const add = () => {
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) return
    const item: BudgetItem = { id: crypto.randomUUID(), type: form.type, category: form.category, amount, note: form.note.trim(), date: new Date().toISOString() }
    const updated = [item, ...items]
    setItems(updated); saveAll(updated)
    setForm({ type: 'expense', category: 'Food', amount: '', note: '' }); setShowForm(false)
  }

  const del = (id: string) => { const u = items.filter(i => i.id !== id); setItems(u); saveAll(u) }

  const totalIncome  = useMemo(() => items.filter(i => i.type === 'income').reduce((s, i) => s + i.amount, 0), [items])
  const totalExpense = useMemo(() => items.filter(i => i.type === 'expense').reduce((s, i) => s + i.amount, 0), [items])
  const balance      = totalIncome - totalExpense

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    items.filter(i => i.type === 'expense').forEach(i => { map[i.category] = (map[i.category] ?? 0) + i.amount })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [items])

  const filtered = items.filter(i => filterType === 'all' || i.type === filterType)

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent5), var(--accent2))' }}>
          <NxWallet size={22} color="#fff" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Budget Tracker</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Track income & expenses</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowForm(true)} className="nx-btn nx-btn-primary">
          <NxPlus size={16} color="#fff" /> Add
        </motion.button>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Balance', value: balance, color: balance >= 0 ? 'var(--accent5)' : '#ff4757', bg: balance >= 0 ? 'rgba(6,214,160,0.1)' : 'rgba(255,71,87,0.1)' },
          { label: 'Income', value: totalIncome, color: 'var(--accent5)', bg: 'rgba(6,214,160,0.08)' },
          { label: 'Expenses', value: totalExpense, color: 'var(--accent3)', bg: 'rgba(255,107,157,0.08)' },
        ].map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-4 text-center" style={{ background: card.bg, border: `1px solid ${card.color}20` }}>
            <p className="font-display font-black text-xl" style={{ color: card.color }}>{fmt(card.value)}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Spending by category */}
      {expenseByCategory.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="nx-card p-5">
          <p className="nx-label mb-3">Spending by Category</p>
          {expenseByCategory.map(([cat, amount]) => (
            <CategoryBar key={cat} cat={cat} amount={amount} total={totalExpense} color={CAT_COLORS[cat] ?? '#7a7f9a'} />
          ))}
        </motion.div>
      )}

      {/* Filter + list */}
      <div>
        <div className="flex gap-2 mb-4">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
              style={{
                background: filterType === f ? 'rgba(108,99,255,0.2)' : 'var(--card)',
                border: `1px solid ${filterType === f ? 'rgba(108,99,255,0.4)' : 'var(--border)'}`,
                color: filterType === f ? 'var(--accent2)' : 'var(--muted)',
              }}>
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs self-center" style={{ color: 'var(--muted)' }}>{filtered.length} entries</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <NxTrendUp size={44} color="var(--border2)" className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No transactions yet. Add your first!</p>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="nx-card flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                style={{ background: `${CAT_COLORS[item.category] ?? '#7a7f9a'}18`, color: CAT_COLORS[item.category] ?? '#7a7f9a' }}>
                {item.category[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{item.category}</p>
                  {item.note && <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>· {item.note}</p>}
                </div>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <p className="font-display font-black text-base flex-shrink-0"
                style={{ color: item.type === 'income' ? 'var(--accent5)' : 'var(--accent3)' }}>
                {item.type === 'income' ? '+' : '-'}{fmt(item.amount)}
              </p>
              <button onClick={() => del(item.id)} className="p-1 rounded-lg flex-shrink-0" style={{ color: 'var(--muted)' }}>
                <NxTrash size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="w-full max-w-md nx-card p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>Add Transaction</h3>
                <button onClick={() => setShowForm(false)} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2 mb-4">
                {(['expense','income'] as const).map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, type: t, category: t === 'expense' ? 'Food' : 'Salary' }))}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all"
                    style={{
                      background: form.type === t ? (t === 'income' ? 'rgba(6,214,160,0.2)' : 'rgba(255,107,157,0.2)') : 'var(--card2)',
                      border: `1px solid ${form.type === t ? (t === 'income' ? 'rgba(6,214,160,0.4)' : 'rgba(255,107,157,0.4)') : 'var(--border)'}`,
                      color: form.type === t ? (t === 'income' ? 'var(--accent5)' : 'var(--accent3)') : 'var(--muted)',
                    }}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {/* Amount */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--muted)' }}>$</span>
                  <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00" className="nx-input pl-8 text-xl font-bold" step="0.01" min="0" autoFocus />
                </div>

                {/* Category */}
                <div className="grid grid-cols-3 gap-2">
                  {(form.type === 'expense' ? EXPENSE_CATS : INCOME_CATS).map(cat => (
                    <button key={cat} onClick={() => setForm(p => ({ ...p, category: cat }))}
                      className="py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: form.category === cat ? `${CAT_COLORS[cat] ?? '#7a7f9a'}20` : 'var(--card2)',
                        border: `1px solid ${form.category === cat ? CAT_COLORS[cat] ?? '#7a7f9a' : 'var(--border)'}`,
                        color: form.category === cat ? CAT_COLORS[cat] ?? '#7a7f9a' : 'var(--muted)',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Note */}
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="Note (optional)" className="nx-input text-sm" />

                <button onClick={add} className="nx-btn nx-btn-primary w-full text-base">
                  <NxPlus size={18} color="#fff" /> Add {form.type === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
