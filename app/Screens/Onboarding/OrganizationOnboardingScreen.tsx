import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useTheme, useNavigation, useRoute} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/theme';
import {useAppDispatch} from '../../hooks/useRedux';
import {setOrganization} from '../../Redux/slices/appSlice';
import {authService} from '../../Service/authService';
import {OrganizationType} from '../../types';

interface OrgTypeOption {
  id: OrganizationType;
  title: string;
  description: string;
  icon: string;
}

const ORG_TYPES: OrgTypeOption[] = [
  {
    id: 'brand',
    title: 'Brand',
    description: 'A company promoting products or services through creator partnerships.',
    icon: 'shopping-bag',
  },
  {
    id: 'agency',
    title: 'Agency',
    description: 'A team managing campaigns and creator relationships for clients.',
    icon: 'briefcase',
  },
  {
    id: 'creator_collective',
    title: 'Creator Collective',
    description: 'A group of creators collaborating under one shared organization.',
    icon: 'users',
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'A large organization with advanced campaign and team needs.',
    icon: 'grid',
  },
];

const INDUSTRIES = [
  'Technology',
  'SaaS',
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'Food & Beverage',
  'Health & Wellness',
  'Finance & FinTech',
  'Entertainment & Media',
  'Sports & Fitness',
  'Travel & Hospitality',
  'Education',
  'Automotive',
  'Gaming',
  'E-commerce & Retail',
  'Crypto & Web3',
  'Other',
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
  'Singapore',
  'United Arab Emirates',
  'Other',
];

