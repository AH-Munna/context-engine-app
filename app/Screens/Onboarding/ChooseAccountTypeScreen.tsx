import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONTS} from '../../constants/theme';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {setAccountType} from '../../Redux/slices/appSlice';
import {AccountType} from '../../types';

interface AccountOption {
  type: AccountType;
  title: string;
  description: string;
  iconName: string;
  tag: string;
  color: string;
  bgTint: string;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    type: 'creator',
    title: 'Creator',
    description:
      'Upload video analysis, track scores, build your portfolio, and showcase your work in the marketplace for brands to discover.',
    iconName: 'video',
    tag: 'Content Creator',
    color: '#0CA678', // Vibrant Teal
    bgTint: 'rgba(12, 166, 120, 0.08)',
  },
  {
    type: 'organization',
    title: 'Organization',
    description:
      'Analyze campaign videos, set target audiences, manage brand profiles, and hire creators for your campaigns.',
    iconName: 'briefcase',
    tag: 'Brand / Agency',
    color: '#3B5BDB', // Brand Indigo
    bgTint: 'rgba(59, 91, 219, 0.08)',
  },
];

const ChooseAccountTypeScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const currentAccountType = useAppSelector(state => state.app.accountType);

  const [selectedType, setSelectedType] = useState<AccountType>(
    currentAccountType || 'creator'
  );

  const handleContinue = () => {
    dispatch(setAccountType(selectedType));

    if (selectedType === 'creator') {
      navigation.navigate('CreatorOnboarding');
    } else {
      navigation.navigate('OrgOnboarding');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Header Title */}
        <View style={styles.headerBlock}>
          <View style={styles.badgeWrap}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Step 1 of Onboarding</Text>
            </View>
          </View>

          <Text style={[styles.title, {color: colors.title}]}>
            How will you use Context Engine?
          </Text>
          <Text style={[styles.subtitle, {color: colors.textLight}]}>
            Select your account type to personalize your experience. You can manage both creator content and brand campaigns.
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {ACCOUNT_OPTIONS.map(option => {
            const isSelected = selectedType === option.type;

            return (
              <TouchableOpacity
                key={option.type}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? option.color : colors.borderColor,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedType(option.type)}
                activeOpacity={0.85}>
                
                {/* Radio selection bubble */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconCircle,
                      {backgroundColor: isSelected ? option.color : option.bgTint},
                    ]}>
                    <FeatherIcon
                      name={option.iconName}
                      size={24}
                      color={isSelected ? '#FFFFFF' : option.color}
                    />
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? option.color : colors.borderColor,
                        backgroundColor: isSelected ? option.color : 'transparent',
                      },
                    ]}>
                    {isSelected && (
                      <FeatherIcon name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.cardTitle, {color: colors.title}]}>
                      {option.title}
                    </Text>
                    <View
                      style={[
                        styles.tagWrap,
                        {backgroundColor: option.bgTint},
                      ]}>
                      <Text style={[styles.tagText, {color: option.color}]}>
                        {option.tag}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.cardDesc, {color: colors.textLight}]}>
                    {option.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Button */}
        <View style={styles.actionBlock}>
          <TouchableOpacity
            style={[styles.continueBtn, {backgroundColor: COLORS.primary}]}
            onPress={handleContinue}
            activeOpacity={0.85}>
            <Text style={styles.continueBtnText}>Continue to Setup</Text>
            <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  badgeWrap: {
    marginBottom: 12,
  },
  badge: {
    backgroundColor: 'rgba(59, 91, 219, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  title: {
    ...FONTS.h3,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    ...FONTS.font,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  optionsList: {
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    ...FONTS.h4,
    fontWeight: '700',
  },
  tagWrap: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDesc: {
    ...FONTS.fontSm,
    lineHeight: 20,
  },
  actionBlock: {
    marginTop: 'auto',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ChooseAccountTypeScreen;
