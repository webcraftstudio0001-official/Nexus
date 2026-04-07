import type { AIProvider } from '@/types'

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta'

// Free OpenRouter models (no credit card needed)
export const FREE_OPENROUTER_MODELS = [
  { id: 'meta-llama/llama-3.3-70b-instruct:free',   name: 'Llama 3.3 70B',       provider: 'Meta' },
  { id: 'google/gemma-3-27b-it:free',                name: 'Gemma 3 27B',          provider: 'Google' },
  { id: 'deepseek/deepseek-r1:free',                 name: 'DeepSeek R1',          provider: 'DeepSeek' },
  { id: 'mistralai/mistral-7b-instruct:free',        name: 'Mistral 7B',           provider: 'Mistral' },
  { id: 'qwen/qwen3-235b-a22b:free',                 name: 'Qwen 3 235B',          provider: 'Alibaba' },
  { id: 'openrouter/free',                           name: 'Auto Free',            provider: 'OpenRouter' },
]

export const GEMINI_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'Google' },
  { id: 'gemini-1.5-pro',   name: 'Gemini 1.5 Pro',   provider: 'Google' },
]

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StreamChunk {
  text: string
  done: boolean
}

// ── OpenRouter streaming ──
async function* streamOpenRouter(
  messages: ChatMessage[],
  model: string,
  apiKey: string
): AsyncGenerator<StreamChunk> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://nexus-pwa.pages.dev',
      'X-Title': 'Nexus — Your All-in-One Universe',
    },
    body: JSON.stringify({
      model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) throw new Error('No response body')

  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') { yield { text: '', done: true }; return }
      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content ?? ''
        if (text) yield { text, done: false }
      } catch (_) {}
    }
  }
  yield { text: '', done: true }
}

// ── Gemini streaming ──
async function* streamGemini(
  messages: ChatMessage[],
  model: string,
  apiKey: string
): AsyncGenerator<StreamChunk> {
  // Convert chat history to Gemini format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const lastMsg = messages[messages.length - 1]

  const res = await fetch(
    `${GEMINI_BASE}/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...history,
          { role: 'user', parts: [{ text: lastMsg.content }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        systemInstruction: {
          parts: [{
            text: 'You are Nexus AI, a helpful, friendly, and knowledgeable assistant built into the Nexus app by WebCraft Studio. Be concise, helpful, and engaging. Support all topics from children to adults.'
          }]
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini error ${res.status}: ${err}`)
  }

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) throw new Error('No response body')

  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      try {
        const json = JSON.parse(data)
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        if (text) yield { text, done: false }
      } catch (_) {}
    }
  }
  yield { text: '', done: true }
}

// ── Custom OpenAI-compatible endpoint ──
async function* streamCustom(
  messages: ChatMessage[],
  baseUrl: string,
  model: string,
  apiKey: string
): AsyncGenerator<StreamChunk> {
  const url = baseUrl.endsWith('/') ? `${baseUrl}chat/completions` : `${baseUrl}/chat/completions`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) throw new Error(`Custom API error ${res.status}`)
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) throw new Error('No response body')

  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') { yield { text: '', done: true }; return }
      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content ?? ''
        if (text) yield { text, done: false }
      } catch (_) {}
    }
  }
  yield { text: '', done: true }
}

// ── Main AI router ──
export interface AIRouterConfig {
  provider: AIProvider
  model: string
  openrouterKey: string
  geminiKey: string
  customKey: string
  customBaseUrl: string
  customModel: string
}

export async function* streamAI(
  messages: ChatMessage[],
  config: AIRouterConfig
): AsyncGenerator<StreamChunk> {
  const systemMsg: ChatMessage = {
    role: 'system',
    content: 'You are Nexus AI — a helpful, friendly, and knowledgeable AI assistant built into the Nexus all-in-one app, created by WebCraft Studio. You help people of all ages with anything they need. Be warm, concise, and engaging.',
  }
  const fullMessages = [systemMsg, ...messages]

  if (config.provider === 'custom' && config.customKey && config.customBaseUrl) {
    yield* streamCustom(fullMessages, config.customBaseUrl, config.customModel || 'gpt-4o-mini', config.customKey)
    return
  }

  if (config.provider === 'gemini' && config.geminiKey) {
    try {
      yield* streamGemini(messages, config.model || 'gemini-2.0-flash', config.geminiKey)
      return
    } catch (e) {
      // Fallback to OpenRouter
      console.warn('Gemini failed, trying OpenRouter:', e)
    }
  }

  if (config.openrouterKey) {
    try {
      yield* streamOpenRouter(fullMessages, config.model || FREE_OPENROUTER_MODELS[0].id, config.openrouterKey)
      return
    } catch (e) {
      console.warn('OpenRouter failed:', e)
    }
  }

  // Last resort: try Gemini
  if (config.geminiKey) {
    yield* streamGemini(messages, 'gemini-2.0-flash', config.geminiKey)
    return
  }

  throw new Error('No AI provider configured. Please add an API key in Settings.')
}
