/**
 * RotBrain Onboarding Screen 2: Understand Your Scrolling
 * Demonstrates the psychological dopamine loop of short videos and how the brain tires.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BrainCharacterView } from '../../brain/BrainCharacterView';
import { BrainState } from '../../../types/brain';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

interface UnderstandScrollingScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export const UnderstandScrollingScreen: React.FC<UnderstandScrollingScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [scrollDemoState, setScrollDemoState] = useState<BrainState>('fresh');
  const [simulatedCount, setSimulatedCount] = useState<number>(10);

  const handleSimulateScroll = () => {
    setSimulatedCount((prev) => {
      const next = prev + 25;
      if (next >= 90) setScrollDemoState('exhausted');
      else if (next >= 60) setScrollDemoState('very_tired');
      else if (next >= 30) setScrollDemoState('tired');
      else setScrollDemoState('fresh');
      return next > 100 ? 10 : next;
    });
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>STEP 2 OF 6 — ATTENTION AWARENESS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dynamic Interactive Brain */}
        <View style={styles.interactiveArea}>
          <BrainCharacterView state={scrollDemoState} size={150} />

          <View style={styles.counterPill}>
            <Text style={styles.counterText}>Simulated Scrolls: {simulatedCount}</Text>
          </View>
        </View>

        {/* Informational Cards */}
        <View style={styles.copyArea}>
          <Text style={styles.heading}>The Rapid Dopamine Loop</Text>
          <Text style={styles.paragraph}>
            Short-form algorithms are engineered for continuous novelty. 15 seconds turns into 45 minutes before you realize it.
          </Text>

          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>Real-Time Visual Feedback</Text>
            <Text style={styles.insightBody}>
              Instead of abstract numbers, RotBrain gives you an evolving brain mascot that reacts directly as your video tally climbs.
            </Text>
          </View>

          {/* Interactive Tap Demo */}
          <TouchableOpacity
            style={styles.demoButton}
            onPress={handleSimulateScroll}
            activeOpacity={0.8}
          >
            <Text style={styles.demoButtonText}>⚡ Tap to simulate 25 more reels</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next: Meet States</Text>
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
    marginBottom: spacing.md,
  },
  stepText: {
    ...typography.badge,
    color: '#64748B',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  interactiveArea: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  counterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginTop: spacing.sm,
  },
  counterText: {
    ...typography.caption,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  copyArea: {
    width: '100%',
    marginTop: spacing.sm,
  },
  heading: {
    ...typography.h2,
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  paragraph: {
    ...typography.bodyMedium,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  insightBox: {
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.lg,
  },
  insightTitle: {
    ...typography.h4,
    color: colors.primaryLight,
    marginBottom: spacing.xs,
  },
  insightBody: {
    ...typography.bodySmall,
    color: '#94A3B8',
    lineHeight: 20,
  },
  demoButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  demoButtonText: {
    ...typography.bodyMedium,
    color: colors.primaryLight,
    fontWeight: '600',
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
