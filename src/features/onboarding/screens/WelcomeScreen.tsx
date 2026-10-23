/**
 * RotBrain Onboarding Screen 1: Welcome to RotBrain
 *
 * Boutique Two26 Studio-inspired entrance featuring:
 * - Dual-layer magnetic typography with flame shadow offset
 * - 3D responsive fresh brain mascot
 * - Editorial subtext
 * - High-craft flame primary button with diagonal arrow (↗)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BrainCharacterView } from '../../brain/BrainCharacterView';
import { colors } from '../../../theme/colors';
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
        <Text style={styles.brandText}>ROTBRAIN // ATTENTION INTELLIGENCE</Text>
      </View>

      {/* Hero Character with 3D Interactive Tilt */}
      <View style={styles.characterContainer}>
        <BrainCharacterView state="fresh" size={200} />
      </View>

      {/* Main Copy with Dual Magnetic Heading */}
      <View style={styles.contentContainer}>
        <View style={styles.dualHeadingWrap}>
          <Text style={styles.dualTitleShadow}>Reclaim Your Focus</Text>
          <Text style={styles.dualTitleMain}>Reclaim Your Focus</Text>
        </View>

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
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#0E1017',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
  brandText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
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
  dualHeadingWrap: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  dualTitleShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 28,
    fontWeight: '900',
    color: colors.two26.flame,
    opacity: 0.4,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  dualTitleMain: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FAF9F6',
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.two26.flame,
    paddingVertical: spacing.lg,
    borderRadius: radii.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    color: '#FAF9F6',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonArrow: {
    fontSize: 16,
    color: '#FAF9F6',
    fontWeight: '800',
    marginLeft: 8,
  },
});
