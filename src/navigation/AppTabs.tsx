/**
 * RotBrain Bottom Tab Navigator
 * Premium dark theme bottom bar with Dashboard, Analytics, and Settings tabs,
 * with FloatingMobileCounter pinned to bottom-right for automatic live tracking.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainDashboardScreen } from '../features/dashboard/MainDashboardScreen';
import { AnalyticsScreen } from '../features/analytics/AnalyticsScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { FloatingMobileCounter } from '../features/dashboard/components/FloatingMobileCounter';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const Tab = createBottomTabNavigator();

export const AppTabs: React.FC = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#64748B',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={MainDashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <Text style={[styles.tabIcon, { color, opacity: focused ? 1 : 0.65 }]}>
                🧠
              </Text>
            ),
          }}
        />

        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <Text style={[styles.tabIcon, { color, opacity: focused ? 1 : 0.65 }]}>
                📊
              </Text>
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <Text style={[styles.tabIcon, { color, opacity: focused ? 1 : 0.65 }]}>
                ⚙️
              </Text>
            ),
          }}
        />
      </Tab.Navigator>

      {/* Floating mobile device counter at bottom right */}
      <FloatingMobileCounter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
  tabBar: {
    backgroundColor: '#0F1017',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
  },
});
