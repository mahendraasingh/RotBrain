/**
 * RotBrain Onboarding Screen 3: Meet Your Brain
 * Introduces the 4 brain milestone states with interactive selection.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BrainCharacterView } from '../../brain/BrainCharacterView';
import { BrainState, BRAIN_STATE_CONFIGS } from '../../../types/brain';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
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
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>STEP 2 OF 5 — THE 4 BRAIN STATES</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic Character Mascot */}
        <View style={styles.mascotContainer}>
          <BrainCharacterView state={activeTab} size={160} />
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
                  isSelected && {
                    backgroundColor: conf.badgeBg,
                    borderColor: conf.accentColor,
                  },
                ]}
                onPress={() => setActiveTab(state)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isSelected && { color: conf.accentColor, fontWeight: '700' },
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
            <Text style={[styles.stateTitle, { color: activeConfig.accentColor }]}>
              {activeConfig.displayName}
            </Text>
            <View style={[styles.rangeBadge, { backgroundColor: activeConfig.badgeBg }]}>
              <Text style={[styles.rangeText, { color: activeConfig.accentColor }]}>
                {activeConfig.minCount}
                {activeConfig.maxCount ? `–${activeConfig.maxCount}` : '+'} Videos
              </Text>
            </View>
          </View>

          <Text style={styles.stateSubtitle}>{activeConfig.subtitle}</Text>
          <Text style={styles.stateDescription}>{activeConfig.description}</Text>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              Note: The brain's appearance is a behavioral milestone reminder to encourage balance, not a clinical or medical measurement.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next: Select Platforms</Text>
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
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  mascotContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.lg,
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 2,
  },
  tabButtonText: {
    ...typography.caption,
    color: '#94A3B8',
    fontWeight: '600',
  },
  detailCard: {
    width: '100%',
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  stateTitle: {
    ...typography.h3,
  },
  rangeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  rangeText: {
    ...typography.badge,
  },
  stateSubtitle: {
    ...typography.bodyMedium,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  stateDescription: {
    ...typography.bodySmall,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#64748B',
  },
  disclaimerText: {
    ...typography.caption,
    color: '#64748B',
    lineHeight: 16,
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
