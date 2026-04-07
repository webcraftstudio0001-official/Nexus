import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { Shell } from '@/components/layout/Shell'
import { OnboardingSplash } from '@/components/OnboardingSplash'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { UpdateBanner } from '@/components/pwa/UpdateBanner'
import { useThemeStore, useAppStore } from '@/store'

// Lazy-loaded pages
import { lazy, Suspense } from 'react'
const Home        = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const AIChat      = lazy(() => import('@/pages/AIChat').then(m => ({ default: m.AIChat })))
const Study       = lazy(() => import('@/pages/Study').then(m => ({ default: m.Study })))
const Games       = lazy(() => import('@/pages/Games').then(m => ({ default: m.Games })))
const Music       = lazy(() => import('@/pages/Music').then(m => ({ default: m.Music })))
const Health      = lazy(() => import('@/pages/Health').then(m => ({ default: m.Health })))
const Calculator  = lazy(() => import('@/pages/Calculator').then(m => ({ default: m.Calculator })))
const News        = lazy(() => import('@/pages/News').then(m => ({ default: m.News })))
const Journal     = lazy(() => import('@/pages/Journal').then(m => ({ default: m.Journal })))
const Budget      = lazy(() => import('@/pages/Budget').then(m => ({ default: m.Budget })))
const AIArt       = lazy(() => import('@/pages/AIArt').then(m => ({ default: m.AIArt })))
const TimerPage   = lazy(() => import('@/pages/TimerPage').then(m => ({ default: m.TimerPage })))
const Translator  = lazy(() => import('@/pages/Translator').then(m => ({ default: m.Translator })))
const QRScanner   = lazy(() => import('@/pages/QRScanner').then(m => ({ default: m.QRScanner })))
const Flashlight  = lazy(() => import('@/pages/Flashlight').then(m => ({ default: m.Flashlight })))
const MoodTracker = lazy(() => import('@/pages/MoodTracker').then(m => ({ default: m.MoodTracker })))
const Habits      = lazy(() => import('@/pages/Habits').then(m => ({ default: m.Habits })))
const Recipes     = lazy(() => import('@/pages/Recipes').then(m => ({ default: m.Recipes })))
const Dictionary  = lazy(() => import('@/pages/Dictionary').then(m => ({ default: m.Dictionary })))
const About       = lazy(() => import('@/pages/About').then(m => ({ default: m.About })))
const Donate      = lazy(() => import('@/pages/Donate').then(m => ({ default: m.Donate })))
const Settings    = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))
const NotFound    = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

// Page loading skeleton
function PageLoader() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              background: 'var(--accent1)',
              animationDelay: `${i * 0.15}s`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const { theme, setTheme } = useThemeStore()
  const { setOnline } = useAppStore()
  const [splashDone, setSplashDone] = useState(false)

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setTheme(theme)
  }, [theme, setTheme])

  // Track session on every app open
  useEffect(() => {
    import('@/lib/supabase').then(({ trackSession, flushOfflineQueue }) => {
      trackSession()
      flushOfflineQueue()
    })
  }, [])

  // Track online/offline
  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [setOnline])

  // Show splash every time app opens
  if (!splashDone) {
    return <OnboardingSplash onComplete={() => setSplashDone(true)} />
  }

  return (
    <BrowserRouter>
      {/* Update notification banner */}
      <UpdateBanner />

      {/* PWA install prompt */}
      <InstallPrompt />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />

      {/* Main app shell with sidebar/topbar/right panel */}
      <Shell>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/ai"          element={<AIChat />} />
              <Route path="/study"       element={<Study />} />
              <Route path="/games"       element={<Games />} />
              <Route path="/music"       element={<Music />} />
              <Route path="/health"      element={<Health />} />
              <Route path="/calculator"  element={<Calculator />} />
              <Route path="/news"        element={<News />} />
              <Route path="/journal"     element={<Journal />} />
              <Route path="/budget"      element={<Budget />} />
              <Route path="/ai-art"      element={<AIArt />} />
              <Route path="/timer"       element={<TimerPage />} />
              <Route path="/translator"  element={<Translator />} />
              <Route path="/qr"          element={<QRScanner />} />
              <Route path="/flashlight"  element={<Flashlight />} />
              <Route path="/mood"        element={<MoodTracker />} />
              <Route path="/habits"      element={<Habits />} />
              <Route path="/recipes"     element={<Recipes />} />
              <Route path="/dictionary"  element={<Dictionary />} />
              <Route path="/about"       element={<About />} />
              <Route path="/donate"      element={<Donate />} />
              <Route path="/settings"    element={<Settings />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </Shell>
    </BrowserRouter>
  )
}
