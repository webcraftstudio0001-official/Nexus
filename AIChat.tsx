import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxBot, NxSend, NxX, NxRefresh, NxKey, NxSettings } from '@/components/icons/NexusIcons'
import { NexusLogo } from '@/components/icons/NexusIcons'
import { useAIStore } from '@/store'
import { streamAI, FREE_OPENROUTER_MODELS, GEMINI_MODELS, type ChatMessage } from '@/lib/ai'
import { useNavigate } from 'react-router-dom'
import type { AIProvider } from '@/types'

function MessageBubble({ role, content, isStreaming }: { role: 'user' | 'assistant'; content: string; isStreaming?: boolean }) {
  const isAI = role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
          <NexusLogo size={20} />
        </div>
      )}
      <div
        className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={isAI
          ? { background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', borderBottomLeftRadius: '6px' }
          : { background: 'linear-gradient(135deg, var(--accent1), rgba(0,212,255,0.85))', color: '#fff', borderBottomRightRadius: '6px' }
        }
      >
        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
            if (part.startsWith('`') && part.endsWith('`'))
              return <code key={i} className="px-1 rounded text-xs font-mono" style={{ background: 'rgba(255,255,255,0.15)' }}>{part.slice(1,-1)}</code>
            if (part.startsWith('**') && part.endsWith('**'))
              return <strong key={i}>{part.slice(2,-2)}</strong>
            return part
          })}
        </span>
        {isStreaming && (
          <motion.span animate={{ opacity: [1,0,1] }} transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block ml-1 w-0.5 h-4 rounded-full align-middle" style={{ background: 'var(--accent2)' }} />
        )}
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
        <NexusLogo size={20} />
      </div>
      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', borderBottomLeftRadius: '6px' }}>
        {[0,1,2].map(i => (
          <motion.div key={i} animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i*0.15 }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--muted)' }} />
        ))}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  'Explain quantum computing simply','Write a short poem about the ocean',
  'Help me plan a healthy meal','What are 5 fun facts about space?',
  'Teach me a word in Japanese','How do I improve my sleep?',
]

