// components/home/QuickActionsCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MapPin, CheckCircle, Phone, MessageCircle } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Correct Import

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

// Reusable QuickActionButton sub-component
const QuickActionButton = ({ icon: Icon, text, onPress, color }: { icon: any; text: string; onPress: () => void; color: string }) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
        <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
            <Icon size={isSmallDevice ? moderateScale(20) : moderateScale(24)} color="#FFFFFF" />
        </View>
        <Text style={styles.quickActionText}>{text}</Text>
    </TouchableOpacity>
);

interface QuickActionsCardProps {
  onAction: (action: string) => void;
  isLocationSharing: boolean;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ onAction, isLocationSharing }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <QuickActionButton
          icon={MapPin}
          text={isLocationSharing ? 'Stop' : 'Share'}
          onPress={() => onAction('location')}
          color={isLocationSharing ? COLORS.success : COLORS.primaryDark} // Adjusted color
        />
        <QuickActionButton
          icon={CheckCircle}
          text="Check-in"
          onPress={() => onAction('check-in')}
          color={COLORS.info} // Adjusted color
        />
        <QuickActionButton
          icon={Phone}
          text="Fake Call"
          onPress={() => onAction('fake-call')}
          color={COLORS.purple} // Adjusted color
        />
        <QuickActionButton
          icon={MessageCircle}
          text="AI Help"
          onPress={() => onAction('ai-help')}
          color={COLORS.warning} // Adjusted color
        />
      </View>
    </View>
  );
};

// Copy relevant styles from index.tsx here (card, cardTitle, quickActionsGrid, etc.)
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: moderateScale(20), padding: scale(16), marginBottom: verticalScale(16), marginHorizontal: scale(16), ...Platform.select({ ios: { shadowColor: '#D1D5DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 3, borderColor: COLORS.border, borderWidth: 1 } }) },
  cardTitle: { fontSize: moderateScale(18), fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: verticalScale(8) }, // Added marginBottom
  quickActionsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: verticalScale(8) },
  quickActionButton: { alignItems: 'center', paddingVertical: verticalScale(8), width: (width - scale(32) - scale(32)) / 4 }, // Recalculated width
  quickActionIcon: { width: moderateScale(52), height: moderateScale(52), borderRadius: moderateScale(26), justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(8) },
  quickActionText: { fontSize: moderateScale(12), fontFamily: 'Inter-Medium', color: COLORS.text, textAlign: 'center' }, // Adjusted color
});

export default QuickActionsCard;