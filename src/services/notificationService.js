import { supabase } from '../lib/supabase';

// Get notifications for a user in an organization
export async function getNotifications(orgId, userId, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

// Get unread notifications count
export async function getUnreadCount(orgId, userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .eq('read', false);
  
  if (error) throw error;
  return count || 0;
}

// Mark notification as read
export async function markAsRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Mark all notifications as read
export async function markAllAsRead(orgId, userId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .eq('read', false)
    .select();
  
  if (error) throw error;
  return data;
}

// Create a new notification
export async function createNotification(notification) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Delete a notification
export async function deleteNotification(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  
  if (error) throw error;
}

// Create system notifications (for automated processes)
export async function createSystemNotification(orgId, userId, notification) {
  return createNotification({
    organization_id: orgId,
    user_id: userId,
    type: notification.type || 'info',
    category: notification.category || 'system',
    title: notification.title,
    message: notification.message,
    action_url: notification.action_url,
    action_text: notification.action_text,
    expires_at: notification.expires_at
  });
}

// Create sales notifications
export async function createSalesNotification(orgId, userId, notification) {
  return createNotification({
    organization_id: orgId,
    user_id: userId,
    type: notification.type || 'info',
    category: 'sales',
    title: notification.title,
    message: notification.message,
    action_url: notification.action_url,
    action_text: notification.action_text,
    expires_at: notification.expires_at
  });
}

// Create HR notifications
export async function createHRNotification(orgId, userId, notification) {
  return createNotification({
    organization_id: orgId,
    user_id: userId,
    type: notification.type || 'info',
    category: 'hr',
    title: notification.title,
    message: notification.message,
    action_url: notification.action_url,
    action_text: notification.action_text,
    expires_at: notification.expires_at
  });
}

// Create finance notifications
export async function createFinanceNotification(orgId, userId, notification) {
  return createNotification({
    organization_id: orgId,
    user_id: userId,
    type: notification.type || 'info',
    category: 'finance',
    title: notification.title,
    message: notification.message,
    action_url: notification.action_url,
    action_text: notification.action_text,
    expires_at: notification.expires_at
  });
}

// Create marketing notifications
export async function createMarketingNotification(orgId, userId, notification) {
  return createNotification({
    organization_id: orgId,
    user_id: userId,
    type: notification.type || 'info',
    category: 'marketing',
    title: notification.title,
    message: notification.message,
    action_url: notification.action_url,
    action_text: notification.action_text,
    expires_at: notification.expires_at
  });
} 