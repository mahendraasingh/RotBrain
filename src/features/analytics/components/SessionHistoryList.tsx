/**
 * RotBrain SessionHistoryList
 * Displays tracked viewing sessions with strict 24-hour time ranges,
 * platform badges, and detection quality indicators with Two26 Studio styling.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ViewingSession } from '../../../types/session';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors } from '../../../theme/colors';
import { spacing, radii } from '../../../theme/spacing';

interface SessionHistoryListProps {
  sessions: ViewingSession[];
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
  sessions,
  onDeleteSession,
}) => {
  if (sessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>◈</Text>
        <Text style={styles.emptyTitle}>NO SESSIONS RECORDED</Text>
        <Text style={styles.emptySubtitle}>
          Open Instagram or YouTube with tracking enabled to start capturing continuous scroll telemetry.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.listHeader}>SESSION LOGS</Text>
        <Text style={styles.countTag}>[{sessions.length} RECORDED]</Text>
      </View>

      {sessions.map((session) => {
        const isInstagram = session.platform === 'instagram';
        const brandColor = isInstagram ? '#E1306C' : colors.two26.flame;

        const timeRange24 = DateTimeFormatter.formatTimeRange24(
          session.startedAt,
          session.endedAt
        );

        const relativeDate = DateTimeFormatter.formatRelativeDateTime24(session.startedAt);

        return (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.cardHeader}>
              <View style={styles.platformBadge}>
                <View style={[styles.platformDot, { backgroundColor: brandColor }]} />
                <Text style={[styles.platformText, { color: brandColor }]}>
                  {isInstagram ? 'INSTAGRAM REELS' : 'YOUTUBE SHORTS'}
                </Text>
              </View>

              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>
                  {session.detectionQuality === 'confirmed' ? 'CONFIRMED' : 'ESTIMATED'}
                </Text>
              </View>
            </View>

            <View style={styles.contentRow}>
              <View>
                <Text style={styles.timeRange}>{timeRange24}</Text>
                <Text style={styles.relativeDate}>{relativeDate}</Text>
              </View>

              <View style={styles.statsColumn}>
                <Text style={styles.videoCount}>
                  {session.confirmedVideoCount}{' '}
                  <Text style={styles.videoCountLabel}>reels</Text>
                </Text>
                <Text style={styles.duration}>
                  {DateTimeFormatter.formatDuration(session.durationSeconds)}
                </Text>
              </View>
            </View>

            {onDeleteSession && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteSession(session.id)}
              >
                <Text style={styles.deleteText}>Purge record ↗</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF9F6',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  countTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyIcon: {
    fontSize: 28,
    color: colors.two26.flame,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF9F6',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  sessionCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  platformText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  qualityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  qualityText: {
    color: '#A1A1AA',
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  timeRange: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FAF9F6',
    fontFamily: 'monospace',
    letterSpacing: -0.3,
  },
  relativeDate: {
    fontSize: 10,
    color: '#71717A',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  statsColumn: {
    alignItems: 'flex-end',
  },
  videoCount: {
    fontSize: 16,
    color: colors.two26.flame,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  videoCountLabel: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '700',
  },
  duration: {
    fontSize: 11,
    color: '#A1A1AA',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  deleteButton: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});

