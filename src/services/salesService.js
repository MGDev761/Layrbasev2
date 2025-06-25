import { supabase } from '../lib/supabase';

// --- CRM Companies ---
export async function getCrmCompanies(orgId) {
  return supabase.from('crm_companies').select('*').eq('organization_id', orgId).order('created_at', { ascending: false });
}
export async function getCrmCompany(id) {
  return supabase.from('crm_companies').select('*').eq('id', id).single();
}
export async function createCrmCompany(orgId, data) {
  return supabase.from('crm_companies').insert([{ ...data, organization_id: orgId }]);
}
export async function updateCrmCompany(id, data) {
  return supabase.from('crm_companies').update(data).eq('id', id);
}
export async function deleteCrmCompany(id) {
  return supabase.from('crm_companies').delete().eq('id', id);
}

// --- CRM Contacts ---
export async function getCrmContacts(orgId) {
  return supabase.from('crm_contacts').select('*').eq('organization_id', orgId).order('created_at', { ascending: false });
}
export async function getCrmContact(id) {
  return supabase.from('crm_contacts').select('*').eq('id', id).single();
}
export async function createCrmContact(orgId, data) {
  return supabase.from('crm_contacts').insert([{ ...data, organization_id: orgId }]);
}
export async function updateCrmContact(id, data) {
  return supabase.from('crm_contacts').update(data).eq('id', id);
}
export async function deleteCrmContact(id) {
  return supabase.from('crm_contacts').delete().eq('id', id);
}

// --- CRM Deals ---
export async function getCrmDeals(orgId) {
  return supabase.from('crm_deals').select('*').eq('organization_id', orgId).order('created_at', { ascending: false });
}
export async function getCrmDeal(id) {
  return supabase.from('crm_deals').select('*').eq('id', id).single();
}
export async function createCrmDeal(orgId, data) {
  return supabase.from('crm_deals').insert([{ ...data, organization_id: orgId }]);
}
export async function updateCrmDeal(id, data) {
  return supabase.from('crm_deals').update(data).eq('id', id);
}
export async function deleteCrmDeal(id) {
  return supabase.from('crm_deals').delete().eq('id', id);
}

// --- CRM Activities ---
export async function getCrmActivities(orgId) {
  return supabase.from('crm_activities').select('*').eq('organization_id', orgId).order('created_at', { ascending: false });
}
export async function getCrmActivity(id) {
  return supabase.from('crm_activities').select('*').eq('id', id).single();
}
export async function createCrmActivity(orgId, data) {
  return supabase.from('crm_activities').insert([{ ...data, organization_id: orgId }]);
}
export async function updateCrmActivity(id, data) {
  return supabase.from('crm_activities').update(data).eq('id', id);
}
export async function deleteCrmActivity(id) {
  return supabase.from('crm_activities').delete().eq('id', id);
}

// --- CRM Notes ---
export async function getCrmNotes(orgId, { deal_id, contact_id } = {}) {
  let query = supabase.from('crm_notes').select('*').eq('organization_id', orgId);
  if (deal_id) query = query.eq('deal_id', deal_id);
  if (contact_id) query = query.eq('contact_id', contact_id);
  return query.order('created_at', { ascending: false });
}
export async function getCrmNote(id) {
  return supabase.from('crm_notes').select('*').eq('id', id).single();
}
export async function createCrmNote(orgId, data) {
  return supabase.from('crm_notes').insert([{ ...data, organization_id: orgId }]);
}
export async function updateCrmNote(id, data) {
  return supabase.from('crm_notes').update(data).eq('id', id);
}
export async function deleteCrmNote(id) {
  return supabase.from('crm_notes').delete().eq('id', id);
}

// --- Recent Activities ---
export async function getRecentActivities(orgId, limit = 10) {
  // Get recent activities from multiple sources and combine them
  const [deals, contacts, companies, activities] = await Promise.all([
    supabase.from('crm_deals').select('id, name, value, stage, created_at, updated_at').eq('organization_id', orgId).order('updated_at', { ascending: false }).limit(limit),
    supabase.from('crm_contacts').select('id, first_name, last_name, email, created_at, updated_at').eq('organization_id', orgId).order('updated_at', { ascending: false }).limit(limit),
    supabase.from('crm_companies').select('id, name, created_at, updated_at').eq('organization_id', orgId).order('updated_at', { ascending: false }).limit(limit),
    supabase.from('crm_activities').select('id, type, description, created_at').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(limit)
  ]);

  // Combine and format activities
  const allActivities = [];
  
  // Add deal activities
  deals.data?.forEach(deal => {
    allActivities.push({
      id: `deal-${deal.id}`,
      type: 'deal',
      message: `Deal "${deal.name}" ${deal.stage === 'closed' ? 'closed' : 'updated'}`,
      time: new Date(deal.updated_at || deal.created_at).toLocaleDateString(),
      value: deal.value ? `£${parseFloat(deal.value).toLocaleString()}` : null,
      timestamp: new Date(deal.updated_at || deal.created_at).getTime()
    });
  });

  // Add contact activities
  contacts.data?.forEach(contact => {
    allActivities.push({
      id: `contact-${contact.id}`,
      type: 'contact',
      message: `Contact "${contact.first_name} ${contact.last_name}" ${contact.updated_at ? 'updated' : 'added'}`,
      time: new Date(contact.updated_at || contact.created_at).toLocaleDateString(),
      timestamp: new Date(contact.updated_at || contact.created_at).getTime()
    });
  });

  // Add company activities
  companies.data?.forEach(company => {
    allActivities.push({
      id: `company-${company.id}`,
      type: 'company',
      message: `Company "${company.name}" ${company.updated_at ? 'updated' : 'added'}`,
      time: new Date(company.updated_at || company.created_at).toLocaleDateString(),
      timestamp: new Date(company.updated_at || company.created_at).getTime()
    });
  });

  // Add explicit activities
  activities.data?.forEach(activity => {
    allActivities.push({
      id: `activity-${activity.id}`,
      type: 'activity',
      message: activity.description,
      time: new Date(activity.created_at).toLocaleDateString(),
      timestamp: new Date(activity.created_at).getTime()
    });
  });

  // Sort by timestamp and return the most recent
  return allActivities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
} 