/**
 * RotBrain OnboardingFlow Coordinator
 * Coordinates sequential navigation through the 5 genuine onboarding screens:
 * Step 1: Welcome
 * Step 2: Meet Your Brain (The 4 Brain States)
 * Step 3: Choose Platforms (Instagram & YouTube)
 * Step 4: System Permissions (Genuine OS Permission Flow)
 * Step 5: Ready to Begin (Setup Complete)
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { MeetYourBrainScreen } from './screens/MeetYourBrainScreen';
import { ChoosePlatformsScreen } from './screens/ChoosePlatformsScreen';
import { EnablePermissionsScreen } from './screens/EnablePermissionsScreen';
import { ReadyToBeginScreen } from './screens/ReadyToBeginScreen';

interface OnboardingFlowProps {
  onFinishOnboarding: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onFinishOnboarding }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <View style={styles.container}>
      {currentStep === 1 && <WelcomeScreen onNext={handleNext} />}
      {currentStep === 2 && (
        <MeetYourBrainScreen onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 3 && (
        <ChoosePlatformsScreen onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 4 && (
        <EnablePermissionsScreen onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 5 && (
        <ReadyToBeginScreen onComplete={onFinishOnboarding} onBack={handleBack} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
  },
});
