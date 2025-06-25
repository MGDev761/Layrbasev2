-- Associate cap table data with organizations
-- Run this in your Supabase SQL editor

-- 1. Add organization_id column to all relevant tables
ALTER TABLE shareholders ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE share_classes ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE financing_rounds ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
ALTER TABLE preference_terms ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE;

-- 2. Update existing data to belong to the LightBox TV organization
-- Replace with your actual organization ID if it's different
UPDATE shareholders SET organization_id = '57c430fd-c3f3-4cfe-9e08-790a2826686f' WHERE organization_id IS NULL;
UPDATE share_classes SET organization_id = '57c430fd-c3f3-4cfe-9e08-790a2826686f' WHERE organization_id IS NULL;
UPDATE financing_rounds SET organization_id = '57c430fd-c3f3-4cfe-9e08-790a2826686f' WHERE organization_id IS NULL;
UPDATE transactions SET organization_id = '57c430fd-c3f3-4cfe-9e08-790a2826686f' WHERE organization_id IS NULL;
UPDATE preference_terms SET organization_id = '57c430fd-c3f3-4cfe-9e08-790a2826686f' WHERE organization_id IS NULL;

-- 3. Make the organization_id column mandatory
ALTER TABLE shareholders ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE share_classes ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE financing_rounds ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE transactions ALTER COLUMN organization_id SET NOT NULL;
ALTER TABLE preference_terms ALTER COLUMN organization_id SET NOT NULL;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shareholders_org_id ON shareholders(organization_id);
CREATE INDEX IF NOT EXISTS idx_share_classes_org_id ON share_classes(organization_id);
CREATE INDEX IF NOT EXISTS idx_financing_rounds_org_id ON financing_rounds(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_org_id ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_preference_terms_org_id ON preference_terms(organization_id);

-- 5. Update RLS policies to enforce data isolation
-- Drop old policies
DROP POLICY IF EXISTS "Allow all operations" ON shareholders;
DROP POLICY IF EXISTS "Allow all operations" ON share_classes;
DROP POLICY IF EXISTS "Allow all operations" ON financing_rounds;
DROP POLICY IF EXISTS "Allow all operations" ON transactions;
DROP POLICY IF EXISTS "Allow all operations" ON preference_terms;

-- Function to check if a user is a member of an organization
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_organizations
    WHERE user_organizations.organization_id = org_id
    AND user_organizations.user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Create new, secure policies for each table
-- Shareholders
DROP POLICY IF EXISTS "Users can manage shareholders for their own organizations" ON shareholders;
CREATE POLICY "Users can manage shareholders for their own organizations"
ON shareholders
FOR ALL
USING (is_org_member(organization_id))
WITH CHECK (is_org_member(organization_id));

-- Share Classes
DROP POLICY IF EXISTS "Users can manage share classes for their own organizations" ON share_classes;
CREATE POLICY "Users can manage share classes for their own organizations"
ON share_classes
FOR ALL
USING (is_org_member(organization_id))
WITH CHECK (is_org_member(organization_id));

-- Financing Rounds
DROP POLICY IF EXISTS "Users can manage financing rounds for their own organizations" ON financing_rounds;
CREATE POLICY "Users can manage financing rounds for their own organizations"
ON financing_rounds
FOR ALL
USING (is_org_member(organization_id))
WITH CHECK (is_org_member(organization_id));

-- Transactions
DROP POLICY IF EXISTS "Users can manage transactions for their own organizations" ON transactions;
CREATE POLICY "Users can manage transactions for their own organizations"
ON transactions
FOR ALL
USING (is_org_member(organization_id))
WITH CHECK (is_org_member(organization_id));

-- Preference Terms
DROP POLICY IF EXISTS "Users can manage preference terms for their own organizations" ON preference_terms;
CREATE POLICY "Users can manage preference terms for their own organizations"
ON preference_terms
FOR ALL
USING (is_org_member(organization_id))
WITH CHECK (is_org_member(organization_id));

-- Grant permissions (if needed, re-run)
GRANT EXECUTE ON FUNCTION is_org_member(UUID) TO authenticated;

-- TYPE for new participants in a financing round
CREATE TYPE participant_input AS (
    shareholder_id UUID,
    investment_amount DECIMAL
);

-- FUNCTION to create a financing round with an option pool increase and new participants
CREATE OR REPLACE FUNCTION create_financing_round_with_options(
    p_organization_id UUID,
    round_name TEXT,
    round_date DATE,
    pre_money_valuation DECIMAL,
    share_class_id UUID,
    option_pool_shares DECIMAL,
    participants_data participant_input[]
)
RETURNS UUID AS $$
DECLARE
    new_round_id UUID;
    option_pool_shareholder_id UUID;
    total_new_shares DECIMAL;
    post_money_shares DECIMAL;
    post_money_valuation DECIMAL;
    share_price DECIMAL;
    participant participant_input;
BEGIN
    -- 1. Calculate total new shares from investors
    SELECT COALESCE(SUM(p.investment_amount), 0) INTO total_new_shares
    FROM unnest(participants_data) AS p;

    -- 2. Calculate post-money valuation
    post_money_valuation := pre_money_valuation + total_new_shares;

    -- 3. Calculate total existing shares (pre-round)
    SELECT COALESCE(SUM(t.shares_issued), 0) INTO post_money_shares
    FROM transactions t
    WHERE t.organization_id = p_organization_id;

    -- 4. Calculate share price
    IF post_money_shares > 0 THEN
        share_price := pre_money_valuation / post_money_shares;
    ELSE
        -- Handle case for first round where there are no existing shares
        share_price := 1.0; -- Or some other default/logic
    END IF;

    -- Ensure share price is not zero to avoid division by zero errors
    IF share_price <= 0 THEN
        RAISE EXCEPTION 'Calculated share price is zero or negative. Cannot proceed.';
    END IF;

    -- 5. Create the new financing round
    INSERT INTO financing_rounds (organization_id, name, date, pre_money_valuation, investment_amount, share_class_id)
    VALUES (p_organization_id, round_name, round_date, pre_money_valuation, total_new_shares, share_class_id)
    RETURNING id INTO new_round_id;

    -- 6. Find or create the 'Option Pool' shareholder
    SELECT id INTO option_pool_shareholder_id FROM shareholders 
    WHERE name = 'Option Pool' AND organization_id = p_organization_id;

    IF option_pool_shareholder_id IS NULL THEN
        INSERT INTO shareholders (organization_id, name, role, is_option_pool)
        VALUES (p_organization_id, 'Option Pool', 'Employee', TRUE)
        RETURNING id INTO option_pool_shareholder_id;
    END IF;

    -- 7. Add the new option pool shares as a transaction
    IF option_pool_shares > 0 THEN
        INSERT INTO transactions (organization_id, round_id, shareholder_id, shares_issued, share_price, investment_amount)
        VALUES (p_organization_id, new_round_id, option_pool_shareholder_id, option_pool_shares, 0, 0);
    END IF;

    -- 8. Add transactions for each new participant
    FOREACH participant IN ARRAY participants_data
    LOOP
        INSERT INTO transactions (organization_id, round_id, shareholder_id, shares_issued, investment_amount, share_price)
        VALUES (
            p_organization_id,
            new_round_id,
            participant.shareholder_id,
            participant.investment_amount / share_price,
            participant.investment_amount,
            share_price
        );
    END LOOP;

    RETURN new_round_id;
END;
$$ LANGUAGE plpgsql; 