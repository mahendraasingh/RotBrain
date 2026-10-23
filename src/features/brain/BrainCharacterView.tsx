/**
 * RotBrain BrainCharacterView
 *
 * Renders the dimensional 3D brain mascot with dynamic glow aura,
 * smooth floating micro-animation, and milestone expression transitions.
 */

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, Text } from 'react-native';
import { BrainState } from '../../types/brain';
import { colors } from '../../theme/colors';

interface BrainCharacterViewProps {
  state: BrainState;
  size?: number;
  showAura?: boolean;
}

import brainFresh from '../../../assets/images/brain_fresh.jpg';
import brainTired from '../../../assets/images/brain_tired.jpg';
import brainVeryTired from '../../../assets/images/brain_very_tired.jpg';
import brainExhausted from '../../../assets/images/brain_exhausted.jpg';

// Statically map assets so bundler packages them properly
const BRAIN_IMAGES: Record<BrainState, any> = {
  fresh: brainFresh,
  tired: brainTired,
  very_tired: brainVeryTired,
  exhausted: brainExhausted,
};

export const BrainCharacterView: React.FC<BrainCharacterViewProps> = ({
  state,
  size = 180,
  showAura = true,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle floating breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle scale pulsing for active vitality
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, pulseAnim]);

  const getStateGlowColor = () => {
    switch (state) {
      case 'fresh':
        return colors.fresh.glow;
      case 'tired':
        return colors.tired.glow;
      case 'very_tired':
        return colors.veryTired.glow;
      case 'exhausted':
        return colors.exhausted.glow;
    }
  };

  const rawImage = BRAIN_IMAGES[state] || BRAIN_IMAGES.fresh;
  const currentImage = typeof rawImage === 'string' ? { uri: rawImage } : rawImage;

  return (
    <View style={[styles.container, { width: size + 40, height: size + 40 }]}>
      {/* Background Dimensional Aura */}
      {showAura && (
        <View
          style={[
            styles.aura,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              backgroundColor: getStateGlowColor(),
            },
          ]}
        />
      )}

      {/* Floating Mascot Character */}
      <Animated.View
        style={[
          styles.mascotWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [
              { translateY: floatAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <Image
          source={currentImage}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  aura: {
    position: 'absolute',
    opacity: 0.65,
    filter: 'blur(20px)',
  },
  mascotWrapper: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
    backgroundColor: '#0F111A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
