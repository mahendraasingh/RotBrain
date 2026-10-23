/**
 * RotBrain Design Tokens — Color Palette
 * Distinctive, premium digital wellbeing theme centered on the evolving brain.
 */

export const colors = {
  // Brand Base
  primary: '#8B5CF6',         // Electric Violet
  primaryLight: '#A78BFA',
  primaryDark: '#6D28D9',
  
  // Evolving Brain States
  fresh: {
    base: '#06B6D4',          // Neon Cyan
    light: '#22D3EE',
    dark: '#0891B2',
    glow: 'rgba(6, 182, 212, 0.35)',
    background: 'rgba(6, 182, 212, 0.12)',
    badge: '#083344',
  },
  tired: {
    base: '#F59E0B',          // Warm Amber
    light: '#FBBF24',
    dark: '#D97706',
    glow: 'rgba(245, 158, 11, 0.35)',
    background: 'rgba(245, 158, 11, 0.12)',
    badge: '#451A03',
  },
  veryTired: {
    base: '#F97316',          // Deep Sunset Orange
    light: '#FB923C',
    dark: '#EA580C',
    glow: 'rgba(249, 115, 22, 0.35)',
    background: 'rgba(249, 115, 22, 0.12)',
    badge: '#431407',
  },
  exhausted: {
    base: '#EF4444',          // Muted Coral / Crimson
    light: '#F87171',
    dark: '#DC2626',
    glow: 'rgba(239, 68, 68, 0.35)',
    background: 'rgba(239, 68, 68, 0.12)',
    badge: '#450A0A',
  },

  // Dark Theme (Default)
  dark: {
    background: '#0B0C10',    // Midnight Void
    surface: '#13151F',       // Deep Charcoal Card
    surfaceHover: '#1B1E2C',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceBorderHover: 'rgba(139, 92, 246, 0.3)',
    glass: 'rgba(19, 21, 31, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0B0C10',

    divider: 'rgba(255, 255, 255, 0.06)',
    cardOverlay: 'rgba(0, 0, 0, 0.4)',
  },

  // Light Theme (Supported)
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceHover: '#F1F5F9',
    surfaceBorder: '#E2E8F0',
    surfaceBorderHover: 'rgba(139, 92, 246, 0.4)',
    glass: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(0, 0, 0, 0.08)',

    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',

    divider: '#E2E8F0',
    cardOverlay: 'rgba(255, 255, 255, 0.6)',
  },

  // Platform Branding
  platforms: {
    instagram: '#E1306C',
    instagramGradient: ['#833AB4', '#FD1D1D', '#FCB045'],
    youtube: '#FF0000',
    youtubeDark: '#CC0000',
    combined: '#8B5CF6',
  },

  // Status & Utility
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

export type ThemeColors = typeof colors.dark;
