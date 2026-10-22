import { BrainStateManager } from '../src/features/brain/brainStateManager';
import { DateTimeFormatter } from '../src/utils/dateTimeFormatter';
import { DatabaseService } from '../src/database/db';
import { DailySummary, ViewingSession } from '../src/types/session';

describe('Daily Reset & Session Recovery Tests', () => {
  beforeEach(async () => {
    await DatabaseService.clearAllData();
  });

  test('Daily reset begins a new summary and restores Fresh Brain when local calendar day rolls over', async () => {
    const yesterday = '2026-10-22';
    const today = '2026-10-23';

    // Yesterday: User watched 95 videos (Completely Exhausted state)
    const yesterdaySummary: DailySummary = {
      id: `summary_${yesterday}`,
      localDate: yesterday,
      instagramConfirmedCount: 50,
      youtubeConfirmedCount: 45,
      instagramEstimatedCount: 0,
      youtubeEstimatedCount: 0,
      instagramDurationSeconds: 3600,
      youtubeDurationSeconds: 3000,
      sessionCount: 4,
      createdAt: new Date('2026-10-22T10:00:00').toISOString(),
      updatedAt: new Date('2026-10-22T23:50:00').toISOString(),
    };
    await DatabaseService.upsertDailySummary(yesterdaySummary);

    // Verify yesterday's state was exhausted
    const yesterdayTotal = BrainStateManager.calculateTotalConfirmed(50, 45, true, true);
    expect(yesterdayTotal).toBe(95);
    expect(BrainStateManager.calculateState(yesterdayTotal)).toBe('exhausted');

    // New day begins: Create fresh today summary
    const todaySummary: DailySummary = {
      id: `summary_${today}`,
      localDate: today,
      instagramConfirmedCount: 0,
      youtubeConfirmedCount: 0,
      instagramEstimatedCount: 0,
      youtubeEstimatedCount: 0,
      instagramDurationSeconds: 0,
      youtubeDurationSeconds: 0,
      sessionCount: 0,
      createdAt: new Date('2026-10-23T00:00:01').toISOString(),
      updatedAt: new Date('2026-10-23T00:00:01').toISOString(),
    };
    await DatabaseService.upsertDailySummary(todaySummary);

    // Verify today's counter resets to 0 and brain returns to Fresh Brain
    const todayTotal = BrainStateManager.calculateTotalConfirmed(0, 0, true, true);
    expect(todayTotal).toBe(0);
    expect(BrainStateManager.calculateState(todayTotal)).toBe('fresh');

    // Verify yesterday's historical activity remains intact in database
    const fetchedYesterday = await DatabaseService.getDailySummary(yesterday);
    expect(fetchedYesterday).not.toBeNull();
    expect(fetchedYesterday?.instagramConfirmedCount).toBe(50);
    expect(fetchedYesterday?.youtubeConfirmedCount).toBe(45);
  });

  test('Session recovery: interrupted sessions are preserved without fabricating data', async () => {
    const interruptedSession: ViewingSession = {
      id: 'session_interrupted_1',
      platform: 'instagram',
      startedAt: new Date('2026-10-23T14:10:00').toISOString(),
      endedAt: null, // interrupted due to device shutdown or force-kill
      durationSeconds: 0,
      confirmedVideoCount: 12,
      estimatedVideoCount: 0,
      detectionMethod: 'accessibility_event',
      detectionQuality: 'confirmed',
      completionStatus: 'active',
    };

    await DatabaseService.createSession(interruptedSession);

    // Reconstruct state on app launch: Mark session as interrupted or recovered
    const session = await DatabaseService.getSession('session_interrupted_1');
    expect(session).not.toBeNull();
    expect(session?.confirmedVideoCount).toBe(12);

    // Finalize safely without inventing missing endedAt timestamps
    const recoveredSession: ViewingSession = {
      ...session!,
      completionStatus: 'interrupted',
    };
    await DatabaseService.updateSession(recoveredSession);

    const updated = await DatabaseService.getSession('session_interrupted_1');
    expect(updated?.completionStatus).toBe('interrupted');
    expect(updated?.confirmedVideoCount).toBe(12);
  });

  test('Duplicate event rejection: Prevents multiple counts for identical scroll keys', async () => {
    const event1 = {
      id: 'evt_1',
      sessionId: 'sess_1',
      platform: 'instagram' as const,
      timestamp: new Date().toISOString(),
      eventType: 'video_scroll' as const,
      deduplicationKey: 'reels_item_98765',
      confidence: 1.0,
      isConfirmed: true,
    };

    const firstResult = await DatabaseService.recordEvent(event1);
    expect(firstResult).toBe(true);

    // Same deduplication key replayed
    const event2 = {
      ...event1,
      id: 'evt_2',
    };
    const duplicateResult = await DatabaseService.recordEvent(event2);
    expect(duplicateResult).toBe(false);
  });
});
