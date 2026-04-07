/**
 * NEXUS CUSTOM ICON SYSTEM
 * ─────────────────────────────────────────────────────
 * 30+ hand-crafted SVG icons. Zero emojis. Zero emoji fallbacks.
 * Each icon is a unique geometric design built for Nexus.
 * Designed by WebCraft Studio for the Nexus PWA.
 * ─────────────────────────────────────────────────────
 */

import type { SVGProps, ReactNode } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number
  color?: string
  gradient?: boolean
}

// ── Base SVG wrapper ──
const Nx = (
  size: number,
  color: string,
  children: ReactNode,
  props: IconProps
) => (
  <svg
    width={size} height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="gv" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6c63ff" />
        <stop offset="100%" stopColor="#00d4ff" />
      </linearGradient>
      <linearGradient id="gp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b9d" />
        <stop offset="100%" stopColor="#ffd166" />
      </linearGradient>
      <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06d6a0" />
        <stop offset="100%" stopColor="#00d4ff" />
      </linearGradient>
    </defs>
    {children}
  </svg>
)

// ── HOME ── geometric house with depth
export const NxHome = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M6 20.5V44h13V32h10v12h13V20.5L24 6 6 20.5Z" fill={color} fillOpacity="0.15" />
    <path d="M6 20.5V44h13V32h10v12h13V20.5L24 6 6 20.5Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M2 22L24 4l22 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="20" y="30" width="8" height="14" rx="1.5" fill={color} fillOpacity="0.4" />
    <rect x="30" y="19" width="4" height="6" rx="1" fill={color} fillOpacity="0.6" />
  </>, p)

// ── AI BOT ── robot face with glowing eye indicators
export const NxBot = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <rect x="8" y="16" width="32" height="24" rx="6" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <circle cx="17" cy="27" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.8" />
    <circle cx="17" cy="27" r="1.8" fill={color} />
    <circle cx="31" cy="27" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.8" />
    <circle cx="31" cy="27" r="1.8" fill={color} />
    <path d="M18 34h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M24 16V10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="8" r="2.5" fill={color} />
    <path d="M8 22h-4M40 22h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </>, p)

// ── BOOK OPEN ── open book with pages and text lines
export const NxBookOpen = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M24 10C24 10 14 7 6 9v28c8-2 18 1 18 1V10Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M24 10c0 0 10-3 18-1v28c-8-2-18 1-18 1V10Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="24" y1="10" x2="24" y2="38" stroke={color} strokeWidth="1.5" />
    <path d="M10 18h10M10 24h10M10 30h7" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    <path d="M28 18h10M28 24h10M28 30h7" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
  </>, p)

// ── GAMEPAD ── controller with D-pad and colored face buttons
export const NxGamepad = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <rect x="4" y="14" width="40" height="22" rx="9" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <path d="M13 22v6M10 25h6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="34" cy="22" r="2.5" fill="#6c63ff" />
    <circle cx="39" cy="25.5" r="2.5" fill="#ff6b9d" />
    <circle cx="34" cy="29" r="2.5" fill="#ffd166" />
    <circle cx="29" cy="25.5" r="2.5" fill="#06d6a0" />
    <rect x="19" y="24" width="10" height="3" rx="1.5" fill={color} fillOpacity="0.3" />
  </>, p)

// ── MUSIC NOTE ── double eighth note with beam
export const NxMusic = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <ellipse cx="14" cy="38" rx="6.5" ry="5" transform="rotate(-15 14 38)" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <ellipse cx="34" cy="34" rx="6.5" ry="5" transform="rotate(-15 34 34)" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <line x1="20" y1="34.5" x2="20" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="30" x2="40" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 8C26 6 34 5 40 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 16C26 14 34 13 40 14" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── HEART ── anatomically styled heart with inner highlight
export const NxHeart = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M24 42C24 42 5 30 5 17.5C5 11.6 9.7 7 15.5 7C19 7 22.2 8.8 24 11.7C25.8 8.8 29 7 32.5 7C38.3 7 43 11.6 43 17.5C43 30 24 42 24 42Z"
      fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M15 14C13 15.5 11.5 18 11.5 20.5" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── CALCULATOR ── with display + colored button grid
