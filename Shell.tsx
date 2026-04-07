import { useState, useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { useAppStore } from '@/store'

interface ShellProps {
  children: ReactNode
}

export function Shell({ children }: ShellProps) {
  const location = useLocation()
  const { sidebarCollapsed, setCurrentPage } = useAppStore()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    setCurrentPage(location.pathname)
  }, [location.pathname, setCurrentPage])

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Topbar — always full width */}
      <Topbar isMobile={isMobile} isTablet={isTablet} />

      {/* Body row */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — desktop/tablet only */}
        {!isMobile && (
          <Sidebar collapsed={isTablet ? true : sidebarCollapsed} />
        )}

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            paddingBottom: isMobile ? '80px' : '0',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && <MobileNav />}
    </div>
  )
}
