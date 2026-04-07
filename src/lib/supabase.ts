import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ── Generate anonymous fingerprint ──
function getFingerprint(): string {
  const stored = localStorage.getItem('nx-fp')
  if (stored) return stored
  const fp = crypto.randomUUID()
  localStorage.setItem('nx-fp', fp)
  return fp
}

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

// ── Track session (called on app open) ──
export async function trackSession() {
  if (!supabase) return
  const fp = getFingerprint()
  const now = new Date().toISOString()
  const device = getDevice()
  const lang = navigator.language?.slice(0, 2) ?? 'en'

  try {
    const { data: existing } = await supabase
      .from('sessions')
      .select('id, total_visits')
      .eq('fingerprint', fp)
      .single()

    if (existing) {
      await supabase
        .from('sessions')
        .update({ last_seen: now, total_visits: (existing.total_visits ?? 0) + 1, device })
        .eq('id', existing.id)
    } else {
      await supabase.from('sessions').insert({
        fingerprint: fp,
        language: lang,
        device,
        theme: localStorage.getItem('nexus-theme') ?? 'dark-glass',
        first_seen: now,
        last_seen: now,
        total_visits: 1,
      })
    }
  } catch (_) {
    // Offline or Supabase not configured — silent fail
  }
}

// ── Track page view ──
export async function trackPageView(page: string) {
  if (!supabase) return
  const fp = getFingerprint()
  try {
    await supabase.from('page_views').insert({
      fingerprint: fp,
      page,
      timestamp: new Date().toISOString(),
    })
  } catch (_) {}
}

// ── Get analytics summary (for About/Admin page) ──
export async function getAnalytics() {
  if (!supabase) return null
  try {
    const { count: totalUsers } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count: onlineNow } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', fiveMinAgo)

    const { data: devices } = await supabase
      .from('sessions')
      .select('device')

    const deviceCounts = (devices ?? []).reduce<Record<string, number>>((acc, row) => {
      acc[row.device] = (acc[row.device] ?? 0) + 1
      return acc
    }, {})

    return { totalUsers: totalUsers ?? 0, onlineNow: onlineNow ?? 0, deviceCounts }
  } catch (_) {
    return null
  }
}

// ── Offline queue: sync pending actions when back online ──
const QUEUE_KEY = 'nx-offline-queue'

interface QueuedAction {
  type: 'page_view'
  page: string
  ts: string
}

export function queueOfflineAction(action: QueuedAction) {
  const q: QueuedAction[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]')
  q.push(action)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-50))) // keep max 50
}

export async function flushOfflineQueue() {
  if (!supabase) return
  const q: QueuedAction[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]')
  if (!q.length) return
  for (const action of q) {
    if (action.type === 'page_view') {
      await trackPageView(action.page)
    }
  }
  localStorage.removeItem(QUEUE_KEY)
}
