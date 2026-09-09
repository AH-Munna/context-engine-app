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
import {COLORS, FONTS, IMAGES} from '../../constants/theme';
import {useAppDispatch} from '../../hooks/useRedux';
import {setAuthSuccess} from '../../Redux/slices/appSlice';
import {authService} from '../../Service/authService';
import {setStoredAccountType} from '../../Service/api';
import {AccountType} from '../../types';

const RegisterScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState<AccountType>('creator');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    // Basic validation
    if (!email.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (accountType === 'creator' && (!firstName.trim() || !lastName.trim())) {
      setErrorMessage('Please enter both your first and last name.');
      return;
    }

    if (accountType === 'organization' && !organizationName.trim()) {
      setErrorMessage('Please enter your organization or brand name.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Register with backend
      await authService.register({
        email: email.trim(),
        password,
        accountType,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        organizationName: organizationName.trim(),
      });

      // 2. Automatically log in to obtain JWT tokens
      await authService.login(email.trim(), password);

      // 3. Fetch User Profile
      const user = await authService.getCurrentUser();

      // Store initial account type preference
      await setStoredAccountType(user.id, accountType);

      // Update Redux state
      dispatch(
        setAuthSuccess({
          user,
          accountType,
          creator: null,
          organization: null,
        })
      );

      // 4. Navigate directly to the onboarding route based on chosen account type
      if (accountType === 'creator') {
        navigation.reset({
          index: 0,
          routes: [{name: 'CreatorOnboarding'}],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'OrgOnboarding',
              params: {initialName: organizationName.trim()},
            },
          ],
        });
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Registration failed. Try a different email address.'
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
          
          {/* Header */}
          <View style={styles.headerBlock}>
            <View style={[styles.logoWrap, {backgroundColor: theme.dark ? '#182234' : '#EDF2FF'}]}>
              <Image source={IMAGES.logo} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={[styles.title, {color: colors.title}]}>Create Account</Text>
            <Text style={[styles.subtitle, {color: colors.textLight}]}>
              Join Context Engine to analyze videos, track scores, and collaborate.
            </Text>
          </View>

          {/* Account Type Selector */}
          <View style={styles.accountTypeSelector}>
            <TouchableOpacity
              style={[
                styles.accountTypeOption,
                accountType === 'creator' && [
                  styles.accountTypeOptionActive,
                  {borderColor: COLORS.primary, backgroundColor: theme.dark ? '#1E293B' : '#EDF2FF'},
                ],
              ]}
              onPress={() => setAccountType('creator')}
              activeOpacity={0.8}>
              <FeatherIcon
                name="video"
                size={18}
                color={accountType === 'creator' ? COLORS.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.accountTypeText,
                  {color: accountType === 'creator' ? COLORS.primary : colors.title},
                ]}>
                Creator
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.accountTypeOption,
                accountType === 'organization' && [
                  styles.accountTypeOptionActive,
                  {borderColor: COLORS.primary, backgroundColor: theme.dark ? '#1E293B' : '#EDF2FF'},
                ],
              ]}
              onPress={() => setAccountType('organization')}
              activeOpacity={0.8}>
              <FeatherIcon
                name="briefcase"
                size={18}
                color={accountType === 'organization' ? COLORS.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.accountTypeText,
                  {color: accountType === 'organization' ? COLORS.primary : colors.title},
                ]}>
                Organization
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <FeatherIcon name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {accountType === 'creator' ? (
              <View style={styles.nameRow}>
                {/* First Name */}
                <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                  <Text style={[styles.label, {color: colors.title}]}>First Name</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {backgroundColor: colors.card, borderColor: colors.borderColor},
                    ]}>
                    <TextInput
                      style={[styles.input, {color: colors.title}]}
                      placeholder="Jane"
                      placeholderTextColor={colors.textLight}
                      value={firstName}
                      onChangeText={setFirstName}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Last Name */}
                <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                  <Text style={[styles.label, {color: colors.title}]}>Last Name</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {backgroundColor: colors.card, borderColor: colors.borderColor},
                    ]}>
                    <TextInput
                      style={[styles.input, {color: colors.title}]}
                      placeholder="Doe"
                      placeholderTextColor={colors.textLight}
                      value={lastName}
                      onChangeText={setLastName}
                      editable={!loading}
                    />
                  </View>
                </View>
              </View>
            ) : (
              /* Organization Name */
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Organization Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}>
                  <FeatherIcon
                    name="building"
                    size={18}
                    color={colors.textLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, {color: colors.title}]}
                    placeholder="Acme Studios, Brand Co…"
                    placeholderTextColor={colors.textLight}
                    value={organizationName}
                    onChangeText={setOrganizationName}
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {color: colors.title}]}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  {backgroundColor: colors.card, borderColor: colors.borderColor},
                ]}>
                <FeatherIcon
                  name="mail"
                  size={18}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="you@company.com"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {color: colors.title}]}>Password (8+ chars)</Text>
              <View
                style={[
                  styles.inputContainer,
                  {backgroundColor: colors.card, borderColor: colors.borderColor},
                ]}>
                <FeatherIcon
                  name="lock"
                  size={18}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="Create password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
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

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {color: colors.title}]}>Confirm Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  {backgroundColor: colors.card, borderColor: colors.borderColor},
                ]}>
                <FeatherIcon
                  name="check-circle"
                  size={18}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="Re-enter password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                {backgroundColor: COLORS.primary},
                loading && {opacity: 0.7},
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Create Account</Text>
                  <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Back to Login Link */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, {color: colors.textLight}]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.7}>
              <Text style={styles.signupLinkText}>Sign In</Text>
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
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    ...FONTS.h3,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    ...FONTS.fontSm,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  accountTypeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  accountTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  accountTypeOptionActive: {},
  accountTypeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  form: {
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    ...FONTS.fontXs,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
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
    height: 50,
    borderRadius: 14,
    marginTop: 10,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  signupLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default RegisterScreen;
