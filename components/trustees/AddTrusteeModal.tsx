// components/trustees/AddTrusteeModal.tsx
import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal, TextInput,
    ScrollView, Image, Platform, Dimensions, Alert
} from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import {
    Plus, Phone, Mail, User, X, Search, UserPlus, Shield,
    CheckCircle, Heart, Hash
} from 'lucide-react-native';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { trusteeSearchSchema, trusteeManualSchema } from '@/validation/schemas';
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Correct Import

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// Define a simple User type for the found user state
interface FoundUser {
    id: string;
    uniqueId: string;
    email: string;
    name: string;
    phone: string;
    profileImage: string;
}

interface AddTrusteeModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddTrustee: (trusteeData: any) => void; // Pass data up
    findUserByContact: (contact: string) => FoundUser | null; // Pass search function
    animatedBackdropStyle: any;
    animatedModalStyle: any;
}

const AddTrusteeModal: React.FC<AddTrusteeModalProps> = ({
    isVisible,
    onClose,
    onAddTrustee,
    findUserByContact,
    animatedBackdropStyle,
    animatedModalStyle,
}) => {
    const [searchType, setSearchType] = useState<'search' | 'manual'>('search');
    const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const searchPulse = useAnimatedStyle(() => ({
        transform: [{ scale: 1 }], // Placeholder for potential pulse animation
    }));

    // Search Form
    const searchForm = useValidatedForm({
        schema: trusteeSearchSchema,
        initialValues: { searchQuery: '' },
        onSubmit: async (values) => {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                const found = findUserByContact(values.searchQuery);
                if (found) {
                    setFoundUser(found);
                    manualForm.setFieldValues({ // Pre-fill manual form
                        name: found.name,
                        phone: found.phone,
                        email: found.email,
                        uniqueId: found.uniqueId,
                        relationship: '', // Keep relationship empty
                    });
                    Alert.alert('User Found!', `Found ${found.name}. Complete the relationship field below.`);
                } else {
                    Alert.alert('User Not Found', 'No user found with that information. You can add them manually.');
                    setSearchType('manual'); // Switch to manual if not found
                }
                setIsLoading(false);
            }, 1500);
        },
    });

    // Manual Form
    const manualForm = useValidatedForm({
        schema: trusteeManualSchema,
        initialValues: { name: '', phone: '', email: '', relationship: '', uniqueId: '' },
        onSubmit: async (values) => {
            onAddTrustee({ // Pass validated data up to parent
                name: values.name,
                phone: values.phone || '',
                email: values.email || '',
                relationship: values.relationship,
                uniqueId: values.uniqueId,
                isActive: false, // Default state for newly added
                isVerified: !!foundUser, // Verified only if found via search
                profileImage: foundUser?.profileImage, // Use found user image if available
            });
            resetFormStates(); // Reset internal state
            onClose(); // Close modal via prop
        },
    });

    // Reset internal state when modal closes or search type changes
    const resetFormStates = () => {
        setSearchType('search');
        setFoundUser(null);
        setIsLoading(false);
        searchForm.resetForm();
        manualForm.resetForm();
    };

    // Reset when visibility changes to false
    useEffect(() => {
        if (!isVisible) {
           resetFormStates();
        }
    }, [isVisible]);


    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.modalOverlay, animatedBackdropStyle]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
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
                                    <UserPlus size={moderateScale(24)} color={COLORS.primaryDark} />
                                </View>
                                <Text style={styles.modalTitle}>Add New Trustee</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={moderateScale(22)} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Section */}
                        {searchType === 'search' && (
                            <View style={styles.searchSection}>
                                <View style={styles.subHeader}>
                                    <Search size={moderateScale(20)} color={COLORS.primaryDark} />
                                    <Text style={styles.sectionTitle}>Find User</Text>
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
                                        placeholderTextColor={COLORS.textLight}
                                        editable={!isLoading}
                                    />
                                     <Animated.View style={searchPulse}>
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
                                {isLoading && <Text style={styles.loadingText}>Searching...</Text>}
                                {foundUser && (
                                    <Animated.View style={styles.foundUserCard}>
                                        {/* ... Found user display ... */}
                                        <View style={styles.foundUserHeader}>
                                            <Image source={{ uri: foundUser.profileImage }} style={styles.foundUserImage} />
                                            <View style={styles.foundUserInfo}>
                                                <Text style={styles.foundUserName}>{foundUser.name}</Text>
                                                <Text style={styles.foundUserContact}>{foundUser.email}</Text>
                                                <Text style={styles.foundUserId}>ID: {foundUser.uniqueId}</Text>
                                            </View>
                                            <CheckCircle size={moderateScale(24)} color={COLORS.success} />
                                        </View>
                                    </Animated.View>
                                )}
                                <TouchableOpacity style={styles.manualButton} onPress={() => setSearchType('manual')}>
                                    <Text style={styles.manualButtonText}>Add manually instead</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Manual Section */}
                         {searchType === 'manual' && (
                            <Animated.View style={styles.manualSection}>
                                <View style={styles.subHeader}>
                                    <UserPlus size={moderateScale(20)} color={COLORS.primaryDark} />
                                    <Text style={styles.sectionTitle}>Add Manually</Text>
                                </View>
                                {/* Form Fields */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Full Name *</Text>
                                    <View style={styles.inputWrapper}>
                                        <User size={moderateScale(18)} color={COLORS.textLight} />
                                        <TextInput style={styles.modalInput} value={manualForm.values.name} onChangeText={(t) => manualForm.setFieldValue('name', t)} onBlur={() => manualForm.setFieldTouched('name')} placeholder="Enter trustee's full name" placeholderTextColor={COLORS.textLight}/>
                                    </View>
                                    {manualForm.errors.name && manualForm.touched.name && <Text style={styles.errorText}>{manualForm.errors.name}</Text>}
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Phone Number</Text>
                                     <View style={styles.inputWrapper}>
                                         <Phone size={moderateScale(18)} color={COLORS.textLight} />
                                         <TextInput style={styles.modalInput} value={manualForm.values.phone} onChangeText={(t) => manualForm.setFieldValue('phone', t)} onBlur={() => manualForm.setFieldTouched('phone')} placeholder="+1 (555) 123-4567" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad"/>
                                     </View>
                                     {manualForm.errors.phone && manualForm.touched.phone && <Text style={styles.errorText}>{manualForm.errors.phone}</Text>}
                                </View>
                                 <View style={styles.inputGroup}>
                                     <Text style={styles.inputLabel}>Email Address</Text>
                                     <View style={styles.inputWrapper}>
                                         <Mail size={moderateScale(18)} color={COLORS.textLight} />
                                         <TextInput style={styles.modalInput} value={manualForm.values.email} onChangeText={(t) => manualForm.setFieldValue('email', t)} onBlur={() => manualForm.setFieldTouched('email')} placeholder="email@example.com" placeholderTextColor={COLORS.textLight} keyboardType="email-address" autoCapitalize="none"/>
                                     </View>
                                     {manualForm.errors.email && manualForm.touched.email && <Text style={styles.errorText}>{manualForm.errors.email}</Text>}
                                 </View>
                                 <View style={styles.inputGroup}>
                                     <Text style={styles.inputLabel}>Unique ID (if known)</Text>
                                     <View style={styles.inputWrapper}>
                                         <Hash size={moderateScale(18)} color={COLORS.textLight} />
                                         <TextInput style={styles.modalInput} value={manualForm.values.uniqueId} onChangeText={(t) => manualForm.setFieldValue('uniqueId', t)} onBlur={() => manualForm.setFieldTouched('uniqueId')} placeholder="10-digit unique ID" placeholderTextColor={COLORS.textLight} keyboardType="numeric" maxLength={10}/>
                                     </View>
                                     {manualForm.errors.uniqueId && manualForm.touched.uniqueId && <Text style={styles.errorText}>{manualForm.errors.uniqueId}</Text>}
                                 </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Relationship *</Text>
                                    <View style={styles.inputWrapper}>
                                        <Heart size={moderateScale(18)} color={COLORS.textLight} />
                                        <TextInput style={styles.modalInput} value={manualForm.values.relationship} onChangeText={(t) => manualForm.setFieldValue('relationship', t)} onBlur={() => manualForm.setFieldTouched('relationship')} placeholder="e.g., Mother, Best Friend" placeholderTextColor={COLORS.textLight}/>
                                    </View>
                                    {manualForm.errors.relationship && manualForm.touched.relationship && <Text style={styles.errorText}>{manualForm.errors.relationship}</Text>}
                                </View>
                                {/* Back to Search Button */}
                                <TouchableOpacity style={styles.backToSearchButton} onPress={() => { setSearchType('search'); setFoundUser(null); manualForm.resetForm(); }}>
                                    <Text style={styles.backToSearchText}>← Back to search</Text>
                                </TouchableOpacity>
                            </Animated.View>
                         )}

                        {/* Action Buttons */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, (searchType === 'search' && !foundUser) && styles.saveButtonDisabled]}
                                onPress={() => manualForm.handleSubmit()} // Submit manualForm always
                                disabled={searchType === 'search' && !foundUser && !manualForm.values.name} // Disable slightly differently
                                activeOpacity={0.8}
                            >
                                <UserPlus size={moderateScale(18)} color="#FFFFFF" />
                                <Text style={styles.saveButtonText}>Add Trustee</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

// Copy relevant styles from trustees.tsx
const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: scale(20), },
    modalContent: { backgroundColor: COLORS.surface, borderRadius: moderateScale(24), padding: scale(24), width: isTablet ? '70%' : '92%', maxWidth: isTablet ? 500 : 420, maxHeight: height * 0.85, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.25, shadowRadius: 25, }, android: { elevation: 15, }, }), },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(24), paddingBottom: verticalScale(16), borderBottomWidth: 1, borderBottomColor: COLORS.border, },
    modalTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: scale(12), },
    modalTitleIcon: { width: moderateScale(44), height: moderateScale(44), borderRadius: moderateScale(22), backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', },
    modalTitle: { fontSize: moderateScale(20), fontWeight: '700', color: COLORS.text, },
    closeButton: { width: moderateScale(36), height: moderateScale(36), borderRadius: moderateScale(18), backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', },
    searchSection: { marginBottom: verticalScale(24), },
    subHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: verticalScale(8), gap: scale(8), }, // Renamed from searchHeader/manualHeader
    sectionTitle: { fontSize: moderateScale(17), fontWeight: '600', color: COLORS.text, },
    sectionSubtitle: { fontSize: moderateScale(13), color: COLORS.textSecondary, marginBottom: verticalScale(16), lineHeight: moderateScale(18), },
    searchContainer: { flexDirection: 'row', gap: scale(10), marginBottom: verticalScale(8), },
    searchInput: { flex: 1, height: moderateScale(50), backgroundColor: COLORS.background, borderRadius: moderateScale(14), paddingHorizontal: scale(16), fontSize: moderateScale(15), borderWidth: 1.5, borderColor: COLORS.borderDark, color: COLORS.text, },
    searchButton: { width: moderateScale(50), height: moderateScale(50), backgroundColor: COLORS.primaryDark, borderRadius: moderateScale(14), justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, }, android: { elevation: 4, }, }), },
    loadingText: { alignSelf: 'center', marginVertical: verticalScale(10), color: COLORS.textSecondary, fontStyle: 'italic', },
    foundUserCard: { backgroundColor: COLORS.successLight, padding: scale(16), borderRadius: moderateScale(16), marginBottom: verticalScale(20), borderWidth: 2, borderColor: '#BBF7D0', // Lighter success border
        ...Platform.select({ ios: { shadowColor: COLORS.success, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, }, android: { elevation: 2, }, }), },
    foundUserHeader: { flexDirection: 'row', alignItems: 'center', },
    foundUserImage: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), marginRight: scale(16), borderWidth: 2, borderColor: COLORS.success, },
    foundUserInfo: { flex: 1, },
    foundUserName: { fontSize: moderateScale(16), fontWeight: '700', color: COLORS.text, marginBottom: verticalScale(4), },
    foundUserContact: { fontSize: moderateScale(14), color: COLORS.textSecondary, marginBottom: verticalScale(2), },
    foundUserId: { fontSize: moderateScale(12), color: COLORS.textLight, },
    manualButton: { alignItems: 'center', paddingVertical: verticalScale(16), },
    manualButtonText: { fontSize: moderateScale(14), fontWeight: '500', color: COLORS.primaryDark, },
    manualSection: { marginBottom: verticalScale(24), },
    inputGroup: { marginBottom: verticalScale(16), },
    inputLabel: { fontSize: moderateScale(13), fontWeight: '600', color: COLORS.text, marginBottom: verticalScale(8), },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', height: moderateScale(50), backgroundColor: COLORS.background, borderRadius: moderateScale(14), paddingHorizontal: scale(16), borderWidth: 1.5, borderColor: COLORS.borderDark, gap: scale(10), },
    modalInput: { flex: 1, fontSize: moderateScale(15), color: COLORS.text, paddingVertical: 0, }, // Added paddingVertical: 0 for android
    errorText: { fontSize: moderateScale(12), color: COLORS.error, marginTop: verticalScale(4), marginLeft: scale(4), },
    backToSearchButton: { alignItems: 'center', paddingVertical: verticalScale(16), marginTop: verticalScale(12), },
    backToSearchText: { fontSize: moderateScale(14), fontWeight: '500', color: COLORS.textSecondary, },
    modalActions: { flexDirection: 'row', gap: scale(12), paddingTop: verticalScale(8), },
    cancelButton: { flex: 1, paddingVertical: verticalScale(14), borderRadius: moderateScale(14), alignItems: 'center', backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.borderDark, },
    cancelButtonText: { fontSize: moderateScale(15), fontWeight: '600', color: COLORS.textSecondary, },
    saveButton: { flex: 1, flexDirection: 'row', paddingVertical: verticalScale(14), borderRadius: moderateScale(14), alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primaryDark, gap: scale(8), ...Platform.select({ ios: { shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, }, android: { elevation: 4, }, }), },
    saveButtonDisabled: { backgroundColor: COLORS.borderDark, ...Platform.select({ ios: { shadowOpacity: 0, }, android: { elevation: 0, }, }), },
    saveButtonText: { fontSize: moderateScale(15), fontWeight: '700', color: '#FFFFFF', },
});

export default AddTrusteeModal;