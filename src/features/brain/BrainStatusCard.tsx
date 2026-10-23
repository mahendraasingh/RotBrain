/**
 * RotBrain BrainStatusCard
 *
 * Boutique Two26 Studio-inspired flagship status card featuring:
 * - Real Three.js WebGL 3D neural core with particle cloud and scroll-driven rotation
 * - Interactive mode toggle between 3D WebGL Experience and 2D Mascot View
 * - Dual-layer magnetic typography with flame shadow offset
 * - Strict Light Theme (#F8EEE8 / #FFFFFF) and Dark Theme (#161413 / #211E1D) support
 * - Zero harsh green text or muddy backgrounds
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrainCharacterView } from './BrainCharacterView';
import { ThreeDBrainScene } from './ThreeDBrainScene';
import { BrainStateManager } from './brainStateManager';
import { useRotBrainStore } from '../../store/useRotBrainStore';
import { colors, getThemeColors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

interface BrainStatusCardProps {
  totalConfirmedCount: number;
}

export const BrainStatusCard: React.FC<BrainStatusCardProps> = ({
  totalConfirmedCount,
}) => {
  const { preferences } = useRotBrainStore();
  const theme = getThemeColors(preferences.themePreference);
  const [viewMode, setViewMode] = useState<'3d' | 'mascot'>('3d');

  const progress = BrainStateManager.calculateProgress(totalConfirmedCount);
  const { stateInfo, percentageToNextMilestone, nextMilestone, countUntilNextMilestone } =
    progress;

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
      {/* Top Editorial Studio Header */}
      <View style={styles.topMetadataRow}>
        <View style={[styles.studioTag, { backgroundColor: theme.surface2, borderColor: theme.surfaceBorder }]}>
          <View style={styles.studioDot} />
          <Text style={[styles.studioTagText, { color: theme.textSecondary }]}>
            ROTBRAIN // ATTENTION SENSOR
          </Text>
        </View>

        {/* 3D vs Mascot Switcher */}
        <View style={styles.viewModeRow}>
          <TouchableOpacity
            style={[
              styles.modeTab,
              viewMode === '3d' && styles.modeTabActive,
            ]}
            onPress={() => setViewMode('3d')}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeTabText, viewMode === '3d' && styles.modeTabTextActive]}>
              3D SCENE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTab,
              viewMode === 'mascot' && styles.modeTabActive,
            ]}
            onPress={() => setViewMode('mascot')}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeTabText, viewMode === 'mascot' && styles.modeTabTextActive]}>
              MASCOT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Two26 Dual Magnetic Heading Layer */}
      <View style={styles.headingWrapper}>
        <Text style={[styles.dualHeadingShadow, { color: colors.two26.flame }]}>
          {stateInfo.displayName}
        </Text>
        <Text style={[styles.dualHeadingMain, { color: theme.textPrimary }]}>
          {stateInfo.displayName}
        </Text>
      </View>

      <Text style={[styles.statusSubtitle, { color: theme.textMuted }]}>{stateInfo.subtitle}</Text>

      {/* 3D Interactive Mascot / Three.js Arena */}
      <View style={styles.mascotArena}>
        {viewMode === '3d' ? (
          <ThreeDBrainScene state={progress.currentState} size={200} interactive={true} />
        ) : (
          <BrainCharacterView state={progress.currentState} size={156} />
        )}
      </View>

      {/* Big Editorial Metric Section */}
      <View style={[styles.metricSection, { backgroundColor: theme.surface2, borderColor: theme.surfaceBorder }]}>
        <View style={styles.countRow}>
          <Text style={[styles.bigCountNumber, { color: theme.textPrimary }]}>
            {totalConfirmedCount}
          </Text>
          <View style={styles.countLabelCol}>
            <Text style={styles.countUnitText}>CONFIRMED</Text>
            <Text style={[styles.countSubUnit, { color: theme.textMuted }]}>SHORTS & REELS</Text>
          </View>
        </View>

        {/* Two26 High-Craft Progress Track */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>DOPAMINE FATIGUE SPECTRUM</Text>
            <Text style={[styles.progressPercent, { color: colors.two26.flame }]}>
              {percentageToNextMilestone}%
            </Text>
          </View>

          <View style={[styles.progressBarBackground, { backgroundColor: preferences.themePreference === 'light' ? '#EAE0DA' : 'rgba(255, 255, 255, 0.08)' }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.max(3, percentageToNextMilestone)}%`,
                  backgroundColor: colors.two26.flame,
                  shadowColor: colors.two26.flame,
                },
              ]}
            >
              <View
                style={[
                  styles.progressBarGlowTip,
                  { backgroundColor: colors.two26.primary60 },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Milestone Footer */}
        <View style={styles.milestoneFooter}>
          {nextMilestone !== null ? (
            <Text style={[styles.milestoneText, { color: theme.textSecondary }]}>
              <Text style={{ color: colors.two26.flame, fontWeight: '800' }}>
                {countUntilNextMilestone} videos
              </Text>{' '}
              remaining until milestone{' '}
              <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>
                Level {nextMilestone}
              </Text>
            </Text>
          ) : (
            <Text style={[styles.milestoneText, { color: colors.two26.flame }]}>
              Daily threshold exceeded • Time to step away from feeds and restore attention.
            </Text>
          )}
        </View>
      </View>

      {/* Two26 Editorial Insight Callout */}
      <View style={[styles.editorialAdviceBox, { backgroundColor: preferences.themePreference === 'light' ? '#FFF5EE' : 'rgba(255, 84, 0, 0.08)', borderColor: 'rgba(255, 84, 0, 0.25)' }]}>
        <View style={styles.quotePill}>
          <Text style={styles.quotePillText}>EDITORIAL REFLECTION</Text>
        </View>
        <Text style={[styles.adviceQuote, { color: theme.textPrimary }]}>"{stateInfo.motivationalAdvice}"</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
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
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  viewModeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 84, 0, 0.08)',
    borderRadius: radii.full,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 84, 0, 0.2)',
  },
  modeTab: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  modeTabActive: {
    backgroundColor: colors.two26.flame,
  },
  modeTabText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.two26.flame,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
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
    opacity: 0.35,
  },
  dualHeadingMain: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  statusSubtitle: {
    fontSize: 12,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  mascotArena: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    minHeight: 200,
  },
  metricSection: {
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
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
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radii.full,
    position: 'relative',
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
    fontSize: 11,
    lineHeight: 16,
  },
  editorialAdviceBox: {
    borderRadius: radii.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
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
    lineHeight: 18,
    fontStyle: 'italic',
  },
});

