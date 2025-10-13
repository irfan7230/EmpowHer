// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { 
  Home, 
  Users, 
  Shield, 
  MessageCircle, 
  MapPin,
  LucideIcon 
} from 'lucide-react-native';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Platform,
  TouchableOpacity,
  StatusBar,
  Keyboard
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling function
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Export these constants for other screens
export const BOTTOM_NAV_HEIGHT = SCREEN_WIDTH < 375 ? moderateScale(70) : moderateScale(75);
export const BOTTOM_NAV_MARGIN = Platform.OS === 'ios' ? moderateScale(16) : moderateScale(8);
export const SAFE_BOTTOM_PADDING = BOTTOM_NAV_HEIGHT + BOTTOM_NAV_MARGIN;

const responsive = {
  tabBarHeight: BOTTOM_NAV_HEIGHT,
  tabBarWidth: SCREEN_WIDTH - scale(32),
  borderRadius: moderateScale(25),
  iconSize: moderateScale(22),
  bottomSpace: BOTTOM_NAV_MARGIN,
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getTabIcon = (routeName: string): LucideIcon => {
    switch (routeName) {
      case 'index': return Home;
      case 'trustees': return Users;
      case 'community': return MapPin;
      case 'trustee-dashboard': return Shield;
      case 'ai-assistant': return MessageCircle;
      default: return Home;
    }
  };

  // Hide tab bar when keyboard is visible
  if (isKeyboardVisible) {
    return (
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#FFB3BA" 
        translucent={false} 
      />
    );
  }

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#FFB3BA" 
        translucent={false} 
      />
      <View style={styles.tabBarWrapper} pointerEvents="box-none">
        <View 
          style={[
            styles.tabBarContainer,
            {
              width: responsive.tabBarWidth,
              height: responsive.tabBarHeight,
              borderRadius: responsive.borderRadius,
              bottom: responsive.bottomSpace,
            }
          ]}
        >
          {/* Tab Items */}
          <View style={styles.tabItemsContainer}>
            {state.routes.map((route: any, index: number) => {
              const isFocused = state.index === index;
              const Icon = getTabIcon(route.name);
              
              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              
              return (
                <View key={route.key} style={styles.tabItem}>
                  <TouchableOpacity
                    onPress={onPress}
                    style={[
                      styles.tabButton,
                      isFocused && styles.activeTabButton
                    ]}
                    activeOpacity={0.7}
                  >
                    <Icon 
                      size={responsive.iconSize} 
                      color={isFocused ? '#FFFFFF' : '#9CA3AF'}
                      strokeWidth={isFocused ? 2.5 : 2}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="trustees" options={{ title: 'Trustees' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="trustee-dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="ai-assistant" options={{ title: 'AI Chat' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  tabBarContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFB3BA',
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItemsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: scale(16),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  activeTabButton: {
    backgroundColor: '#FFB3BA',
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});