-- Check existing organizations
SELECT id, name, created_at FROM organizations ORDER BY created_at DESC LIMIT 10;

-- Check if the specific organization ID exists
SELECT id, name FROM organizations WHERE id = '2f70de0b-896c-4a56-a5ef-af06a3d82aec';

-- If the organization doesn't exist, you have two options:

-- Option 1: Create the missing organization (replace with actual org name)
-- INSERT INTO organizations (id, name, created_at, updated_at) 
-- VALUES ('2f70de0b-896c-4a56-a5ef-af06a3d82aec', 'Your Organization Name', NOW(), NOW());

-- Option 2: Use an existing organization ID for the cash flow categories
-- First, get a valid organization ID:
-- SELECT id FROM organizations LIMIT 1;

-- Then update the cash flow categories to use the valid organization ID:
-- UPDATE cash_flow_categories 
-- SET organization_id = (SELECT id FROM organizations LIMIT 1)
-- WHERE organization_id = '2f70de0b-896c-4a56-a5ef-af06a3d82aec';

-- Check current cash flow categories
SELECT * FROM cash_flow_categories; 