import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NexusLogo, NxDownload, NxX } from '@/components/icons/NexusIcons'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Already installed or previously dismissed?
    const wasDismissed = localStorage.getItem('nexus-install-dismissed')
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    if (wasDismissed || isInstalled) return

    // Detect iOS (no beforeinstallprompt event)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    setIsIOS(ios)

    if (ios) {
      // Show iOS instructions after 10s
      const t = setTimeout(() => setShow(true), 10000)
      return () => clearTimeout(t)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after 8 seconds
      setTimeout(() => setShow(true), 8000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
        setDeferredPrompt(null)
      }
    }
  }

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    localStorage.setItem('nexus-install-dismissed', 'true')
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          className="fixed bottom-4 left-4 right-4 z-[1000] max-w-sm mx-auto"
        >
          <div
            className="nx-card p-5 relative overflow-hidden"
            style={{
              background: 'var(--glass)',
              border: '1px solid rgba(108,99,255,0.3)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Glow bg */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at top left, rgba(108,99,255,0.1), transparent 60%)',
              }}
            />

            {/* Dismiss */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-lg transition-colors"
              style={{ color: 'var(--muted)' }}
            >
              <NxX size={16} />
            </button>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,255,0.1))', border: '1px solid rgba(108,99,255,0.3)' }}
                >
                  <NexusLogo size={36} />
                </div>
                <div>
                  <p className="font-display font-bold text-base" style={{ color: 'var(--text)' }}>
                    Install Nexus
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    Your All-in-One Universe
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 mb-4">
                {[
                  { icon: 'âš¡', text: 'Instant launch from home screen' },
                  { icon: 'ðŸ“¡', text: 'Works offline, always available' },
                  { icon: 'ðŸ””', text: 'Stay updated with notifications' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs" style={{ color: 'var(--text2)' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {isIOS ? (
                // iOS instructions
                <div
                  className="rounded-xl p-3 text-xs space-y-1"
                  style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
                >
                  <p style={{ color: 'var(--text)' }} className="font-semibold">Add to Home Screen:</p>
                  <p style={{ color: 'var(--text2)' }}>1. Tap the <strong>Share</strong> button in Safari</p>
                  <p style={{ color: 'var(--text2)' }}>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                  <p style={{ color: 'var(--text2)' }}>3. Tap <strong>Add</strong> â€” done!</p>
                </div>
              ) : (
                // Android/Desktop install button
                <button
                  onClick={handleInstall}
                  className="nx-btn nx-btn-primary w-full"
                  style={{ borderRadius: '12px' }}
                >
                  <NxDownload size={16} />
                  Install App â€” It&apos;s Free
                </button>
              )}

              <p className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
                Built by{' '}
                <a
                  href="https://webcraft-studioo.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--accent2)' }}
                >
                  WebCraft Studio
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
