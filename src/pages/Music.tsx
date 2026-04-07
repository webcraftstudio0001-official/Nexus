import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxMusic, NxPlay, NxPause, NxSkipNext, NxSkipPrev, NxShuffle, NxVolume, NxPlus, NxX, NxTrash } from '@/components/icons/NexusIcons'

interface Track { id: string; title: string; artist: string; src: string; color: string; duration?: number }

const DEMO_TRACKS: Track[] = [
  { id: '1', title: 'Stellar Drift', artist: 'Nexus Beats · Ambient',   src: '', color: '#6c63ff' },
  { id: '2', title: 'Deep Focus',   artist: 'Nexus Beats · LoFi',      src: '', color: '#00d4ff' },
  { id: '3', title: 'Neon Sunrise', artist: 'Nexus Beats · Electronic', src: '', color: '#ff6b9d' },
  { id: '4', title: 'Ocean Calm',   artist: 'Nexus Beats · Ambient',   src: '', color: '#06d6a0' },
  { id: '5', title: 'City Lights',  artist: 'Nexus Beats · Jazz',      src: '', color: '#ffd166' },
]

const KEY = 'nx-music-tracks'
const loadUserTracks = (): Track[] => JSON.parse(localStorage.getItem(KEY) ?? '[]')

// Animated visualizer bars
function Visualizer({ playing, color }: { playing: boolean; color: string }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: color, opacity: 0.8 }}
          animate={playing ? {
            height: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 80}%`, `${20 + Math.random() * 40}%`],
          } : { height: '20%' }}
          transition={{ duration: 0.4 + Math.random() * 0.3, repeat: playing ? Infinity : 0, repeatType: 'reverse', delay: i * 0.03 }}
        />
      ))}
    </div>
  )
}

// Album art geometric placeholder
function AlbumArt({ color, size = 200 }: { color: string; size?: number }) {
  return (
    <div className="relative rounded-3xl overflow-hidden flex-shrink-0" style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}30, ${color}08)`, border: `1px solid ${color}25` }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" stroke={color} strokeWidth="1.5" opacity="0.3" />
          <circle cx="40" cy="40" r="25" stroke={color} strokeWidth="1.5" opacity="0.5" />
          <circle cx="40" cy="40" r="15" stroke={color} strokeWidth="1.5" opacity="0.7" />
          <circle cx="40" cy="40" r="5" fill={color} />
          <line x1="40" y1="5" x2="40" y2="15" stroke={color} strokeWidth="1.5" opacity="0.4" />
          <line x1="40" y1="65" x2="40" y2="75" stroke={color} strokeWidth="1.5" opacity="0.4" />
          <line x1="5" y1="40" x2="15" y2="40" stroke={color} strokeWidth="1.5" opacity="0.4" />
          <line x1="65" y1="40" x2="75" y2="40" stroke={color} strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 30%, ${color}20, transparent 60%)` }} />
    </div>
  )
}

export function Music() {
  const [allTracks] = useState<Track[]>([...DEMO_TRACKS, ...loadUserTracks()])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [shuffle, setShuffle] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [simTime, setSimTime] = useState(0)
  const simRef = useRef<number | null>(null)

  const track = allTracks[currentIdx]

  // Simulate playback progress (since demo tracks have no src)
  useEffect(() => {
    if (playing) {
      simRef.current = window.setInterval(() => {
        setSimTime(t => {
          if (t >= 227) { setPlaying(false); return 0 }
          return t + 1
        })
      }, 1000)
    } else {
      if (simRef.current) clearInterval(simRef.current)
    }
    return () => { if (simRef.current) clearInterval(simRef.current) }
  }, [playing])

  useEffect(() => { setProgress((simTime / 227) * 100) }, [simTime])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const next = () => {
    const nextIdx = shuffle
      ? Math.floor(Math.random() * allTracks.length)
      : (currentIdx + 1) % allTracks.length
    setCurrentIdx(nextIdx); setSimTime(0); setProgress(0)
  }
  const prev = () => { setCurrentIdx(i => (i - 1 + allTracks.length) % allTracks.length); setSimTime(0); setProgress(0) }

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setSimTime(Math.floor(pct * 227)); setProgress(pct * 100)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <NxMusic size={22} color="var(--accent3)" />
        <h1 className="font-display font-bold text-lg flex-1" style={{ color: 'var(--text)' }}>Music Player</h1>
        <button onClick={() => setShowPlaylist(!showPlaylist)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: showPlaylist ? 'rgba(255,107,157,0.15)' : 'var(--card)', border: '1px solid var(--border)', color: showPlaylist ? 'var(--accent3)' : 'var(--muted)' }}>
          Playlist ({allTracks.length})
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main player */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
          {/* Album art with rotation animation */}
          <motion.div animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}>
            <AlbumArt color={track.color} size={200} />
          </motion.div>

          {/* Visualizer */}
          <Visualizer playing={playing} color={track.color} />

          {/* Track info */}
          <div className="text-center">
            <motion.h2 key={track.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="font-display font-black text-2xl" style={{ color: 'var(--text)' }}>
              {track.title}
            </motion.h2>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{track.artist}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="relative h-1.5 rounded-full cursor-pointer" style={{ background: 'var(--border)' }}
              onClick={scrub} ref={progressRef}>
              <motion.div className="absolute left-0 top-0 h-full rounded-full"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${track.color}, var(--accent2))` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow-lg"
                style={{ left: `calc(${progress}% - 7px)`, background: track.color, border: '2px solid var(--bg)' }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{fmt(simTime)}</span>
              <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>3:47</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShuffle(!shuffle)}
              style={{ color: shuffle ? track.color : 'var(--muted)' }}>
              <NxShuffle size={20} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }} onClick={prev} style={{ color: 'var(--text)' }}>
              <NxSkipPrev size={26} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.88 }}
              onClick={() => setPlaying(!playing)}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${track.color}, var(--accent2))`, boxShadow: `0 6px 24px ${track.color}40` }}>
              {playing ? <NxPause size={28} color="#fff" /> : <NxPlay size={28} color="#fff" />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }} onClick={next} style={{ color: 'var(--text)' }}>
              <NxSkipNext size={26} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }} style={{ color: 'var(--muted)' }}>
              <NxVolume size={20} />
            </motion.button>
          </div>

          {/* Volume */}
          <div className="w-full max-w-xs flex items-center gap-3">
            <NxVolume size={14} color="var(--muted)" />
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(+e.target.value)}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: track.color }} />
            <span className="text-xs w-8 text-right" style={{ color: 'var(--muted)' }}>{volume}%</span>
          </div>

          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Add your own music files via the playlist panel ◈
          </p>
        </div>

        {/* Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div initial={{ opacity: 0, x: 240 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 240 }}
              className="w-64 flex flex-col border-l overflow-y-auto"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <div className="p-4">
                <p className="nx-label mb-3">Queue</p>
                <div className="space-y-1">
                  {allTracks.map((t, i) => (
                    <motion.button key={t.id}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      onClick={() => { setCurrentIdx(i); setSimTime(0); setProgress(0) }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all"
                      style={{
                        background: currentIdx === i ? `${t.color}15` : 'transparent',
                        border: `1px solid ${currentIdx === i ? `${t.color}30` : 'transparent'}`,
                      }}>
                      <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: `${t.color}20` }}>
                        {currentIdx === i && playing
                          ? <motion.div animate={{ scale: [1,1.3,1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                              className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                          : <NxMusic size={14} color={t.color} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: currentIdx === i ? t.color : 'var(--text)' }}>{t.title}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{t.artist.split(' · ')[1]}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
