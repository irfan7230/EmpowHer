// components/profile/LogoutButtonSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LogOut } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

interface LogoutButtonSectionProps {
  onPress: () => void;
}

const LogoutButtonSection: React.FC<LogoutButtonSectionProps> = ({ onPress }) => {
  return (
    <Animated.View
      style={styles.logoutSection}
      entering={FadeInUp.delay(800).springify()}
    >
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LogOut size={moderateScale(20)} color={COLORS.error} strokeWidth={2.5} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  logoutSection: { paddingHorizontal: scale(20), },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(10), backgroundColor: COLORS.errorLight, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), borderWidth: 2, borderColor: COLORS.error, },
  logoutButtonText: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.error, letterSpacing: 0.2, },
});

export default LogoutButtonSection;