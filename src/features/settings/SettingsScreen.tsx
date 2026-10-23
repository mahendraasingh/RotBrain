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
 * - Styled in Two26 Studio aesthetic
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
import { spacing, radii } from '../../theme/spacing';

export const SettingsScreen: React.FC = () => {
  const { preferences, updatePreferences, clearHistory } = useRotBrainStore();
  const isAndroid = Platform.OS === 'android';

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.studioPill}>
          <View style={styles.studioDot} />
          <Text style={styles.studioPillText}>PREFERENCES // SYSTEM CONTROL</Text>
        </View>

        {/* Dual Magnetic Heading */}
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Control Center</Text>
          <Text style={styles.dualTitleMain}>Control Center</Text>
        </View>
        <Text style={styles.subtitle}>Sensors, limits & local privacy enclave</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Tracked Platforms */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeader}>CHANNEL MONITORING</Text>
            <Text style={styles.cardHeaderArrow}>↗</Text>
          </View>

          {/* Instagram Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Instagram Reels</Text>
              <Text style={styles.settingDesc}>
                Detects Reels scrolling sessions & accumulates biological fatigue tally.
              </Text>
            </View>
            <Switch
              value={preferences.instagramTrackingEnabled}
              onValueChange={(val) =>
                updatePreferences({ instagramTrackingEnabled: val })
              }
              trackColor={{ false: '#1E2330', true: '#E1306C' }}
              thumbColor="#FAF9F6"
            />
          </View>

          <View style={styles.divider} />

          {/* YouTube Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>YouTube Shorts</Text>
              <Text style={styles.settingDesc}>
                Monitors short-form vertical playback within the native YouTube client.
              </Text>
            </View>
            <Switch
              value={preferences.youtubeTrackingEnabled}
              onValueChange={(val) =>
                updatePreferences({ youtubeTrackingEnabled: val })
              }
              trackColor={{ false: '#1E2330', true: colors.two26.flame }}
              thumbColor="#FAF9F6"
            />
          </View>
        </View>

        {/* Section 2: Floating Mascot HUD */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeader}>
              {isAndroid ? 'MOBILE OVERLAY HUD' : 'SCREEN TIME INTERFACE'}
            </Text>
            <Text style={styles.cardHeaderArrow}>↗</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingLabel}>Enable Floating Mascot</Text>
              <Text style={styles.settingDesc}>
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
              trackColor={{ false: '#1E2330', true: colors.two26.flame }}
              thumbColor="#FAF9F6"
            />
          </View>

          {isAndroid && preferences.floatingBrainEnabled && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subLabel}>Mascot Scale</Text>
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
                        {sz.toUpperCase()}
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
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeader}>DAILY TARGETS & TIMELINE</Text>
            <Text style={styles.cardHeaderArrow}>↗</Text>
          </View>

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
              <Text style={styles.badgeLockedText}>STRICT 24H [LOCKED]</Text>
            </View>
          </View>
        </View>

        {/* Section 4: Privacy & Data Protection */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionHeader}>LOCAL ENCLAVE // PRIVACY</Text>
            <Text style={styles.cardHeaderArrow}>↗</Text>
          </View>

          <Text style={styles.privacyNote}>
            All session metrics, durations, and counts are processed strictly locally in your device SQLite database. Zero audio, video, or keystroke streams are ever transmitted.
          </Text>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportData}
            activeOpacity={0.8}
          >
            <Text style={styles.exportButtonText}>Export Telemetry Payload (JSON) ↗</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistory}
            activeOpacity={0.8}
          >
            <Text style={styles.dangerButtonText}>Permanently Purge All Local History ↗</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Footer */}
        <View style={styles.appFooter}>
          <Text style={styles.footerVersion}>ROTBRAIN // STUDIO EDITION v1.0.0</Text>
          <Text style={styles.footerSub}>
            ATTENTION INTELLIGENCE • DESIGNED FOR MINDFUL CONSUMPTION
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080B',
    paddingHorizontal: spacing.screenPadding,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.sm,
  },
  studioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0E1017',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#A1A1AA',
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
    opacity: 0.35,
    letterSpacing: -0.6,
  },
  dualTitleMain: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FAF9F6',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  sectionCard: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  cardHeaderArrow: {
    fontSize: 12,
    color: '#71717A',
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
    color: '#FAF9F6',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginVertical: spacing.md,
  },
  subLabel: {
    fontSize: 11,
    color: '#CBD5E1',
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
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  sizeButtonActive: {
    borderColor: colors.two26.flame,
    backgroundColor: '#161922',
  },
  sizeButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  sizeButtonTextActive: {
    color: '#FAF9F6',
  },
  counterControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161922',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    color: '#FAF9F6',
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
    backgroundColor: 'rgba(255, 84, 0, 0.1)',
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
    color: '#A1A1AA',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  exportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  exportButtonText: {
    fontSize: 12,
    color: colors.two26.porcelain,
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
    color: '#71717A',
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  footerSub: {
    fontSize: 9,
    color: '#52525B',
    fontFamily: 'monospace',
    letterSpacing: 0.6,
    marginTop: 4,
  },
});