export const NxCalculator = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <rect x="8" y="4" width="32" height="40" rx="5" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <rect x="12" y="9" width="24" height="9" rx="2.5" fill={color} fillOpacity="0.3" />
    <path d="M36 15.5H28" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {/* Operator buttons */}
    {[
      [13,24,'#6c63ff'],[21,24,'#6c63ff'],[29,24,'#00d4ff'],[37,24,'#ff6b9d'],
      [13,31,'white'],[21,31,'white'],[29,31,'white'],[37,31,'#ffd166'],
      [13,38,'white'],[21,38,'white'],[29,38,'white'],[37,38,'#06d6a0'],
    ].map(([x, y, c], i) => (
      <rect key={i} x={+x - 3.5} y={+y - 3.5} width="7" height="7" rx="2"
        fill={c as string} fillOpacity={c === 'white' ? 0.25 : 0.85} />
    ))}
  </>, p)

// ── NEWSPAPER ── folded newspaper with columns
export const NxNewspaper = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <rect x="6" y="6" width="36" height="36" rx="4" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <rect x="11" y="11" width="13" height="13" rx="2" fill={color} fillOpacity="0.3" />
    {[11, 18, 25, 32].map(y => (
      <line key={y} x1="27" y1={y} x2="37" y2={y} stroke={color} strokeWidth="2" strokeLinecap="round" opacity={y < 20 ? 0.9 : 0.5} />
    ))}
    {[26, 31, 36].map(y => (
      <line key={y} x1="11" y1={y} x2="37" y2={y} stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
    ))}
  </>, p)

// ── NOTEBOOK / JOURNAL ── spiral-bound notebook
export const NxNotebook = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <rect x="11" y="4" width="30" height="40" rx="4" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    {[10,17,24,31,38].map(y => (
      <circle key={y} cx="11" cy={y} r="2.8" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5" />
    ))}
    <line x1="11" y1="4" x2="11" y2="44" stroke={color} strokeWidth="1.5" strokeDasharray="2 5" />
    {[14,21,28,35].map(y => (
      <line key={y} x1="18" y1={y} x2="36" y2={y} stroke={color} strokeWidth="2" strokeLinecap="round" opacity={y < 20 ? 0.9 : 0.5} />
    ))}
  </>, p)

// ── WALLET ── leather wallet with card slot
export const NxWallet = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <rect x="5" y="13" width="38" height="28" rx="5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <path d="M5 21h38" stroke={color} strokeWidth="2" />
    <path d="M5 13V9a3 3 0 013-3h28a3 3 0 013 3v4" stroke={color} strokeWidth="2" />
    <rect x="28" y="25" width="14" height="11" rx="3.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.8" />
    <circle cx="35" cy="30.5" r="2" fill={color} fillOpacity="0.7" />
  </>, p)

// ── PALETTE ── artist palette with color dots
export const NxPalette = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M24 5C13.5 5 5 13 5 23c0 5.8 2.8 11 7.2 14.4C13.8 38.7 16 38 16 36.5c0-1.2-.7-2-1.2-2.8-.5-.7-.8-1.5-.8-2.2C14 29 16.5 27 19.5 27H26c8.3 0 15-5.8 15-13C41 7 33.3 5 24 5Z"
      fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
    <circle cx="14" cy="19" r="3" fill="#ff6b9d" />
    <circle cx="19" cy="12" r="3" fill="#6c63ff" />
    <circle cx="28" cy="10" r="3" fill="#ffd166" />
    <circle cx="35" cy="16" r="3" fill="#06d6a0" />
    <circle cx="36" cy="25" r="3" fill="#00d4ff" />
  </>, p)

// ── TIMER ── stopwatch with tick marks
export const NxTimer = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="28" r="17" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <circle cx="24" cy="28" r="12" fill={color} fillOpacity="0.08" />
    <path d="M24 28V18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 28l8 5" stroke="#00d4ff" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="24" cy="28" r="2.5" fill={color} />
    <path d="M18 4h12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M38 10l2-2M10 10l-2-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    {[0,90,180,270].map(a => {
      const rad = a * Math.PI / 180
      const x1 = 24 + 14 * Math.sin(rad), y1 = 28 - 14 * Math.cos(rad)
      const x2 = 24 + 11 * Math.sin(rad), y2 = 28 - 11 * Math.cos(rad)
      return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    })}
  </>, p)

