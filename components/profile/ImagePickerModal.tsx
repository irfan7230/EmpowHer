// components/profile/ImagePickerModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Pressable, Platform, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { X, Camera, Check } from 'lucide-react-native';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';

// Define COLORS locally or import
const COLORS = {
  primary: '#FFB3BA', primaryDark: '#FF8A95', primaryLight: '#FFF0F0', secondary: '#FF6B9D', background: '#FAFAFA', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', textLight: '#9CA3AF', border: '#F3F4F6', borderDark: '#E5E7EB', success: '#10B981', successLight: '#D1FAE5', warning: '#F59E0B', error: '#EF4444', errorLight: '#FEE2E2', info: '#6366F1', infoLight: '#E0E7FF', warningLight: '#FEF3C7',
};
const { width } = Dimensions.get('window');
const isTablet = width >= 768; // Assuming isTablet is defined

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelect: (uri: string) => void;
  selectedImage: string;
  mockImageOptions: string[];
  animatedModalStyle: any; // Pass the animation style
}

const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelect,
  selectedImage,
  mockImageOptions,
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
        <Animated.View style={[styles.imagePickerModal, animatedModalStyle]}>
          <View style={styles.imagePickerHeader}>
            <Text style={styles.imagePickerTitle}>Choose Profile Picture</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={moderateScale(24)} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.imageGrid}>
            {mockImageOptions.map((uri, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageOption}
                onPress={() => onImageSelect(uri)}
                activeOpacity={0.8}
              >
                <Image source={{ uri }} style={styles.imageOptionImage} />
                {selectedImage === uri && (
                  <View style={styles.imageSelectedOverlay}>
                    <View style={styles.imageSelectedCheck}>
                      <Check size={moderateScale(16)} color={COLORS.surface} strokeWidth={3} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.imagePickerButton} activeOpacity={0.8}>
            <Camera size={moderateScale(18)} color={COLORS.primaryDark} strokeWidth={2.5} />
            <Text style={styles.imagePickerButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Copy relevant styles from profile.tsx here
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(20), },
  imagePickerModal: { backgroundColor: COLORS.surface, borderRadius: moderateScale(24), padding: scale(24), width: '100%', maxWidth: isTablet ? 500 : 380, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 25, }, android: { elevation: 15, }, }), },
  imagePickerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: verticalScale(20), },
  imagePickerTitle: { fontSize: moderateScale(20), fontWeight: '700', color: COLORS.text, },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: scale(12), marginBottom: verticalScale(20), justifyContent: 'center', }, // Added justifyContent
  imageOption: {
    // Calculate width more robustly inside the style if width is dynamic
    width: (width - scale(40) * 2 - scale(36)) / 4, // Assuming scale(40) is horizontal padding, scale(36) is total gap (12 * 3)
    aspectRatio: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  imageOptionImage: { width: '100%', height: '100%', },
  imageSelectedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 138, 149, 0.7)', justifyContent: 'center', alignItems: 'center', },
  imageSelectedCheck: { width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(14), backgroundColor: COLORS.success, justifyContent: 'center', alignItems: 'center', },
  imagePickerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(8), backgroundColor: COLORS.primaryLight, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), borderWidth: 2, borderColor: COLORS.primary, },
  imagePickerButtonText: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.primaryDark, },
});

export default ImagePickerModal;