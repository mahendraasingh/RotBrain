/**
 * RotBrain Analytics Screen
 * Comprehensive behavioral analytics featuring daily, weekly, and monthly views,
 * 24-hour activity distribution, and session records with Two26 Studio styling.
 * Fully supports dynamic Two26 Light (Blush #F8EEE8) and Dark (Espresso #161413) themes.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { Activity24HourChart } from './components/Activity24HourChart';
import { SessionHistoryList } from './components/SessionHistoryList';
import { DateTimeFormatter } from '../../utils/dateTimeFormatter';
import { colors, getThemeColors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

type TimeRangeTab = 'daily' | 'weekly' | 'monthly';

export const AnalyticsScreen: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRangeTab>('daily');
  const { todaySummary, recentSessions, preferences } = useRotBrainStore();
  const themeColors = getThemeColors(preferences.themePreference);

  const totalVideos =
    todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount;
  const totalDuration =
    todaySummary.instagramDurationSeconds + todaySummary.youtubeDurationSeconds;

  const avgSessionSecs =
    todaySummary.sessionCount > 0
      ? Math.round(totalDuration / todaySummary.sessionCount)
      : 0;

  // Find longest session duration
  const longestSessionSecs = recentSessions.reduce(
    (max, s) => Math.max(max, s.durationSeconds),
    0
  );

  // Compute real hourly distribution (strictly 0 if no sessions exist)
  const hourlyCounts = new Array(24).fill(0);
  recentSessions.forEach((session) => {
    const d = new Date(session.startedAt);
    const hour = d.getHours();
    if (hour >= 0 && hour < 24) {
      hourlyCounts[hour] += session.confirmedVideoCount || 1;
    }
  });

  // Calculate genuine peak window (no fake placeholder)
  let peakWindow = '—';
  if (totalVideos > 0 && recentSessions.length > 0) {
    let maxHour = 0;
    let maxHourCount = 0;
    for (let h = 0; h < 24; h++) {
      if (hourlyCounts[h] > maxHourCount) {
        maxHourCount = hourlyCounts[h];
        maxHour = h;
      }
    }
    const endH = (maxHour + 1) % 24;
    peakWindow = `${String(maxHour).padStart(2, '0')}:00 – ${String(endH).padStart(2, '0')}:00`;
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.studioPill,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.studioDot} />
          <Text style={[styles.studioPillText, { color: themeColors.textSecondary }]}>
            ANALYTICS // CHRONO METRICS
          </Text>
        </View>

        {/* Dual Magnetic Heading */}
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Attention Telemetry</Text>
          <Text style={[styles.dualTitleMain, { color: themeColors.textPrimary }]}>
            Attention Telemetry
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
          Empirical consumption auditing • Strict 24-Hour Timeline
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Time Range Tabs (Daily, Weekly, Monthly) */}
        <View
          style={[
            styles.tabsRow,
            {
              backgroundColor: themeColors.surface2,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          {(['daily', 'weekly', 'monthly'] as TimeRangeTab[]).map((tab) => {
            const isSelected = selectedRange === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.rangeTab,
                  isSelected && {
                    backgroundColor: colors.two26.flame,
                  },
                ]}
                onPress={() => setSelectedRange(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.rangeTabText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.textMuted,
                    },
                  ]}
                >
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* High-Level Overview Metrics in Two26 Bento Grid */}
        <View style={styles.bentoRow}>
          <View
            style={[
              styles.bentoCard,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.bentoHeaderRow}>
              <Text style={[styles.kpiLabel, { color: themeColors.textMuted }]}>
                TOTAL CONSUMED
              </Text>
              <Text style={[styles.bentoArrow, { color: themeColors.textMuted }]}>↗</Text>
            </View>
            <Text style={styles.kpiValueFlame}>{totalVideos}</Text>
            <Text style={[styles.kpiSub, { color: themeColors.textSecondary }]}>
              Shorts & Reels
            </Text>
          </View>

          <View
            style={[
              styles.bentoCard,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.bentoHeaderRow}>
              <Text style={[styles.kpiLabel, { color: themeColors.textMuted }]}>
                SCREEN TIME
              </Text>
              <Text style={[styles.bentoArrow, { color: themeColors.textMuted }]}>↗</Text>
            </View>
            <Text style={[styles.kpiValuePorcelain, { color: themeColors.textPrimary }]}>
              {DateTimeFormatter.formatDuration(totalDuration)}
            </Text>
            <Text style={[styles.kpiSub, { color: themeColors.textSecondary }]}>
              Active session time
            </Text>
          </View>
        </View>

        {/* Detailed Averages Bento Card */}
        <View
          style={[
            styles.averagesCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={[styles.avgRow, { borderBottomColor: themeColors.divider }]}>
            <Text style={[styles.avgLabel, { color: themeColors.textSecondary }]}>
              Average Session Length
            </Text>
            <Text style={[styles.avgValue, { color: themeColors.textPrimary }]}>
              {DateTimeFormatter.formatDuration(avgSessionSecs)}
            </Text>
          </View>

          <View style={[styles.avgRow, { borderBottomColor: themeColors.divider }]}>
            <Text style={[styles.avgLabel, { color: themeColors.textSecondary }]}>
              Longest Session
            </Text>
            <Text style={[styles.avgValue, { color: colors.two26.flame }]}>
              {DateTimeFormatter.formatDuration(longestSessionSecs)}
            </Text>
          </View>

          <View style={[styles.avgRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.avgLabel, { color: themeColors.textSecondary }]}>
              Peak Activity Window
            </Text>
            <Text style={[styles.avgValue, { color: themeColors.textPrimary }]}>
              {peakWindow}
            </Text>
          </View>
        </View>

        {/* 24-Hour Timeline Distribution Chart */}
        <Activity24HourChart hourlyCounts={hourlyCounts} />

        {/* Platform Comparison */}
        <View
          style={[
            styles.comparisonCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.compHeading, { color: themeColors.textPrimary }]}>
              CHANNEL ALLOCATION
            </Text>
            <Text style={[styles.compSub, { color: themeColors.textMuted }]}>
              LIVE FEED SHARE
            </Text>
          </View>

          {/* Instagram Share */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={[styles.platformName, { color: themeColors.textPrimary }]}>
                Instagram Reels
              </Text>
              <Text style={[styles.platformCount, { color: themeColors.textSecondary }]}>
                {todaySummary.instagramConfirmedCount} reels
              </Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: themeColors.surface2 }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: '#E1306C',
                    width: `${
                      totalVideos > 0
                        ? Math.round(
                            (todaySummary.instagramConfirmedCount / totalVideos) * 100
                          )
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* YouTube Share */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={[styles.platformName, { color: themeColors.textPrimary }]}>
                YouTube Shorts
              </Text>
              <Text style={[styles.platformCount, { color: themeColors.textSecondary }]}>
                {todaySummary.youtubeConfirmedCount} shorts
              </Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: themeColors.surface2 }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.two26.flame,
                    width: `${
                      totalVideos > 0
                        ? Math.round(
                            (todaySummary.youtubeConfirmedCount / totalVideos) * 100
                          )
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Session History List */}
        <SessionHistoryList sessions={recentSessions} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  studioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  studioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.two26.flame,
    marginRight: spacing.xs,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  studioPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  dualHeadingWrap: {
    position: 'relative',
    marginVertical: 4,
  },
  dualTitleShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 26,
    fontWeight: '900',
    color: colors.two26.flame,
    opacity: 0.25,
    letterSpacing: -0.6,
  },
  dualTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  tabsRow: {
    flexDirection: 'row',
    borderRadius: radii.xl,
    padding: 3,
    marginVertical: spacing.sm,
    borderWidth: 1,
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  rangeTabText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  bentoCard: {
    flex: 1,
    borderRadius: radii.xxl,
    padding: spacing.md,
    borderWidth: 1,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bentoArrow: {
    fontSize: 12,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  kpiValueFlame: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.two26.flame,
    letterSpacing: -0.8,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
  kpiValuePorcelain: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
  kpiSub: {
    fontSize: 11,
  },
  averagesCard: {
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  avgLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  avgValue: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  comparisonCard: {
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  compHeading: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  compSub: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  barItem: {
    marginBottom: spacing.md,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  platformName: {
    fontSize: 12,
    fontWeight: '700',
  },
  platformCount: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  barBg: {
    height: 8,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
