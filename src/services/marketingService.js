import { supabase } from '../lib/supabase';

// Marketing Events
export const getMarketingEvents = async (organizationId) => {
  try {
    const { data, error } = await supabase
      .from('marketing_events')
      .select('*')
      .eq('organization_id', organizationId)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching marketing events:', error);
    throw error;
  }
};

export const createMarketingEvent = async (eventData, organizationId) => {
  try {
    const { data, error } = await supabase
      .from('marketing_events')
      .insert([{
        ...eventData,
        organization_id: organizationId,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating marketing event:', error);
    throw error;
  }
};

export const updateMarketingEvent = async (eventId, updates) => {
  try {
    const { data, error } = await supabase
      .from('marketing_events')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating marketing event:', error);
    throw error;
  }
};

export const deleteMarketingEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from('marketing_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting marketing event:', error);
    throw error;
  }
};

// Brand Assets
export const getBrandAssets = async (organizationId) => {
  try {
    const { data, error } = await supabase
      .from('brand_assets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching brand assets:', error);
    throw error;
  }
};

export const uploadBrandAsset = async (file, assetData, organizationId) => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${organizationId}/${Date.now()}.${fileExt}`;
    const filePath = `brand-assets/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('marketing-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('marketing-assets')
      .getPublicUrl(filePath);

    // Create database record
    const { data, error } = await supabase
      .from('brand_assets')
      .insert([{
        ...assetData,
        organization_id: organizationId,
        file_path: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: userId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading brand asset:', error);
    throw error;
  }
};

export const deleteBrandAsset = async (assetId) => {
  try {
    const { error } = await supabase
      .from('brand_assets')
      .delete()
      .eq('id', assetId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting brand asset:', error);
    throw error;
  }
};

// Brand Information
export const getBrandInformation = async (organizationId) => {
  try {
    const { data, error } = await supabase
      .from('brand_information')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || {
      organization_id: organizationId,
      tagline: '',
      brand_blurb: '',
      color_palette: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'],
      logo_url: ''
    };
  } catch (error) {
    console.error('Error fetching brand information:', error);
    throw error;
  }
};

export const upsertBrandInformation = async (brandData, organizationId) => {
  try {
    console.log('upsertBrandInformation called with:', { brandData, organizationId });
    const { data, error } = await supabase
      .from('brand_information')
      .upsert([{
        ...brandData,
        organization_id: organizationId,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    console.log('Supabase response:', { data, error });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting brand information:', error);
    throw error;
  }
};

export const uploadBrandLogo = async (file, organizationId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${organizationId}/logo.${fileExt}`;
    const filePath = `brand-logos/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('marketing-assets')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('marketing-assets')
      .getPublicUrl(filePath);

    // Update brand information
    await upsertBrandInformation({ logo_url: urlData.publicUrl }, organizationId);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading brand logo:', error);
    throw error;
  }
};

// Sales Collateral
export const getSalesCollateral = async (organizationId) => {
  try {
    const { data, error } = await supabase
      .from('sales_collateral')
      .select('*')
      .eq('organization_id', organizationId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sales collateral:', error);
    throw error;
  }
};

export const uploadSalesCollateral = async (file, collateralData, organizationId) => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${organizationId}/${Date.now()}.${fileExt}`;
    const filePath = `sales-collateral/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('marketing-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('marketing-assets')
      .getPublicUrl(filePath);

    // Create database record
    const { data, error } = await supabase
      .from('sales_collateral')
      .insert([{
        ...collateralData,
        organization_id: organizationId,
        file_path: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: userId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error uploading sales collateral:', error);
    throw error;
  }
};

export const deleteSalesCollateral = async (collateralId) => {
  try {
    const { error } = await supabase
      .from('sales_collateral')
      .delete()
      .eq('id', collateralId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting sales collateral:', error);
    throw error;
  }
};

// Get upcoming marketing events for dashboard
export const getUpcomingMarketingEvents = async (organizationId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('marketing_events')
      .select('*')
      .eq('organization_id', organizationId)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming marketing events:', error);
    throw error;
  }
}; 