import { supabase } from '../lib/supabase';

// Fetch all holidays for an organization (join employees)
export async function fetchHolidays(organization_id) {
  const { data, error } = await supabase
    .from('holidays')
    .select('*, employee:employee_id(*)')
    .in('employee_id',
      (await supabase.from('employees').select('id').eq('organization_id', organization_id)).data?.map(e => e.id) || []
    )
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data;
}

// Add a new holiday request
export async function addHoliday(holiday) {
  const { data, error } = await supabase
    .from('holidays')
    .insert([holiday])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update a holiday request
export async function updateHoliday(id, updates) {
  const { data, error } = await supabase
    .from('holidays')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a holiday request
export async function deleteHoliday(id) {
  const { error } = await supabase
    .from('holidays')
    .delete()
    .eq('id', id);
  if (error) throw error;
} 