-- Legal Section Database Schema
-- This schema handles templates, contracts, compliance deadlines, and risk insurance

-- Templates table (available to all organizations)
CREATE TABLE IF NOT EXISTS legal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    template_content TEXT NOT NULL,
    fields JSONB, -- Store the form fields configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contract folders for organization
CREATE TABLE IF NOT EXISTS legal_contract_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table (organization-specific)
CREATE TABLE IF NOT EXISTS legal_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES legal_contract_folders(id) ON DELETE SET NULL,
    template_id UUID REFERENCES legal_templates(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contract_data JSONB, -- Store the customized form data
    pdf_file_path VARCHAR(500), -- Path to the generated PDF file
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, expired, archived
    effective_date DATE,
    expiry_date DATE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance deadlines table (organization-specific)
CREATE TABLE IF NOT EXISTS legal_compliance_deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    category VARCHAR(100), -- annual_filing, tax_return, etc.
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, overdue
    reminder_days INTEGER DEFAULT 30, -- Days before due date to send reminder
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk insurance policies table (organization-specific)
CREATE TABLE IF NOT EXISTS legal_insurance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100),
    coverage_amount DECIMAL(15,2),
    premium_amount DECIMAL(10,2),
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    policy_document_path VARCHAR(500), -- Path to the policy PDF
    status VARCHAR(50) DEFAULT 'active', -- active, expired, cancelled
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_legal_contracts_org_id ON legal_contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_folder_id ON legal_contracts(folder_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_template_id ON legal_contracts(template_id);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_status ON legal_contracts(status);
CREATE INDEX IF NOT EXISTS idx_legal_contracts_effective_date ON legal_contracts(effective_date);

CREATE INDEX IF NOT EXISTS idx_legal_compliance_deadlines_org_id ON legal_compliance_deadlines(organization_id);
CREATE INDEX IF NOT EXISTS idx_legal_compliance_deadlines_due_date ON legal_compliance_deadlines(due_date);
CREATE INDEX IF NOT EXISTS idx_legal_compliance_deadlines_status ON legal_compliance_deadlines(status);

CREATE INDEX IF NOT EXISTS idx_legal_insurance_policies_org_id ON legal_insurance_policies(organization_id);
CREATE INDEX IF NOT EXISTS idx_legal_insurance_policies_expiry_date ON legal_insurance_policies(expiry_date);
CREATE INDEX IF NOT EXISTS idx_legal_insurance_policies_status ON legal_insurance_policies(status);

CREATE INDEX IF NOT EXISTS idx_legal_contract_folders_org_id ON legal_contract_folders(organization_id);

-- Insert sample templates
INSERT INTO legal_templates (name, category, description, template_content, fields) VALUES
    ('Founder Vesting Agreement', 'Foundation', 'Standard founder vesting agreement with cliff and vesting schedule', 
     'This Founder Vesting Agreement (the "Agreement") is made between [COMPANY_NAME] and [FOUNDER_NAME]...',
     '[
       {"key": "companyName", "label": "Company Name", "type": "text", "placeholder": "Enter company name"},
       {"key": "founderName", "label": "Founder Name", "type": "text", "placeholder": "Enter founder name"},
       {"key": "vestingStartDate", "label": "Vesting Start Date", "type": "date"},
       {"key": "totalShares", "label": "Total Shares", "type": "number", "placeholder": "Enter total shares"},
       {"key": "cliffPeriod", "label": "Cliff Period (months)", "type": "number", "placeholder": "12"},
       {"key": "vestingSchedule", "label": "Vesting Schedule", "type": "textarea", "placeholder": "Describe vesting schedule..."}
     ]'::jsonb),
    
    ('Employee Offer Letter', 'HR', 'Standard employment offer letter for new hires', 
     'Dear [CANDIDATE_NAME],\n\n[COMPANY_NAME] is pleased to offer you the position of [POSITION_TITLE]...',
     '[
       {"key": "candidateName", "label": "Candidate Name", "type": "text"},
       {"key": "positionTitle", "label": "Position Title", "type": "text"},
       {"key": "startDate", "label": "Start Date", "type": "date"},
       {"key": "salary", "label": "Salary", "type": "number"},
       {"key": "reportingManager", "label": "Reporting Manager", "type": "text"}
     ]'::jsonb),
     
    ('Non-Disclosure Agreement (NDA)', 'General', 'Mutual non-disclosure agreement for confidential discussions', 
     'This Mutual Non-Disclosure Agreement (the "Agreement") is entered into between [PARTY_A_NAME] and [PARTY_B_NAME]...',
     '[
       {"key": "partyAName", "label": "Party A Name", "type": "text"},
       {"key": "partyBName", "label": "Party B Name", "type": "text"},
       {"key": "effectiveDate", "label": "Effective Date", "type": "date"}
     ]'::jsonb);

-- Enable RLS for all legal tables
ALTER TABLE legal_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Templates are viewable by all authenticated users" ON legal_templates;
CREATE POLICY "Templates are viewable by all authenticated users" ON legal_templates
    FOR SELECT USING (auth.role() = 'authenticated');

-- Contract folders are organization-specific
ALTER TABLE legal_contract_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view contract folders in their organization" ON legal_contract_folders;
CREATE POLICY "Users can view contract folders in their organization" ON legal_contract_folders
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contract_folders.organization_id
    ));

