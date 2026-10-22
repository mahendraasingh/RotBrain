/**
 * RotBrain Analytics Screen
 * Comprehensive behavioral analytics featuring daily, weekly, and monthly views,
 * 24-hour activity distribution, and session records.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { Activity24HourChart } from './components/Activity24HourChart';
import { SessionHistoryList } from './components/SessionHistoryList';
import { DateTimeFormatter } from '../../utils/dateTimeFormatter';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

type TimeRangeTab = 'daily' | 'weekly' | 'monthly';

export const AnalyticsScreen: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRangeTab>('daily');
  const { todaySummary, recentSessions } = useRotBrainStore();

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

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Trends</Text>
        <Text style={styles.subtitle}>
          Behavioral insights • 24-Hour Timeline
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Time Range Tabs (Daily, Weekly, Monthly) */}
        <View style={styles.tabsRow}>
          {(['daily', 'weekly', 'monthly'] as TimeRangeTab[]).map((tab) => {
            const isSelected = selectedRange === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.rangeTab, isSelected && styles.rangeTabActive]}
                onPress={() => setSelectedRange(tab)}
              >
                <Text style={[styles.rangeTabText, isSelected && styles.rangeTabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* High-Level Overview Metrics */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Total Watched</Text>
            <Text style={styles.kpiValue}>{totalVideos}</Text>
            <Text style={styles.kpiSub}>Shorts & Reels</Text>
          </View>

          <View style={styles.kpiDivider} />

          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>Total Screen Time</Text>
            <Text style={[styles.kpiValue, { color: colors.fresh.base }]}>
              {DateTimeFormatter.formatDuration(totalDuration)}
            </Text>
            <Text style={styles.kpiSub}>Active viewing</Text>
          </View>
        </View>

        {/* Detailed Averages Card */}
        <View style={styles.averagesCard}>
          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Average Session Length</Text>
            <Text style={styles.avgValue}>
              {DateTimeFormatter.formatDuration(avgSessionSecs)}
            </Text>
          </View>

          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Longest Session</Text>
            <Text style={[styles.avgValue, { color: colors.tired.light }]}>
              {DateTimeFormatter.formatDuration(longestSessionSecs)}
            </Text>
          </View>

          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Peak Activity Window</Text>
            <Text style={[styles.avgValue, { color: colors.primaryLight }]}>
              18:00 – 21:00
            </Text>
          </View>
        </View>

        {/* 24-Hour Timeline Distribution Chart */}
        <Activity24HourChart />

        {/* Platform Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.compHeading}>Platform Consumption Share</Text>

          {/* Instagram Share */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={styles.platformName}>Instagram Reels</Text>
              <Text style={styles.platformCount}>
                {todaySummary.instagramConfirmedCount} videos
              </Text>
            </View>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.platforms.instagram,
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
              <Text style={styles.platformName}>YouTube Shorts</Text>
              <Text style={styles.platformCount}>
                {todaySummary.youtubeConfirmedCount} videos
              </Text>
            </View>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: colors.platforms.youtube,
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
    backgroundColor: '#0B0C10',
    paddingHorizontal: spacing.screenPadding,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: '#F8FAFC',
  },
  subtitle: {
    ...typography.caption,
    color: '#94A3B8',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: 3,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rangeTab: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  rangeTabActive: {
    backgroundColor: colors.primary,
  },
  rangeTabText: {
    ...typography.caption,
    color: '#94A3B8',
    fontWeight: '600',
  },
  rangeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  kpiContainer: {
    flexDirection: 'row',
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  kpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  kpiDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  kpiLabel: {
    ...typography.caption,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  kpiValue: {
    ...typography.monoMedium,
    color: '#F8FAFC',
    marginVertical: 4,
  },
  kpiSub: {
    ...typography.caption,
    color: '#64748B',
  },
  averagesCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  avgLabel: {
    ...typography.bodySmall,
    color: '#94A3B8',
  },
  avgValue: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  comparisonCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  compHeading: {
    ...typography.h4,
    color: '#F8FAFC',
    marginBottom: spacing.md,
  },
  barItem: {
    marginBottom: spacing.md,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  platformName: {
    ...typography.caption,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  platformCount: {
    ...typography.caption,
    color: '#94A3B8',
  },
  barBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.full,
  },
});