// ── LANGUAGES / GLOBE ── globe with meridian lines
export const NxLanguages = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <ellipse cx="24" cy="24" rx="10" ry="19" stroke={color} strokeWidth="2" />
    <line x1="5" y1="24" x2="43" y2="24" stroke={color} strokeWidth="2" />
    <path d="M6.5 15.5C11 17 17 18 24 18s13-1 17.5-2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    <path d="M6.5 32.5C11 31 17 30 24 30s13 1 17.5 2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
  </>, p)

// ── QR CODE ── three-corner QR pattern
export const NxQrCode = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    {/* Top-left finder */}
    <rect x="6" y="6" width="15" height="15" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" />
    <rect x="10" y="10" width="7" height="7" rx="1.5" fill={color} />
    {/* Top-right finder */}
    <rect x="27" y="6" width="15" height="15" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" />
    <rect x="31" y="10" width="7" height="7" rx="1.5" fill={color} />
    {/* Bottom-left finder */}
    <rect x="6" y="27" width="15" height="15" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" />
    <rect x="10" y="31" width="7" height="7" rx="1.5" fill={color} />
    {/* Data dots bottom-right */}
    {[27,31,35,39].flatMap(x => [27,31,35,39].map(y => ({ x, y }))).filter(({x, y}) => (x + y) % 8 !== 0).slice(0, 9).map(({x,y}, i) => (
      <rect key={i} x={x} y={y} width="3" height="3" rx="0.8" fill={color} fillOpacity="0.7" />
    ))}
  </>, p)

// ── FLASHLIGHT ── torch/flashlight beam
export const NxFlashlight = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M18 6h12l6 14H12L18 6Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <rect x="16" y="20" width="16" height="18" rx="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.2" />
    <ellipse cx="24" cy="11" rx="4" ry="3" fill="#ffd166" fillOpacity="0.9" />
    <line x1="24" y1="7" x2="24" y2="3" stroke="#ffd166" strokeWidth="2" strokeLinecap="round" />
    <line x1="29" y1="9" x2="32" y2="6" stroke="#ffd166" strokeWidth="2" strokeLinecap="round" />
    <line x1="19" y1="9" x2="16" y2="6" stroke="#ffd166" strokeWidth="2" strokeLinecap="round" />
    <rect x="20" y="26" width="8" height="4" rx="1.5" fill={color} fillOpacity="0.4" />
  </>, p)

// ── SMILE / MOOD ── face with expressive features
export const NxSmile = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <circle cx="17" cy="20" r="2.5" fill={color} />
    <circle cx="31" cy="20" r="2.5" fill={color} />
    <path d="M15 30c2.5 5 15.5 5 18 0" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="15" cy="20" r="1" fill={color} fillOpacity="0.4" />
    <circle cx="29" cy="20" r="1" fill={color} fillOpacity="0.4" />
    <path d="M10 17c1.5-3 4-5 7-5M38 17c-1.5-3-4-5-7-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
  </>, p)

// ── CHECK / HABITS ── star with checkmark energy
export const NxCheckSquare = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    {/* Star/sparkle shape */}
    <path d="M24 5l3.5 13.5L41 15l-10.5 9.5L34 38l-10-7.5L14 38l3.5-13.5L7 15l13.5 3.5L24 5Z"
      fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M17 24l5 5 9-10" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </>, p)

// ── CHEF HAT / RECIPES ──
export const NxChefHat = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M14 22v14h20V22" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
    <path d="M14 28h20" stroke={color} strokeWidth="2" opacity="0.5" />
    <path d="M14 20C14 14 8 9 8 14c0 3 2 5 5 6h22c3-1 5-3 5-6 0-5-6 0-6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <ellipse cx="24" cy="13" rx="8" ry="7" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" />
    <path d="M20 10c1-3 4-5 4-5s3 2 4 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── BOOK / DICTIONARY ──