DROP POLICY IF EXISTS "Users can insert contract folders in their organization" ON legal_contract_folders;
CREATE POLICY "Users can insert contract folders in their organization" ON legal_contract_folders
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contract_folders.organization_id
    ));

DROP POLICY IF EXISTS "Users can update contract folders in their organization" ON legal_contract_folders;
CREATE POLICY "Users can update contract folders in their organization" ON legal_contract_folders
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contract_folders.organization_id
    ));

DROP POLICY IF EXISTS "Users can delete contract folders in their organization" ON legal_contract_folders;
CREATE POLICY "Users can delete contract folders in their organization" ON legal_contract_folders
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contract_folders.organization_id
    ));

-- Contracts are organization-specific
ALTER TABLE legal_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view contracts in their organization" ON legal_contracts;
CREATE POLICY "Users can view contracts in their organization" ON legal_contracts
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contracts.organization_id
    ));

DROP POLICY IF EXISTS "Users can insert contracts in their organization" ON legal_contracts;
CREATE POLICY "Users can insert contracts in their organization" ON legal_contracts
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contracts.organization_id
    ));

DROP POLICY IF EXISTS "Users can update contracts in their organization" ON legal_contracts;
CREATE POLICY "Users can update contracts in their organization" ON legal_contracts
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contracts.organization_id
    ));

DROP POLICY IF EXISTS "Users can delete contracts in their organization" ON legal_contracts;
CREATE POLICY "Users can delete contracts in their organization" ON legal_contracts
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_contracts.organization_id
    ));

-- Compliance deadlines are organization-specific
ALTER TABLE legal_compliance_deadlines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view compliance deadlines in their organization" ON legal_compliance_deadlines;
CREATE POLICY "Users can view compliance deadlines in their organization" ON legal_compliance_deadlines
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_compliance_deadlines.organization_id
    ));

DROP POLICY IF EXISTS "Users can insert compliance deadlines in their organization" ON legal_compliance_deadlines;
CREATE POLICY "Users can insert compliance deadlines in their organization" ON legal_compliance_deadlines
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_compliance_deadlines.organization_id
    ));

DROP POLICY IF EXISTS "Users can update compliance deadlines in their organization" ON legal_compliance_deadlines;
CREATE POLICY "Users can update compliance deadlines in their organization" ON legal_compliance_deadlines
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_compliance_deadlines.organization_id
    ));

DROP POLICY IF EXISTS "Users can delete compliance deadlines in their organization" ON legal_compliance_deadlines;
CREATE POLICY "Users can delete compliance deadlines in their organization" ON legal_compliance_deadlines
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_compliance_deadlines.organization_id
    ));

-- Insurance policies are organization-specific
ALTER TABLE legal_insurance_policies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view insurance policies in their organization" ON legal_insurance_policies;
CREATE POLICY "Users can view insurance policies in their organization" ON legal_insurance_policies
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_insurance_policies.organization_id
    ));

DROP POLICY IF EXISTS "Users can insert insurance policies in their organization" ON legal_insurance_policies;
CREATE POLICY "Users can insert insurance policies in their organization" ON legal_insurance_policies
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_insurance_policies.organization_id
    ));

DROP POLICY IF EXISTS "Users can update insurance policies in their organization" ON legal_insurance_policies;
CREATE POLICY "Users can update insurance policies in their organization" ON legal_insurance_policies
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_insurance_policies.organization_id
    ));

DROP POLICY IF EXISTS "Users can delete insurance policies in their organization" ON legal_insurance_policies;
CREATE POLICY "Users can delete insurance policies in their organization" ON legal_insurance_policies
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM user_organizations uo
        WHERE uo.user_id = auth.uid() AND uo.organization_id = legal_insurance_policies.organization_id
    ));

-- Functions for legal operations

