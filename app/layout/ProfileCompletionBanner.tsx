import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import {useAppSelector} from '../hooks/useRedux';

export const ProfileCompletionBanner: React.FC = () => {
  const navigation = useNavigation<any>();
  const [dismissed, setDismissed] = useState(false);

  const user = useAppSelector(state => state.app.user);
  const organization = useAppSelector(state => state.app.organization);
  const accountType = useAppSelector(state => state.app.accountType);

  if (!user || dismissed) return null;

  const isOrg = accountType === 'organization';

  const orgFields = organization
    ? [
        organization.name,
        organization.logo_url,
        organization.website,
        organization.industry,
        organization.country,
        organization.timezone,
      ]
    : [user.full_name, user.avatar_url, null, null, null, null];

  const creatorFields = [user.full_name, user.bio, user.phone, user.avatar_url];

  const fields = isOrg ? orgFields : creatorFields;
  const filledCount = fields.filter(Boolean).length;
  const completionPct = Math.round((filledCount / fields.length) * 100);

  // If 100% complete, do not show banner
  if (completionPct >= 100) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerCard}>
        {/* Left Sparkles Icon */}
        <View style={styles.iconCircle}>
          <FeatherIcon name="sparkles" size={16} color="#FFFFFF" />
        </View>

        {/* Text & Progress */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.bannerTitle}>
              {isOrg ? 'Complete organization profile' : 'Complete your profile'}
            </Text>
            <Text style={styles.percentText}>{completionPct}%</Text>
          </View>

          <Text style={styles.bannerSubtitle}>
            {isOrg
              ? 'Add missing company details to unlock your full workspace.'
              : 'Add missing details to unlock your full creator experience.'}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: `${completionPct}%`}]} />
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>Set up</Text>
          <FeatherIcon name="arrow-right" size={12} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Dismiss Button */}
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => setDismissed(true)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FeatherIcon name="x" size={14} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  bannerCard: {
    backgroundColor: '#0069D4',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#0069D4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  percentText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 6,
    marginRight: 16,
  },
  ctaButtonText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});

export default ProfileCompletionBanner;
