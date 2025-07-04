import { supabase } from '../lib/supabase';
import { createTaskAssignmentNotification } from './notificationService';

export async function fetchTasks(orgId) {
  // Fetch tasks for a specific organization and join user_profiles for assignee name (explicit join)
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:user_profiles!tasks_assigned_to_fkey(id, first_name, last_name)
    `)
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAssignees() {
  // Fetch all user_profiles for assignee dropdown
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .order('first_name');
  if (error) throw error;
  return data;
}

export async function fetchOrgAssignees(orgId) {
  // 1. Get all user_ids for the org
  const { data: members, error: membersError } = await supabase
    .from('user_organizations')
    .select('user_id')
    .eq('organization_id', orgId)
    .eq('is_active', true);
  if (membersError) throw membersError;
  const userIds = members.map(m => m.user_id).filter(Boolean);
  console.log('userIds', userIds); // Debug log

  // 2. Get user_profiles for those IDs
  if (userIds.length === 0) return [];
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .in('id', userIds);
  if (error) throw error;
  return data;
}

export async function createTask(task) {
  console.log('Creating task:', task); // Debug log
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  if (error) {
    console.error('Task creation error:', error);
    throw error;
  }

  console.log('Task created:', data); // Debug log

  // Only create notification if data exists
  if (data && task.assigned_to && (!task.created_by || task.assigned_to !== task.created_by)) {
    console.log('Creating notification for task assignment to:', task.assigned_to); // Debug log
    try {
      const notification = await createTaskAssignmentNotification(data, task.assigned_to, task.organization_id);
      console.log('Notification created:', notification); // Debug log
    } catch (notificationError) {
      console.error('Failed to create task assignment notification:', notificationError);
      // Don't fail the task creation if notification fails
    }
  } else {
    console.log('No notification needed - task not assigned to someone else or task creation failed'); // Debug log
  }

  return data;
}

export async function updateTask(id, updates) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  // Only create notification if data exists
  if (data && updates.assigned_to && (!data.created_by || updates.assigned_to !== data.created_by)) {
    try {
      await createTaskAssignmentNotification(data, updates.assigned_to, data.organization_id);
    } catch (notificationError) {
      console.error('Failed to create task assignment notification:', notificationError);
    }
  }

  return data;
}

export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function fetchMyTasks(orgId, userId, limit = 5) {
  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, due_date, status')
    .eq('organization_id', orgId)
    .eq('assigned_to', userId)
    .order('due_date', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
} 