/**
 * RotBrain BrainStatusCard
 *
 * Core Dashboard Card showcasing the evolving 3D brain character,
 * current milestone progress bar, and mindful digital wellbeing advice.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrainCharacterView } from './BrainCharacterView';
import { BrainStateManager } from './brainStateManager';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface BrainStatusCardProps {
  totalConfirmedCount: number;
}

export const BrainStatusCard: React.FC<BrainStatusCardProps> = ({
  totalConfirmedCount,
}) => {
  const progress = BrainStateManager.calculateProgress(totalConfirmedCount);
  const { stateInfo, percentageToNextMilestone, nextMilestone, countUntilNextMilestone } =
    progress;

  return (
    <View style={styles.cardContainer}>
      {/* Top Header Badge */}
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: stateInfo.badgeBg }]}>
          <Text style={[styles.badgeText, { color: stateInfo.accentColor }]}>
            {stateInfo.displayName}
          </Text>
        </View>

        <Text style={styles.statusSubtitle}>{stateInfo.subtitle}</Text>
      </View>

      {/* Main Mascot Display */}
      <View style={styles.mascotRow}>
        <BrainCharacterView state={progress.currentState} size={150} />
      </View>

      {/* Live Counter & Progress */}
      <View style={styles.counterSection}>
        <View style={styles.countRow}>
          <Text style={[styles.countNumber, { color: stateInfo.accentColor }]}>
            {totalConfirmedCount}
          </Text>
          <Text style={styles.countLabel}>Shorts & Reels</Text>
        </View>

        {/* Milestone Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${percentageToNextMilestone}%`,
                  backgroundColor: stateInfo.accentColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Next Milestone Text */}
        <View style={styles.milestoneFooter}>
          {nextMilestone !== null ? (
            <Text style={styles.milestoneText}>
              <Text style={{ color: stateInfo.accentColor, fontWeight: '700' }}>
                {countUntilNextMilestone}
              </Text>{' '}
              videos until next fatigue transition ({nextMilestone})
            </Text>
          ) : (
            <Text style={[styles.milestoneText, { color: colors.exhausted.light }]}>
              Daily limit surpassed — time to give your eyes & mind a rest.
            </Text>
          )}
        </View>
      </View>

      {/* Mindful Advice Callout */}
      <View style={styles.adviceBox}>
        <Text style={styles.adviceText}>{stateInfo.motivationalAdvice}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
    marginVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeText: {
    ...typography.badge,
  },
  statusSubtitle: {
    ...typography.caption,
    color: '#94A3B8',
  },
  mascotRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  counterSection: {
    marginTop: spacing.sm,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  countNumber: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginRight: spacing.sm,
  },
  countLabel: {
    ...typography.bodyMedium,
    color: '#94A3B8',
    fontWeight: '500',
  },
  progressBarWrapper: {
    marginVertical: spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radii.full,
  },
  milestoneFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  milestoneText: {
    ...typography.caption,
    color: '#94A3B8',
    textAlign: 'center',
  },
  adviceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  adviceText: {
    ...typography.bodySmall,
    color: '#E2E8F0',
    lineHeight: 18,
  },
});
