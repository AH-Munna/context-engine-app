import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/theme';
import DashboardLayout from '../../layout/DashboardLayout';
import {useAppSelector} from '../../hooks/useRedux';
import UserProfileEditSection from './components/UserProfileEditSection';
import OrganizationProfileEditSection from './components/OrganizationProfileEditSection';
import OrganizationTeamSection from './components/OrganizationTeamSection';

type ProfileTab = 'personal' | 'organization' | 'team';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  const user = useAppSelector(state => state.app.user);
  const creator = useAppSelector(state => state.app.creator);
  const organization = useAppSelector(state => state.app.organization);
  const accountType = useAppSelector(state => state.app.accountType);

  const isOrg = accountType === 'organization';
  const hasOrg = Boolean(organization);

  const [activeSegment, setActiveSegment] = useState<ProfileTab>('personal');

  if (!user) {
    return (
      <DashboardLayout activeTab="profile" title="My Profile">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, {color: colors.textLight}]}>
            Loading profile...
          </Text>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeTab="profile"
      title="My Profile"
      showBanners={false}
      scrollable={true}>
      <View style={styles.container}>
        {/* Segmented Control (if Organization account or has Org membership) */}
        {hasOrg && (
          <View
            style={[
              styles.segmentContainer,
              {backgroundColor: theme.dark ? '#111827' : '#E2E8F0'},
            ]}>
            <TouchableOpacity
              style={[
                styles.segmentTab,
                activeSegment === 'personal' && [
                  styles.segmentTabActive,
                  {backgroundColor: colors.card},
                ],
              ]}
              onPress={() => setActiveSegment('personal')}
              activeOpacity={0.8}>
              <FeatherIcon
                name="user"
                size={14}
                color={activeSegment === 'personal' ? COLORS.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      activeSegment === 'personal' ? colors.title : colors.textLight,
                    fontWeight: activeSegment === 'personal' ? '700' : '500',
                  },
                ]}>
                Personal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentTab,
                activeSegment === 'organization' && [
                  styles.segmentTabActive,
                  {backgroundColor: colors.card},
                ],
              ]}
              onPress={() => setActiveSegment('organization')}
              activeOpacity={0.8}>
              <FeatherIcon
                name="building"
                size={14}
                color={
                  activeSegment === 'organization'
                    ? COLORS.primary
                    : colors.textLight
                }
              />
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      activeSegment === 'organization'
                        ? colors.title
                        : colors.textLight,
                    fontWeight:
                      activeSegment === 'organization' ? '700' : '500',
                  },
                ]}>
                Organization
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentTab,
                activeSegment === 'team' && [
                  styles.segmentTabActive,
                  {backgroundColor: colors.card},
                ],
              ]}
              onPress={() => setActiveSegment('team')}
              activeOpacity={0.8}>
              <FeatherIcon
                name="users"
                size={14}
                color={activeSegment === 'team' ? COLORS.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.segmentText,
                  {
                    color:
                      activeSegment === 'team' ? colors.title : colors.textLight,
                    fontWeight: activeSegment === 'team' ? '700' : '500',
                  },
                ]}>
                Team
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Render Selected View */}
        {activeSegment === 'personal' && (
          <UserProfileEditSection user={user} creator={creator} />
        )}

        {activeSegment === 'organization' && organization && (
          <OrganizationProfileEditSection organization={organization} />
        )}

        {activeSegment === 'team' && organization && (
          <OrganizationTeamSection currentUserId={user.id} />
        )}
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 6,
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentTabActive: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
  },
});

export default ProfileScreen;