export const NxBook = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M8 6h25a3 3 0 013 3v28a3 3 0 01-3 3H8" stroke={color} strokeWidth="2.2" fill={color} fillOpacity="0.1" />
    <path d="M8 6a3 3 0 00-3 3v28a3 3 0 003 3" stroke={color} strokeWidth="2.2" />
    <line x1="8" y1="6" x2="8" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="16" x2="30" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <line x1="16" y1="22" x2="30" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <line x1="16" y1="28" x2="26" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M16 35l3-4 3 4 3-4 3 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
  </>, p)

// ── SETTINGS / GEAR ──
export const NxSettings = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="7" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.2" />
    <circle cx="24" cy="24" r="3" fill={color} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const rad = a * Math.PI / 180
      const ix = 24 + 12 * Math.sin(rad), iy = 24 - 12 * Math.cos(rad)
      const ox = 24 + 20 * Math.sin(rad), oy = 24 - 20 * Math.cos(rad)
      return <line key={a} x1={ix} y1={iy} x2={ox} y2={oy} stroke={color} strokeWidth="3" strokeLinecap="round" />
    })}
    <circle cx="24" cy="24" r="19" stroke={color} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.3" />
  </>, p)

// ── INFO ── circle with info indicator
export const NxInfo = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <circle cx="24" cy="14" r="2.5" fill={color} />
    <line x1="24" y1="21" x2="24" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="19" y1="36" x2="29" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </>, p)

// ── HEART / DONATE ── heart with currency symbol
export const NxHeart2 = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M24 42C24 42 5 30 5 17.5C5 11.6 9.7 7 15.5 7C19 7 22.2 8.8 24 11.7C25.8 8.8 29 7 32.5 7C38.3 7 43 11.6 43 17.5C43 30 24 42 24 42Z"
      fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="24" y1="18" x2="24" y2="30" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M20 21c0-1.7 1.8-3 4-3s4 1.3 4 3-1.8 3-4 3-4 1.3-4 3 1.8 3 4 3 4-1.3 4-3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </>, p)

// ── MENU ── hamburger with weight variation
export const NxMenu = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <line x1="8" y1="14" x2="40" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="8" y1="24" x2="40" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="8" y1="34" x2="32" y2="34" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </>, p)

// ── X / CLOSE ──
export const NxX = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <line x1="10" y1="10" x2="38" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="38" y1="10" x2="10" y2="38" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </>, p)

// ── SEARCH ── magnifying glass
export const NxSearch = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="21" cy="21" r="14" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.5" />
    <line x1="31" y1="31" x2="44" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="21" cy="21" r="8" fill={color} fillOpacity="0.05" />
  </>, p)

// ── GLOBE ── for language selector
export const NxGlobe = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <ellipse cx="24" cy="24" rx="9" ry="19" stroke={color} strokeWidth="2" />
    <line x1="5" y1="24" x2="43" y2="24" stroke={color} strokeWidth="2" opacity="0.6" />
    <path d="M7 16c4.5 2 10 3 17 3s12.5-1 17-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    <path d="M7 32c4.5-2 10-3 17-3s12.5 1 17 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── BELL / NOTIFICATIONS ──
export const NxBell = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M24 6C24 6 14 10 14 22v8l-4 4h28l-4-4v-8C34 10 24 6 24 6Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M20 38c0 2.2 1.8 4 4 4s4-1.8 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="4" x2="24" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="8" r="5" fill="#ff6b9d" stroke={color} strokeWidth="1.5" />
  </>, p)

// ── SUN ── light mode
export const NxSun = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.2" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
      const rad = a * Math.PI / 180
      const x1 = 24 + 13 * Math.sin(rad), y1 = 24 - 13 * Math.cos(rad)
      const x2 = 24 + 19 * Math.sin(rad), y2 = 24 - 19 * Math.cos(rad)
      return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    })}
  </>, p)

// ── MOON ── dark mode
export const NxMoon = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M36 26C34 34 26 40 17 38C8 36 3 27 5 18C7 10 14 5 22 5C15 12 14 22 21 29C28 36 37 34 36 26Z"
      fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <circle cx="33" cy="12" r="2" fill={color} fillOpacity="0.6" />
    <circle cx="38" cy="18" r="1.3" fill={color} fillOpacity="0.4" />
    <circle cx="36" cy="8" r="1" fill={color} fillOpacity="0.3" />
  </>, p)

// ── CHEVRON RIGHT ──
export const NxChevronRight = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M18 10l14 14-14 14" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </>, p)

