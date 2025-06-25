import { supabase } from '../lib/supabase';

// Fetch all policies for an organization
export async function fetchPolicies(organization_id) {
  const { data, error } = await supabase
    .from('policies')
    .select('*')
    .eq('organization_id', organization_id)
    .order('name');
  if (error) throw error;
  return data;
}

// Add a new policy
export async function addPolicy(policy) {
  const { data, error } = await supabase
    .from('policies')
    .insert([policy])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update a policy
export async function updatePolicy(id, updates) {
  const { data, error } = await supabase
    .from('policies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a policy
export async function deletePolicy(id) {
  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Upload a file to Supabase Storage and return the public URL
export async function uploadPolicyFile(file, organization_id) {
  const filePath = `policies/${organization_id}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('public').upload(filePath, file);
  if (error) throw error;
  const { publicUrl } = supabase.storage.from('public').getPublicUrl(filePath).data;
  return publicUrl;
} 