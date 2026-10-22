/**
 * RotBrain Onboarding Screen 5: Enable Supported Permissions
 * Explains platform-specific tracking mechanisms honestly and transparently.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

interface EnablePermissionsScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const EnablePermissionsScreen: React.FC<EnablePermissionsScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [usageStatsGranted, setUsageStatsGranted] = useState(false);
  const [overlayGranted, setOverlayGranted] = useState(false);

  const isAndroid = Platform.OS === 'android';

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>STEP 5 OF 6 — MONITORING CAPABILITIES</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>System Permissions</Text>
        <Text style={styles.subheading}>
          To measure short-form video sessions without invading your privacy, RotBrain requests native OS activity awareness.
        </Text>

        {/* Capability 1: Usage Stats / Screen Time */}
        <View style={styles.permissionCard}>
          <View style={styles.permHeader}>
            <Text style={styles.permIcon}>📊</Text>
            <View style={styles.permHeaderText}>
              <Text style={styles.permTitle}>
                {isAndroid ? 'Usage Access Permission' : 'Screen Time & FamilyControls'}
              </Text>
              <Text style={styles.permPurpose}>Required for session detection</Text>
            </View>
          </View>
          <Text style={styles.permBody}>
            Allows RotBrain to detect when Instagram or YouTube is open in the foreground and log session duration.
          </Text>

          <TouchableOpacity
            style={[styles.grantButton, usageStatsGranted && styles.grantButtonDone]}
            onPress={() => setUsageStatsGranted(!usageStatsGranted)}
            activeOpacity={0.8}
          >
            <Text style={styles.grantButtonText}>
              {usageStatsGranted ? '✓ Access Enabled' : 'Enable Activity Access'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Capability 2: Android Floating Overlay (or iOS Widget/Notification) */}
        <View style={styles.permissionCard}>
          <View style={styles.permHeader}>
            <Text style={styles.permIcon}>{isAndroid ? '🧠' : '🔔'}</Text>
            <View style={styles.permHeaderText}>
              <Text style={styles.permTitle}>
                {isAndroid ? 'Display Over Other Apps' : 'Mindful Notifications'}
              </Text>
              <Text style={styles.permPurpose}>
                {isAndroid ? 'Powers floating brain mascot' : 'Milestone reminders'}
              </Text>
            </View>
          </View>
          <Text style={styles.permBody}>
            {isAndroid
              ? 'Enables the compact, draggable floating brain avatar in the corner of your screen so you can see fatigue levels live.'
              : 'Alerts you gently when your daily video count crosses 30, 60, or 90 short videos so you can step away.'}
          </Text>

          <TouchableOpacity
            style={[styles.grantButton, overlayGranted && styles.grantButtonDone]}
            onPress={() => setOverlayGranted(!overlayGranted)}
            activeOpacity={0.8}
          >
            <Text style={styles.grantButtonText}>
              {overlayGranted
                ? '✓ Permission Ready'
                : isAndroid
                ? 'Allow Floating Overlay'
                : 'Allow Notifications'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Policy & Transparency Note */}
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerText}>
            ⚖️ Operating system limitations: On iOS, system-wide floating overlays above other apps are not supported by Apple policy. On Android, accessibility detection requires user opt-in and is used strictly for short-video scroll context.
          </Text>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Review & Finish</Text>
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
  permissionCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.md,
  },
  permHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  permIcon: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  permHeaderText: {
    flex: 1,
  },
  permTitle: {
    ...typography.h4,
    color: '#F8FAFC',
  },
  permPurpose: {
    ...typography.caption,
    color: colors.primaryLight,
  },
  permBody: {
    ...typography.bodySmall,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  grantButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  grantButtonDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.success,
  },
  grantButtonText: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  disclaimerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  disclaimerText: {
    ...typography.caption,
    color: '#64748B',
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