export function AIChat() {
  const navigate = useNavigate()
  const { settings, messages, isTyping, addMessage, clearMessages, setTyping, checkAndResetDaily, canSendMessage, updateSettings } = useAIStore()
  const [input, setInput] = useState('')
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<boolean>(false)

  useEffect(() => { checkAndResetDaily() }, [checkAndResetDaily])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamingText, isTyping])

  const hasKeys = !!(settings.customKey || import.meta.env.VITE_GEMINI_KEY || import.meta.env.VITE_OPENROUTER_KEY)
  const remainingMessages = settings.customKey ? Infinity : settings.dailyLimit - settings.usedToday

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return
    if (!canSendMessage()) { setError('Daily limit reached. Add your own API key in Settings for unlimited messages.'); return }
    if (!hasKeys) { setError('No AI keys configured. Please add your API key in Settings.'); return }

    setError(null)
    abortRef.current = false
    addMessage('user', text.trim())
    setInput('')
    setTyping(true)

    const history: ChatMessage[] = [
      ...messages.map(m => ({ role: m.role as 'user'|'assistant', content: m.content })),
      { role: 'user', content: text.trim() },
    ]

    const config = {
      provider: (settings.customKey ? 'custom' : settings.provider) as AIProvider,
      model: settings.model,
      openrouterKey: import.meta.env.VITE_OPENROUTER_KEY ?? settings.customKey,
      geminiKey: import.meta.env.VITE_GEMINI_KEY ?? '',
      customKey: settings.customKey,
      customBaseUrl: settings.customBaseUrl,
      customModel: settings.customModel,
    }

    let full = ''
    try {
      for await (const chunk of streamAI(history, config)) {
        if (abortRef.current) break
        if (chunk.text) { full += chunk.text; setStreamingText(full) }
        if (chunk.done) break
      }
      addMessage('assistant', full || 'Sorry, I could not generate a response.')
      if (!settings.customKey) updateSettings({ usedToday: settings.usedToday + 1 })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.'
      setError(msg)
      if (full) addMessage('assistant', full)
    } finally {
      setStreamingText('')
      setTyping(false)
    }
  }, [isTyping, canSendMessage, hasKeys, addMessage, setTyping, messages, settings, updateSettings])

  const allModels = [...FREE_OPENROUTER_MODELS, ...GEMINI_MODELS]

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
          <NexusLogo size={22} />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>Nexus AI</p>
          <div className="flex items-center gap-1.5">
            <motion.div animate={{ scale: [1,1.3,1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent5)' }} />
            <p className="text-xs" style={{ color: 'var(--accent5)' }}>{isTyping ? 'Thinking...' : 'Ready to help'}</p>
          </div>
        </div>

        {/* Model picker */}
        <div className="relative">
          <button onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            <NxBot size={13} />
            {allModels.find(m => m.id === settings.model)?.name ?? 'Auto Free'}
          </button>
          <AnimatePresence>
            {showModelPicker && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-64 nx-card py-2 z-50"
                style={{ background: 'var(--card)', maxHeight: '320px', overflowY: 'auto' }}>
                <p className="px-3 pb-1 text-xs font-bold uppercase" style={{ color: 'var(--muted)' }}>Free Models</p>
                {FREE_OPENROUTER_MODELS.map(m => (
                  <button key={m.id}
                    onClick={() => { updateSettings({ model: m.id, provider: 'openrouter' }); setShowModelPicker(false) }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs"
                    style={{ color: settings.model === m.id ? 'var(--accent2)' : 'var(--text)', background: settings.model === m.id ? 'rgba(0,212,255,0.08)' : 'transparent' }}>
                    <span>{m.name}</span><span style={{ color: 'var(--muted)' }}>{m.provider}</span>
                  </button>
                ))}
                <div className="mx-3 my-1 h-px" style={{ background: 'var(--border)' }} />
                <p className="px-3 pb-1 text-xs font-bold uppercase" style={{ color: 'var(--muted)' }}>Gemini</p>
                {GEMINI_MODELS.map(m => (
                  <button key={m.id}
                    onClick={() => { updateSettings({ model: m.id, provider: 'gemini' }); setShowModelPicker(false) }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs"
                    style={{ color: settings.model === m.id ? 'var(--accent2)' : 'var(--text)' }}>
                    <span>{m.name}</span><span style={{ color: 'var(--muted)' }}>Google</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={clearMessages} className="p-2 rounded-xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
          <NxRefresh size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-6 pb-8">
            <motion.div animate={{ scale: [1,1.05,1] }} transition={{ repeat: Infinity, duration: 3 }} className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))', opacity: 0.3, transform: 'scale(1.4)' }} />
              <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent1), var(--accent2))' }}>
                <NexusLogo size={44} />
              </div>
            </motion.div>
            <div className="text-center">
              <h2 className="font-display font-black text-2xl mb-1" style={{ color: 'var(--text)' }}>Nexus AI</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Ask me anything — I'm here to help everyone.</p>
              {!settings.customKey && (
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {remainingMessages} / {settings.dailyLimit} free messages today
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map(s => (
                <motion.button key={s} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-2 rounded-xl text-xs font-medium"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {messages.map(m => <MessageBubble key={m.id} role={m.role} content={m.content} />)}
        {streamingText && <MessageBubble role="assistant" content={streamingText} isStreaming />}
        {isTyping && !streamingText && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mx-4 mb-2 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
            style={{ background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.25)', color: '#ff4757' }}>
            <span className="flex-1 text-xs">{error}</span>
            <button onClick={() => setError(null)}><NxX size={14} /></button>
            {error.includes('key') && (
              <button onClick={() => navigate('/settings')}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(255,71,87,0.2)' }}>
                <NxKey size={12} /> Settings
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No keys warning */}
      {!hasKeys && messages.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mx-4 mb-2 px-4 py-3 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.25)', color: 'var(--accent4)' }}>
          <NxKey size={16} />
          <span className="flex-1 text-xs">Add a Gemini or OpenRouter API key in Settings to enable AI chat.</span>
          <button onClick={() => navigate('/settings')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(255,209,102,0.2)' }}>
            <NxSettings size={12} /> Settings
          </button>
        </motion.div>
      )}

      {/* Daily limit bar */}
      {!settings.customKey && messages.length > 0 && (
        <div className="px-4 mb-2">
          <div className="flex justify-between mb-1">
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Daily usage</p>
            <p className="text-xs font-semibold" style={{ color: remainingMessages <= 2 ? '#ff4757' : 'var(--muted)' }}>
              {settings.usedToday} / {settings.dailyLimit}
            </p>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(settings.usedToday/settings.dailyLimit)*100}%`, background: remainingMessages <= 2 ? 'linear-gradient(90deg,#ff4757,#ff6b9d)' : 'linear-gradient(90deg,var(--accent1),var(--accent2))' }} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-end gap-2 p-2 rounded-2xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border2)', boxShadow: '0 4px 20px var(--shadow)' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            placeholder={!hasKeys ? 'Add an API key in Settings first...' : !canSendMessage() ? 'Daily limit reached...' : 'Ask Nexus AI anything... (Enter to send)'}
            disabled={isTyping || !hasKeys || !canSendMessage()}
            rows={1}
            className="flex-1 bg-transparent outline-none text-sm resize-none py-2 px-2"
            style={{ color: 'var(--text)', maxHeight: '120px', lineHeight: '1.5', fontFamily: 'DM Sans, sans-serif' }}
            onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight,120)}px` }}
          />
          {isTyping ? (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { abortRef.current = true }}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,71,87,0.2)', color: '#ff4757' }}>
              <NxX size={16} />
            </motion.button>
          ) : (
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage(input)}
              disabled={!input.trim() || !hasKeys || !canSendMessage()}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: input.trim() && hasKeys && canSendMessage() ? 'linear-gradient(135deg, var(--accent1), var(--accent2))' : 'var(--card2)', color: input.trim() && hasKeys ? '#fff' : 'var(--muted)' }}>
              <NxSend size={16} />
            </motion.button>
          )}
        </div>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--muted)' }}>
          Nexus AI · Powered by OpenRouter & Gemini · Built by WebCraft Studio
        </p>
      </div>
    </div>
  )
}
