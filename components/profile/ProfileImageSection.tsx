// components/profile/ProfileImageSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Camera, Shield } from 'lucide-react-native';
import { moderateScale, verticalScale } from '@/utils/scaling'; // Assuming these exist
import { User } from '@/types/app'; // Assuming User type is defined here

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

interface ProfileImageSectionProps {
  user: User | null;
  selectedImage: string;
  isEditing: boolean;
  onImagePress: () => void; // Renamed for clarity
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  user,
  selectedImage,
  isEditing,
  onImagePress,
}) => {
  return (
    <Animated.View
      style={styles.profileImageSection}
      entering={FadeInUp.delay(200).springify()}
    >
      <View style={styles.profileImageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: selectedImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          {isEditing && (
            <Animated.View
              style={styles.imageOverlay}
              entering={FadeInUp.duration(300)}
            >
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={onImagePress} // Use the passed handler
                activeOpacity={0.8}
              >
                <Camera size={moderateScale(24)} color={COLORS.surface} strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
        <View style={styles.profileBadge}>
          <Shield size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
        </View>
      </View>
      <Text style={styles.profileName}>
        {user?.name || 'User Name'}
      </Text>
      <Text style={styles.profileId}>
        ID: {user?.uniqueId || '1234567890'}
      </Text>
    </Animated.View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  profileImageSection: { alignItems: 'center', paddingVertical: verticalScale(32), backgroundColor: COLORS.surface, marginBottom: verticalScale(20), },
  profileImageContainer: { position: 'relative', marginBottom: verticalScale(16), },
  imageWrapper: { position: 'relative', },
  profileImage: { width: moderateScale(120), height: moderateScale(120), borderRadius: moderateScale(60), borderWidth: 4, borderColor: COLORS.primary, },
  imageOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: moderateScale(60), backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', },
  cameraButton: { width: moderateScale(50), height: moderateScale(50), borderRadius: moderateScale(25), backgroundColor: COLORS.primaryDark, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, }, android: { elevation: 6, }, }), },
  profileBadge: { position: 'absolute', bottom: 0, right: 0, width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.surface, ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, }, android: { elevation: 4, }, }), },
  profileName: { fontSize: moderateScale(24), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(4), letterSpacing: -0.5, },
  profileId: { fontSize: moderateScale(13), fontWeight: '500', color: COLORS.textSecondary, letterSpacing: 0.5, },
});

export default ProfileImageSection;