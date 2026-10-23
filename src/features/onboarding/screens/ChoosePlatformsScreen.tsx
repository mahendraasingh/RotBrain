/**
 * RotBrain Onboarding Screen 3: Choose Your Platforms
 * Allows user to toggle Instagram Reels and YouTube Shorts independently with Two26 Studio styling.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors } from '../../../theme/colors';
import { spacing, radii } from '../../../theme/spacing';

interface ChoosePlatformsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const ChoosePlatformsScreen: React.FC<ChoosePlatformsScreenProps> = ({
  onNext,
  onBack,
}) => {
  const { preferences, setPlatformTracking } = useRotBrainStore();
  const { instagramTrackingEnabled, youtubeTrackingEnabled } = preferences;

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepBadge}>
        <View style={styles.dot} />
        <Text style={styles.stepText}>STEP 03 // 05 — TRACKED PLATFORMS</Text>
      </View>

      <View style={styles.content}>
        {/* Dual Magnetic Heading */}
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Target Channels</Text>
          <Text style={styles.dualTitleMain}>Target Channels</Text>
        </View>

        <Text style={styles.subheading}>
          Select the short-form feeds RotBrain monitors. Feeds can be toggled independently at any time.
        </Text>

        {/* Instagram Reels Card */}
        <TouchableOpacity
          style={[
            styles.platformCard,
            instagramTrackingEnabled && styles.platformCardActiveInstagram,
          ]}
          onPress={() => setPlatformTracking('instagram', !instagramTrackingEnabled)}
          activeOpacity={0.8}
        >
          <View style={styles.platformHeader}>
            <View style={styles.iconCircleInstagram}>
              <Text style={styles.platformIconText}>📷</Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.platformTitle}>Instagram Reels</Text>
                <Text style={styles.platformTag}>META // FEED</Text>
              </View>
              <Text style={styles.platformDescription}>
                Monitors vertical Reels consumption & continuous scrolling intervals.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                instagramTrackingEnabled && styles.checkboxActiveInstagram,
              ]}
            >
              {instagramTrackingEnabled && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        </TouchableOpacity>

        {/* YouTube Shorts Card */}
        <TouchableOpacity
          style={[
            styles.platformCard,
            youtubeTrackingEnabled && styles.platformCardActiveYoutube,
          ]}
          onPress={() => setPlatformTracking('youtube', !youtubeTrackingEnabled)}
          activeOpacity={0.8}
        >
          <View style={styles.platformHeader}>
            <View style={styles.iconCircleYoutube}>
              <Text style={styles.platformIconText}>▶️</Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.platformTitle}>YouTube Shorts</Text>
                <Text style={styles.platformTag}>GOOGLE // FEED</Text>
              </View>
              <Text style={styles.platformDescription}>
                Audits short-form vertical playback within the native YouTube app.
              </Text>
            </View>
            <View
              style={[
                styles.checkbox,
                youtubeTrackingEnabled && styles.checkboxActiveYoutube,
              ]}
            >
              {youtubeTrackingEnabled && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        </TouchableOpacity>

        {/* Privacy Callout */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            [LOCAL ENCLAVE] All telemetry is processed on-device. Zero video frames or personal data leave your phone.
          </Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>Next: Permissions</Text>
          <Text style={styles.buttonArrow}>↗</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080B',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#0E1017',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.two26.flame,
    marginRight: spacing.sm,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  stepText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  dualHeadingWrap: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dualTitleShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 26,
    fontWeight: '900',
    color: colors.two26.flame,
    opacity: 0.35,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  dualTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FAF9F6',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subheading: {
    fontSize: 13,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  platformCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  platformCardActiveInstagram: {
    borderColor: 'rgba(225, 48, 108, 0.5)',
    backgroundColor: 'rgba(225, 48, 108, 0.06)',
  },
  platformCardActiveYoutube: {
    borderColor: 'rgba(255, 0, 0, 0.5)',
    backgroundColor: 'rgba(255, 0, 0, 0.06)',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleInstagram: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(225, 48, 108, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(225, 48, 108, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconCircleYoutube: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  platformIconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  platformTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FAF9F6',
    letterSpacing: -0.3,
  },
  platformTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  platformDescription: {
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 17,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3F3F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActiveInstagram: {
    backgroundColor: '#E1306C',
    borderColor: '#E1306C',
  },
  checkboxActiveYoutube: {
    backgroundColor: '#FF0000',
    borderColor: '#FF0000',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: '#0E1017',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoText: {
    fontSize: 11,
    color: '#71717A',
    lineHeight: 16,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  backButtonText: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: colors.two26.flame,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.xl,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 14,
    color: '#FAF9F6',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  buttonArrow: {
    fontSize: 15,
    color: '#FAF9F6',
    fontWeight: '800',
    marginLeft: 6,
  },
});

