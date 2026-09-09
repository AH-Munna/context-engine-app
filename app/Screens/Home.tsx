import React, {useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS, SIZES} from '../constants/theme';
import themeContext from '../constants/themeContext';
import {useAppDispatch, useAppSelector} from '../hooks/useRedux';
import {logout} from '../Redux/slices/appSlice';

const Home = ({navigation}: any) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const {setDarkTheme, setLightTheme} = useContext(themeContext);
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.app.user);
  const creator = useAppSelector(state => state.app.creator);
  const organization = useAppSelector(state => state.app.organization);
  const accountType = useAppSelector(state => state.app.accountType);

  const displayName =
    user?.full_name || user?.email?.split('@')[0] || 'User';

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.brandTitle, {color: colors.title}]}>
              Context Engine
            </Text>
            <Text style={[styles.brandSubtitle, {color: colors.textLight}]}>
              Mobile Workspace
            </Text>
          </View>

          <View style={styles.headerActions}>
            {/* Theme Toggle Button */}
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.borderColor,
                },
              ]}
              onPress={() => {
                if (theme.dark) {
                  setLightTheme();
                } else {
                  setDarkTheme();
                }
              }}
              activeOpacity={0.8}>
              <FeatherIcon
                name={theme.dark ? 'sun' : 'moon'}
                size={18}
                color={theme.dark ? '#F59E0B' : COLORS.primary}
              />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                },
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}>
              <FeatherIcon name="log-out" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Welcome & Profile Card */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderColor,
            },
          ]}>
          <View style={styles.userAvatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, {color: colors.title}]}>
                Welcome, {displayName}!
              </Text>
              <Text style={[styles.userEmail, {color: colors.textLight}]}>
                {user?.email || 'Logged In'}
              </Text>
            </View>

            <View style={[styles.roleBadge, {backgroundColor: 'rgba(59, 91, 219, 0.12)'}]}>
              <Text style={styles.roleBadgeText}>
                {accountType === 'organization' ? 'Organization' : 'Creator'}
              </Text>
            </View>
          </View>

          {/* Account Details */}
          {organization && (
            <View style={[styles.orgDetailBox, {backgroundColor: theme.dark ? '#182234' : '#F8FAFC'}]}>
              <View style={styles.detailRow}>
                <FeatherIcon name="building" size={16} color={COLORS.primary} />
                <Text style={[styles.detailLabel, {color: colors.textLight}]}>
                  Org:
                </Text>
                <Text style={[styles.detailValue, {color: colors.title}]}>
                  {organization.name} ({organization.type})
                </Text>
              </View>
              {organization.industry && (
                <View style={styles.detailRow}>
                  <FeatherIcon name="tag" size={16} color={COLORS.secondary} />
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
            <View style={[styles.orgDetailBox, {backgroundColor: theme.dark ? '#182234' : '#F8FAFC'}]}>
              <View style={styles.detailRow}>
                <FeatherIcon name="video" size={16} color={COLORS.secondary} />
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

        {/* Onboarding Status / Shortcut */}
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
              <FeatherIcon name="check-circle" size={14} color="#10B981" />
              <Text style={styles.badgeText}>Auth & Onboarding Active</Text>
            </View>
          </View>

          <Text style={[styles.heroHeading, {color: colors.title}]}>
            Where creators and brands build together.
          </Text>

          <Text style={[styles.heroBody, {color: colors.textLight}]}>
            Your mobile app is now connected to the Context Engine production backend. Complete user authentication and role onboarding are ready.
          </Text>

          {/* Action buttons */}
          <View style={styles.actionButtonsCol}>
            {/* Component catalog */}
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => navigation.navigate('Components')}
              activeOpacity={0.85}>
              <FeatherIcon name="grid" size={18} color="#FFFFFF" />
              <Text style={styles.primaryActionBtnText}>
                Open UI Component Catalog
              </Text>
            </TouchableOpacity>

            {/* Test Onboarding shortcut */}
            <TouchableOpacity
              style={[
                styles.secondaryActionBtn,
                {borderColor: colors.borderColor, backgroundColor: colors.background},
              ]}
              onPress={() => navigation.navigate('ChooseAccountType')}
              activeOpacity={0.85}>
              <FeatherIcon name="refresh-cw" size={16} color={colors.title} />
              <Text style={[styles.secondaryActionBtnText, {color: colors.title}]}>
                Revisit Onboarding Flow
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: SIZES.padding,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    ...FONTS.h2,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    ...FONTS.fontSm,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  userAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  orgDetailBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  badgeWrap: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  heroHeading: {
    ...FONTS.h3,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 12,
  },
  heroBody: {
    ...FONTS.font,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButtonsCol: {
    gap: 10,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
