/**
 * RotBrain StatMetricCard
 *
 * Boutique Two26 Studio-inspired tactile Bento tile:
 * - Technical monospace micro-metadata
 * - Diagonal studio arrow indicator (↗)
 * - Two26 Light & Dark theme responsive styling
 * - Velvet card chassis with corner rim glow
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { getThemeColors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';

interface StatMetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: string;
  accentColor?: string;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  label,
  value,
  subValue,
  icon,
  accentColor = '#FF5400',
}) => {
  const { preferences } = useRotBrainStore();
  const theme = getThemeColors(preferences.themePreference);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
      {/* Top Header Row with Icon and Two26 Diagonal Arrow */}
      <View style={styles.topRow}>
        <View style={styles.labelGroup}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        </View>
        <Text style={[styles.arrowIcon, { color: theme.textMuted }]}>↗</Text>
      </View>

      {/* Primary Value */}
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>

      {/* Sub-label description */}
      {subValue ? (
        <Text style={[styles.subValue, { color: theme.textMuted }]}>{subValue}</Text>
      ) : null}

      {/* Corner Rim Glow Accent */}
      <View style={[styles.cornerAccent, { backgroundColor: accentColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 13,
    marginRight: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  arrowIcon: {
    fontSize: 12,
    fontWeight: '700',
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  subValue: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  cornerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 2,
    opacity: 0.6,
  },
});

