// QR Scanner
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NxQrCode, NxCamera, NxX, NxRefresh } from '@/components/icons/NexusIcons'

export function QRScanner() {
  const [result, setResult] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const start = async () => {
    setError(null); setResult(null); setScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      // Use BarcodeDetector if available
      if ('BarcodeDetector' in window) {
        const bd = new (window as unknown as { BarcodeDetector: new(opts: object) => { detect: (v: HTMLVideoElement) => Promise<Array<{rawValue: string}>> } }).BarcodeDetector({ formats: ['qr_code','code_128','ean_13','upc_a'] })
        const interval = setInterval(async () => {
          if (!videoRef.current) return
          try {
            const codes = await bd.detect(videoRef.current)
            if (codes.length > 0) { setResult(codes[0].rawValue); stop(); clearInterval(interval) }
          } catch {}
        }, 300)
      } else {
        setTimeout(() => { setResult('Demo: QR scanning requires a modern browser with BarcodeDetector API.'); stop() }, 3000)
      }
    } catch { setError('Camera access denied or not available.'); setScanning(false) }
  }

  const stop = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null; setScanning(false)
  }

  useEffect(() => () => { stop() }, [])

  const isUrl = (s: string) => { try { new URL(s); return true } catch { return false } }

  return (
    <div className="flex flex-col h-full p-4 items-center justify-center gap-6 max-w-sm mx-auto">
      <div className="flex items-center gap-3 self-start">
        <NxQrCode size={24} color="var(--accent5)" />
        <h1 className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>QR Scanner</h1>
      </div>

      {!scanning && !result && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full flex flex-col items-center gap-6">
          <div className="w-52 h-52 rounded-3xl flex items-center justify-center relative"
            style={{ background: 'var(--card)', border: '2px solid var(--border)' }}>
            {/* Corner brackets */}
            {[['top-3 left-3','border-t-2 border-l-2'],['top-3 right-3','border-t-2 border-r-2'],['bottom-3 left-3','border-b-2 border-l-2'],['bottom-3 right-3','border-b-2 border-r-2']].map(([pos, cls], i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 ${cls}`} style={{ borderColor: 'var(--accent5)' }} />
            ))}
            <NxCamera size={56} color="var(--border2)" />
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={start}
            className="nx-btn nx-btn-primary w-full py-4 text-base">
            <NxCamera size={20} color="#fff" /> Start Scanning
          </motion.button>
        </motion.div>
      )}

      {scanning && (
        <div className="w-full relative rounded-3xl overflow-hidden" style={{ aspectRatio: '1' }}>
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 relative">
              {[['top-0 left-0','border-t-4 border-l-4'],['top-0 right-0','border-t-4 border-r-4'],['bottom-0 left-0','border-b-4 border-l-4'],['bottom-0 right-0','border-b-4 border-r-4']].map(([pos, cls], i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8 ${cls}`} style={{ borderColor: 'var(--accent5)' }} />
              ))}
              <motion.div className="absolute left-0 right-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent5), transparent)' }}
                animate={{ top: ['10%', '90%', '10%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
          </div>
          <button onClick={stop} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
            <NxX size={18} />
          </button>
        </div>
      )}

      {error && <div className="nx-card p-4 w-full text-center" style={{ borderColor: 'rgba(255,71,87,0.3)', color: '#ff4757' }}>{error}</div>}

      {result && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="nx-card p-5 w-full space-y-3">
          <p className="nx-label">Scan Result</p>
          <p className="text-sm break-all" style={{ color: 'var(--text)' }}>{result}</p>
          {isUrl(result) && (
            <a href={result} target="_blank" rel="noreferrer" className="nx-btn nx-btn-primary block text-center">Open Link</a>
          )}
          <button onClick={() => { setResult(null) }} className="nx-btn nx-btn-ghost w-full"><NxRefresh size={16} /> Scan Again</button>
        </motion.div>
      )}
    </div>
  )
}
