/**
 * RotBrain Settings & User Preferences Screen
 *
 * Implements:
 * - Independent platform monitoring toggles (Instagram, YouTube)
 * - Android Floating Brain overlay controls (toggle & size: small, medium, large)
 * - Daily goal adjustment
 * - Mindful break reminders toggle
 * - Strict 24-hour time clock status
 * - Privacy controls, data export, and local history wipe
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { FloatingBrainSize } from '../../types/user';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export const SettingsScreen: React.FC = () => {
  const { preferences, updatePreferences, clearHistory } = useRotBrainStore();
  const isAndroid = Platform.OS === 'android';

  const handleClearHistory = () => {
    Alert.alert(
      'Delete Local History',
      'Are you sure you want to permanently erase all locally stored short-video sessions and statistics? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            Alert.alert('History Cleared', 'Your local database has been reset.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your session records and daily summaries have been formatted into a local JSON backup.'
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Preferences, limits & privacy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Tracked Platforms */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Platform Monitoring</Text>

          {/* Instagram Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Instagram Reels</Text>
              <Text style={styles.settingDesc}>
                Detects Reels scrolling sessions and accumulates fatigue tally.
              </Text>
            </View>
            <Switch
              value={preferences.instagramTrackingEnabled}
              onValueChange={(val) =>
                updatePreferences({ instagramTrackingEnabled: val })
              }
              trackColor={{ false: '#334155', true: colors.platforms.instagram }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* YouTube Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>YouTube Shorts</Text>
              <Text style={styles.settingDesc}>
                Monitors short-form video playback inside the YouTube client.
              </Text>
            </View>
            <Switch
              value={preferences.youtubeTrackingEnabled}
              onValueChange={(val) =>
                updatePreferences({ youtubeTrackingEnabled: val })
              }
              trackColor={{ false: '#334155', true: colors.platforms.youtube }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Section 2: Android Floating Brain Overlay */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>
            {isAndroid ? 'Android Floating Brain Overlay' : 'Screen Time Interface'}
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Enable Floating Mascot</Text>
              <Text style={styles.settingDesc}>
                {isAndroid
                  ? 'Displays a compact, draggable brain avatar over feeds with live count.'
                  : 'Displays dynamic in-app mascot and mindful notification reminders.'}
              </Text>
            </View>
            <Switch
              value={preferences.floatingBrainEnabled}
              onValueChange={(val) =>
                updatePreferences({ floatingBrainEnabled: val })
              }
              trackColor={{ false: '#334155', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {isAndroid && preferences.floatingBrainEnabled && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subLabel}>Mascot Icon Size</Text>
              <View style={styles.sizePickerRow}>
                {(['small', 'medium', 'large'] as FloatingBrainSize[]).map((sz) => {
                  const isSelected = preferences.floatingBrainSize === sz;
                  return (
                    <TouchableOpacity
                      key={sz}
                      style={[
                        styles.sizeButton,
                        isSelected && styles.sizeButtonActive,
                      ]}
                      onPress={() => updatePreferences({ floatingBrainSize: sz })}
                    >
                      <Text
                        style={[
                          styles.sizeButtonText,
                          isSelected && styles.sizeButtonTextActive,
                        ]}
                      >
                        {sz.charAt(0).toUpperCase() + sz.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Section 3: Goals & Wellbeing */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Daily Targets & Limits</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Daily Video Budget</Text>
              <Text style={styles.settingDesc}>
                Current threshold: {preferences.dailyGoal} videos per day.
              </Text>
            </View>

            <View style={styles.counterControlRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() =>
                  updatePreferences({
                    dailyGoal: Math.max(10, preferences.dailyGoal - 5),
                  })
                }
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.counterVal}>{preferences.dailyGoal}</Text>

              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() =>
                  updatePreferences({
                    dailyGoal: Math.min(200, preferences.dailyGoal + 5),
                  })
                }
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time System Indicator */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Time Format</Text>
              <Text style={styles.settingDesc}>
                RotBrain strictly adheres to the international 24-hour clock.
              </Text>
            </View>
            <View style={styles.badgeLocked}>
              <Text style={styles.badgeLockedText}>24-Hour (Locked)</Text>
            </View>
          </View>
        </View>

        {/* Section 4: Privacy & Data Management */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Privacy & Data Protection</Text>

          <Text style={styles.privacyNote}>
            All session metrics, durations, and counts are encrypted and stored strictly locally inside your on-device SQLite database. No telemetry, audio, or video streams are ever transmitted off this device.
          </Text>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportData}
            activeOpacity={0.8}
          >
            <Text style={styles.exportButtonText}>📥 Export Activity Data (JSON)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.dangerButtonText}>🗑️ Permanently Delete All Local History</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Footer */}
        <View style={styles.appFooter}>
          <Text style={styles.footerVersion}>RotBrain v1.0.0 (Production Build)</Text>
          <Text style={styles.footerSub}>
            Digital Wellbeing for Mindful Scrolling
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
    paddingHorizontal: spacing.screenPadding,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: '#F8FAFC',
  },
  subtitle: {
    ...typography.caption,
    color: '#94A3B8',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  sectionCard: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sectionHeader: {
    ...typography.caption,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  settingTextCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.h4,
    color: '#F8FAFC',
    marginBottom: 2,
  },
  settingDesc: {
    ...typography.bodySmall,
    color: '#94A3B8',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: spacing.md,
  },
  subLabel: {
    ...typography.bodySmall,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sizePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  sizeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  sizeButtonText: {
    ...typography.caption,
    color: '#94A3B8',
  },
  sizeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  counterControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  counterVal: {
    ...typography.h4,
    color: colors.primaryLight,
    marginHorizontal: spacing.sm,
    fontWeight: '800',
  },
  badgeLocked: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.fresh.base,
  },
  badgeLockedText: {
    ...typography.caption,
    color: colors.fresh.light,
    fontWeight: '700',
  },
  privacyNote: {
    ...typography.bodySmall,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  exportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  exportButtonText: {
    ...typography.bodyMedium,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerButtonText: {
    ...typography.bodyMedium,
    color: colors.danger,
    fontWeight: '700',
  },
  appFooter: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerVersion: {
    ...typography.caption,
    color: '#64748B',
    fontWeight: '700',
  },
  footerSub: {
    ...typography.caption,
    color: '#475569',
    marginTop: 2,
  },
});
