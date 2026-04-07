/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Nexus dark glass theme (default)
        nx: {
          bg:       '#07080f',
          surface:  '#0e1017',
          card:     '#13151f',
          card2:    '#181b26',
          border:   'rgba(255,255,255,0.07)',
          accent1:  '#6c63ff', // violet
          accent2:  '#00d4ff', // cyan
          accent3:  '#ff6b9d', // pink
          accent4:  '#ffd166', // gold
          accent5:  '#06d6a0', // mint
          text:     '#f0f2ff',
          muted:    '#7a7f9a',
        }
      },
      backgroundImage: {
        'nx-mesh': `
          radial-gradient(ellipse 700px 500px at 10% 20%, rgba(108,99,255,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 500px 400px at 90% 10%, rgba(0,212,255,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 600px 400px at 60% 90%, rgba(255,107,157,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 400px 300px at 30% 70%, rgba(6,214,160,0.05) 0%, transparent 70%)
        `,
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease forwards',
        'slide-up':      'slideUp 0.4s ease forwards',
        'slide-in-left': 'slideInLeft 0.4s ease forwards',
        'float':         'float 6s ease-in-out infinite',
        'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
        'spin-slow':     'spin 8s linear infinite',
        'shimmer':       'shimmer 2s infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' },                    to: { opacity: '1' } },
        slideUp:      { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:  { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        float:        { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow:    { '0%,100%': { boxShadow: '0 0 20px rgba(108,99,255,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(108,99,255,0.6)' } },
        shimmer:      { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceSubtle: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'nx':      '0 4px 24px rgba(0,0,0,0.4)',
        'nx-lg':   '0 8px 48px rgba(0,0,0,0.6)',
        'nx-glow': '0 0 30px rgba(108,99,255,0.25)',
        'nx-cyan': '0 0 30px rgba(0,212,255,0.2)',
        'nx-pink': '0 0 30px rgba(255,107,157,0.2)',
      },
      borderRadius: { 'nx': '16px', 'nx-lg': '24px' },
    }
  },
  plugins: []
}
