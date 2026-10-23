/**
 * RotBrain Analytics Screen
 * Comprehensive behavioral analytics featuring daily, weekly, and monthly views,
 * 24-hour activity distribution, and session records with Two26 Studio styling.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { Activity24HourChart } from './components/Activity24HourChart';
import { SessionHistoryList } from './components/SessionHistoryList';
import { DateTimeFormatter } from '../../utils/dateTimeFormatter';
import { colors } from '../../theme/colors';
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
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.studioPill}>
          <View style={styles.studioDot} />
          <Text style={styles.studioPillText}>ANALYTICS // CHRONO METRICS</Text>
        </View>

        {/* Dual Magnetic Heading */}
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Attention Telemetry</Text>
          <Text style={styles.dualTitleMain}>Attention Telemetry</Text>
        </View>
        <Text style={styles.subtitle}>
          Empirical consumption auditing • Strict 24-Hour Timeline
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
                activeOpacity={0.7}
              >
                <Text style={[styles.rangeTabText, isSelected && styles.rangeTabTextActive]}>
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* High-Level Overview Metrics in Two26 Bento Grid */}
        <View style={styles.bentoRow}>
          <View style={styles.bentoCard}>
            <View style={styles.bentoHeaderRow}>
              <Text style={styles.kpiLabel}>TOTAL CONSUMED</Text>
              <Text style={styles.bentoArrow}>↗</Text>
            </View>
            <Text style={styles.kpiValueFlame}>{totalVideos}</Text>
            <Text style={styles.kpiSub}>Shorts & Reels</Text>
          </View>

          <View style={styles.bentoCard}>
            <View style={styles.bentoHeaderRow}>
              <Text style={styles.kpiLabel}>SCREEN TIME</Text>
              <Text style={styles.bentoArrow}>↗</Text>
            </View>
            <Text style={styles.kpiValuePorcelain}>
              {DateTimeFormatter.formatDuration(totalDuration)}
            </Text>
            <Text style={styles.kpiSub}>Active session time</Text>
          </View>
        </View>

        {/* Detailed Averages Bento Card */}
        <View style={styles.averagesCard}>
          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Average Session Length</Text>
            <Text style={styles.avgValue}>
              {DateTimeFormatter.formatDuration(avgSessionSecs)}
            </Text>
          </View>

          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Longest Session</Text>
            <Text style={[styles.avgValue, { color: colors.two26.flame }]}>
              {DateTimeFormatter.formatDuration(longestSessionSecs)}
            </Text>
          </View>

          <View style={[styles.avgRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.avgLabel}>Peak Activity Window</Text>
            <Text style={[styles.avgValue, { color: colors.two26.porcelain }]}>
              {peakWindow}
            </Text>
          </View>
        </View>

        {/* 24-Hour Timeline Distribution Chart */}
        <Activity24HourChart hourlyCounts={hourlyCounts} />

        {/* Platform Comparison */}
        <View style={styles.comparisonCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.compHeading}>CHANNEL ALLOCATION</Text>
            <Text style={styles.compSub}>LIVE FEED SHARE</Text>
          </View>

          {/* Instagram Share */}
          <View style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={styles.platformName}>Instagram Reels</Text>
              <Text style={styles.platformCount}>
                {todaySummary.instagramConfirmedCount} reels
              </Text>
            </View>
            <View style={styles.barBg}>
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
              <Text style={styles.platformName}>YouTube Shorts</Text>
              <Text style={styles.platformCount}>
                {todaySummary.youtubeConfirmedCount} shorts
              </Text>
            </View>
            <View style={styles.barBg}>
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
    backgroundColor: '#07080B',
    paddingHorizontal: spacing.screenPadding,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  studioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0E1017',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#A1A1AA',
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
    opacity: 0.35,
    letterSpacing: -0.6,
  },
  dualTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FAF9F6',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0E1017',
    borderRadius: radii.xl,
    padding: 3,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  rangeTabActive: {
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: colors.two26.flame,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  rangeTabText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  rangeTabTextActive: {
    color: '#FAF9F6',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bentoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bentoArrow: {
    fontSize: 12,
    color: '#71717A',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
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
    color: colors.two26.porcelain,
    letterSpacing: -0.6,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
  kpiSub: {
    fontSize: 11,
    color: '#71717A',
  },
  averagesCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  avgLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '600',
  },
  avgValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FAF9F6',
    fontFamily: 'monospace',
  },
  comparisonCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    color: '#FAF9F6',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  compSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
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
    color: '#D4D4D8',
    fontWeight: '700',
  },
  platformCount: {
    fontSize: 11,
    color: '#71717A',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  barBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radii.full,
  },
});

