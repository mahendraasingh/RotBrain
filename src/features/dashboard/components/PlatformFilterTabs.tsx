/**
 * RotBrain PlatformFilterTabs
 * Allows switching between All, Instagram Reels, and YouTube Shorts.
 * Automatically adapts if user has only enabled one platform.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DashboardFilter } from '../../../types/platform';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

interface PlatformFilterTabsProps {
  selectedFilter: DashboardFilter;
  onSelectFilter: (filter: DashboardFilter) => void;
  isInstagramEnabled: boolean;
  isYoutubeEnabled: boolean;
}

export const PlatformFilterTabs: React.FC<PlatformFilterTabsProps> = ({
  selectedFilter,
  onSelectFilter,
  isInstagramEnabled,
  isYoutubeEnabled,
}) => {
  // If only one platform is enabled, only show that option
  const bothEnabled = isInstagramEnabled && isYoutubeEnabled;

  return (
    <View style={styles.container}>
      {bothEnabled && (
        <TouchableOpacity
          style={[
            styles.tab,
            selectedFilter === 'all' && styles.tabActiveCombined,
          ]}
          onPress={() => onSelectFilter('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedFilter === 'all' && styles.tabTextActive,
            ]}
          >
            Combined
          </Text>
        </TouchableOpacity>
      )}

      {isInstagramEnabled && (
        <TouchableOpacity
          style={[
            styles.tab,
            selectedFilter === 'instagram' && styles.tabActiveInstagram,
          ]}
          onPress={() => onSelectFilter('instagram')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedFilter === 'instagram' && styles.tabTextActive,
            ]}
          >
            Instagram Reels
          </Text>
        </TouchableOpacity>
      )}

      {isYoutubeEnabled && (
        <TouchableOpacity
          style={[
            styles.tab,
            selectedFilter === 'youtube' && styles.tabActiveYoutube,
          ]}
          onPress={() => onSelectFilter('youtube')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedFilter === 'youtube' && styles.tabTextActive,
            ]}
          >
            YouTube Shorts
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.xs,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tabActiveCombined: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabActiveInstagram: {
    backgroundColor: 'rgba(225, 48, 108, 0.25)',
    borderWidth: 1,
    borderColor: colors.platforms.instagram,
  },
  tabActiveYoutube: {
    backgroundColor: 'rgba(255, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: colors.platforms.youtube,
  },
  tabText: {
    ...typography.caption,
    color: '#94A3B8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
