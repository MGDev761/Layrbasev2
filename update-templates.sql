-- Update existing templates with better content
UPDATE legal_templates 
SET template_content = 'EMPLOYMENT OFFER LETTER

Dear [CANDIDATE_NAME],

[COMPANY_NAME] is pleased to offer you the position of [POSITION_TITLE] with our company. We are excited about the prospect of you joining our team and contributing to our continued success.

POSITION DETAILS:
• Position: [POSITION_TITLE]
• Department: [DEPARTMENT]
• Reporting to: [REPORTING_MANAGER]
• Start Date: [START_DATE]
• Location: [WORK_LOCATION]

COMPENSATION AND BENEFITS:
• Annual Salary: £[SALARY]
• Benefits: Health insurance, pension scheme, 25 days annual leave
• Probation Period: 3 months

WORK SCHEDULE:
• Full-time position (40 hours per week)
• Standard business hours: Monday to Friday, 9:00 AM to 5:30 PM
• Flexible working arrangements available after probation period

RESPONSIBILITIES:
Your key responsibilities will include:
• [RESPONSIBILITY_1]
• [RESPONSIBILITY_2]
• [RESPONSIBILITY_3]
• [RESPONSIBILITY_4]

This offer is contingent upon:
• Successful completion of background checks
• Verification of your right to work in the UK
• Execution of our standard employment agreement

Please confirm your acceptance of this offer by signing and returning this letter by [ACCEPTANCE_DEADLINE].

We look forward to welcoming you to the team!

Best regards,

[HR_MANAGER_NAME]
Human Resources Manager
[COMPANY_NAME]'
WHERE name = 'Employee Offer Letter';

UPDATE legal_templates 
SET template_content = 'FOUNDER VESTING AGREEMENT

This Founder Vesting Agreement (the "Agreement") is made and entered into as of [EFFECTIVE_DATE] by and between [COMPANY_NAME], a company incorporated under the laws of [JURISDICTION] (the "Company"), and [FOUNDER_NAME] (the "Founder").

WHEREAS, the Founder is a key contributor to the Company and has been granted [TOTAL_SHARES] shares of the Company''s common stock (the "Shares");

WHEREAS, the parties wish to establish a vesting schedule for the Shares to ensure the Founder''s continued commitment to the Company;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. VESTING SCHEDULE
The Shares shall vest according to the following schedule:
• [CLIFF_PERIOD] month cliff period
• [VESTING_SCHEDULE] vesting schedule thereafter
• Full acceleration upon change of control

2. TERMINATION
Upon termination of the Founder''s relationship with the Company:
• For cause: All unvested Shares shall be forfeited
• Without cause: [ACCELERATION_TERMS] of unvested Shares shall accelerate

3. TRANSFER RESTRICTIONS
The Founder may not transfer any unvested Shares without the Company''s prior written consent.

4. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

[COMPANY_NAME]

By: [AUTHORIZED_SIGNATORY]
Title: [TITLE]
Date: [SIGNATURE_DATE]

[FOUNDER_NAME]

Signature: _________________
Date: [SIGNATURE_DATE]'
WHERE name = 'Founder Vesting Agreement';

UPDATE legal_templates 
SET template_content = 'MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of [EFFECTIVE_DATE] by and between [PARTY_A_NAME], a [PARTY_A_TYPE] with its principal place of business at [PARTY_A_ADDRESS] ("Party A"), and [PARTY_B_NAME], a [PARTY_B_TYPE] with its principal place of business at [PARTY_B_ADDRESS] ("Party B") (collectively, the "Parties").

1. PURPOSE
The Parties wish to explore a potential business relationship and may disclose to each other certain confidential and proprietary information for the purpose of [BUSINESS_PURPOSE] (the "Purpose").

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") that is:
• Marked as confidential or proprietary
• Should reasonably be understood to be confidential given the nature of the information
• Includes but is not limited to: business plans, financial information, customer lists, technical specifications, trade secrets, and know-how

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party shall:
• Use the Confidential Information solely for the Purpose
• Maintain the confidentiality of the Confidential Information
• Not disclose the Confidential Information to any third party without prior written consent
• Use the same degree of care to protect the Confidential Information as it uses for its own confidential information of similar importance

4. EXCEPTIONS
The obligations of confidentiality shall not apply to information that:
• Was known to the Receiving Party prior to disclosure
• Is or becomes publicly available through no fault of the Receiving Party
• Is independently developed by the Receiving Party without use of the Confidential Information
• Is required to be disclosed by law or court order

5. TERM AND TERMINATION
This Agreement shall remain in effect for [CONFIDENTIALITY_PERIOD] from the Effective Date. The obligations of confidentiality shall survive termination for [SURVIVAL_PERIOD] years.

6. RETURN OF MATERIALS
Upon termination or upon request, each Party shall return or destroy all Confidential Information received from the other Party.

7. NO LICENSE
Nothing in this Agreement shall be construed as granting any license or right to use the other Party''s intellectual property.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

