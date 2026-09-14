import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import BottomSheet from '../components/ui/BottomSheet';
import ProfileAvatar from '../components/ui/ProfileAvatar';
import {useAppDispatch, useAppSelector} from '../hooks/useRedux';
import {logout} from '../Redux/slices/appSlice';
import themeContext from '../constants/themeContext';

interface UserQuickMenuSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const UserQuickMenuSheet: React.FC<UserQuickMenuSheetProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {setDarkTheme, setLightTheme} = useContext(themeContext);

  const user = useAppSelector(state => state.app.user);
  const organization = useAppSelector(state => state.app.organization);
  const accountType = useAppSelector(state => state.app.accountType);

  const isOrg = accountType === 'organization';
  const displayName =
    user?.full_name || user?.email?.split('@')[0] || 'User Profile';

  const handleNavigate = (route: string) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(route);
    }, 150);
  };

  const handleLogout = () => {
    onClose();
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Account"
      scrollable={false}
      maxHeight="55%">
      <View style={styles.container}>
        {/* User Card Header */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.dark ? '#111827' : '#F8FAFC',
              borderColor: colors.borderColor,
            },
          ]}>
          <ProfileAvatar
            name={displayName}
            profileImage={user?.avatar_url}
            size={50}
          />
          <View style={styles.userMeta}>
            <Text
              style={[styles.userName, {color: colors.title}]}
              numberOfLines={1}>
              {displayName}
            </Text>
            <Text
              style={[styles.userEmail, {color: colors.textLight}]}
              numberOfLines={1}>
              {user?.email}
            </Text>
            {organization && (
              <Text
                style={[styles.orgName, {color: COLORS.primary}]}
                numberOfLines={1}>
                {organization.name}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.roleBadge,
              {backgroundColor: 'rgba(0, 105, 212, 0.12)'},
            ]}>
            <Text style={styles.roleBadgeText}>{isOrg ? 'Org' : 'Creator'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuList}>
          <TouchableOpacity
            style={[styles.menuItem, {borderBottomColor: colors.borderColor}]}
            onPress={() => handleNavigate('Profile')}>
            <View style={[styles.menuIconWrap, {backgroundColor: 'rgba(0, 105, 212, 0.1)'}]}>
              <FeatherIcon name="user" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.menuItemTextWrap}>
              <Text style={[styles.menuItemTitle, {color: colors.title}]}>
                My Profile & Settings
              </Text>
              <Text style={[styles.menuItemSubtitle, {color: colors.textLight}]}>
                View and edit personal or organization details
              </Text>
            </View>
            <FeatherIcon name="chevron-right" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, {borderBottomColor: colors.borderColor}]}
            onPress={() => {
              if (theme.dark) {
                setLightTheme();
              } else {
                setDarkTheme();
              }
            }}>
            <View style={[styles.menuIconWrap, {backgroundColor: 'rgba(245, 158, 11, 0.12)'}]}>
              <FeatherIcon
                name={theme.dark ? 'sun' : 'moon'}
                size={18}
                color={theme.dark ? '#F59E0B' : COLORS.primary}
              />
            </View>
            <View style={styles.menuItemTextWrap}>
              <Text style={[styles.menuItemTitle, {color: colors.title}]}>
                Appearance
              </Text>
              <Text style={[styles.menuItemSubtitle, {color: colors.textLight}]}>
                Current: {theme.dark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Text style={[styles.themeToggleText, {color: COLORS.primary}]}>
              Switch
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}>
            <View style={[styles.menuIconWrap, {backgroundColor: 'rgba(239, 68, 68, 0.1)'}]}>
              <FeatherIcon name="log-out" size={18} color="#EF4444" />
            </View>
            <View style={styles.menuItemTextWrap}>
              <Text style={[styles.menuItemTitle, {color: '#EF4444'}]}>
                Log Out
              </Text>
              <Text style={[styles.menuItemSubtitle, {color: colors.textLight}]}>
                End active session on this device
              </Text>
            </View>
            <FeatherIcon name="chevron-right" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  userMeta: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  orgName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemTextWrap: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default UserQuickMenuSheet;
