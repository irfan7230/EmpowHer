import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTrusteeStore } from '@/stores/useTrusteeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { trusteeSearchSchema, trusteeManualSchema } from '@/validation/schemas';
import { Trustee } from '@/types/app';
import { 
  Plus, 
  Phone, 
  Mail, 
  User, 
  X, 
  MessageCircle, 
  Search, 
  UserPlus, 
  Shield, 
  CheckCircle, 
  Users, 
  Heart,
  Share2,
  Hash,
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Layout,
  interpolate,
  withSequence,
  withRepeat,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  BounceIn
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Responsive scaling
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Device detection
const isTablet = width >= 768;

export default function TrusteesScreen() {
  const router = useRouter();
  
  // Zustand stores
  const { 
    trustees, 
    addTrustee, 
    trusteeMessages,
  } = useTrusteeStore();
  
  const { user } = useAuthStore();
  
  // Local state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<'search' | 'manual'>('search');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const modalScale = useSharedValue(0.9);
  const modalOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(50);
  const fabScale = useSharedValue(1);
  const searchPulse = useSharedValue(1);

  // Search form with Yup validation
  const searchForm = useValidatedForm({
    schema: trusteeSearchSchema,
    initialValues: {
      searchQuery: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      searchPulse.value = withSequence(
        withSpring(1.1, { duration: 200 }),
        withSpring(1, { duration: 200 })
      );

      // Simulate API call
      setTimeout(() => {
        const found = findUserByContact(values.searchQuery);
        if (found) {
          setFoundUser(found);
          manualForm.setFieldValues({
            name: found.name,
            phone: found.phone,
            email: found.email,
            uniqueId: found.uniqueId,
            relationship: '',
          });
          Alert.alert('User Found!', `Found ${found.name}. Complete the relationship field below.`);
        } else {
          Alert.alert('User Not Found', 'No user found with that information. You can add them manually.');
          setSearchType('manual');
        }
        setIsLoading(false);
      }, 1500);
    },
  });

  // Manual add form with Yup validation
  const manualForm = useValidatedForm({
    schema: trusteeManualSchema,
    initialValues: {
      name: '',
      phone: '',
      email: '',
      relationship: '',
      uniqueId: '',
    },
    onSubmit: async (values) => {
      addTrustee({
        name: values.name,
        phone: values.phone || '',
        email: values.email || '',
        relationship: values.relationship,
        uniqueId: values.uniqueId,
        isActive: true,
        isVerified: !!foundUser,
      });
      closeModal();
      Alert.alert('Success', 'Trustee added successfully! They will receive an invitation to connect.');
    },
  });

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    listTranslateY.value = withSpring(0, { damping: 15 });
    
    // FAB pulse animation
    fabScale.value = withRepeat(
      withSequence(
        withSpring(1.05, { duration: 1500 }),
        withSpring(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  // Helper function to find user by contact (mock implementation)
  const findUserByContact = (contact: string): any | null => {
    if (contact.includes('@') || contact.includes('+') || /^\d{10}$/.test(contact)) {
      return {
        id: 'found-user',
        uniqueId: '9876543210',
        email: contact.includes('@') ? contact : 'user@example.com',
        name: 'Found User',
        phone: contact.includes('+') ? contact : '+1 (555) 999-8888',
        profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      };
    }
    return null;
  };

  const openModal = () => {
    setIsModalVisible(true);
    backdropOpacity.value = withTiming(1, { duration: 300 });
    setTimeout(() => {
      modalOpacity.value = withTiming(1, { duration: 400 });
      modalScale.value = withTiming(1, { duration: 400 });
    }, 50);
  };

  const closeModal = () => {
    modalOpacity.value = withTiming(0, { duration: 300 });
    modalScale.value = withTiming(0.9, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setIsModalVisible(false);
      resetForm();
    }, 350);
  };

  const resetForm = () => {
    setSearchType('search');
    setFoundUser(null);
    setIsLoading(false);
    searchForm.resetForm();
    manualForm.resetForm();
  };

  const handleMessageTrustee = (trusteeId: string) => {
    router.push({
      pathname: '/trustee-messenger',
      params: { trusteeId }
    });
  };

  const handleShareUniqueId = () => {
    Alert.alert('Unique ID Shared', 'Your unique ID has been copied to clipboard');
  };

  const getUnreadCount = (trusteeId: string) => {
    return trusteeMessages.filter(m => m.trusteeId === trusteeId && !m.isRead && m.sender === 'trustee').length;
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) },
      { scale: interpolate(headerOpacity.value, [0, 1], [0.9, 1]) }
    ],
  }));

  const animatedListStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: listTranslateY.value }],
    opacity: interpolate(listTranslateY.value, [50, 0], [0, 1]),
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
    transform: [
      { scale: modalScale.value },
      { 
        translateY: interpolate(
          modalOpacity.value,
          [0, 1],
          [30, 0]
        )
      }
    ],
  }));

  const animatedFabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const animatedSearchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchPulse.value }],
  }));

  const renderTrustee = ({ item, index }: { item: Trustee; index: number }) => {
    const unreadCount = getUnreadCount(item.id);
    
    return (
      <Animated.View 
        style={[styles.trusteeCard, { width: isTablet ? '48%' : '100%' }]} 
        layout={Layout.springify()}
        entering={FadeInUp.delay(index * 100).springify()}
      >
        <TouchableOpacity 
          style={styles.trusteeContent}
          onPress={() => handleMessageTrustee(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.trusteeLeft}>
            <View style={styles.trusteeImageContainer}>
              <Image 
                source={{ 
                  uri: item.profileImage || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' 
                }} 
                style={styles.trusteeImage} 
              />
              {item.isActive && (
                <Animated.View 
                  style={styles.onlineIndicator}
                  entering={BounceIn.delay(200)}
                />
              )}
              {item.isVerified && (
                <Animated.View 
                  style={styles.verifiedBadge}
                  entering={BounceIn.delay(400)}
                >
                  <CheckCircle size={moderateScale(12)} color="#FFFFFF" />
                </Animated.View>
              )}
            </View>
            
            <View style={styles.trusteeInfo}>
              <View style={styles.trusteeNameRow}>
                <Text style={styles.trusteeName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.isVerified && (
                  <Shield size={moderateScale(14)} color="#10B981" style={styles.verifiedIcon} />
                )}
              </View>
              <Text style={styles.trusteeRelationship} numberOfLines={1}>
                {item.relationship}
              </Text>
              <View style={styles.trusteeContactInfo}>
                <Text style={styles.trusteePhone} numberOfLines={1}>
                  {item.phone}
                </Text>
                {item.uniqueId && (
                  <Text style={styles.trusteeId} numberOfLines={1}>
                    ID: {item.uniqueId}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.trusteeRight}>
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={() => handleMessageTrustee(item.id)}
            >
              <MessageCircle size={moderateScale(20)} color="#FF8A95" />
              {unreadCount > 0 && (
                <Animated.View 
                  style={styles.unreadBadge}
                  entering={BounceIn}
                >
                  <Text style={styles.unreadBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </Animated.View>
              )}
            </TouchableOpacity>
            <Text style={styles.lastSeen}>
              {item.isActive ? 'Online' : '2h ago'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, animatedHeaderStyle]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>My Trustees</Text>
          <Text style={styles.subtitle}>
            {trustees.length} trusted contact{trustees.length !== 1 ? 's' : ''} • {trustees.filter(t => t.isActive).length} online
          </Text>
        </View>
        <View style={styles.headerStats}>
          <Animated.View 
            style={styles.statBadge}
            entering={SlideInRight.delay(300)}
          >
            <Heart size={moderateScale(14)} color="#FF8A95" />
            <Text style={styles.statBadgeText}>
              {trustees.length}
            </Text>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );

  const renderUniqueIdCard = () => (
    <Animated.View 
      style={styles.uniqueIdCard}
      entering={FadeInDown.delay(200).springify()}
    >
      <View style={styles.uniqueIdHeader}>
        <Hash size={moderateScale(20)} color="#FF8A95" />
        <Text style={styles.uniqueIdTitle}>
          Your Unique ID
        </Text>
      </View>
      <View style={styles.uniqueIdContainer}>
        <Text style={styles.uniqueIdText}>
          {user?.uniqueId || '1234567890'}
        </Text>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShareUniqueId}
          activeOpacity={0.8}
        >
          <Share2 size={moderateScale(12)} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.shareButtonText}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.uniqueIdDescription}>
        Share this ID with people you trust so they can add you as their trustee
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderUniqueIdCard()}

      <Animated.View style={[styles.listContainer, animatedListStyle]}>
        <FlatList
          data={trustees}
          renderItem={renderTrustee}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            isTablet && styles.tabletListContent
          ]}
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? 'tablet' : 'mobile'}
          columnWrapperStyle={isTablet ? styles.row : undefined}
          ListEmptyComponent={
            <Animated.View 
              style={styles.emptyContainer}
              entering={FadeInUp.delay(400)}
            >
              <Animated.View 
                style={styles.emptyIconContainer}
                entering={FadeInUp.delay(500)}
              >
                <Users size={moderateScale(64)} color="#FFB3BA" />
              </Animated.View>
              <Text style={styles.emptyTitle}>
                No Trustees Yet
              </Text>
              <Text style={styles.emptySubtitle}>
                Add trusted contacts who can help you in emergencies and receive your safety updates
              </Text>
            </Animated.View>
          }
        />
      </Animated.View>

      <Animated.View style={[styles.fabContainer, animatedFabStyle]}>
        <TouchableOpacity 
          style={styles.fab} 
          onPress={openModal}
          activeOpacity={0.8}
        >
          <Plus size={moderateScale(28)} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      <Modal 
        visible={isModalVisible} 
        transparent 
        animationType="none" 
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <Animated.View 
          style={[styles.modalOverlay, animatedBackdropStyle]}
        >
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={closeModal}
          />
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <View style={styles.modalTitleIcon}>
                    <UserPlus size={moderateScale(24)} color="#FF8A95" />
                  </View>
                  <Text style={styles.modalTitle}>
                    Add New Trustee
                  </Text>
                </View>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <X size={moderateScale(22)} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {searchType === 'search' && (
                <View style={styles.searchSection}>
                  <View style={styles.searchHeader}>
                    <Search size={moderateScale(24)} color="#FF8A95" />
                    <Text style={styles.sectionTitle}>
                      Find User
                    </Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    Search by email, phone number, or 10-digit unique ID
                  </Text>
                  
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      value={searchForm.values.searchQuery}
                      onChangeText={(text) => searchForm.setFieldValue('searchQuery', text)}
                      onBlur={() => searchForm.setFieldTouched('searchQuery')}
                      placeholder="Enter email, phone, or unique ID"
                      placeholderTextColor="#9CA3AF"
                      editable={!isLoading}
                    />
                    <Animated.View style={animatedSearchStyle}>
                      <TouchableOpacity 
                        style={[styles.searchButton, { opacity: isLoading ? 0.7 : 1 }]} 
                        onPress={() => searchForm.handleSubmit()}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <Search size={moderateScale(20)} color="#FFFFFF" />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>

                  {searchForm.errors.searchQuery && searchForm.touched.searchQuery && (
                    <Text style={styles.errorText}>{searchForm.errors.searchQuery}</Text>
                  )}

                  {isLoading && (
                    <Animated.View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>Searching...</Text>
                    </Animated.View>
                  )}

                  {foundUser && (
                    <Animated.View style={styles.foundUserCard}>
                      <View style={styles.foundUserHeader}>
                        <Image 
                          source={{ uri: foundUser.profileImage }}
                          style={styles.foundUserImage}
                        />
                        <View style={styles.foundUserInfo}>
                          <Text style={styles.foundUserName}>
                            {foundUser.name}
                          </Text>
                          <Text style={styles.foundUserContact}>
                            {foundUser.email}
                          </Text>
                          <Text style={styles.foundUserId}>
                            ID: {foundUser.uniqueId}
                          </Text>
                        </View>
                        <CheckCircle size={moderateScale(24)} color="#10B981" />
                      </View>
                    </Animated.View>
                  )}

                  <TouchableOpacity 
                    style={styles.manualButton}
                    onPress={() => setSearchType('manual')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.manualButtonText}>
                      Add manually instead
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {searchType === 'manual' && (
                <Animated.View style={styles.manualSection}>
                  <View style={styles.manualHeader}>
                    <UserPlus size={moderateScale(24)} color="#FF8A95" />
                    <Text style={styles.sectionTitle}>
                      Add Manually
                    </Text>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Full Name *
                    </Text>
                    <View style={styles.inputWrapper}>
                      <User size={moderateScale(18)} color="#9CA3AF" />
                      <TextInput
                        style={styles.modalInput}
                        value={manualForm.values.name}
                        onChangeText={(text) => manualForm.setFieldValue('name', text)}
                        onBlur={() => manualForm.setFieldTouched('name')}
                        placeholder="Enter trustee's full name"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    {manualForm.errors.name && manualForm.touched.name && (
                      <Text style={styles.errorText}>{manualForm.errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Phone Number
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Phone size={moderateScale(18)} color="#9CA3AF" />
                      <TextInput
                        style={styles.modalInput}
                        value={manualForm.values.phone}
                        onChangeText={(text) => manualForm.setFieldValue('phone', text)}
                        onBlur={() => manualForm.setFieldTouched('phone')}
                        placeholder="+1 (555) 123-4567"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                      />
                    </View>
                    {manualForm.errors.phone && manualForm.touched.phone && (
                      <Text style={styles.errorText}>{manualForm.errors.phone}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Email Address
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Mail size={moderateScale(18)} color="#9CA3AF" />
                      <TextInput
                        style={styles.modalInput}
                        value={manualForm.values.email}
                        onChangeText={(text) => manualForm.setFieldValue('email', text)}
                        onBlur={() => manualForm.setFieldTouched('email')}
                        placeholder="email@example.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    {manualForm.errors.email && manualForm.touched.email && (
                      <Text style={styles.errorText}>{manualForm.errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Unique ID (if known)
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Hash size={moderateScale(18)} color="#9CA3AF" />
                      <TextInput
                        style={styles.modalInput}
                        value={manualForm.values.uniqueId}
                        onChangeText={(text) => manualForm.setFieldValue('uniqueId', text)}
                        onBlur={() => manualForm.setFieldTouched('uniqueId')}
                        placeholder="10-digit unique ID"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    </View>
                    {manualForm.errors.uniqueId && manualForm.touched.uniqueId && (
                      <Text style={styles.errorText}>{manualForm.errors.uniqueId}</Text>
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Relationship *
                    </Text>
                    <View style={styles.inputWrapper}>
                      <Heart size={moderateScale(18)} color="#9CA3AF" />
                      <TextInput
                        style={styles.modalInput}
                        value={manualForm.values.relationship}
                        onChangeText={(text) => manualForm.setFieldValue('relationship', text)}
                        onBlur={() => manualForm.setFieldTouched('relationship')}
                        placeholder="e.g., Mother, Best Friend, Partner"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    {manualForm.errors.relationship && manualForm.touched.relationship && (
                      <Text style={styles.errorText}>{manualForm.errors.relationship}</Text>
                    )}
                  </View>

                  <TouchableOpacity 
                    style={styles.backToSearchButton}
                    onPress={() => setSearchType('search')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.backToSearchText}>
                      ← Back to search
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={closeModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    (searchType === 'search' && !foundUser) && styles.saveButtonDisabled
                  ]} 
                  onPress={() => {
                    if (searchType === 'manual') {
                      manualForm.handleSubmit();
                    } else if (foundUser) {
                      manualForm.handleSubmit();
                    }
                  }}
                  disabled={searchType === 'search' && !foundUser}
                  activeOpacity={0.8}
                >
                  <UserPlus size={moderateScale(18)} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>
                    Add Trustee
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#6B7280',
  },
  headerStats: {
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    gap: scale(6),
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A95',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  statBadgeText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#FF8A95',
  },
  uniqueIdCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(20),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
    padding: scale(20),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: '#FFE4E6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  uniqueIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  uniqueIdTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: scale(12),
  },
  uniqueIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F0',
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: '#FFB3BA',
  },
  uniqueIdText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#FF8A95',
    letterSpacing: 2,
    flex: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8A95',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A95',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  shareButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uniqueIdDescription: {
    fontSize: moderateScale(12),
    color: '#6B7280',
    lineHeight: moderateScale(18),
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(120),
  },
  tabletListContent: {
    paddingHorizontal: scale(40),
  },
  row: {
    justifyContent: 'space-between',
  },
  trusteeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  trusteeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(20),
    minHeight: verticalScale(90),
  },
  trusteeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trusteeImageContainer: {
    position: 'relative',
    marginRight: scale(16),
  },
  trusteeImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    borderWidth: 3,
    borderColor: '#FFB3BA',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  trusteeInfo: {
    flex: 1,
  },
  trusteeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  trusteeName: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
    flexShrink: 1,
  },
  verifiedIcon: {
    marginLeft: scale(8),
  },
  trusteeRelationship: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#FF8A95',
    marginBottom: verticalScale(8),
  },
  trusteeContactInfo: {
    gap: verticalScale(3),
  },
  trusteePhone: {
    fontSize: moderateScale(13),
    color: '#6B7280',
  },
  trusteeId: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
  },
  trusteeRight: {
    alignItems: 'center',
    gap: verticalScale(10),
    marginLeft: scale(12),
  },
  messageButton: {
    position: 'relative',
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE4E6',
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A95',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  unreadBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: '#FF1744',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: scale(4),
    ...Platform.select({
      ios: {
        shadowColor: '#FF1744',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  unreadBadgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lastSeen: {
    fontSize: moderateScale(11),
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(80),
    paddingHorizontal: scale(40),
  },
  emptyIconContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    borderWidth: 2,
    borderColor: '#FFE4E6',
  },
  emptyTitle: {
    fontSize: moderateScale(22),
    fontWeight: '700',
    color: '#374151',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: moderateScale(15),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: moderateScale(22),
    paddingHorizontal: scale(20),
  },
  fabContainer: {
    position: 'absolute',
    bottom: verticalScale(120),
    right: scale(24),
  },
  fab: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: '#FF8A95',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A95',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(24),
    padding: scale(24),
    width: isTablet ? '70%' : '92%',
    maxWidth: isTablet ? 500 : 420,
    maxHeight: height * 0.85,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  modalTitleIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    marginBottom: verticalScale(24),
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    gap: scale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(18),
  },
  searchContainer: {
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: verticalScale(8),
  },
  searchInput: {
    flex: 1,
    height: moderateScale(50),
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(16),
    fontSize: moderateScale(15),
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  searchButton: {
    width: moderateScale(50),
    height: moderateScale(50),
    backgroundColor: '#FF8A95',
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A95',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#6B7280',
  },
  foundUserCard: {
    backgroundColor: '#F0FDF4',
    padding: scale(20),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(20),
    borderWidth: 2,
    borderColor: '#BBF7D0',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  foundUserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foundUserImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: scale(16),
    borderWidth: 2,
    borderColor: '#10B981',
  },
  foundUserInfo: {
    flex: 1,
  },
  foundUserName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(4),
  },
  foundUserContact: {
    fontSize: moderateScale(14),
    color: '#6B7280',
    marginBottom: verticalScale(2),
  },
  foundUserId: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
  },
  manualButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(16),
  },
  manualButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#FF8A95',
  },
  manualSection: {
    marginBottom: verticalScale(24),
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    gap: scale(8),
  },
  inputGroup: {
    marginBottom: verticalScale(16),
  },
  inputLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: moderateScale(50),
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(16),
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: scale(10),
  },
  modalInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: '#1F2937',
    paddingVertical: 0,
  },
  errorText: {
    fontSize: moderateScale(12),
    color: '#EF4444',
    marginTop: verticalScale(4),
    marginLeft: scale(4),
  },
  backToSearchButton: {
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    marginTop: verticalScale(12),
  },
  backToSearchText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#6B7280',
  },
  modalActions: {
    flexDirection: 'row',
    gap: scale(12),
    paddingTop: verticalScale(8),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8A95',
    gap: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A95',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  saveButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});