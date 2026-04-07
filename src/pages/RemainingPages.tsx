import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxFlashlight, NxCompass, NxChefHat, NxBook, NxPalette, NxLanguages, NxHome, NxBot, NxPlus, NxX, NxSearch, NxKey } from '@/components/icons/NexusIcons'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════════════════════
// FLASHLIGHT & COMPASS
// ══════════════════════════════════════════════════════
export function Flashlight() {
  const [on, setOn] = useState(false)
  const [heading, setHeading] = useState<number | null>(null)
  const [compassErr, setCompassErr] = useState('')

  useEffect(() => {
    let id: number
    if ('DeviceOrientationEvent' in window) {
      const handler = (e: DeviceOrientationEvent) => {
        const h = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? e.alpha
        if (h !== null) setHeading(Math.round(h))
      }
      window.addEventListener('deviceorientation', handler)
      return () => window.removeEventListener('deviceorientation', handler)
    } else { setCompassErr('Compass not available on this device.') }
    return () => clearInterval(id)
  }, [])

  // Toggle screen brightness via wake lock + white overlay
  const toggle = async () => {
    setOn(!on)
    if (!on) {
      try { await navigator.wakeLock?.request('screen') } catch {}
    }
  }

  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  const dirLabel = heading !== null ? dirs[Math.round(heading / 45) % 8] : '—'

  return (
    <div className="flex flex-col h-full" style={{ background: on ? '#fff' : 'var(--bg)' }}>
      {/* White overlay when on */}
      <AnimatePresence>
        {on && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 pointer-events-none" style={{ background: 'rgba(255,255,255,0.95)' }} />
        )}
      </AnimatePresence>

      <div className="relative z-20 flex flex-col h-full items-center justify-center gap-8 p-6">
        <div className="flex items-center gap-3 self-start">
          <NxFlashlight size={24} color={on ? 'var(--accent4)' : 'var(--accent4)'} />
          <h1 className="font-display font-black text-2xl" style={{ color: on ? '#111' : 'var(--text)' }}>Flashlight</h1>
        </div>

        {/* Toggle */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.9 }} onClick={toggle}
          className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3"
          style={{
            background: on ? 'rgba(255,209,102,0.2)' : 'var(--card)',
            border: `3px solid ${on ? '#ffd166' : 'var(--border)'}`,
            boxShadow: on ? '0 0 60px rgba(255,209,102,0.6), 0 0 120px rgba(255,209,102,0.2)' : 'none',
          }}>
          <NxFlashlight size={48} color={on ? '#ffd166' : 'var(--muted)'} />
          <span className="font-display font-black text-sm" style={{ color: on ? '#ffd166' : 'var(--muted)' }}>
            {on ? 'ON' : 'OFF'}
          </span>
        </motion.button>

        {/* Compass */}
        <div className="nx-card p-5 w-full max-w-xs text-center">
          <p className="nx-label mb-3">Compass</p>
          {compassErr ? (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>{compassErr}</p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <motion.div animate={{ rotate: -(heading ?? 0) }} transition={{ type: 'spring', stiffness: 100 }}>
                <NxCompass size={72} color="var(--accent1)" />
              </motion.div>
              <p className="font-display font-black text-3xl" style={{ color: 'var(--accent2)' }}>
                {heading ?? '—'}° {dirLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// RECIPES
// ══════════════════════════════════════════════════════
interface Recipe { id: string; title: string; ingredients: string; steps: string; time: string; servings: string }
const RKEY = 'nx-recipes'
const loadRecipes = (): Recipe[] => JSON.parse(localStorage.getItem(RKEY) ?? '[]')

const DEMO_RECIPES: Recipe[] = [
  { id: 'd1', title: 'Quick Pasta', ingredients: 'Pasta 200g\nTomato sauce 1 cup\nOlive oil 2tbsp\nGarlic 2 cloves\nParmesan to taste', steps: '1. Boil pasta until al dente.\n2. Sauté garlic in olive oil.\n3. Add tomato sauce, simmer 5 mins.\n4. Mix with pasta, top with parmesan.', time: '20 mins', servings: '2' },
  { id: 'd2', title: 'Avocado Toast', ingredients: 'Bread 2 slices\nAvocado 1\nLemon juice 1tsp\nSalt & pepper\nRed pepper flakes', steps: '1. Toast the bread.\n2. Mash avocado with lemon, salt, pepper.\n3. Spread on toast.\n4. Top with red pepper flakes.', time: '5 mins', servings: '1' },
]

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => { const d = loadRecipes(); return d.length ? d : DEMO_RECIPES })
  const [active, setActive] = useState<Recipe | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ title: '', ingredients: '', steps: '', time: '', servings: '' })

  const save = () => {
    if (!form.title.trim()) return
    const r: Recipe = { id: crypto.randomUUID(), ...form }
    const u = [r, ...recipes]; setRecipes(u); localStorage.setItem(RKEY, JSON.stringify(u))
    setForm({ title: '', ingredients: '', steps: '', time: '', servings: '' }); setShowForm(false)
  }

  const filtered = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()))

  if (active) return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button onClick={() => setActive(null)} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
        <h2 className="font-display font-bold text-lg flex-1" style={{ color: 'var(--text)' }}>{active.title}</h2>
        <div className="flex gap-3 text-xs" style={{ color: 'var(--muted)' }}>
          <span>⏱ {active.time}</span><span>◈ {active.servings} servings</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="nx-card p-4"><p className="nx-label mb-3">Ingredients</p>
          {active.ingredients.split('\n').filter(Boolean).map((i, idx) => (
            <div key={idx} className="flex items-start gap-2 py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent5)' }} />
              <span className="text-sm" style={{ color: 'var(--text2)' }}>{i}</span>
            </div>
          ))}
        </div>
        <div className="nx-card p-4"><p className="nx-label mb-3">Steps</p>
          <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text2)' }}>{active.steps}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent4), var(--accent3))' }}>
          <NxChefHat size={22} color="#fff" />
        </div>
        <h1 className="font-display font-black text-2xl flex-1" style={{ color: 'var(--text)' }}>Recipes</h1>
        <button onClick={() => setShowForm(true)} className="nx-btn nx-btn-primary"><NxPlus size={16} color="#fff" /> Add</button>
      </div>
      <div className="relative"><NxSearch size={16} color="var(--muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recipes..." className="nx-input pl-9 text-sm" />
      </div>
      <div className="space-y-3">
        {filtered.map((r, i) => (
          <motion.button key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => setActive(r)} className="w-full nx-card nx-card-interactive flex items-center gap-4 p-4 text-left">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,209,102,0.15)' }}>
              <NxChefHat size={22} color="var(--accent4)" />
            </div>
            <div className="flex-1"><p className="font-display font-bold" style={{ color: 'var(--text)' }}>{r.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>⏱ {r.time} · {r.servings} servings</p>
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
            className="w-full max-w-md nx-card p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>New Recipe</h3>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--muted)' }}><NxX size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Recipe name" className="nx-input" autoFocus />
              <div className="flex gap-2">
                <input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="Time (e.g. 20 mins)" className="nx-input flex-1" />
                <input value={form.servings} onChange={e => setForm(p => ({ ...p, servings: e.target.value }))} placeholder="Servings" className="nx-input flex-1" />
              </div>
              <textarea value={form.ingredients} onChange={e => setForm(p => ({ ...p, ingredients: e.target.value }))} placeholder="Ingredients (one per line)" className="nx-input text-sm" style={{ minHeight: '80px', resize: 'none' }} />
              <textarea value={form.steps} onChange={e => setForm(p => ({ ...p, steps: e.target.value }))} placeholder="Steps (numbered)" className="nx-input text-sm" style={{ minHeight: '80px', resize: 'none' }} />
              <button onClick={save} className="nx-btn nx-btn-primary w-full"><NxPlus size={16} color="#fff" /> Save Recipe</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// DICTIONARY
// ══════════════════════════════════════════════════════
interface DictResult { word: string; phonetic: string; meanings: Array<{ partOfSpeech: string; definitions: Array<{ definition: string; example?: string }> }> }

export function Dictionary() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<DictResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem('nx-dict-hist') ?? '[]'))

  const lookup = async (word: string) => {
    if (!word.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`)
      if (!res.ok) throw new Error('Word not found')
      const data = await res.json()
      setResult(data[0])
      const newHist = [word.trim(), ...history.filter(h => h !== word.trim())].slice(0, 10)
      setHistory(newHist); localStorage.setItem('nx-dict-hist', JSON.stringify(newHist))
    } catch { setError(`"${word}" not found. Check spelling and try again.`) }
    setLoading(false)
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent2), var(--accent1))' }}>
          <NxBook size={22} color="#fff" />
        </div>
        <h1 className="font-display font-black text-2xl flex-1" style={{ color: 'var(--text)' }}>Dictionary</h1>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <NxSearch size={16} color="var(--muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup(query)}
            placeholder="Look up any word..." className="nx-input pl-9" />
        </div>
        <button onClick={() => lookup(query)} className="nx-btn nx-btn-primary px-5">Search</button>
      </div>
      {history.length > 0 && !result && !loading && (
        <div><p className="nx-label mb-2">Recent</p>
          <div className="flex flex-wrap gap-2">
            {history.map(w => (
              <button key={w} onClick={() => { setQuery(w); lookup(w) }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text2)' }}>{w}</button>
            ))}
          </div>
        </div>
      )}
      {loading && <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="nx-shimmer h-16 rounded-2xl" />)}</div>}
      {error && <div className="nx-card p-4 text-center" style={{ color: '#ff4757' }}>{error}</div>}
      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="nx-card p-5">
            <h2 className="font-display font-black text-3xl" style={{ color: 'var(--text)' }}>{result.word}</h2>
            {result.phonetic && <p className="text-sm mt-1 font-mono" style={{ color: 'var(--muted)' }}>{result.phonetic}</p>}
          </div>
          {result.meanings.slice(0, 3).map((m, i) => (
            <div key={i} className="nx-card p-5">
              <p className="text-xs font-bold italic mb-3" style={{ color: 'var(--accent2)' }}>{m.partOfSpeech}</p>
              {m.definitions.slice(0, 3).map((d, j) => (
                <div key={j} className="mb-3 pl-3" style={{ borderLeft: '2px solid var(--accent1)' }}>
                  <p className="text-sm" style={{ color: 'var(--text)' }}>{d.definition}</p>
                  {d.example && <p className="text-xs mt-1 italic" style={{ color: 'var(--muted)' }}>"{d.example}"</p>}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════
// AI ART
// ══════════════════════════════════════════════════════
export function AIArt() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('digital art')

  const STYLES = ['digital art','watercolor','oil painting','sketch','anime','photorealistic','abstract','pixel art']

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #b04aff, var(--accent3))' }}>
          <NxPalette size={22} color="#fff" />
        </div>
        <h1 className="font-display font-black text-2xl flex-1" style={{ color: 'var(--text)' }}>AI Art Generator</h1>
      </div>
      <div className="nx-card p-5 space-y-4">
        <div>
          <p className="nx-label mb-2">Describe your image</p>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="A serene mountain lake at sunset with reflections in the water..."
            className="nx-input text-sm w-full" style={{ minHeight: '100px', resize: 'none' }} />
        </div>
        <div>
          <p className="nx-label mb-2">Art Style</p>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => (
              <button key={s} onClick={() => setStyle(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                style={{ background: style === s ? 'rgba(176,74,255,0.2)' : 'var(--card2)', border: `1px solid ${style === s ? '#b04aff' : 'var(--border)'}`, color: style === s ? '#b04aff' : 'var(--muted)' }}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => navigate('/settings')} className="nx-btn nx-btn-primary w-full py-4 text-base">
          <NxKey size={18} color="#fff" /> Add Gemini Key to Generate Images
        </button>
      </div>
      <div className="nx-card p-5 text-center">
        <NxPalette size={48} color="var(--border2)" className="mx-auto mb-3" />
        <p className="font-display font-bold text-base mb-1" style={{ color: 'var(--text)' }}>Image Generation via Gemini</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Add your Gemini API key in Settings to enable AI image generation with the Imagen model.</p>
        <button onClick={() => navigate('/settings')} className="nx-btn nx-btn-ghost mt-4">Open Settings</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// TRANSLATOR
// ══════════════════════════════════════════════════════
export function Translator() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [from, setFrom] = useState('en')
  const [to, setTo] = useState('es')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const LANGS = [
    { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }, { code: 'ja', name: 'Japanese' }, { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' }, { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' }, { code: 'ko', name: 'Korean' }, { code: 'it', name: 'Italian' },
    { code: 'tl', name: 'Filipino' }, { code: 'id', name: 'Indonesian' }, { code: 'tr', name: 'Turkish' },
  ]

  const translate = async () => {
    if (!text.trim()) return
    setLoading(true); setResult('')
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`)
      const d = await res.json()
      setResult(d.responseData?.translatedText ?? 'Translation failed.')
    } catch { setResult('Translation unavailable. Try Nexus AI for translations!') }
    setLoading(false)
  }

  const swap = () => { setFrom(to); setTo(from); setText(result); setResult(text) }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
          <NxLanguages size={22} color="#fff" />
        </div>
        <h1 className="font-display font-black text-2xl flex-1" style={{ color: 'var(--text)' }}>Translator</h1>
      </div>
      <div className="flex items-center gap-2">
        <select value={from} onChange={e => setFrom(e.target.value)} className="nx-input flex-1 text-sm">
          {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <button onClick={swap} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '16px' }}>⇄</button>
        <select value={to} onChange={e => setTo(e.target.value)} className="nx-input flex-1 text-sm">
          {LANGS.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to translate..."
        className="nx-input w-full text-sm" style={{ minHeight: '120px', resize: 'none' }} />
      <button onClick={translate} disabled={loading || !text.trim()} className="nx-btn nx-btn-primary w-full py-4">
        {loading ? 'Translating...' : 'Translate'}
      </button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="nx-card p-4" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
          <p className="nx-label mb-2">Translation</p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>{result}</p>
        </motion.div>
      )}
      <button onClick={() => navigate('/ai')} className="text-sm text-center w-full" style={{ color: 'var(--accent2)' }}>
        Need more accurate translations? Ask Nexus AI →
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════
// 404 NOT FOUND
// ══════════════════════════════════════════════════════
export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.2)' }}>
          <NxBot size={48} color="var(--accent1)" />
        </div>
      </motion.div>
      <div>
        <h1 className="font-display font-black text-5xl mb-2" style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</h1>
        <p className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text)' }}>Page not found</p>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>This corner of the universe doesn't exist yet.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="nx-btn nx-btn-ghost">Go Back</button>
        <button onClick={() => navigate('/')} className="nx-btn nx-btn-primary"><NxHome size={16} color="#fff" /> Home</button>
      </div>
    </div>
  )
}
