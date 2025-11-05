// components/profile/ProfileFormField.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, Platform } from 'react-native';
import { Lock } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling'; // Assuming these exist

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

interface ProfileFormFieldProps {
  label: string;
  icon: React.ElementType; // Icon component type
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  placeholder: string;
  editable: boolean;
  error?: string;
  isEditing: boolean;
  keyboardType?: KeyboardTypeOptions;
  hint?: string;
  disabled?: boolean; // For non-editable fields like email
  touched?: boolean;
}

const ProfileFormField: React.FC<ProfileFormFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChangeText,
  onBlur,
  placeholder,
  editable,
  error,
  isEditing,
  keyboardType,
  hint,
  disabled = false,
  touched = false,
}) => {
  const isError = !!(error && touched);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        disabled && styles.inputWrapperDisabled,
        !disabled && isEditing && styles.inputWrapperEditing,
        isError && styles.inputWrapperError
      ]}>
        <Icon
          size={moderateScale(18)}
          color={disabled ? COLORS.textLight : (isEditing ? COLORS.primaryDark : COLORS.textLight)}
          strokeWidth={2}
        />
        <TextInput
          style={[styles.input, (disabled || !isEditing) && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          editable={editable && isEditing && !disabled}
          keyboardType={keyboardType}
        />
        {(disabled || !isEditing) && (
          <Lock size={moderateScale(14)} color={COLORS.textLight} />
        )}
      </View>
      {isError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      {hint && !isError && (
        <Text style={styles.inputHint}>{hint}</Text>
      )}
    </View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  inputGroup: { marginBottom: verticalScale(20), },
  inputLabel: { fontSize: moderateScale(13), fontWeight: '600', color: COLORS.text, marginBottom: verticalScale(8), letterSpacing: 0.2, },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: moderateScale(14), paddingHorizontal: scale(16), height: moderateScale(56), borderWidth: 2, borderColor: COLORS.border, gap: scale(12), },
  inputWrapperEditing: { backgroundColor: COLORS.surface, borderColor: COLORS.primary, },
  inputWrapperError: { borderColor: COLORS.error, },
  inputWrapperDisabled: { backgroundColor: COLORS.border, opacity: 0.7, borderColor: COLORS.border, }, // Ensure border is neutral when disabled
  input: { flex: 1, fontSize: moderateScale(15), color: COLORS.text, fontWeight: '500', },
  inputDisabled: { color: COLORS.textSecondary, },
  inputHint: { fontSize: moderateScale(11), color: COLORS.textLight, marginTop: verticalScale(4), marginLeft: scale(4), fontStyle: 'italic', },
  errorText: { fontSize: moderateScale(12), color: COLORS.error, marginTop: verticalScale(4), marginLeft: scale(4), },
});

export default ProfileFormField;