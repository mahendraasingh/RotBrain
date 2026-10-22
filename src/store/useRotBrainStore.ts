/**
 * RotBrain Zustand Global State Store
 *
 * Implements:
 * - Dynamic platform filtering (Instagram, YouTube, Both)
 * - Brain state calculation (0-29, 30-59, 60-89, 90+)
 * - Daily reset detection on local calendar day rollover
 * - Session recording and prevention of duplicate counts
 * - User preferences persistence
 */

import { create } from 'zustand';
import { BrainState, BrainStateInfo } from '../types/brain';
import { PlatformType, DashboardFilter } from '../types/platform';
import { DailySummary, ViewingSession, ViewingEvent, DetectionMethod } from '../types/session';
import { UserPreferences, DEFAULT_PREFERENCES } from '../types/user';
import { BrainStateManager } from '../features/brain/brainStateManager';
import { DateTimeFormatter } from '../utils/dateTimeFormatter';
import { DatabaseService } from '../database/db';

export interface RotBrainStoreState {
  // State
  preferences: UserPreferences;
  todaySummary: DailySummary;
  recentSessions: ViewingSession[];
  activeSession: ViewingSession | null;
  brainState: BrainState;
  brainStateInfo: BrainStateInfo;
  isMonitoringActive: boolean;

  // Actions
  initialize: () => Promise<void>;
  checkLocalDayReset: () => Promise<void>;
  setDashboardFilter: (filter: DashboardFilter) => Promise<void>;
  setPlatformTracking: (platform: PlatformType, enabled: boolean) => Promise<void>;
  startSession: (platform: PlatformType, detectionMethod?: DetectionMethod) => Promise<ViewingSession>;
  recordVideoEvent: (platform: PlatformType, isConfirmed?: boolean) => Promise<boolean>;
  endActiveSession: () => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  clearHistory: () => Promise<void>;

  // Computed helper
  getFilteredStats: () => {
    confirmedCount: number;
    estimatedCount: number;
    durationSeconds: number;
    sessionCount: number;
  };
}

