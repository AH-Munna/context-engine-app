import React, {useState} from 'react';
import {
  SafeAreaView,
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
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
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

const LoginScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

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
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* Brand Logo & Name Header */}
          <View style={styles.brandRow}>
            <View style={[styles.brandBadge, {backgroundColor: COLORS.primary}]}>
              <FeatherIcon name="layers" size={18} color="#FFFFFF" />
            </View>
            <Text style={[styles.brandTitle, {color: colors.title}]}>
              Context <Text style={{color: COLORS.primary}}>Engine</Text>
            </Text>
          </View>

          {/* Heading & Subtitle */}
          <Text style={[styles.title, {color: colors.title}]}>Sign In</Text>
          <Text style={[styles.subtitle, {color: colors.textLight}]}>
            Access your Context Engine projects, video intelligence, and collaborations.
          </Text>

          {/* Section Divider */}
          <View style={[styles.divider, {backgroundColor: colors.border || colors.borderColor}]} />

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <FeatherIcon name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {color: colors.title}]}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderColor,
                  },
                ]}>
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="you@company.com"
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

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={[styles.label, {color: colors.title}]}>Password</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
                  activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.borderColor,
                  },
                ]}>
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="Your password"
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

            {/* Sign In CTA Button */}
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
                <>
                  <Text style={styles.primaryBtnText}>Sign In</Text>
                  <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Section Divider */}
          <View style={[styles.divider, {backgroundColor: colors.border || colors.borderColor, marginVertical: 22}]} />

          {/* Footer Register Link */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, {color: colors.textLight}]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}>
              <Text style={styles.signupLinkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 10,
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    ...FONTS.fontNunitoExtraBold,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  title: {
    ...FONTS.fontNunitoExtraBold,
    fontSize: 26,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.font,
    lineHeight: 21,
    marginBottom: 20,
    maxWidth: 320,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
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
    marginBottom: 16,
  },
  label: {
    ...FONTS.fontSm,
    fontWeight: '700',
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
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
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    marginTop: 8,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
  },
  signupLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default LoginScreen;
