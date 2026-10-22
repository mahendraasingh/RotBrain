/**
 * RotBrain Typography System
 */

import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    letterSpacing: -0.2,
  } as TextStyle,
  h4: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,
  caption: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    letterSpacing: 0.2,
  } as TextStyle,
  monoLarge: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -1,
  } as TextStyle,
  monoMedium: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  } as TextStyle,
  badge: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  } as TextStyle,
};
