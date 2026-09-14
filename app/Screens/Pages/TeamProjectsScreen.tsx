import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/theme';
import DashboardLayout from '../../layout/DashboardLayout';

export const TeamProjectsScreen = ({navigation}: any) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  return (
    <DashboardLayout activeTab="team-projects" title="Team Projects">
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
            <FeatherIcon name="users" size={28} color={COLORS.primary} />
          </View>
          <Text style={[styles.title, {color: colors.title}]}>
            Team Projects
          </Text>
          <Text style={[styles.subtitle, {color: colors.textLight}]}>
            Collaborate across team members on multi-creator briefs and production queues.
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, {backgroundColor: COLORS.primary}]}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}>
            <FeatherIcon name="grid" size={16} color="#FFFFFF" />
            <Text style={styles.btnText}>View All Projects</Text>
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

export default TeamProjectsScreen;
