import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import ProfileAvatar from '../components/ui/ProfileAvatar';
import {useAppSelector} from '../hooks/useRedux';
import notificationService from '../Service/notificationService';
import NotificationBottomSheet from './NotificationBottomSheet';
import UserQuickMenuSheet from './UserQuickMenuSheet';
import themeContext from '../constants/themeContext';

interface DashboardHeaderProps {
  title?: string;
  onMenuClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  onMenuClick,
  showBack = false,
  onBack,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const insets = useSafeAreaInsets();
  const {setDarkTheme, setLightTheme} = React.useContext(themeContext);

  const user = useAppSelector(state => state.app.user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifSheetVisible, setNotifSheetVisible] = useState(false);
  const [userSheetVisible, setUserSheetVisible] = useState(false);

  useEffect(() => {
    notificationService
      .getUnreadCount()
      .then(setUnreadCount)
      .catch(() => setUnreadCount(0));
  }, []);

  const displayName =
    user?.full_name || user?.email?.split('@')[0] || 'User Profile';

  return (
    <>
      <View
        style={[
          styles.headerRoot,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.borderColor,
            paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 4),
          },
        ]}>
        <View style={styles.headerContent}>
          {/* Left: Hamburger Menu or Back button */}
          <View style={styles.leftSection}>
            {showBack ? (
              <TouchableOpacity
                onPress={onBack}
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.borderColor,
                  },
                ]}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <FeatherIcon name="arrow-left" size={20} color={colors.title} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onMenuClick}
                style={[
                  styles.iconBtn,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.borderColor,
                  },
                ]}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <FeatherIcon name="menu" size={20} color={colors.title} />
              </TouchableOpacity>
            )}

            {/* Title / Brand Display */}
            {title ? (
              <Text
                style={[styles.pageTitle, {color: colors.title}]}
                numberOfLines={1}>
                {title}
              </Text>
            ) : (
              <View style={styles.brandTitleWrap}>
                <Text style={[styles.brandTitleText, {color: colors.title}]}>
                  Context <Text style={{color: COLORS.primary}}>Engine</Text>
                </Text>
              </View>
            )}
          </View>

          {/* Right Action Icons */}
          <View style={styles.rightSection}>
            {/* Theme Toggle */}
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: colors.background,
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
                size={17}
                color={theme.dark ? '#F59E0B' : COLORS.primary}
              />
            </TouchableOpacity>

            {/* Notifications Button with Badge */}
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.borderColor,
                },
              ]}
              onPress={() => setNotifSheetVisible(true)}
              activeOpacity={0.8}>
              <FeatherIcon name="bell" size={18} color={colors.title} />
              {unreadCount > 0 && (
                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* User Avatar (opens Quick Menu) */}
            <TouchableOpacity
              onPress={() => setUserSheetVisible(true)}
              style={styles.avatarBtn}
              activeOpacity={0.85}>
              <ProfileAvatar
                name={displayName}
                profileImage={user?.avatar_url}
                size={36}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Notifications Bottom Sheet */}
      <NotificationBottomSheet
        visible={notifSheetVisible}
        onClose={() => setNotifSheetVisible(false)}
        onUnreadCountChange={setUnreadCount}
      />

      {/* User Quick Menu Sheet */}
      <UserQuickMenuSheet
        visible={userSheetVisible}
        onClose={() => setUserSheetVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerRoot: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 16,
    zIndex: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 12,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeWrap: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  avatarBtn: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 1,
  },
});

export default DashboardHeader;
