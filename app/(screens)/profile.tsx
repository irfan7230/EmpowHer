// app/(screens)/profile.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { profileSchema } from '@/validation/schemas';
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  Save,
  X,
  LogOut,
  Shield,
  FileText,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Mic,
  AlertCircle,
  Check,
  Lock,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  BounceIn,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive scaling
const scale = (size: number) => {
  const baseWidth = 375;
  const scaleFactor = width / baseWidth;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.3);
  return Math.round(size * limitedScale);
};

const verticalScale = (size: number) => {
  const baseHeight = 812;
  const scaleFactor = height / baseHeight;
  const limitedScale = Math.min(Math.max(scaleFactor, 0.85), 1.2);
  return Math.round(size * limitedScale);
};

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Device detection
const isTablet = width >= 768;
const isSmallScreen = width < 375;

// Theme colors
const COLORS = {
  primary: '#FFB3BA',
  primaryDark: '#FF8A95',
  primaryLight: '#FFF0F0',
  secondary: '#FF6B9D',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#F3F4F6',
  borderDark: '#E5E7EB',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#6366F1',
  infoLight: '#E0E7FF',
  warningLight: '#FEF3C7',
};

// Mock evidence data
const mockEvidenceData = {
  photos: [
    { id: '1', uri: 'https://via.placeholder.com/150', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', uri: 'https://via.placeholder.com/150', timestamp: new Date(Date.now() - 172800000) },
    { id: '3', uri: 'https://via.placeholder.com/150', timestamp: new Date(Date.now() - 259200000) },
  ],
  audioRecordings: [
    { id: '1', duration: '2:34', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', duration: '1:45', timestamp: new Date(Date.now() - 172800000) },
  ],
  videoRecordings: [
    { id: '1', duration: '5:23', timestamp: new Date(Date.now() - 86400000) },
  ],
};

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
  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);

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
      saveButtonScale.value = withSequence(
        withSpring(0.9, { duration: 100 }),
        withSpring(1, { duration: 100 })
      );
      
      // Simulate API call
      setTimeout(() => {
        completeProfile({
          ...values,
          profileImage: selectedImage,
        });
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

  const handleEditToggle = useCallback(() => {
    editButtonScale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    
    if (isEditing) {
      // Cancel editing - reset form
      profileForm.resetForm();
      setSelectedImage(user?.profileImage || '');
    }
    setIsEditing(!isEditing);
  }, [isEditing, user]);

  const handleImageSelect = (imageUri: string) => {
    setSelectedImage(imageUri);
    setShowImagePicker(false);
  };

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    modalOpacity.value = withTiming(1, { duration: 300 });
    modalScale.value = withSpring(1, { damping: 15, stiffness: 120 });
  };

  const closeLogoutModal = () => {
    modalOpacity.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.9, { duration: 200 });
    setTimeout(() => setShowLogoutModal(false), 200);
  };

  const openEvidenceModal = () => {
    setShowEvidenceModal(true);
    modalOpacity.value = withTiming(1, { duration: 300 });
    modalScale.value = withSpring(1, { damping: 15, stiffness: 120 });
  };

  const closeEvidenceModal = () => {
    modalOpacity.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.9, { duration: 200 });
    setTimeout(() => setShowEvidenceModal(false), 200);
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0]) },
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [30, 0], [0, 1]),
  }));

  const animatedEditButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editButtonScale.value }],
  }));

  const animatedSaveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [{ scale: modalScale.value }],
  }));

  // Mock image options for picker
  const mockImageOptions = [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronRight size={moderateScale(24)} color={COLORS.text} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Animated.View style={animatedEditButtonStyle}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditToggle}
              activeOpacity={0.7}
            >
              {isEditing ? (
                <X size={moderateScale(20)} color={COLORS.error} strokeWidth={2.5} />
              ) : (
                <Edit3 size={moderateScale(20)} color={COLORS.primaryDark} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        <Animated.View style={animatedContentStyle}>
          {/* Profile Image Section */}
          <Animated.View 
            style={styles.profileImageSection}
            entering={FadeInUp.delay(200).springify()}
          >
            <View style={styles.profileImageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: selectedImage || 'https://via.placeholder.com/150' }}
                  style={styles.profileImage}
                />
                {isEditing && (
                  <Animated.View 
                    style={styles.imageOverlay}
                    entering={FadeInUp.duration(300)}
                  >
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={() => setShowImagePicker(true)}
                      activeOpacity={0.8}
                    >
                      <Camera size={moderateScale(24)} color={COLORS.surface} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
              <View style={styles.profileBadge}>
                <Shield size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
              </View>
            </View>
            <Text style={styles.profileName}>
              {user?.name || 'User Name'}
            </Text>
            <Text style={styles.profileId}>
              ID: {user?.uniqueId || '1234567890'}
            </Text>
          </Animated.View>

          {/* Profile Form */}
          <Animated.View 
            style={styles.formSection}
            entering={FadeInUp.delay(400).springify()}
          >
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[
                styles.inputWrapper,
                isEditing && styles.inputWrapperEditing,
                profileForm.errors.name && profileForm.touched.name && styles.inputWrapperError
              ]}>
                <User size={moderateScale(18)} color={isEditing ? COLORS.primaryDark : COLORS.textLight} strokeWidth={2} />
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileForm.values.name}
                  onChangeText={(text) => profileForm.setFieldValue('name', text)}
                  onBlur={() => profileForm.setFieldTouched('name', true)}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.textLight}
                  editable={isEditing}
                />
                {!isEditing && (
                  <Lock size={moderateScale(14)} color={COLORS.textLight} />
                )}
              </View>
              {profileForm.errors.name && profileForm.touched.name && (
                <Text style={styles.errorText}>{profileForm.errors.name}</Text>
              )}
            </View>

            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[
                styles.inputWrapper,
                isEditing && styles.inputWrapperEditing,
                profileForm.errors.phone && profileForm.touched.phone && styles.inputWrapperError
              ]}>
                <Phone size={moderateScale(18)} color={isEditing ? COLORS.primaryDark : COLORS.textLight} strokeWidth={2} />
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileForm.values.phone}
                  onChangeText={(text) => profileForm.setFieldValue('phone', text)}
                  onBlur={() => profileForm.setFieldTouched('phone', true)}
                  placeholder="Enter your phone number"
                  placeholderTextColor={COLORS.textLight}
                  keyboardType="phone-pad"
                  editable={isEditing}
                />
                {!isEditing && (
                  <Lock size={moderateScale(14)} color={COLORS.textLight} />
                )}
              </View>
              {profileForm.errors.phone && profileForm.touched.phone && (
                <Text style={styles.errorText}>{profileForm.errors.phone}</Text>
              )}
            </View>

            {/* Email Field (Non-editable) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
                <Mail size={moderateScale(18)} color={COLORS.textLight} strokeWidth={2} />
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={profileForm.values.email}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.textLight}
                  editable={false}
                />
                <Lock size={moderateScale(14)} color={COLORS.textLight} />
              </View>
              <Text style={styles.inputHint}>Email cannot be changed for security reasons</Text>
            </View>

            {/* Gender Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderContainer}>
                {[
                  { value: 'female', label: 'Female' },
                  { value: 'male', label: 'Male' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      profileForm.values.gender === option.value && styles.genderOptionActive,
                      !isEditing && styles.genderOptionDisabled,
                    ]}
                    onPress={() => isEditing && profileForm.setFieldValue('gender', option.value)}
                    disabled={!isEditing}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.genderRadio,
                      profileForm.values.gender === option.value && styles.genderRadioActive,
                    ]}>
                      {profileForm.values.gender === option.value && (
                        <View style={styles.genderRadioInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.genderLabel,
                      profileForm.values.gender === option.value && styles.genderLabelActive,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          {isEditing && (
            <Animated.View 
              style={styles.actionButtons}
              entering={FadeInUp.delay(100).springify()}
            >
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleEditToggle}
                activeOpacity={0.7}
              >
                <X size={moderateScale(18)} color={COLORS.textSecondary} strokeWidth={2.5} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <Animated.View style={[styles.saveButtonWrapper, animatedSaveButtonStyle]}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => profileForm.handleSubmit()}
                  disabled={isSaving || !profileForm.isValid}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveButtonGradient}
                  >
                    {isSaving ? (
                      <Text style={styles.saveButtonText}>Saving...</Text>
                    ) : (
                      <>
                        <Save size={moderateScale(18)} color={COLORS.surface} strokeWidth={2.5} />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          )}

          {/* Evidence Section */}
          <Animated.View 
            style={styles.evidenceSection}
            entering={FadeInUp.delay(600).springify()}
          >
            <TouchableOpacity
              style={styles.evidenceCard}
              onPress={openEvidenceModal}
              activeOpacity={0.7}
            >
              <View style={styles.evidenceHeader}>
                <View style={styles.evidenceIconContainer}>
                  <FileText size={moderateScale(20)} color={COLORS.info} strokeWidth={2.5} />
                </View>
                <View style={styles.evidenceInfo}>
                  <Text style={styles.evidenceTitle}>My Evidence Collection</Text>
                  <Text style={styles.evidenceSubtitle}>
                    {mockEvidenceData.photos.length} photos • {mockEvidenceData.audioRecordings.length} audio • {mockEvidenceData.videoRecordings.length} video
                  </Text>
                </View>
                <ChevronRight size={moderateScale(20)} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Logout Button */}
          <Animated.View 
            style={styles.logoutSection}
            entering={FadeInUp.delay(800).springify()}
          >
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={openLogoutModal}
              activeOpacity={0.7}
            >
              <LogOut size={moderateScale(20)} color={COLORS.error} strokeWidth={2.5} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={() => setShowImagePicker(false)}
          />
          <Animated.View style={[styles.imagePickerModal, animatedModalStyle]}>
            <View style={styles.imagePickerHeader}>
              <Text style={styles.imagePickerTitle}>Choose Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <X size={moderateScale(24)} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.imageGrid}>
              {mockImageOptions.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageOption}
                  onPress={() => handleImageSelect(uri)}
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

      {/* Evidence Modal */}
      <Modal
        visible={showEvidenceModal}
        transparent
        animationType="fade"
        onRequestClose={closeEvidenceModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={closeEvidenceModal}
          />
          <Animated.View style={[styles.evidenceModal, animatedModalStyle]}>
            <View style={styles.evidenceModalHeader}>
              <Text style={styles.evidenceModalTitle}>Evidence Collection</Text>
              <TouchableOpacity onPress={closeEvidenceModal}>
                <X size={moderateScale(24)} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Photos */}
              <View style={styles.evidenceCategory}>
                <View style={styles.evidenceCategoryHeader}>
                  <ImageIcon size={moderateScale(18)} color={COLORS.success} strokeWidth={2.5} />
                  <Text style={styles.evidenceCategoryTitle}>
                    Photos ({mockEvidenceData.photos.length})
                  </Text>
                </View>
                <View style={styles.photoGrid}>
                  {mockEvidenceData.photos.map((photo) => (
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
                    Audio Recordings ({mockEvidenceData.audioRecordings.length})
                  </Text>
                </View>
                {mockEvidenceData.audioRecordings.map((audio) => (
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
                    Video Recordings ({mockEvidenceData.videoRecordings.length})
                  </Text>
                </View>
                {mockEvidenceData.videoRecordings.map((video) => (
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

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={closeLogoutModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={StyleSheet.absoluteFill}
            onPress={closeLogoutModal}
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
                onPress={closeLogoutModal}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutConfirmButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <LogOut size={moderateScale(16)} color={COLORS.surface} strokeWidth={2.5} />
                <Text style={styles.logoutConfirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  editButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: verticalScale(32),
    backgroundColor: COLORS.surface,
    marginBottom: verticalScale(20),
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: verticalScale(16),
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(60),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileName: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(4),
    letterSpacing: -0.5,
  },
  profileId: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  formSection: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(24),
    marginBottom: verticalScale(16),
  },
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(8),
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(16),
    height: moderateScale(56),
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: scale(12),
  },
  inputWrapperEditing: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputWrapperDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    color: COLORS.text,
    fontWeight: '500',
  },
  inputDisabled: {
    color: COLORS.textSecondary,
  },
  inputHint: {
    fontSize: moderateScale(11),
    color: COLORS.textLight,
    marginTop: verticalScale(4),
    marginLeft: scale(4),
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: moderateScale(12),
    color: COLORS.error,
    marginTop: verticalScale(4),
    marginLeft: scale(4),
  },
  genderContainer: {
    gap: verticalScale(12),
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: scale(12),
  },
  genderOptionActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  genderOptionDisabled: {
    opacity: 0.6,
  },
  genderRadio: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderRadioActive: {
    borderColor: COLORS.primaryDark,
  },
  genderRadioInner: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: COLORS.primaryDark,
  },
  genderLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: COLORS.textSecondary,
    flex: 1,
  },
  genderLabelActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: COLORS.surface,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    borderWidth: 2,
    borderColor: COLORS.borderDark,
  },
  cancelButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveButtonWrapper: {
    flex: 1,
  },
  saveButton: {
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(14),
  },
  saveButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.surface,
    letterSpacing: 0.3,
  },
  evidenceSection: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(16),
  },
  evidenceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(16),
    padding: scale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  evidenceIconContainer: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: COLORS.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceInfo: {
    flex: 1,
  },
  evidenceTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(4),
  },
  evidenceSubtitle: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
  },
  logoutSection: {
    paddingHorizontal: scale(20),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    backgroundColor: COLORS.errorLight,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  logoutButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.error,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  imagePickerModal: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(24),
    padding: scale(24),
    width: '100%',
    maxWidth: isTablet ? 500 : 380,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  imagePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  imagePickerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.text,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
    marginBottom: verticalScale(20),
  },
  imageOption: {
    width: (width - scale(40) - scale(48) - scale(36)) / 4,
    aspectRatio: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  imageOptionImage: {
    width: '100%',
    height: '100%',
  },
  imageSelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 138, 149, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSelectedCheck: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: COLORS.primaryLight,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  imagePickerButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  evidenceModal: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(24),
    padding: scale(24),
    width: '100%',
    maxWidth: isTablet ? 600 : 420,
    maxHeight: height * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  evidenceModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  evidenceModalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: COLORS.text,
  },
  evidenceCategory: {
    marginBottom: verticalScale(24),
  },
  evidenceCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginBottom: verticalScale(12),
  },
  evidenceCategoryTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.text,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  photoItem: {
    width: (width - scale(40) - scale(48) - scale(20)) / 3,
  },
  photoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: moderateScale(12),
    backgroundColor: COLORS.background,
    marginBottom: verticalScale(6),
  },
  photoTimestamp: {
    fontSize: moderateScale(10),
    color: COLORS.textLight,
    textAlign: 'center',
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: scale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    gap: scale(12),
  },
  audioIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioInfo: {
    flex: 1,
  },
  audioDuration: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(2),
  },
  audioTimestamp: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: scale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
    gap: scale(12),
  },
  videoIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoDuration: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(2),
  },
  videoTimestamp: {
    fontSize: moderateScale(12),
    color: COLORS.textSecondary,
  },
  logoutModal: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(24),
    padding: scale(28),
    width: '100%',
    maxWidth: isTablet ? 450 : 340,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  logoutIconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: COLORS.warningLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  logoutModalTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: verticalScale(12),
  },
  logoutModalText: {
    fontSize: moderateScale(14),
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(24),
  },
  logoutModalActions: {
    flexDirection: 'row',
    gap: scale(12),
    width: '100%',
  },
  logoutCancelButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderDark,
  },
  logoutCancelText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  logoutConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.error,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logoutConfirmText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: COLORS.surface,
  },
  infoLight: {
    backgroundColor: '#E0E7FF',
  },
  warningLight: {
    backgroundColor: '#FEF3C7',
  },
});