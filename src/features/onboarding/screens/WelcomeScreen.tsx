/**
 * RotBrain Onboarding Screen 1: Welcome to RotBrain
 * Visually striking introduction with animated fresh brain character and glowing aura.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrainCharacterView } from '../../brain/BrainCharacterView';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      {/* Top Brand Tag */}
      <View style={styles.brandRow}>
        <View style={styles.dot} />
        <Text style={styles.brandText}>ROTBRAIN DIGITAL WELLBEING</Text>
      </View>

      {/* Hero Character */}
      <View style={styles.characterContainer}>
        <BrainCharacterView state="fresh" size={200} />
      </View>

      {/* Main Copy */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Reclaim Your Focus from Endless Feeds
        </Text>
        <Text style={styles.subtitle}>
          RotBrain brings visibility to your Instagram Reels and YouTube Shorts habits through an evolving brain character that responds to your scrolling.
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Begin Setup</Text>
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
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.fresh.base,
    marginRight: spacing.sm,
  },
  brandText: {
    ...typography.badge,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.h1,
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    ...typography.h4,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
