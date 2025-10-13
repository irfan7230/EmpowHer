import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Pressable,
  Keyboard,
  Vibration,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { signupSchema, otpSchema } from '@/validation/schemas';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Mail, Phone, User, KeyRound, ChevronLeft, RotateCcw, Clock, Check, Star, ArrowRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  BounceIn,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive sizing
const getResponsiveSize = () => {
  const baseWidth = 375;
  const scale = SCREEN_WIDTH / baseWidth;
  
  return {
    isSmallDevice: SCREEN_WIDTH < 375,
    isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLargeDevice: SCREEN_WIDTH >= 414,
    scale: Math.min(scale, 1.3),
    
    logoSize: SCREEN_WIDTH < 375 ? 70 : SCREEN_WIDTH < 414 ? 80 : 90,
    titleSize: SCREEN_WIDTH < 375 ? 26 : SCREEN_WIDTH < 414 ? 30 : 32,
    subtitleSize: SCREEN_WIDTH < 375 ? 13 : SCREEN_WIDTH < 414 ? 14 : 15,
    otpBoxWidth: SCREEN_WIDTH < 375 ? 42 : SCREEN_WIDTH < 414 ? 48 : 52,
    otpBoxHeight: SCREEN_WIDTH < 375 ? 52 : SCREEN_WIDTH < 414 ? 58 : 62,
    otpFontSize: SCREEN_WIDTH < 375 ? 20 : SCREEN_WIDTH < 414 ? 24 : 26,
    horizontalPadding: SCREEN_WIDTH < 375 ? 20 : SCREEN_WIDTH < 414 ? 24 : 28,
  };
};

const responsive = getResponsiveSize();

type Stage = 'enter-details' | 'enter-otp';

// Mock API functions
const mockApi = {
  requestOtp: async (isSignUp: boolean, email: string, name?: string, phone?: string): Promise<{ success: boolean; message: string }> => {
    console.log(`Requesting OTP for ${isSignUp ? 'sign-up' : 'sign-in'}:`, { email, name, phone });
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: 'OTP sent successfully!' };
  },
  verifyOtp: async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    console.log('Verifying OTP:', { email, otp });
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (otp === '123456') {
      return { success: true, message: 'Verification successful!' };
    }
    return { success: false, message: 'Invalid OTP. Please try again.' };
  },
};

// Floating Shape Component
const FloatingShape = ({ delay = 0, startX = 0, startY = 0, color = '#FFB3BA' }) => {
  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startY - 30, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(startY, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + 20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
          withTiming(startX, { duration: 4000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000 }),
          withTiming(0.3, { duration: 2000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.floatingShape, animatedStyle, { backgroundColor: color }]} />
  );
};

