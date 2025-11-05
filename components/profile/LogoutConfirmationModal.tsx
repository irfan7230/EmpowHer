// components/profile/LogoutConfirmationModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Platform, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { LogOut, AlertCircle } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};
const { width } = Dimensions.get('window');
const isTablet = width >= 768; // Assuming isTablet is defined

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  animatedModalStyle: any; // Pass the animation style
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  animatedModalStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <Animated.View style={[styles.logoutModal, animatedModalStyle]}>
          <View style={styles.logoutIconContainer}>
            <AlertCircle size={moderateScale(48)} color={COLORS.warning} strokeWidth={2} />
          </View>
          <Text style={styles.logoutModalTitle}>Log Out?</Text>
          <Text style={styles.logoutModalText}>
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </Text>
          <View style={styles.logoutModalActions}>
            <TouchableOpacity
              style={styles.logoutCancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutConfirmButton}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <LogOut size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
              <Text style={styles.logoutConfirmText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(20), },
  logoutModal: { backgroundColor: COLORS.surface, borderRadius: moderateScale(24), padding: scale(28), width: '100%', maxWidth: isTablet ? 450 : 340, alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 25, }, android: { elevation: 15, }, }), },
  logoutIconContainer: { width: moderateScale(80), height: moderateScale(80), borderRadius: moderateScale(40), backgroundColor: COLORS.warningLight, justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(20), },
  logoutModalTitle: { fontSize: moderateScale(24), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(12), },
  logoutModalText: { fontSize: moderateScale(14), color: COLORS.textSecondary, textAlign: 'center', lineHeight: moderateScale(20), marginBottom: verticalScale(24), },
  logoutModalActions: { flexDirection: 'row', gap: scale(12), width: '100%', },
  logoutCancelButton: { flex: 1, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), backgroundColor: COLORS.background, alignItems: 'center', borderWidth: 2, borderColor: COLORS.borderDark, },
  logoutCancelText: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.textSecondary, },
  logoutConfirmButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), paddingVertical: verticalScale(14), borderRadius: moderateScale(14), backgroundColor: COLORS.error, ...Platform.select({ ios: { shadowColor: COLORS.error, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, }, android: { elevation: 6, }, }), },
  logoutConfirmText: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.surface, },
});

export default LogoutConfirmationModal;