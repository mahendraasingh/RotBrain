/**
 * RotBrain Brain State and Milestone Definitions
 */

export type BrainState = 'fresh' | 'tired' | 'very_tired' | 'exhausted';

export interface BrainStateInfo {
  state: BrainState;
  displayName: string;
  subtitle: string;
  description: string;
  minCount: number;
  maxCount: number | null; // null means unbounded (90+)
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  motivationalAdvice: string;
}

export const BRAIN_MILESTONES = {
  FRESH_MAX: 29,
  TIRED_MIN: 30,
  TIRED_MAX: 59,
  VERY_TIRED_MIN: 60,
  VERY_TIRED_MAX: 89,
  EXHAUSTED_MIN: 90,
} as const;

export const BRAIN_STATE_CONFIGS: Record<BrainState, BrainStateInfo> = {
  fresh: {
    state: 'fresh',
    displayName: 'Fresh Brain',
    subtitle: 'Sharp, active, and fully recharged',
    description: '0 to 29 short videos watched. Your focus and cognitive clarity are optimal.',
    minCount: 0,
    maxCount: 29,
    accentColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBg: '#083344',
    motivationalAdvice: 'Maintain this fresh state by keeping your screen time intentional.',
  },
  tired: {
    state: 'tired',
    displayName: 'Tired Brain',
    subtitle: 'Fatigue is setting in',
    description: '30 to 59 short videos watched. Dopamine loops are beginning to reduce mental sharpness.',
    minCount: 30,
    maxCount: 59,
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: '#451A03',
    motivationalAdvice: 'Consider looking away, resting your eyes, and taking a short walking break.',
  },
  very_tired: {
    state: 'very_tired',
    displayName: 'Very Tired Brain',
    subtitle: 'Significant sensory overload',
    description: '60 to 89 short videos watched. Attention span is fragmented by continuous scrolling.',
    minCount: 60,
    maxCount: 89,
    accentColor: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    badgeBg: '#431407',
    motivationalAdvice: 'Your brain is working on overtime. A screen pause will restore your focus.',
  },
  exhausted: {
    state: 'exhausted',
    displayName: 'Completely Exhausted',
    subtitle: 'Over-scrolled & drained',
    description: '90+ short videos watched. High cognitive fatigue from prolonged rapid media switching.',
    minCount: 90,
    maxCount: null,
    accentColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    badgeBg: '#450A0A',
    motivationalAdvice: 'Time to put the phone down for the day. Unwind with a non-screen activity.',
  },
};
