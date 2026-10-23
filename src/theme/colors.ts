/**
 * RotBrain Design Tokens — Color Palette
 * Strict Two26.studio editorial studio specification:
 * - Primary: #FF5400 (Vivid Tangerine Orange)
 * - Secondary / On-surface: #333333 (Soft Charcoal)
 * - Neutral: #F8EEE8 (Warm Blush Studio Ambient)
 * - Surface: #FFFFFF
 * - Surface-2 / Tertiary: #FDF8F5 (Near-white Warm Surface)
 * - Primary-60: #FF7A33
 * - Primary-20: #FFD3BF (Soft Orange Chip Wash)
 * Zero harsh green text or muddy backgrounds.
 */

export const colors = {
  // Two26 Signature Studio Palette
  two26: {
    primary: '#FF5400',          // Brand Energetic Accent
    primary60: '#FF7A33',        // Hover / secondary accent
    primary20: '#FFD3BF',        // Chip background / subtle wash
    secondary: '#333333',        // Soft charcoal on-surface
    neutral: '#F8EEE8',          // Ambient warm blush canvas (light)
    surface: '#FFFFFF',          // Clean white surface
    surface2: '#FDF8F5',         // Warm near-white card
    onSurface: '#333333',
    error: '#FF5400',

    // Convenient aliases
    flame: '#FF5400',
    flameGlow: 'rgba(255, 84, 0, 0.35)',
    flameSoft: 'rgba(255, 84, 0, 0.12)',
    porcelain: '#FDF8F5',
    blush: '#F8EEE8',
    chip: '#FFD3BF',
    charcoal: '#333333',
    darkBg: '#161413',           // Two26 warm espresso dark canvas
    darkSurface: '#211E1D',      // Two26 dark card
    darkSurface2: '#2A2523',     // Two26 dark card elevated
  },

  // Primary brand tone
  primary: '#FF5400',
  primaryLight: '#FF7A33',
  primaryDark: '#D44400',

  // Brain State Colors (Warm & Editorial — No harsh green)
  fresh: {
    base: '#FF5400',             // Studio Signature
    light: '#FF7A33',
    dark: '#CC4300',
    glow: 'rgba(255, 84, 0, 0.35)',
    background: 'rgba(255, 84, 0, 0.08)',
    badge: '#FFD3BF',
  },
  tired: {
    base: '#F59E0B',             // Warm Amber
    light: '#FBBF24',
    dark: '#D97706',
    glow: 'rgba(245, 158, 11, 0.35)',
    background: 'rgba(245, 158, 11, 0.08)',
    badge: '#FEF3C7',
  },
  veryTired: {
    base: '#FF5400',             // Two26 Flame
    light: '#FF7A33',
    dark: '#EA580C',
    glow: 'rgba(255, 84, 0, 0.40)',
    background: 'rgba(255, 84, 0, 0.12)',
    badge: '#FFEDD5',
  },
  exhausted: {
    base: '#DC2626',             // Crimson Alert
    light: '#EF4444',
    dark: '#B91C1C',
    glow: 'rgba(220, 38, 38, 0.40)',
    background: 'rgba(220, 38, 38, 0.12)',
    badge: '#FEE2E2',
  },

  // Two26 Light Theme (Authentic signature blush canvas)
  light: {
    background: '#F8EEE8',
    surface: '#FFFFFF',
    surface2: '#FDF8F5',
    surfaceBorder: 'rgba(51, 51, 51, 0.08)',
    surfaceBorderHover: 'rgba(255, 84, 0, 0.45)',
    textPrimary: '#333333',
    textSecondary: '#666666',
    textMuted: '#888888',
    textInverse: '#FFFFFF',
    divider: 'rgba(51, 51, 51, 0.06)',
    cardOverlay: 'rgba(253, 248, 245, 0.85)',
    chipBg: '#FFD3BF',
    chipText: '#FF5400',
    headerPillBg: '#FFFFFF',
    headerPillBorder: 'rgba(51, 51, 51, 0.12)',
    headerPillText: '#333333',
  },

  // Two26 Dark Theme (Warm espresso studio dark)
  dark: {
    background: '#161413',
    surface: '#211E1D',
    surface2: '#2A2523',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceBorderHover: 'rgba(255, 84, 0, 0.5)',
    textPrimary: '#FAF7F5',
    textSecondary: '#A8A19C',
    textMuted: '#78716C',
    textInverse: '#161413',
    divider: 'rgba(255, 255, 255, 0.06)',
    cardOverlay: 'rgba(33, 30, 29, 0.85)',
    chipBg: 'rgba(255, 84, 0, 0.18)',
    chipText: '#FF5400',
    headerPillBg: '#211E1D',
    headerPillBorder: 'rgba(255, 255, 255, 0.10)',
    headerPillText: '#FAF7F5',
  },

  // Platform Branding
  platforms: {
    instagram: '#E1306C',
    instagramGradient: ['#833AB4', '#FD1D1D', '#FCB045'],
    youtube: '#FF0000',
    youtubeDark: '#CC0000',
    combined: '#FF5400',
  },

  // Status & Utility (All aligned with Two26 — zero green text)
  success: '#FF5400',
  warning: '#F59E0B',
  danger: '#DC2626',
  info: '#333333',
};

export const getThemeColors = (theme: 'light' | 'dark' | 'system' = 'dark') => {
  if (theme === 'light') return colors.light;
  return colors.dark;
};

export type ThemeColors = typeof colors.dark;

