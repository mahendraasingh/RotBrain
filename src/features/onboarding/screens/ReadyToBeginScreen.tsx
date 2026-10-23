/**
 * RotBrain Onboarding Screen 6: Ready to Begin
 * Summary of selections, granted permissions, and entering the Main Dashboard.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
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
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>STEP 5 OF 5 — SETUP COMPLETE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>You're All Set!</Text>
        <Text style={styles.subheading}>
          Here is a summary of your RotBrain monitoring profile. You can modify these preferences in Settings anytime.
        </Text>

        {/* Configuration Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Tracked Platforms</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Instagram Reels</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: instagramTrackingEnabled ? colors.success : '#64748B' },
              ]}
            >
              {instagramTrackingEnabled ? 'Active' : 'Disabled'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>YouTube Shorts</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: youtubeTrackingEnabled ? colors.success : '#64748B' },
              ]}
            >
              {youtubeTrackingEnabled ? 'Active' : 'Disabled'}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Digital Wellbeing Features</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Brain Fatigue Milestones</Text>
            <Text style={[styles.summaryValue, { color: colors.fresh.base }]}>
              30 / 60 / 90+
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Floating Brain Overlay</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: floatingBrainEnabled ? colors.primaryLight : '#64748B' },
              ]}
            >
              {floatingBrainEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Display Clock</Text>
            <Text style={[styles.summaryValue, { color: colors.fresh.light }]}>
              Strict 24-Hour (HH:mm)
            </Text>
          </View>
        </View>

        {/* Reassurance Banner */}
        <View style={styles.reassuranceBox}>
          <Text style={styles.reassuranceText}>
            🌿 RotBrain works offline with local SQLite storage. We respect your privacy, your device battery, and your attention.
          </Text>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.launchButton} onPress={handleFinish}>
          <Text style={styles.launchButtonText}>Enter Dashboard →</Text>
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
  scrollContent: {
    paddingBottom: spacing.lg,
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
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    color: '#64748B',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: '#CBD5E1',
  },
  summaryValue: {
    ...typography.bodyMedium,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: spacing.md,
  },
  reassuranceBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: radii.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  reassuranceText: {
    ...typography.bodySmall,
    color: '#CBD5E1',
    lineHeight: 18,
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
    ...typography.bodyMedium,
    color: '#94A3B8',
    fontWeight: '600',
  },
  launchButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  launchButtonText: {
    ...typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
