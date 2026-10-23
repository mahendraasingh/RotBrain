/**
 * RotBrain Main Dashboard Screen
 *
 * Core application hub featuring:
 * - Live 24-hour clock (strict HH:mm format)
 * - Dynamic BrainStatusCard with 3D mascot & milestone progression
 * - Platform filter switcher (Combined, Instagram Reels, YouTube Shorts)
 * - Daily metric statistics (Confirmed count, Duration, Sessions, Target)
 * - Live session monitoring controls
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { BrainStatusCard } from '../brain/BrainStatusCard';
import { PlatformFilterTabs } from './components/PlatformFilterTabs';
import { StatMetricCard } from './components/StatMetricCard';
import { LiveSessionIndicator } from './components/LiveSessionIndicator';
import { DateTimeFormatter } from '../../utils/dateTimeFormatter';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export const MainDashboardScreen: React.FC = () => {
  const {
    todaySummary,
    preferences,
    setDashboardFilter,
    getFilteredStats,
    checkLocalDayReset,
  } = useRotBrainStore();

  const [currentTime24, setCurrentTime24] = useState<string>(
    DateTimeFormatter.formatTimeSeconds24(new Date())
  );
  const [refreshing, setRefreshing] = useState(false);

  // Keep live 24-hour clock updated
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime24(DateTimeFormatter.formatTimeSeconds24(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await checkLocalDayReset();
    setRefreshing(false);
  };

  const filteredStats = getFilteredStats();

  // Calculate total confirmed across active platforms for brain state
  const totalActiveConfirmed =
    (preferences.instagramTrackingEnabled ? todaySummary.instagramConfirmedCount : 0) +
    (preferences.youtubeTrackingEnabled ? todaySummary.youtubeConfirmedCount : 0);

  const goalPercentage = Math.min(
    100,
    Math.round((filteredStats.confirmedCount / preferences.dailyGoal) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Top App Header with Strict 24-Hour Timer */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.appTitle}>RotBrain</Text>
        </View>

        {/* 24-Hour Clock */}
        <View style={styles.clockPill}>
          <Text style={styles.clockDot}>●</Text>
          <Text style={styles.clockText}>{currentTime24}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Dynamic Brain Character & Milestone Card */}
        <BrainStatusCard totalConfirmedCount={totalActiveConfirmed} />

        {/* Live Session Activity Bar */}
        <LiveSessionIndicator />

        {/* Platform Filter Tabs */}
        <PlatformFilterTabs
          selectedFilter={preferences.selectedDashboardFilter}
          onSelectFilter={setDashboardFilter}
          isInstagramEnabled={preferences.instagramTrackingEnabled}
          isYoutubeEnabled={preferences.youtubeTrackingEnabled}
        />

        {/* Today's Overview Section */}
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Today's Overview</Text>
          <Text style={styles.overviewFilterLabel}>
            Filtered: {preferences.selectedDashboardFilter.toUpperCase()}
          </Text>
        </View>

        {/* 2x2 Metric Grid */}
        <View style={styles.gridRow}>
          <StatMetricCard
            label="Confirmed Videos"
            value={filteredStats.confirmedCount}
            subValue={`Target limit: ${preferences.dailyGoal}`}
            icon="🎬"
            accentColor={colors.primaryLight}
          />

          <StatMetricCard
            label="Viewing Time"
            value={DateTimeFormatter.formatDuration(filteredStats.durationSeconds)}
            subValue="Foreground feed time"
            icon="⏱️"
            accentColor={colors.fresh.base}
          />
        </View>

        <View style={styles.gridRow}>
          <StatMetricCard
            label="Sessions"
            value={filteredStats.sessionCount}
            subValue="Distinct app launches"
            icon="📱"
            accentColor={colors.tired.light}
          />

          <StatMetricCard
            label="Daily Goal"
            value={`${goalPercentage}%`}
            subValue={goalPercentage >= 100 ? 'Limit reached' : 'Within budget'}
            icon="🎯"
            accentColor={goalPercentage >= 100 ? colors.danger : colors.success}
          />
        </View>

        {/* Platform Breakdown Card (When both enabled) */}
        {preferences.instagramTrackingEnabled && preferences.youtubeTrackingEnabled && (
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Platform Split</Text>

            <View style={styles.splitRow}>
              {/* Instagram Stat */}
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <Text style={[styles.splitDot, { color: colors.platforms.instagram }]}>●</Text>
                  <Text style={styles.splitName}>Reels</Text>
                </View>
                <Text style={styles.splitCount}>
                  {todaySummary.instagramConfirmedCount} videos
                </Text>
                <Text style={styles.splitDuration}>
                  {DateTimeFormatter.formatDuration(todaySummary.instagramDurationSeconds)}
                </Text>
              </View>

              {/* YouTube Stat */}
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <Text style={[styles.splitDot, { color: colors.platforms.youtube }]}>●</Text>
                  <Text style={styles.splitName}>Shorts</Text>
                </View>
                <Text style={styles.splitCount}>
                  {todaySummary.youtubeConfirmedCount} videos
                </Text>
                <Text style={styles.splitDuration}>
                  {DateTimeFormatter.formatDuration(todaySummary.youtubeDurationSeconds)}
                </Text>
              </View>
            </View>
          </View>
        )}
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  appTitle: {
    ...typography.h2,
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  clockDot: {
    color: colors.success,
    fontSize: 10,
    marginRight: spacing.xs,
  },
  clockText: {
    ...typography.caption,
    color: '#F8FAFC',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  overviewTitle: {
    ...typography.h3,
    color: '#F8FAFC',
  },
  overviewFilterLabel: {
    ...typography.caption,
    color: '#64748B',
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  breakdownCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  breakdownTitle: {
    ...typography.caption,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  splitItem: {
    alignItems: 'center',
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  splitDot: {
    fontSize: 12,
    marginRight: 4,
  },
  splitName: {
    ...typography.bodyMedium,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  splitCount: {
    ...typography.h4,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  splitDuration: {
    ...typography.caption,
    color: '#94A3B8',
    marginTop: 2,
  },
});
