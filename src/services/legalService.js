import { supabase } from '../lib/supabase';

// Template operations
export const getTemplates = async () => {
  const { data, error } = await supabase
    .from('legal_templates')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data;
};

export const getTemplateById = async (id) => {
  const { data, error } = await supabase
    .from('legal_templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// Contract operations
export const getContracts = async (organizationId) => {
  if (!organizationId) return [];

  const { data, error } = await supabase
    .from('legal_contracts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching contracts:", error);
    throw error;
  }
  return data;
};

export const createContractFromTemplate = async (templateId, contractData) => {
  const { data, error } = await supabase
    .rpc('create_contract_from_template', {
      p_template_id: templateId,
      p_name: contractData.name,
      p_contract_data: contractData.data,
      p_description: contractData.description,
      p_folder_id: contractData.folderId,
      p_effective_date: contractData.effectiveDate,
      p_expiry_date: contractData.expiryDate,
      p_organization_id: contractData.organizationId
    });
  
  if (error) throw error;
  return data;
};

export const createContract = async (contractData, organizationId) => {
  if (!organizationId) {
    throw new Error("User is not associated with an organization.");
  }

  const { data, error } = await supabase
    .rpc('create_contract_direct', {
      p_name: contractData.name,
      p_organization_id: organizationId,
      p_description: contractData.description,
      p_folder_id: contractData.folder_id
    });
  
  if (error) {
    console.error('[legalService.createContract] RLS error:', error);
    throw error;
  }
  
  // RPCs can return a single object or an array with one object. Normalize it.
  const newContract = Array.isArray(data) ? data[0] : data;
  return newContract;
};

export const updateContract = async (id, updates) => {
  const { data, error } = await supabase
    .from('legal_contracts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteContract = async (id) => {
  const { data, error } = await supabase
    .rpc('delete_contract', { p_contract_id: id });
  
  if (error) {
    console.error("Error calling delete_contract RPC:", error);
    throw error;
  }

  if (data && data.status === 'error') {
    throw new Error(data.message);
  }
};

export const duplicateContract = async (contractId) => {
  const { data, error } = await supabase
    .rpc('duplicate_contract', { p_contract_id: contractId });

  if (error) throw error;
  return data;
};

// Contract folder operations
export const getContractFolders = async (organizationId) => {
  if (!organizationId) throw new Error("No organization selected.");
  const { data, error } = await supabase
    .from('legal_contract_folders')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name');
  if (error) throw error;
  return data;
};

export const createContractFolder = async (folderData, organizationId) => {
  if (!organizationId) {
    throw new Error("User is not associated with an organization.");
  }

  const { data, error } = await supabase
    .from('legal_contract_folders')
    .insert({ ...folderData, organization_id: organizationId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Compliance deadline operations
export const getComplianceDeadlines = async () => {
  const { data, error } = await supabase
    .rpc('get_organization_compliance_deadlines');
  
  if (error) throw error;
  return data;
};

export const createComplianceDeadline = async (deadlineData) => {
  const { data, error } = await supabase
    .from('legal_compliance_deadlines')
    .insert(deadlineData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateComplianceDeadline = async (id, updates) => {
  const { data, error } = await supabase
    .from('legal_compliance_deadlines')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteComplianceDeadline = async (id) => {
  const { error } = await supabase
    .from('legal_compliance_deadlines')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Insurance policy operations
export const getInsurancePolicies = async () => {
  const { data, error } = await supabase
    .rpc('get_organization_insurance_policies');
  
  if (error) throw error;
  return data;
};

export const createInsurancePolicy = async (policyData) => {
  const { data, error } = await supabase
    .from('legal_insurance_policies')
    .insert(policyData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateInsurancePolicy = async (id, updates) => {
  const { data, error } = await supabase
    .from('legal_insurance_policies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteInsurancePolicy = async (id) => {
  const { error } = await supabase
    .from('legal_insurance_policies')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// File upload operations
export const uploadContractPDF = async (file, contractId, organizationId) => {
  if (!organizationId) {
    console.error("uploadContractPDF: Missing organizationId");
    throw new Error("Cannot upload file: organization ID is missing.");
  }
  const fileName = `${organizationId}/contracts/${contractId}/${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('legal-documents')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('legal-documents')
    .getPublicUrl(fileName);
  
  // Update the contract with the PDF path
  await updateContract(contractId, { pdf_file_path: urlData.publicUrl });
  
  return urlData.publicUrl;
};

export const deleteContractFile = async (filePath) => {
  // filePath is the full public URL. We need to extract the object path for the remove function.
  // Example URL: https://<ref>.supabase.co/storage/v1/object/public/legal-documents/path/to/file.pdf
  // We need: path/to/file.pdf
  const path = new URL(filePath).pathname.split('/legal-documents/')[1];
  
  if (!path) {
    console.error("Could not determine file path from URL:", filePath);
    return; // Don't throw, just log the error and skip deletion
  }

  const { error } = await supabase.storage
    .from('legal-documents')
    .remove([path]);
  
  if (error) {
    console.error("Error deleting contract file:", error);
    // Don't re-throw, as we want to proceed with deleting the DB record even if file deletion fails
  }
};

export const uploadPolicyDocument = async (file, policyId) => {
  const fileName = `policies/${policyId}/${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('legal-documents')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('legal-documents')
    .getPublicUrl(fileName);
  
  // Update the policy with the document path
  await updateInsurancePolicy(policyId, { policy_document_path: urlData.publicUrl });
  
  return urlData.publicUrl;
};

// Utility functions
export const generateContractPDF = async (contractData, template) => {
  try {
    // Import jsPDF dynamically to avoid SSR issues
    const { default: jsPDF } = await import('jspdf');
    
    // Create a new PDF document
    const pdf = new jsPDF();
    
    // Set font and size
    pdf.setFont('helvetica');
    pdf.setFontSize(16);
    
    // Add title
    pdf.text(contractData.name, 20, 20);
    
    // Add template content with replaced placeholders
    let content = template.template_content || '';
    
    // Replace placeholders with actual data
    Object.entries(contractData.data || {}).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value || '');
    });
    
    // Add content to PDF
    pdf.setFontSize(12);
    const splitText = pdf.splitTextToSize(content, 170); // 170 is the width
    pdf.text(splitText, 20, 40);
    
    // Convert to blob
    const pdfBlob = pdf.output('blob');
    
    // Create a File object from the blob
    const fileName = `${contractData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
    
    return pdfFile;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const saveGeneratedPDF = async (pdfFile, contractId, organizationId) => {
  if (!organizationId) {
    throw new Error("Cannot save PDF: organization ID is missing.");
  }
  
  const fileName = `${organizationId}/contracts/${contractId}/${pdfFile.name}`;
  
  const { data, error } = await supabase.storage
    .from('legal-documents')
    .upload(fileName, pdfFile);
  
  if (error) throw error;
  
  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('legal-documents')
    .getPublicUrl(fileName);
  
  // Update the contract with the PDF path
  await updateContract(contractId, { pdf_file_path: urlData.publicUrl });
  
  return urlData.publicUrl;
};

export const debugRls = async (organizationId) => {
  if (!organizationId) {
    alert('DEBUG: No org ID passed to debugRls');
    return null;
  }
  const { data, error } = await supabase.rpc('debug_get_rls_context', {
    p_org_id: organizationId,
  });

  if (error) {
    alert(`DEBUG: Error calling debug function: ${error.message}`);
    return null;
  }

  return data[0];
}

// Company profile operations
export const getCompanyProfile = async (organizationId) => {
  if (!organizationId) return null;
  const { data, error } = await supabase
    .from('company_profile')
    .select('*')
    .eq('organization_id', organizationId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
  return data;
};

export const upsertCompanyProfile = async (profile) => {
  if (!profile.organization_id) throw new Error('organization_id is required');
  const { data, error } = await supabase
    .from('company_profile')
    .upsert(profile, { onConflict: ['organization_id'] })
    .select()
    .single();
  if (error) throw error;
  return data;
}; 