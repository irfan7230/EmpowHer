// app/(screens)/profile.tsx
import React, { useState, useCallback } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { profileSchema } from '@/validation/schemas';
import { User as UserIcon, Mail, Phone } from 'lucide-react-native'; // Renamed User icon
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  FadeInUp,
} from 'react-native-reanimated';

// Import Components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileImageSection from '@/components/profile/ProfileImageSection';
import ProfileFormField from '@/components/profile/ProfileFormField';
import ProfileGenderSelector from '@/components/profile/ProfileGenderSelector';
import ProfileFormActions from '@/components/profile/ProfileFormActions';
import EvidenceSectionCard from '@/components/profile/EvidenceSectionCard';
import LogoutButtonSection from '@/components/profile/LogoutButtonSection';
import ImagePickerModal from '@/components/profile/ImagePickerModal';
import EvidenceModal from '@/components/profile/EvidenceModal';
import LogoutConfirmationModal from '@/components/profile/LogoutConfirmationModal';

// Mock evidence data (consider moving to a mock data file)
const mockEvidenceData = {
  photos: [ { id: '1', uri: 'https://via.placeholder.com/150', timestamp: new Date(Date.now() - 86400000) }, /* ... more */ ],
  audioRecordings: [ { id: '1', duration: '2:34', timestamp: new Date(Date.now() - 86400000) }, /* ... more */ ],
  videoRecordings: [ { id: '1', duration: '5:23', timestamp: new Date(Date.now() - 86400000) }, /* ... more */ ],
};
// Mock image options (consider moving)
const mockImageOptions = [
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
  // ... more images
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, completeProfile } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(user?.profileImage || '');
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const editButtonScale = useSharedValue(1);
  const saveButtonScale = useSharedValue(1);
  const modalScale = useSharedValue(0); // Shared scale for all modals
  const modalOpacity = useSharedValue(0); // Shared opacity

  // Form validation
  const profileForm = useValidatedForm({
    schema: profileSchema,
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      gender: user?.gender || 'prefer-not-to-say',
    },
    onSubmit: async (values) => {
      setIsSaving(true);
      saveButtonScale.value = withSequence(withSpring(0.9), withSpring(1));
      setTimeout(() => { // Simulate API
        completeProfile({ ...values, profileImage: selectedImage });
        setIsSaving(false);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }, 1000);
    },
  });

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 90 });
  }, []);

  // Modal Animation Control
  const animateModalOpen = () => {
    modalOpacity.value = withTiming(1, { duration: 300 });
    modalScale.value = withSpring(1, { damping: 15, stiffness: 120 });
  };
  const animateModalClose = (callback: () => void) => {
    modalOpacity.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.9, { duration: 200 });
    setTimeout(callback, 200);
  };

  // Handlers
  const handleEditToggle = useCallback(() => {
    editButtonScale.value = withSequence(withSpring(0.9), withSpring(1));
    if (isEditing) {
      profileForm.resetForm();
      setSelectedImage(user?.profileImage || '');
    }
    setIsEditing(!isEditing);
  }, [isEditing, user, profileForm]);

  const handleImageSelect = (imageUri: string) => {
    setSelectedImage(imageUri);
    animateModalClose(() => setShowImagePicker(false));
  };

  const handleLogout = useCallback(() => {
    animateModalClose(() => {
        setShowLogoutModal(false); // Ensure modal state is updated
        logout();
        router.replace('/login');
    });
  }, [logout, router]);


  const openImagePicker = () => { setShowImagePicker(true); animateModalOpen(); };
  const closeImagePicker = () => animateModalClose(() => setShowImagePicker(false));

  const openLogoutModal = () => { setShowLogoutModal(true); animateModalOpen(); };
  const closeLogoutModal = () => animateModalClose(() => setShowLogoutModal(false));

  const openEvidenceModal = () => { setShowEvidenceModal(true); animateModalOpen(); };
  const closeEvidenceModal = () => animateModalClose(() => setShowEvidenceModal(false));

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) }],
  }));
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [30, 0], [0, 1]),
  }));
  const animatedEditButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: editButtonScale.value }] }));
  const animatedSaveButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: saveButtonScale.value }] }));
  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader
        isEditing={isEditing}
        handleEditToggle={handleEditToggle}
        animatedHeaderStyle={animatedHeaderStyle}
        animatedEditButtonStyle={animatedEditButtonStyle}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <Animated.View style={animatedContentStyle}>
          <ProfileImageSection
            user={user}
            selectedImage={selectedImage}
            isEditing={isEditing}
            onImagePress={openImagePicker}
          />

          <Animated.View
            style={styles.formSection}
            entering={FadeInUp.delay(400).springify()}
          >
            <ProfileFormField
              label="Full Name"
              icon={UserIcon}
              value={profileForm.values.name}
              onChangeText={(text) => profileForm.setFieldValue('name', text)}
              onBlur={() => profileForm.setFieldTouched('name', true)}
              placeholder="Enter your full name"
              editable={true} // Always allow input, disable via isEditing prop
              error={profileForm.errors.name}
              isEditing={isEditing}
              touched={profileForm.touched.name}
            />
            <ProfileFormField
              label="Phone Number"
              icon={Phone}
              value={profileForm.values.phone}
              onChangeText={(text) => profileForm.setFieldValue('phone', text)}
              onBlur={() => profileForm.setFieldTouched('phone', true)}
              placeholder="Enter your phone number"
              editable={true}
              error={profileForm.errors.phone}
              isEditing={isEditing}
              keyboardType="phone-pad"
              touched={profileForm.touched.phone}
            />
            <ProfileFormField
              label="Email Address"
              icon={Mail}
              value={profileForm.values.email}
              onChangeText={() => {}} // No-op
              onBlur={() => {}} // No-op
              placeholder="Email address"
              editable={false} // Always false
              isEditing={isEditing} // Pass for styling
              disabled={true} // Mark as disabled
              hint="Email cannot be changed for security reasons"
            />
            <ProfileGenderSelector
              label="Gender"
              value={profileForm.values.gender as any} // Cast if needed based on type
              onSelect={(value) => profileForm.setFieldValue('gender', value)}
              isEditing={isEditing}
            />
          </Animated.View>

          {isEditing && (
            <ProfileFormActions
              onCancel={handleEditToggle}
              onSave={profileForm.handleSubmit}
              isSaving={isSaving}
              isValid={profileForm.isValid} // Pass validity
              animatedSaveButtonStyle={animatedSaveButtonStyle}
            />
          )}

          <EvidenceSectionCard
            onPress={openEvidenceModal}
            evidenceData={mockEvidenceData}
          />

          <LogoutButtonSection onPress={openLogoutModal} />

        </Animated.View>
      </ScrollView>

      <ImagePickerModal
        visible={showImagePicker}
        onClose={closeImagePicker}
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage}
        mockImageOptions={mockImageOptions}
        animatedModalStyle={animatedModalStyle}
      />

      <EvidenceModal
        visible={showEvidenceModal}
        onClose={closeEvidenceModal}
        evidenceData={mockEvidenceData}
        animatedModalStyle={animatedModalStyle}
      />

      <LogoutConfirmationModal
        visible={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        animatedModalStyle={animatedModalStyle}
      />
    </SafeAreaView>
  );
}

// Keep only container/layout styles here, or move to theme/constants
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' /* COLORS.background */ },
  scrollContent: { paddingBottom: 40 /* verticalScale(40) */ },
  formSection: { backgroundColor: '#FFFFFF' /* COLORS.surface */, paddingHorizontal: 20 /* scale(20) */, paddingVertical: 24 /* verticalScale(24) */, marginBottom: 16 /* verticalScale(16) */, },
  // Add any other top-level layout styles if necessary
});