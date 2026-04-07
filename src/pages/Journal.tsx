import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxNotebook, NxPlus, NxSearch, NxTrash, NxX, NxPen } from '@/components/icons/NexusIcons'

interface Entry { id: string; title: string; content: string; mood: string; date: string; tags: string[] }

const MOODS = [
  { emoji: '◈', label: 'Great', color: '#06d6a0' },
  { emoji: '◉', label: 'Good', color: '#00d4ff' },
  { emoji: '◎', label: 'Okay', color: '#ffd166' },
  { emoji: '◐', label: 'Low', color: '#ff6b9d' },
  { emoji: '◑', label: 'Rough', color: '#ff4757' },
]

const KEY = 'nx-journal'
const load = (): Entry[] => JSON.parse(localStorage.getItem(KEY) ?? '[]')
const saveAll = (entries: Entry[]) => localStorage.setItem(KEY, JSON.stringify(entries))

export function Journal() {
  const [entries, setEntries] = useState<Entry[]>(load)
  const [view, setView] = useState<'list' | 'write'>('list')
  const [editing, setEditing] = useState<Entry | null>(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ title: '', content: '', mood: 'Good', tags: '' })

  const filtered = entries.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  )

  const startNew = () => {
    setEditing(null)
    setForm({ title: '', content: '', mood: 'Good', tags: '' })
    setView('write')
  }

  const startEdit = (e: Entry) => {
    setEditing(e)
    setForm({ title: e.title, content: e.content, mood: e.mood, tags: e.tags.join(', ') })
    setView('write')
  }

  const save = () => {
    if (!form.content.trim()) return
    const entry: Entry = {
      id: editing?.id ?? crypto.randomUUID(),
      title: form.title || 'Untitled Entry',
      content: form.content,
      mood: form.mood,
      date: editing?.date ?? new Date().toISOString(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    const updated = editing
      ? entries.map(e => e.id === editing.id ? entry : e)
      : [entry, ...entries]
    setEntries(updated)
    saveAll(updated)
    setView('list')
  }

  const del = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    saveAll(updated)
  }

  const moodColor = (label: string) => MOODS.find(m => m.label === label)?.color ?? 'var(--muted)'
  const moodEmoji = (label: string) => MOODS.find(m => m.label === label)?.emoji ?? '◉'

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <NxNotebook size={22} color="var(--accent4)" />
        <h1 className="font-display font-bold text-lg flex-1" style={{ color: 'var(--text)' }}>
          {view === 'write' ? (editing ? 'Edit Entry' : 'New Entry') : 'Journal'}
        </h1>
        {view === 'list' ? (
          <motion.button whileTap={{ scale: 0.9 }} onClick={startNew}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', color: '#fff' }}>
            <NxPlus size={15} color="#fff" /> New
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={save}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', color: '#fff' }}>
              Save
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView('list')}
              className="p-2 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              <NxX size={18} />
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <NxSearch size={16} color="var(--muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search entries..." className="nx-input pl-9 text-sm" />
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <NxPen size={48} color="var(--border2)" className="mx-auto mb-4" />
                <p className="font-display font-bold text-lg" style={{ color: 'var(--muted)' }}>No entries yet</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Tap + New to write your first entry</p>
              </div>
            )}

            {filtered.map((entry, i) => (
              <motion.div key={entry.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="nx-card nx-card-interactive p-4" onClick={() => startEdit(entry)}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ color: moodColor(entry.mood), fontSize: '16px' }}>{moodEmoji(entry.mood)}</span>
                      <h3 className="font-display font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{entry.title}</h3>
                    </div>
                    <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--text2)' }}>{entry.content}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {entry.tags.slice(0,3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent1)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); del(entry.id) }}
                    className="p-1.5 rounded-lg flex-shrink-0" style={{ color: 'var(--muted)' }}>
                    <NxTrash size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="write" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title */}
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Entry title..." className="nx-input font-display font-bold text-lg" />

            {/* Mood selector */}
            <div>
              <p className="nx-label mb-2">How are you feeling?</p>
              <div className="flex gap-2 flex-wrap">
                {MOODS.map(m => (
                  <motion.button key={m.label} whileTap={{ scale: 0.9 }}
                    onClick={() => setForm(p => ({ ...p, mood: m.label }))}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: form.mood === m.label ? `${m.color}20` : 'var(--card)',
                      border: `1px solid ${form.mood === m.label ? m.color : 'var(--border)'}`,
                      color: form.mood === m.label ? m.color : 'var(--muted)',
                    }}>
                    <span>{m.emoji}</span> {m.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="nx-label mb-2">Your thoughts</p>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Write anything — your thoughts, experiences, gratitude, ideas..."
                className="nx-input text-sm w-full"
                style={{ minHeight: '220px', resize: 'vertical', lineHeight: '1.7' }} />
            </div>

            {/* Tags */}
            <div>
              <p className="nx-label mb-2">Tags (comma-separated)</p>
              <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                placeholder="gratitude, goals, work..." className="nx-input text-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
