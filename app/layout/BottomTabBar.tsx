import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import {useAppSelector} from '../hooks/useRedux';

interface BottomTabBarProps {
  activeTab: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({activeTab}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const accountType = useAppSelector(state => state.app.accountType);
  const isOrg = accountType === 'organization';

  const tabs = [
    {
      id: 'home',
      label: 'Projects',
      route: 'Home',
      icon: 'grid',
    },
    {
      id: 'marketplace',
      label: 'Market',
      route: 'Marketplace',
      icon: 'shopping-bag',
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      route: 'Campaigns',
      icon: 'award',
    },
    {
      id: isOrg ? 'brand-profiles' : 'portfolio',
      label: isOrg ? 'Brand' : 'Portfolio',
      route: isOrg ? 'BrandProfiles' : 'Portfolio',
      icon: isOrg ? 'layers' : 'image',
    },
    {
      id: 'profile',
      label: 'Profile',
      route: 'Profile',
      icon: 'user',
    },
  ];

  const handleTabPress = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <View
      style={[
        styles.tabBarRoot,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.borderColor,
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 8),
        },
      ]}>
      <View style={styles.tabsRow}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabBtn}
              onPress={() => handleTabPress(tab.route)}
              activeOpacity={0.75}>
              {isActive && (
                <View
                  style={[
                    styles.activeTopPill,
                    {backgroundColor: COLORS.primary},
                  ]}
                />
              )}
              <View
                style={[
                  styles.iconWrap,
                  isActive && {
                    backgroundColor: theme.dark
                      ? 'rgba(0, 105, 212, 0.18)'
                      : 'rgba(0, 105, 212, 0.1)',
                  },
                ]}>
                <FeatherIcon
                  name={tab.icon}
                  size={20}
                  color={isActive ? COLORS.primary : colors.textLight}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? COLORS.primary : colors.textLight,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarRoot: {
    borderTopWidth: 1,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 30,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  activeTopPill: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  iconWrap: {
    width: 38,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: -0.1,
  },
});

export default BottomTabBar;
