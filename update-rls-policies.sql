-- Update RLS policies for organization creation
-- Run this in your Supabase SQL editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Admins can update organizations they belong to" ON organizations;
DROP POLICY IF EXISTS "Owners can delete organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their own organization memberships" ON user_organizations;
DROP POLICY IF EXISTS "Admins can manage organization members" ON user_organizations;

-- Recreate policies with proper permissions
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_organizations 
      WHERE user_organizations.organization_id = organizations.id 
      AND user_organizations.user_id = auth.uid()
      AND user_organizations.is_active = true
    )
  );

CREATE POLICY "Authenticated users can create organizations" ON organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update organizations they belong to" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_organizations 
      WHERE user_organizations.organization_id = organizations.id 
      AND user_organizations.user_id = auth.uid()
      AND user_organizations.role IN ('owner', 'admin')
      AND user_organizations.is_active = true
    )
  );

CREATE POLICY "Owners can delete organizations" ON organizations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_organizations 
      WHERE user_organizations.organization_id = organizations.id 
      AND user_organizations.user_id = auth.uid()
      AND user_organizations.role = 'owner'
      AND user_organizations.is_active = true
    )
  );

-- User organizations policies
CREATE POLICY "Users can view their own organization memberships" ON user_organizations
  FOR SELECT USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_organizations uo2
      WHERE uo2.organization_id = user_organizations.organization_id
      AND uo2.user_id = auth.uid()
      AND uo2.is_active = true
    )
  );

CREATE POLICY "Users can insert themselves into organizations" ON user_organizations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage organization members" ON user_organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_organizations uo2
      WHERE uo2.organization_id = user_organizations.organization_id
      AND uo2.user_id = auth.uid()
      AND uo2.role IN ('owner', 'admin')
      AND uo2.is_active = true
    )
  ); 