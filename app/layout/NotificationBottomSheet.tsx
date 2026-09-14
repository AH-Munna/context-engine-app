import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';
import BottomSheet from '../components/ui/BottomSheet';
import notificationService from '../Service/notificationService';
import {AppNotification} from '../types';

interface NotificationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationBottomSheet: React.FC<NotificationBottomSheetProps> = ({
  visible,
  onClose,
  onUnreadCountChange,
}) => {
  const theme = useTheme();
  const {colors}: {colors: any} = theme;

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const items = await notificationService.getNotifications();
      setNotifications(items);
      const unreadCount = items.filter(n => !n.read_at).length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);
    } catch (err) {
      console.warn('[NotificationBottomSheet] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [onUnreadCountChange]);

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? {...n, read_at: new Date().toISOString()} : n,
        ),
      );
      if (onUnreadCountChange) {
        onUnreadCountChange(
          notifications.filter(n => n.id !== id && !n.read_at).length,
        );
      }
    } catch (err) {
      console.warn('[NotificationBottomSheet] Mark as read failed:', err);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await notificationService.dismissNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (onUnreadCountChange) {
        onUnreadCountChange(
          notifications.filter(n => n.id !== id && !n.read_at).length,
        );
      }
    } catch (err) {
      console.warn('[NotificationBottomSheet] Dismiss failed:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read_at);
    for (const item of unread) {
      try {
        await notificationService.markAsRead(item.id);
      } catch {}
    }
    setNotifications(prev =>
      prev.map(n => ({...n, read_at: new Date().toISOString()})),
    );
    if (onUnreadCountChange) onUnreadCountChange(0);
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Notifications"
      subtitle={`${notifications.filter(n => !n.read_at).length} unread`}
      scrollable={false}
      maxHeight="80%">
      <View style={styles.container}>
        {/* Header Action Row */}
        {notifications.some(n => !n.read_at) && (
          <View style={styles.actionHeaderRow}>
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={handleMarkAllAsRead}>
              <FeatherIcon name="check-circle" size={14} color={COLORS.primary} />
              <Text style={styles.markAllBtnText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={[styles.statusText, {color: colors.textLight}]}>
              Loading notifications...
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.centerContainer}>
            <View
              style={[
                styles.emptyIconWrap,
                {backgroundColor: theme.dark ? '#182234' : '#F1F5F9'},
              ]}>
              <FeatherIcon name="bell" size={28} color={colors.textLight} />
            </View>
            <Text style={[styles.emptyTitle, {color: colors.title}]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptySubtitle, {color: colors.textLight}]}>
              You're all caught up! New invites, updates, and messages will appear here.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}>
            {notifications.map(item => {
              const isUnread = !item.read_at;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.notificationCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isUnread
                        ? 'rgba(0, 105, 212, 0.3)'
                        : colors.borderColor,
                    },
                    isUnread && {
                      backgroundColor: theme.dark
                        ? 'rgba(0, 105, 212, 0.08)'
                        : 'rgba(0, 105, 212, 0.03)',
                    },
                  ]}>
                  {/* Left Icon */}
                  <View
                    style={[
                      styles.itemIconWrap,
                      {
                        backgroundColor: isUnread
                          ? 'rgba(0, 105, 212, 0.12)'
                          : colors.background,
                      },
                    ]}>
                    <FeatherIcon
                      name={
                        item.type.includes('invite')
                          ? 'user-plus'
                          : item.type.includes('approval')
                          ? 'check-circle'
                          : 'bell'
                      }
                      size={18}
                      color={isUnread ? COLORS.primary : colors.textLight}
                    />
                  </View>

                  {/* Body Content */}
                  <View style={styles.itemBody}>
                    <View style={styles.itemHeader}>
                      <Text
                        style={[
                          styles.itemTitle,
                          {
                            color: colors.title,
                            fontWeight: isUnread ? '700' : '600',
                          },
                        ]}
                        numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text
                        style={[styles.itemTime, {color: colors.textLight}]}>
                        {formatTimestamp(item.created_at)}
                      </Text>
                    </View>

                    <Text
                      style={[styles.itemText, {color: colors.textLight}]}
                      numberOfLines={3}>
                      {item.body}
                    </Text>

                    {/* Quick actions for unread */}
                    {isUnread && (
                      <View style={styles.itemActions}>
                        <TouchableOpacity
                          style={styles.actionChip}
                          onPress={() => handleMarkAsRead(item.id)}>
                          <FeatherIcon name="check" size={12} color={COLORS.primary} />
                          <Text style={styles.actionChipText}>Mark read</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Dismiss button */}
                  <TouchableOpacity
                    style={styles.dismissBtn}
                    onPress={() => handleDismiss(item.id)}
                    hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                    <FeatherIcon name="x" size={14} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 280,
  },
  actionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  statusText: {
    fontSize: 13,
    marginTop: 10,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContainer: {
    paddingBottom: 24,
    gap: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    position: 'relative',
  },
  itemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemBody: {
    flex: 1,
    paddingRight: 18,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  itemTime: {
    fontSize: 10,
  },
  itemText: {
    fontSize: 12,
    lineHeight: 16,
  },
  itemActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 105, 212, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dismissBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
});

export default NotificationBottomSheet;
