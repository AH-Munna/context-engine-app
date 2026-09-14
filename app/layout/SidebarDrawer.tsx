import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import {useAppDispatch, useAppSelector} from '../hooks/useRedux';
import {logout} from '../Redux/slices/appSlice';
import ProfileAvatar from '../components/ui/ProfileAvatar';
import themeContext from '../constants/themeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

interface SidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
  activeTab: string;
}

interface NavItem {
  id: string;
  name: string;
  route: string;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  visible,
  onClose,
  activeTab,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const {setDarkTheme, setLightTheme} = React.useContext(themeContext);

  const user = useAppSelector(state => state.app.user);
  const organization = useAppSelector(state => state.app.organization);
  const accountType = useAppSelector(state => state.app.accountType);

  const isOrg = accountType === 'organization';
  const hasOrg = Boolean(organization);

  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

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

  const projectItems: NavItem[] = [
    {
      id: 'home',
      name: 'Projects',
      route: 'Home',
      icon: 'grid',
    },
    ...(!isOrg
      ? [
          {
            id: 'portfolio',
            name: 'Portfolio',
            route: 'Portfolio',
            icon: 'image',
          },
        ]
      : []),
    {
      id: 'marketplace',
      name: 'Marketplace',
      route: 'Marketplace',
      icon: 'shopping-bag',
    },
    {
      id: 'campaigns',
      name: 'Campaigns',
      route: 'Campaigns',
      icon: 'award',
    },
  ];

  const brandItems: NavItem[] = hasOrg
    ? [
        {
          id: 'brand-profiles',
          name: 'Brand Profiles',
          route: 'BrandProfiles',
          icon: 'layers',
        },
        {
          id: 'team-projects',
          name: 'Team Projects',
          route: 'TeamProjects',
          icon: 'users',
        },
        {
          id: 'approvals',
          name: 'Approvals',
          route: 'Approvals',
          icon: 'check-circle',
        },
      ]
    : [];

  const groups: NavGroup[] = [
    {
      title: 'PROJECTS',
      items: projectItems,
    },
    ...(hasOrg
      ? [
          {
            title: organization?.name ? `BRAND (${organization.name})` : 'BRAND',
            items: brandItems,
          },
        ]
      : []),
  ];

  const displayName =
    user?.full_name || user?.email?.split('@')[0] || 'User Profile';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Animated Drawer Panel */}
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              width: DRAWER_WIDTH,
              backgroundColor: colors.card,
              borderRightColor: colors.borderColor,
              transform: [{translateX: slideAnim}],
              paddingTop: insets.top + (Platform.OS === 'android' ? 12 : 6),
              paddingBottom: insets.bottom + 16,
            },
          ]}>
          {/* Header with Brand Logo & Close Button */}
          <View style={[styles.drawerHeader, {borderBottomColor: colors.borderColor}]}>
            <View style={styles.brandRow}>
              <View style={styles.brandIconWrap}>
                <FeatherIcon name="cpu" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.brandTitle, {color: colors.title}]}>
                  Context <Text style={{color: COLORS.primary}}>Engine</Text>
                </Text>
                <Text style={[styles.brandTagline, {color: colors.textLight}]}>
                  Workspace
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, {backgroundColor: colors.background}]}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <FeatherIcon name="x" size={20} color={colors.title} />
            </TouchableOpacity>
          </View>

          {/* Nav Menu Groups */}
          <ScrollView
            style={styles.menuScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuScrollContent}>
            {groups.map(group => (
              <View key={group.title} style={styles.groupContainer}>
                <Text style={[styles.groupTitle, {color: colors.textLight}]}>
                  {group.title}
                </Text>

                <View style={styles.groupItemsList}>
                  {group.items.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.navItem,
                          isActive && {
                            backgroundColor: theme.dark
                              ? 'rgba(0, 105, 212, 0.22)'
                              : 'rgba(0, 105, 212, 0.08)',
                          },
                        ]}
                        onPress={() => handleNavigate(item.route)}
                        activeOpacity={0.75}>
                        {isActive && (
                          <View
                            style={[
                              styles.activeIndicator,
                              {backgroundColor: COLORS.primary},
                            ]}
                          />
                        )}
                        <FeatherIcon
                          name={item.icon}
                          size={18}
                          color={isActive ? COLORS.primary : colors.textLight}
                          style={styles.navIcon}
                        />
                        <Text
                          style={[
                            styles.navText,
                            {
                              color: isActive ? COLORS.primary : colors.title,
                              fontWeight: isActive ? '700' : '500',
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer User Section */}
          <View
            style={[
              styles.drawerFooter,
              {
                borderTopColor: colors.borderColor,
                backgroundColor: theme.dark ? '#0B0F19' : '#F8FAFC',
              },
            ]}>
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => handleNavigate('Profile')}
              activeOpacity={0.8}>
              <ProfileAvatar
                name={displayName}
                profileImage={user?.avatar_url}
                size={40}
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
                  {user?.email || 'My Account'}
                </Text>
              </View>

              <View
                style={[
                  styles.roleBadge,
                  {backgroundColor: 'rgba(0, 105, 212, 0.12)'},
                ]}>
                <Text style={styles.roleBadgeText}>
                  {isOrg ? 'Org' : 'Creator'}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.footerActionRow}>
              {/* Theme Toggle */}
              <TouchableOpacity
                style={[
                  styles.footerActionBtn,
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
                }}>
                <FeatherIcon
                  name={theme.dark ? 'sun' : 'moon'}
                  size={16}
                  color={theme.dark ? '#F59E0B' : COLORS.primary}
                />
                <Text style={[styles.footerBtnText, {color: colors.title}]}>
                  {theme.dark ? 'Light' : 'Dark'}
                </Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={[
                  styles.footerActionBtn,
                  {
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                  },
                ]}
                onPress={handleLogout}>
                <FeatherIcon name="log-out" size={16} color="#EF4444" />
                <Text style={[styles.footerBtnText, {color: '#EF4444'}]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    height: '100%',
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
    zIndex: 100,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingVertical: 18,
  },
  groupContainer: {
    marginBottom: 22,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 22,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  groupItemsList: {
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 3,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    borderRadius: 2,
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 14,
    letterSpacing: -0.1,
  },
  drawerFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 11,
    marginTop: 1,
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
  footerActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  footerActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  footerBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SidebarDrawer;