// ── SEND ── paper plane
export const NxSend = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M6 24L42 8 28 42 24 28 6 24Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="24" y1="28" x2="42" y2="8" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </>, p)

// ── WIFI / ONLINE ──
export const NxWifi = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M6 16C12 10 20 7 24 7s12 3 18 9" stroke={color} strokeWidth="2.8" strokeLinecap="round" opacity="0.4" />
    <path d="M11 22c3.5-4 8-6.5 13-6.5S37 18 40.5 22" stroke={color} strokeWidth="2.8" strokeLinecap="round" opacity="0.65" />
    <path d="M16 28c2-3 5-4.5 8-4.5s6 1.5 8 4.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="24" cy="36" r="3.5" fill={color} />
  </>, p)

// ── WIFI OFF ──
export const NxWifiOff = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M6 6l36 36" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    <path d="M11 22c3.5-4 8-6.5 13-6.5 2.5 0 5 .6 7.2 1.8" stroke={color} strokeWidth="2.8" strokeLinecap="round" opacity="0.5" />
    <path d="M16 28c1.5-2.2 3.7-3.8 6-4.3" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="24" cy="36" r="3.5" fill={color} />
  </>, p)

// ── DOWNLOAD / INSTALL ──
export const NxDownload = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <line x1="24" y1="6" x2="24" y2="30" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <path d="M14 22l10 12 10-12" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 38h32" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <path d="M8 38v4a2 2 0 002 2h28a2 2 0 002-2v-4" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </>, p)

// ── REFRESH / UPDATE ──
export const NxRefresh = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M42 24C42 14 34 6 24 6c-6 0-11 2.8-14.5 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M6 24C6 34 14 42 24 42c6 0 11-2.8 14.5-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 10l3.5 3L4 16.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M44 38l-3.5-3L44 31.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </>, p)

// ── USER ──
export const NxUser = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="16" r="9" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
    <path d="M6 44c0-9.9 8.1-18 18-18s18 8.1 18 18" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </>, p)

// ── KEY / API KEY ──
export const NxKey = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="16" cy="24" r="10" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <line x1="24" y1="24" x2="46" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="37" y1="18" x2="37" y2="25" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="43" y1="15" x2="43" y2="22" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="24" r="4" fill={color} fillOpacity="0.4" />
  </>, p)

// ── PLAY / MUSIC CONTROL ──
export const NxPlay = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" />
    <path d="M20 16l16 8-16 8V16Z" fill={color} fillOpacity="0.8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </>, p)

// ── PAUSE ──
export const NxPause = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2" />
    <rect x="15" y="15" width="6" height="18" rx="2" fill={color} />
    <rect x="27" y="15" width="6" height="18" rx="2" fill={color} />
  </>, p)

// ── SKIP NEXT ──
export const NxSkipNext = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M12 14l16 10-16 10V14Z" fill={color} fillOpacity="0.8" />
    <rect x="33" y="14" width="4" height="20" rx="2" fill={color} />
  </>, p)

// ── SKIP PREV ──
export const NxSkipPrev = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M36 14L20 24l16 10V14Z" fill={color} fillOpacity="0.8" />
    <rect x="11" y="14" width="4" height="20" rx="2" fill={color} />
  </>, p)

// ── SHUFFLE ──
export const NxShuffle = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M8 14h6l20 20h8M36 14l6 4-6 4M8 34h6l6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M28 14h8l6 4-6 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </>, p)

// ── VOLUME ──
export const NxVolume = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M10 18H6a2 2 0 00-2 2v8a2 2 0 002 2h4l10 8V10L10 18Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
    <path d="M30 18c2 1.5 3.5 3.5 3.5 6s-1.5 4.5-3.5 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M35 13c3 3 5 6.5 5 11s-2 8-5 11" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── TREND UP ──
export const NxTrendUp = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M6 36l10-12 8 6 18-22" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M30 12h12v12" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </>, p)

// ── PLUS ──
export const NxPlus = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <line x1="24" y1="8" x2="24" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <line x1="8" y1="24" x2="40" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </>, p)

