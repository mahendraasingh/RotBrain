/**
 * RotBrain BrainCharacterView
 *
 * Boutique Two26 Studio 3D Interactive Mascot
 * Features:
 * - Real-time 3D perspective tilt reacting to pointer/touch gestures
 * - Smooth breathing vertical elevation with synchronized dynamic drop shadow
 * - Dual ambient halo lighting (State Glow + Two26 Flame studio edge)
 * - Ultra-crisp glassmorphic perimeter frame with subtle rim light
 */

import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Easing, PanResponder, ImageStyle } from 'react-native';
import { BrainState } from '../../types/brain';
import { colors } from '../../theme/colors';

interface BrainCharacterViewProps {
  state: BrainState;
  size?: number;
  showAura?: boolean;
}

import brainFresh from '../../../assets/images/freshBrain.png';
import brainTired from '../../../assets/images/brain_tired.jpg';
import brainVeryTired from '../../../assets/images/brain_very_tired.jpg';
import brainExhausted from '../../../assets/images/brain_exhausted.jpg';

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
  const shadowScale = useRef(new Animated.Value(1)).current;

  // 3D Tilt interactive physics
  const tiltX = useRef(new Animated.Value(0)).current;
  const tiltY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Breathing elevation loop with synchronized shadow scaling
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: -12,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(shadowScale, {
            toValue: 0.85,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(shadowScale, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    floatLoop.start();

    // Scale pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [floatAnim, pulseAnim, shadowScale]);

  // Touch / pointer gesture handler for 3D tilt
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Clamp and map dx/dy to rotation angles (-18 deg to 18 deg)
        const maxTilt = 18;
        const normX = Math.max(-1, Math.min(1, gestureState.dx / 100));
        const normY = Math.max(-1, Math.min(1, gestureState.dy / 100));

        Animated.spring(tiltY, {
          toValue: normX * maxTilt,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }).start();

        Animated.spring(tiltX, {
          toValue: -normY * maxTilt,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: () => {
        // Spring back with elastic settling
        Animated.spring(tiltX, {
          toValue: 0,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }).start();
        Animated.spring(tiltY, {
          toValue: 0,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

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

  const rotXInterpolate = tiltX.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });

  const rotYInterpolate = tiltY.interpolate({
    inputRange: [-20, 20],
    outputRange: ['-20deg', '20deg'],
  });

  return (
    <View
      style={[styles.container, { width: size + 44, height: size + 56 }]}
      {...panResponder.panHandlers}
    >
      {/* Studio Ambient Halo Lighting */}
      {showAura && (
        <>
          {/* Two26 Outer Flame Backlight */}
          <View
            style={[
              styles.auraSecondary,
              {
                width: size + 40,
                height: size + 40,
                borderRadius: (size + 40) / 2,
              },
            ]}
          />
          {/* Primary State Vitality Glow */}
          <View
            style={[
              styles.aura,
              {
                width: size + 24,
                height: size + 24,
                borderRadius: (size + 24) / 2,
                backgroundColor: getStateGlowColor(),
              },
            ]}
          />
        </>
      )}

      {/* Floating Mascot with 3D Perspective Tilt */}
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
              { perspective: 800 },
              { rotateX: rotXInterpolate },
              { rotateY: rotYInterpolate },
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

        {/* Studio Rim Light Overlay */}
        <View style={styles.rimLight} />
      </Animated.View>

      {/* Synchronized 3D Floor Shadow */}
      <Animated.View
        style={[
          styles.floorShadow,
          {
            width: size * 0.72,
            borderRadius: (size * 0.72) / 2,
            transform: [{ scale: shadowScale }],
          },
        ]}
      />
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
    opacity: 0.75,
    filter: 'blur(26px)',
  },
  auraSecondary: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 84, 0, 0.22)',
    opacity: 0.6,
    filter: 'blur(36px)',
  },
  mascotWrapper: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: '#0A0C14',
    position: 'relative',
    cursor: 'grab' as any,
  },
  image: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  rimLight: {
    position: 'absolute',
    inset: 0,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    pointerEvents: 'none',
  },
  floorShadow: {
    position: 'absolute',
    bottom: 2,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    filter: 'blur(7px)',
  },
});
