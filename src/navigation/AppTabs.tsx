/**
 * RotBrain Bottom Tab Navigator
 * Boutique Two26 Studio-inspired bottom bar with Dashboard, Analytics, and Settings tabs,
 * and FloatingMobileCounter pinned to bottom-right for live feed tracking.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainDashboardScreen } from '../features/dashboard/MainDashboardScreen';
import { AnalyticsScreen } from '../features/analytics/AnalyticsScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { FloatingMobileCounter } from '../features/dashboard/components/FloatingMobileCounter';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const Tab = createBottomTabNavigator();

export const AppTabs: React.FC = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.two26.flame,
          tabBarInactiveTintColor: '#52525B',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={MainDashboardScreen}
          options={{
            tabBarLabel: 'STUDIO',
            tabBarIcon: ({ color, focused }) => (
              <Text style={[styles.tabIcon, { color, opacity: focused ? 1 : 0.55 }]}>
                🧠
              </Text>
            ),
          }}
        />

        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{
            tabBarLabel: 'TRENDS',
            tabBarIcon: ({ color, focused }) => (
              <Text style={[styles.tabIcon, { color, opacity: focused ? 1 : 0.55 }]}>
                📊
              </Text>
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'PREFS',
            tabBarIcon: ({ color, focused }) => (
              <Text style={[styles.tabIcon, { color, opacity: focused ? 1 : 0.55 }]}>
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
    backgroundColor: '#07080B',
  },
  tabBar: {
    backgroundColor: '#080A0E',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    height: 66,
    paddingBottom: spacing.sm,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  tabIcon: {
    fontSize: 18,
  },
});