-- Function to create a contract from a template
DROP FUNCTION IF EXISTS public.create_contract_from_template(UUID, character varying, jsonb, uuid, text, uuid, date, date);
CREATE OR REPLACE FUNCTION create_contract_from_template(
    p_template_id UUID,
    p_name VARCHAR(255),
    p_contract_data JSONB,
    p_organization_id UUID,
    p_description TEXT DEFAULT NULL,
    p_folder_id UUID DEFAULT NULL,
    p_effective_date DATE DEFAULT NULL,
    p_expiry_date DATE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_contract_id UUID;
BEGIN
    -- Insert the new contract
    INSERT INTO legal_contracts (
        organization_id,
        template_id,
        folder_id,
        name,
        description,
        contract_data,
        effective_date,
        expiry_date,
        created_by
    ) VALUES (
        p_organization_id,
        p_template_id,
        p_folder_id,
        p_name,
        p_description,
        p_contract_data,
        p_effective_date,
        p_expiry_date,
        auth.uid()
    ) RETURNING id INTO v_contract_id;
    
    RETURN v_contract_id;
END;
$$;

-- Function to get contracts with folder information
DROP FUNCTION IF EXISTS public.get_organization_contracts();
CREATE OR REPLACE FUNCTION get_organization_contracts()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    folder_name VARCHAR(255),
    template_name VARCHAR(255),
    status VARCHAR(50),
    effective_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.description,
        f.name as folder_name,
        t.name as template_name,
        c.status,
        c.effective_date,
        c.expiry_date,
        c.created_at
    FROM legal_contracts c
    LEFT JOIN legal_contract_folders f ON c.folder_id = f.id
    LEFT JOIN legal_templates t ON c.template_id = t.id
    WHERE c.organization_id = (auth.jwt() ->> 'organization_id')::UUID
    ORDER BY c.created_at DESC;
END;
$$;

-- Function to get compliance deadlines with overdue status
DROP FUNCTION IF EXISTS public.get_organization_compliance_deadlines();
CREATE OR REPLACE FUNCTION get_organization_compliance_deadlines()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    due_date DATE,
    category VARCHAR(100),
    status VARCHAR(50),
    days_until_due INTEGER,
    is_overdue BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cd.id,
        cd.name,
        cd.description,
        cd.due_date,
        cd.category,
        cd.status,
        (cd.due_date - a.current_date)::INTEGER as days_until_due,
        (cd.due_date < a.current_date AND cd.status != 'completed') as is_overdue
    FROM legal_compliance_deadlines cd,
         (SELECT NOW()::DATE as current_date) a
    WHERE cd.organization_id = (auth.jwt() ->> 'organization_id')::UUID
    ORDER BY cd.due_date;
END;
$$;

-- Function to get insurance policies
DROP FUNCTION IF EXISTS public.get_organization_insurance_policies();
CREATE OR REPLACE FUNCTION get_organization_insurance_policies()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    provider VARCHAR(255),
    policy_number VARCHAR(100),
    coverage_amount DECIMAL(15,2),
    premium_amount DECIMAL(10,2),
    effective_date DATE,
    expiry_date DATE,
    status VARCHAR(50),
    days_until_expiry INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ip.id,
        ip.name,
        ip.provider,
        ip.policy_number,
        ip.coverage_amount,
        ip.premium_amount,
        ip.effective_date,
        ip.expiry_date,
        ip.status,
        (ip.expiry_date - NOW()::DATE)::INTEGER as days_until_expiry
    FROM legal_insurance_policies ip
    WHERE ip.organization_id = (auth.jwt() ->> 'organization_id')::UUID
    ORDER BY ip.expiry_date;
END;
$$;

-- Function to create a contract directly
DROP FUNCTION IF EXISTS public.create_contract_direct(text, uuid, text, uuid);
CREATE OR REPLACE FUNCTION public.create_contract_direct(
    p_name VARCHAR(255),
    p_organization_id UUID,
    p_description TEXT DEFAULT NULL,
    p_folder_id UUID DEFAULT NULL
)
RETURNS legal_contracts -- returns the whole row
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_new_contract legal_contracts;
BEGIN
    -- Insert the new contract
    INSERT INTO legal_contracts (
        organization_id,
        folder_id,
        name,
        description,
        status,
        created_by
    ) VALUES (
        p_organization_id,
        p_folder_id,
        p_name,
        p_description,
        'active', -- Uploaded contracts are active by default
        auth.uid()
    ) RETURNING * INTO v_new_contract;
    
    RETURN v_new_contract;
END;
$$;

-- Function for debugging RLS issues
DROP FUNCTION IF EXISTS public.debug_get_rls_context(uuid);
CREATE OR REPLACE FUNCTION public.debug_get_rls_context(p_org_id uuid)
RETURNS TABLE(current_user_id uuid, is_member boolean, org_id_checked uuid)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        auth.uid() as current_user_id,
        EXISTS (
            SELECT 1
            FROM public.user_organizations uo
            WHERE uo.organization_id = p_org_id
              AND uo.user_id = auth.uid()
        ) as is_member,
        p_org_id as org_id_checked;
END;
$$;

-- Policies for storage bucket: legal-documents
CREATE POLICY "Allow authenticated users to view files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'legal-documents' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow org members to upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'legal-documents' AND
  auth.role() = 'authenticated' AND
  is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
);

CREATE POLICY "Allow org members to update their files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'legal-documents' AND
  auth.role() = 'authenticated' AND
  is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
);

CREATE POLICY "Allow org members to delete their files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'legal-documents' AND
  auth.role() = 'authenticated' AND
  is_org_member((storage.foldername(name))[1]::uuid, auth.uid())
);
