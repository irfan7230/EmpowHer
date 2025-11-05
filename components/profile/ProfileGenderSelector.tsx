// components/profile/ProfileGenderSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling'; // Assuming these exist

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

type GenderOption = 'male' | 'female' | 'other' | 'prefer-not-to-say';

interface ProfileGenderSelectorProps {
  label: string;
  value: GenderOption;
  onSelect: (value: GenderOption) => void;
  isEditing: boolean;
}

const genderOptions: { value: GenderOption; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const ProfileGenderSelector: React.FC<ProfileGenderSelectorProps> = ({
  label,
  value,
  onSelect,
  isEditing,
}) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.genderContainer}>
        {genderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.genderOption,
              value === option.value && styles.genderOptionActive,
              !isEditing && styles.genderOptionDisabled,
            ]}
            onPress={() => isEditing && onSelect(option.value)}
            disabled={!isEditing}
            activeOpacity={0.7}
          >
            <View style={[
              styles.genderRadio,
              value === option.value && styles.genderRadioActive,
            ]}>
              {value === option.value && (
                <View style={styles.genderRadioInner} />
              )}
            </View>
            <Text style={[
              styles.genderLabel,
              value === option.value && styles.genderLabelActive,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  inputGroup: { marginBottom: verticalScale(20), }, // Added from ProfileFormField for consistency
  inputLabel: { fontSize: moderateScale(13), fontWeight: '600', color: COLORS.text, marginBottom: verticalScale(8), letterSpacing: 0.2, }, // Added from ProfileFormField
  genderContainer: { gap: verticalScale(12), },
  genderOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, paddingHorizontal: scale(16), paddingVertical: verticalScale(14), borderRadius: moderateScale(12), borderWidth: 2, borderColor: COLORS.border, gap: scale(12), },
  genderOptionActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary, },
  genderOptionDisabled: { opacity: 0.6, },
  genderRadio: { width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(10), borderWidth: 2, borderColor: COLORS.borderDark, justifyContent: 'center', alignItems: 'center', },
  genderRadioActive: { borderColor: COLORS.primaryDark, },
  genderRadioInner: { width: moderateScale(10), height: moderateScale(10), borderRadius: moderateScale(5), backgroundColor: COLORS.primaryDark, },
  genderLabel: { fontSize: moderateScale(14), fontWeight: '500', color: COLORS.textSecondary, flex: 1, },
  genderLabelActive: { color: COLORS.text, fontWeight: '600', },
});

export default ProfileGenderSelector;