import api, {formatApiError} from './api';
import {NotificationList, NotificationUnreadCount, AppNotification} from '../types';

export const notificationService = {
  /**
   * Fetch user notifications list
   */
  async getNotifications(unreadOnly = false): Promise<AppNotification[]> {
    try {
      const response = await api.get<NotificationList>(
        `/notifications${unreadOnly ? '?unread_only=true' : ''}`,
      );
      return response.data?.items || [];
    } catch (err: any) {
      console.warn('[NotificationService] Failed to load notifications:', err.message);
      return [];
    }
  },

  /**
   * Fetch unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get<NotificationUnreadCount>('/notifications/unread-count');
      return response.data?.count || 0;
    } catch (err: any) {
      console.warn('[NotificationService] Failed to load unread count:', err.message);
      return 0;
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read`, {});
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },

  /**
   * Dismiss/delete a notification
   */
  async dismissNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (err: any) {
      throw new Error(formatApiError(err));
    }
  },
};

export default notificationService;
