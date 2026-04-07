import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeId, AISettings, AIProvider } from '@/types'

// ── THEME STORE ──
interface ThemeStore {
  theme: ThemeId
  setTheme: (t: ThemeId) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark-glass',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme)
        set({ theme })
      },
    }),
    { name: 'nexus-theme' }
  )
)

// ── AI STORE ──
interface AIStore {
  settings: AISettings
  messages: { id: string; role: 'user' | 'assistant'; content: string; ts: number }[]
  isTyping: boolean
  updateSettings: (s: Partial<AISettings>) => void
  addMessage: (role: 'user' | 'assistant', content: string) => void
  clearMessages: () => void
  setTyping: (v: boolean) => void
  checkAndResetDaily: () => void
  canSendMessage: () => boolean
}

const defaultAISettings: AISettings = {
  provider: 'openrouter' as AIProvider,
  model: 'meta-llama/llama-3.3-70b-instruct:free',
  customKey: '',
  customBaseUrl: '',
  customModel: '',
  dailyLimit: 10,
  usedToday: 0,
  lastResetDate: new Date().toDateString(),
}

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      settings: defaultAISettings,
      messages: [],
      isTyping: false,
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),
      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: crypto.randomUUID(), role, content, ts: Date.now() },
          ],
        })),
      clearMessages: () => set({ messages: [] }),
      setTyping: (v) => set({ isTyping: v }),
      checkAndResetDaily: () => {
        const today = new Date().toDateString()
        const { settings } = get()
        if (settings.lastResetDate !== today) {
          set((state) => ({
            settings: { ...state.settings, usedToday: 0, lastResetDate: today },
          }))
        }
      },
      canSendMessage: () => {
        const { settings } = get()
        if (settings.customKey) return true // unlimited with own key
        return settings.usedToday < settings.dailyLimit
      },
    }),
    { name: 'nexus-ai' }
  )
)

// ── APP STORE (onboarding, version, misc) ──
interface AppStore {
  hasSeenOnboarding: boolean    // tracks if EVER seen (not used for every-launch)
  lastSeenVersion: string
  isOnline: boolean
  sidebarCollapsed: boolean
  currentPage: string
  markOnboardingSeen: () => void
  setLastSeenVersion: (v: string) => void
  setOnline: (v: boolean) => void
  toggleSidebar: () => void
  setCurrentPage: (p: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      lastSeenVersion: '',
      isOnline: navigator.onLine,
      sidebarCollapsed: false,
      currentPage: '/',
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
      setLastSeenVersion: (v) => set({ lastSeenVersion: v }),
      setOnline: (v) => set({ isOnline: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setCurrentPage: (p) => set({ currentPage: p }),
    }),
    { name: 'nexus-app' }
  )
)
