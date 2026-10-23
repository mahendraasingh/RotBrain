/**
 * RotBrain FloatingMobileCounter
 *
 * Floating brain mascot widget positioned at the bottom right.
 * Strict Visibility Logic:
 * - Hidden during normal browsing/scrolling.
 * - Appears ONLY when the user actively consumes Reels or Shorts AND has granted
 *   permission for that platform (Instagram Reels or YouTube Shorts).
 * - Smooth entrance and exit transitions when reels playback starts/stops.
 * - Dynamic milestone brain expressions (<30 fresh, 30+ tired, 60+ very tired, 90+ exhausted).
 * - Overlapping circular count badge matching reference photo.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { BrainState } from '../../../types/brain';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';

import brainFresh from '../../../../assets/images/freshBrain.png';
import brainTired from '../../../../assets/images/brain_tired.jpg';
import brainVeryTired from '../../../../assets/images/brain_very_tired.jpg';
import brainExhausted from '../../../../assets/images/brain_exhausted.jpg';

const BRAIN_IMAGES: Record<BrainState, any> = {
  fresh: brainFresh,
  tired: brainTired,
  very_tired: brainVeryTired,
  exhausted: brainExhausted,
};

const BRAIN_STAGE_NAMES: Record<BrainState, string> = {
  fresh: 'Fresh Brain (<30)',
  tired: 'Tired Brain (30+)',
  very_tired: 'Very Tired (60+)',
  exhausted: 'Exhausted (90+)',
};

export const FloatingMobileCounter: React.FC = () => {
  const {
    activeSession,
    todaySummary,
    preferences,
  } = useRotBrainStore();

  const [expanded, setExpanded] = useState<boolean>(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

  // Strict Permission & Active Session Gate:
  // ONLY appears when reel/short is actively playing AND user has permitted that channel
  const isInstagramPermitted = preferences.instagramTrackingEnabled;
  const isYoutubePermitted = preferences.youtubeTrackingEnabled;
  const isFloatingEnabled = preferences.floatingBrainEnabled;

  const isInstagramActive =
    activeSession?.platform === 'instagram' && isInstagramPermitted;
  const isYoutubeActive =
    activeSession?.platform === 'youtube' && isYoutubePermitted;

  const isSessionActive =
    isFloatingEnabled && (isInstagramActive || isYoutubeActive);

  // Visibility entrance/exit animation
  const visibilityAnim = useRef(new Animated.Value(isSessionActive ? 1 : 0)).current;
  const [shouldRender, setShouldRender] = useState<boolean>(isSessionActive);

  useEffect(() => {
    if (isSessionActive) {
      setShouldRender(true);
      Animated.timing(visibilityAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(visibilityAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
        setExpanded(false);
      });
    }
  }, [isSessionActive, visibilityAnim]);

  // Track previous count to trigger auto count animation
  const prevCountRef = useRef<number>(0);
  const currentCount = isInstagramActive
    ? todaySummary.instagramConfirmedCount
    : isYoutubeActive
    ? todaySummary.youtubeConfirmedCount
    : todaySummary.instagramConfirmedCount + todaySummary.youtubeConfirmedCount;

  // Compute dynamic brain state based on reel count milestones
  const getBrainState = (count: number): BrainState => {
    if (count >= 90) return 'exhausted';
    if (count >= 60) return 'very_tired';
    if (count >= 30) return 'tired';
    return 'fresh';
  };

  const currentBrainState = getBrainState(currentCount);
  const rawImage = BRAIN_IMAGES[currentBrainState] || BRAIN_IMAGES.fresh;
  const mascotSource = typeof rawImage === 'string' ? { uri: rawImage } : rawImage;

  // Pop animation when count increases
  useEffect(() => {
    if (currentCount > prevCountRef.current && isSessionActive) {
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
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
    prevCountRef.current = currentCount;
  }, [currentCount, isSessionActive, countAnim, badgeAnim]);

  // Gentle floating breathing animation
  useEffect(() => {
    if (!shouldRender) return;
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, [shouldRender, floatAnim]);

  // Continuous glow pulse when feed is actively detected
  useEffect(() => {
    if (isSessionActive) {
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
  }, [isSessionActive, pulseAnim]);

  // Do not render anything when not active
  if (!shouldRender) {
    return null;
  }

  const activeColor = isInstagramActive
    ? colors.platforms.instagram
    : isYoutubeActive
    ? colors.platforms.youtube
    : '#FF6B00';

  return (
    <Animated.View
      style={[
        styles.floatingWrapper,
        {
          opacity: visibilityAnim,
          transform: [{ scale: visibilityAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      {/* Expanded Details Flyout */}
      {expanded && (
        <View style={styles.flyoutCard}>
          <View style={styles.flyoutHeader}>
            <View style={styles.flyoutTitleRow}>
              <View
                style={[
                  styles.flyoutDot,
                  { backgroundColor: activeColor },
                ]}
              />
              <Text style={styles.flyoutTitle}>FEED TELEMETRY</Text>
            </View>
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.stageIndicatorText}>
            Stage: {BRAIN_STAGE_NAMES[currentBrainState]}
          </Text>

          <Text style={styles.flyoutStatusText}>
            {isInstagramActive
              ? 'Instagram Reels • Active Feed'
              : 'YouTube Shorts • Active Feed'}
          </Text>

          <View style={styles.flyoutDivider} />

          <View style={styles.breakdownRow}>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>📷 REELS</Text>
              <Text style={[styles.miniVal, { color: colors.platforms.instagram }]}>
                {todaySummary.instagramConfirmedCount}
              </Text>
            </View>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>▶️ SHORTS</Text>
              <Text style={[styles.miniVal, { color: colors.platforms.youtube }]}>
                {todaySummary.youtubeConfirmedCount}
              </Text>
            </View>
            <View style={styles.miniCol}>
              <Text style={styles.miniLabel}>TOTAL</Text>
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
                  outputRange: [0, -32],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.incrementText}>+1</Text>
      </Animated.View>

      {/* Circular Brain Mascot Floating Widget with Overlapping Count Badge */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setExpanded(!expanded)}
        style={styles.touchArea}
      >
        <Animated.View
          style={[
            styles.mascotWidgetContainer,
            {
              transform: [
                { translateY: floatAnim },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          {/* Circular Brain Mascot Bubble */}
          <View
            style={[
              styles.brainBubbleCircle,
              {
                borderColor: activeColor,
                shadowColor: activeColor,
              },
            ]}
          >
            <Image
              source={mascotSource}
              style={styles.brainBubbleImage}
              resizeMode="cover"
            />
          </View>

          {/* Overlapping Circular Cream Count Badge at Bottom Center */}
          <Animated.View
            style={[
              styles.countBadgeCircle,
              {
                transform: [{ scale: countAnim }],
              },
            ]}
          >
            <Text style={styles.countBadgeText}>{currentCount}</Text>
          </Animated.View>

          {/* Active Platform Dot Indicator */}
          <View
            style={[
              styles.platformDotRing,
              { backgroundColor: activeColor },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    bottom: 84, // Sits above bottom navigation tabs
    right: 18,
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  touchArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotWidgetContainer: {
    width: 62,
    height: 68,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  brainBubbleCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#351B0A',
    borderWidth: 2.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  brainBubbleImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  countBadgeCircle: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 5,
    backgroundColor: '#FFF1E0',
    borderWidth: 1.5,
    borderColor: '#4A230D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 9,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#3B1806',
    fontFamily: 'monospace',
    textAlign: 'center',
    includeFontPadding: false,
  },
  platformDotRing: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#0D0E15',
    elevation: 10,
  },
  incrementBadge: {
    position: 'absolute',
    top: -12,
    right: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.full,
    elevation: 10,
  },
  incrementText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  flyoutCard: {
    backgroundColor: '#12141D',
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    width: 236,
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
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
    fontSize: 13,
    paddingHorizontal: 4,
  },
  flyoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stageIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FB923C',
    marginVertical: 2,
  },
  flyoutStatusText: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 14,
    marginVertical: 2,
  },
  flyoutDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: spacing.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
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
