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
          isOnboarded: false,
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
          <Text style={[styles.title, {color: colors.title}]}>Create Account</Text>
          <Text style={[styles.subtitle, {color: colors.textLight}]}>
            Join Context Engine to analyze videos, track scores, and collaborate.
          </Text>

          {/* Account Type Segmented Selector */}
          <View style={[styles.segmentedContainer, {borderColor: colors.border || colors.borderColor}]}>
            <TouchableOpacity
              style={[
                styles.segmentTab,
                accountType === 'creator' && {backgroundColor: COLORS.primary},
              ]}
              onPress={() => setAccountType('creator')}
              activeOpacity={0.85}>
              <FeatherIcon
                name="video"
                size={16}
                color={accountType === 'creator' ? '#FFFFFF' : colors.textLight}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  {color: accountType === 'creator' ? '#FFFFFF' : colors.title},
                ]}>
                Creator
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentTab,
                styles.segmentTabRight,
                {borderLeftColor: colors.border || colors.borderColor},
                accountType === 'organization' && {backgroundColor: COLORS.primary},
              ]}
              onPress={() => setAccountType('organization')}
              activeOpacity={0.85}>
              <FeatherIcon
                name="briefcase"
                size={16}
                color={accountType === 'organization' ? '#FFFFFF' : colors.textLight}
              />
              <Text
                style={[
                  styles.segmentTabText,
                  {color: accountType === 'organization' ? '#FFFFFF' : colors.title},
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
                <View style={[styles.inputGroup, {flex: 1}]}>
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
                <View style={[styles.inputGroup, {flex: 1}]}>
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
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="Your password"
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
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                {backgroundColor: COLORS.primary},
                loading && {opacity: 0.7},
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.88}>
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
    paddingTop: 48,
    paddingBottom: 40,
    justifyContent: 'center',
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
  segmentedContainer: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  segmentTabRight: {
    borderLeftWidth: 1.5,
  },
  segmentTabText: {
    ...FONTS.fontNunitoExtraBold,
    fontSize: 13,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    ...FONTS.fontSm,
    fontWeight: '700',
    marginBottom: 6,
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
    marginTop: 10,
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
});

export default RegisterScreen;
