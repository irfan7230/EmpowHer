// components/profile/EvidenceModal.tsx
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Modal, Pressable, Platform, Dimensions, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { X, ImageIcon, Video, Mic } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};
const { width, height } = Dimensions.get('window');
const isTablet = width >= 768; // Assuming isTablet is defined

interface EvidenceData {
  photos: { id: string; uri: string; timestamp: Date }[];
  audioRecordings: { id: string; duration: string; timestamp: Date }[];
  videoRecordings: { id: string; duration: string; timestamp: Date }[];
}

interface EvidenceModalProps {
  visible: boolean;
  onClose: () => void;
  evidenceData: EvidenceData;
  animatedModalStyle: any; // Pass the animation style
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
  visible,
  onClose,
  evidenceData,
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
        <Animated.View style={[styles.evidenceModal, animatedModalStyle]}>
          <View style={styles.evidenceModalHeader}>
            <Text style={styles.evidenceModalTitle}>Evidence Collection</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={moderateScale(24)} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Photos */}
            <View style={styles.evidenceCategory}>
              <View style={styles.evidenceCategoryHeader}>
                <ImageIcon size={moderateScale(18)} color={COLORS.success} strokeWidth={2.5} />
                <Text style={styles.evidenceCategoryTitle}>
                  Photos ({evidenceData.photos.length})
                </Text>
              </View>
              <View style={styles.photoGrid}>
                {evidenceData.photos.map((photo) => (
                  <View key={photo.id} style={styles.photoItem}>
                    <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                    <Text style={styles.photoTimestamp}>
                      {photo.timestamp.toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Audio Recordings */}
            <View style={styles.evidenceCategory}>
              <View style={styles.evidenceCategoryHeader}>
                <Mic size={moderateScale(18)} color={COLORS.info} strokeWidth={2.5} />
                <Text style={styles.evidenceCategoryTitle}>
                  Audio Recordings ({evidenceData.audioRecordings.length})
                </Text>
              </View>
              {evidenceData.audioRecordings.map((audio) => (
                <View key={audio.id} style={styles.audioItem}>
                  <View style={styles.audioIcon}>
                    <Mic size={moderateScale(16)} color={COLORS.info} strokeWidth={2.5} />
                  </View>
                  <View style={styles.audioInfo}>
                    <Text style={styles.audioDuration}>{audio.duration}</Text>
                    <Text style={styles.audioTimestamp}>
                      {audio.timestamp.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Video Recordings */}
            <View style={styles.evidenceCategory}>
              <View style={styles.evidenceCategoryHeader}>
                <Video size={moderateScale(18)} color={COLORS.warning} strokeWidth={2.5} />
                <Text style={styles.evidenceCategoryTitle}>
                  Video Recordings ({evidenceData.videoRecordings.length})
                </Text>
              </View>
              {evidenceData.videoRecordings.map((video) => (
                <View key={video.id} style={styles.videoItem}>
                  <View style={styles.videoIcon}>
                    <Video size={moderateScale(16)} color={COLORS.warning} strokeWidth={2.5} />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoDuration}>{video.duration}</Text>
                    <Text style={styles.videoTimestamp}>
                      {video.timestamp.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(20), },
  evidenceModal: { backgroundColor: COLORS.surface, borderRadius: moderateScale(24), padding: scale(24), width: '100%', maxWidth: isTablet ? 600 : 420, maxHeight: height * 0.8, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 25, }, android: { elevation: 15, }, }), },
  evidenceModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: verticalScale(20), paddingBottom: verticalScale(16), borderBottomWidth: 1, borderBottomColor: COLORS.border, },
  evidenceModalTitle: { fontSize: moderateScale(20), fontWeight: '700', color: COLORS.text, },
  evidenceCategory: { marginBottom: verticalScale(24), },
  evidenceCategoryHeader: { flexDirection: 'row', alignItems: 'center', gap: scale(10), marginBottom: verticalScale(12), },
  evidenceCategoryTitle: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(10), },
  photoItem: {
    // Calculate width more robustly
    width: (width - scale(40) * 2 - scale(20)) / 3, // Assuming scale(40) modal padding, scale(20) total gap (10*2)
  },
  photoThumbnail: { width: '100%', aspectRatio: 1, borderRadius: moderateScale(12), backgroundColor: COLORS.background, marginBottom: verticalScale(6), },
  photoTimestamp: { fontSize: moderateScale(10), color: COLORS.textLight, textAlign: 'center', },
  audioItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: scale(12), borderRadius: moderateScale(12), marginBottom: verticalScale(8), gap: scale(12), },
  audioIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: COLORS.infoLight, justifyContent: 'center', alignItems: 'center', },
  audioInfo: { flex: 1, },
  audioDuration: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.text, marginBottom: verticalScale(2), },
  audioTimestamp: { fontSize: moderateScale(12), color: COLORS.textSecondary, },
  videoItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: scale(12), borderRadius: moderateScale(12), marginBottom: verticalScale(8), gap: scale(12), },
  videoIcon: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: COLORS.warningLight, justifyContent: 'center', alignItems: 'center', },
  videoInfo: { flex: 1, },
  videoDuration: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.text, marginBottom: verticalScale(2), },
  videoTimestamp: { fontSize: moderateScale(12), color: COLORS.textSecondary, },
});

export default EvidenceModal;