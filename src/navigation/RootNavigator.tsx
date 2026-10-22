/**
 * RotBrain Root Navigator
 * Switches between OnboardingFlow and Main App Tabs.
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useRotBrainStore } from '../store/useRotBrainStore';
import { OnboardingFlow } from '../features/onboarding/OnboardingFlow';
import { AppTabs } from './AppTabs';
import { colors } from '../theme/colors';

export const RootNavigator: React.FC = () => {
  const { preferences, initialize } = useRotBrainStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initialize();
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, [initialize]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {preferences.hasCompletedOnboarding ? (
        <AppTabs />
      ) : (
        <OnboardingFlow
          onFinishOnboarding={() => {
            // State automatically transitions via Zustand store update
          }}
        />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0C10',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
