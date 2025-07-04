import { supabase } from '../lib/supabase';
import { createTask } from './taskService';
import { fetchEmployees } from './employeesService';

// Fetch leave requests for org (optionally filter by status, employee, etc)
export async function fetchLeaveRequests(orgId, { status, employeeId } = {}) {
  let query = supabase.from('leave_requests').select('*').eq('organization_id', orgId);
  if (status) query = query.eq('status', status);
  if (employeeId) query = query.eq('employee_id', employeeId);
  query = query.order('start_date', { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Create a leave request
export async function createLeaveRequest(request) {
  // Calculate days between start and end date
  const startDate = new Date(request.start_date);
  const endDate = new Date(request.end_date);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  const requestData = {
    ...request
    // don't add days
  };

  const { data, error } = await supabase.from('leave_requests').insert([requestData]).select().single();
  if (error) throw error;

  // --- Task creation for manager approval ---
  // Find the employee's manager
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('id, name, manager_id')
    .eq('id', request.employee_id)
    .single();
  if (!empError && employee && employee.manager_id) {
    // Get the manager's user_id
    const { data: manager, error: mgrError } = await supabase
      .from('employees')
      .select('user_id')
      .eq('id', employee.manager_id)
      .single();
    if (!mgrError && manager && manager.user_id) {
      // Create a task for the manager
      await createTask({
        title: `Approve leave request for ${employee.name}`,
        description: `Leave request from ${employee.name} (${request.type}, ${request.start_date} to ${request.end_date})`,
        priority: 'Medium',
        status: 'To Do',
        due_date: request.start_date,
        assigned_to: manager.user_id,
        organization_id: request.organization_id,
        module: 'HR',
        tags: ['leave', 'approval']
      });
    }
  }
  // --- End task creation ---

  return data;
}

// Approve/decline a leave request
export async function updateLeaveRequest(id, updates) {
  const { data, error } = await supabase.from('leave_requests').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// Approve a leave request and update leave balance
export async function approveLeaveRequest(requestId, approvedByUserId) {
  const { data: request, error: requestError } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('id', requestId)
    .single();
  
  if (requestError) throw requestError;
  if (!request) throw new Error('Leave request not found');

  // Calculate days
  const startDate = new Date(request.start_date);
  const endDate = new Date(request.end_date);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const totalDays = request.half_day ? days * 0.5 : days;

  // Update the request status
  const { error: updateError } = await supabase
    .from('leave_requests')
    .update({ 
      status: 'approved', 
      approved_at: new Date().toISOString(),
      approver_id: approvedByUserId
    })
    .eq('id', requestId);

  if (updateError) throw updateError;

  // Update the leave balance
  const { data: balance, error: balanceError } = await supabase
    .from('leave_balances')
    .select('*')
    .eq('employee_id', request.employee_id)
    .eq('type', request.type)
    .eq('year', new Date().getFullYear())
    .single();

  if (balanceError) throw balanceError;

  const newUsed = (balance.used || 0) + totalDays;
  
  const { error: updateBalanceError } = await supabase
    .from('leave_balances')
    .update({ used: newUsed })
    .eq('id', balance.id);

  if (updateBalanceError) throw updateBalanceError;

  return { request, balance: { ...balance, used: newUsed } };
}

// Decline a leave request
export async function declineLeaveRequest(requestId, declinedByUserId) {
  const { data, error } = await supabase
    .from('leave_requests')
    .update({ 
      status: 'declined', 
      approved_at: new Date().toISOString(),
      approver_id: declinedByUserId
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch leave balances for org or employee
export async function fetchLeaveBalances(orgId, employeeId = null) {
  let query = supabase.from('leave_balances').select('*').eq('organization_id', orgId);
  if (employeeId) query = query.eq('employee_id', employeeId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Create initial leave balances for an employee
export async function createLeaveBalances(orgId, employeeId, balances) {
  const currentYear = new Date().getFullYear();
  const balanceRecords = balances.map(balance => ({
    organization_id: orgId,
    employee_id: employeeId,
    type: balance.type,
    year: currentYear,
    balance: balance.balance,
    used: 0,
    carryover: 0
  }));
  
  const { data, error } = await supabase.from('leave_balances').insert(balanceRecords).select();
  if (error) throw error;
  return data;
}

// Update leave balance (e.g., after approval)
export async function updateLeaveBalance(id, updates) {
  const { data, error } = await supabase.from('leave_balances').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
} 