// components/home/NetworkStatsCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Users, Eye, Zap } from 'lucide-react-native';
import { Trustee } from '@/types/app';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme';

// Reusable StatItem sub-component
const StatItem = ({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) => (
    <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
            <Icon size={moderateScale(20)} color="#FFFFFF" />
        </View>
        <View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    </View>
);

interface NetworkStatsCardProps {
  trustees: Trustee[];
}

const NetworkStatsCard: React.FC<NetworkStatsCardProps> = ({ trustees }) => {
  // Mock data as per original file
  const nearbyUsers = 47;
  const avgResponseTime = '2.3';

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Your Safety Network</Text>
      <View style={styles.statsGrid}>
        <StatItem icon={Users} value={trustees.length} label="Trustees" color={COLORS.primaryDark} />
        <StatItem icon={Eye} value={nearbyUsers} label="Nearby" color={COLORS.success} />
        <StatItem icon={Zap} value={`${avgResponseTime}m`} label="Response" color={COLORS.info} />
      </View>
    </View>
  );
};

// Copy relevant styles from index.tsx here (card, cardTitle, statsGrid, etc.)
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: moderateScale(20), padding: scale(16), marginBottom: verticalScale(16), marginHorizontal: scale(16), ...Platform.select({ ios: { shadowColor: '#D1D5DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 }, android: { elevation: 3, borderColor: COLORS.border, borderWidth: 1 } }) },
  cardTitle: { fontSize: moderateScale(18), fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: verticalScale(12) }, // Added marginBottom
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: verticalScale(8) },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: scale(8) },
  statIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: moderateScale(18), fontFamily: 'Inter-Bold', color: COLORS.text },
  statLabel: { fontSize: moderateScale(12), fontFamily: 'Inter-Regular', color: COLORS.textSecondary },
});

export default NetworkStatsCard;