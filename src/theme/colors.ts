/**
 * RotBrain Design Tokens — Color Palette
 * Elevated Two26 Studio-inspired boutique creative aesthetic:
 * Bold International Flame (#FF5400), Blush Porcelain (#F9E2E1), Velvet Obsidian (#07080B).
 */

export const colors = {
  // Two26 Signature Boutique Accents
  two26: {
    flame: '#FF5400',            // Signature Two26 International Flame
    flameGlow: 'rgba(255, 84, 0, 0.40)',
    flameSoft: 'rgba(255, 84, 0, 0.12)',
    porcelain: '#F9E2E1',        // Soft Blush Porcelain Cream
    porcelainSoft: 'rgba(249, 226, 225, 0.15)',
    blush: '#F9E2E1',
    emerald: '#10B981',
    noir: '#07080B',             // Deep Void Noir
    card: '#0E1017',             // Velvet Studio Surface
    cardElevated: '#141722',
    border: 'rgba(255, 255, 255, 0.09)',
    borderHover: 'rgba(255, 84, 0, 0.45)',
  },

  // Brand Base
  primary: '#FF5400',            // Two26 Flame as primary brand tone
  primaryViolet: '#8B5CF6',      // Electric Violet secondary
  primaryLight: '#FF7A38',
  primaryDark: '#CC4300',
  
  // Evolving Brain States (Curated with boutique intensity)
  fresh: {
    base: '#00F0FF',             // Radiant Neon Cyan
    light: '#67E8F9',
    dark: '#0891B2',
    glow: 'rgba(0, 240, 255, 0.45)',
    background: 'rgba(0, 240, 255, 0.12)',
    badge: '#042A36',
  },
  tired: {
    base: '#F59E0B',             // Warm Amber Gold
    light: '#FBBF24',
    dark: '#D97706',
    glow: 'rgba(245, 158, 11, 0.40)',
    background: 'rgba(245, 158, 11, 0.12)',
    badge: '#451A03',
  },
  veryTired: {
    base: '#FF5400',             // Two26 Studio Signature Flame
    light: '#FF7A38',
    dark: '#EA580C',
    glow: 'rgba(255, 84, 0, 0.45)',
    background: 'rgba(255, 84, 0, 0.14)',
    badge: '#431407',
  },
  exhausted: {
    base: '#EF4444',             // Crimson Burnout
    light: '#F87171',
    dark: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.45)',
    background: 'rgba(239, 68, 68, 0.14)',
    badge: '#450A0A',
  },

  // Dark Theme (Default Studio Mode)
  dark: {
    background: '#07080B',
    surface: '#0E1017',
    surfaceHover: '#161924',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceBorderHover: 'rgba(255, 84, 0, 0.45)',
    glass: 'rgba(14, 16, 23, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',

    textPrimary: '#FAF9F6',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textInverse: '#07080B',

    divider: 'rgba(255, 255, 255, 0.06)',
    cardOverlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Light Theme
  light: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    surfaceHover: '#F4F4F5',
    surfaceBorder: '#E4E4E7',
    surfaceBorderHover: 'rgba(255, 84, 0, 0.4)',
    glass: 'rgba(255, 255, 255, 0.90)',
    glassBorder: 'rgba(0, 0, 0, 0.08)',

    textPrimary: '#09090B',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',
    textInverse: '#FFFFFF',

    divider: '#E4E4E7',
    cardOverlay: 'rgba(255, 255, 255, 0.6)',
  },

  // Platform Branding
  platforms: {
    instagram: '#E1306C',
    instagramGradient: ['#833AB4', '#FD1D1D', '#FCB045'],
    youtube: '#FF0000',
    youtubeDark: '#CC0000',
    combined: '#FF5400',
  },

  // Status & Utility
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export type ThemeColors = typeof colors.dark;