export default function AuthScreen() {
  // Zustand store
  const { login, signup } = useAuthStore();
  const router = useRouter();
  
  // State Management
  const [isSignUp, setIsSignUp] = useState(true);
  const [stage, setStage] = useState<Stage>('enter-details');
  const [storedEmail, setStoredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Animations
  const buttonScale = useSharedValue(1);
  const shakeAnimation = useSharedValue(0);
  const formSlideAnimation = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const glowAnimation = useSharedValue(0);
  const switchAnimation = useSharedValue(isSignUp ? 0 : 1);

  // Details form with Yup validation
  const detailsForm = useValidatedForm({
    schema: signupSchema,
    initialValues: {
      name: '',
      phone: '',
      email: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      buttonScale.value = withSpring(0.95);

      const result = await mockApi.requestOtp(isSignUp, values.email, values.name, values.phone);
      setIsLoading(false);
      buttonScale.value = withSpring(1);
      
      if (result.success) {
        setStoredEmail(values.email);
        setStage('enter-otp');
        setCountdown(60);
        setCanResend(false);
        setTimeout(() => otpRefs.current[0]?.focus(), 500);
      } else {
        Alert.alert('Error', result.message);
      }
    },
    validateOnChange: false,
    validateOnBlur: true,
    context: { isSignUp },
  });

  // OTP form with Yup validation
  const otpForm = useValidatedForm({
    schema: otpSchema,
    initialValues: {
      otp: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      buttonScale.value = withSpring(0.95);
      
      const result = await mockApi.verifyOtp(storedEmail, values.otp);
      setIsLoading(false);
      buttonScale.value = withSpring(1);
      
      if (result.success) {
        setVerificationSuccess(true);
        Vibration.vibrate([100, 200, 100]);
        setTimeout(() => {
          if (isSignUp) {
            signup(storedEmail);
          } else {
            login(storedEmail, 'mock_token');
          }
          router.replace('/(tabs)');
        }, 2000);
      } else {
        shakeAnimation.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
        Vibration.vibrate(200);
        otpForm.resetForm();
        setTimeout(() => otpRefs.current[0]?.focus(), 100);
        Alert.alert('Verification Failed', result.message);
      }
    },
  });

  React.useEffect(() => {
    logoRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    glowAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Countdown timer
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (stage === 'enter-otp' && countdown > 0 && !canResend) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, countdown, canResend]);

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    const result = await mockApi.requestOtp(isSignUp, storedEmail);
    setIsResending(false);
    
    if (result.success) {
      setCountdown(60);
      setCanResend(false);
      otpForm.resetForm();
      Vibration.vibrate(100);
      Alert.alert('Success', 'New OTP sent successfully!');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  };
  
  const handleSwitchAuthMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    switchAnimation.value = withSpring(newMode ? 0 : 1);
    formSlideAnimation.value = withSequence(
      withTiming(50, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    detailsForm.resetForm();
    Vibration.vibrate(50);
  };

  const handleBackToDetails = () => {
    setStage('enter-details');
    otpForm.resetForm();
    setCountdown(60);
    setCanResend(false);
    setVerificationSuccess(false);
    Vibration.vibrate(50);
  };

  // OTP Input Handler
  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    let newOtp = otpForm.values.otp;
    const otpArray = newOtp.split('');
    
    // Handle paste
    if (text.length > 1) {
      const pastedDigits = text.slice(0, 6).split('');
      const newOtpValue = pastedDigits.join('').padEnd(6, '');
      otpForm.setFieldValue('otp', newOtpValue.slice(0, 6));
      const nextIndex = Math.min(pastedDigits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single digit
    otpArray[index] = text;
    const newOtpValue = otpArray.join('');
    otpForm.setFieldValue('otp', newOtpValue);

    // Auto-focus next input
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    const otpArray = otpForm.values.otp.split('');
    if (key === 'Backspace' && !otpArray[index] && index > 0) {
      otpArray[index - 1] = '';
      otpForm.setFieldValue('otp', otpArray.join(''));
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Animated Styles
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }]
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${logoRotation.value}deg` },
      { scale: withSpring(1 + glowAnimation.value * 0.05) }
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnimation.value, [0, 1], [0.3, 0.8]),
    transform: [{ scale: interpolate(glowAnimation.value, [0, 1], [1, 1.2]) }],
  }));

  const formSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formSlideAnimation.value }],
    opacity: interpolate(formSlideAnimation.value, [0, 50], [1, 0.8]),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#FFF0F1" 
        translucent={false} 
      />
      <LinearGradient
        colors={['#FFF8F9', '#FFF0F1', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Animated Background Shapes */}
        {stage === 'enter-details' && (
          <>
            <FloatingShape delay={0} startX={-50} startY={100} color="#FFE0E6" />
            <FloatingShape delay={500} startX={SCREEN_WIDTH - 100} startY={200} color="#FFD6DA" />
            <FloatingShape delay={1000} startX={50} startY={SCREEN_HEIGHT - 200} color="#FFC4CA" />
            <FloatingShape delay={1500} startX={SCREEN_WIDTH - 80} startY={SCREEN_HEIGHT - 300} color="#FFB3BA" />
          </>
        )}

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable style={styles.content} onPress={Keyboard.dismiss}>
              {/* Back Button for OTP Screen */}
              {stage === 'enter-otp' && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.backContainer}>
                  <Pressable
                    style={styles.backButton}
                    onPress={handleBackToDetails}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <ChevronLeft size={20} color="#FF8A95" />
                    <Text style={styles.backText}>Go Back</Text>
                  </Pressable>
                </Animated.View>
              )}

              {/* Header Section for Details Screen */}
              {stage === 'enter-details' && (
                <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
                  <View style={styles.logoWrapper}>
                    {/* Glow Effect */}
                    <Animated.View style={[styles.logoGlow, glowAnimatedStyle]} />
                    
                    {/* Logo Container */}
                    <Animated.View 
                      entering={BounceIn.delay(200).duration(1000)} 
                      style={[styles.logoContainer, logoAnimatedStyle, { width: responsive.logoSize, height: responsive.logoSize }]}
                    >
                      <Image
                        source={require('../assets/images/icon.png')}
                        style={{
                          width: responsive.logoSize * 1.2,
                          height: responsive.logoSize * 1.2,
                        }}
                        resizeMode="contain"
                      />
                    </Animated.View>
                    
                    {/* Sparkle Effects */}
                    <Animated.View 
                      entering={ZoomIn.delay(800).duration(500)}
                      style={[styles.sparkle, styles.sparkle1]}
                    >
                      <Star size={12} color="#FF8A95" fill="#FF8A95" />
                    </Animated.View>
                    <Animated.View 
                      entering={ZoomIn.delay(1000).duration(500)}
                      style={[styles.sparkle, styles.sparkle2]}
                    >
                      <Star size={8} color="#FF69B4" fill="#FF69B4" />
                    </Animated.View>
                    <Animated.View 
                      entering={ZoomIn.delay(1200).duration(500)}
                      style={[styles.sparkle, styles.sparkle3]}
                    >
                      <Star size={10} color="#FFB3BA" fill="#FFB3BA" />
                    </Animated.View>
                  </View>
                  
                  <MaskedView
                    maskElement={
                      <Text style={[styles.title, { fontSize: responsive.titleSize }]}>
                        EmpowHer
                      </Text>
                    }
                  >
                    <LinearGradient
                      colors={['#D14D72', '#FF69B4', '#FF8A95']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={[styles.title, styles.maskedTitle, { fontSize: responsive.titleSize }]}>
                        EmpowHer
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                  
                  <Animated.Text 
                    entering={FadeIn.delay(400).duration(800)}
                    style={[styles.subtitle, { fontSize: responsive.subtitleSize }]}
                  >
                    Safe, Secure, and Connected
                  </Animated.Text>
                  
                  {/* Tab Switcher */}
                  <Animated.View 
                    entering={SlideInRight.delay(600).duration(500)}
                    style={styles.tabSwitcher}
                  >
                    <TouchableOpacity
                      style={[styles.tab, !isSignUp && styles.activeTab]}
                      onPress={() => !isSignUp || handleSwitchAuthMode()}
                    >
                      <Text style={[styles.tabText, !isSignUp && styles.activeTabText]}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tab, isSignUp && styles.activeTab]}
                      onPress={() => isSignUp || handleSwitchAuthMode()}
                    >
                      <Text style={[styles.tabText, isSignUp && styles.activeTabText]}>Sign Up</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </Animated.View>
              )}

              {/* Header Section for OTP Screen */}
              {stage === 'enter-otp' && (
                <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
                  <Animated.View entering={BounceIn.delay(200)} style={[styles.logoContainer, { width: responsive.logoSize, height: responsive.logoSize }]}>
                    <KeyRound size={responsive.logoSize * 0.5} color="#FF8A95" />
                  </Animated.View>
                  <Text style={[styles.title, { fontSize: responsive.titleSize }]}>
                    Verify Your Identity
                  </Text>
                  <Text style={[styles.subtitle, { fontSize: responsive.subtitleSize }]}>
                    {`Enter the 6-digit code sent to\n${storedEmail}`}
                  </Text>
                </Animated.View>
              )}

              {/* Form Container */}
              <View style={styles.formContainer}>
                {/* Details Form */}
                {stage === 'enter-details' && (
                  <Animated.View 
                    entering={SlideInRight.duration(500)}
                    exiting={SlideOutLeft.duration(300)}
                    style={[styles.form, shakeStyle, formSlideStyle]}
                  >
                    {isSignUp && (
                      <>
                        <EnhancedInputBox 
                          icon={User} 
                          placeholder="Full Name" 
                          value={detailsForm.values.name || ''} 
                          onChangeText={(text) => detailsForm.setFieldValue('name', text)}
                          onFocus={() => {
                            setFocusedInput('name');
                            detailsForm.setFieldTouched('name', false);
                          }}
                          onBlur={() => {
                            setFocusedInput(null);
                            detailsForm.setFieldTouched('name', true);
                          }}
                          isFocused={focusedInput === 'name'}
                          error={detailsForm.touched.name ? detailsForm.errors.name : undefined}
                          delay={800}
                        />
                        <EnhancedInputBox 
                          icon={Phone} 
                          placeholder="Phone Number" 
                          value={detailsForm.values.phone || ''} 
                          onChangeText={(text) => detailsForm.setFieldValue('phone', text)}
                          keyboardType="phone-pad"
                          onFocus={() => {
                            setFocusedInput('phone');
                            detailsForm.setFieldTouched('phone', false);
                          }}
                          onBlur={() => {
                            setFocusedInput(null);
                            detailsForm.setFieldTouched('phone', true);
                          }}
                          isFocused={focusedInput === 'phone'}
                          error={detailsForm.touched.phone ? detailsForm.errors.phone : undefined}
                          delay={900}
                        />
                      </>
                    )}
                    <EnhancedInputBox 
                      icon={Mail} 
                      placeholder="Email Address" 
                      value={detailsForm.values.email} 
                      onChangeText={(text) => detailsForm.setFieldValue('email', text)}
                      keyboardType="email-address"
                      onFocus={() => {
                        setFocusedInput('email');
                        detailsForm.setFieldTouched('email', false);
                      }}
                      onBlur={() => {
                        setFocusedInput(null);
                        detailsForm.setFieldTouched('email', true);
                      }}
                      isFocused={focusedInput === 'email'}
                      error={detailsForm.touched.email ? detailsForm.errors.email : undefined}
                      delay={isSignUp ? 1000 : 800}
                    />
                    
                    <Animated.View 
                      entering={FadeIn.delay(isSignUp ? 1100 : 900).duration(500)}
                      style={animatedButtonStyle}
                    >
                      <TouchableOpacity
                        style={styles.authButton}
                        onPress={() => detailsForm.handleSubmit()}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#FF8A95', '#FF69B4']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.gradientButton}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                          ) : (
                            <>
                              <Text style={styles.authButtonText}>
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                              </Text>
                              <View style={styles.buttonIconWrapper}>
                                <ArrowRight size={20} color="#FFFFFF" />
                              </View>
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>

                    {/* Social Login Options */}
                    <Animated.View 
                      entering={FadeIn.delay(isSignUp ? 1200 : 1000).duration(500)}
                      style={styles.dividerContainer}
                    >
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>or continue with</Text>
                      <View style={styles.dividerLine} />
                    </Animated.View>

                    <Animated.View 
                      entering={FadeIn.delay(isSignUp ? 1300 : 1100).duration(500)}
                      style={styles.socialContainer}
                    >
                      <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                        <LinearGradient
                          colors={['#FFFFFF', '#FFF8F9']}
                          style={styles.socialGradient}
                        >
                          <Text style={styles.socialIcon}>G</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                        <LinearGradient
                          colors={['#FFFFFF', '#FFF8F9']}
                          style={styles.socialGradient}
                        >
                          <Text style={styles.socialIcon}>f</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>
                )}
                
                {/* OTP Form */}
                {stage === 'enter-otp' && !verificationSuccess && (
                  <Animated.View 
                    entering={SlideInRight.delay(200).duration(500)}
                    style={[styles.form, styles.otpForm, shakeStyle]}
                  >
                    <View style={styles.otpWrapper}>
                      <View style={styles.otpContainer}>
                        {[0, 1, 2, 3, 4, 5].map((index) => {
                          const digit = otpForm.values.otp[index] || '';
                          return (
                            <Animated.View 
                              key={index}
                              entering={ZoomIn.delay(300 + index * 50).duration(300)}
                              style={styles.otpBoxWrapper}
                            >
                              <View style={[
                                styles.otpBox,
                                { 
                                  width: responsive.otpBoxWidth, 
                                  height: responsive.otpBoxHeight 
                                },
                                digit && styles.otpBoxFilled,
                                otpRefs.current[index]?.isFocused?.() && styles.otpBoxFocused
                              ]}>
                                <TextInput
                                  ref={ref => { otpRefs.current[index] = ref; }}
                                  style={[styles.otpInput, { fontSize: responsive.otpFontSize }]}
                                  value={digit}
                                  onChangeText={(text) => handleOtpChange(text, index)}
                                  onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                                  keyboardType="number-pad"
                                  maxLength={7}
                                  textAlign="center"
                                  selectTextOnFocus
                                />
                                {digit && (
                                  <Animated.View 
                                    entering={ZoomIn.duration(200)}
                                    style={styles.digitDot}
                                  />
                                )}
                              </View>
                            </Animated.View>
                          );
                        })}
                      </View>
                    </View>
                    
                    {otpForm.errors.otp && otpForm.touched.otp && (
                      <Text style={styles.errorText}>{otpForm.errors.otp}</Text>
                    )}
                    
                    <View style={styles.resendContainer}>
                      {!canResend ? (
                        <Animated.View 
                          entering={FadeIn.delay(500)}
                          style={styles.timerContainer}
                        >
                          <Clock size={16} color="#9CA3AF" />
                          <Text style={styles.timerText}>
                            Resend code in {countdown}s
                          </Text>
                        </Animated.View>
                      ) : (
                        <TouchableOpacity 
                          style={styles.resendButton} 
                          onPress={handleResendOtp}
                          disabled={isResending}
                        >
                          <RotateCcw size={16} color="#FF8A95" />
                          <Text style={styles.resendText}>
                            {isResending ? 'Sending...' : 'Resend Code'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <Animated.View style={[animatedButtonStyle, styles.verifyButtonContainer]}>
                      <TouchableOpacity
                        style={styles.authButton}
                        onPress={() => otpForm.handleSubmit()}
                        disabled={isLoading}
                      >
                        <LinearGradient
                          colors={['#FF8A95', '#FF69B4']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.gradientButton}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                          ) : (
                            <>
                              <Text style={styles.authButtonText}>Verify & Continue</Text>
                              <Check size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  </Animated.View>
                )}

                {/* Success State */}
                {verificationSuccess && (
                  <Animated.View 
                    entering={ZoomIn.duration(500)}
                    style={styles.successContainer}
                  >
                    <View style={[styles.successCircle, { width: responsive.logoSize * 1.5, height: responsive.logoSize * 1.5 }]}>
                      <Check size={responsive.logoSize * 0.8} color="#4ADE80" />
                    </View>
                    <Text style={styles.successText}>Verification Successful!</Text>
                    <Text style={styles.redirectText}>Redirecting to your dashboard...</Text>
                    <ActivityIndicator color="#FF8A95" style={styles.successLoader} />
                  </Animated.View>
                )}
              </View>

              {/* Footer Text */}
              {stage === 'enter-details' && (
                <Animated.View entering={FadeIn.delay(1400).duration(500)} style={styles.footerContainer}>
                  <Text style={styles.footerText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.footerLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                  </Text>
                </Animated.View>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Enhanced Input Component with Animations
interface EnhancedInputBoxProps {
  icon: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
  delay?: number;
  keyboardType?: any;
  error?: string;
}

const EnhancedInputBox: React.FC<EnhancedInputBoxProps> = ({ 
  icon: Icon, 
  isFocused = false, 
  delay = 0,
  onFocus,
  onBlur,
  error,
  ...props 
}) => {
  const focusAnimation = useSharedValue(0);
  const iconRotation = useSharedValue(0);

  React.useEffect(() => {
    focusAnimation.value = withSpring(isFocused ? 1 : 0);
    if (isFocused) {
      iconRotation.value = withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  }, [isFocused]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusAnimation.value,
      [0, 1],
      ['#F1D4D4', '#FF8A95']
    ),
    backgroundColor: interpolateColor(
      focusAnimation.value,
      [0, 1],
      ['#FFFFFF', '#FFF8F9']
    ),
    transform: [
      { scale: interpolate(focusAnimation.value, [0, 1], [1, 1.02]) }
    ],
    shadowOpacity: interpolate(focusAnimation.value, [0, 1], [0.08, 0.15]),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${iconRotation.value}deg` },
      { scale: interpolate(focusAnimation.value, [0, 1], [1, 1.2]) }
    ],
    opacity: interpolate(focusAnimation.value, [0, 1], [0.5, 1]),
  }));

  return (
    <Animated.View 
      entering={FadeIn.delay(delay).duration(400)}
      style={styles.inputContainer}
    >
      <Animated.View style={[styles.inputWrapper, animatedInputStyle]}>
        <Animated.View style={iconAnimatedStyle}>
          <Icon size={20} color={isFocused ? '#FF8A95' : '#9CA3AF'} />
        </Animated.View>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
        />
        {isFocused && props.value && (
          <Animated.View entering={ZoomIn.duration(200)}>
            <Check size={16} color="#4ADE80" />
          </Animated.View>
        )}
      </Animated.View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </Animated.View>
  );
};

