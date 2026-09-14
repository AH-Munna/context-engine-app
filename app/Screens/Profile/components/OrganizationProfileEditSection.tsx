import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import {COLORS} from '../../../constants/theme';
import {OrganizationProfile, OrganizationType} from '../../../types';
import {uploadFile, MAX_IMAGE_UPLOAD_MB} from '../../../Service/uploadService';
import {useAppDispatch} from '../../../hooks/useRedux';
import {updateOrganizationThunk} from '../../../Redux/slices/appSlice';

interface OrganizationProfileEditSectionProps {
  organization: OrganizationProfile;
}

const ORG_TYPES: {id: OrganizationType; title: string; icon: string}[] = [
  {id: 'brand', title: 'Brand', icon: 'shopping-bag'},
  {id: 'agency', title: 'Agency', icon: 'briefcase'},
  {id: 'creator_collective', title: 'Creator Collective', icon: 'users'},
  {id: 'enterprise', title: 'Enterprise', icon: 'grid'},
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

export function slugifyOrganizationName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export const OrganizationProfileEditSection: React.FC<
  OrganizationProfileEditSectionProps
> = ({organization}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const dispatch = useAppDispatch();

  const slugEditedRef = useRef(false);

  const [orgType, setOrgType] = useState<OrganizationType>(
    organization.type || 'brand',
  );
  const [name, setName] = useState(organization.name || '');
  const [slug, setSlug] = useState(organization.slug || '');
  const [logoUrl, setLogoUrl] = useState(organization.logo_url || '');
  const [website, setWebsite] = useState(organization.website || '');
  const [industry, setIndustry] = useState(organization.industry || '');
  const [industryOther, setIndustryOther] = useState('');
  const [country, setCountry] = useState(organization.country || '');
  const [timezone, setTimezone] = useState(organization.timezone || '');

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Pickers modal states
  const [industryModalOpen, setIndustryModalOpen] = useState(false);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [timezoneModalOpen, setTimezoneModalOpen] = useState(false);

  useEffect(() => {
    setOrgType(organization.type || 'brand');
    setName(organization.name || '');
    setSlug(organization.slug || '');
    setLogoUrl(organization.logo_url || '');
    setWebsite(organization.website || '');
    setIndustry(organization.industry || '');
    setCountry(organization.country || '');
    setTimezone(organization.timezone || '');
    slugEditedRef.current = true;
  }, [organization]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugEditedRef.current) {
      setSlug(slugifyOrganizationName(val));
    }
  };

  const handleSlugChange = (val: string) => {
    slugEditedRef.current = true;
    setSlug(val.toLowerCase());
  };

  const handlePickLogo = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.8,
      },
      async response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        setUploading(true);
        setStatusMessage(null);
        try {
          const publicUrl = await uploadFile(
            asset.uri,
            asset.fileName,
            asset.type,
          );
          setLogoUrl(publicUrl);
          setStatusMessage({
            type: 'success',
            text: 'Organization logo uploaded successfully!',
          });
        } catch (err: any) {
          Alert.alert(
            'Upload Failed',
            err.message || 'Could not upload logo. Please try again.',
          );
        } finally {
          setUploading(false);
        }
      },
    );
  };

  const handleApplyLogoUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed) {
      Alert.alert('Invalid URL', 'Please enter a logo image URL.');
      return;
    }
    setLogoUrl(trimmed);
    setShowUrlInput(false);
    setUrlDraft('');
    setStatusMessage({
      type: 'success',
      text: 'Logo image URL applied!',
    });
  };

  const handleReset = () => {
    setOrgType(organization.type || 'brand');
    setName(organization.name || '');
    setSlug(organization.slug || '');
    setLogoUrl(organization.logo_url || '');
    setWebsite(organization.website || '');
    setIndustry(organization.industry || '');
    setCountry(organization.country || '');
    setTimezone(organization.timezone || '');
    setStatusMessage(null);
  };

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert('Validation', 'Organization name must be at least 2 characters.');
      return;
    }
    if (!slug.trim()) {
      Alert.alert('Validation', 'Organization slug is required.');
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const resolvedIndustry =
      industry === 'Other' && industryOther.trim()
        ? industryOther.trim()
        : industry;

    try {
      await dispatch(
        updateOrganizationThunk({
          type: orgType,
          name: name.trim(),
          slug: slug.trim(),
          logo_url: logoUrl.trim() || null,
          website: website.trim() || null,
          industry: resolvedIndustry.trim() || null,
          country: country.trim() || null,
          timezone: timezone.trim() || null,
        }),
      ).unwrap();

      setStatusMessage({
        type: 'success',
        text: 'Organization profile updated successfully!',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err || 'Failed to update organization profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.sectionRoot}>
      {/* Title & Description */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: colors.title}]}>
          Organization Profile
        </Text>
        <Text style={[styles.sectionDesc, {color: colors.textLight}]}>
          Manage company branding, public workspace details, and settings.
        </Text>
      </View>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <View
          style={[
            styles.statusBanner,
            statusMessage.type === 'success'
              ? styles.statusSuccess
              : styles.statusError,
          ]}>
          <FeatherIcon
            name={
              statusMessage.type === 'success' ? 'check-circle' : 'alert-circle'
            }
            size={16}
            color={statusMessage.type === 'success' ? '#10B981' : '#EF4444'}
          />
          <Text
            style={[
              styles.statusText,
              {
                color:
                  statusMessage.type === 'success' ? '#047857' : '#B91C1C',
              },
            ]}>
            {statusMessage.text}
          </Text>
        </View>
      )}

      {/* Logo Section */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Organization Logo
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          Shown on projects, team invitations, and client reports.
        </Text>

        <View style={styles.avatarRow}>
          <View style={styles.avatarWrap}>
            {uploading ? (
              <View
                style={[
                  styles.logoPlaceholder,
                  {backgroundColor: colors.background},
                ]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : logoUrl ? (
              <Image
                source={{uri: logoUrl}}
                style={styles.logoImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.logoPlaceholder,
                  {backgroundColor: COLORS.primary},
                ]}>
                <Text style={styles.logoInitialText}>
                  {(name || 'O').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={handlePickLogo}
              disabled={uploading || saving}>
              <FeatherIcon name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarActionsCol}>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {borderColor: colors.borderColor, backgroundColor: colors.background},
                ]}
                onPress={handlePickLogo}
                disabled={uploading || saving}>
                <FeatherIcon name="upload" size={14} color={colors.title} />
                <Text style={[styles.actionBtnText, {color: colors.title}]}>
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {borderColor: colors.borderColor, backgroundColor: colors.background},
                ]}
                onPress={() => setShowUrlInput(!showUrlInput)}
                disabled={uploading || saving}>
                <FeatherIcon name="link" size={14} color={colors.title} />
                <Text style={[styles.actionBtnText, {color: colors.title}]}>
                  Use URL
                </Text>
              </TouchableOpacity>

              {Boolean(logoUrl) && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeBtn]}
                  onPress={() => setLogoUrl('')}
                  disabled={uploading || saving}>
                  <FeatherIcon name="trash-2" size={14} color="#EF4444" />
                  <Text style={[styles.actionBtnText, {color: '#EF4444'}]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {showUrlInput && (
              <View style={styles.urlInputRow}>
                <TextInput
                  style={[
                    styles.urlInput,
                    {
                      color: colors.title,
                      borderColor: colors.borderColor,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="https://example.com/logo.png"
                  placeholderTextColor={colors.textLight}
                  value={urlDraft}
                  onChangeText={setUrlDraft}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyLogoUrl}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={[styles.helpHint, {color: colors.textLight}]}>
              Recommended: Square image up to {MAX_IMAGE_UPLOAD_MB} MB.
            </Text>
          </View>
        </View>
      </View>

      {/* Organization Type Selector */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Organization Type
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          Defines the workspace features and collaboration presets.
        </Text>

        <View style={styles.orgTypesGrid}>
          {ORG_TYPES.map(item => {
            const isSelected = orgType === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.orgTypeCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: isSelected ? COLORS.primary : colors.borderColor,
                  },
                  isSelected && {
                    backgroundColor: theme.dark
                      ? 'rgba(0, 105, 212, 0.15)'
                      : 'rgba(0, 105, 212, 0.06)',
                  },
                ]}
                onPress={() => setOrgType(item.id)}
                activeOpacity={0.8}>
                <FeatherIcon
                  name={item.icon}
                  size={18}
                  color={isSelected ? COLORS.primary : colors.textLight}
                />
                <Text
                  style={[
                    styles.orgTypeTitle,
                    {color: isSelected ? COLORS.primary : colors.title},
                  ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Organization Details Form */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Organization Details
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          Legal name, public workspace slug, and location information.
        </Text>

        {/* Organization Name */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Organization Name
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.title,
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="e.g. Acme Media Corp"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={handleNameChange}
            editable={!saving}
          />
        </View>

        {/* Slug */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Workspace URL Slug
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.title,
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="e.g. acme-media"
            placeholderTextColor={colors.textLight}
            value={slug}
            onChangeText={handleSlugChange}
            autoCapitalize="none"
            editable={!saving}
          />
          <Text style={[styles.helperText, {color: colors.textLight}]}>
            Used for sharable project links: /agency/{slug || 'slug'}
          </Text>
        </View>

        {/* Website */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Website URL
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.title,
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="https://example.com"
            placeholderTextColor={colors.textLight}
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
            keyboardType="url"
            editable={!saving}
          />
        </View>

        {/* Industry Selector */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Industry
          </Text>
          <TouchableOpacity
            style={[
              styles.pickerTrigger,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            onPress={() => setIndustryModalOpen(true)}>
            <Text
              style={[
                styles.pickerTriggerText,
                {color: industry ? colors.title : colors.textLight},
              ]}>
              {industry || 'Select Industry'}
            </Text>
            <FeatherIcon name="chevron-down" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {industry === 'Other' && (
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, {color: colors.title}]}>
              Specify Industry
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: colors.title,
                  borderColor: colors.borderColor,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="e.g. Clean Energy"
              placeholderTextColor={colors.textLight}
              value={industryOther}
              onChangeText={setIndustryOther}
              editable={!saving}
            />
          </View>
        )}

        {/* Country Selector */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Country / Region
          </Text>
          <TouchableOpacity
            style={[
              styles.pickerTrigger,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            onPress={() => setCountryModalOpen(true)}>
            <Text
              style={[
                styles.pickerTriggerText,
                {color: country ? colors.title : colors.textLight},
              ]}>
              {country || 'Select Country'}
            </Text>
            <FeatherIcon name="chevron-down" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Timezone Selector */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Timezone
          </Text>
          <TouchableOpacity
            style={[
              styles.pickerTrigger,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            onPress={() => setTimezoneModalOpen(true)}>
            <Text
              style={[
                styles.pickerTriggerText,
                {color: timezone ? colors.title : colors.textLight},
              ]}>
              {timezone || 'Select Timezone'}
            </Text>
            <FeatherIcon name="chevron-down" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsFooter}>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            {borderColor: colors.borderColor, backgroundColor: colors.card},
          ]}
          onPress={handleReset}
          disabled={saving}>
          <Text style={[styles.cancelBtnText, {color: colors.title}]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            {backgroundColor: COLORS.primary},
            saving && {opacity: 0.7},
          ]}
          onPress={handleSave}
          disabled={saving || uploading}
          activeOpacity={0.85}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FeatherIcon name="check" size={16} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Industry Selection Modal */}
      <Modal
        visible={industryModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIndustryModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {backgroundColor: colors.card}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: colors.title}]}>
                Select Industry
              </Text>
              <TouchableOpacity onPress={() => setIndustryModalOpen(false)}>
                <FeatherIcon name="x" size={20} color={colors.title} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 350}}>
              {INDUSTRIES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    industry === item && {backgroundColor: 'rgba(0, 105, 212, 0.1)'},
                  ]}
                  onPress={() => {
                    setIndustry(item);
                    setIndustryModalOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      {color: industry === item ? COLORS.primary : colors.title},
                    ]}>
                    {item}
                  </Text>
                  {industry === item && (
                    <FeatherIcon name="check" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Country Selection Modal */}
      <Modal
        visible={countryModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {backgroundColor: colors.card}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: colors.title}]}>
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setCountryModalOpen(false)}>
                <FeatherIcon name="x" size={20} color={colors.title} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 350}}>
              {COUNTRIES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    country === item && {backgroundColor: 'rgba(0, 105, 212, 0.1)'},
                  ]}
                  onPress={() => {
                    setCountry(item);
                    setCountryModalOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      {color: country === item ? COLORS.primary : colors.title},
                    ]}>
                    {item}
                  </Text>
                  {country === item && (
                    <FeatherIcon name="check" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Timezone Selection Modal */}
      <Modal
        visible={timezoneModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setTimezoneModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {backgroundColor: colors.card}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: colors.title}]}>
                Select Timezone
              </Text>
              <TouchableOpacity onPress={() => setTimezoneModalOpen(false)}>
                <FeatherIcon name="x" size={20} color={colors.title} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 350}}>
              {TIMEZONES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    timezone === item && {backgroundColor: 'rgba(0, 105, 212, 0.1)'},
                  ]}
                  onPress={() => {
                    setTimezone(item);
                    setTimezoneModalOpen(false);
                  }}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      {color: timezone === item ? COLORS.primary : colors.title},
                    ]}>
                    {item}
                  </Text>
                  {timezone === item && (
                    <FeatherIcon name="check" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionRoot: {
    gap: 16,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionDesc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  statusSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  cardBlock: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  blockSubtitle: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  logoImage: {
    width: 76,
    height: 76,
    borderRadius: 16,
  },
  logoPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitialText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarActionsCol: {
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  removeBtn: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  urlInput: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  helpHint: {
    fontSize: 11,
    marginTop: 4,
  },
  orgTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  orgTypeCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  orgTypeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  pickerTriggerText: {
    fontSize: 14,
  },
  helperText: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  actionsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 6,
    paddingBottom: 24,
  },
  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default OrganizationProfileEditSection;
