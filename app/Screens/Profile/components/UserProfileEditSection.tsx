import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
import {COLORS} from '../../../constants/theme';
import ProfileAvatar from '../../../components/ui/ProfileAvatar';
import {UserProfile, CreatorProfile} from '../../../types';
import {uploadFile, MAX_IMAGE_UPLOAD_MB} from '../../../Service/uploadService';
import {
  formatIndianPhoneInput,
  formatPhoneForDisplay,
  validatePhone,
  normalizePhone,
} from '../../../utils/phoneValidation';
import {useAppDispatch} from '../../../hooks/useRedux';
import {updateUserProfileThunk} from '../../../Redux/slices/appSlice';

interface UserProfileEditSectionProps {
  user: UserProfile;
  creator?: CreatorProfile | null;
}

function splitFullName(fullName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName?.trim() ?? '';
  if (!trimmed) {
    return {firstName: '', lastName: ''};
  }
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function combineFullName(firstName: string, lastName: string): string | null {
  const combined = `${firstName.trim()} ${lastName.trim()}`.trim();
  return combined || null;
}

export const UserProfileEditSection: React.FC<UserProfileEditSectionProps> = ({
  user,
  creator,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const dispatch = useAppDispatch();

  const initialName = splitFullName(user.full_name);
  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [phone, setPhone] = useState(formatPhoneForDisplay(user.phone || ''));
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sync state when user prop changes
  useEffect(() => {
    const nextName = splitFullName(user.full_name);
    setFirstName(nextName.firstName);
    setLastName(nextName.lastName);
    setPhone(formatPhoneForDisplay(user.phone || ''));
    setBio(user.bio || '');
    setAvatarUrl(user.avatar_url || '');
  }, [user]);

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      if (Platform.Version >= 33) {
        return true; // Android 13+ handles photos without READ_EXTERNAL_STORAGE
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return true;
    }
  };

  const handlePickPhoto = async () => {
    const hasPerm = await requestStoragePermission();
    if (!hasPerm) {
      Alert.alert(
        'Permission Required',
        'Please grant storage permissions to upload a profile photo.',
      );
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
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
          setAvatarUrl(publicUrl);
          setStatusMessage({
            type: 'success',
            text: 'Profile photo uploaded successfully!',
          });
        } catch (err: any) {
          Alert.alert(
            'Upload Failed',
            err.message || 'Could not upload photo. Please try again.',
          );
        } finally {
          setUploading(false);
        }
      },
    );
  };

  const handleApplyUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed) {
      Alert.alert('Invalid URL', 'Please enter an image URL.');
      return;
    }
    setAvatarUrl(trimmed);
    setShowUrlInput(false);
    setUrlDraft('');
    setStatusMessage({
      type: 'success',
      text: 'Avatar image URL applied!',
    });
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    setShowUrlInput(false);
    setUrlDraft('');
  };

  const handleReset = () => {
    const nextName = splitFullName(user.full_name);
    setFirstName(nextName.firstName);
    setLastName(nextName.lastName);
    setPhone(formatPhoneForDisplay(user.phone || ''));
    setBio(user.bio || '');
    setAvatarUrl(user.avatar_url || '');
    setPhoneError(null);
    setStatusMessage(null);
  };

  const handleSave = async () => {
    const validation = validatePhone(phone);
    if (validation) {
      setPhoneError(validation);
      return;
    }
    setPhoneError(null);
    setSaving(true);
    setStatusMessage(null);

    try {
      const payload: Partial<UserProfile> = {
        full_name: combineFullName(firstName, lastName),
        phone: normalizePhone(phone),
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      };

      await dispatch(
        updateUserProfileThunk({userId: user.id, data: payload}),
      ).unwrap();

      setStatusMessage({
        type: 'success',
        text: 'Profile details saved successfully!',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err || 'Failed to save profile changes.',
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
          My Details
        </Text>
        <Text style={[styles.sectionDesc, {color: colors.textLight}]}>
          Manage your personal information, profile photo, and public bio.
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

      {/* Avatar Section */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Profile Photo
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          This photo will be displayed across Context Engine workspaces and
          collaborations.
        </Text>

        <View style={styles.avatarRow}>
          <View style={styles.avatarWrap}>
            {uploading ? (
              <View style={[styles.avatarPlaceholder, {backgroundColor: colors.background}]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : (
              <ProfileAvatar
                name={user.full_name || user.email}
                profileImage={avatarUrl}
                size={76}
              />
            )}

            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={handlePickPhoto}
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
                onPress={handlePickPhoto}
                disabled={uploading || saving}>
                <FeatherIcon name="upload" size={14} color={colors.title} />
                <Text style={[styles.actionBtnText, {color: colors.title}]}>
                  {uploading ? 'Uploading...' : 'Upload Photo'}
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

              {Boolean(avatarUrl) && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeBtn]}
                  onPress={handleRemovePhoto}
                  disabled={uploading || saving}>
                  <FeatherIcon name="trash-2" size={14} color="#EF4444" />
                  <Text style={[styles.actionBtnText, {color: '#EF4444'}]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Toggleable URL input */}
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
                  placeholder="https://example.com/avatar.jpg"
                  placeholderTextColor={colors.textLight}
                  value={urlDraft}
                  onChangeText={setUrlDraft}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyUrl}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={[styles.helpHint, {color: colors.textLight}]}>
              Recommended: Square image up to {MAX_IMAGE_UPLOAD_MB} MB (JPG, PNG).
            </Text>
          </View>
        </View>
      </View>

      {/* Personal Info Form */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Personal Information
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          Update your name and phone number.
        </Text>

        {/* First & Last Name */}
        <View style={styles.namesRow}>
          <View style={styles.halfField}>
            <Text style={[styles.fieldLabel, {color: colors.title}]}>
              First Name
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
              placeholder="First Name"
              placeholderTextColor={colors.textLight}
              value={firstName}
              onChangeText={setFirstName}
              editable={!saving}
            />
          </View>

          <View style={styles.halfField}>
            <Text style={[styles.fieldLabel, {color: colors.title}]}>
              Last Name
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
              placeholder="Last Name"
              placeholderTextColor={colors.textLight}
              value={lastName}
              onChangeText={setLastName}
              editable={!saving}
            />
          </View>
        </View>

        {/* Phone Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Phone Number
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              {
                borderColor: phoneError ? '#EF4444' : colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}>
            <FeatherIcon
              name="phone"
              size={16}
              color={colors.textLight}
              style={styles.fieldIcon}
            />
            <TextInput
              style={[styles.inputInner, {color: colors.title}]}
              placeholder="+91 98765 43210"
              placeholderTextColor={colors.textLight}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={text => {
                setPhone(formatIndianPhoneInput(text));
                setPhoneError(null);
              }}
              editable={!saving}
            />
          </View>
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : (
            <Text style={[styles.helperText, {color: colors.textLight}]}>
              10-digit Indian or international contact number.
            </Text>
          )}
        </View>

        {/* Email Field (Read-Only) */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Email Address
          </Text>
          <View
            style={[
              styles.inputWithIcon,
              {
                borderColor: colors.borderColor,
                backgroundColor: theme.dark ? '#111827' : '#F1F5F9',
              },
            ]}>
            <FeatherIcon
              name="mail"
              size={16}
              color={colors.textLight}
              style={styles.fieldIcon}
            />
            <TextInput
              style={[styles.inputInner, {color: colors.textLight}]}
              value={user.email}
              editable={false}
            />
            <FeatherIcon
              name="lock"
              size={14}
              color={colors.textLight}
              style={{marginRight: 12}}
            />
          </View>
          <Text style={[styles.helperText, {color: colors.textLight}]}>
            Email address is tied to your account authentication and cannot be changed here.
          </Text>
        </View>

        {/* Bio Field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, {color: colors.title}]}>
            Biography
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                color: colors.title,
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="Tell us about yourself, your creative focus, or background..."
            placeholderTextColor={colors.textLight}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!saving}
          />
        </View>
      </View>

      {/* Creator Details Preview (if Creator Profile exists) */}
      {creator && (
        <View
          style={[
            styles.cardBlock,
            {backgroundColor: colors.card, borderColor: colors.borderColor},
          ]}>
          <Text style={[styles.blockTitle, {color: colors.title}]}>
            Creator Profile Preferences
          </Text>
          <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
            Creator niches and discoverability in the marketplace.
          </Text>

          {creator.niches_json && creator.niches_json.length > 0 ? (
            <View style={styles.nichesWrap}>
              {creator.niches_json.map((niche, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.nicheChip,
                    {backgroundColor: 'rgba(0, 105, 212, 0.08)'},
                  ]}>
                  <Text style={styles.nicheChipText}>{niche}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyCreatorText, {color: colors.textLight}]}>
              No specific niches chosen.
            </Text>
          )}

          <View style={styles.creatorMetaRow}>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, {color: colors.textLight}]}>
                Visibility
              </Text>
              <Text style={[styles.metaVal, {color: colors.title}]}>
                {creator.marketplace_visibility || 'Public'}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, {color: colors.textLight}]}>
                Verification
              </Text>
              <Text style={[styles.metaVal, {color: '#10B981'}]}>
                {creator.verification_status || 'Verified'}
              </Text>
            </View>
          </View>
        </View>
      )}

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
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
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
  namesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  halfField: {
    flex: 1,
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
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  fieldIcon: {
    paddingLeft: 14,
    paddingRight: 10,
  },
  inputInner: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  textArea: {
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  nichesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  nicheChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  nicheChipText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCreatorText: {
    fontSize: 12,
    marginBottom: 14,
  },
  creatorMetaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
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
});

export default UserProfileEditSection;
