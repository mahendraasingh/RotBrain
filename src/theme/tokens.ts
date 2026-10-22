/**
 * RotBrain Unified Theme Tokens
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, radii, shadows } from './spacing';

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  animation: {
    durationFast: 200,
    durationNormal: 350,
    durationSlow: 600,
  },
};

export * from './colors';
export * from './typography';
export * from './spacing';
