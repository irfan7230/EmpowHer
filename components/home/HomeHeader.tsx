// components/home/HomeHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Bell, Users, Plus } from 'lucide-react-native';
import { User } from '@/types/app'; // Assuming User type definition
import { moderateScale, verticalScale, scale } from '@/utils/scaling';
import { APP_COLORS as COLORS } from '@/constants/theme'; // Use APP_COLORS

// Re-create the StatusCarousel sub-component locally or import if extracted
interface StatusCarouselProps {
  trustees: any[]; // Use a more specific type if available
  user: User | null;
}
const StatusCarousel: React.FC<StatusCarouselProps> = ({ trustees, user }) => {
    const router = useRouter();
    return (
        <View style={styles.statusCarouselContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(16) }}>
                {/* My Status */}
                <TouchableOpacity style={styles.statusItem} onPress={() => Alert.alert('Add Status', 'This will open the status update screen.')}>
                    <View style={styles.statusCircle}>
                        <Image source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.statusImage} />
                        <View style={styles.plusIconContainer}><Plus size={moderateScale(18)} color="#FFFFFF" /></View>
                    </View>
                    <Text style={styles.statusLabel}>My Status</Text>
                </TouchableOpacity>
                {/* Trustee Statuses */}
                {trustees.map((trustee: any) => (
                    <TouchableOpacity key={trustee.id} style={styles.statusItem} onPress={() => trustee.status && Alert.alert(`View ${trustee.name.split(' ')[0]}'s Status`, `Viewing status from ${trustee.status.timestamp}`)}>
                        <View style={[styles.statusCircle, trustee.status && styles.activeStatusCircle]}>
                            <Image source={{ uri: trustee.profileImage }} style={styles.statusImage} />
                        </View>
                        <Text style={styles.statusLabel} numberOfLines={1}>{trustee.name.split(' ')[0]}</Text>
                    </TouchableOpacity>
                ))}
                {/* Add Trustee */}
                <TouchableOpacity style={styles.statusItem} onPress={() => router.push('/(tabs)/trustees')}>
                    <View style={[styles.statusCircle, styles.addStatusCircle]}><Users size={moderateScale(24)} color={COLORS.primaryDark} /></View>
                    <Text style={styles.statusLabel}>Add Trustee</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};


interface HomeHeaderProps {
  user: User | null;
  currentTime: Date;
  unreadCount: number;
  animatedHeaderStyle: any;
  animatedBellStyle: any;
  mockTrusteesWithStatus: any[]; // Pass mock data as prop
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  user,
  currentTime,
  unreadCount,
  animatedHeaderStyle,
  animatedBellStyle,
  mockTrusteesWithStatus,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View style={[styles.header, animatedHeaderStyle, { paddingTop: insets.top }]}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push('/(screens)/profile')} // Cast needed if using typed routes
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.timeText}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <View style={styles.headerRight}>
          <Animated.View style={animatedBellStyle}>
            <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/')}> {/* TODO: Update navigation target */}
              <Bell size={moderateScale(24)} color="#FFFFFF" />
              {unreadCount > 0 && (<View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>{unreadCount}</Text></View>)}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <StatusCarousel trustees={mockTrusteesWithStatus} user={user} />
    </Animated.View>
  );
};

// Copy relevant styles from index.tsx here
const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.primary, paddingBottom: verticalScale(16), borderBottomLeftRadius: moderateScale(24), borderBottomRightRadius: moderateScale(24), elevation: 4, shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: scale(20), paddingTop: verticalScale(16) },
  profileContainer: { marginRight: scale(16) },
  profileImage: { width: moderateScale(50), height: moderateScale(50), borderRadius: moderateScale(25), borderWidth: 3, borderColor: '#FFFFFF' },
  headerCenter: { flex: 1 },
  greeting: { fontSize: moderateScale(24), fontFamily: 'Inter-Bold', color: '#FFFFFF', marginBottom: 2 },
  timeText: { fontSize: moderateScale(14), fontFamily: 'Inter-Regular', color: '#FFFFFF', opacity: 0.9 },
  headerRight: { alignItems: 'center' },
  notificationButton: { position: 'relative', padding: scale(8) },
  notificationBadge: { position: 'absolute', top: verticalScale(4), right: scale(4), backgroundColor: '#FF1744', borderRadius: moderateScale(10), minWidth: moderateScale(20), height: moderateScale(20), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  notificationBadgeText: { fontSize: moderateScale(10), fontFamily: 'Inter-Bold', color: '#FFFFFF' },
  statusCarouselContainer: { paddingTop: verticalScale(20) },
  statusItem: { alignItems: 'center' },
  statusCircle: { width: moderateScale(72), height: moderateScale(72), borderRadius: moderateScale(36), borderWidth: 2.5, borderColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(8) },
  activeStatusCircle: { borderColor: '#FF7E86' },
  statusImage: { width: moderateScale(64), height: moderateScale(64), borderRadius: moderateScale(32) },
  plusIconContainer: { position: 'absolute', bottom: -2, right: -2, backgroundColor: COLORS.primaryDark, width: moderateScale(26), height: moderateScale(26), borderRadius: moderateScale(13), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
  addStatusCircle: { borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(255, 255, 255, 0.7)' },
  statusLabel: { fontSize: moderateScale(12), fontFamily: 'Inter-Medium', color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2 },
});

export default HomeHeader;