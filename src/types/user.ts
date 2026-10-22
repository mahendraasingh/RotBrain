/**
 * RotBrain User Preferences Types
 */

import { DashboardFilter } from './platform';

export type FloatingBrainSize = 'small' | 'medium' | 'large';
export type ThemePreference = 'dark' | 'light' | 'system';

export interface UserPreferences {
  // Tracking Platforms
  instagramTrackingEnabled: boolean;
  youtubeTrackingEnabled: boolean;

  // Dashboard & Views
  selectedDashboardFilter: DashboardFilter;

  // Goals & Wellbeing
  dailyGoal: number; // e.g., max 30 videos
  breakReminderMinutes: number; // e.g. 15 minutes of continuous scrolling
  notificationsEnabled: boolean;

  // Floating Brain (Android specific)
  floatingBrainEnabled: boolean;
  floatingBrainSize: FloatingBrainSize;

  // Appearance & Clock
  themePreference: ThemePreference;
  timeDisplayPreference: '24h'; // STRICT 24-hour enforcement: always '24h'

  // Onboarding
  hasCompletedOnboarding: boolean;
  onboardingCompletedAt: string | null;

  // Data Retention
  retentionDays: number; // default 30
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  instagramTrackingEnabled: true,
  youtubeTrackingEnabled: true,
  selectedDashboardFilter: 'all',
  dailyGoal: 30,
  breakReminderMinutes: 15,
  notificationsEnabled: true,
  floatingBrainEnabled: true,
  floatingBrainSize: 'medium',
  themePreference: 'dark',
  timeDisplayPreference: '24h',
  hasCompletedOnboarding: false,
  onboardingCompletedAt: null,
  retentionDays: 30,
};
