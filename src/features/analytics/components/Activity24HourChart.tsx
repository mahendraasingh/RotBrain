/**
 * RotBrain Activity24HourChart
 *
 * Visual distribution of short-video scrolling across 24 hours (00:00 to 23:00).
 * Strictly adheres to 24-hour time labels with zero AM/PM and zero fake data with Two26 Studio styling.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors } from '../../../theme/colors';
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
        <View style={styles.titleWrap}>
          <Text style={styles.title}>CHRONO DISTRIBUTION</Text>
          <Text style={styles.subtitle}>24-HOUR BEHAVIORAL SPECTRUM</Text>
        </View>
        <Text style={styles.arrowIcon}>↗</Text>
      </View>

      {totalInChart === 0 && (
        <View style={styles.noDataBanner}>
          <Text style={styles.noDataText}>[0 VIDEOS RECORDED ACROSS 24-HOUR SPECTRUM]</Text>
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
                          ? colors.two26.flame
                          : val >= 8
                          ? colors.two26.blush
                          : colors.two26.porcelain,
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
        <Text style={styles.axisMarker}>00:00 [NIGHT]</Text>
        <Text style={styles.axisMarker}>12:00 [NOON]</Text>
        <Text style={styles.axisMarker}>23:59 [END]</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E1017',
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FAF9F6',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 12,
    color: '#71717A',
  },
  noDataBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radii.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  noDataText: {
    color: '#71717A',
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 0.8,
    fontWeight: '700',
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
    color: colors.two26.porcelain,
    fontWeight: '800',
    fontFamily: 'monospace',
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
    fontSize: 9,
    color: '#71717A',
    marginTop: 6,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  axisSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingTop: spacing.xs,
    marginTop: spacing.sm,
  },
  axisMarker: {
    fontSize: 9,
    color: '#52525B',
    fontFamily: 'monospace',
    fontWeight: '800',
  },
});

