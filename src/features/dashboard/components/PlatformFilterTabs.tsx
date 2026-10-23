/**
 * RotBrain PlatformFilterTabs
 *
 * Boutique Two26 Studio-inspired tactile pill switcher.
 * Allows instant, spring-animated filtering between All, Instagram Reels, and YouTube Shorts.
 * Supports Two26 Light & Dark themes.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DashboardFilter } from '../../../types/platform';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { colors, getThemeColors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/spacing';

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
  const { preferences } = useRotBrainStore();
  const theme = getThemeColors(preferences.themePreference);
  const bothEnabled = isInstagramEnabled && isYoutubeEnabled;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
      {bothEnabled && (
        <TouchableOpacity
          style={[
            styles.tab,
            selectedFilter === 'all' && styles.tabActiveCombined,
          ]}
          onPress={() => onSelectFilter('all')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedFilter === 'all' ? '#FFFFFF' : theme.textSecondary },
              selectedFilter === 'all' && styles.tabTextActive,
            ]}
          >
            COMBINED
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
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              selectedFilter === 'instagram'
                ? { color: colors.platforms.instagram, fontWeight: '800' }
                : { color: theme.textSecondary },
            ]}
          >
            📷 REELS
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
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              selectedFilter === 'youtube'
                ? { color: colors.platforms.youtube, fontWeight: '800' }
                : { color: theme.textSecondary },
            ]}
          >
            ▶️ SHORTS
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 4,
    marginVertical: spacing.md,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  tabActiveCombined: {
    backgroundColor: colors.two26.flame,
    shadowColor: colors.two26.flame,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  tabActiveInstagram: {
    backgroundColor: 'rgba(225, 48, 108, 0.12)',
    borderWidth: 1,
    borderColor: colors.platforms.instagram,
  },
  tabActiveYoutube: {
    backgroundColor: 'rgba(255, 0, 0, 0.12)',
    borderWidth: 1,
    borderColor: colors.platforms.youtube,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  tabTextActive: {
    fontWeight: '800',
  },
});

