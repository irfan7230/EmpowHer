// components/profile/ProfileFormActions.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

interface ProfileFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  isValid: boolean; // To disable save button if form is invalid
  animatedSaveButtonStyle: any;
}

const ProfileFormActions: React.FC<ProfileFormActionsProps> = ({
  onCancel,
  onSave,
  isSaving,
  isValid,
  animatedSaveButtonStyle,
}) => {
  return (
    <Animated.View
      style={styles.actionButtons}
      entering={FadeInUp.delay(100).springify()}
    >
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <X size={moderateScale(18)} color={COLORS.textSecondary} strokeWidth={2.5} />
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.saveButtonWrapper, animatedSaveButtonStyle]}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
          disabled={isSaving || !isValid}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primaryDark, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.saveButtonGradient, (isSaving || !isValid) && styles.saveButtonDisabled]} // Apply disabled style to gradient too
          >
            {isSaving ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <>
                <Save size={moderateScale(18)} color={COLORS.surface} strokeWidth={2.5} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  actionButtons: { flexDirection: 'row', gap: scale(12), paddingHorizontal: scale(20), marginBottom: verticalScale(20), },
  cancelButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), backgroundColor: COLORS.surface, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), borderWidth: 2, borderColor: COLORS.borderDark, },
  cancelButtonText: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.textSecondary, },
  saveButtonWrapper: { flex: 1, },
  saveButton: { borderRadius: moderateScale(14), overflow: 'hidden', ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, }, android: { elevation: 6, }, }), },
  saveButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), paddingVertical: verticalScale(14), },
  saveButtonDisabled: { // Style for disabled gradient
    backgroundColor: COLORS.borderDark, // Use a neutral color
    opacity: 0.6,
    elevation: 0, // Remove elevation on Android
    shadowOpacity: 0, // Remove shadow on iOS
  },
  saveButtonText: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.3, },
});

export default ProfileFormActions;