import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../../../constants/theme';
import ProfileAvatar from '../../../components/ui/ProfileAvatar';
import {OrganizationMember, OrganizationInvite} from '../../../types';
import {authService} from '../../../Service/authService';

interface OrganizationTeamSectionProps {
  currentUserId?: string;
}

export const OrganizationTeamSection: React.FC<OrganizationTeamSectionProps> = ({
  currentUserId,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  const [inviteEmail, setInviteEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);

  const loadTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersData, invitesData] = await Promise.all([
        authService.getOrganizationMembers(),
        authService.getOrganizationInvites(),
      ]);
      setMembers(membersData);
      setInvites(invitesData);
    } catch (err: any) {
      console.warn('[OrganizationTeamSection] Load failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  const handleSendInvite = async () => {
    const trimmed = inviteEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setSendingInvite(true);
    try {
      await authService.sendOrganizationInvite(trimmed);
      setInviteEmail('');
      Alert.alert('Invite Sent', `Collaboration invitation sent to ${trimmed}.`);
      await loadTeamData();
    } catch (err: any) {
      Alert.alert('Failed to Send', err.message || 'Could not send invitation.');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleCancelInvite = (invite: OrganizationInvite) => {
    Alert.alert(
      'Cancel Invite',
      `Are you sure you want to cancel the invite for ${invite.email}?`,
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.cancelOrganizationInvite(invite.id);
              setInvites(prev => prev.filter(i => i.id !== invite.id));
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to cancel invite.');
            }
          },
        },
      ],
    );
  };

  const handleRemoveMember = (member: OrganizationMember) => {
    Alert.alert(
      'Remove Team Member',
      `Are you sure you want to remove ${member.full_name || member.email} from the workspace?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.removeOrganizationMember(member.user_id);
              setMembers(prev => prev.filter(m => m.user_id !== member.user_id));
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to remove member.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.sectionRoot}>
      {/* Title */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, {color: colors.title}]}>
          Team & Invites
        </Text>
        <Text style={[styles.sectionDesc, {color: colors.textLight}]}>
          Manage team members, roles, and pending workspace invitations.
        </Text>
      </View>

      {/* Invite Member Card */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Invite New Member
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          Send an email invitation to join this organization workspace.
        </Text>

        <View style={styles.inviteInputRow}>
          <TextInput
            style={[
              styles.emailInput,
              {
                color: colors.title,
                borderColor: colors.borderColor,
                backgroundColor: colors.background,
              },
            ]}
            placeholder="colleague@example.com"
            placeholderTextColor={colors.textLight}
            value={inviteEmail}
            onChangeText={setInviteEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!sendingInvite}
          />

          <TouchableOpacity
            style={[
              styles.sendInviteBtn,
              {backgroundColor: COLORS.primary},
              sendingInvite && {opacity: 0.7},
            ]}
            onPress={handleSendInvite}
            disabled={sendingInvite}
            activeOpacity={0.85}>
            {sendingInvite ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <FeatherIcon name="send" size={14} color="#FFFFFF" />
                <Text style={styles.sendInviteBtnText}>Send</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Members List */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <View style={styles.blockHeaderRow}>
          <Text style={[styles.blockTitle, {color: colors.title}]}>
            Active Members ({members.length})
          </Text>
          <TouchableOpacity onPress={loadTeamData} disabled={loading}>
            <FeatherIcon
              name="refresh-cw"
              size={14}
              color={loading ? colors.textLight : COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {loading && members.length === 0 ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{marginVertical: 16}} />
        ) : members.length === 0 ? (
          <Text style={[styles.emptyText, {color: colors.textLight}]}>
            No team members found.
          </Text>
        ) : (
          <View style={styles.membersList}>
            {members.map(member => {
              const isOwner = member.role === 'owner';
              const isSelf = member.user_id === currentUserId;
              return (
                <View
                  key={member.user_id}
                  style={[
                    styles.memberRow,
                    {borderBottomColor: colors.borderColor},
                  ]}>
                  <ProfileAvatar
                    name={member.full_name || member.email}
                    size={40}
                  />

                  <View style={styles.memberMeta}>
                    <Text
                      style={[styles.memberName, {color: colors.title}]}
                      numberOfLines={1}>
                      {member.full_name || 'Team Member'}{' '}
                      {isSelf && (
                        <Text style={{color: COLORS.primary, fontSize: 11}}>
                          (You)
                        </Text>
                      )}
                    </Text>
                    <Text
                      style={[styles.memberEmail, {color: colors.textLight}]}
                      numberOfLines={1}>
                      {member.email}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.roleChip,
                      isOwner
                        ? {backgroundColor: 'rgba(0, 105, 212, 0.12)'}
                        : {backgroundColor: 'rgba(0, 154, 134, 0.12)'},
                    ]}>
                    <Text
                      style={[
                        styles.roleChipText,
                        {color: isOwner ? COLORS.primary : COLORS.secondary},
                      ]}>
                      {isOwner ? 'Owner' : 'Member'}
                    </Text>
                  </View>

                  {!isOwner && (
                    <TouchableOpacity
                      style={styles.removeMemberBtn}
                      onPress={() => handleRemoveMember(member)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <FeatherIcon name="user-x" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Pending Invites List */}
      <View
        style={[
          styles.cardBlock,
          {backgroundColor: colors.card, borderColor: colors.borderColor},
        ]}>
        <Text style={[styles.blockTitle, {color: colors.title}]}>
          Pending Invites ({invites.length})
        </Text>
        <Text style={[styles.blockSubtitle, {color: colors.textLight}]}>
          Awaiting confirmation from recipients.
        </Text>

        {invites.length === 0 ? (
          <Text style={[styles.emptyText, {color: colors.textLight}]}>
            No pending invitations.
          </Text>
        ) : (
          <View style={styles.invitesList}>
            {invites.map(invite => (
              <View
                key={invite.id}
                style={[
                  styles.inviteRow,
                  {borderBottomColor: colors.borderColor},
                ]}>
                <View style={styles.inviteIconCircle}>
                  <FeatherIcon name="mail" size={16} color={COLORS.primary} />
                </View>

                <View style={styles.inviteMeta}>
                  <Text
                    style={[styles.inviteEmail, {color: colors.title}]}
                    numberOfLines={1}>
                    {invite.email}
                  </Text>
                  <Text
                    style={[styles.inviteStatus, {color: '#F59E0B'}]}>
                    Pending acceptance
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.cancelInviteBtn}
                  onPress={() => handleCancelInvite(invite)}>
                  <FeatherIcon name="x" size={14} color="#EF4444" />
                  <Text style={styles.cancelInviteText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionRoot: {
    gap: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionDesc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  cardBlock: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  blockSubtitle: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 14,
    lineHeight: 16,
  },
  inviteInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emailInput: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  sendInviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  sendInviteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  membersList: {
    marginTop: 4,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberMeta: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
  },
  memberEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  removeMemberBtn: {
    padding: 6,
  },
  invitesList: {
    marginTop: 4,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  inviteIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 105, 212, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inviteMeta: {
    flex: 1,
    marginRight: 8,
  },
  inviteEmail: {
    fontSize: 13,
    fontWeight: '600',
  },
  inviteStatus: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  cancelInviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  cancelInviteText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyText: {
    fontSize: 13,
    paddingVertical: 12,
    textAlign: 'center',
  },
});

export default OrganizationTeamSection;
