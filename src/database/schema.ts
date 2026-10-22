/**
 * RotBrain SQLite Database Schemas and DDL Statements
 */

export const SCHEMA_SQL = {
  createDailySummaryTable: `
    CREATE TABLE IF NOT EXISTS daily_summaries (
      id TEXT PRIMARY KEY,
      local_date TEXT NOT NULL UNIQUE,
      instagram_confirmed_count INTEGER NOT NULL DEFAULT 0,
      youtube_confirmed_count INTEGER NOT NULL DEFAULT 0,
      instagram_estimated_count INTEGER NOT NULL DEFAULT 0,
      youtube_estimated_count INTEGER NOT NULL DEFAULT 0,
      instagram_duration_seconds INTEGER NOT NULL DEFAULT 0,
      youtube_duration_seconds INTEGER NOT NULL DEFAULT 0,
      session_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `,

  createViewingSessionsTable: `
    CREATE TABLE IF NOT EXISTS viewing_sessions (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      confirmed_video_count INTEGER NOT NULL DEFAULT 0,
      estimated_video_count INTEGER NOT NULL DEFAULT 0,
      detection_method TEXT NOT NULL,
      detection_quality TEXT NOT NULL,
      completion_status TEXT NOT NULL
    );
  `,

  createViewingEventsTable: `
    CREATE TABLE IF NOT EXISTS viewing_events (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      event_type TEXT NOT NULL,
      deduplication_key TEXT NOT NULL UNIQUE,
      confidence REAL NOT NULL DEFAULT 1.0,
      FOREIGN KEY (session_id) REFERENCES viewing_sessions (id) ON DELETE CASCADE
    );
  `,

  createUserPreferencesTable: `
    CREATE TABLE IF NOT EXISTS user_preferences (
      id TEXT PRIMARY KEY DEFAULT 'current_user',
      instagram_tracking_enabled INTEGER NOT NULL DEFAULT 1,
      youtube_tracking_enabled INTEGER NOT NULL DEFAULT 1,
      selected_dashboard_filter TEXT NOT NULL DEFAULT 'all',
      daily_goal INTEGER NOT NULL DEFAULT 30,
      break_reminder_minutes INTEGER NOT NULL DEFAULT 15,
      notifications_enabled INTEGER NOT NULL DEFAULT 1,
      floating_brain_enabled INTEGER NOT NULL DEFAULT 1,
      floating_brain_size TEXT NOT NULL DEFAULT 'medium',
      theme_preference TEXT NOT NULL DEFAULT 'dark',
      time_display_preference TEXT NOT NULL DEFAULT '24h',
      has_completed_onboarding INTEGER NOT NULL DEFAULT 0,
      onboarding_completed_at TEXT,
      retention_days INTEGER NOT NULL DEFAULT 30,
      updated_at TEXT NOT NULL
    );
  `,

  createIndices: `
    CREATE INDEX IF NOT EXISTS idx_daily_summaries_date ON daily_summaries(local_date);
    CREATE INDEX IF NOT EXISTS idx_sessions_platform ON viewing_sessions(platform);
    CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON viewing_sessions(started_at);
    CREATE INDEX IF NOT EXISTS idx_events_session_id ON viewing_events(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_dedup ON viewing_events(deduplication_key);
  `,
};
