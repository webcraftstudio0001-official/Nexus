import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  NxHome, NxBot, NxBookOpen, NxGamepad, NxMusic, NxHeart,
  NxCalculator, NxNewspaper, NxNotebook, NxWallet, NxPalette,
  NxTimer, NxLanguages, NxQrCode, NxFlashlight, NxSmile,
  NxCheckSquare, NxChefHat, NxBook, NxSettings, NxInfo, NxHeart2
} from '@/components/icons/NexusIcons'
import { useAppStore } from '@/store'
import { type NavItem } from '@/types'

// Map icon name → component
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Home: NxHome, Bot: NxBot, BookOpen: NxBookOpen, Gamepad2: NxGamepad,
  Music2: NxMusic, Heart: NxHeart, Calculator: NxCalculator, Newspaper: NxNewspaper,
  NotebookPen: NxNotebook, Wallet: NxWallet, Palette: NxPalette, Timer: NxTimer,
  Languages: NxLanguages, ScanQrCode: NxQrCode, Flashlight: NxFlashlight,
  SmilePlus: NxSmile, CheckSquare: NxCheckSquare, ChefHat: NxChefHat,
  BookMarked: NxBook, Settings: NxSettings, Info: NxInfo, Donate: NxHeart2,
}

const MAIN_NAV: NavItem[] = [
  { id: 'home',       label: 'Home',           path: '/',           icon: 'Home' },
  { id: 'ai',         label: 'AI Chat',        path: '/ai',         icon: 'Bot',          badge: 'AI' },
  { id: 'study',      label: 'Study Hub',      path: '/study',      icon: 'BookOpen' },
  { id: 'games',      label: 'Games',          path: '/games',      icon: 'Gamepad2' },
  { id: 'music',      label: 'Music',          path: '/music',      icon: 'Music2' },
  { id: 'health',     label: 'Health',         path: '/health',     icon: 'Heart' },
  { id: 'calculator', label: 'Calculator',     path: '/calculator', icon: 'Calculator' },
  { id: 'news',       label: 'News & Weather', path: '/news',       icon: 'Newspaper',    onlineOnly: true },
  { id: 'journal',    label: 'Journal',        path: '/journal',    icon: 'NotebookPen' },
  { id: 'budget',     label: 'Budget',         path: '/budget',     icon: 'Wallet' },
  { id: 'aiart',      label: 'AI Art',         path: '/ai-art',     icon: 'Palette',      badge: 'AI' },
  { id: 'timer',      label: 'Timer',          path: '/timer',      icon: 'Timer' },
  { id: 'translate',  label: 'Translator',     path: '/translator', icon: 'Languages' },
  { id: 'qr',         label: 'QR Scanner',     path: '/qr',         icon: 'ScanQrCode' },
  { id: 'flashlight', label: 'Flashlight',     path: '/flashlight', icon: 'Flashlight' },
  { id: 'mood',       label: 'Mood Tracker',   path: '/mood',       icon: 'SmilePlus' },
  { id: 'habits',     label: 'Habits',         path: '/habits',     icon: 'CheckSquare' },
  { id: 'recipes',    label: 'Recipes',        path: '/recipes',    icon: 'ChefHat' },
  { id: 'dictionary', label: 'Dictionary',     path: '/dictionary', icon: 'BookMarked' },
]

const BOTTOM_NAV: NavItem[] = [
  { id: 'about',    label: 'About',    path: '/about',    icon: 'Info' },
  { id: 'donate',   label: 'Donate',   path: '/donate',   icon: 'Donate' },
  { id: 'settings', label: 'Settings', path: '/settings', icon: 'Settings' },
]

interface SidebarProps {
  collapsed: boolean
}

function NavBtn({ item, isActive, collapsed }: { item: NavItem; isActive: boolean; collapsed: boolean }) {
  const navigate = useNavigate()
  const Icon = ICON_MAP[item.icon] ?? NxHome
  const [showTip, setShowTip] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <motion.button
        onClick={() => navigate(item.path)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        className="relative flex items-center gap-3 rounded-xl transition-all w-full"
        style={{
          padding: collapsed ? '11px' : '10px 14px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          background: isActive
            ? 'linear-gradient(135deg, rgba(108,99,255,0.22), rgba(0,212,255,0.12))'
            : 'transparent',
          border: isActive ? '1px solid rgba(108,99,255,0.35)' : '1px solid transparent',
          color: isActive ? 'var(--accent2)' : 'var(--muted)',
        }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            layoutId="activeBar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
            style={{ background: 'linear-gradient(180deg, var(--accent1), var(--accent2))' }}
          />
        )}

        <Icon size={19} color={isActive ? 'var(--accent2)' : 'var(--muted)'} />

        {!collapsed && (
          <span className="text-sm font-medium truncate" style={{ color: isActive ? 'var(--text)' : 'var(--muted)' }}>
            {item.label}
          </span>
        )}

        {/* Badge */}
        {item.badge && !collapsed && (
          <span
            className="ml-auto text-xs px-1.5 py-0.5 rounded-md font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(0,212,255,0.2))',
              color: 'var(--accent2)',
              fontSize: '9px',
              letterSpacing: '0.05em',
            }}
          >
            {item.badge}
          </span>
        )}
      </motion.button>

      {/* Tooltip when collapsed */}
      <AnimatePresence>
        {collapsed && showTip && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border2)',
                color: 'var(--text)',
                boxShadow: '0 4px 16px var(--shadow)',
              }}
            >
              {item.label}
              {item.badge && (
                <span className="ml-1.5" style={{ color: 'var(--accent2)' }}>{item.badge}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation()

  return (
    <motion.nav
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col flex-shrink-0 overflow-hidden z-40"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100%',
      }}
    >
      <div className="flex flex-col h-full py-3 px-2 gap-1 overflow-y-auto">
        {/* Main nav items */}
        <div className="flex flex-col gap-0.5 flex-1">
          {MAIN_NAV.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <NavBtn
                item={item}
                isActive={location.pathname === item.path}
                collapsed={collapsed}
              />
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-1 h-px" style={{ background: 'var(--border)' }} />

        {/* Bottom nav: About, Donate, Settings */}
        <div className="flex flex-col gap-0.5">
          {BOTTOM_NAV.map(item => (
            <NavBtn
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </div>

        {/* Version tag when expanded */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 px-2 text-center"
          >
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Nexus v1.0.0
            </p>
            <a
              href="https://webcraft-studioo.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="text-xs hover:underline transition-colors"
              style={{ color: 'var(--accent2)', opacity: 0.7 }}
            >
              by WebCraft Studio
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
