// components/dashboard/DashboardActionButtons.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import Animated from 'react-native-reanimated';
import { Car, Phone, Key } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

interface DashboardActionButtonsProps {
  isResponding: boolean;
  onRespond: () => void;
  onCall: () => void; // Simple handler for now
  onDeactivate: () => void;
  animatedButtonStyle: any; // For the respond button
}

const DashboardActionButtons: React.FC<DashboardActionButtonsProps> = ({
  isResponding,
  onRespond,
  onCall,
  onDeactivate,
  animatedButtonStyle,
}) => {
  return (
    <View style={styles.actionButtons}>
      <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
        <TouchableOpacity
          style={[styles.respondButton, isResponding && styles.respondingButton]}
          onPress={onRespond}
          disabled={isResponding}
          activeOpacity={0.7}
        >
          <Car size={moderateScale(20)} color={COLORS.surface} strokeWidth={2.5} />
          <Text style={styles.respondButtonText}>
            {isResponding ? "✓ On My Way!" : "I'm On My Way"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={onCall} // Connect the handler
        activeOpacity={0.7}
      >
        <Phone size={moderateScale(18)} color={COLORS.surface} strokeWidth={2.5} />
        <Text style={styles.callButtonText}>Call Jessica</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deactivateButton}
        onPress={onDeactivate}
        activeOpacity={0.7}
      >
        <Key size={moderateScale(18)} color={COLORS.surface} strokeWidth={2.5} />
        <Text style={styles.deactivateButtonText}>Secure Deactivate (OTP)</Text>
      </TouchableOpacity>
    </View>
  );
};

// Copy relevant styles from trustee-dashboard.tsx
const styles = StyleSheet.create({
  actionButtons: { paddingHorizontal: scale(20), gap: verticalScale(12), },
  buttonWrapper: { width: '100%', },
  respondButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(10), backgroundColor: COLORS.success, paddingVertical: verticalScale(16), borderRadius: moderateScale(14), ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  respondingButton: { backgroundColor: COLORS.successDark, },
  respondButtonText: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.3, },
  callButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), backgroundColor: COLORS.info, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), ...Platform.select({ ios: { shadowColor: COLORS.info, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  callButtonText: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.2, },
  deactivateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), backgroundColor: COLORS.errorDark, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), borderWidth: 2, borderColor: COLORS.error, ...Platform.select({ ios: { shadowColor: COLORS.errorDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, }, android: { elevation: 4, }, }), },
  deactivateButtonText: { fontSize: moderateScale(15), fontWeight: '700', color: COLORS.surface, letterSpacing: 0.2, },
});

export default DashboardActionButtons;