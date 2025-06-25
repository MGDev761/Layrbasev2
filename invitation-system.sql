-- Invitation system for Layrbase
-- Run this in your Supabase SQL editor

-- Create organization_invitations table
CREATE TABLE IF NOT EXISTS organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_organization_invitations_org_id ON organization_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_invitations_email ON organization_invitations(email);
CREATE INDEX IF NOT EXISTS idx_organization_invitations_token ON organization_invitations(token);

-- Enable RLS
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view invitations for their organizations" ON organization_invitations;
DROP POLICY IF EXISTS "Admins can create invitations for their organizations" ON organization_invitations;
DROP POLICY IF EXISTS "Admins can delete invitations for their organizations" ON organization_invitations;
DROP POLICY IF EXISTS "Users can view invitations sent to their email" ON organization_invitations;

-- Create RLS policies
CREATE POLICY "Admins can view invitations for their organizations" ON organization_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_organizations 
      WHERE user_organizations.organization_id = organization_invitations.organization_id 
      AND user_organizations.user_id = auth.uid()
      AND user_organizations.role IN ('owner', 'admin')
      AND user_organizations.is_active = true
    )
  );

CREATE POLICY "Admins can create invitations for their organizations" ON organization_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_organizations 
      WHERE user_organizations.organization_id = organization_invitations.organization_id 
      AND user_organizations.user_id = auth.uid()
      AND user_organizations.role IN ('owner', 'admin')
      AND user_organizations.is_active = true
    )
  );

CREATE POLICY "Admins can delete invitations for their organizations" ON organization_invitations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_organizations 
      WHERE user_organizations.organization_id = organization_invitations.organization_id 
      AND user_organizations.user_id = auth.uid()
      AND user_organizations.role IN ('owner', 'admin')
      AND user_organizations.is_active = true
    )
  );

CREATE POLICY "Users can view invitations sent to their email" ON organization_invitations
  FOR SELECT USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Create function to invite user to organization
CREATE OR REPLACE FUNCTION invite_user_to_organization(
  p_organization_id UUID,
  p_email TEXT,
  p_role user_role DEFAULT 'member'
)
RETURNS JSON AS $$
DECLARE
  v_invitation_id UUID;
  v_token TEXT;
  v_organization_name TEXT;
  v_inviter_name TEXT;
  v_inviter_email TEXT;
BEGIN
  -- Check if user has permission to invite
  IF NOT EXISTS (
    SELECT 1 FROM user_organizations 
    WHERE organization_id = p_organization_id 
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to invite users to this organization';
  END IF;

  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM user_organizations uo
    JOIN auth.users u ON uo.user_id = u.id
    WHERE uo.organization_id = p_organization_id 
    AND u.email = p_email
    AND uo.is_active = true
  ) THEN
    RAISE EXCEPTION 'User is already a member of this organization';
  END IF;

  -- Check if there's already a pending invitation
  IF EXISTS (
    SELECT 1 FROM organization_invitations 
    WHERE organization_id = p_organization_id 
    AND email = p_email 
    AND accepted_at IS NULL 
    AND expires_at > NOW()
  ) THEN
    RAISE EXCEPTION 'An invitation has already been sent to this email';
  END IF;

  -- Get organization and inviter details
  SELECT name INTO v_organization_name FROM organizations WHERE id = p_organization_id;
  SELECT 
    COALESCE(up.first_name || ' ' || up.last_name, u.email) INTO v_inviter_name
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE u.id = auth.uid();
  
  SELECT email INTO v_inviter_email FROM auth.users WHERE id = auth.uid();

  -- Create invitation
  INSERT INTO organization_invitations (
    organization_id, 
    email, 
    role, 
    invited_by,
    token
  ) VALUES (
    p_organization_id, 
    p_email, 
    p_role, 
    auth.uid(),
    encode(gen_random_bytes(32), 'hex')
  ) RETURNING id, token INTO v_invitation_id, v_token;

  RETURN json_build_object(
    'success', true,
    'invitation_id', v_invitation_id,
    'token', v_token,
    'organization_name', v_organization_name,
    'inviter_name', v_inviter_name,
    'inviter_email', v_inviter_email,
    'message', 'Invitation created successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to accept invitation
CREATE OR REPLACE FUNCTION accept_organization_invitation(p_token TEXT)
RETURNS JSON AS $$
DECLARE
  v_invitation organization_invitations%ROWTYPE;
  v_user_id UUID;
BEGIN
  -- Get invitation
  SELECT * INTO v_invitation 
  FROM organization_invitations 
  WHERE token = p_token 
  AND accepted_at IS NULL 
  AND expires_at > NOW();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation token';
  END IF;

  -- Get current user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to accept invitation';
  END IF;

  -- Check if user email matches invitation email
  IF (SELECT email FROM auth.users WHERE id = v_user_id) != v_invitation.email THEN
    RAISE EXCEPTION 'Invitation email does not match current user email';
  END IF;

  -- Check if user is already a member
  IF EXISTS (
    SELECT 1 FROM user_organizations 
    WHERE organization_id = v_invitation.organization_id 
    AND user_id = v_user_id
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'User is already a member of this organization';
  END IF;

  -- Add user to organization
  INSERT INTO user_organizations (user_id, organization_id, role)
  VALUES (v_user_id, v_invitation.organization_id, v_invitation.role);

  -- Mark invitation as accepted
  UPDATE organization_invitations 
  SET accepted_at = NOW() 
  WHERE id = v_invitation.id;

  RETURN json_build_object(
    'success', true,
    'organization_id', v_invitation.organization_id,
    'role', v_invitation.role,
    'message', 'Successfully joined organization'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get invitation details
CREATE OR REPLACE FUNCTION get_invitation_details(p_token TEXT)
RETURNS TABLE (
  invitation_id UUID,
  organization_id UUID,
  organization_name TEXT,
  email TEXT,
  role user_role,
  invited_by_name TEXT,
  invited_by_email TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_valid BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oi.id,
    oi.organization_id,
    o.name,
    oi.email,
    oi.role,
    COALESCE(up.first_name || ' ' || up.last_name, u.email) as invited_by_name,
    u.email as invited_by_email,
    oi.expires_at,
    (oi.accepted_at IS NULL AND oi.expires_at > NOW()) as is_valid
  FROM organization_invitations oi
  JOIN organizations o ON oi.organization_id = o.id
  JOIN auth.users u ON oi.invited_by = u.id
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE oi.token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON organization_invitations TO authenticated, anon;
GRANT EXECUTE ON FUNCTION invite_user_to_organization(UUID, TEXT, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_organization_invitation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_invitation_details(TEXT) TO authenticated, anon; 