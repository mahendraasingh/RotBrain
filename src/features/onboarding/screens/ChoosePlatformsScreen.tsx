/**
 * RotBrain Onboarding Screen 4: Choose Your Platforms
 * Allows user to toggle Instagram Reels and YouTube Shorts independently.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
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
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>STEP 4 OF 6 — TRACKED PLATFORMS</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Select Platforms to Track</Text>
        <Text style={styles.subheading}>
          Choose the feeds you want RotBrain to monitor. You can toggle each platform independently at any time.
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
              <Text style={styles.platformTitle}>Instagram Reels</Text>
              <Text style={styles.platformDescription}>
                Tracks vertical Reels scrolling and viewing session intervals.
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
              <Text style={styles.platformTitle}>YouTube Shorts</Text>
              <Text style={styles.platformDescription}>
                Tracks short-form vertical video playback inside YouTube.
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

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 Privacy First: All session data is stored locally on your device. We never capture your screen or transmit browsing history.
          </Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next: Permissions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  stepIndicator: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepText: {
    ...typography.badge,
    color: '#64748B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    ...typography.h2,
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subheading: {
    ...typography.bodyMedium,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  platformCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.lg,
  },
  platformCardActiveInstagram: {
    borderColor: colors.platforms.instagram,
    backgroundColor: 'rgba(225, 48, 108, 0.08)',
  },
  platformCardActiveYoutube: {
    borderColor: colors.platforms.youtube,
    backgroundColor: 'rgba(255, 0, 0, 0.08)',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleInstagram: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(225, 48, 108, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconCircleYoutube: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
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
  platformTitle: {
    ...typography.h4,
    color: '#F8FAFC',
    marginBottom: 2,
  },
  platformDescription: {
    ...typography.bodySmall,
    color: '#94A3B8',
    lineHeight: 18,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActiveInstagram: {
    backgroundColor: colors.platforms.instagram,
    borderColor: colors.platforms.instagram,
  },
  checkboxActiveYoutube: {
    backgroundColor: colors.platforms.youtube,
    borderColor: colors.platforms.youtube,
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
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
    ...typography.bodyMedium,
    color: '#94A3B8',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  nextButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
