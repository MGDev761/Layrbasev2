-- Marketing Events Calendar
CREATE TABLE marketing_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('blog', 'press_release', 'ad_campaign', 'newsletter')),
    event_date DATE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Brand Assets
CREATE TABLE brand_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('logo', 'icon', 'document', 'image')),
    file_path TEXT,
    file_size BIGINT,
    file_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- Brand Information
CREATE TABLE brand_information (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
    tagline TEXT,
    brand_blurb TEXT,
    color_palette JSONB DEFAULT '[]'::jsonb,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Collateral
CREATE TABLE sales_collateral (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    collateral_type TEXT NOT NULL CHECK (collateral_type IN ('sales_deck', 'one_pager', 'case_study', 'pricing', 'comparison', 'calculator')),
    file_path TEXT,
    file_size BIGINT,
    file_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE marketing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_collateral ENABLE ROW LEVEL SECURITY;

-- Marketing Events RLS
CREATE POLICY "Users can view marketing events for their organizations" ON marketing_events
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can insert marketing events for their organizations" ON marketing_events
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update marketing events for their organizations" ON marketing_events
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can delete marketing events for their organizations" ON marketing_events
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Brand Assets RLS
CREATE POLICY "Users can view brand assets for their organizations" ON brand_assets
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can insert brand assets for their organizations" ON brand_assets
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update brand assets for their organizations" ON brand_assets
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can delete brand assets for their organizations" ON brand_assets
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Brand Information RLS
CREATE POLICY "Users can view brand information for their organizations" ON brand_information
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can insert brand information for their organizations" ON brand_information
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update brand information for their organizations" ON brand_information
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Sales Collateral RLS
CREATE POLICY "Users can view sales collateral for their organizations" ON sales_collateral
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can insert sales collateral for their organizations" ON sales_collateral
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can update sales collateral for their organizations" ON sales_collateral
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Users can delete sales collateral for their organizations" ON sales_collateral
    FOR DELETE USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- Indexes for better performance
CREATE INDEX idx_marketing_events_org_date ON marketing_events(organization_id, event_date);
CREATE INDEX idx_brand_assets_org_type ON brand_assets(organization_id, asset_type);
CREATE INDEX idx_sales_collateral_org_type ON sales_collateral(organization_id, collateral_type); 