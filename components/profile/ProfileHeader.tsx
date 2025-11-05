// components/profile/ProfileHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ChevronRight, Edit3, X } from 'lucide-react-native';
import { moderateScale } from '@/utils/scaling'; // Assuming this exists

// Define COLORS locally for now, or import from constants/theme.ts
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

interface ProfileHeaderProps {
  isEditing: boolean;
  handleEditToggle: () => void;
  animatedHeaderStyle: any;
  animatedEditButtonStyle: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isEditing,
  handleEditToggle,
  animatedHeaderStyle,
  animatedEditButtonStyle,
}) => {
  const router = useRouter();

  return (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronRight size={moderateScale(24)} color={COLORS.text} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <Animated.View style={animatedEditButtonStyle}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditToggle}
            activeOpacity={0.7}
          >
            {isEditing ? (
              <X size={moderateScale(20)} color={COLORS.error} strokeWidth={2.5} />
            ) : (
              <Edit3 size={moderateScale(20)} color={COLORS.primaryDark} strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: moderateScale(20), // Use moderateScale or scale as needed
    paddingVertical: moderateScale(16),   // Use moderateScale or verticalScale
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, },
      android: { elevation: 4, },
    }),
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  backButton: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', },
  headerTitle: { fontSize: moderateScale(20), fontWeight: '700', color: COLORS.text, flex: 1, textAlign: 'center', letterSpacing: -0.3, },
  editButton: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', },
});

export default ProfileHeader;