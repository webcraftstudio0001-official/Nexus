import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  NxHome, NxBot, NxBookOpen, NxGamepad, NxMusic, NxHeart,
  NxCalculator, NxNewspaper, NxNotebook, NxWallet, NxPalette,
  NxTimer, NxLanguages, NxQrCode, NxFlashlight, NxSmile,
  NxCheckSquare, NxChefHat, NxBook, NxSettings, NxInfo,
  NxHeart2, NxX
} from '@/components/icons/NexusIcons'

const ALL_TOOLS = [
  { path: '/',           icon: NxHome,         label: 'Home',         color: 'var(--accent1)' },
  { path: '/ai',         icon: NxBot,          label: 'AI Chat',      color: 'var(--accent2)', badge: 'AI' },
  { path: '/study',      icon: NxBookOpen,     label: 'Study',        color: 'var(--accent5)' },
  { path: '/games',      icon: NxGamepad,      label: 'Games',        color: 'var(--accent4)' },
  { path: '/music',      icon: NxMusic,        label: 'Music',        color: 'var(--accent3)' },
  { path: '/health',     icon: NxHeart,        label: 'Health',       color: '#ff4757' },
  { path: '/calculator', icon: NxCalculator,   label: 'Calculator',   color: 'var(--accent1)' },
  { path: '/news',       icon: NxNewspaper,    label: 'News',         color: 'var(--accent2)' },
  { path: '/journal',    icon: NxNotebook,     label: 'Journal',      color: 'var(--accent4)' },
  { path: '/budget',     icon: NxWallet,       label: 'Budget',       color: 'var(--accent5)' },
  { path: '/ai-art',     icon: NxPalette,      label: 'AI Art',       color: 'var(--accent3)', badge: 'AI' },
  { path: '/timer',      icon: NxTimer,        label: 'Timer',        color: 'var(--accent1)' },
  { path: '/translator', icon: NxLanguages,    label: 'Translate',    color: 'var(--accent2)' },
  { path: '/qr',         icon: NxQrCode,       label: 'QR Scan',      color: 'var(--accent5)' },
  { path: '/flashlight', icon: NxFlashlight,   label: 'Flashlight',   color: 'var(--accent4)' },
  { path: '/mood',       icon: NxSmile,        label: 'Mood',         color: 'var(--accent3)' },
  { path: '/habits',     icon: NxCheckSquare,  label: 'Habits',       color: 'var(--accent5)' },
  { path: '/recipes',    icon: NxChefHat,      label: 'Recipes',      color: 'var(--accent4)' },
  { path: '/dictionary', icon: NxBook,         label: 'Dictionary',   color: 'var(--accent1)' },
  { path: '/about',      icon: NxInfo,         label: 'About',        color: 'var(--muted)' },
  { path: '/donate',     icon: NxHeart2,       label: 'Donate',       color: 'var(--accent3)' },
  { path: '/settings',   icon: NxSettings,     label: 'Settings',     color: 'var(--muted)' },
]

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  const go = (path: string) => {
    navigate(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              maxHeight: '80vh',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border2)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h3 className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>
                All Tools
              </h3>
              <button onClick={onClose} style={{ color: 'var(--muted)' }}>
                <NxX size={20} />
              </button>
            </div>

            {/* Grid */}
            <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(80vh - 80px)' }}>
              <div className="grid grid-cols-4 gap-3">
                {ALL_TOOLS.map((tool, i) => {
                  const Icon = tool.icon
                  return (
                    <motion.button
                      key={tool.path}
                      onClick={() => go(tool.path)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center gap-2 py-3 rounded-2xl relative"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {tool.badge && (
                        <span
                          className="absolute top-1.5 right-1.5 text-xs px-1 rounded"
                          style={{ background: 'var(--accent1)', color: '#fff', fontSize: '7px', fontWeight: 700 }}
                        >
                          {tool.badge}
                        </span>
                      )}
                      <Icon size={22} color={tool.color} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
                        {tool.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
