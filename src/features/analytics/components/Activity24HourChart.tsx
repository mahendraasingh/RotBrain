/**
 * RotBrain Activity24HourChart
 *
 * Visual distribution of short-video scrolling across 24 hours (00:00 to 23:00).
 * Strictly adheres to 24-hour time labels with zero AM/PM and zero fake data with Two26 Studio styling.
 * Supports dynamic Two26 Light / Dark themes.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors, getThemeColors } from '../../../theme/colors';
import { spacing, radii } from '../../../theme/spacing';
import { useRotBrainStore } from '../../../store/useRotBrainStore';

interface Activity24HourChartProps {
  hourlyCounts?: number[]; // Array of 24 numbers (indices 0..23)
}

export const Activity24HourChart: React.FC<Activity24HourChartProps> = ({
  hourlyCounts,
}) => {
  const { preferences } = useRotBrainStore();
  const themeColors = getThemeColors(preferences.themePreference);
  const labels24 = DateTimeFormatter.get24HourLabels();

  // Initialize strictly with real data or 0s (no fake data)
  const counts =
    hourlyCounts && hourlyCounts.length === 24
      ? hourlyCounts
      : new Array(24).fill(0);

  const maxVal = Math.max(1, ...counts);
  const totalInChart = counts.reduce((acc, v) => acc + v, 0);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.surfaceBorder,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            CHRONO DISTRIBUTION
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>
            24-HOUR BEHAVIORAL SPECTRUM
          </Text>
        </View>
        <Text style={[styles.arrowIcon, { color: themeColors.textMuted }]}>↗</Text>
      </View>

      {totalInChart === 0 && (
        <View
          style={[
            styles.noDataBanner,
            {
              backgroundColor: themeColors.surface2,
              borderColor: themeColors.surfaceBorder,
            },
          ]}
        >
          <Text style={[styles.noDataText, { color: themeColors.textMuted }]}>
            [0 VIDEOS RECORDED ACROSS 24-HOUR SPECTRUM]
          </Text>
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
              <Text style={[styles.barValue, { color: themeColors.textSecondary }]}>
                {val > 0 ? val : ''}
              </Text>

              {/* Bar Track */}
              <View
                style={[
                  styles.barTrack,
                  {
                    backgroundColor: themeColors.surface2,
                  },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor:
                        val >= 15
                          ? colors.two26.flame
                          : val >= 8
                          ? colors.two26.flameGlow
                          : colors.two26.primary20,
                    },
                  ]}
                />
              </View>

              {/* 24-Hour Label */}
              <Text style={[styles.hourLabel, { color: themeColors.textMuted }]}>
                {hourLabel.substring(0, 2)}h
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Axis Marker Summary */}
      <View style={[styles.axisSummaryRow, { borderTopColor: themeColors.divider }]}>
        <Text style={[styles.axisMarker, { color: themeColors.textMuted }]}>00:00 [NIGHT]</Text>
        <Text style={[styles.axisMarker, { color: themeColors.textMuted }]}>12:00 [NOON]</Text>
        <Text style={[styles.axisMarker, { color: themeColors.textMuted }]}>23:59 [END]</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xxl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderWidth: 1,
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
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 12,
  },
  noDataBanner: {
    borderRadius: radii.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
  },
  noDataText: {
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
    fontWeight: '800',
    fontFamily: 'monospace',
    height: 14,
    marginBottom: 2,
  },
  barTrack: {
    width: 14,
    height: 90,
    borderRadius: radii.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: radii.sm,
  },
  hourLabel: {
    fontSize: 9,
    fontFamily: 'monospace',
    marginTop: 6,
    fontWeight: '700',
  },
  axisSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    marginTop: spacing.xs,
  },
  axisMarker: {
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
});
