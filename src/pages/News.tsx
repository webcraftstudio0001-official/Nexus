import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NxNewspaper, NxGlobe, NxRefresh, NxWifiOff } from '@/components/icons/NexusIcons'
import { useAppStore } from '@/store'

interface WeatherData {
  temp: number; feels: number; desc: string; city: string
  humidity: number; wind: number; icon: string
}

const WEATHER_KEY  = import.meta.env.VITE_WEATHER_API_KEY ?? ''
const NEWS_KEY     = import.meta.env.VITE_NEWS_API_KEY ?? ''

const WEATHER_ICONS: Record<string, string> = {
  '01d':'☀', '01n':'☽', '02d':'⛅', '02n':'⛅', '03d':'☁', '03n':'☁',
  '04d':'☁', '04n':'☁', '09d':'🌧', '09n':'🌧', '10d':'🌦', '10n':'🌧',
  '11d':'⛈', '11n':'⛈', '13d':'❄', '13n':'❄', '50d':'🌫', '50n':'🌫',
}

interface Article { title: string; source: string; url: string; publishedAt: string; description: string }

const CATEGORIES = ['General','Technology','Science','Health','Sports','Business','Entertainment']

export function News() {
  const { isOnline } = useAppStore()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [category, setCategory] = useState('Technology')
  const [loadingW, setLoadingW] = useState(false)
  const [loadingN, setLoadingN] = useState(false)
  const [errorW, setErrorW] = useState('')
  const [errorN, setErrorN] = useState('')

  const fetchWeather = () => {
    if (!isOnline) return
    setLoadingW(true); setErrorW('')
    navigator.geolocation?.getCurrentPosition(async pos => {
      try {
        const { latitude: lat, longitude: lon } = pos.coords
        const url = WEATHER_KEY
          ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_KEY}`
          : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Weather API error')
        const d = await res.json()
        if (WEATHER_KEY) {
          setWeather({ temp: Math.round(d.main.temp), feels: Math.round(d.main.feels_like), desc: d.weather[0].description, city: d.name, humidity: d.main.humidity, wind: Math.round(d.wind.speed * 3.6), icon: d.weather[0].icon })
        } else {
          const code = d.current.weather_code
          const desc = code < 3 ? 'Clear' : code < 50 ? 'Cloudy' : code < 70 ? 'Rainy' : code < 80 ? 'Snowy' : 'Stormy'
          setWeather({ temp: Math.round(d.current.temperature_2m), feels: Math.round(d.current.temperature_2m - 2), desc, city: `${lat.toFixed(1)}°N`, humidity: d.current.relative_humidity_2m, wind: Math.round(d.current.wind_speed_10m), icon: '01d' })
        }
      } catch { setErrorW('Could not load weather.') }
      setLoadingW(false)
    }, () => { setErrorW('Location access denied.'); setLoadingW(false) })
  }

  const fetchNews = async () => {
    if (!isOnline) return
    setLoadingN(true); setErrorN('')
    try {
      const url = NEWS_KEY
        ? `https://newsapi.org/v2/top-headlines?category=${category.toLowerCase()}&language=en&pageSize=10&apiKey=${NEWS_KEY}`
        : `https://gnews.io/api/v4/top-headlines?category=${category.toLowerCase()}&lang=en&max=10&apikey=demo`
      const res = await fetch(url)
      if (!res.ok) throw new Error()
      const d = await res.json()
      const raw = d.articles ?? d.data ?? []
      setArticles(raw.slice(0, 10).map((a: Record<string, unknown>) => ({
        title: String(a.title ?? ''), source: String((a.source as Record<string,string>)?.name ?? a.source ?? ''),
        url: String(a.url ?? ''), publishedAt: String(a.publishedAt ?? a.publishedAt ?? ''),
        description: String(a.description ?? a.content ?? ''),
      })))
    } catch {
      setErrorN('Could not load news. Add a News API key in Settings.')
      setArticles(MOCK_NEWS)
    }
    setLoadingN(false)
  }

  useEffect(() => { if (isOnline) { fetchWeather(); fetchNews() } }, [isOnline, category])

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5 pb-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent2), var(--accent1))' }}>
          <NxNewspaper size={22} color="#fff" />
        </div>
        <h1 className="font-display font-black text-2xl flex-1" style={{ color: 'var(--text)' }}>News & Weather</h1>
        {!isOnline && <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(255,71,87,0.12)', color: '#ff4757' }}><NxWifiOff size={13} /> Offline</div>}
        <button onClick={() => { fetchWeather(); fetchNews() }} style={{ color: 'var(--muted)' }}><NxRefresh size={20} /></button>
      </motion.div>

      {/* Weather card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="relative rounded-3xl p-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(108,99,255,0.08))', border: '1px solid rgba(0,212,255,0.2)' }}>
        {loadingW ? (
          <div className="flex items-center gap-3"><div className="nx-shimmer w-16 h-16 rounded-2xl" /><div className="space-y-2"><div className="nx-shimmer w-32 h-5 rounded" /><div className="nx-shimmer w-24 h-3 rounded" /></div></div>
        ) : errorW ? (
          <div className="flex items-center gap-3">
            <NxGlobe size={32} color="var(--muted)" />
            <div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{errorW}</p>
              <button onClick={fetchWeather} className="text-xs mt-1" style={{ color: 'var(--accent2)' }}>Try again</button>
            </div>
          </div>
        ) : weather ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-black text-5xl" style={{ color: 'var(--text)' }}>{weather.temp}°</p>
              <p className="text-sm capitalize mt-1" style={{ color: 'var(--text2)' }}>{weather.desc}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>◈ {weather.city} · Feels {weather.feels}°</p>
              <div className="flex gap-4 mt-3">
                <span className="text-xs" style={{ color: 'var(--muted)' }}>◉ {weather.humidity}% humidity</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>◎ {weather.wind} km/h wind</span>
              </div>
            </div>
            <div className="text-7xl opacity-80">{WEATHER_ICONS[weather.icon] ?? '☁'}</div>
          </div>
        ) : (
          <div className="text-center py-2">
            <button onClick={fetchWeather} className="text-sm" style={{ color: 'var(--accent2)' }}>
              Allow location for weather
            </button>
          </div>
        )}
      </motion.div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: category === cat ? 'rgba(0,212,255,0.15)' : 'var(--card)',
              border: `1px solid ${category === cat ? 'rgba(0,212,255,0.35)' : 'var(--border)'}`,
              color: category === cat ? 'var(--accent2)' : 'var(--muted)',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="space-y-3">
        {loadingN ? Array(5).fill(0).map((_, i) => (
          <div key={i} className="nx-card p-4 space-y-2">
            <div className="nx-shimmer h-4 w-3/4 rounded" />
            <div className="nx-shimmer h-3 w-full rounded" />
            <div className="nx-shimmer h-3 w-1/2 rounded" />
          </div>
        )) : articles.map((a, i) => (
          <motion.a key={i} href={a.url} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="nx-card nx-card-interactive flex gap-3 p-4 no-underline block">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,212,255,0.12)', color: 'var(--accent2)' }}>{a.source}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm leading-snug mb-1" style={{ color: 'var(--text)' }}>{a.title}</h3>
              {a.description && <p className="text-xs line-clamp-2" style={{ color: 'var(--muted)' }}>{a.description}</p>}
            </div>
          </motion.a>
        ))}
        {errorN && !loadingN && articles.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{errorN}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const MOCK_NEWS: Article[] = [
  { title: 'AI Models Reach New Milestone in Reasoning Capability', source: 'Tech Review', url: '#', publishedAt: new Date().toISOString(), description: 'The latest generation of AI assistants demonstrates remarkable improvements in logical reasoning and problem-solving.' },
  { title: 'Progressive Web Apps See Record Adoption in 2026', source: 'Web Dev Weekly', url: '#', publishedAt: new Date().toISOString(), description: 'PWA installations have surpassed native app downloads for the first time, driven by offline capability and instant loading.' },
  { title: 'Scientists Discover New Method for Clean Energy Storage', source: 'Science Daily', url: '#', publishedAt: new Date().toISOString(), description: 'A breakthrough in hydrogen storage technology could revolutionize renewable energy distribution globally.' },
  { title: 'Global Mental Health Initiative Launches Free App Tools', source: 'Health News', url: '#', publishedAt: new Date().toISOString(), description: 'International coalition releases suite of mental wellness tools available without subscription.' },
  { title: 'Space Tourism Reaches New Heights with Record Flights', source: 'Space Today', url: '#', publishedAt: new Date().toISOString(), description: 'Commercial space travel hits a milestone with over 1,000 civilian passengers in a single quarter.' },
]
