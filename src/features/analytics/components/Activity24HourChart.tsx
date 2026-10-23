/**
 * RotBrain Activity24HourChart
 *
 * Visual distribution of short-video scrolling across 24 hours (00:00 to 23:00).
 * Strictly adheres to 24-hour time labels with zero AM/PM and zero fake data.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

interface Activity24HourChartProps {
  hourlyCounts?: number[]; // Array of 24 numbers (indices 0..23)
}

export const Activity24HourChart: React.FC<Activity24HourChartProps> = ({
  hourlyCounts,
}) => {
  const labels24 = DateTimeFormatter.get24HourLabels();

  // Initialize strictly with real data or 0s (no fake data)
  const counts =
    hourlyCounts && hourlyCounts.length === 24
      ? hourlyCounts
      : new Array(24).fill(0);

  const maxVal = Math.max(1, ...counts);
  const totalInChart = counts.reduce((acc, v) => acc + v, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>24-Hour Activity Distribution</Text>
        <Text style={styles.subtitle}>Hour-by-hour timeline</Text>
      </View>

      {totalInChart === 0 && (
        <View style={styles.noDataBanner}>
          <Text style={styles.noDataText}>0 videos recorded across all 24 hours</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScroll}
      >
        {labels24.map((hourLabel, index) => {
          const val = counts[index];
          const heightPercent = val > 0 ? Math.min(100, Math.round((val / maxVal) * 100)) : 0;

          return (
            <View key={hourLabel} style={styles.barColumn}>
              {/* Bar Value Tooltip if active */}
              <Text style={styles.barValue}>{val > 0 ? val : ''}</Text>

              {/* Bar Track */}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor:
                        val >= 15
                          ? colors.exhausted.light
                          : val >= 8
                          ? colors.tired.light
                          : colors.primaryLight,
                    },
                  ]}
                />
              </View>

              {/* 24-Hour Label */}
              <Text style={styles.hourLabel}>{hourLabel.substring(0, 2)}h</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Axis Marker Summary */}
      <View style={styles.axisSummaryRow}>
        <Text style={styles.axisMarker}>00:00 (Night)</Text>
        <Text style={styles.axisMarker}>12:00 (Noon)</Text>
        <Text style={styles.axisMarker}>23:59 (End)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#13151F',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h4,
    color: '#F8FAFC',
    marginBottom: 2,
  },
  subtitle: {
    ...typography.caption,
    color: '#64748B',
  },
  noDataBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radii.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  noDataText: {
    ...typography.caption,
    color: '#64748B',
    fontSize: 11,
  },
  chartScroll: {
    paddingVertical: spacing.sm,
    alignItems: 'flex-end',
  },
  barColumn: {
    width: 28,
    alignItems: 'center',
    marginRight: 4,
  },
  barValue: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '700',
    height: 14,
    marginBottom: 2,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  hourLabel: {
    ...typography.caption,
    fontSize: 9,
    color: '#64748B',
    marginTop: 6,
    fontFamily: 'monospace',
  },
  axisSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: spacing.xs,
    marginTop: spacing.sm,
  },
  axisMarker: {
    ...typography.caption,
    fontSize: 10,
    color: '#475569',
    fontFamily: 'monospace',
  },
});
