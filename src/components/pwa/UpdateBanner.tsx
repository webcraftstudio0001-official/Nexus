import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { NxRefresh, NxX } from '@/components/icons/NexusIcons'
import { CURRENT_VERSION } from '@/types'
import { useAppStore } from '@/store'

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)
  const { lastSeenVersion, setLastSeenVersion } = useAppStore()

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registered:', r)
    },
    onRegisterError(error) {
      console.error('SW register error', error)
    },
  })

  useEffect(() => {
    if (needRefresh) setShowBanner(true)
  }, [needRefresh])

  // Also show changelog if version changed since last visit
  useEffect(() => {
    if (lastSeenVersion && lastSeenVersion !== CURRENT_VERSION.version) {
      setShowChangelog(true)
    }
    setLastSeenVersion(CURRENT_VERSION.version)
  }, [lastSeenVersion, setLastSeenVersion])

  const handleUpdate = () => {
    updateServiceWorker(true)
    setShowBanner(false)
  }

  return (
    <>
      {/* Update available banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-0 left-0 right-0 z-[2000] flex items-center justify-between px-4 py-3"
            style={{
              background: 'linear-gradient(90deg, rgba(108,99,255,0.95), rgba(0,212,255,0.95))',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <NxRefresh size={16} />
              <span>Nexus update available — v{CURRENT_VERSION.version}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
              >
                Update Now
              </button>
              <button
                onClick={() => setShowBanner(false)}
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <NxX size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Changelog modal */}
      <AnimatePresence>
        {showChangelog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1500] flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowChangelog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="w-full max-w-md nx-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
                    What&apos;s New in Nexus
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Version {CURRENT_VERSION.version} · {CURRENT_VERSION.date}
                  </p>
                </div>
                <button onClick={() => setShowChangelog(false)} style={{ color: 'var(--muted)' }}>
                  <NxX size={20} />
                </button>
              </div>

              <div className="space-y-2 mb-5">
                {CURRENT_VERSION.changelog.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: 'var(--accent1)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--text2)' }}>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowChangelog(false)}
                className="nx-btn nx-btn-primary w-full"
              >
                Got it — Let&apos;s Explore!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
