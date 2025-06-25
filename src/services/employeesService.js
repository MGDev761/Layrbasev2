import { supabase } from '../lib/supabase';

// Fetch all employees for an organization
export async function fetchEmployees(organization_id) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('organization_id', organization_id)
    .order('name');
  if (error) throw error;
  return data;
}

// Fetch employee by user_id
export async function fetchEmployeeByUserId(user_id) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('user_id', user_id)
    .single();
  if (error) throw error;
  return data;
}

// Add a new employee
export async function addEmployee(employee) {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update an employee
export async function updateEmployee(id, updates) {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Link a user to an employee
export async function linkUserToEmployee(employeeId, userId) {
  return updateEmployee(employeeId, { user_id: userId });
}

// Unlink a user from an employee
export async function unlinkUserFromEmployee(employeeId) {
  return updateEmployee(employeeId, { user_id: null });
}

// Delete an employee
export async function deleteEmployee(id) {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Fetch org chart (all employees with manager_id)
export async function fetchOrgChart(organization_id) {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('organization_id', organization_id);
  if (error) throw error;
  return data;
} 