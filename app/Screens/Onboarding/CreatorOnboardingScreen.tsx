import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, FONTS} from '../../constants/theme';
import {useAppDispatch} from '../../hooks/useRedux';
import {setCreator, setOnboarded} from '../../Redux/slices/appSlice';
import {authService} from '../../Service/authService';

const NICHES = [
  'Tech & AI',
  'Fashion & Style',
  'Beauty & Skincare',
  'Gaming & Esports',
  'Fitness & Health',
  'Lifestyle & Vlogs',
  'Food & Culinary',
  'Travel & Adventure',
  'Business & Finance',
  'Education & Science',
  'Comedy & Skits',
  'Music & Audio',
  'Art & Design',
  'Crypto & Web3',
];

const GOALS = [
  {id: 'brand_deals', title: 'Land Paid Brand Deals', icon: 'dollar-sign'},
  {id: 'score_content', title: 'Analyze & Score Video Content', icon: 'zap'},
  {id: 'audience_growth', title: 'Grow Audience & Retention', icon: 'trending-up'},
  {id: 'collaborate', title: 'Connect with Leading Brands', icon: 'users'},
  {id: 'portfolio', title: 'Build Professional Creator Portfolio', icon: 'award'},
];

const SOCIAL_PLATFORMS = [
  {id: 'tiktok', name: 'TikTok', icon: 'music', color: '#FE2C55'},
  {id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E1306C'},
  {id: 'youtube', name: 'YouTube', icon: 'youtube-play', color: '#FF0000'},
  {id: 'xcom', name: 'X / Twitter', icon: 'twitter', color: '#1DA1F2'},
];

const CreatorOnboardingScreen = () => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [connectedSocials, setConnectedSocials] = useState<Record<string, boolean>>({
    tiktok: true,
    instagram: false,
    youtube: false,
    xcom: false,
  });
  const [selectedNiches, setSelectedNiches] = useState<string[]>(['Tech & AI']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['score_content']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSocial = (platformId: string) => {
    setConnectedSocials(prev => ({
      ...prev,
      [platformId]: !prev[platformId],
    }));
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev =>
      prev.includes(niche) ? prev.filter(item => item !== niche) : [...prev, niche]
    );
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(item => item !== goalId) : [...prev, goalId]
    );
  };

  const handleNext = async () => {
    setErrorMessage(null);

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (selectedNiches.length === 0) {
        setErrorMessage('Please select at least one content niche.');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (selectedGoals.length === 0) {
        setErrorMessage('Please select at least one goal.');
        return;
      }

      setLoading(true);
      try {
        const creatorProfile = await authService.completeCreatorOnboarding({
          niches: selectedNiches,
          goals: selectedGoals,
        });

        dispatch(setCreator(creatorProfile));
        setStep(4);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to complete creator onboarding.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (step === 4) {
      dispatch(setOnboarded(true));
      const timer = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, navigation, dispatch]);

  const handleFinish = () => {
    dispatch(setOnboarded(true));
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Progress & Back */}
      <View style={styles.topNav}>
        {step > 1 && step < 4 ? (
          <TouchableOpacity
            style={[styles.navBtn, {backgroundColor: colors.card, borderColor: colors.borderColor}]}
            onPress={() => setStep((step - 1) as any)}
            activeOpacity={0.8}>
            <FeatherIcon name="arrow-left" size={18} color={colors.title} />
          </TouchableOpacity>
        ) : (
          <View style={{width: 40}} />
        )}

        {/* Step Indicator Pills */}
        <View style={styles.stepPills}>
          {[1, 2, 3].map(i => (
            <View
              key={i}
              style={[
                styles.stepPill,
                {
                  backgroundColor:
                    step >= i ? COLORS.primary : colors.borderColor,
                  width: step === i ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={{width: 40}} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Error Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <FeatherIcon name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Step 1: Socials */}
        {step === 1 && (
          <View style={styles.stepBlock}>
            <View style={styles.headerBlock}>
              <Text style={[styles.stepTitle, {color: colors.title}]}>
                Connect Your Channels
              </Text>
              <Text style={[styles.stepSubtitle, {color: colors.textLight}]}>
                Link your active creator platforms to showcase content metrics and audience reach.
              </Text>
            </View>

            <View style={styles.socialsList}>
              {SOCIAL_PLATFORMS.map(platform => {
                const isConnected = !!connectedSocials[platform.id];

                return (
                  <TouchableOpacity
                    key={platform.id}
                    style={[
                      styles.socialCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: isConnected ? platform.color : colors.borderColor,
                      },
                    ]}
                    onPress={() => toggleSocial(platform.id)}
                    activeOpacity={0.85}>
                    <View style={styles.socialLeft}>
                      <View
                        style={[
                          styles.socialIconWrap,
                          {backgroundColor: `${platform.color}15`},
                        ]}>
                        <FontAwesome
                          name={platform.icon}
                          size={22}
                          color={platform.color}
                        />
                      </View>
                      <Text style={[styles.socialName, {color: colors.title}]}>
                        {platform.name}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.connectStatusBadge,
                        {
                          backgroundColor: isConnected
                            ? `${platform.color}15`
                            : theme.dark
                            ? '#1E293B'
                            : '#F1F5F9',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.connectStatusText,
                          {
                            color: isConnected ? platform.color : colors.textLight,
                          },
                        ]}>
                        {isConnected ? 'Connected' : 'Tap to Link'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 2: Niches */}
        {step === 2 && (
          <View style={styles.stepBlock}>
            <View style={styles.headerBlock}>
              <Text style={[styles.stepTitle, {color: colors.title}]}>
                Select Your Niches
              </Text>
              <Text style={[styles.stepSubtitle, {color: colors.textLight}]}>
                Pick the primary content categories you specialize in for smart campaign matching.
              </Text>
            </View>

            <View style={styles.chipsWrap}>
              {NICHES.map(niche => {
                const isSelected = selectedNiches.includes(niche);

                return (
                  <TouchableOpacity
                    key={niche}
                    style={[
                      styles.nicheChip,
                      {
                        backgroundColor: isSelected
                          ? COLORS.primary
                          : colors.card,
                        borderColor: isSelected
                          ? COLORS.primary
                          : colors.borderColor,
                      },
                    ]}
                    onPress={() => toggleNiche(niche)}
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.nicheChipText,
                        {color: isSelected ? '#FFFFFF' : colors.title},
                      ]}>
                      {niche}
                    </Text>
                    {isSelected && (
                      <FeatherIcon
                        name="check"
                        size={14}
                        color="#FFFFFF"
                        style={{marginLeft: 6}}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <View style={styles.stepBlock}>
            <View style={styles.headerBlock}>
              <Text style={[styles.stepTitle, {color: colors.title}]}>
                What are your main goals?
              </Text>
              <Text style={[styles.stepSubtitle, {color: colors.textLight}]}>
                We will tailor your video intelligence reports and dashboard recommendations.
              </Text>
            </View>

            <View style={styles.goalsList}>
              {GOALS.map(goal => {
                const isSelected = selectedGoals.includes(goal.id);

                return (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected ? COLORS.primary : colors.borderColor,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                    onPress={() => toggleGoal(goal.id)}
                    activeOpacity={0.85}>
                    <View
                      style={[
                        styles.goalIconWrap,
                        {
                          backgroundColor: isSelected
                            ? 'rgba(59, 91, 219, 0.12)'
                            : theme.dark
                            ? '#1E293B'
                            : '#F1F5F9',
                        },
                      ]}>
                      <FeatherIcon
                        name={goal.icon}
                        size={20}
                        color={isSelected ? COLORS.primary : colors.textLight}
                      />
                    </View>
                    <Text
                      style={[
                        styles.goalTitle,
                        {color: isSelected ? COLORS.primary : colors.title},
                      ]}>
                      {goal.title}
                    </Text>
                    <View
                      style={[
                        styles.goalCheck,
                        {
                          borderColor: isSelected ? COLORS.primary : colors.borderColor,
                          backgroundColor: isSelected ? COLORS.primary : 'transparent',
                        },
                      ]}>
                      {isSelected && (
                        <FeatherIcon name="check" size={12} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <View style={styles.successBlock}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <FeatherIcon name="check" size={36} color="#FFFFFF" />
              </View>
            </View>

            <Text style={[styles.successTitle, {color: colors.title}]}>
              Creator Profile Ready!
            </Text>
            <Text style={[styles.successSubtitle, {color: colors.textLight}]}>
              Your Context Engine creator account is now active. You can start scoring campaign videos, building your portfolio, and getting discovered.
            </Text>

            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: COLORS.primary}]}
              onPress={handleFinish}
              activeOpacity={0.85}>
              <Text style={styles.actionBtnText}>Enter Workspace</Text>
              <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Continue Button for Steps 1-3 */}
        {step < 4 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {backgroundColor: COLORS.primary},
                loading && {opacity: 0.7},
              ]}
              onPress={handleNext}
              disabled={loading}
              activeOpacity={0.85}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.actionBtnText}>
                    {step === 3 ? 'Complete Setup' : 'Continue'}
                  </Text>
                  <FeatherIcon name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepPill: {
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 24,
  },
  stepTitle: {
    ...FONTS.h3,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  stepSubtitle: {
    ...FONTS.font,
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    gap: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  stepBlock: {
    flex: 1,
  },
  socialsList: {
    gap: 12,
    marginBottom: 24,
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  socialIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialName: {
    fontSize: 16,
    fontWeight: '700',
  },
  connectStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  connectStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  nicheChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  nicheChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalsList: {
    gap: 12,
    marginBottom: 24,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  goalIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  goalCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  successBlock: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successIconOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    ...FONTS.h3,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    ...FONTS.font,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 36,
  },
});

export default CreatorOnboardingScreen;
