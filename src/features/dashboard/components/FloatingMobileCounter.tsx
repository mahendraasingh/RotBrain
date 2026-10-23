/**
 * RotBrain FloatingMobileCounter
 *
 * Boutique Two26 Studio-inspired tactile mobile widget.
 * Features:
 * - Miniature smartphone frame with Two26 flame glow & OLED display
 * - Automatic real-time counter detection when reels or shorts start playing
 * - Monospace live tally display with dynamic "+1" floating pulse badge
 * - Tactile flyout telemetry card showing platform breakdown
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';

export const FloatingMobileCounter: React.FC = () => {
  const {
    activeSession,
    todaySummary,
  } = useRotBrainStore();

  const [expanded, setExpanded] = useState<boolean>(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countAnim = useRef(new Animated.Value(1)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

  const isInstagramActive = activeSession?.platform === 'instagram';
  const isYoutubeActive = activeSession?.platform === 'youtube';
  const isAnyActive = !!activeSession;

  const prevCountRef = useRef<number>(0);
  const currentCount = isInstagramActive
    ? todaySummary.instagramConfirmedCount
    : isYoutubeActive
    ? todaySummary.youtubeConfirmedCount
    : todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount;

  useEffect(() => {
    if (currentCount > prevCountRef.current) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(countAnim, {
            toValue: 1.4,
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

  // Continuous Two26 flame breathing glow when actively watching
  useEffect(() => {
    if (isAnyActive) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
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
    : colors.two26.flame;

  return (
    <View style={styles.floatingWrapper} pointerEvents="box-none">
      {/* Two26 Studio Flyout Telemetry Card */}
      {expanded && (
        <View style={styles.flyoutCard}>
          <View style={styles.flyoutHeader}>
            <View style={styles.flyoutTitleRow}>
              <View style={[styles.flyoutDot, { backgroundColor: isAnyActive ? activeColor : '#71717A' }]} />
              <Text style={styles.flyoutTitle}>FEED TELEMETRY</Text>
            </View>
            <TouchableOpacity onPress={() => setExpanded(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.flyoutStatusText}>
            {isInstagramActive
              ? 'Instagram Reels • Active Feed'
              : isYoutubeActive
              ? 'YouTube Shorts • Active Feed'
              : 'Standby • Auto-counts when viewing feeds'}
          </Text>

          <View style={styles.flyoutDivider} />

          <View style={styles.breakdownRow}>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>REELS</Text>
              <Text style={[styles.miniVal, { color: colors.platforms.instagram }]}>
                {todaySummary.instagramConfirmedCount}
              </Text>
            </View>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>SHORTS</Text>
              <Text style={[styles.miniVal, { color: colors.platforms.youtube }]}>
                {todaySummary.youtubeConfirmedCount}
              </Text>
            </View>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>TOTAL</Text>
              <Text style={[styles.miniVal, { color: '#FAF9F6' }]}>
                {todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Floating Animated Badge (+1) */}
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
                  outputRange: [0, -30],
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
              borderColor: isAnyActive ? activeColor : 'rgba(255, 255, 255, 0.16)',
              shadowColor: activeColor,
              shadowOpacity: isAnyActive ? 0.7 : 0.25,
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
                    ? 'rgba(225, 48, 108, 0.18)'
                    : 'rgba(255, 0, 0, 0.18)'
                  : '#07080B',
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
                  color: isAnyActive ? '#FAF9F6' : '#71717A',
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
              { backgroundColor: isAnyActive ? activeColor : '#52525B' },
            ]}
          />

          {/* Two26 Flame Alert Corner Dot */}
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
    bottom: 82,
    right: 18,
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  touchArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneChassis: {
    width: 46,
    height: 74,
    backgroundColor: '#0E1017',
    borderRadius: 14,
    borderWidth: 2,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  phoneSpeaker: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#52525B',
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
    fontWeight: '900',
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
    borderColor: '#07080B',
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
    color: '#FAF9F6',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  flyoutCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: 224,
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  flyoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  flyoutTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flyoutTitle: {
    fontSize: 10,
    color: '#FAF9F6',
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  closeText: {
    color: '#71717A',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  flyoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  flyoutStatusText: {
    fontSize: 10,
    color: '#A1A1AA',
    lineHeight: 14,
    marginVertical: 2,
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
    fontSize: 8,
    color: '#71717A',
    fontWeight: '800',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  miniVal: {
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
});
