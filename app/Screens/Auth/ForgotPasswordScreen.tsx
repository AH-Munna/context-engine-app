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
  StatusBar,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/theme';

const ForgotPasswordScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      // Simulate API call for password reset request
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit reset request.');
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
        
        {/* Back Button Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.backBtn, {backgroundColor: colors.card, borderColor: colors.borderColor}]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <FeatherIcon name="arrow-left" size={20} color={colors.title} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerBlock}>
            <View style={[styles.iconWrap, {backgroundColor: theme.dark ? '#182234' : COLORS.primaryLight}]}>
              <FeatherIcon name="key" size={28} color={COLORS.primary} />
            </View>
            <Text style={[styles.title, {color: colors.title}]}>Reset Password</Text>
            <Text style={[styles.subtitle, {color: colors.textLight}]}>
              Enter the email address associated with your account and we will send you password reset instructions.
            </Text>
          </View>

          {errorMessage && (
            <View style={styles.errorBanner}>
              <FeatherIcon name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {submitted ? (
            <View style={[styles.successCard, {backgroundColor: colors.card, borderColor: colors.borderColor}]}>
              <View style={styles.successIcon}>
                <FeatherIcon name="check-circle" size={32} color="#10B981" />
              </View>
              <Text style={[styles.successTitle, {color: colors.title}]}>Instructions Sent</Text>
              <Text style={[styles.successBody, {color: colors.textLight}]}>
                If an account exists for {email.trim()}, you will receive an email with reset instructions shortly.
              </Text>
              <TouchableOpacity
                style={[styles.primaryBtn, {backgroundColor: COLORS.primary}]}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>Return to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
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

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  {backgroundColor: COLORS.primary},
                  loading && {opacity: 0.7},
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryBtnText}>Send Reset Link</Text>
                    <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
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
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...FONTS.h3,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.font,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...FONTS.fontSm,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
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
  successCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 12,
  },
  successTitle: {
    ...FONTS.h4,
    fontWeight: '700',
    marginBottom: 8,
  },
  successBody: {
    ...FONTS.font,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;
