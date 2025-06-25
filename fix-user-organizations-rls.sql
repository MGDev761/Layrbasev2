-- Fix RLS policy for user_organizations to allow members to view all members in their organization
DROP POLICY IF EXISTS "Users can view their own organization memberships" ON user_organizations;

CREATE POLICY "Users can view their own organization memberships" ON user_organizations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_organizations uo2
    WHERE uo2.organization_id = user_organizations.organization_id
    AND uo2.user_id = auth.uid()
    AND uo2.is_active = true
  )
);

-- Also ensure admins can manage members
DROP POLICY IF EXISTS "Admins can manage organization members" ON user_organizations;

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