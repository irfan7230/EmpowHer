// components/dashboard/OTPModal.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Platform, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { Key, X, Shield } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

const isTablet = Dimensions.get('window').width >= 768;

interface OTPModalProps {
  visible: boolean;
  otpCode: string;
  setOtpCode: (code: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  animatedModalStyle: any; // Pass animation style
}

const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  otpCode,
  setOtpCode,
  onClose,
  onSubmit,
  animatedModalStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none" // Use reanimated for animation
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose} // Close on backdrop press
        />
        <Animated.View style={[styles.otpModal, animatedModalStyle]}>
          <View style={styles.otpHeader}>
            <View style={styles.otpIconContainer}>
              <Key size={moderateScale(24)} color={COLORS.surface} strokeWidth={2.5} />
            </View>
            <TouchableOpacity
              style={styles.otpCloseButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={moderateScale(20)} color={COLORS.textSecondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <Text style={styles.otpTitle}>OTP Verification</Text>
          <Text style={styles.otpSubtitle}>Security verification required</Text>

          <Text style={styles.otpDescription}>
            Enter the 6-digit OTP sent to Jessica to safely deactivate the alert. This ensures she is truly safe.
          </Text>

          <View style={styles.otpInputContainer}>
            <TextInput
              style={styles.otpInput}
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="000000"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
              textAlign="center"
            />
          </View>

          <View style={styles.otpHintContainer}>
            <Text style={styles.otpHint}>💡 Demo OTP: 123456</Text>
          </View>

          <View style={styles.otpActions}>
            <TouchableOpacity
              style={styles.otpCancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.otpCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.otpSubmitButton, otpCode.length !== 6 && styles.otpSubmitDisabled]}
              onPress={onSubmit}
              disabled={otpCode.length !== 6}
              activeOpacity={0.7}
            >
              <Shield size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
              <Text style={styles.otpSubmitText}>Verify & Deactivate</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(20), },
  otpModal: { backgroundColor: COLORS.surface, borderRadius: moderateScale(24), padding: scale(24), width: '100%', maxWidth: isTablet ? 480 : 400, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 25, }, android: { elevation: 15, }, }), },
  otpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(20), },
  otpIconContainer: { width: moderateScale(56), height: moderateScale(56), borderRadius: moderateScale(28), backgroundColor: COLORS.errorDark, justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: COLORS.errorDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  otpCloseButton: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', },
  otpTitle: { fontSize: moderateScale(22), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(6), letterSpacing: -0.3, },
  otpSubtitle: { fontSize: moderateScale(13), fontWeight: '600', color: COLORS.errorDark, marginBottom: verticalScale(20), letterSpacing: 0.1, },
  otpDescription: { fontSize: moderateScale(13), fontWeight: '400', color: COLORS.textSecondary, lineHeight: moderateScale(19), marginBottom: verticalScale(24), letterSpacing: 0.1, },
  otpInputContainer: { marginBottom: verticalScale(16), },
  otpInput: { height: moderateScale(58), backgroundColor: COLORS.background, borderRadius: moderateScale(14), paddingHorizontal: scale(16), fontSize: moderateScale(22), fontWeight: '700', letterSpacing: moderateScale(8), borderWidth: 2, borderColor: COLORS.borderDark, color: COLORS.text, },
  otpHintContainer: { backgroundColor: COLORS.warningLight, padding: scale(12), borderRadius: moderateScale(12), marginBottom: verticalScale(24), borderWidth: 1, borderColor: '#FDE68A', },
  otpHint: { fontSize: moderateScale(12), fontWeight: '600', color: '#92400E', textAlign: 'center', letterSpacing: 0.2, },
  otpActions: { flexDirection: 'row', gap: scale(12), },
  otpCancelButton: { flex: 1, paddingVertical: verticalScale(14), borderRadius: moderateScale(12), alignItems: 'center', backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.borderDark, },
  otpCancelText: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 0.2, },
  otpSubmitButton: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), paddingVertical: verticalScale(14), borderRadius: moderateScale(12), backgroundColor: COLORS.errorDark, ...Platform.select({ ios: { shadowColor: COLORS.errorDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  otpSubmitDisabled: { backgroundColor: COLORS.borderDark, ...Platform.select({ ios: { shadowOpacity: 0, }, android: { elevation: 0, }, }), },
  otpSubmitText: { fontSize: moderateScale(14), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.3, },
});

export default OTPModal;