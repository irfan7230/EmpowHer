import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSOSStore } from '@/stores/useSOSStore';
import { useTrusteeStore } from '@/stores/useTrusteeStore';
import { useCommunityStore } from '@/stores/useCommunityStore';
import { Bell, MessageCircle, MapPin, Shield, Users, Clock, Phone, Mic, Eye, Zap, CheckCircle, AlertTriangle, Volume2, Plus } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { Href } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import { SAFE_BOTTOM_PADDING } from './_layout';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

// Responsive scaling
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// MOCK DATA FOR TRUSTEE STATUSES
const mockTrusteesWithStatus = [
    { id: '1', name: 'Jane Doe', isActive: true, profileImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg', status: { id: 's1', image: '...', timestamp: '5m ago' } },
    { id: '2', name: 'John Smith', isActive: true, profileImage: 'https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg', status: null },
    { id: '3', name: 'Sam Wilson', isActive: false, profileImage: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg', status: { id: 's2', image: '...', timestamp: '2h ago' } },
    { id: '4', name: 'Emily Ray', isActive: true, profileImage: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg', status: null }
];

export default function HomeScreen() {
  // Zustand stores
  const { user } = useAuthStore();
  const { sosStatus, activateSOS, isLocationSharing, toggleLocationSharing } = useSOSStore();
  const { trustees, trusteeMessages } = useTrusteeStore();
  const { communityAlerts } = useCommunityStore();

  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const insets = useSafeAreaInsets();

  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const sosButtonScale = useSharedValue(1);
  const sosButtonPulse = useSharedValue(0);
  const bellShake = useSharedValue(0);
  const fabScale = useSharedValue(0);

  const unreadCount = trusteeMessages.filter(m => !m.isRead).length;

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700 });
    contentTranslateY.value = withSpring(0, { damping: 18, stiffness: 100 });
    sosButtonPulse.value = withRepeat(withSequence(withTiming(1, { duration: 1500 }), withTiming(0, { duration: 1500 })), -1, true);
    
    // Animate FAB entrance
    setTimeout(() => {
      fabScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, 800);
    
    if (unreadCount > 0) {
      bellShake.value = withRepeat(withSequence(withTiming(10, { duration: 80 }), withTiming(-10, { duration: 80 }), withTiming(10, { duration: 80 }), withTiming(0, { duration: 80 })), 2, true);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [trusteeMessages]);

  const handleSOSPress = () => {
    sosButtonScale.value = withSequence(withSpring(0.9, { duration: 150 }), withSpring(1.1, { duration: 200 }), withSpring(1, { duration: 150 }));
    setTimeout(() => {
      if (sosStatus.isActive) {
        Alert.alert('Deactivate SOS', 'An OTP is required to deactivate an active SOS. Please contact a trustee.', [{ text: 'Understood' }]);
      } else {
        activateSOS();
        Alert.alert('SOS Activated', 'Your emergency alert has been sent to your trustees and nearby community members.', [{ text: 'OK' }]);
      }
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'location': toggleLocationSharing(); break;
      case 'check-in': Alert.alert('Safety Check-in', 'A check-in message has been sent to your trustees!'); break;
      case 'fake-call': Alert.alert('Fake Call', 'Initiating a fake call in 5 seconds...'); break;
      case 'ai-help': router.push('/(tabs)/ai-assistant'); break;
    }
  };

  const handleFABPress = () => {
    fabScale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 150 })
    );
    router.push('/(tabs)/trustees');
  };
  
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }],
  }));
  
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: interpolate(contentTranslateY.value, [50, 0], [0, 1])
  }));

  const animatedSOSButtonStyle = useAnimatedStyle(() => {
    const isActive = sosStatus.isActive;
    const pulseScale = isActive ? interpolate(sosButtonPulse.value, [0, 1], [1, 1.15]) : interpolate(sosButtonPulse.value, [0, 1], [1, 1.05]);
    const backgroundColor = isActive ? interpolateColor(sosButtonPulse.value, [0, 1], ['#D32F2F', '#FF1744']) : interpolateColor(sosButtonPulse.value, [0, 1], ['#FF7E86', '#FF5A64']);
    return { transform: [{ scale: sosButtonScale.value * pulseScale }], backgroundColor, shadowOpacity: interpolate(sosButtonPulse.value, [0, 1], [0.3, 0.6]) };
  });

  const animatedBellStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${bellShake.value}deg` }],
  }));

  const animatedFABStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View style={[styles.header, animatedHeaderStyle, { paddingTop: insets.top }]}>
          <View style={styles.headerTopRow}>
              <TouchableOpacity 
                style={styles.profileContainer} 
                onPress={() => router.push('/(screens)/profile' as Href)}
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
                    <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/')}>
                    <Bell size={moderateScale(24)} color="#FFFFFF" />
                    {unreadCount > 0 && (<View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>{unreadCount}</Text></View>)}
                    </TouchableOpacity>
                </Animated.View>
              </View>
          </View>
          <StatusCarousel trustees={mockTrusteesWithStatus} user={user} />
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: SAFE_BOTTOM_PADDING + moderateScale(60) }
        ]}
      >
        <Animated.View style={animatedContentStyle}>
          <View style={styles.sosSection}>
            <Animated.View style={[styles.sosButtonContainer, animatedSOSButtonStyle]}>
              <TouchableOpacity onPress={handleSOSPress} activeOpacity={0.8} style={styles.sosButton}>
                <Text style={styles.sosButtonText}>SOS</Text>
                {sosStatus.isActive && <Text style={styles.sosActiveText}>ACTIVE</Text>}
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.sosDescription}>{sosStatus.isActive ? 'Alert is active. Help is on the way.' : 'Press for immediate assistance'}</Text>
          </View>
          <SafetyStatusCard sosStatus={sosStatus} isLocationSharing={isLocationSharing} trustees={trustees} currentTime={currentTime}/>
          <QuickActions onAction={handleQuickAction} isLocationSharing={isLocationSharing} />
          <NetworkStats trustees={trustees} />
          {communityAlerts.length > 0 && <CommunityActivity alerts={communityAlerts} />}
          <VoiceCommandInfo />
        </Animated.View>
      </ScrollView>
      
      {/* Elevated Floating Action Button */}
      <Animated.View 
        style={[
          styles.fabContainer,
          animatedFABStyle,
          { bottom: SAFE_BOTTOM_PADDING + moderateScale(16) }
        ]}
      >
        <TouchableOpacity 
          style={[styles.messengerButton, styles.elevatedFAB]} 
          onPress={handleFABPress}
          activeOpacity={0.8}
        >
          <MessageCircle size={moderateScale(28)} color="#FFFFFF" />
          {unreadCount > 0 && (
            <View style={styles.messengerBadge}>
              <Text style={styles.messengerBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// --- SUB-COMPONENTS ---
const StatusCarousel = ({ trustees, user }: any) => {
    const router = useRouter();
    return (
        <View style={styles.statusCarouselContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(16) }}>
                <TouchableOpacity style={styles.statusItem} onPress={() => Alert.alert('Add Status', 'This will open the status update screen.')}>
                    <View style={styles.statusCircle}>
                        <Image source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.statusImage} />
                        <View style={styles.plusIconContainer}><Plus size={moderateScale(18)} color="#FFFFFF" /></View>
                    </View>
                    <Text style={styles.statusLabel}>My Status</Text>
                </TouchableOpacity>
                {trustees.map((trustee: any) => (
                    <TouchableOpacity key={trustee.id} style={styles.statusItem} onPress={() => trustee.status && Alert.alert(`View ${trustee.name.split(' ')[0]}'s Status`, `Viewing status from ${trustee.status.timestamp}`)}>
                        <View style={[styles.statusCircle, trustee.status && styles.activeStatusCircle]}>
                            <Image source={{ uri: trustee.profileImage }} style={styles.statusImage} />
                        </View>
                        <Text style={styles.statusLabel} numberOfLines={1}>{trustee.name.split(' ')[0]}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.statusItem} onPress={() => router.push('/(tabs)/trustees')}>
                    <View style={[styles.statusCircle, styles.addStatusCircle]}><Users size={moderateScale(24)} color="#FF8A95" /></View>
                    <Text style={styles.statusLabel}>Add Trustee</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const VoiceCommandInfo = () => (
    <View style={[styles.card, styles.voiceCard]}>
        <Mic size={moderateScale(24)} color="#8B5CF6" />
        <View style={{flex: 1, marginLeft: scale(12)}}>
            <Text style={styles.voiceTitle}>Voice Command</Text>
            <Text style={styles.voiceDescription}>Say "Hey EmpowHer, help" for hands-free SOS</Text>
        </View>
        <View style={styles.voiceListeningIndicator}>
            <Volume2 size={moderateScale(14)} color="#8B5CF6" />
        </View>
    </View>
);

