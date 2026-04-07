import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  NexusLogo, NxSearch, NxGlobe, NxBell,
  NxSun, NxMoon, NxMenu, NxX, NxWifi, NxWifiOff,
  NxSettings, NxInfo, NxHeart2
} from '@/components/icons/NexusIcons'
import { useThemeStore, useAppStore } from '@/store'
import { THEMES, type ThemeId, NAV_ITEMS } from '@/types'

// All supported languages
const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'tl', label: 'Filipino', native: 'Filipino' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
  { code: 'pl', label: 'Polish', native: 'Polski' },
  { code: 'nl', label: 'Dutch', native: 'Nederlands' },
  { code: 'sv', label: 'Swedish', native: 'Svenska' },
  { code: 'th', label: 'Thai', native: 'ภาษาไทย' },
  { code: 'vi', label: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'uk', label: 'Ukrainian', native: 'Українська' },
  { code: 'ro', label: 'Romanian', native: 'Română' },
  { code: 'hu', label: 'Hungarian', native: 'Magyar' },
]

interface TopbarProps {
  isMobile: boolean
  isTablet: boolean
}

export function Topbar({ isMobile }: TopbarProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const { isOnline, toggleSidebar } = useAppStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const [langSearch, setLangSearch] = useState('')
  const [selectedLang, setSelectedLang] = useState('en')
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  const currentTheme = THEMES.find(t => t.id === theme)
  const isDark = currentTheme?.isDark ?? true

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredLangs = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.native.toLowerCase().includes(langSearch.toLowerCase())
  )

  // Search across nav items
  const searchResults = searchQuery.length > 1
    ? NAV_ITEMS.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  const toggleTheme = () => {
    const darkThemes: ThemeId[] = ['dark-glass', 'midnight-purple', 'ocean-breeze']
    const lightThemes: ThemeId[] = ['vibrant-light', 'clean-white']
    if (isDark) setTheme('vibrant-light')
    else setTheme('dark-glass')
    void darkThemes; void lightThemes
  }

  return (
    <header
      className="flex items-center gap-3 px-4 h-14 flex-shrink-0 relative z-50"
      style={{
        background: 'var(--glass)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Hamburger (mobile/tablet) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text)', background: 'var(--card)' }}
        >
          <NxMenu size={20} />
        </button>
      )}

      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 flex-shrink-0 group"
      >
        <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <NexusLogo size={30} />
        </motion.div>
        {!isMobile && (
          <span
            className="font-display font-black text-xl tracking-tight"
            style={{
              background: 'linear-gradient(135deg, var(--accent1), var(--accent2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nexus
          </span>
        )}
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-md relative">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="open"
              initial={{ opacity: 0, width: '40px' }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: '40px' }}
              className="relative"
            >
              <NxSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--muted)' }}
              />
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') } }}
                placeholder="Search tools, pages..."
                className="nx-input pl-9 pr-9 py-2 text-sm h-9"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--muted)' }}
              >
                <NxX size={14} />
              </button>

              {/* Search results dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 left-0 right-0 nx-card py-2 z-50"
                    style={{ background: 'var(--card)' }}
                  >
                    {searchResults.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { navigate(item.path); setSearchOpen(false); setSearchQuery('') }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: 'var(--text)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--card2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ color: 'var(--accent1)' }}>→</span>
                        {item.label}
                        {item.onlineOnly && (
                          <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--card2)', color: 'var(--muted)' }}>
                            Online
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button
              key="closed"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors w-full max-w-xs"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
              }}
              whileHover={{ borderColor: 'var(--border2)' }}
            >
              <NxSearch size={15} />
              {!isMobile && <span>Search anything...</span>}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Online status indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
          style={{
            background: isOnline ? 'rgba(6,214,160,0.12)' : 'rgba(255,71,87,0.12)',
            border: `1px solid ${isOnline ? 'rgba(6,214,160,0.25)' : 'rgba(255,71,87,0.25)'}`,
            color: isOnline ? 'var(--accent5)' : '#ff4757',
          }}
        >
          {isOnline ? <NxWifi size={13} /> : <NxWifiOff size={13} />}
          {!isMobile && <span>{isOnline ? 'Online' : 'Offline'}</span>}
        </div>

        {/* Language picker */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 p-2 rounded-xl transition-colors"
            style={{
              background: langOpen ? 'var(--card2)' : 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            <NxGlobe size={16} />
            {!isMobile && (
              <span className="text-xs font-semibold uppercase">{selectedLang}</span>
            )}
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 nx-card py-2 z-50"
                style={{ background: 'var(--card)', maxHeight: '320px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                {/* Search bar */}
                <div className="px-3 pb-2">
                  <input
                    value={langSearch}
                    onChange={e => setLangSearch(e.target.value)}
                    placeholder="Search language..."
                    className="nx-input text-xs py-1.5"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1">
                  {filteredLangs.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setSelectedLang(lang.code); setLangOpen(false); setLangSearch('') }}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm transition-colors"
                      style={{
                        color: selectedLang === lang.code ? 'var(--accent2)' : 'var(--text)',
                        background: selectedLang === lang.code ? 'rgba(0,212,255,0.08)' : 'transparent',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--card2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = selectedLang === lang.code ? 'rgba(0,212,255,0.08)' : 'transparent')}
                    >
                      <span>{lang.native}</span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark/light toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9, rotate: 30 }}
          className="p-2 rounded-xl transition-colors"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          {isDark ? <NxSun size={17} /> : <NxMoon size={17} />}
        </motion.button>

        {/* Notification bell */}
        <div className="relative">
          <motion.button
            onClick={() => setNotifOpen(!notifOpen)}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl transition-colors relative"
            style={{
              background: notifOpen ? 'var(--card2)' : 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          >
            <NxBell size={17} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent3)' }}
            />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-72 nx-card p-4 z-50"
                style={{ background: 'var(--card)' }}
              >
                <p className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>Notifications</p>
                {[
                  { icon: '✦', msg: 'Welcome to Nexus! Your universe is ready.', time: 'just now', color: 'var(--accent1)' },
                  { icon: '◆', msg: 'All 19 tools are loaded and offline-ready.', time: '1m ago', color: 'var(--accent2)' },
                  { icon: '●', msg: 'Try the AI Chat — 10 free messages/day.', time: '2m ago', color: 'var(--accent5)' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-t first:border-t-0" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-base" style={{ color: n.color }}>{n.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs" style={{ color: 'var(--text2)' }}>{n.msg}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick links */}
        {!isMobile && (
          <>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              <NxSettings size={17} />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              <NxInfo size={17} />
            </button>
            <button
              onClick={() => navigate('/donate')}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--accent3)' }}
            >
              <NxHeart2 size={17} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
