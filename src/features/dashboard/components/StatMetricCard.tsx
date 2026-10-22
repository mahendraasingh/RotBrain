/**
 * RotBrain StatMetricCard
 * Card for presenting metrics: confirmed count, duration, session count, etc.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

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
  accentColor = '#8B5CF6',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>

      {subValue ? (
        <Text style={styles.subValue}>{subValue}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  icon: {
    fontSize: 16,
  },
  value: {
    ...typography.h3,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subValue: {
    ...typography.caption,
    color: '#64748B',
    marginTop: 2,
  },
});
