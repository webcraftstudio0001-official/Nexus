import { useState } from 'react'
import { motion } from 'framer-motion'
import { NxSettings, NxKey, NxGlobe, NxBot, NxInfo, NxSun, NxMoon, NxRefresh } from '@/components/icons/NexusIcons'
import { useThemeStore, useAIStore, useAppStore } from '@/store'
import { THEMES } from '@/types'
import { FREE_OPENROUTER_MODELS, GEMINI_MODELS } from '@/lib/ai'
import toast from 'react-hot-toast'

type Tab = 'appearance' | 'ai' | 'language' | 'about'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{size?:number}> }[] = [
  { id: 'appearance', label: 'Appearance', icon: NxSun },
  { id: 'ai',         label: 'AI & Keys',  icon: NxBot },
  { id: 'language',   label: 'Language',   icon: NxGlobe },
  { id: 'about',      label: 'About',      icon: NxInfo },
]

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' }, { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' }, { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' }, { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' }, { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' }, { code: 'hi', label: 'हिन्दी' },
  { code: 'tl', label: 'Filipino' }, { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'id', label: 'Bahasa Indonesia' }, { code: 'tr', label: 'Türkçe' },
  { code: 'pl', label: 'Polski' }, { code: 'nl', label: 'Nederlands' },
  { code: 'sv', label: 'Svenska' }, { code: 'th', label: 'ภาษาไทย' },
  { code: 'vi', label: 'Tiếng Việt' }, { code: 'uk', label: 'Українська' },
  { code: 'ro', label: 'Română' }, { code: 'hu', label: 'Magyar' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nx-card p-5">
      <p className="nx-label mb-4">{title}</p>
      {children}
    </div>
  )
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
        {desc && <p className="text-xs" style={{ color: 'var(--muted)' }}>{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
        style={{ background: value ? 'var(--accent1)' : 'var(--border2)' }}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </button>
    </div>
  )
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('appearance')
  const { theme, setTheme } = useThemeStore()
  const { settings, updateSettings } = useAIStore()
  const { isOnline } = useAppStore()

  const [geminiKey, setGeminiKey] = useState(import.meta.env.VITE_GEMINI_KEY ?? '')
  const [openrouterKey, setOpenrouterKey] = useState(import.meta.env.VITE_OPENROUTER_KEY ?? '')
  const [customKey, setCustomKey] = useState(settings.customKey)
  const [customUrl, setCustomUrl] = useState(settings.customBaseUrl)
  const [customModel, setCustomModel] = useState(settings.customModel)
  const [selectedLang, setSelectedLang] = useState('en')
  const [showKeys, setShowKeys] = useState(false)

  const saveAISettings = () => {
    updateSettings({ customKey, customBaseUrl: customUrl, customModel })
    toast.success('AI settings saved!')
  }

  const resetDailyLimit = () => {
    updateSettings({ usedToday: 0, lastResetDate: new Date().toDateString() })
    toast.success('Daily limit reset!')
  }

  const allModels = [...FREE_OPENROUTER_MODELS, ...GEMINI_MODELS]

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
            <NxSettings size={20} color="#fff" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>Settings</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Customize your Nexus experience</p>
          </div>
        </div>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.96 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,255,0.1))' : 'transparent',
                border: isActive ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                color: isActive ? 'var(--text)' : 'var(--muted)',
              }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">

        {/* ── APPEARANCE ── */}
        {activeTab === 'appearance' && (
          <>
            <Section title="Theme">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map(t => {
                  const isActive = theme === t.id
                  return (
                    <motion.button
                      key={t.id}
                      onClick={() => { setTheme(t.id); toast.success(`Theme: ${t.name}`) }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        background: isActive ? 'rgba(108,99,255,0.12)' : 'var(--card2)',
                        border: isActive ? '1px solid rgba(108,99,255,0.4)' : '1px solid var(--border)',
                      }}
                    >
                      {/* Color preview circles */}
                      <div className="flex -space-x-1.5 flex-shrink-0">
                        {[t.preview.accent1, t.preview.accent2, t.preview.accent3].map((c, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border-2"
                            style={{ background: c, borderColor: t.preview.bg, zIndex: 3 - i }} />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{t.name}</p>
                          {t.isDark ? <NxMoon size={12} style={{ color: 'var(--muted)' }} /> : <NxSun size={12} style={{ color: 'var(--accent4)' }} />}
                        </div>
                        <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{t.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--accent1)' }}>
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </Section>

            <Section title="Display">
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                <Toggle label="Animations" desc="Page transitions and micro-interactions" value={true} onChange={() => toast('Coming soon!')} />
                <Toggle label="Reduced Motion" desc="For accessibility — minimal animations" value={false} onChange={() => toast('Coming soon!')} />
                <Toggle label="Compact Mode" desc="Denser layout for more content" value={false} onChange={() => toast('Coming soon!')} />
              </div>
            </Section>
          </>
        )}

        {/* ── AI & KEYS ── */}
        {activeTab === 'ai' && (
          <>
            <Section title="AI Status">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--card2)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Daily Usage</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>Resets every 24 hours</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-display font-black text-xl" style={{ color: 'var(--accent2)' }}>
                      {settings.usedToday} / {settings.dailyLimit}
                    </p>
                    <div className="w-24 h-1.5 rounded-full mt-1" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(settings.usedToday/settings.dailyLimit)*100}%`, background: 'linear-gradient(90deg, var(--accent1), var(--accent2))' }} />
                    </div>
                  </div>
                  <button onClick={resetDailyLimit} className="p-1.5 rounded-lg" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                    <NxRefresh size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
                Add your own API key below for unlimited messages (no daily limit).
              </p>
            </Section>

            <Section title="Default AI Model">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allModels.map(m => (
                  <button key={m.id}
                    onClick={() => { updateSettings({ model: m.id, provider: m.id.includes('gemini') ? 'gemini' : 'openrouter' }); toast.success(`Model: ${m.name}`) }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: settings.model === m.id ? 'rgba(108,99,255,0.15)' : 'var(--card2)',
                      border: settings.model === m.id ? '1px solid rgba(108,99,255,0.4)' : '1px solid var(--border)',
                      color: settings.model === m.id ? 'var(--text)' : 'var(--text2)',
                    }}>
                    <span className="font-medium truncate">{m.name}</span>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--muted)' }}>{m.provider}</span>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="API Keys">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Keys are stored locally — never sent to our servers.</p>
                <button onClick={() => setShowKeys(!showKeys)} className="text-xs font-semibold" style={{ color: 'var(--accent2)' }}>
                  {showKeys ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>Gemini API Key (Google AI Studio)</label>
                  <input type={showKeys ? 'text' : 'password'} value={geminiKey} onChange={e => setGeminiKey(e.target.value)}
                    placeholder="AIza..." className="nx-input text-sm" />
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Get free at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--accent2)' }}>aistudio.google.com</a>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: 'var(--muted)' }}>OpenRouter API Key (Free models)</label>
                  <input type={showKeys ? 'text' : 'password'} value={openrouterKey} onChange={e => setOpenrouterKey(e.target.value)}
                    placeholder="sk-or-v1-..." className="nx-input text-sm" />
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Get free at <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="underline" style={{ color: 'var(--accent2)' }}>openrouter.ai/keys</a>
                  </p>
                </div>
                <div className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)' }}>Custom AI (OpenAI-compatible endpoint)</p>
                  <div className="space-y-2">
                    <input type={showKeys ? 'text' : 'password'} value={customKey} onChange={e => setCustomKey(e.target.value)}
                      placeholder="Custom API Key" className="nx-input text-sm" />
                    <input type="text" value={customUrl} onChange={e => setCustomUrl(e.target.value)}
                      placeholder="Base URL (e.g. https://api.openai.com/v1)" className="nx-input text-sm" />
                    <input type="text" value={customModel} onChange={e => setCustomModel(e.target.value)}
                      placeholder="Model ID (e.g. gpt-4o-mini)" className="nx-input text-sm" />
                  </div>
                </div>
                <button onClick={saveAISettings} className="nx-btn nx-btn-primary w-full">
                  <NxKey size={15} /> Save API Keys
                </button>
              </div>
            </Section>
          </>
        )}

        {/* ── LANGUAGE ── */}
        {activeTab === 'language' && (
          <Section title="Display Language">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LANGUAGES.map(lang => (
                <button key={lang.code}
                  onClick={() => { setSelectedLang(lang.code); toast.success(`Language: ${lang.label}`) }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all"
                  style={{
                    background: selectedLang === lang.code ? 'rgba(0,212,255,0.12)' : 'var(--card2)',
                    border: selectedLang === lang.code ? '1px solid rgba(0,212,255,0.35)' : '1px solid var(--border)',
                    color: selectedLang === lang.code ? 'var(--accent2)' : 'var(--text2)',
                  }}>
                  <span className="font-medium">{lang.label}</span>
                  <span className="text-xs uppercase font-bold" style={{ color: 'var(--muted)' }}>{lang.code}</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── ABOUT (settings tab) ── */}
        {activeTab === 'about' && (
          <>
            <Section title="App Info">
              <div className="space-y-3">
                {[
                  { label: 'Version', value: '1.0.0' },
                  { label: 'Build', value: 'Production · Cloudflare Pages' },
                  { label: 'PWA', value: 'Installed & Offline-ready' },
                  { label: 'Framework', value: 'React 18 + Vite 5 + TypeScript' },
                  { label: 'AI', value: 'OpenRouter + Gemini 2.0' },
                  { label: 'Storage', value: 'Supabase + IndexedDB' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Built by">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>WebCraft Studio</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>"Your Vision. Engineered to Perfection."</p>
                  <a href="https://webcraft-studioo.netlify.app" target="_blank" rel="noreferrer"
                    className="text-xs mt-1 inline-block hover:underline" style={{ color: 'var(--accent2)' }}>
                    webcraft-studioo.netlify.app →
                  </a>
                </div>
              </div>
            </Section>
            <div className="flex gap-3">
              <button onClick={() => { localStorage.clear(); toast.success('Cache cleared! Reload to apply.') }}
                className="nx-btn nx-btn-ghost flex-1 text-sm">
                Clear Cache
              </button>
              <button onClick={() => window.location.reload()}
                className="nx-btn nx-btn-ghost flex-1 text-sm">
                <NxRefresh size={14} /> Reload App
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
