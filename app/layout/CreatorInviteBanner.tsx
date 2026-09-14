import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useAppSelector} from '../hooks/useRedux';
import {authService} from '../Service/authService';
import {OrganizationInvite} from '../types';

export const CreatorInviteBanner: React.FC = () => {
  const navigation = useNavigation<any>();
  const [dismissed, setDismissed] = useState(false);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);

  const user = useAppSelector(state => state.app.user);
  const accountType = useAppSelector(state => state.app.accountType);

  useEffect(() => {
    if (user && accountType === 'creator') {
      authService
        .getPendingInvites()
        .then(setInvites)
        .catch(() => setInvites([]));
    }
  }, [user, accountType]);

  if (!user || accountType === 'organization' || dismissed || invites.length === 0) {
    return null;
  }

  const latest = invites[0];

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerCard}>
        <View style={styles.iconCircle}>
          <FeatherIcon name="users" size={16} color="#FFFFFF" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.bannerTitle}>
            {invites.length} {invites.length === 1 ? 'brand wants' : 'brands want'} to collaborate
          </Text>
          <Text style={styles.bannerSubtitle}>
            {latest.organization_name
              ? `New invite from ${latest.organization_name}`
              : 'Review collaboration invites and start creating.'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.85}>
          <Text style={styles.ctaButtonText}>Review</Text>
          <FeatherIcon name="arrow-right" size={12} color="#7C3AED" />
        </TouchableOpacity>

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
    paddingTop: 8,
    paddingBottom: 4,
  },
  bannerCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#7C3AED',
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
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
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
    color: '#7C3AED',
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

export default CreatorInviteBanner;
