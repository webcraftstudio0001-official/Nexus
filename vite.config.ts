import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // prompt user to update, not silent
      includeAssets: ['icons/*.png', 'icons/*.svg', 'screenshots/*.png'],
      manifest: {
        name: 'Nexus — Your All-in-One Universe',
        short_name: 'Nexus',
        description: 'Everything you need, everyone can use. AI chat, tools, games, health, music and more — built by WebCraft Studio.',
        theme_color: '#07080f',
        background_color: '#07080f',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        categories: ['productivity', 'utilities', 'lifestyle', 'education', 'entertainment'],
        icons: [
          { src: '/icons/nexus-72.png',   sizes: '72x72',   type: 'image/png' },
          { src: '/icons/nexus-96.png',   sizes: '96x96',   type: 'image/png' },
          { src: '/icons/nexus-128.png',  sizes: '128x128', type: 'image/png' },
          { src: '/icons/nexus-144.png',  sizes: '144x144', type: 'image/png' },
          { src: '/icons/nexus-152.png',  sizes: '152x152', type: 'image/png' },
          { src: '/icons/nexus-192.png',  sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/nexus-512.png',  sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/nexus-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/nexus-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.png',
            sizes: '1400x900',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Nexus Desktop Dashboard'
          },
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Nexus Mobile View'
          }
        ],
        shortcuts: [
          {
            name: 'AI Chat',
            short_name: 'AI',
            description: 'Open Nexus AI assistant',
            url: '/ai',
            icons: [{ src: '/icons/nexus-96.png', sizes: '96x96' }]
          },
          {
            name: 'Calculator',
            short_name: 'Calc',
            description: 'Open calculator',
            url: '/calculator',
            icons: [{ src: '/icons/nexus-96.png', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        // Cache strategies
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Cache API responses briefly
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Cache news/weather (short lived)
            urlPattern: /^https:\/\/(newsapi|openweathermap)\./i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'external-api-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 30 }
            }
          }
        ],
        // Precache all app assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        skipWaiting: false,
        clientsClaim: false
      },
      devOptions: { enabled: true }
    })
  ],
  resolve: {
    alias: { '@': '/src' }
  }
})
