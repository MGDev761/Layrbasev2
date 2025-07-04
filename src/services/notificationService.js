import { supabase } from '../lib/supabase';

// Fetch notifications for a user
export async function fetchNotifications(userId, organizationId, limit = 50) {
  console.log('Fetching notifications for user:', userId, 'org:', organizationId); // Debug log
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  console.log('Fetched notifications:', data); // Debug log
  return data;
}

// Get unread notification count
export async function getUnreadCount(userId, organizationId) {
  console.log('Getting unread count for user:', userId, 'org:', organizationId); // Debug log
  const { data, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .eq('read', false);
  
  if (error) throw error;
  console.log('Unread count:', data?.length || 0); // Debug log
  return data?.length || 0;
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  
  if (error) throw error;
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId, organizationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .eq('read', false);
  
  if (error) throw error;
}

// Create a notification
export async function createNotification(notificationData) {
  console.log('Creating notification:', notificationData); // Debug log
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();
  
  if (error) throw error;
  console.log('Notification created successfully:', data); // Debug log
  return data;
}

// Create a task assignment notification
export async function createTaskAssignmentNotification(taskData, assignedUserId, organizationId) {
  const notificationData = {
    organization_id: organizationId,
    user_id: assignedUserId,
    type: 'info',
    title: 'New Task Assigned',
    message: `You have been assigned a new task: "${taskData.title}"`,
    category: 'system',
    data: {
      task_id: taskData.id,
      task_title: taskData.title,
      due_date: taskData.due_date,
      priority: taskData.priority,
      link: `/tasks`
    }
  };
  
  return createNotification(notificationData);
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