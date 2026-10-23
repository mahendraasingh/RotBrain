/**
 * RotBrain BrainStatusCard
 *
 * Boutique Two26 Studio-inspired flagship status card featuring:
 * - Dual-layer magnetic typography with flame shadow offset
 * - 3D character viewing arena with reactive physics
 * - Technical monospace metadata stickers [PHASE • 01] [INDEX: LIVE]
 * - High-contrast progress gauge with flame glow tip
 * - Editorial wellbeing reflection
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
      {/* Top Editorial Studio Header */}
      <View style={styles.topMetadataRow}>
        <View style={styles.studioTag}>
          <View style={styles.studioDot} />
          <Text style={styles.studioTagText}>ROTBRAIN LABS — SENSING 01</Text>
        </View>

        <View style={styles.stateSticker}>
          <Text style={[styles.stateStickerText, { color: stateInfo.accentColor }]}>
            [{stateInfo.displayName.toUpperCase()}]
          </Text>
        </View>
      </View>

      {/* Two26 Dual Magnetic Heading Layer */}
      <View style={styles.headingWrapper}>
        <Text style={[styles.dualHeadingShadow, { color: colors.two26.flame }]}>
          {stateInfo.displayName}
        </Text>
        <Text style={styles.dualHeadingMain}>
          {stateInfo.displayName}
        </Text>
      </View>

      <Text style={styles.statusSubtitle}>{stateInfo.subtitle}</Text>

      {/* 3D Interactive Mascot Arena */}
      <View style={styles.mascotArena}>
        <BrainCharacterView state={progress.currentState} size={156} />
      </View>

      {/* Big Editorial Metric Section */}
      <View style={styles.metricSection}>
        <View style={styles.countRow}>
          <Text style={[styles.bigCountNumber, { color: '#FAF9F6' }]}>
            {totalConfirmedCount}
          </Text>
          <View style={styles.countLabelCol}>
            <Text style={styles.countUnitText}>CONFIRMED</Text>
            <Text style={styles.countSubUnit}>SHORTS & REELS</Text>
          </View>
        </View>

        {/* Two26 High-Craft Progress Track */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>DOPAMINE FATIGUE METER</Text>
            <Text style={[styles.progressPercent, { color: stateInfo.accentColor }]}>
              {percentageToNextMilestone}%
            </Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.max(2, percentageToNextMilestone)}%`,
                  backgroundColor: stateInfo.accentColor,
                  shadowColor: stateInfo.accentColor,
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarGlowTip,
                  { backgroundColor: colors.two26.flame },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Milestone Footer */}
        <View style={styles.milestoneFooter}>
          {nextMilestone !== null ? (
            <Text style={styles.milestoneText}>
              <Text style={{ color: colors.two26.flame, fontWeight: '800' }}>
                {countUntilNextMilestone} videos
              </Text>{' '}
              remaining until transition to{' '}
              <Text style={{ color: '#FAF9F6', fontWeight: '700' }}>
                Level {nextMilestone}
              </Text>
            </Text>
          ) : (
            <Text style={[styles.milestoneText, { color: colors.exhausted.light }]}>
              ⚡ Daily threshold exceeded • Time to close feeds and restore focus.
            </Text>
          )}
        </View>
      </View>

      {/* Two26 Editorial Insight Callout */}
      <View style={styles.editorialAdviceBox}>
        <View style={styles.quotePill}>
          <Text style={styles.quotePillText}>EDITORIAL REFLECTION</Text>
        </View>
        <Text style={styles.adviceQuote}>"{stateInfo.motivationalAdvice}"</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0E1017',
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 8,
    marginVertical: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  topMetadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  studioTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  studioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.two26.flame,
    marginRight: 6,
  },
  studioTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  stateSticker: {
    backgroundColor: 'rgba(255, 84, 0, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 0, 0.25)',
  },
  stateStickerText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  headingWrapper: {
    position: 'relative',
    marginTop: 4,
    marginBottom: 2,
  },
  dualHeadingShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
    opacity: 0.45,
  },
  dualHeadingMain: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FAF9F6',
    letterSpacing: -0.8,
  },
  statusSubtitle: {
    ...typography.caption,
    color: '#71717A',
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  mascotArena: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  metricSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bigCountNumber: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    fontFamily: 'monospace',
    marginRight: spacing.md,
  },
  countLabelCol: {
    justifyContent: 'center',
  },
  countUnitText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.two26.flame,
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  countSubUnit: {
    fontSize: 10,
    color: '#71717A',
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  progressContainer: {
    marginVertical: spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.6,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  progressBarBackground: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radii.full,
    position: 'relative',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  progressBarGlowTip: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderRadius: 3,
  },
  milestoneFooter: {
    marginTop: spacing.xs,
  },
  milestoneText: {
    ...typography.caption,
    color: '#A1A1AA',
    fontSize: 11,
  },
  editorialAdviceBox: {
    backgroundColor: 'rgba(255, 84, 0, 0.05)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 0, 0.18)',
    position: 'relative',
  },
  quotePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 84, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  quotePillText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.two26.flame,
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  adviceQuote: {
    fontSize: 12,
    color: '#FAF9F6',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
