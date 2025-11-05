// constants/theme.ts
import { Dimensions, Platform } from 'react-native';
import { moderateScale } from '@/utils/scaling'; // Assuming scaling utils are moved

// Material Design 3 Color System
export const MD3_COLORS = {
  primary: '#FF6B9D',
  primaryContainer: '#FFD9E5',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#3E001F',
  secondary: '#6750A4',
  secondaryContainer: '#E8DEF8',
  onSecondary: '#FFFFFF',
  tertiary: '#10B981',
  tertiaryContainer: '#D1FAE5',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  outline: '#E5E7EB',
  outlineVariant: '#CAC4D0',
  error: '#EF4444',
  errorContainer: '#FEE2E2',
  background: '#FAFAFA',
  scrim: 'rgba(0, 0, 0, 0.32)',
  primaryDark: '#FF8A95',
  primaryLight: '#FFF0F0',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#F3F4F6',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
};



// Colors specifically used in Community/Profile screens
export const APP_COLORS = {
  primary: '#FFB3BA',
  primaryDark: '#FF8A95',
  primaryLight: '#FFF0F0',
  secondary: '#FF6B9D',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#F3F4F6',
  borderDark: '#E5E7EB',
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FEF3C7', // Added from profile
  error: '#FF6347', // Note: Different red than MD3_COLORS.error
  errorLight: '#FEE2E2',
  errorDark: '#DC2626',
  info: '#6366F1',
  infoLight: '#E0E7FF', // Added from profile
  purple: '#8B5CF6',
  cyan: '#06B6D4',
};

// Material Design elevation
export const MD3_ELEVATION = {
  level0: { elevation: 0, shadowOpacity: 0 },
  level1: { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  level2: { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
  level3: { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8 },
  level4: { elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 12 },
};

// Bottom navigation constants
export const BOTTOM_NAV_HEIGHT = moderateScale(75);
export const BOTTOM_NAV_MARGIN = Platform.OS === 'ios' ? moderateScale(16) : moderateScale(8);