const SafetyStatusCard = ({ sosStatus, isLocationSharing, trustees, currentTime }: any) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Shield size={moderateScale(22)} color={sosStatus.isActive ? '#FF1744' : '#10B981'} />
            <Text style={styles.cardTitle}>Safety Status</Text>
            <View style={[styles.safetyIndicator, { backgroundColor: sosStatus.isActive ? '#FFD2D2' : '#D1FAE5' }]}>
                <Text style={[styles.safetyIndicatorText, { color: sosStatus.isActive ? '#C53030' : '#065F46' }]}>
                    {sosStatus.isActive ? 'EMERGENCY' : 'SAFE'}
                </Text>
            </View>
        </View>
        <View style={styles.safetyDetails}>
            <InfoRow icon={MapPin} text={`Location: ${isLocationSharing ? 'Sharing' : 'Private'}`} />
            <InfoRow icon={Users} text={`${trustees.filter((t: any) => t.isActive).length} trustees online`} />
            <InfoRow icon={Clock} text={`Last check: ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} />
        </View>
    </View>
);

const QuickActions = ({ onAction, isLocationSharing }: any) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
            <QuickActionButton icon={MapPin} text={isLocationSharing ? 'Stop' : 'Share'} onPress={() => onAction('location')} color={isLocationSharing ? "#10B981" : "#FF5A64"} />
            <QuickActionButton icon={CheckCircle} text="Check-in" onPress={() => onAction('check-in')} color="#6366F1" />
            <QuickActionButton icon={Phone} text="Fake Call" onPress={() => onAction('fake-call')} color="#8B5CF6" />
            <QuickActionButton icon={MessageCircle} text="AI Help" onPress={() => onAction('ai-help')} color="#F59E0B" />
        </View>
    </View>
);

const NetworkStats = ({ trustees }: any) => {
    const nearbyUsers = 47;
    const avgResponseTime = '2.3';
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Safety Network</Text>
            <View style={styles.statsGrid}>
                <StatItem icon={Users} value={trustees.length} label="Trustees" color="#FF5A64" />
                <StatItem icon={Eye} value={nearbyUsers} label="Nearby" color="#10B981" />
                <StatItem icon={Zap} value={`${avgResponseTime}m`} label="Response" color="#6366F1" />
            </View>
        </View>
    );
};

const CommunityActivity = ({ alerts }: any) => (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Community Activity</Text>
        {alerts.slice(0, 2).map((alert: any) => (
            <View key={alert.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                    <AlertTriangle size={moderateScale(20)} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.activityText}>{alert.userName} requested help</Text>
                    <Text style={styles.activitySubText}>{`📍 Near ${alert.location.address}`}</Text>
                </View>
                <Text style={styles.activityTime}>{`${Math.floor((Date.now() - alert.timestamp.getTime()) / 60000)}m ago`}</Text>
            </View>
        ))}
    </View>
);

const InfoRow = ({ icon: Icon, text }: any) => (
    <View style={styles.infoRow}>
        <Icon size={moderateScale(16)} color="#6B7280" />
        <Text style={styles.infoRowText}>{text}</Text>
    </View>
);

const QuickActionButton = ({ icon: Icon, text, onPress, color }: any) => (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
        <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
            <Icon size={isSmallDevice ? moderateScale(20) : moderateScale(24)} color="#FFFFFF" />
        </View>
        <Text style={styles.quickActionText}>{text}</Text>
    </TouchableOpacity>
);

const StatItem = ({ icon: Icon, value, label, color }: any) => (
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

// --- STYLESHEET (keeping all existing styles) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { },
  header: { 
    backgroundColor: '#FFB3BA', 
    paddingBottom: verticalScale(16), 
    borderBottomLeftRadius: moderateScale(24), 
    borderBottomRightRadius: moderateScale(24), 
    elevation: 4, 
    shadowColor: '#FF8A95', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8 
  },
  headerTopRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: scale(20), 
    paddingTop: verticalScale(16) 
  },
  profileContainer: { marginRight: scale(16) },
  profileImage: { 
    width: moderateScale(50), 
    height: moderateScale(50), 
    borderRadius: moderateScale(25), 
    borderWidth: 3, 
    borderColor: '#FFFFFF' 
  },
  headerCenter: { flex: 1 },
  greeting: { 
    fontSize: moderateScale(24), 
    fontFamily: 'Inter-Bold', 
    color: '#FFFFFF', 
    marginBottom: 2 
  },
  timeText: { 
    fontSize: moderateScale(14), 
    fontFamily: 'Inter-Regular', 
    color: '#FFFFFF', 
    opacity: 0.9 
  },
  headerRight: { alignItems: 'center' },
  notificationButton: { position: 'relative', padding: scale(8) },
  notificationBadge: { 
    position: 'absolute', 
    top: verticalScale(4), 
    right: scale(4), 
    backgroundColor: '#FF1744', 
    borderRadius: moderateScale(10), 
    minWidth: moderateScale(20), 
    height: moderateScale(20), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#FFFFFF' 
  },
  notificationBadgeText: { 
    fontSize: moderateScale(10), 
    fontFamily: 'Inter-Bold', 
    color: '#FFFFFF' 
  },
  statusCarouselContainer: { paddingTop: verticalScale(20) },
  statusItem: { alignItems: 'center' },
  statusCircle: { 
    width: moderateScale(72), 
    height: moderateScale(72), 
    borderRadius: moderateScale(36), 
    borderWidth: 2.5, 
    borderColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: verticalScale(8) 
  },
  activeStatusCircle: { borderColor: '#FF7E86' },
  statusImage: { 
    width: moderateScale(64), 
    height: moderateScale(64), 
    borderRadius: moderateScale(32) 
  },
  plusIconContainer: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    backgroundColor: '#FF8A95', 
    width: moderateScale(26), 
    height: moderateScale(26), 
    borderRadius: moderateScale(13), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#FFB3BA' 
  },
  addStatusCircle: { 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    borderColor: 'rgba(255, 255, 255, 0.7)' 
  },
  statusLabel: { 
    fontSize: moderateScale(12), 
    fontFamily: 'Inter-Medium', 
    color: '#FFFFFF', 
    textShadowColor: 'rgba(0, 0, 0, 0.2)', 
    textShadowOffset: {width: 0, height: 1}, 
    textShadowRadius: 2 
  },
  sosSection: { 
    alignItems: 'center', 
    marginTop: verticalScale(24), 
    marginBottom: verticalScale(16), 
    paddingHorizontal: scale(16) 
  },
  sosButtonContainer: { 
    width: width * 0.55, 
    height: width * 0.55, 
    borderRadius: width * 0.275, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#FF8A95', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowRadius: 20, 
    elevation: 12 
  },
  sosButton: { 
    width: '100%', 
    height: '100%', 
    borderRadius: width * 0.275, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sosButtonText: { 
    fontSize: isSmallDevice ? moderateScale(32) : moderateScale(40), 
    fontFamily: 'Inter-Bold', 
    color: '#FFFFFF', 
    letterSpacing: 2 
  },
  sosActiveText: { 
    fontSize: moderateScale(12), 
    fontFamily: 'Inter-Bold', 
    color: '#FFFFFF', 
    letterSpacing: 1, 
    position: 'absolute', 
    bottom: '25%' 
  },
  sosDescription: { 
    fontSize: moderateScale(14), 
    fontFamily: 'Inter-Regular', 
    color: '#6B7280', 
    marginTop: verticalScale(16), 
    textAlign: 'center' 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: moderateScale(20), 
    padding: scale(16), 
    marginBottom: verticalScale(16), 
    marginHorizontal: scale(16), 
    ...Platform.select({ 
      ios: { 
        shadowColor: '#D1D5DB', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 8 
      }, 
      android: { 
        elevation: 3, 
        borderColor: '#F3F4F6', 
        borderWidth: 1 
      } 
    }) 
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: verticalScale(12) 
  },
  cardTitle: { 
    fontSize: moderateScale(18), 
    fontFamily: 'Inter-Bold', 
    color: '#1F2937', 
    marginLeft: scale(8), 
    flex: 1 
  },
  safetyIndicator: { 
    paddingHorizontal: scale(12), 
    paddingVertical: verticalScale(6), 
    borderRadius: moderateScale(16) 
  },
  safetyIndicatorText: { 
    fontSize: moderateScale(10), 
    fontFamily: 'Inter-Bold' 
  },
  safetyDetails: { 
    paddingTop: verticalScale(8), 
    gap: verticalScale(8) 
  },
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  infoRowText: { 
    marginLeft: scale(12), 
    fontSize: moderateScale(14), 
    fontFamily: 'Inter-Regular', 
    color: '#4B5563' 
  },
  quickActionsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: verticalScale(8) 
  },
  quickActionButton: { 
    alignItems: 'center', 
    paddingVertical: verticalScale(8), 
    width: (width - scale(32) - scale(32)) / 4 
  },
  quickActionIcon: { 
    width: moderateScale(52), 
    height: moderateScale(52), 
    borderRadius: moderateScale(26), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: verticalScale(8) 
  },
  quickActionText: { 
    fontSize: moderateScale(12), 
    fontFamily: 'Inter-Medium', 
    color: '#374151', 
    textAlign: 'center' 
  },
  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: verticalScale(8) 
  },
  statItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: scale(8) 
  },
  statIcon: { 
    width: moderateScale(40), 
    height: moderateScale(40), 
    borderRadius: moderateScale(20), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  statValue: { 
    fontSize: moderateScale(18), 
    fontFamily: 'Inter-Bold', 
    color: '#1F2937' 
  },
  statLabel: { 
    fontSize: moderateScale(12), 
    fontFamily: 'Inter-Regular', 
    color: '#6B7280' 
  },
  activityItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: verticalScale(12), 
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6' 
  },
  activityIcon: { 
    width: moderateScale(40), 
    height: moderateScale(40), 
    borderRadius: moderateScale(20), 
    backgroundColor: '#FEE2E2', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: scale(12) 
  },
  activityText: { 
    fontSize: moderateScale(14), 
    fontFamily: 'Inter-Medium', 
    color: '#374151' 
  },
  activitySubText: { 
    fontSize: moderateScale(12), 
    fontFamily: 'Inter-Regular', 
    color: '#6B7280' 
  },
  activityTime: { 
    fontSize: moderateScale(12), 
    fontFamily: 'Inter-Regular', 
    color: '#9CA3AF' 
  },
  voiceCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5F3FF' 
  },
  voiceTitle: { 
    fontSize: moderateScale(15), 
    fontFamily: 'Inter-Bold', 
    color: '#5B21B6' 
  },
  voiceDescription: { 
    fontSize: moderateScale(13), 
    fontFamily: 'Inter-Regular', 
    color: '#6D28D9', 
    marginTop: 2 
  },
  voiceListeningIndicator: { 
    width: moderateScale(32), 
    height: moderateScale(32), 
    borderRadius: moderateScale(16), 
    backgroundColor: 'rgba(139, 92, 246, 0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  // Updated FAB styles
  fabContainer: { 
    position: 'absolute',
    right: scale(20),
    zIndex: 1000,
  },
  messengerButton: { 
    width: moderateScale(64), 
    height: moderateScale(64), 
    borderRadius: moderateScale(32), 
    backgroundColor: '#FF5A64', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#FF1744', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 12,
    elevation: 12
  },
  elevatedFAB: {
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  messengerBadge: { 
    position: 'absolute', 
    top: -4, 
    right: -4, 
    backgroundColor: '#FFFFFF', 
    minWidth: moderateScale(24), 
    height: moderateScale(24), 
    borderRadius: moderateScale(12), 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF5A64',
    paddingHorizontal: scale(6),
  },
  messengerBadgeText: { 
    color: '#FF1744', 
    fontSize: moderateScale(11), 
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
});