const TIMEZONES = [
  'America/New_York (UTC-5)',
  'America/Chicago (UTC-6)',
  'America/Los_Angeles (UTC-8)',
  'Europe/London (UTC+0)',
  'Europe/Berlin (UTC+1)',
  'Asia/Dubai (UTC+4)',
  'Asia/Kolkata (UTC+5:30)',
  'Asia/Singapore (UTC+8)',
  'Asia/Tokyo (UTC+9)',
  'Australia/Sydney (UTC+10)',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const OrganizationOnboardingScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();

  const initialName = route.params?.initialName || '';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [orgType, setOrgType] = useState<OrganizationType>('brand');
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(slugify(initialName));
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [timezone, setTimezone] = useState(TIMEZONES[0]);
  const [website, setWebsite] = useState('');

  // Team invites
  const [inviteEmailInput, setInviteEmailInput] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  // Pickers modal
  const [pickerModalType, setPickerModalType] = useState<'industry' | 'country' | 'timezone' | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
    if (errorMessage) setErrorMessage(null);
  };

  const handleAddInvite = () => {
    const trimmed = inviteEmailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!invitedEmails.includes(trimmed)) {
      setInvitedEmails(prev => [...prev, trimmed]);
    }
    setInviteEmailInput('');
    setErrorMessage(null);
  };

  const handleRemoveInvite = (emailToRemove: string) => {
    setInvitedEmails(prev => prev.filter(e => e !== emailToRemove));
  };

  const handleNext = async () => {
    setErrorMessage(null);

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!name.trim()) {
        setErrorMessage('Organization name is required.');
        return;
      }
      if (!slug.trim()) {
        setErrorMessage('Slug identifier is required.');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      setLoading(true);
      try {
        const orgProfile = await authService.completeOrganizationOnboarding({
          type: orgType,
          name: name.trim(),
          slug: slug.trim(),
          industry,
          country,
          timezone,
          website: website.trim() || undefined,
          invitedEmails,
        });

        dispatch(setOrganization(orgProfile));
        setStep(4);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to complete organization setup.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFinish = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Progress & Back */}
      <View style={styles.topNav}>
        {step > 1 && step < 4 ? (
          <TouchableOpacity
            style={[styles.navBtn, {backgroundColor: colors.card, borderColor: colors.borderColor}]}
            onPress={() => setStep((step - 1) as any)}
            activeOpacity={0.8}>
            <FeatherIcon name="arrow-left" size={18} color={colors.title} />
          </TouchableOpacity>
        ) : (
          <View style={{width: 40}} />
        )}

        {/* Step Indicator Pills */}
        <View style={styles.stepPills}>
          {[1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.stepPill,
                {
                  backgroundColor:
                    step >= i ? COLORS.primary : colors.borderColor,
                  width: step === i ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={{width: 40}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        
        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <FeatherIcon name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Step 1: Org Type */}
        {step === 1 && (
          <View style={styles.stepBlock}>
            <View style={styles.headerBlock}>
              <Text style={[styles.stepTitle, {color: colors.title}]}>
                Select Organization Type
              </Text>
              <Text style={[styles.stepSubtitle, {color: colors.textLight}]}>
                Choose the structure that best fits your workflow and campaigns.
              </Text>
            </View>

            <View style={styles.typesList}>
              {ORG_TYPES.map(option => {
                const isSelected = orgType === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected ? COLORS.primary : colors.borderColor,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => setOrgType(option.id)}
                    activeOpacity={0.85}>
                    <View
                      style={[
                        styles.typeIconWrap,
                        {
                          backgroundColor: isSelected
                            ? 'rgba(59, 91, 219, 0.12)'
                            : theme.dark
                            ? '#1E293B'
                            : '#F1F5F9',
                        },
                      ]}>
                      <FeatherIcon
                        name={option.icon}
                        size={22}
                        color={isSelected ? COLORS.primary : colors.textLight}
                      />
                    </View>

                    <View style={styles.typeContent}>
                      <Text
                        style={[
                          styles.typeTitle,
                          {color: isSelected ? COLORS.primary : colors.title},
                        ]}>
                        {option.title}
                      </Text>
                      <Text style={[styles.typeDesc, {color: colors.textLight}]}>
                        {option.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.typeRadio,
                        {
                          borderColor: isSelected ? COLORS.primary : colors.borderColor,
                          backgroundColor: isSelected ? COLORS.primary : 'transparent',
                        },
                      ]}>
                      {isSelected && (
                        <FeatherIcon name="check" size={12} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Org Basic Info */}
        {step === 2 && (
          <View style={styles.stepBlock}>
            <View style={styles.headerBlock}>
              <Text style={[styles.stepTitle, {color: colors.title}]}>
                Organization Profile
              </Text>
              <Text style={[styles.stepSubtitle, {color: colors.textLight}]}>
                Enter your company information and default regional settings.
              </Text>
            </View>

            <View style={styles.form}>
              {/* Org Name */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Organization Name *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}>
                  <TextInput
                    style={[styles.input, {color: colors.title}]}
                    placeholder="Acme Studios"
                    placeholderTextColor={colors.textLight}
                    value={name}
                    onChangeText={handleNameChange}
                  />
                </View>
              </View>

              {/* Slug */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Workspace URL Slug *</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}>
                  <Text style={[styles.slugPrefix, {color: colors.textLight}]}>
                    app/org/
                  </Text>
                  <TextInput
                    style={[styles.input, {color: colors.title}]}
                    placeholder="acme-studios"
                    placeholderTextColor={colors.textLight}
                    autoCapitalize="none"
                    value={slug}
                    onChangeText={setSlug}
                  />
                </View>
              </View>

              {/* Industry Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Industry</Text>
                <TouchableOpacity
                  style={[
                    styles.pickerRow,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}
                  onPress={() => setPickerModalType('industry')}
                  activeOpacity={0.8}>
                  <Text style={[styles.pickerValue, {color: colors.title}]}>
                    {industry}
                  </Text>
                  <FeatherIcon name="chevron-down" size={18} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              {/* Country Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Country</Text>
                <TouchableOpacity
                  style={[
                    styles.pickerRow,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}
                  onPress={() => setPickerModalType('country')}
                  activeOpacity={0.8}>
                  <Text style={[styles.pickerValue, {color: colors.title}]}>
                    {country}
                  </Text>
                  <FeatherIcon name="chevron-down" size={18} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              {/* Timezone Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Timezone</Text>
                <TouchableOpacity
                  style={[
                    styles.pickerRow,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}
                  onPress={() => setPickerModalType('timezone')}
                  activeOpacity={0.8}>
                  <Text style={[styles.pickerValue, {color: colors.title}]} numberOfLines={1}>
                    {timezone}
                  </Text>
                  <FeatherIcon name="chevron-down" size={18} color={colors.textLight} />
                </TouchableOpacity>
              </View>

              {/* Website */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.title}]}>Website URL</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {backgroundColor: colors.card, borderColor: colors.borderColor},
                  ]}>
                  <FeatherIcon
                    name="globe"
                    size={16}
                    color={colors.textLight}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, {color: colors.title}]}
                    placeholder="https://example.com"
                    placeholderTextColor={colors.textLight}
                    keyboardType="url"
                    autoCapitalize="none"
                    value={website}
                    onChangeText={setWebsite}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Team Invites */}
        {step === 3 && (
          <View style={styles.stepBlock}>
            <View style={styles.headerBlock}>
              <Text style={[styles.stepTitle, {color: colors.title}]}>
                Invite Your Team
              </Text>
              <Text style={[styles.stepSubtitle, {color: colors.textLight}]}>
                Add team members or creative partners who will collaborate on video scoring and approvals. (Optional)
              </Text>
            </View>

            <View style={styles.inviteInputRow}>
              <View
                style={[
                  styles.inputContainer,
                  {flex: 1, backgroundColor: colors.card, borderColor: colors.borderColor},
                ]}>
                <FeatherIcon
                  name="mail"
                  size={16}
                  color={colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, {color: colors.title}]}
                  placeholder="colleague@company.com"
                  placeholderTextColor={colors.textLight}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={inviteEmailInput}
                  onChangeText={setInviteEmailInput}
                  onSubmitEditing={handleAddInvite}
                />
              </View>

              <TouchableOpacity
                style={[styles.addEmailBtn, {backgroundColor: COLORS.primary}]}
                onPress={handleAddInvite}
                activeOpacity={0.8}>
                <FeatherIcon name="plus" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Invited Email List */}
            {invitedEmails.length > 0 && (
              <View style={styles.invitedEmailsList}>
                <Text style={[styles.invitedHeading, {color: colors.title}]}>
                  Inviting {invitedEmails.length} member{invitedEmails.length > 1 ? 's' : ''}:
                </Text>
                {invitedEmails.map(email => (
                  <View
                    key={email}
                    style={[
                      styles.invitedEmailChip,
                      {backgroundColor: colors.card, borderColor: colors.borderColor},
                    ]}>
                    <Text style={[styles.invitedEmailText, {color: colors.title}]}>
                      {email}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveInvite(email)}
                      activeOpacity={0.7}>
                      <FeatherIcon name="x" size={16} color={colors.textLight} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <View style={styles.successBlock}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <FeatherIcon name="check" size={36} color="#FFFFFF" />
              </View>
            </View>

            <Text style={[styles.successTitle, {color: colors.title}]}>
              Organization Created!
            </Text>
            <Text style={[styles.successSubtitle, {color: colors.textLight}]}>
              {name} is ready on Context Engine. You can now create brand profiles, upload video versions for instant intelligence scoring, and publish campaigns.
            </Text>

            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: COLORS.primary}]}
              onPress={handleFinish}
              activeOpacity={0.85}>
              <Text style={styles.actionBtnText}>Enter Workspace</Text>
              <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Button for Steps 1-3 */}
        {step < 4 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {backgroundColor: COLORS.primary},
                loading && {opacity: 0.7},
              ]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.85}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.actionBtnText}>
                    {step === 3
                      ? invitedEmails.length > 0
                        ? 'Finish & Send Invites'
                        : 'Finish & Continue'
                      : 'Continue'}
                  </Text>
                  <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {step === 3 && invitedEmails.length === 0 && (
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={handleNext}
                disabled={loading}
                activeOpacity={0.7}>
                <Text style={[styles.skipBtnText, {color: colors.textLight}]}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Select Options Modal (Industry, Country, Timezone) */}
      <Modal
        visible={pickerModalType !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickerModalType(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, {backgroundColor: colors.card}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: colors.title}]}>
                Select {pickerModalType === 'industry' ? 'Industry' : pickerModalType === 'country' ? 'Country' : 'Timezone'}
              </Text>
              <TouchableOpacity onPress={() => setPickerModalType(null)}>
                <FeatherIcon name="x" size={20} color={colors.title} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{maxHeight: 380}}>
              {(pickerModalType === 'industry'
                ? INDUSTRIES
                : pickerModalType === 'country'
                ? COUNTRIES
                : TIMEZONES
              ).map(option => (
                <TouchableOpacity
                  key={option}
                  style={[styles.modalOption, {borderBottomColor: colors.borderColor}]}
                  onPress={() => {
                    if (pickerModalType === 'industry') setIndustry(option);
                    if (pickerModalType === 'country') setCountry(option);
                    if (pickerModalType === 'timezone') setTimezone(option);
                    setPickerModalType(null);
                  }}
                  activeOpacity={0.7}>
                  <Text style={[styles.modalOptionText, {color: colors.title}]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepPill: {
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 20,
  },
  stepTitle: {
    ...FONTS.h3,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  stepSubtitle: {
    ...FONTS.font,
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    gap: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  stepBlock: {
    flex: 1,
  },
  typesList: {
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  typeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  typeDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  typeRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 14,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 4,
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
  slugPrefix: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  pickerValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  inviteInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  addEmailBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitedEmailsList: {
    marginTop: 8,
    gap: 8,
  },
  invitedHeading: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  invitedEmailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  invitedEmailText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    marginTop: 'auto',
    paddingTop: 16,
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  successBlock: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIconOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(59, 91, 219, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    ...FONTS.h3,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    ...FONTS.font,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  modalTitle: {
    ...FONTS.h4,
    fontWeight: '700',
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default OrganizationOnboardingScreen;