// Styles (keeping all existing styles exactly as they were)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F9',
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT - 100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsive.horizontalPadding,
    paddingVertical: 20,
  },
  backContainer: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: -10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8A95',
    marginLeft: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: responsive.scale * 32,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  logoContainer: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8A95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  logoGlow: {
    position: 'absolute',
    width: responsive.logoSize * 1.5,
    height: responsive.logoSize * 1.5,
    borderRadius: 999,
    backgroundColor: '#FF8A95',
    top: '50%',
    left: '50%',
    marginLeft: -(responsive.logoSize * 1.5) / 2,
    marginTop: -(responsive.logoSize * 1.5) / 2,
    zIndex: -1,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -10,
    right: -10,
  },
  sparkle2: {
    top: 20,
    left: -15,
  },
  sparkle3: {
    bottom: -5,
    right: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#D14D72',
    marginBottom: 8,
    textAlign: 'center',
  },
  maskedTitle: {
    opacity: 0,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 4,
    marginTop: 24,
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 22,
  },
  activeTab: {
    backgroundColor: '#FF8A95',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    width: '100%',
  },
  otpForm: {
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F1D4D4',
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#FFB3BA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  authButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: '#FF8A95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  buttonIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
    borderRadius: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    paddingHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  socialGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1D4D4',
    borderRadius: 16,
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  footerContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#FF8A95',
    fontWeight: '600',
  },
  floatingShape: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.3,
  },
  otpWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsive.isSmallDevice ? 6 : responsive.isMediumDevice ? 8 : 10,
  },
  otpBoxWrapper: {
    alignItems: 'center',
  },
  otpBox: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  otpBoxFocused: {
    borderColor: '#FF8A95',
    shadowColor: '#FF8A95',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: '#FFF8F9',
    borderWidth: 2.5,
  },
  otpBoxFilled: {
    borderColor: '#FF8A95',
    backgroundColor: '#FFF0F1',
    borderWidth: 2.5,
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  digitDot: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF8A95',
  },
  resendContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#FFF0F1',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFD6DA',
  },
  resendText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8A95',
    marginLeft: 8,
  },
  verifyButtonContainer: {
    width: '100%',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  successCircle: {
    borderRadius: 999,
    backgroundColor: '#E6FFFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#4ADE80',
  },
  successText: {
    fontSize: responsive.isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 8,
  },
  redirectText: {
    fontSize: responsive.isSmallDevice ? 14 : 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  successLoader: {
    marginTop: 10,
  },
});