[PARTY_A_NAME]

By: [PARTY_A_SIGNATORY]
Title: [PARTY_A_TITLE]
Date: [SIGNATURE_DATE]

[PARTY_B_NAME]

By: [PARTY_B_SIGNATORY]
Title: [PARTY_B_TITLE]
Date: [SIGNATURE_DATE]'
WHERE name = 'Non-Disclosure Agreement (NDA)';

-- Add a new comprehensive service agreement template
INSERT INTO legal_templates (name, category, description, template_content, fields) VALUES
('Service Agreement', 'Commercial', 'Comprehensive service agreement for business-to-business services', 
'PROFESSIONAL SERVICES AGREEMENT

This Professional Services Agreement (the "Agreement") is entered into as of [EFFECTIVE_DATE] by and between [CLIENT_NAME], a [CLIENT_TYPE] with its principal place of business at [CLIENT_ADDRESS] ("Client"), and [PROVIDER_NAME], a [PROVIDER_TYPE] with its principal place of business at [PROVIDER_ADDRESS] ("Provider").

1. SERVICES
Provider shall provide the following services to Client:
[SERVICE_DESCRIPTION]

2. TERM
This Agreement shall commence on [START_DATE] and continue until [END_DATE], unless earlier terminated in accordance with this Agreement.

3. COMPENSATION
Client shall pay Provider for the Services as follows:
• Rate: £[HOURLY_RATE] per hour
• Payment Terms: [PAYMENT_TERMS]
• Late Payment: Interest at [INTEREST_RATE]% per month on overdue amounts

4. INTELLECTUAL PROPERTY
All work product created by Provider in connection with the Services shall be owned by [IP_OWNERSHIP_TERMS].

5. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of any proprietary information shared during the term of this Agreement.

6. TERMINATION
Either party may terminate this Agreement with [NOTICE_PERIOD] days written notice.

7. LIMITATION OF LIABILITY
Provider''s total liability under this Agreement shall not exceed [LIABILITY_LIMIT].

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

[CLIENT_NAME]

By: [CLIENT_SIGNATORY]
Title: [CLIENT_TITLE]
Date: [SIGNATURE_DATE]

[PROVIDER_NAME]

By: [PROVIDER_SIGNATORY]
Title: [PROVIDER_TITLE]
Date: [SIGNATURE_DATE]',
'[
  {"key": "effectiveDate", "label": "Effective Date", "type": "date"},
  {"key": "clientName", "label": "Client Name", "type": "text", "placeholder": "Enter client company name"},
  {"key": "clientType", "label": "Client Type", "type": "text", "placeholder": "e.g., Limited Company, Partnership"},
  {"key": "clientAddress", "label": "Client Address", "type": "textarea", "placeholder": "Enter client business address"},
  {"key": "providerName", "label": "Provider Name", "type": "text", "placeholder": "Enter service provider name"},
  {"key": "providerType", "label": "Provider Type", "type": "text", "placeholder": "e.g., Limited Company, Sole Trader"},
  {"key": "providerAddress", "label": "Provider Address", "type": "textarea", "placeholder": "Enter provider business address"},
  {"key": "serviceDescription", "label": "Service Description", "type": "textarea", "placeholder": "Describe the services to be provided"},
  {"key": "startDate", "label": "Start Date", "type": "date"},
  {"key": "endDate", "label": "End Date", "type": "date"},
  {"key": "hourlyRate", "label": "Hourly Rate (£)", "type": "number", "placeholder": "Enter hourly rate"},
  {"key": "paymentTerms", "label": "Payment Terms", "type": "text", "placeholder": "e.g., Net 30 days"},
  {"key": "interestRate", "label": "Interest Rate (%)", "type": "number", "placeholder": "Enter interest rate for late payments"},
  {"key": "ipOwnershipTerms", "label": "IP Ownership Terms", "type": "text", "placeholder": "e.g., Client, Provider, or Joint"},
  {"key": "noticePeriod", "label": "Notice Period (days)", "type": "number", "placeholder": "Enter notice period in days"},
  {"key": "liabilityLimit", "label": "Liability Limit", "type": "text", "placeholder": "e.g., £50,000 or total fees paid"},
  {"key": "jurisdiction", "label": "Governing Law Jurisdiction", "type": "text", "placeholder": "e.g., England and Wales"},
  {"key": "clientSignatory", "label": "Client Signatory Name", "type": "text", "placeholder": "Enter client signatory name"},
  {"key": "clientTitle", "label": "Client Signatory Title", "type": "text", "placeholder": "Enter client signatory title"},
  {"key": "providerSignatory", "label": "Provider Signatory Name", "type": "text", "placeholder": "Enter provider signatory name"},
  {"key": "providerTitle", "label": "Provider Signatory Title", "type": "text", "placeholder": "Enter provider signatory title"},
  {"key": "signatureDate", "label": "Signature Date", "type": "date"}
]'::jsonb); 