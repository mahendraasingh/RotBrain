/**
 * RotBrain Onboarding Screen 5: Ready to Begin
 * Summary of selections, granted permissions, and entering the Main Dashboard with Two26 Studio styling.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors } from '../../../theme/colors';
import { spacing, radii } from '../../../theme/spacing';

interface ReadyToBeginScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ReadyToBeginScreen: React.FC<ReadyToBeginScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const { preferences, updatePreferences } = useRotBrainStore();
  const { instagramTrackingEnabled, youtubeTrackingEnabled, floatingBrainEnabled } =
    preferences;

  const handleFinish = async () => {
    await updatePreferences({
      hasCompletedOnboarding: true,
      onboardingCompletedAt: new Date().toISOString(),
    });
    onComplete();
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepBadge}>
        <View style={styles.dot} />
        <Text style={styles.stepText}>STEP 05 // 05 — SYSTEM PRIMED</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dual Magnetic Heading */}
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Ready to Begin</Text>
          <Text style={styles.dualTitleMain}>Ready to Begin</Text>
        </View>

        <Text style={styles.subheading}>
          Your biological attention telemetry profile has been initialized. You can reconfigure parameters anytime in Settings.
        </Text>

        {/* Configuration Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>ACTIVE CHANNELS</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Instagram Reels</Text>
            <View style={[styles.statusChip, { borderColor: instagramTrackingEnabled ? colors.two26.emerald : '#3F3F46' }]}>
              <Text
                style={[
                  styles.statusChipText,
                  { color: instagramTrackingEnabled ? colors.two26.emerald : '#71717A' },
                ]}
              >
                {instagramTrackingEnabled ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>YouTube Shorts</Text>
            <View style={[styles.statusChip, { borderColor: youtubeTrackingEnabled ? colors.two26.emerald : '#3F3F46' }]}>
              <Text
                style={[
                  styles.statusChipText,
                  { color: youtubeTrackingEnabled ? colors.two26.emerald : '#71717A' },
                ]}
              >
                {youtubeTrackingEnabled ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>ATTENTION TELEMETRY</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Brain Degradation Thresholds</Text>
            <Text style={styles.monoValue}>30 / 60 / 90+ Reels</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Floating Mobile HUD</Text>
            <Text style={[styles.monoValue, { color: floatingBrainEnabled ? colors.two26.flame : '#71717A' }]}>
              {floatingBrainEnabled ? 'ACTIVE [PINNED]' : 'OFF'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>System Clock</Text>
            <Text style={[styles.monoValue, { color: colors.two26.porcelain }]}>
              STRICT 24H (HH:mm)
            </Text>
          </View>
        </View>

        {/* Reassurance Banner */}
        <View style={styles.reassuranceBox}>
          <Text style={styles.reassuranceText}>
            [LOCAL ENCLAVE] RotBrain operates locally on your hardware. Zero data collection, minimal battery footprint, absolute respect for your privacy.
          </Text>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.launchButton} onPress={handleFinish} activeOpacity={0.85}>
          <Text style={styles.launchButtonText}>Enter Dashboard</Text>
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
  scrollContent: {
    paddingBottom: spacing.lg,
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
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  summaryCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#D4D4D8',
    fontWeight: '600',
  },
  statusChip: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  monoValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FAF9F6',
    fontFamily: 'monospace',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: spacing.md,
  },
  reassuranceBox: {
    backgroundColor: '#0E1017',
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reassuranceText: {
    fontSize: 11,
    color: '#71717A',
    lineHeight: 16,
    fontFamily: 'monospace',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
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
  launchButton: {
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
  launchButtonText: {
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

