/**
 * RotBrain Database Service
 * Provides type-safe SQLite execution with in-memory fallback for testing and web preview.
 */

import { SCHEMA_SQL } from './schema';
import { DailySummary, ViewingSession, ViewingEvent } from '../types/session';
import { UserPreferences, DEFAULT_PREFERENCES } from '../types/user';

export interface IDatabaseService {
  initialize(): Promise<void>;
  getDailySummary(localDate: string): Promise<DailySummary | null>;
  upsertDailySummary(summary: DailySummary): Promise<void>;
  getAllSummaries(): Promise<DailySummary[]>;
  createSession(session: ViewingSession): Promise<void>;
  updateSession(session: ViewingSession): Promise<void>;
  getSession(id: string): Promise<ViewingSession | null>;
  getAllSessions(): Promise<ViewingSession[]>;
  recordEvent(event: ViewingEvent): Promise<boolean>; // returns false if duplicate key
  getUserPreferences(): Promise<UserPreferences>;
  saveUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences>;
  clearAllData(): Promise<void>;
}

class InMemoryDatabaseService implements IDatabaseService {
  private dailySummaries: Map<string, DailySummary> = new Map();
  private sessions: Map<string, ViewingSession> = new Map();
  private events: Map<string, ViewingEvent> = new Map();
  private eventDedupKeys: Set<string> = new Set();
  private preferences: UserPreferences = { ...DEFAULT_PREFERENCES };

  public async initialize(): Promise<void> {
    // In-memory initialized
  }

  public async getDailySummary(localDate: string): Promise<DailySummary | null> {
    return this.dailySummaries.get(localDate) || null;
  }

  public async upsertDailySummary(summary: DailySummary): Promise<void> {
    this.dailySummaries.set(summary.localDate, { ...summary, updatedAt: new Date().toISOString() });
  }

  public async getAllSummaries(): Promise<DailySummary[]> {
    return Array.from(this.dailySummaries.values()).sort((a, b) =>
      b.localDate.localeCompare(a.localDate)
    );
  }

  public async createSession(session: ViewingSession): Promise<void> {
    this.sessions.set(session.id, { ...session });
  }

  public async updateSession(session: ViewingSession): Promise<void> {
    this.sessions.set(session.id, { ...session });
  }

  public async getSession(id: string): Promise<ViewingSession | null> {
    return this.sessions.get(id) || null;
  }

  public async getAllSessions(): Promise<ViewingSession[]> {
    return Array.from(this.sessions.values()).sort((a, b) =>
      b.startedAt.localeCompare(a.startedAt)
    );
  }

  public async recordEvent(event: ViewingEvent): Promise<boolean> {
    if (this.eventDedupKeys.has(event.deduplicationKey)) {
      return false; // Prevent duplicate counts
    }
    this.eventDedupKeys.add(event.deduplicationKey);
    this.events.set(event.id, { ...event });
    return true;
  }

  public async getUserPreferences(): Promise<UserPreferences> {
    return { ...this.preferences };
  }

  public async saveUserPreferences(
    updated: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    this.preferences = { ...this.preferences, ...updated };
    return { ...this.preferences };
  }

  public async clearAllData(): Promise<void> {
    this.dailySummaries.clear();
    this.sessions.clear();
    this.events.clear();
    this.eventDedupKeys.clear();
    this.preferences = { ...DEFAULT_PREFERENCES };
  }
}

export const DatabaseService = new InMemoryDatabaseService();