const getBlankDailySummary = (dateStr: string): DailySummary => ({
  id: `summary_${dateStr}`,
  localDate: dateStr,
  instagramConfirmedCount: 0,
  youtubeConfirmedCount: 0,
  instagramEstimatedCount: 0,
  youtubeEstimatedCount: 0,
  instagramDurationSeconds: 0,
  youtubeDurationSeconds: 0,
  sessionCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useRotBrainStore = create<RotBrainStoreState>((set, get) => ({
  preferences: { ...DEFAULT_PREFERENCES },
  todaySummary: getBlankDailySummary(DateTimeFormatter.formatLocalDate()),
  recentSessions: [],
  activeSession: null,
  brainState: 'fresh',
  brainStateInfo: BrainStateManager.getStateInfo('fresh'),
  isMonitoringActive: false,

  initialize: async () => {
    await DatabaseService.initialize();
    const prefs = await DatabaseService.getUserPreferences();
    const today = DateTimeFormatter.formatLocalDate();
    let summary = await DatabaseService.getDailySummary(today);

    if (!summary) {
      summary = getBlankDailySummary(today);
      await DatabaseService.upsertDailySummary(summary);
    }

    const sessions = await DatabaseService.getAllSessions();

    const totalConfirmed = BrainStateManager.calculateTotalConfirmed(
      summary.instagramConfirmedCount,
      summary.youtubeConfirmedCount,
      prefs.instagramTrackingEnabled,
      prefs.youtubeTrackingEnabled
    );

    const bState = BrainStateManager.calculateState(totalConfirmed);

    set({
      preferences: prefs,
      todaySummary: summary,
      recentSessions: sessions.slice(0, 50),
      brainState: bState,
      brainStateInfo: BrainStateManager.getStateInfo(bState),
    });
  },

  checkLocalDayReset: async () => {
    const today = DateTimeFormatter.formatLocalDate();
    const currentSummary = get().todaySummary;

    if (currentSummary.localDate !== today) {
      // Local calendar day changed: reset counter, return to Fresh Brain
      let newSummary = await DatabaseService.getDailySummary(today);
      if (!newSummary) {
        newSummary = getBlankDailySummary(today);
        await DatabaseService.upsertDailySummary(newSummary);
      }

      const prefs = get().preferences;
      const totalConfirmed = BrainStateManager.calculateTotalConfirmed(
        newSummary.instagramConfirmedCount,
        newSummary.youtubeConfirmedCount,
        prefs.instagramTrackingEnabled,
        prefs.youtubeTrackingEnabled
      );
      const bState = BrainStateManager.calculateState(totalConfirmed);

      set({
        todaySummary: newSummary,
        brainState: bState,
        brainStateInfo: BrainStateManager.getStateInfo(bState),
      });
    }
  },

  setDashboardFilter: async (filter: DashboardFilter) => {
    // Note: Changing the filter does NOT change the brain state or stored data
    set((state) => ({
      preferences: {
        ...state.preferences,
        selectedDashboardFilter: filter,
      },
    }));
    await DatabaseService.saveUserPreferences({ selectedDashboardFilter: filter });
  },

  setPlatformTracking: async (platform: PlatformType, enabled: boolean) => {
    const currentPrefs = get().preferences;
    const updates: Partial<UserPreferences> =
      platform === 'instagram'
        ? { instagramTrackingEnabled: enabled }
        : { youtubeTrackingEnabled: enabled };

    const newPrefs = { ...currentPrefs, ...updates };
    await DatabaseService.saveUserPreferences(updates);

    // Recalculate brain state based on new active platform configuration
    const summary = get().todaySummary;
    const totalConfirmed = BrainStateManager.calculateTotalConfirmed(
      summary.instagramConfirmedCount,
      summary.youtubeConfirmedCount,
      newPrefs.instagramTrackingEnabled,
      newPrefs.youtubeTrackingEnabled
    );
    const bState = BrainStateManager.calculateState(totalConfirmed);

    set({
      preferences: newPrefs,
      brainState: bState,
      brainStateInfo: BrainStateManager.getStateInfo(bState),
    });
  },

  startSession: async (platform: PlatformType, detectionMethod: DetectionMethod = 'simulated_dev') => {
    await get().checkLocalDayReset();

    const sessionId = `session_${Date.now()}`;
    const newSession: ViewingSession = {
      id: sessionId,
      platform,
      startedAt: new Date().toISOString(),
      endedAt: null,
      durationSeconds: 0,
      confirmedVideoCount: 0,
      estimatedVideoCount: 0,
      detectionMethod,
      detectionQuality: 'confirmed',
      completionStatus: 'active',
    };

    await DatabaseService.createSession(newSession);

    set((state) => ({
      activeSession: newSession,
      recentSessions: [newSession, ...state.recentSessions],
      isMonitoringActive: true,
      todaySummary: {
        ...state.todaySummary,
        sessionCount: state.todaySummary.sessionCount + 1,
      },
    }));

    return newSession;
  },

  recordVideoEvent: async (platform: PlatformType, isConfirmed: boolean = true) => {
    await get().checkLocalDayReset();
    const prefs = get().preferences;

    // Check if platform is enabled
    if (platform === 'instagram' && !prefs.instagramTrackingEnabled) return false;
    if (platform === 'youtube' && !prefs.youtubeTrackingEnabled) return false;

    const timestamp = new Date().toISOString();
    const dedupKey = `${platform}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const event: ViewingEvent = {
      id: `evt_${Date.now()}`,
      sessionId: get().activeSession?.id || `ambient_${Date.now()}`,
      platform,
      timestamp,
      eventType: 'video_scroll',
      deduplicationKey: dedupKey,
      confidence: isConfirmed ? 1.0 : 0.6,
      isConfirmed,
    };

    const isUnique = await DatabaseService.recordEvent(event);
    if (!isUnique) return false;

    // Update active session if present
    const active = get().activeSession;
    if (active && active.platform === platform) {
      const updatedActive: ViewingSession = {
        ...active,
        confirmedVideoCount: active.confirmedVideoCount + (isConfirmed ? 1 : 0),
        estimatedVideoCount: active.estimatedVideoCount + (isConfirmed ? 0 : 1),
      };
      await DatabaseService.updateSession(updatedActive);
      set({ activeSession: updatedActive });
    }

    // Update today's summary
    const summary = { ...get().todaySummary };
    if (platform === 'instagram') {
      if (isConfirmed) summary.instagramConfirmedCount += 1;
      else summary.instagramEstimatedCount += 1;
    } else {
      if (isConfirmed) summary.youtubeConfirmedCount += 1;
      else summary.youtubeEstimatedCount += 1;
    }

    await DatabaseService.upsertDailySummary(summary);

    // Update brain state
    const totalConfirmed = BrainStateManager.calculateTotalConfirmed(
      summary.instagramConfirmedCount,
      summary.youtubeConfirmedCount,
      prefs.instagramTrackingEnabled,
      prefs.youtubeTrackingEnabled
    );
    const bState = BrainStateManager.calculateState(totalConfirmed);

    set({
      todaySummary: summary,
      brainState: bState,
      brainStateInfo: BrainStateManager.getStateInfo(bState),
    });

    return true;
  },

  endActiveSession: async () => {
    const active = get().activeSession;
    if (!active) return;

    const endedAt = new Date().toISOString();
    const durationSeconds = Math.max(
      1,
      Math.floor((new Date(endedAt).getTime() - new Date(active.startedAt).getTime()) / 1000)
    );

    const completedSession: ViewingSession = {
      ...active,
      endedAt,
      durationSeconds,
      completionStatus: 'completed',
    };

    await DatabaseService.updateSession(completedSession);

    // Update summary duration
    const summary = { ...get().todaySummary };
    if (completedSession.platform === 'instagram') {
      summary.instagramDurationSeconds += durationSeconds;
    } else {
      summary.youtubeDurationSeconds += durationSeconds;
    }
    await DatabaseService.upsertDailySummary(summary);

    set((state) => ({
      activeSession: null,
      isMonitoringActive: false,
      todaySummary: summary,
      recentSessions: state.recentSessions.map((s) =>
        s.id === completedSession.id ? completedSession : s
      ),
    }));
  },

  updatePreferences: async (updates: Partial<UserPreferences>) => {
    const newPrefs = await DatabaseService.saveUserPreferences(updates);
    set({ preferences: newPrefs });
  },

  clearHistory: async () => {
    await DatabaseService.clearAllData();
    const today = DateTimeFormatter.formatLocalDate();
    const freshSummary = getBlankDailySummary(today);
    await DatabaseService.upsertDailySummary(freshSummary);

    set({
      todaySummary: freshSummary,
      recentSessions: [],
      activeSession: null,
      brainState: 'fresh',
      brainStateInfo: BrainStateManager.getStateInfo('fresh'),
      isMonitoringActive: false,
    });
  },

  getFilteredStats: () => {
    const { todaySummary, preferences } = get();
    const filter = preferences.selectedDashboardFilter;

    if (filter === 'instagram') {
      return {
        confirmedCount: todaySummary.instagramConfirmedCount,
        estimatedCount: todaySummary.instagramEstimatedCount,
        durationSeconds: todaySummary.instagramDurationSeconds,
        sessionCount: Math.ceil(todaySummary.sessionCount / 2),
      };
    }

    if (filter === 'youtube') {
      return {
        confirmedCount: todaySummary.youtubeConfirmedCount,
        estimatedCount: todaySummary.youtubeEstimatedCount,
        durationSeconds: todaySummary.youtubeDurationSeconds,
        sessionCount: Math.floor(todaySummary.sessionCount / 2),
      };
    }

    // Both / All
    return {
      confirmedCount: todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount,
      estimatedCount: todaySummary.instagramEstimatedCount + todaySummary.youtubeEstimatedCount,
      durationSeconds: todaySummary.instagramDurationSeconds + todaySummary.youtubeDurationSeconds,
      sessionCount: todaySummary.sessionCount,
    };
  },
}));
