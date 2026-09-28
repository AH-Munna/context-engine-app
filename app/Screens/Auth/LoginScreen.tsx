import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS, IMAGES, SIZES} from '../../constants/theme';
import {useAppDispatch} from '../../hooks/useRedux';
import {setAuthSuccess} from '../../Redux/slices/appSlice';
import {authService} from '../../Service/authService';
import {getStoredAccountType} from '../../Service/api';
import {AccountType} from '../../types';

import {
  getStoredOrgOnboardingComplete,
  setStoredOrgOnboardingComplete,
  isOrgOnboardingComplete,
  hasOrganizationCompletedOnboarding,
  resolvePostAuthRoute,
} from '../../utils/accountType';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const HERO_HEIGHT = Math.max(SCREEN_HEIGHT * 0.38, 260);

const LoginScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Authenticate with backend
      await authService.login(email.trim(), password);

      // 2. Fetch User Profile
      const user = await authService.getCurrentUser();

      // 3. Fetch Creator Profile (if exists)
      const creator = await authService.getCreatorProfile();

      // 4. Fetch Organization Profile (if exists)
      const organization = await authService.getOrganizationProfile();

      // 5. Check stored account type & org completion status
      const storedAccountType = (await getStoredAccountType(user.id)) as AccountType | null;
      const storedOrgComplete = await getStoredOrgOnboardingComplete(user.id);
      const isOrgComplete = isOrgOnboardingComplete(user.id, organization, storedOrgComplete);
      if (hasOrganizationCompletedOnboarding(organization)) {
        await setStoredOrgOnboardingComplete(user.id);
      }

      const effectiveAccountType: AccountType | null = organization
        ? 'organization'
        : creator
        ? 'creator'
        : storedAccountType;

      const isOnboarded = !!creator || isOrgComplete;

      // Update Redux state
      dispatch(
        setAuthSuccess({
          user,
          creator,
          organization,
          accountType: effectiveAccountType,
          isOnboarded,
        })
      );

      // Determine target destination matching web resolvePostAuthPath
      const targetRoute = resolvePostAuthRoute({
        accountType: effectiveAccountType,
        hasCreatorProfile: !!creator,
        hasCompletedOrgOnboarding: isOrgComplete,
      });

      navigation.reset({
        index: 0,
        routes: [{name: targetRoute}],
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Incorrect email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, {backgroundColor: COLORS.primary}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}>
          {/* Hero */}
          <View style={[styles.hero, {height: HERO_HEIGHT + insets.top}]}>
            <View style={[styles.angularShape, styles.angularShapeLarge]} />
            <View style={[styles.angularShape, styles.angularShapeSmall]} />

            <View style={[styles.heroContent, {paddingTop: insets.top + 16}]}>
              <Text style={styles.wordmark}>
                Context <Text style={styles.wordmarkAccent}>Engine</Text>
              </Text>

              <View style={styles.headlineBlock}>
                <Text style={styles.headlineLine}>Your creative</Text>
                <View style={styles.headlineBox}>
                  <Text style={styles.headlineBoxed}>context engine</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Form sheet */}
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                paddingBottom: Math.max(insets.bottom, 24) + 16,
              },
            ]}>
            {errorMessage && (
              <View style={styles.errorBanner}>
                <FeatherIcon name="alert-circle" size={18} color="#EF4444" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.dark ? colors.background : COLORS.white,
                      borderColor: colors.borderColor,
                    },
                  ]}>
                  <TextInput
                    style={[styles.input, {color: colors.title}]}
                    placeholder="Email"
                    placeholderTextColor={colors.textLight}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={val => {
                      setEmail(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: theme.dark ? colors.background : COLORS.white,
                      borderColor: colors.borderColor,
                    },
                  ]}>
                  <TextInput
                    style={[styles.input, {color: colors.title}]}
                    placeholder="Password"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={val => {
                      setPassword(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}>
                    <FeatherIcon
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={colors.textLight}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
                style={styles.forgotLink}>
                <Text style={styles.forgotPasswordText}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  {backgroundColor: COLORS.primary},
                  loading && {opacity: 0.7},
                ]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.88}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>Log In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, {color: colors.textLight}]}>
                Need an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}>
                <Text style={styles.signupLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.orRow}>
              <View
                style={[
                  styles.orLine,
                  {backgroundColor: colors.borderColor},
                ]}
              />
              <Text style={[styles.orText, {color: colors.textLight}]}>or</Text>
              <View
                style={[
                  styles.orLine,
                  {backgroundColor: colors.borderColor},
                ]}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: theme.dark ? colors.background : COLORS.white,
                  borderColor: colors.borderColor,
                },
              ]}
              onPress={() => {}}
              activeOpacity={0.88}>
              <Image source={IMAGES.google} style={styles.socialIcon} />
              <Text style={[styles.socialBtnText, {color: colors.title}]}>
                Log in using Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialBtn,
                {
                  backgroundColor: theme.dark ? colors.background : COLORS.white,
                  borderColor: colors.borderColor,
                },
              ]}
              onPress={() => {}}
              activeOpacity={0.88}>
              <FeatherIcon name="key" size={18} color={colors.title} />
              <Text style={[styles.socialBtnText, {color: colors.title}]}>
                Log in using SSO
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  angularShape: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  angularShapeLarge: {
    width: SCREEN_HEIGHT * 0.55,
    height: SCREEN_HEIGHT * 0.55,
    right: -SCREEN_HEIGHT * 0.18,
    top: -SCREEN_HEIGHT * 0.08,
    borderRadius: 28,
    transform: [{rotate: '28deg'}],
  },
  angularShapeSmall: {
    width: 140,
    height: 140,
    left: -50,
    bottom: 40,
    borderRadius: 18,
    transform: [{rotate: '-18deg'}],
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 48,
    zIndex: 1,
  },
  wordmark: {
    ...FONTS.fontNunitoExtraBold,
    fontSize: 18,
    letterSpacing: -0.3,
    color: COLORS.white,
  },
  wordmarkAccent: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  headlineBlock: {
    gap: 10,
    marginBottom: 8,
  },
  headlineLine: {
    ...FONTS.fontNunitoExtraBold,
    fontSize: SIZES.h1 + 6,
    lineHeight: 40,
    letterSpacing: -0.6,
    color: COLORS.white,
  },
  headlineBox: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radius_sm,
    transform: [{rotate: '-2deg'}],
  },
  headlineBoxed: {
    ...FONTS.fontNunitoExtraBold,
    fontSize: SIZES.h1 + 4,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: COLORS.title,
  },
  sheet: {
    flexGrow: 1,
    marginTop: -28,
    borderTopLeftRadius: SIZES.radius_md,
    borderTopRightRadius: SIZES.radius_md,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 18,
    gap: 10,
  },
  errorText: {
    ...FONTS.fontSm,
    color: '#EF4444',
    fontWeight: '600',
    flex: 1,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  forgotLink: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    marginTop: 2,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
  },
  signupLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  orText: {
    ...FONTS.fontSm,
    fontWeight: '600',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: SIZES.radius,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 10,
    paddingHorizontal: 16,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
