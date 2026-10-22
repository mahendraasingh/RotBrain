/**
 * RotBrain Session, Event, and Daily Summary Models
 */

import { PlatformType } from './platform';

export type DetectionMethod =
  | 'accessibility_event'
  | 'usage_stats'
  | 'device_activity'
  | 'simulated_dev';

export type DetectionQuality = 'confirmed' | 'estimated' | 'unsupported';

export type SessionCompletionStatus = 'active' | 'completed' | 'interrupted' | 'recovered';

export interface ViewingEvent {
  id: string;
  sessionId: string;
  platform: PlatformType;
  timestamp: string; // ISO 8601 string in UTC
  eventType: 'video_start' | 'video_scroll' | 'session_pause' | 'session_resume';
  deduplicationKey: string;
  confidence: number; // 0.0 to 1.0
  isConfirmed: boolean;
}

export interface ViewingSession {
  id: string;
  platform: PlatformType;
  startedAt: string; // ISO 8601 string
  endedAt: string | null;
  durationSeconds: number;
  confirmedVideoCount: number;
  estimatedVideoCount: number;
  detectionMethod: DetectionMethod;
  detectionQuality: DetectionQuality;
  completionStatus: SessionCompletionStatus;
}

export interface DailySummary {
  id: string;
  localDate: string; // Format: YYYY-MM-DD
  instagramConfirmedCount: number;
  youtubeConfirmedCount: number;
  instagramEstimatedCount: number;
  youtubeEstimatedCount: number;
  instagramDurationSeconds: number;
  youtubeDurationSeconds: number;
  sessionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HourlyActivityBucket {
  hour24: string; // "00:00", "01:00", ... "23:00"
  hourIndex: number; // 0..23
  instagramCount: number;
  youtubeCount: number;
  totalCount: number;
  durationSeconds: number;
}