// ── TRASH ──
export const NxTrash = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M8 14h32M20 8h8M18 14v24a2 2 0 002 2h8a2 2 0 002-2V14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <line x1="20" y1="20" x2="20" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <line x1="28" y1="20" x2="28" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── CAMERA (for QR / AI Art) ──
export const NxCamera = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M6 16h4l4-6h20l4 6h4a2 2 0 012 2v20a2 2 0 01-2 2H6a2 2 0 01-2-2V18a2 2 0 012-2Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <circle cx="24" cy="28" r="7" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <circle cx="24" cy="28" r="3" fill={color} fillOpacity="0.6" />
  </>, p)

// ── HEADING / TEXT (for Journal/Writing) ──
export const NxPen = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M36 6l6 6L18 36l-8 2 2-8L36 6Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M30 12l6 6" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <line x1="6" y1="44" x2="42" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
  </>, p)

// ── COMPASS ──
export const NxCompass = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <circle cx="24" cy="24" r="19" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2.2" />
    <path d="M24 10l-5 14 5 5 5-19-5 0Z" fill="#ff6b9d" fillOpacity="0.8" />
    <path d="M24 38l5-14-5-5-5 19h5Z" fill={color} fillOpacity="0.5" />
    <circle cx="24" cy="24" r="2.5" fill={color} />
    <line x1="24" y1="6" x2="24" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="38" x2="24" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="24" x2="10" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="24" x2="42" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </>, p)

// ── STEPS / WALKING (Health) ──
export const NxSteps = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <ellipse cx="16" cy="12" rx="5" ry="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <ellipse cx="32" cy="10" rx="5" ry="6" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
    <path d="M10 20c0 0-3 6-3 12l6 12h6l4-10h4l4 10h6l6-12c0-6-3-12-3-12H10Z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
  </>, p)

// ── WATER DROP (Health) ──
export const NxDroplet = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M24 4C24 4 8 18 8 28a16 16 0 0032 0C40 18 24 4 24 4Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.2" />
    <path d="M16 30c1 4 5 7 9 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
  </>, p)

// ── MOON STARS (Sleep) ──
export const NxSleep = ({ size = 24, color = 'currentColor', ...p }: IconProps) =>
  Nx(size, color, <>
    <path d="M30 10C22 12 16 19 16 28a16 16 0 0020 15.6C26 42 18 34 18 24c0-7 4-13 10-16" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="2.2" />
    <path d="M34 8C34 12 38 16 38 16s-4 4-4 8c0-4 4-8 4-8s-4-4-4-8Z" fill={color} fillOpacity="0.6" />
    <circle cx="40" cy="12" r="3" fill={color} fillOpacity="0.5" />
    <circle cx="36" cy="22" r="2" fill={color} fillOpacity="0.3" />
  </>, p)

// ── NEXUS LOGO MARK (brand hexagon N) ──
export const NexusLogo = ({
  size = 32,
  ...p
}: { size?: number } & SVGProps<SVGSVGElement>) => (
  <svg
    width={size} height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...p}
  >
    <defs>
      <linearGradient id="nlg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6c63ff" />
        <stop offset="100%" stopColor="#00d4ff" />
      </linearGradient>
      <linearGradient id="nlg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b9d" />
        <stop offset="100%" stopColor="#ffd166" />
      </linearGradient>
      <filter id="nf">
        <feGaussianBlur stdDeviation="2" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    {/* Outer hexagon */}
    <path
      d="M40 4L72 22V58L40 76L8 58V22L40 4Z"
      stroke="url(#nlg1)"
      strokeWidth="2"
      fill="rgba(108,99,255,0.12)"
      filter="url(#nf)"
    />
    {/* Inner dashed hexagon */}
    <path
      d="M40 16L62 28V52L40 64L18 52V28L40 16Z"
      stroke="url(#nlg2)"
      strokeWidth="1.5"
      fill="rgba(255,107,157,0.05)"
      strokeDasharray="4 3"
    />
    {/* N letterform — three strokes */}
    <path
      d="M26 54V26L40 50L54 26V54"
      stroke="url(#nlg1)"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      filter="url(#nf)"
    />
    {/* Corner vertex dots */}
    {[
      [40, 4], [72, 22], [72, 58],
      [40, 76], [8, 58], [8, 22],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="3.5" fill="url(#nlg1)" opacity="0.9" />
    ))}
  </svg>
)
