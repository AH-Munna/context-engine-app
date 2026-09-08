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

const Home = ({navigation}: any) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const {themePref, setDarkTheme, setLightTheme} = useContext(themeContext);

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
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.brandTitle, {color: colors.title}]}>
              Context Engine
            </Text>
            <Text style={[styles.brandSubtitle, {color: colors.textLight}]}>
              Mobile Workspace
            </Text>
          </View>

          {/* Theme Mode Toggle Button */}
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
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
        </View>

        {/* Hero Card */}
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
              <Text style={styles.badgeText}>Ready for Development</Text>
            </View>
          </View>

          <Text style={[styles.heroHeading, {color: colors.title}]}>
            Where creators and brands build together.
          </Text>

          <Text style={[styles.heroBody, {color: colors.textLight}]}>
            This project is now in a clean, fresh state for Context Engine. All
            reusable UI components (buttons, inputs, cards, sheets, tabs, etc.)
            are preserved and ready to use.
          </Text>

          {/* Action button to explore component catalog */}
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => navigation.navigate('Components')}
            activeOpacity={0.85}>
            <FeatherIcon name="grid" size={18} color="#FFFFFF" />
            <Text style={styles.primaryActionBtnText}>
              Open UI Component Catalog
            </Text>
          </TouchableOpacity>
        </View>

        {/* Blank workspace container ready for features */}
        <View
          style={[
            styles.placeholderCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.borderColor,
            },
          ]}>
          <FeatherIcon
            name="layers"
            size={32}
            color={colors.textLight}
            style={{opacity: 0.6, marginBottom: 12}}
          />
          <Text style={[styles.placeholderTitle, {color: colors.title}]}>
            Start Building Your Screens
          </Text>
          <Text style={[styles.placeholderDesc, {color: colors.textLight}]}>
            Add your Context Engine features, navigation tabs, or dashboard
            widgets here.
          </Text>
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
    marginBottom: 24,
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
  themeToggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'rgba(59, 91, 219, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
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
  placeholderCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTitle: {
    ...FONTS.h5,
    fontWeight: '700',
    marginBottom: 6,
  },
  placeholderDesc: {
    ...FONTS.fontSm,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
});

export default Home;
