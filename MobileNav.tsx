import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  NxHome, NxBot, NxGamepad, NxBookOpen, NxMenu
} from '@/components/icons/NexusIcons'
import { useState } from 'react'
import { MobileDrawer } from './MobileDrawer'

const BOTTOM_ITEMS = [
  { path: '/',      icon: NxHome,     label: 'Home' },
  { path: '/ai',    icon: NxBot,      label: 'AI' },
  { path: '/games', icon: NxGamepad,  label: 'Games' },
  { path: '/study', icon: NxBookOpen, label: 'Study' },
]

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center px-2"
        style={{
          background: 'var(--glass)',
          borderTop: '1px solid var(--border)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)',
          paddingTop: '8px',
          height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {BOTTOM_ITEMS.map(item => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.88 }}
              className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl"
              style={{ color: isActive ? 'var(--accent2)' : 'var(--muted)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActive"
                  className="absolute w-8 h-0.5 rounded-full top-0"
                  style={{ background: 'linear-gradient(90deg, var(--accent1), var(--accent2))' }}
                />
              )}
              <Icon size={20} color={isActive ? 'var(--accent2)' : 'var(--muted)'} />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          )
        })}

        {/* More button */}
        <motion.button
          onClick={() => setDrawerOpen(true)}
          whileTap={{ scale: 0.88 }}
          className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl"
          style={{ color: 'var(--muted)' }}
        >
          <NxMenu size={20} />
          <span className="text-xs font-medium">More</span>
        </motion.button>
      </nav>

      {/* Full drawer for all tools */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
