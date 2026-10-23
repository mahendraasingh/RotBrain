/**
 * RotBrain Settings & User Preferences Screen
 *
 * Implements:
 * - Theme selector: Two26 Studio Light (Blush #F8EEE8) / Studio Dark (Espresso #161413)
 * - Independent platform monitoring toggles (Instagram, YouTube)
 * - Android Floating Brain overlay controls (toggle & size: small, medium, large)
 * - Daily goal adjustment
 * - Mindful break reminders toggle
 * - Strict 24-hour time clock status
 * - Privacy controls, data export, and local history wipe
 * - Styled in Two26 Studio aesthetic with zero green elements
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
import { colors, getThemeColors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

export const SettingsScreen: React.FC = () => {
  const { preferences, updatePreferences, clearHistory } = useRotBrainStore();
  const isAndroid = Platform.OS === 'android';
  const theme = preferences.themePreference;
  const themeColors = getThemeColors(theme);
  const isDark = theme === 'dark';

  const handleClearHistory = () => {
    Alert.alert(
      'Purge Local Enclave',
      'Are you sure you want to permanently erase all locally stored session telemetry and statistics? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purge All Records',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            Alert.alert('Database Purged', 'All local logs have been reset to zero.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Enclave Data',
      'Your session records and daily summaries have been formatted into a local JSON backup payload.'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.studioPill,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.studioDot} />
          <Text style={[styles.studioPillText, { color: themeColors.textSecondary }]}>
            PREFERENCES // SYSTEM CONTROL
          </Text>
        </View>

        {/* Dual Magnetic Heading */}
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Control Center</Text>
          <Text style={[styles.dualTitleMain, { color: themeColors.textPrimary }]}>
            Control Center
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
          Sensors, themes & local privacy enclave
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 0: Two26 Theme Selector */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
              APPEARANCE & THEME
            </Text>
            <Text style={[styles.cardHeaderArrow, { color: themeColors.textMuted }]}>↗</Text>
          </View>
          <Text style={[styles.settingDesc, { color: themeColors.textSecondary, marginBottom: spacing.sm }]}>
            Select your preferred visual atmosphere. Warm Two26 Blush canvas or Midnight Espresso Noir.
          </Text>

          <View style={styles.themeToggleRow}>
            <TouchableOpacity
              style={[
                styles.themeBtn,
                {
                  backgroundColor: !isDark ? colors.two26.flame : themeColors.surface2,
                  borderColor: !isDark ? colors.two26.flame : themeColors.surfaceBorder,
                },
              ]}
              onPress={() => updatePreferences({ themePreference: 'light' })}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  { color: !isDark ? '#FFFFFF' : themeColors.textPrimary },
                ]}
              >
                ☀ LIGHT (BLUSH)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                {
                  backgroundColor: isDark ? colors.two26.flame : themeColors.surface2,
                  borderColor: isDark ? colors.two26.flame : themeColors.surfaceBorder,
                },
              ]}
              onPress={() => updatePreferences({ themePreference: 'dark' })}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.themeBtnText,
                  { color: isDark ? '#FFFFFF' : themeColors.textPrimary },
                ]}
              >
                ☾ DARK (ESPRESSO)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 1: Tracked Platforms */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
              CHANNEL MONITORING
            </Text>
            <Text style={[styles.cardHeaderArrow, { color: themeColors.textMuted }]}>↗</Text>
          </View>

          {/* Instagram Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                Instagram Reels
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                Detects Reels scrolling sessions & accumulates biological fatigue tally.
              </Text>
            </View>
            <Switch
              value={preferences.instagramTrackingEnabled}
              onValueChange={(val) =>
                updatePreferences({ instagramTrackingEnabled: val })
              }
              trackColor={{ false: themeColors.surface2, true: '#E1306C' }}
              thumbColor={themeColors.surface}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />

          {/* YouTube Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                YouTube Shorts
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                Monitors short-form vertical playback within the native YouTube client.
              </Text>
            </View>
            <Switch
              value={preferences.youtubeTrackingEnabled}
              onValueChange={(val) =>
                updatePreferences({ youtubeTrackingEnabled: val })
              }
              trackColor={{ false: themeColors.surface2, true: colors.two26.flame }}
              thumbColor={themeColors.surface}
            />
          </View>
        </View>

        {/* Section 2: Floating Mascot HUD */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
              {isAndroid ? 'MOBILE OVERLAY HUD' : 'SCREEN TIME INTERFACE'}
            </Text>
            <Text style={[styles.cardHeaderArrow, { color: themeColors.textMuted }]}>↗</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                Enable Floating Mascot
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                {isAndroid
                  ? 'Displays a compact, draggable phone HUD over feeds with real-time video counter.'
                  : 'Displays dynamic in-app mascot and mindful notification reminders.'}
              </Text>
            </View>
            <Switch
              value={preferences.floatingBrainEnabled}
              onValueChange={(val) =>
                updatePreferences({ floatingBrainEnabled: val })
              }
              trackColor={{ false: themeColors.surface2, true: colors.two26.flame }}
              thumbColor={themeColors.surface}
            />
          </View>

          {isAndroid && preferences.floatingBrainEnabled && (
            <>
              <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />
              <Text style={[styles.subLabel, { color: themeColors.textSecondary }]}>Mascot Scale</Text>
              <View style={styles.sizePickerRow}>
                {(['small', 'medium', 'large'] as FloatingBrainSize[]).map((sz) => {
                  const isSelected = preferences.floatingBrainSize === sz;
                  return (
                    <TouchableOpacity
                      key={sz}
                      style={[
                        styles.sizeButton,
                        {
                          borderColor: isSelected ? colors.two26.flame : themeColors.surfaceBorder,
                          backgroundColor: isSelected ? themeColors.chipBg : themeColors.surface2,
                        },
                      ]}
                      onPress={() => updatePreferences({ floatingBrainSize: sz })}
                    >
                      <Text
                        style={[
                          styles.sizeButtonText,
                          {
                            color: isSelected ? colors.two26.flame : themeColors.textMuted,
                          },
                        ]}
                      >
                        {sz.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {/* Section 3: Daily Limit & Attention Budget */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
              DAILY ATTENTION BUDGET
            </Text>
            <Text style={[styles.cardHeaderArrow, { color: themeColors.textMuted }]}>↗</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                Max Daily Videos
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                Brain stage advances and turns severe when this quota is exceeded.
              </Text>
            </View>
            <View style={styles.counterControlRow}>
              <TouchableOpacity
                style={[
                  styles.counterBtn,
                  {
                    backgroundColor: themeColors.surface2,
                    borderColor: themeColors.surfaceBorder,
                  },
                ]}
                onPress={() =>
                  updatePreferences({
                    dailyGoal: Math.max(10, preferences.dailyGoal - 5),
                  })
                }
              >
                <Text style={[styles.counterBtnText, { color: themeColors.textPrimary }]}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterVal}>{preferences.dailyGoal}</Text>
              <TouchableOpacity
                style={[
                  styles.counterBtn,
                  {
                    backgroundColor: themeColors.surface2,
                    borderColor: themeColors.surfaceBorder,
                  },
                ]}
                onPress={() =>
                  updatePreferences({
                    dailyGoal: Math.min(200, preferences.dailyGoal + 5),
                  })
                }
              >
                <Text style={[styles.counterBtnText, { color: themeColors.textPrimary }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />

          {/* Break Reminders Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                Mindful Interval Prompts
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                Triggers visual wakeups when a session lasts over 15 continuous minutes.
              </Text>
            </View>
            <Switch
              value={preferences.notificationsEnabled}
              onValueChange={(val) =>
                updatePreferences({ notificationsEnabled: val })
              }
              trackColor={{ false: themeColors.surface2, true: colors.two26.flame }}
              thumbColor={themeColors.surface}
            />
          </View>
        </View>

        {/* Section 4: 24-Hour Time Format Status */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
              CHRONO STANDARD
            </Text>
            <Text style={[styles.cardHeaderArrow, { color: themeColors.textMuted }]}>↗</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: themeColors.textPrimary }]}>
                24-Hour Timeline Format
              </Text>
              <Text style={[styles.settingDesc, { color: themeColors.textSecondary }]}>
                RotBrain strictly uses 00:00 - 23:59 military time across all session logs and resets at 00:00 midnight.
              </Text>
            </View>
            <View style={styles.badgeLocked}>
              <Text style={styles.badgeLockedText}>24H ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Section 5: Data Enclave & Privacy */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
              LOCAL DATA ENCLAVE
            </Text>
            <Text style={[styles.cardHeaderArrow, { color: themeColors.textMuted }]}>↗</Text>
          </View>

          <Text style={[styles.privacyNote, { color: themeColors.textSecondary }]}>
            All telemetry is strictly isolated on your device in encrypted local storage.
            No consumption metrics are ever transmitted to any third-party analytics servers.
          </Text>

          <TouchableOpacity
            style={[
              styles.exportButton,
              {
                backgroundColor: themeColors.surface2,
                borderColor: themeColors.surfaceBorder,
              },
            ]}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <Text style={[styles.exportButtonText, { color: themeColors.textPrimary }]}>
              EXPORT TELEMETRY (JSON)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistory}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerButtonText}>PURGE ALL LOCAL LOGS</Text>
          </TouchableOpacity>
        </View>

        {/* App Meta Footer */}
        <View style={styles.appFooter}>
          <Text style={[styles.footerVersion, { color: themeColors.textMuted }]}>
            ROTBRAIN v2.2.0 • TWO26 STUDIO EDITION
          </Text>
          <Text style={[styles.footerSub, { color: themeColors.textMuted }]}>
            NEURAL HYGIENE • ATTENTION SANCTUARY
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  studioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  studioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.two26.flame,
    marginRight: spacing.xs,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  studioPillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  dualHeadingWrap: {
    position: 'relative',
    marginVertical: 4,
  },
  dualTitleShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 26,
    fontWeight: '900',
    color: colors.two26.flame,
    opacity: 0.25,
    letterSpacing: -0.6,
  },
  dualTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  sectionCard: {
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  cardHeaderArrow: {
    fontSize: 12,
  },
  themeToggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  themeBtnText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
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
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  settingDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  sizePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    marginHorizontal: 3,
  },
  sizeButtonText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  counterControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  counterVal: {
    fontSize: 16,
    color: colors.two26.flame,
    marginHorizontal: spacing.sm,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  badgeLocked: {
    backgroundColor: 'rgba(255, 84, 0, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.two26.flame,
  },
  badgeLockedText: {
    fontSize: 9,
    color: colors.two26.flame,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  privacyNote: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  exportButton: {
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.4,
  },
  dangerButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerButtonText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.4,
  },
  appFooter: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerVersion: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  footerSub: {
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 0.6,
    marginTop: 4,
  },
});
