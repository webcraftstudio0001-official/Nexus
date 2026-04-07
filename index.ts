// ── THEME TYPES ──
export type ThemeId =
  | 'dark-glass'
  | 'vibrant-light'
  | 'midnight-purple'
  | 'clean-white'
  | 'ocean-breeze'

export interface Theme {
  id: ThemeId
  name: string
  description: string
  preview: {
    bg: string
    card: string
    accent1: string
    accent2: string
    accent3: string
  }
  isDark: boolean
}

export const THEMES: Theme[] = [
  {
    id: 'dark-glass',
    name: 'Dark Glassmorphism',
    description: 'Deep dark with glowing accents. The signature Nexus look.',
    preview: { bg: '#07080f', card: '#13151f', accent1: '#6c63ff', accent2: '#00d4ff', accent3: '#ff6b9d' },
    isDark: true,
  },
  {
    id: 'vibrant-light',
    name: 'Vibrant Light',
    description: 'Bright, energetic, colorful. Fun for all ages.',
    preview: { bg: '#f4f6ff', card: '#ffffff', accent1: '#5b52f0', accent2: '#0099cc', accent3: '#e0447a' },
    isDark: false,
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Rich deep purple. Moody and mysterious.',
    preview: { bg: '#0a0612', card: '#17122a', accent1: '#b04aff', accent2: '#7c3aed', accent3: '#ff6bdc' },
    isDark: true,
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    description: 'Minimal, calm, professional. Distraction-free.',
    preview: { bg: '#fafafa', card: '#ffffff', accent1: '#3b4ef8', accent2: '#0ea5e9', accent3: '#f43f8a' },
    isDark: false,
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Deep ocean blues and teals. Calm and focused.',
    preview: { bg: '#040e1a', card: '#0c1e33', accent1: '#00c8dc', accent2: '#0090ff', accent3: '#00e4b0' },
    isDark: true,
  },
]

// ── AI TYPES ──
export type AIProvider = 'openrouter' | 'gemini' | 'custom'

export interface AIModel {
  id: string
  name: string
  provider: AIProvider
  isFree: boolean
  contextWindow: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  provider?: AIProvider
}

export interface AISettings {
  provider: AIProvider
  model: string
  customKey: string
  customBaseUrl: string
  customModel: string
  dailyLimit: number
  usedToday: number
  lastResetDate: string
}

// ── USER / ANALYTICS TYPES ──
export interface UserSession {
  id: string
  fingerprint: string
  country?: string
  language: string
  device: 'mobile' | 'tablet' | 'desktop'
  theme: ThemeId
  firstSeen: number
  lastSeen: number
  totalVisits: number
}

export interface PageView {
  page: string
  timestamp: number
  duration?: number
}

// ── APP TYPES ──
export interface NexusVersion {
  version: string
  date: string
  changelog: string[]
}

export const CURRENT_VERSION: NexusVersion = {
  version: '1.0.0',
  date: '2026-04-05',
  changelog: [
    'Initial launch of Nexus',
    'Dark Glassmorphism theme + 4 theme options',
    'AI Chat with OpenRouter + Gemini',
    '19 built-in tools and pages',
    '20+ language support',
    'Full offline support',
    'PWA installable on all devices',
  ]
}

// ── NAVIGATION TYPES ──
export interface NavItem {
  id: string
  label: string
  path: string
  icon: string  // icon component name
  onlineOnly?: boolean
  badge?: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home',       label: 'Home',           path: '/',           icon: 'Home' },
  { id: 'ai',         label: 'AI Chat',        path: '/ai',         icon: 'Bot',        onlineOnly: true, badge: 'AI' },
  { id: 'study',      label: 'Study Hub',      path: '/study',      icon: 'BookOpen' },
  { id: 'games',      label: 'Games',          path: '/games',      icon: 'Gamepad2' },
  { id: 'music',      label: 'Music',          path: '/music',      icon: 'Music2' },
  { id: 'health',     label: 'Health',         path: '/health',     icon: 'Heart' },
  { id: 'calculator', label: 'Calculator',     path: '/calculator', icon: 'Calculator' },
  { id: 'news',       label: 'News & Weather', path: '/news',       icon: 'Newspaper', onlineOnly: true },
  { id: 'journal',    label: 'Journal',        path: '/journal',    icon: 'NotebookPen' },
  { id: 'budget',     label: 'Budget',         path: '/budget',     icon: 'Wallet' },
  { id: 'aiart',      label: 'AI Art',         path: '/ai-art',     icon: 'Palette',    onlineOnly: true, badge: 'AI' },
  { id: 'timer',      label: 'Timer',          path: '/timer',      icon: 'Timer' },
  { id: 'translate',  label: 'Translator',     path: '/translator', icon: 'Languages',  onlineOnly: true },
  { id: 'qr',         label: 'QR Scanner',     path: '/qr',         icon: 'ScanQrCode' },
  { id: 'flashlight', label: 'Flashlight',     path: '/flashlight', icon: 'Flashlight' },
  { id: 'mood',       label: 'Mood Tracker',   path: '/mood',       icon: 'SmilePlus' },
  { id: 'habits',     label: 'Habits',         path: '/habits',     icon: 'CheckSquare' },
  { id: 'recipes',    label: 'Recipes',        path: '/recipes',    icon: 'ChefHat' },
  { id: 'dictionary', label: 'Dictionary',     path: '/dictionary', icon: 'BookMarked',  onlineOnly: true },
]
