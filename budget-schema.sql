-- Budget and Forecast Database Schema for Layrbase
-- This schema supports budget vs forecast functionality with actuals tracking

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Budget Categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  description TEXT,
  color TEXT DEFAULT '#6B7280',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- Budget Line Items table
CREATE TABLE IF NOT EXISTS budget_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES budget_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('revenue', 'expense')),
  is_recurring BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, category_id, name)
);

-- Budget Data table (stores budget, forecast, and actuals values)
CREATE TABLE IF NOT EXISTS budget_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  line_item_id UUID REFERENCES budget_line_items(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  budget_amount DECIMAL(15,2) DEFAULT 0, -- Original budget amount
  forecast_amount DECIMAL(15,2) DEFAULT 0, -- Updated forecast amount
  actual_amount DECIMAL(15,2) DEFAULT 0, -- Actual performance
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, line_item_id, year, month)
);

-- Budget Versions table - tracks different versions of budgets and forecasts
CREATE TABLE IF NOT EXISTS budget_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    version_name TEXT NOT NULL,
    version_type TEXT NOT NULL CHECK (version_type IN ('budget', 'forecast')), -- 'budget' or 'forecast'
    is_locked BOOLEAN DEFAULT FALSE, -- Only budget versions should be locked, forecast should always be editable
    locked_at TIMESTAMP WITH TIME ZONE,
    locked_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, year, version_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_budget_categories_org_id ON budget_categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_type ON budget_categories(type);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_org_id ON budget_line_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_category_id ON budget_line_items(category_id);
