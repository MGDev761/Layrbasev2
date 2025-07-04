import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { 
  fetchNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, currentOrganization } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    if (!user?.id || !currentOrganization?.organization_id) {
      console.log('Cannot load notifications - missing user or org:', { userId: user?.id, orgId: currentOrganization?.organization_id }); // Debug log
      return;
    }
    
    console.log('Loading notifications for user:', user.id, 'org:', currentOrganization.organization_id); // Debug log
    setLoading(true);
    try {
      const [notifs] = await Promise.all([
        fetchNotifications(user.id, currentOrganization.organization_id)
      ]);
      console.log('Loaded notifications:', notifs); // Debug log
      setNotifications(notifs || []);
      setUnreadCount((notifs || []).filter(n => n && n.read === false).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsReadHandler = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsReadHandler = async () => {
    if (!user?.id || !currentOrganization?.organization_id) return;
    
    try {
      await markAllNotificationsAsRead(user.id, currentOrganization.organization_id);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev];
      setUnreadCount(updated.filter(n => n && n.read === false).length);
      return updated;
    });
    // Force refresh to ensure bell icon updates
    loadNotifications();
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    // Check if it was unread
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Load notifications when user or organization changes
  useEffect(() => {
    loadNotifications();
  }, [user?.id, currentOrganization?.organization_id]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user?.id || !currentOrganization?.organization_id) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `organization_id=eq.${currentOrganization.organization_id} AND user_id=eq.${user.id}`
        },
        (payload) => {
          addNotification(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `organization_id=eq.${currentOrganization.organization_id} AND user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === payload.new.id ? payload.new : notif
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `organization_id=eq.${currentOrganization.organization_id} AND user_id=eq.${user.id}`
        },
        (payload) => {
          removeNotification(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, currentOrganization?.organization_id]);

  const value = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markNotificationAsRead: markNotificationAsReadHandler,
    markAllNotificationsAsRead: markAllNotificationsAsReadHandler,
    addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 