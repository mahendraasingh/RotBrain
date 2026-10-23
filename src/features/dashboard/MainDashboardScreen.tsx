/**
 * RotBrain Main Dashboard Screen
 *
 * Flagship Two26 Studio-inspired creative dashboard:
 * - Real Three.js 3D WebGL neural core & Mascot support
 * - Dynamic Theme Switcher (Light: #F8EEE8 warm blush / Dark: #161413 espresso noir)
 * - Dual-layer magnetic typography in header with offset flame shadow
 * - Strict 24-hour technical timer pill with glowing pulse
 * - Smooth 3D scroll trigger animations with perspective card tilting
 * - Bento metric tiles with diagonal studio arrow indicators (↗)
 * - Porcelain & Flame cross-platform telemetry
 * - Zero harsh green text or muddy backgrounds
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, RefreshControl, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { BrainStatusCard } from '../brain/BrainStatusCard';
import { PlatformFilterTabs } from './components/PlatformFilterTabs';
import { StatMetricCard } from './components/StatMetricCard';
import { LiveSessionIndicator } from './components/LiveSessionIndicator';
import { DateTimeFormatter } from '../../utils/dateTimeFormatter';
import { colors, getThemeColors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

export const MainDashboardScreen: React.FC = () => {
  const {
    todaySummary,
    preferences,
    updatePreferences,
    setDashboardFilter,
    getFilteredStats,
    checkLocalDayReset,
  } = useRotBrainStore();

  const isLight = preferences.themePreference === 'light';
  const theme = getThemeColors(preferences.themePreference);

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

  const toggleTheme = () => {
    updatePreferences({ themePreference: isLight ? 'dark' : 'light' });
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Two26 Studio Dual Header with Theme Switcher & 24H Clock */}
      <View style={styles.topHeader}>
        <View style={styles.brandTitleBlock}>
          <View style={styles.dualHeaderWrap}>
            <Text style={styles.dualTitleShadow}>RotBrain</Text>
            <Text style={[styles.dualTitleMain, { color: theme.textPrimary }]}>RotBrain</Text>
          </View>
          <Text style={[styles.studioSubtitle, { color: theme.textMuted }]}>
            TWO26 STUDIO // ATTENTION LABS
          </Text>
        </View>

        {/* Right Header Controls: Theme Toggle & 24-Hour Timer */}
        <View style={styles.headerRightControls}>
          {/* Light / Dark Mode Switcher */}
          <TouchableOpacity
            style={[
              styles.themeTogglePill,
              { backgroundColor: theme.surface, borderColor: theme.surfaceBorder },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Text style={styles.themeToggleIcon}>{isLight ? '☾' : '☀'}</Text>
            <Text style={[styles.themeToggleText, { color: theme.textPrimary }]}>
              {isLight ? 'DARK' : 'LIGHT'}
            </Text>
          </TouchableOpacity>

          {/* 24-Hour Technical Timer Pill */}
          <View style={[styles.clockPill, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.clockFlameDot} />
            <Text style={[styles.clockText, { color: theme.textPrimary }]}>{currentTime24}</Text>
            <Text style={styles.clockBadge24}>24H</Text>
          </View>
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
            <Text style={[styles.overviewTitle, { color: theme.textPrimary }]}>Today's Telemetry</Text>
          </View>
          <View style={[styles.filterChip, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <Text style={[styles.filterChipText, { color: theme.textSecondary }]}>
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
              subValue={`Target limit: ${preferences.dailyGoal}`}
              icon="🎬"
              accentColor={colors.two26.flame}
            />

            <StatMetricCard
              label="Feed Duration"
              value={DateTimeFormatter.formatDuration(filteredStats.durationSeconds)}
              subValue="Active viewing interval"
              icon="⏱️"
              accentColor={colors.two26.primary60}
            />
          </View>

          <View style={styles.gridRow}>
            <StatMetricCard
              label="Feed Launches"
              value={filteredStats.sessionCount}
              subValue="Distinct app entries"
              icon="📱"
              accentColor={colors.two26.primary}
            />

            <StatMetricCard
              label="Budget Used"
              value={`${goalPercentage}%`}
              subValue={goalPercentage >= 100 ? 'Quota exceeded' : 'Healthy balance'}
              icon="🎯"
              accentColor={goalPercentage >= 100 ? colors.danger : colors.two26.flame}
            />
          </View>
        </Animated.View>

        {/* Two26 Platform Breakdown Card */}
        {preferences.instagramTrackingEnabled && preferences.youtubeTrackingEnabled && (
          <View style={[styles.breakdownCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
            <View style={styles.breakdownHeader}>
              <Text style={[styles.breakdownTitle, { color: theme.textSecondary }]}>CROSS-PLATFORM ALLOCATION</Text>
              <Text style={styles.breakdownStudioTag}>[01 // TELEMETRY]</Text>
            </View>

            <View style={styles.splitRow}>
              {/* Instagram Stat */}
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <Text style={[styles.splitDot, { color: colors.platforms.instagram }]}>●</Text>
                  <Text style={[styles.splitName, { color: theme.textPrimary }]}>Instagram Reels</Text>
                </View>
                <Text style={[styles.splitCount, { color: theme.textPrimary }]}>
                  {todaySummary.instagramConfirmedCount} reels
                </Text>
                <Text style={[styles.splitDuration, { color: theme.textMuted }]}>
                  {DateTimeFormatter.formatDuration(todaySummary.instagramDurationSeconds)}
                </Text>
              </View>

              <View style={[styles.splitDivider, { backgroundColor: theme.divider }]} />

              {/* YouTube Stat */}
              <View style={styles.splitItem}>
                <View style={styles.splitHeader}>
                  <Text style={[styles.splitDot, { color: colors.platforms.youtube }]}>●</Text>
                  <Text style={[styles.splitName, { color: theme.textPrimary }]}>YouTube Shorts</Text>
                </View>
                <Text style={[styles.splitCount, { color: theme.textPrimary }]}>
                  {todaySummary.youtubeConfirmedCount} shorts
                </Text>
                <Text style={[styles.splitDuration, { color: theme.textMuted }]}>
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
    letterSpacing: -0.8,
  },
  studioSubtitle: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  themeToggleIcon: {
    fontSize: 10,
    color: colors.two26.flame,
    marginRight: 4,
  },
  themeToggleText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  clockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
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
    letterSpacing: -0.3,
  },
  filterChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.6,
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  breakdownCard: {
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
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
    fontWeight: '700',
  },
  splitCount: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  splitDuration: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'monospace',
  },
});

