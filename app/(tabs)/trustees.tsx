// app/(tabs)/trustees.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate, withRepeat, withSequence } from 'react-native-reanimated';

// Import Stores and Hooks
import { useTrusteeStore } from '@/stores/useTrusteeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Trustee } from '@/types/app';

// Import Components
import TrusteesHeader from '@/components/trustees/TrusteesHeader';
import UniqueIdCard from '@/components/trustees/UniqueIdCard';
import TrusteeListItem from '@/components/trustees/TrusteeListItem';
import TrusteeListEmptyState from '@/components/trustees/TrusteeListEmptyState';
import AddTrusteeFAB from '@/components/trustees/AddTrusteeFAB';
import AddTrusteeModal from '@/components/trustees/AddTrusteeModal';

// Import Constants & Utilities
import { APP_COLORS as COLORS } from '@/constants/theme';
import { verticalScale, scale } from '@/utils/scaling';
import { SAFE_BOTTOM_PADDING } from './_layout'; // For list padding

const isTablet = Platform.OS === 'web' ? false : (Platform.OS === 'ios' ? !!(Platform as any).isPad : false); // Basic tablet detection

// Define a simple User type for the found user state in the mock search function
interface FoundUser {
    id: string; uniqueId: string; email: string; name: string; phone: string; profileImage: string;
}


export default function TrusteesScreen() {
    const router = useRouter();
    const { trustees, addTrustee, trusteeMessages } = useTrusteeStore();
    const { user } = useAuthStore();
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Animation values
    const modalScale = useSharedValue(0.9);
    const modalOpacity = useSharedValue(0);
    const backdropOpacity = useSharedValue(0);
    const headerOpacity = useSharedValue(0);
    const listTranslateY = useSharedValue(50);
    const fabScale = useSharedValue(1); // Keep FAB animation here

    useEffect(() => {
        headerOpacity.value = withTiming(1, { duration: 800 });
        listTranslateY.value = withSpring(0, { damping: 15 });
        fabScale.value = withRepeat(
            withSequence(withSpring(1.05, { duration: 1500 }), withSpring(1, { duration: 1500 })), -1, false
        );
         // Cleanup
         return () => { fabScale.value = 1; } // Reset scale on unmount
    }, []);

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
            // Form reset is handled inside AddTrusteeModal's useEffect
        }, 350);
    };

    const handleAddTrustee = (trusteeData: Omit<Trustee, 'id' | 'addedAt'>) => {
        addTrustee(trusteeData);
        Alert.alert('Success', 'Trustee added successfully! They will receive an invitation.');
        // closeModal is called within the modal's onSubmit
    };

    // Mock search function passed to the modal
    const findUserByContact = (contact: string): FoundUser | null => {
        if (contact.includes('@') || contact.includes('+') || /^\d{10}$/.test(contact)) {
            return { id: 'found-user', uniqueId: '9876543210', email: contact.includes('@') ? contact : 'found@example.com', name: 'Found User Name', phone: contact.includes('+') ? contact : '+15559998888', profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', };
        }
        return null;
    };

    const handleMessageTrustee = (trusteeId: string) => {
        router.push({ pathname: '/trustee-messenger', params: { trusteeId } });
    };

    const getUnreadCount = (trusteeId: string) => {
        return trusteeMessages.filter(m => m.trusteeId === trusteeId && !m.isRead && m.sender === 'trustee').length;
    };

    // Animated styles
    const animatedHeaderStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
        transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }, { scale: interpolate(headerOpacity.value, [0, 1], [0.9, 1]) }],
    }));
    const animatedListStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: listTranslateY.value }],
        opacity: interpolate(listTranslateY.value, [50, 0], [0, 1]),
    }));
     const animatedBackdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value, }));
     const animatedModalStyle = useAnimatedStyle(() => ({
         opacity: modalOpacity.value,
         transform: [{ scale: modalScale.value }, { translateY: interpolate(modalOpacity.value, [0, 1], [30, 0]) }]
     }));
    const animatedFabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }], }));

    // Memoized Render Item
    const renderTrusteeItem = useCallback(({ item, index }: { item: Trustee; index: number }) => (
        <TrusteeListItem
            item={item}
            index={index}
            unreadCount={getUnreadCount(item.id)}
            onPressMessage={handleMessageTrustee}
        />
    ), [trusteeMessages]); // Re-render if messages change for unread count

    return (
        <SafeAreaView style={styles.container}>
            <TrusteesHeader
                trusteeCount={trustees.length}
                onlineCount={trustees.filter(t => t.isActive).length}
                animatedHeaderStyle={animatedHeaderStyle}
            />
            <UniqueIdCard uniqueId={user?.uniqueId} />

            <Animated.View style={[styles.listContainer, animatedListStyle]}>
                <FlatList
                    data={trustees}
                    renderItem={renderTrusteeItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.listContent, isTablet && styles.tabletListContent, { paddingBottom: SAFE_BOTTOM_PADDING + verticalScale(60) }]} // Add safe padding
                    numColumns={isTablet ? 2 : 1}
                    key={isTablet ? 'tablet-trustees' : 'mobile-trustees'}
                    columnWrapperStyle={isTablet ? styles.row : undefined}
                    ListEmptyComponent={TrusteeListEmptyState} // Use the component
                />
            </Animated.View>

            <AddTrusteeFAB onPress={openModal} animatedFabStyle={animatedFabStyle} />

            <AddTrusteeModal
                isVisible={isModalVisible}
                onClose={closeModal}
                onAddTrustee={handleAddTrustee}
                findUserByContact={findUserByContact}
                animatedBackdropStyle={animatedBackdropStyle}
                animatedModalStyle={animatedModalStyle}
            />
        </SafeAreaView>
    );
}

// Keep only essential container/layout styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Use background color
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: scale(20),
        // paddingBottom handled dynamically in FlatList contentContainerStyle
    },
    tabletListContent: {
        paddingHorizontal: scale(40), // Adjust padding for tablets
    },
    row: { // Style for tablet columns
        justifyContent: 'space-between',
    },
});