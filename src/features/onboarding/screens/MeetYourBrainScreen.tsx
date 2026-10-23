/**
 * RotBrain Onboarding Screen 2: Meet Your Brain
 * Introduces the 4 brain milestone states with interactive selection and Two26 Studio styling.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BrainCharacterView } from '../../brain/BrainCharacterView';
import { BrainState, BRAIN_STATE_CONFIGS } from '../../../types/brain';
import { colors } from '../../../theme/colors';
import { spacing, radii } from '../../../theme/spacing';

interface MeetYourBrainScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const STATES_LIST: BrainState[] = ['fresh', 'tired', 'very_tired', 'exhausted'];

export const MeetYourBrainScreen: React.FC<MeetYourBrainScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<BrainState>('fresh');
  const activeConfig = BRAIN_STATE_CONFIGS[activeTab];

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepBadge}>
        <View style={styles.dot} />
        <Text style={styles.stepText}>STEP 02 // 05 — BRAIN TELEMETRY</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic Character Mascot with 3D Interactive Tilt */}
        <View style={styles.mascotContainer}>
          <BrainCharacterView state={activeTab} size={180} />
        </View>

        {/* State Selector Tabs */}
        <View style={styles.tabsRow}>
          {STATES_LIST.map((state) => {
            const isSelected = activeTab === state;
            const conf = BRAIN_STATE_CONFIGS[state];
            return (
              <TouchableOpacity
                key={state}
                style={[
                  styles.tabButton,
                  isSelected && styles.tabButtonSelected,
                ]}
                onPress={() => setActiveTab(state)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isSelected && styles.tabButtonTextSelected,
                  ]}
                >
                  {state === 'very_tired' ? 'V. Tired' : state.charAt(0).toUpperCase() + state.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* State Details Card */}
        <View style={[styles.detailCard, { borderColor: activeConfig.accentColor }]}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.stateSubtitle}>{activeConfig.subtitle}</Text>
              <Text style={[styles.stateTitle, { color: activeConfig.accentColor }]}>
                {activeConfig.displayName}
              </Text>
            </View>
            <View style={[styles.rangeBadge, { backgroundColor: activeConfig.badgeBg, borderColor: activeConfig.accentColor }]}>
              <Text style={[styles.rangeText, { color: activeConfig.accentColor }]}>
                {activeConfig.minCount}
                {activeConfig.maxCount ? `–${activeConfig.maxCount}` : '+'} Reels
              </Text>
            </View>
          </View>

          <Text style={styles.stateDescription}>{activeConfig.description}</Text>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              [NOTE] Character degradation is a biological metaphor for attention fatigue, not clinical diagnostics.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>Next: Select Platforms</Text>
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
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  mascotContainer: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.lg,
    backgroundColor: '#0E1017',
    borderRadius: radii.xl,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 2,
  },
  tabButtonSelected: {
    backgroundColor: '#161922',
    borderColor: colors.two26.flame,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  tabButtonText: {
    fontSize: 12,
    color: '#71717A',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tabButtonTextSelected: {
    color: '#FAF9F6',
    fontWeight: '800',
  },
  detailCard: {
    width: '100%',
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  stateSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#71717A',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  rangeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  stateDescription: {
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radii.md,
    padding: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#3F3F46',
  },
  disclaimerText: {
    fontSize: 11,
    color: '#71717A',
    lineHeight: 16,
    fontFamily: 'monospace',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
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

