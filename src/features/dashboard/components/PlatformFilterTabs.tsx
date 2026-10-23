/**
 * RotBrain PlatformFilterTabs
 *
 * Boutique Two26 Studio-inspired tactile pill switcher.
 * Allows instant, spring-animated filtering between All, Instagram Reels, and YouTube Shorts.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DashboardFilter } from '../../../types/platform';
import { colors } from '../../../theme/colors';
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
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
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
              selectedFilter === 'instagram' && { color: colors.platforms.instagram, fontWeight: '800' },
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
              selectedFilter === 'youtube' && { color: colors.platforms.youtube, fontWeight: '800' },
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
    backgroundColor: '#0E1017',
    borderRadius: radii.full,
    padding: 4,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  tabActiveInstagram: {
    backgroundColor: 'rgba(225, 48, 108, 0.16)',
    borderWidth: 1,
    borderColor: colors.platforms.instagram,
  },
  tabActiveYoutube: {
    backgroundColor: 'rgba(255, 0, 0, 0.16)',
    borderWidth: 1,
    borderColor: colors.platforms.youtube,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717A',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: '#FAF9F6',
    fontWeight: '800',
  },
});
