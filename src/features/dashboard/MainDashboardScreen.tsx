/**
 * RotBrain Main Dashboard Screen
 *
 * Boutique Two26 Studio-inspired flagship dashboard:
 * - Dual-layer magnetic typography in header with offset flame shadow
 * - Strict 24-hour technical timer pill with glowing pulse
 * - Smooth 3D scroll trigger animations with perspective card tilting
 * - Bento metric tiles with diagonal studio arrow indicators (↗)
 * - Porcelain & Flame platform split analytics
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, RefreshControl } from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { BrainStatusCard } from '../brain/BrainStatusCard';
import { PlatformFilterTabs } from './components/PlatformFilterTabs';
import { StatMetricCard } from './components/StatMetricCard';
import { LiveSessionIndicator } from './components/LiveSessionIndicator';
import { DateTimeFormatter } from '../../utils/dateTimeFormatter';
import { colors } from '../../theme/colors';
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

  // Smooth 3D Scroll Trigger Animation Driver
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const totalActiveConfirmed =
    (preferences.instagramTrackingEnabled ? todaySummary.instagramConfirmedCount : 0) +
    (preferences.youtubeTrackingEnabled ? todaySummary.youtubeConfirmedCount : 0);

  const goalPercentage = Math.min(
    100,
    Math.round((filteredStats.confirmedCount / preferences.dailyGoal) * 100)
  );

  // 3D Scroll Interpolations
  const brainCardRotateX = scrollY.interpolate({
    inputRange: [-60, 0, 160],
    outputRange: ['-6deg', '0deg', '8deg'],
    extrapolate: 'clamp',
  });

  const brainCardScale = scrollY.interpolate({
    inputRange: [-80, 0, 200],
    outputRange: [1.03, 1, 0.97],
    extrapolate: 'clamp',
  });

  const bentoGridTranslateY = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, -10],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Two26 Studio Dual Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandTitleBlock}>
          <View style={styles.dualHeaderWrap}>
            <Text style={styles.dualTitleShadow}>RotBrain</Text>
            <Text style={styles.dualTitleMain}>RotBrain</Text>
          </View>
          <Text style={styles.studioSubtitle}>DIGITAL ATTENTION STUDIO</Text>
        </View>

        {/* 24-Hour Technical Timer Pill */}
        <View style={styles.clockPill}>
          <View style={styles.clockFlameDot} />
          <Text style={styles.clockText}>{currentTime24}</Text>
          <Text style={styles.clockBadge24}>24H</Text>
        </View>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.two26.flame}
          />
        }
      >
        {/* Dynamic Brain Character & Milestone Card with 3D Scroll Trigger Tilt */}
        <Animated.View
          style={{
            transform: [
              { perspective: 1000 },
              { rotateX: brainCardRotateX },
              { scale: brainCardScale },
            ],
          }}
        >
          <BrainStatusCard totalConfirmedCount={totalActiveConfirmed} />
        </Animated.View>

        {/* Live Active Feed Session Indicator */}
        <LiveSessionIndicator />

        {/* Two26 Tactile Platform Filter Pill */}
        <PlatformFilterTabs
          selectedFilter={preferences.selectedDashboardFilter}
          onSelectFilter={setDashboardFilter}
          isInstagramEnabled={preferences.instagramTrackingEnabled}
          isYoutubeEnabled={preferences.youtubeTrackingEnabled}
        />

        {/* Today's Overview Section Header */}
        <View style={styles.overviewHeader}>
          <View style={styles.overviewLabelRow}>
            <Text style={styles.overviewBullet}>●</Text>
            <Text style={styles.overviewTitle}>Today's Telemetry</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>
              VIEW: {preferences.selectedDashboardFilter.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* 2x2 Bento Metric Grid with 3D Elevation */}
        <Animated.View
          style={{
            transform: [{ translateY: bentoGridTranslateY }],
          }}
        >
          <View style={styles.gridRow}>
            <StatMetricCard
              label="Confirmed Reels"
              value={filteredStats.confirmedCount}
              subValue={`Cap limit: ${preferences.dailyGoal}`}
              icon="🎬"
              accentColor={colors.two26.flame}
            />

            <StatMetricCard
              label="Feed Duration"
              value={DateTimeFormatter.formatDuration(filteredStats.durationSeconds)}
              subValue="Active screen session"
              icon="⏱️"
              accentColor={colors.fresh.base}
            />
          </View>

          <View style={styles.gridRow}>
            <StatMetricCard
              label="App Launches"
              value={filteredStats.sessionCount}
              subValue="Distinct feed entries"
              icon="📱"
              accentColor={colors.tired.light}
            />

            <StatMetricCard
              label="Budget Used"
              value={`${goalPercentage}%`}
              subValue={goalPercentage >= 100 ? 'Quota exceeded' : 'Healthy balance'}
              icon="🎯"
              accentColor={goalPercentage >= 100 ? colors.danger : colors.success}
            />
          </View>
        </Animated.View>

        {/* Two26 Platform Breakdown Card */}
        {preferences.instagramTrackingEnabled && preferences.youtubeTrackingEnabled && (
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownTitle}>CROSS-PLATFORM SPLIT</Text>
              <Text style={styles.breakdownStudioTag}>[01 // TELEMETRY]</Text>
            </View>

            <View style={styles.splitRow}>
              {/* Instagram Stat */}
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <Text style={[styles.splitDot, { color: colors.platforms.instagram }]}>●</Text>
                  <Text style={styles.splitName}>Instagram Reels</Text>
                </View>
                <Text style={styles.splitCount}>
                  {todaySummary.instagramConfirmedCount} videos
                </Text>
                <Text style={styles.splitDuration}>
                  {DateTimeFormatter.formatDuration(todaySummary.instagramDurationSeconds)}
                </Text>
              </View>

              <View style={styles.splitDivider} />

              {/* YouTube Stat */}
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <Text style={[styles.splitDot, { color: colors.platforms.youtube }]}>●</Text>
                  <Text style={styles.splitName}>YouTube Shorts</Text>
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
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080B',
    paddingHorizontal: spacing.screenPadding,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  brandTitleBlock: {
    justifyContent: 'center',
  },
  dualHeaderWrap: {
    position: 'relative',
  },
  dualTitleShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 26,
    fontWeight: '900',
    color: colors.two26.flame,
    opacity: 0.35,
    letterSpacing: -0.8,
  },
  dualTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FAF9F6',
    letterSpacing: -0.8,
  },
  studioSubtitle: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E1017',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  clockFlameDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.two26.flame,
    marginRight: 6,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  clockText: {
    fontSize: 11,
    color: '#FAF9F6',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  clockBadge24: {
    fontSize: 8,
    color: colors.two26.flame,
    fontWeight: '800',
    fontFamily: 'monospace',
    marginLeft: 6,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  overviewLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewBullet: {
    color: colors.two26.flame,
    fontSize: 10,
    marginRight: 6,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FAF9F6',
    letterSpacing: -0.3,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipText: {
    fontSize: 8,
    color: '#A1A1AA',
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.6,
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  breakdownCard: {
    backgroundColor: '#0E1017',
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  breakdownTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  breakdownStudioTag: {
    fontSize: 9,
    color: colors.two26.flame,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  splitItem: {
    alignItems: 'center',
    flex: 1,
  },
  splitDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  splitDot: {
    fontSize: 10,
    marginRight: 4,
  },
  splitName: {
    fontSize: 12,
    color: '#D4D4D8',
    fontWeight: '700',
  },
  splitCount: {
    fontSize: 18,
    color: '#FAF9F6',
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  splitDuration: {
    fontSize: 10,
    color: '#71717A',
    marginTop: 2,
    fontFamily: 'monospace',
  },
});
