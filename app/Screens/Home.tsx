import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import {useAppSelector} from '../hooks/useRedux';
import DashboardLayout from '../layout/DashboardLayout';
import ProfileAvatar from '../components/ui/ProfileAvatar';

const Home = ({navigation}: any) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  const user = useAppSelector(state => state.app.user);
  const creator = useAppSelector(state => state.app.creator);
  const organization = useAppSelector(state => state.app.organization);
  const accountType = useAppSelector(state => state.app.accountType);

  const displayName =
    user?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <DashboardLayout
      activeTab="home"
      showBanners={true}
      scrollable={true}>
      <View style={styles.contentContainer}>
        {/* Welcome Hero Banner */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderColor,
            },
          ]}>
          <View style={styles.badgeWrap}>
            <View style={styles.badge}>
              <FeatherIcon name="check-circle" size={13} color="#10B981" />
              <Text style={styles.badgeText}>Context Engine Workspace</Text>
            </View>
          </View>

          <Text style={[styles.heroHeading, {color: colors.title}]}>
            Where creators and brands build together.
          </Text>

          <Text style={[styles.heroBody, {color: colors.textLight}]}>
            Upload videos, extract context, discover creators, and run campaigns seamlessly across mobile and web.
          </Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statBox,
                {backgroundColor: theme.dark ? '#111827' : '#F8FAFC'},
              ]}>
              <Text style={[styles.statVal, {color: COLORS.primary}]}>Active</Text>
              <Text style={[styles.statLabel, {color: colors.textLight}]}>Status</Text>
            </View>
            <View
              style={[
                styles.statBox,
                {backgroundColor: theme.dark ? '#111827' : '#F8FAFC'},
              ]}>
              <Text style={[styles.statVal, {color: COLORS.secondary}]}>
                {accountType === 'organization' ? 'Org' : 'Creator'}
              </Text>
              <Text style={[styles.statLabel, {color: colors.textLight}]}>Role</Text>
            </View>
            <View
              style={[
                styles.statBox,
                {backgroundColor: theme.dark ? '#111827' : '#F8FAFC'},
              ]}>
              <Text style={[styles.statVal, {color: '#10B981'}]}>Cloud</Text>
              <Text style={[styles.statLabel, {color: colors.textLight}]}>Backend</Text>
            </View>
          </View>
        </View>

        {/* User Workspace Profile Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderColor,
            },
          ]}>
          <View style={styles.userAvatarRow}>
            <ProfileAvatar
              name={displayName}
              profileImage={user?.avatar_url}
              size={50}
            />

            <View style={styles.userInfo}>
              <Text style={[styles.userName, {color: colors.title}]}>
                {displayName}
              </Text>
              <Text style={[styles.userEmail, {color: colors.textLight}]}>
                {user?.email || 'Logged In'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileEditBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}>
              <FeatherIcon name="edit-2" size={14} color={COLORS.primary} />
              <Text style={styles.profileEditBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Account Details */}
          {organization && (
            <View
              style={[
                styles.orgDetailBox,
                {backgroundColor: theme.dark ? '#182234' : '#F8FAFC'},
              ]}>
              <View style={styles.detailRow}>
                <FeatherIcon name="building" size={15} color={COLORS.primary} />
                <Text style={[styles.detailLabel, {color: colors.textLight}]}>
                  Org:
                </Text>
                <Text style={[styles.detailValue, {color: colors.title}]}>
                  {organization.name} ({organization.type})
                </Text>
              </View>
              {organization.industry && (
                <View style={styles.detailRow}>
                  <FeatherIcon name="tag" size={15} color={COLORS.secondary} />
                  <Text style={[styles.detailLabel, {color: colors.textLight}]}>
                    Industry:
                  </Text>
                  <Text style={[styles.detailValue, {color: colors.title}]}>
                    {organization.industry}
                  </Text>
                </View>
              )}
            </View>
          )}

          {creator && (
            <View
              style={[
                styles.orgDetailBox,
                {backgroundColor: theme.dark ? '#182234' : '#F8FAFC'},
              ]}>
              <View style={styles.detailRow}>
                <FeatherIcon name="video" size={15} color={COLORS.secondary} />
                <Text style={[styles.detailLabel, {color: colors.textLight}]}>
                  Niches:
                </Text>
                <Text style={[styles.detailValue, {color: colors.title}]}>
                  {creator.niches_json?.join(', ') || 'General Creator'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Hub Navigation Cards */}
        <Text style={[styles.sectionHeading, {color: colors.title}]}>
          Quick Access
        </Text>

        <View style={styles.quickGrid}>
          {/* Profile Card */}
          <TouchableOpacity
            style={[
              styles.hubCard,
              {backgroundColor: colors.card, borderColor: colors.borderColor},
            ]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}>
            <View
              style={[
                styles.hubIconWrap,
                {backgroundColor: 'rgba(0, 105, 212, 0.1)'},
              ]}>
              <FeatherIcon name="user" size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.hubTitle, {color: colors.title}]}>
              My Profile
            </Text>
            <Text style={[styles.hubDesc, {color: colors.textLight}]}>
              View & edit personal details, organization branding, and invites
            </Text>
          </TouchableOpacity>

          {/* Marketplace Card */}
          <TouchableOpacity
            style={[
              styles.hubCard,
              {backgroundColor: colors.card, borderColor: colors.borderColor},
            ]}
            onPress={() => navigation.navigate('Marketplace')}
            activeOpacity={0.8}>
            <View
              style={[
                styles.hubIconWrap,
                {backgroundColor: 'rgba(0, 154, 134, 0.1)'},
              ]}>
              <FeatherIcon name="shopping-bag" size={20} color={COLORS.secondary} />
            </View>
            <Text style={[styles.hubTitle, {color: colors.title}]}>
              Marketplace
            </Text>
            <Text style={[styles.hubDesc, {color: colors.textLight}]}>
              Discover verified creators, talent niches, and collaboration offers
            </Text>
          </TouchableOpacity>

          {/* Campaigns Card */}
          <TouchableOpacity
            style={[
              styles.hubCard,
              {backgroundColor: colors.card, borderColor: colors.borderColor},
            ]}
            onPress={() => navigation.navigate('Campaigns')}
            activeOpacity={0.8}>
            <View
              style={[
                styles.hubIconWrap,
                {backgroundColor: 'rgba(225, 155, 52, 0.1)'},
              ]}>
              <FeatherIcon name="award" size={20} color="#E19B34" />
            </View>
            <Text style={[styles.hubTitle, {color: colors.title}]}>
              Campaigns
            </Text>
            <Text style={[styles.hubDesc, {color: colors.textLight}]}>
              Track brand briefs, deliverables, quotes, and active milestones
            </Text>
          </TouchableOpacity>

          {/* UI Catalog Card */}
          <TouchableOpacity
            style={[
              styles.hubCard,
              {backgroundColor: colors.card, borderColor: colors.borderColor},
            ]}
            onPress={() => navigation.navigate('Components')}
            activeOpacity={0.8}>
            <View
              style={[
                styles.hubIconWrap,
                {backgroundColor: 'rgba(124, 58, 237, 0.1)'},
              ]}>
              <FeatherIcon name="layers" size={20} color="#7C3AED" />
            </View>
            <Text style={[styles.hubTitle, {color: colors.title}]}>
              UI Catalog
            </Text>
            <Text style={[styles.hubDesc, {color: colors.textLight}]}>
              Explore native widgets, forms, bottom sheets, and charts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Revisit Onboarding button */}
        <TouchableOpacity
          style={[
            styles.revisitBtn,
            {borderColor: colors.borderColor, backgroundColor: colors.card},
          ]}
          onPress={() => navigation.navigate('ChooseAccountType')}
          activeOpacity={0.85}>
          <FeatherIcon name="refresh-cw" size={15} color={colors.textLight} />
          <Text style={[styles.revisitBtnText, {color: colors.title}]}>
            Switch Account Type / Revisit Onboarding
          </Text>
        </TouchableOpacity>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeWrap: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 26,
  },
  heroBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  userCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  userAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  profileEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 105, 212, 0.1)',
  },
  profileEditBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  orgDetailBox: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hubCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  hubIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  hubTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  hubDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  revisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  revisitBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Home;