CREATE INDEX IF NOT EXISTS idx_budget_line_items_type ON budget_line_items(type);
CREATE INDEX IF NOT EXISTS idx_budget_data_org_id ON budget_data(organization_id);
CREATE INDEX IF NOT EXISTS idx_budget_data_line_item_id ON budget_data(line_item_id);
CREATE INDEX IF NOT EXISTS idx_budget_data_year_month ON budget_data(year, month);
CREATE INDEX IF NOT EXISTS idx_budget_versions_org_id ON budget_versions(organization_id);
CREATE INDEX IF NOT EXISTS idx_budget_versions_year ON budget_versions(year);
CREATE INDEX IF NOT EXISTS idx_budget_versions_type ON budget_versions(version_type);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_budget_categories_updated_at ON budget_categories;
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_line_items_updated_at ON budget_line_items;
CREATE TRIGGER update_budget_line_items_updated_at BEFORE UPDATE ON budget_line_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_data_updated_at ON budget_data;
CREATE TRIGGER update_budget_data_updated_at BEFORE UPDATE ON budget_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_versions_updated_at ON budget_versions;
CREATE TRIGGER update_budget_versions_updated_at BEFORE UPDATE ON budget_versions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get budget summary with budget, forecast, and actuals
CREATE OR REPLACE FUNCTION get_budget_summary(
  p_organization_id UUID,
  p_year INTEGER,
  p_data_type TEXT DEFAULT 'budget' -- 'budget', 'forecast', 'actuals', or 'all'
)
RETURNS TABLE (
  line_item_id UUID,
  line_item_name TEXT,
  category_id UUID,
  category_name TEXT,
  type TEXT,
  budget_month_1 DECIMAL,
  budget_month_2 DECIMAL,
  budget_month_3 DECIMAL,
  budget_month_4 DECIMAL,
  budget_month_5 DECIMAL,
  budget_month_6 DECIMAL,
  budget_month_7 DECIMAL,
  budget_month_8 DECIMAL,
  budget_month_9 DECIMAL,
  budget_month_10 DECIMAL,
  budget_month_11 DECIMAL,
  budget_month_12 DECIMAL,
  budget_total DECIMAL,
  forecast_month_1 DECIMAL,
  forecast_month_2 DECIMAL,
  forecast_month_3 DECIMAL,
  forecast_month_4 DECIMAL,
  forecast_month_5 DECIMAL,
  forecast_month_6 DECIMAL,
  forecast_month_7 DECIMAL,
  forecast_month_8 DECIMAL,
  forecast_month_9 DECIMAL,
  forecast_month_10 DECIMAL,
  forecast_month_11 DECIMAL,
  forecast_month_12 DECIMAL,
  forecast_total DECIMAL,
  actual_month_1 DECIMAL,
  actual_month_2 DECIMAL,
  actual_month_3 DECIMAL,
  actual_month_4 DECIMAL,
  actual_month_5 DECIMAL,
  actual_month_6 DECIMAL,
  actual_month_7 DECIMAL,
  actual_month_8 DECIMAL,
  actual_month_9 DECIMAL,
  actual_month_10 DECIMAL,
  actual_month_11 DECIMAL,
  actual_month_12 DECIMAL,
  actual_total DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bli.id as line_item_id,
    bli.name as line_item_name,
    bc.id as category_id,
    bc.name as category_name,
    bc.type,
    COALESCE(MAX(CASE WHEN bd.month = 1 THEN bd.budget_amount END), 0) as budget_month_1,
    COALESCE(MAX(CASE WHEN bd.month = 2 THEN bd.budget_amount END), 0) as budget_month_2,
    COALESCE(MAX(CASE WHEN bd.month = 3 THEN bd.budget_amount END), 0) as budget_month_3,
    COALESCE(MAX(CASE WHEN bd.month = 4 THEN bd.budget_amount END), 0) as budget_month_4,
    COALESCE(MAX(CASE WHEN bd.month = 5 THEN bd.budget_amount END), 0) as budget_month_5,
    COALESCE(MAX(CASE WHEN bd.month = 6 THEN bd.budget_amount END), 0) as budget_month_6,
    COALESCE(MAX(CASE WHEN bd.month = 7 THEN bd.budget_amount END), 0) as budget_month_7,
    COALESCE(MAX(CASE WHEN bd.month = 8 THEN bd.budget_amount END), 0) as budget_month_8,
    COALESCE(MAX(CASE WHEN bd.month = 9 THEN bd.budget_amount END), 0) as budget_month_9,
    COALESCE(MAX(CASE WHEN bd.month = 10 THEN bd.budget_amount END), 0) as budget_month_10,
    COALESCE(MAX(CASE WHEN bd.month = 11 THEN bd.budget_amount END), 0) as budget_month_11,
    COALESCE(MAX(CASE WHEN bd.month = 12 THEN bd.budget_amount END), 0) as budget_month_12,
    COALESCE(SUM(bd.budget_amount), 0) as budget_total,
    COALESCE(MAX(CASE WHEN bd.month = 1 THEN bd.forecast_amount END), 0) as forecast_month_1,
    COALESCE(MAX(CASE WHEN bd.month = 2 THEN bd.forecast_amount END), 0) as forecast_month_2,
    COALESCE(MAX(CASE WHEN bd.month = 3 THEN bd.forecast_amount END), 0) as forecast_month_3,
    COALESCE(MAX(CASE WHEN bd.month = 4 THEN bd.forecast_amount END), 0) as forecast_month_4,
    COALESCE(MAX(CASE WHEN bd.month = 5 THEN bd.forecast_amount END), 0) as forecast_month_5,
    COALESCE(MAX(CASE WHEN bd.month = 6 THEN bd.forecast_amount END), 0) as forecast_month_6,
    COALESCE(MAX(CASE WHEN bd.month = 7 THEN bd.forecast_amount END), 0) as forecast_month_7,
    COALESCE(MAX(CASE WHEN bd.month = 8 THEN bd.forecast_amount END), 0) as forecast_month_8,
    COALESCE(MAX(CASE WHEN bd.month = 9 THEN bd.forecast_amount END), 0) as forecast_month_9,
    COALESCE(MAX(CASE WHEN bd.month = 10 THEN bd.forecast_amount END), 0) as forecast_month_10,
    COALESCE(MAX(CASE WHEN bd.month = 11 THEN bd.forecast_amount END), 0) as forecast_month_11,
    COALESCE(MAX(CASE WHEN bd.month = 12 THEN bd.forecast_amount END), 0) as forecast_month_12,
    COALESCE(SUM(bd.forecast_amount), 0) as forecast_total,
    COALESCE(MAX(CASE WHEN bd.month = 1 THEN bd.actual_amount END), 0) as actual_month_1,
    COALESCE(MAX(CASE WHEN bd.month = 2 THEN bd.actual_amount END), 0) as actual_month_2,
    COALESCE(MAX(CASE WHEN bd.month = 3 THEN bd.actual_amount END), 0) as actual_month_3,
    COALESCE(MAX(CASE WHEN bd.month = 4 THEN bd.actual_amount END), 0) as actual_month_4,
    COALESCE(MAX(CASE WHEN bd.month = 5 THEN bd.actual_amount END), 0) as actual_month_5,
    COALESCE(MAX(CASE WHEN bd.month = 6 THEN bd.actual_amount END), 0) as actual_month_6,
    COALESCE(MAX(CASE WHEN bd.month = 7 THEN bd.actual_amount END), 0) as actual_month_7,
    COALESCE(MAX(CASE WHEN bd.month = 8 THEN bd.actual_amount END), 0) as actual_month_8,
    COALESCE(MAX(CASE WHEN bd.month = 9 THEN bd.actual_amount END), 0) as actual_month_9,
    COALESCE(MAX(CASE WHEN bd.month = 10 THEN bd.actual_amount END), 0) as actual_month_10,
    COALESCE(MAX(CASE WHEN bd.month = 11 THEN bd.actual_amount END), 0) as actual_month_11,
    COALESCE(MAX(CASE WHEN bd.month = 12 THEN bd.actual_amount END), 0) as actual_month_12,
    COALESCE(SUM(bd.actual_amount), 0) as actual_total
  FROM budget_line_items bli
  JOIN budget_categories bc ON bli.category_id = bc.id
  LEFT JOIN budget_data bd ON bli.id = bd.line_item_id 
    AND bd.organization_id = p_organization_id 
    AND bd.year = p_year
  WHERE bli.organization_id = p_organization_id
    AND bli.is_active = TRUE
    AND bc.is_active = TRUE
  GROUP BY bli.id, bli.name, bc.id, bc.name, bc.type
  ORDER BY bc.type, bc.name, bli.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create forecast from budget
CREATE OR REPLACE FUNCTION create_forecast_from_budget(
  p_organization_id UUID,
  p_year INTEGER
)
RETURNS VOID AS $$
BEGIN
  -- Copy budget amounts to forecast amounts for all line items
  UPDATE budget_data 
  SET forecast_amount = budget_amount
  WHERE organization_id = p_organization_id 
    AND year = p_year;
  
  -- Create forecast version if it doesn't exist
  INSERT INTO budget_versions (organization_id, year, version_name, version_type, created_by)
  VALUES (p_organization_id, p_year, 'Forecast ' || p_year, 'forecast', auth.uid())
  ON CONFLICT (organization_id, year, version_type) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS)
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for budget_categories
DROP POLICY IF EXISTS "Users can manage budget categories for their own organizations" ON budget_categories;
CREATE POLICY "Users can manage budget categories for their own organizations" ON budget_categories
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS Policies for budget_line_items
DROP POLICY IF EXISTS "Users can manage budget line items for their own organizations" ON budget_line_items;
CREATE POLICY "Users can manage budget line items for their own organizations" ON budget_line_items
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS Policies for budget_data
DROP POLICY IF EXISTS "Users can manage budget data for their own organizations" ON budget_data;
CREATE POLICY "Users can manage budget data for their own organizations" ON budget_data
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS Policies for budget_versions
DROP POLICY IF EXISTS "Users can manage budget versions for their own organizations" ON budget_versions;
CREATE POLICY "Users can manage budget versions for their own organizations" ON budget_versions
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- Insert some default categories for new organizations
INSERT INTO budget_categories (organization_id, name, type, description, color) VALUES
  (gen_random_uuid(), 'Sales Revenue', 'revenue', 'Revenue from product/service sales', '#10B981'),
  (gen_random_uuid(), 'Subscription Revenue', 'revenue', 'Recurring subscription revenue', '#059669'),
  (gen_random_uuid(), 'Other Revenue', 'revenue', 'Other income sources', '#047857'),
  (gen_random_uuid(), 'Personnel Costs', 'expense', 'Salaries, benefits, and related costs', '#DC2626'),
  (gen_random_uuid(), 'Office & Admin', 'expense', 'Office rent, utilities, supplies', '#B91C1C'),
  (gen_random_uuid(), 'Marketing & Sales', 'expense', 'Marketing campaigns, sales activities', '#991B1B'),
  (gen_random_uuid(), 'Technology & IT', 'expense', 'Software, hardware, IT services', '#7F1D1D'),
  (gen_random_uuid(), 'Professional Services', 'expense', 'Legal, accounting, consulting', '#450A0A'),
  (gen_random_uuid(), 'Travel & Entertainment', 'expense', 'Business travel and entertainment', '#1F2937'),
  (gen_random_uuid(), 'Other Expenses', 'expense', 'Miscellaneous business expenses', '#374151')
ON CONFLICT DO NOTHING; 