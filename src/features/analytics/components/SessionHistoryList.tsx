/**
 * RotBrain SessionHistoryList
 * Displays tracked viewing sessions with strict 24-hour time ranges,
 * platform badges, and detection quality indicators.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ViewingSession } from '../../../types/session';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
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
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyTitle}>No Sessions Recorded</Text>
        <Text style={styles.emptySubtitle}>
          Open Instagram or YouTube with tracking enabled to start capturing session intervals.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.listHeader}>Recent Viewing Sessions</Text>

      {sessions.map((session) => {
        const isInstagram = session.platform === 'instagram';
        const brandColor = isInstagram
          ? colors.platforms.instagram
          : colors.platforms.youtube;

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
                  {isInstagram ? 'Instagram Reels' : 'YouTube Shorts'}
                </Text>
              </View>

              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>
                  {session.detectionQuality === 'confirmed' ? '✓ Confirmed' : 'Estimated'}
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
                  <Text style={styles.videoCountLabel}>videos</Text>
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
                <Text style={styles.deleteText}>Delete record</Text>
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
  listHeader: {
    ...typography.h4,
    color: '#F8FAFC',
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.h4,
    color: '#F8FAFC',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  sessionCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  platformText: {
    ...typography.caption,
    fontWeight: '700',
  },
  qualityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  qualityText: {
    ...typography.caption,
    color: '#94A3B8',
    fontSize: 10,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  timeRange: {
    ...typography.h4,
    color: '#F8FAFC',
    fontFamily: 'monospace',
  },
  relativeDate: {
    ...typography.caption,
    color: '#64748B',
    marginTop: 2,
  },
  statsColumn: {
    alignItems: 'flex-end',
  },
  videoCount: {
    ...typography.h4,
    color: colors.primaryLight,
    fontWeight: '800',
  },
  videoCountLabel: {
    ...typography.caption,
    color: '#94A3B8',
    fontWeight: '400',
  },
  duration: {
    ...typography.caption,
    color: '#CBD5E1',
    marginTop: 2,
  },
  deleteButton: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    alignSelf: 'flex-end',
  },
  deleteText: {
    ...typography.caption,
    color: '#EF4444',
    fontSize: 11,
  },
});
