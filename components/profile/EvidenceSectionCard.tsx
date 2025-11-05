// components/profile/EvidenceSectionCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { FileText, ChevronRight } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};

interface EvidenceData { // Define a type for the mock data structure
  photos: any[];
  audioRecordings: any[];
  videoRecordings: any[];
}

interface EvidenceSectionCardProps {
  onPress: () => void;
  evidenceData: EvidenceData;
}

const EvidenceSectionCard: React.FC<EvidenceSectionCardProps> = ({ onPress, evidenceData }) => {
  return (
    <Animated.View
      style={styles.evidenceSection}
      entering={FadeInUp.delay(600).springify()}
    >
      <TouchableOpacity
        style={styles.evidenceCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.evidenceHeader}>
          <View style={styles.evidenceIconContainer}>
            <FileText size={moderateScale(20)} color={COLORS.info} strokeWidth={2.5} />
          </View>
          <View style={styles.evidenceInfo}>
            <Text style={styles.evidenceTitle}>My Evidence Collection</Text>
            <Text style={styles.evidenceSubtitle}>
              {evidenceData.photos.length} photos • {evidenceData.audioRecordings.length} audio • {evidenceData.videoRecordings.length} video
            </Text>
          </View>
          <ChevronRight size={moderateScale(20)} color={COLORS.textSecondary} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  evidenceSection: { paddingHorizontal: scale(20), marginBottom: verticalScale(16), },
  evidenceCard: { backgroundColor: COLORS.surface, borderRadius: moderateScale(16), padding: scale(16), borderWidth: 1, borderColor: COLORS.border, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, }, android: { elevation: 3, }, }), },
  evidenceHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(12), },
  evidenceIconContainer: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), backgroundColor: COLORS.infoLight, justifyContent: 'center', alignItems: 'center', },
  evidenceInfo: { flex: 1, },
  evidenceTitle: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(4), },
  evidenceSubtitle: { fontSize: moderateScale(12), color: COLORS.textSecondary, },
});

export default EvidenceSectionCard;