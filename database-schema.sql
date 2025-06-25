-- Cap Table Database Schema for Layrbase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shareholders table
CREATE TABLE IF NOT EXISTS shareholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Founder', 'Investor', 'Advisor', 'Employee')),
  email TEXT,
  is_option_pool BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Share classes table  
CREATE TABLE IF NOT EXISTS share_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financing rounds table
CREATE TABLE IF NOT EXISTS financing_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  pre_money_valuation DECIMAL NOT NULL,
  investment_amount DECIMAL NOT NULL,
  share_class_id UUID REFERENCES share_classes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table (the core cap table data)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES financing_rounds(id) ON DELETE CASCADE,
  shareholder_id UUID REFERENCES shareholders(id) ON DELETE CASCADE,
  shares_issued DECIMAL NOT NULL,
  investment_amount DECIMAL DEFAULT 0,
  share_price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preference terms table
CREATE TABLE IF NOT EXISTS preference_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_class_id UUID REFERENCES share_classes(id) ON DELETE CASCADE,
  multiplier DECIMAL NOT NULL DEFAULT 0,
  is_participating BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_round_id ON transactions(round_id);
CREATE INDEX IF NOT EXISTS idx_transactions_shareholder_id ON transactions(shareholder_id);
CREATE INDEX IF NOT EXISTS idx_financing_rounds_date ON financing_rounds(date);
CREATE INDEX IF NOT EXISTS idx_preference_terms_share_class_id ON preference_terms(share_class_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check for organization manager role to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_org_manager(org_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_organizations
    WHERE user_organizations.organization_id = org_id
      AND user_organizations.user_id = auth.uid()
      AND (user_organizations.role = 'owner' OR user_organizations.role = 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check for organization membership to simplify RLS policies
CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid, user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_organizations
    WHERE user_organizations.organization_id = org_id
      AND user_organizations.user_id = user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_shareholders_updated_at ON shareholders;
CREATE TRIGGER update_shareholders_updated_at BEFORE UPDATE ON shareholders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_share_classes_updated_at ON share_classes;
CREATE TRIGGER update_share_classes_updated_at BEFORE UPDATE ON share_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_financing_rounds_updated_at ON financing_rounds;
CREATE TRIGGER update_financing_rounds_updated_at BEFORE UPDATE ON financing_rounds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_preference_terms_updated_at ON preference_terms;
CREATE TRIGGER update_preference_terms_updated_at BEFORE UPDATE ON preference_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add organization_id to all relevant tables
ALTER TABLE shareholders ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE share_classes ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE financing_rounds ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
ALTER TABLE preference_terms ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- Create indexes for organization_id
CREATE INDEX IF NOT EXISTS idx_shareholders_organization_id ON shareholders(organization_id);
CREATE INDEX IF NOT EXISTS idx_share_classes_organization_id ON share_classes(organization_id);
CREATE INDEX IF NOT EXISTS idx_financing_rounds_organization_id ON financing_rounds(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_preference_terms_organization_id ON preference_terms(organization_id);

-- Enable Row Level Security (RLS) for future multi-tenant support
ALTER TABLE shareholders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage shareholders for their own organizations" ON shareholders;
CREATE POLICY "Users can manage shareholders for their own organizations" ON shareholders
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS for financing_rounds
ALTER TABLE financing_rounds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage financing rounds for their own organizations" ON financing_rounds;
CREATE POLICY "Users can manage financing rounds for their own organizations" ON financing_rounds
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS for share_classes
ALTER TABLE share_classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage share classes for their own organizations" ON share_classes;
CREATE POLICY "Users can manage share classes for their own organizations" ON share_classes
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage transactions for their own organizations" ON transactions;
CREATE POLICY "Users can manage transactions for their own organizations" ON transactions
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS for preference_terms
ALTER TABLE preference_terms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage preference terms for their own organizations" ON preference_terms;
CREATE POLICY "Users can manage preference terms for their own organizations" ON preference_terms
  FOR ALL USING (public.is_org_member(organization_id, auth.uid()))
  WITH CHECK (public.is_org_member(organization_id, auth.uid()));

-- RLS for user_organizations
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own organization memberships" ON user_organizations;
CREATE POLICY "Users can view their own organization memberships" ON user_organizations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert memberships for themselves" ON user_organizations;
CREATE POLICY "Users can only insert memberships for themselves" ON user_organizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Org owners can manage memberships in their org" ON user_organizations;
CREATE POLICY "Org owners can manage memberships in their org" ON user_organizations
  FOR ALL USING (public.is_org_manager(organization_id));

-- RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS for organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view organizations they are a member of" ON organizations;
CREATE POLICY "Users can view organizations they are a member of" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organizations.id
    )
  );

DROP POLICY IF EXISTS "Users can update organizations they are an owner of" ON organizations;
CREATE POLICY "Users can update organizations they are an owner of" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organizations.id
        AND uo.role = 'owner'
    )
  );

DROP FUNCTION IF EXISTS public.create_organization_with_owner(text, text, text, text, text); 