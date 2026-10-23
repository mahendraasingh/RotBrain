/**
 * RotBrain FloatingMobileCounter
 *
 * Compact mobile phone icon positioned at the bottom right.
 * Automatically activates and counts whenever Instagram Reels or YouTube Shorts
 * start being viewed, displaying platform-specific indicators and live tally.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { radii, spacing } from '../../../theme/spacing';

export const FloatingMobileCounter: React.FC = () => {
  const {
    activeSession,
    todaySummary,
    preferences,
  } = useRotBrainStore();

  const [expanded, setExpanded] = useState<boolean>(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countAnim = useRef(new Animated.Value(1)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

  const isInstagramActive = activeSession?.platform === 'instagram';
  const isYoutubeActive = activeSession?.platform === 'youtube';
  const isAnyActive = !!activeSession;

  // Track previous count to trigger auto count animation
  const prevCountRef = useRef<number>(0);
  const currentCount = isInstagramActive
    ? todaySummary.instagramConfirmedCount
    : isYoutubeActive
    ? todaySummary.youtubeConfirmedCount
    : todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount;

  useEffect(() => {
    if (currentCount > prevCountRef.current) {
      // Trigger count pop animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(countAnim, {
            toValue: 1.35,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(badgeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(countAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(badgeAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
    prevCountRef.current = currentCount;
  }, [currentCount, countAnim, badgeAnim]);

  // Continuous gentle glow pulse when actively watching
  useEffect(() => {
    if (isAnyActive) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isAnyActive, pulseAnim]);

  const activeColor = isInstagramActive
    ? colors.platforms.instagram
    : isYoutubeActive
    ? colors.platforms.youtube
    : colors.primary;

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      {/* Expanded Details Flyout */}
      {expanded && (
        <View style={styles.flyoutCard}>
          <View style={styles.flyoutHeader}>
            <Text style={styles.flyoutTitle}>Live Reel/Short Tracker</Text>
            <TouchableOpacity onPress={() => setExpanded(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flyoutStatusRow}>
            <View
              style={[
                styles.flyoutDot,
                { backgroundColor: isAnyActive ? activeColor : '#64748B' },
              ]}
            />
            <Text style={styles.flyoutStatusText}>
              {isInstagramActive
                ? 'Instagram Reels Active'
                : isYoutubeActive
                ? 'YouTube Shorts Active'
                : 'Standby • Auto-detects on Feed View'}
            </Text>
          </View>

          <View style={styles.flyoutDivider} />

          <View style={styles.breakdownRow}>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>📷 Reels</Text>
              <Text style={[styles.miniVal, { color: colors.platforms.instagram }]}>
                {todaySummary.instagramConfirmedCount}
              </Text>
            </View>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>▶️ Shorts</Text>
              <Text style={[styles.miniVal, { color: colors.platforms.youtube }]}>
                {todaySummary.youtubeConfirmedCount}
              </Text>
            </View>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>Total</Text>
              <Text style={[styles.miniVal, { color: '#F8FAFC' }]}>
                {todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Floating Animated Badge Popup (+1) */}
      <Animated.View
        style={[
          styles.incrementBadge,
          {
            backgroundColor: activeColor,
            opacity: badgeAnim,
            transform: [
              {
                translateY: badgeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -28],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.incrementText}>+1</Text>
      </Animated.View>

      {/* Miniature Mobile Phone Chassis Icon */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded(!expanded)}
        style={styles.touchArea}
      >
        <Animated.View
          style={[
            styles.phoneChassis,
            {
              borderColor: isAnyActive ? activeColor : 'rgba(255, 255, 255, 0.18)',
              shadowColor: activeColor,
              shadowOpacity: isAnyActive ? 0.6 : 0.2,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {/* Top Speaker / Notch */}
          <View style={styles.phoneSpeaker} />

          {/* Inner Phone Screen */}
          <View
            style={[
              styles.phoneScreen,
              {
                backgroundColor: isAnyActive
                  ? isInstagramActive
                    ? 'rgba(225, 48, 108, 0.15)'
                    : 'rgba(255, 0, 0, 0.15)'
                  : '#0E1017',
              },
            ]}
          >
            {/* Platform Icon on Phone Screen */}
            <Text style={styles.screenPlatformIcon}>
              {isInstagramActive ? '📷' : isYoutubeActive ? '▶️' : '📱'}
            </Text>

            {/* Live Count on Screen */}
            <Animated.Text
              style={[
                styles.screenCountText,
                {
                  color: isAnyActive ? '#FFFFFF' : '#94A3B8',
                  transform: [{ scale: countAnim }],
                },
              ]}
            >
              {currentCount}
            </Animated.Text>
          </View>

          {/* Bottom Home Indicator */}
          <View
            style={[
              styles.phoneHomeBar,
              { backgroundColor: isAnyActive ? activeColor : '#64748B' },
            ]}
          />

          {/* Notification Alert Dot when active */}
          {isAnyActive && (
            <View style={[styles.cornerDot, { backgroundColor: activeColor }]} />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 84, // Sits comfortably above bottom navigation bar
    right: 18,
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  touchArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneChassis: {
    width: 44,
    height: 72,
    backgroundColor: '#13151F',
    borderRadius: 14,
    borderWidth: 2,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  phoneSpeaker: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#475569',
    marginTop: 1,
  },
  phoneScreen: {
    width: '100%',
    flex: 1,
    borderRadius: 8,
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  screenPlatformIcon: {
    fontSize: 12,
    marginBottom: 1,
  },
  screenCountText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  phoneHomeBar: {
    width: 16,
    height: 2.5,
    borderRadius: 2,
    marginBottom: 1,
  },
  cornerDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#0B0C10',
  },
  incrementBadge: {
    position: 'absolute',
    top: 0,
    right: 28,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.full,
    zIndex: 10000,
  },
  incrementText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  flyoutCard: {
    backgroundColor: '#161926',
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: 220,
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  flyoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  flyoutTitle: {
    ...typography.caption,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  closeText: {
    color: '#64748B',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  flyoutStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  flyoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  flyoutStatusText: {
    ...typography.caption,
    fontSize: 10,
    color: '#94A3B8',
  },
  flyoutDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  miniCol: {
    alignItems: 'center',
  },
  miniLabel: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 2,
  },
  miniVal: {
    fontSize: 12,
    fontWeight: '800',
  },
});
