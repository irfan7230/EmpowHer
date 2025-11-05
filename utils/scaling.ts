// utils/scaling.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive sizing
export const scale = (size: number): number => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.3);
  return Math.round(size * limitedScale);
};

export const verticalScale = (size: number): number => {
  const baseHeight = 812;
  const scaleFactor = height / baseHeight;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.2);
  return Math.round(size * limitedScale);
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};