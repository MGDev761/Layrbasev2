-- Add linkedin_profile field to company_profile table
ALTER TABLE company_profile 
ADD COLUMN linkedin_profile VARCHAR(255);

-- Add comment for documentation
COMMENT ON COLUMN company_profile.linkedin_profile IS 'LinkedIn profile URL for the company'; 