import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/theme';
import DashboardLayout from '../../layout/DashboardLayout';

export const PortfolioScreen = ({navigation}: any) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  return (
    <DashboardLayout activeTab="portfolio" title="My Portfolio">
      <View style={styles.container}>
        <View
          style={[
            styles.heroCard,
            {backgroundColor: colors.card, borderColor: colors.borderColor},
          ]}>
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: 'rgba(0, 105, 212, 0.1)'},
            ]}>
            <FeatherIcon name="image" size={28} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, {color: colors.title}]}>
            Creator Portfolio
          </Text>
          <Text style={[styles.subtitle, {color: colors.textLight}]}>
            Showcase your completed creative video projects, metrics, and case studies to brands.
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, {backgroundColor: COLORS.primary}]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}>
            <FeatherIcon name="edit-3" size={16} color="#FFFFFF" />
            <Text style={styles.btnText}>Edit Bio & Niches</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 280,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PortfolioScreen;
