/**
 * RotBrain SessionHistoryList
 * Displays tracked viewing sessions with strict 24-hour time ranges,
 * platform badges, and detection quality indicators with Two26 Studio styling.
 * Supports dynamic Two26 Light / Dark themes.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ViewingSession } from '../../../types/session';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors, getThemeColors } from '../../../theme/colors';
import { spacing, radii } from '../../../theme/spacing';
import { useRotBrainStore } from '../../../store/useRotBrainStore';

interface SessionHistoryListProps {
  sessions: ViewingSession[];
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionHistoryList: React.FC<SessionHistoryListProps> = ({
  sessions,
  onDeleteSession,
}) => {
  const { preferences } = useRotBrainStore();
  const themeColors = getThemeColors(preferences.themePreference);

  if (sessions.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.surfaceBorder,
          },
        ]}
      >
        <Text style={styles.emptyIcon}>◈</Text>
        <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
          NO SESSIONS RECORDED
        </Text>
        <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
          Open Instagram or YouTube with tracking enabled to start capturing continuous scroll telemetry.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.listHeader, { color: themeColors.textPrimary }]}>
          SESSION LOGS
        </Text>
        <Text style={[styles.countTag, { color: themeColors.textMuted }]}>
          [{sessions.length} RECORDED]
        </Text>
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
          <View
            key={session.id}
            style={[
              styles.sessionCard,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.platformBadge,
                  {
                    backgroundColor: themeColors.surface2,
                    borderColor: themeColors.surfaceBorder,
                  },
                ]}
              >
                <View style={[styles.platformDot, { backgroundColor: brandColor }]} />
                <Text style={[styles.platformText, { color: brandColor }]}>
                  {isInstagram ? 'INSTAGRAM REELS' : 'YOUTUBE SHORTS'}
                </Text>
              </View>

              <View
                style={[
                  styles.qualityBadge,
                  {
                    backgroundColor: themeColors.chipBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.qualityText,
                    {
                      color: themeColors.chipText,
                    },
                  ]}
                >
                  {session.detectionQuality === 'confirmed' ? 'CONFIRMED' : 'ESTIMATED'}
                </Text>
              </View>
            </View>

            <View style={styles.contentRow}>
              <View>
                <Text style={[styles.timeRange, { color: themeColors.textPrimary }]}>
                  {timeRange24}
                </Text>
                <Text style={[styles.relativeDate, { color: themeColors.textMuted }]}>
                  {relativeDate}
                </Text>
              </View>

              <View style={styles.statsColumn}>
                <Text style={[styles.videoCount, { color: themeColors.textPrimary }]}>
                  {session.confirmedVideoCount}{' '}
                  <Text style={[styles.videoCountLabel, { color: themeColors.textMuted }]}>
                    reels
                  </Text>
                </Text>
                <Text style={[styles.duration, { color: themeColors.textSecondary }]}>
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
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  countTag: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 1,
  },
  emptyIcon: {
    fontSize: 28,
    color: colors.two26.flame,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  sessionCard: {
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  platformDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  platformText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  qualityText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRange: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  relativeDate: {
    fontSize: 11,
  },
  statsColumn: {
    alignItems: 'flex-end',
  },
  videoCount: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  videoCountLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  duration: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  deleteButton: {
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  deleteText: {
    fontSize: 9,
    color: '#EF4444',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});
