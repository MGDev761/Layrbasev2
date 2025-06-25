-- Insert comprehensive legal templates
INSERT INTO "public"."legal_templates" ("id", "name", "category", "description", "template_content", "fields", "is_active", "created_at", "updated_at") VALUES 
(
  gen_random_uuid(),
  'Founder Agreement',
  'Foundation',
  'Comprehensive founder agreement covering equity, roles, and responsibilities',
  'FOUNDER AGREEMENT

This Founder Agreement (the "Agreement") is made and entered into as of [EFFECTIVE_DATE] by and between [COMPANY_NAME], a company incorporated under the laws of [JURISDICTION] (the "Company"), and the following individuals (collectively, the "Founders"): [FOUNDER_1_NAME], [FOUNDER_2_NAME], and [FOUNDER_3_NAME].

WHEREAS, the Founders wish to establish their respective rights and obligations with respect to the Company and their ownership of shares in the Company;

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the parties agree as follows:

1. EQUITY ALLOCATION
Each Founder shall receive the following number of shares in the Company:
• [FOUNDER_1_NAME]: [FOUNDER_1_SHARES] shares ([FOUNDER_1_PERCENTAGE]%)
• [FOUNDER_2_NAME]: [FOUNDER_2_SHARES] shares ([FOUNDER_2_PERCENTAGE]%)
• [FOUNDER_3_NAME]: [FOUNDER_3_SHARES] shares ([FOUNDER_3_PERCENTAGE]%)

2. VESTING SCHEDULE
All shares issued to Founders shall be subject to the following vesting schedule:
• [CLIFF_PERIOD] month cliff period
• [VESTING_SCHEDULE] vesting schedule thereafter
• Full acceleration upon change of control

3. ROLES AND RESPONSIBILITIES
The Founders shall serve in the following roles:
• [FOUNDER_1_NAME]: [FOUNDER_1_ROLE]
• [FOUNDER_2_NAME]: [FOUNDER_2_ROLE]
• [FOUNDER_3_NAME]: [FOUNDER_3_ROLE]

4. INTELLECTUAL PROPERTY
Each Founder hereby assigns to the Company all intellectual property created in connection with the Company''s business.

5. CONFIDENTIALITY
Each Founder agrees to maintain the confidentiality of the Company''s proprietary information.

6. NON-COMPETE
During their employment and for [NON_COMPETE_PERIOD] months thereafter, Founders shall not engage in competitive activities.

7. TERMINATION
Upon termination of a Founder''s relationship with the Company:
• For cause: All unvested shares shall be forfeited
• Without cause: [ACCELERATION_TERMS] of unvested shares shall accelerate

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

[COMPANY_NAME]

By: [AUTHORIZED_SIGNATORY]
Title: [TITLE]
Date: [SIGNATURE_DATE]

[FOUNDER_1_NAME]
Signature: _________________
Date: [SIGNATURE_DATE]

[FOUNDER_2_NAME]
Signature: _________________
Date: [SIGNATURE_DATE]

[FOUNDER_3_NAME]
Signature: _________________
Date: [SIGNATURE_DATE]',
  '[
    {"key": "effectiveDate", "type": "date", "label": "Effective Date"},
    {"key": "companyName", "type": "text", "label": "Company Name", "placeholder": "Enter company name"},
    {"key": "jurisdiction", "type": "text", "label": "Governing Law Jurisdiction", "placeholder": "e.g., England and Wales"},
    {"key": "founder1Name", "type": "text", "label": "Founder 1 Name", "placeholder": "Enter first founder name"},
    {"key": "founder2Name", "type": "text", "label": "Founder 2 Name", "placeholder": "Enter second founder name"},
    {"key": "founder3Name", "type": "text", "label": "Founder 3 Name", "placeholder": "Enter third founder name"},
    {"key": "founder1Shares", "type": "number", "label": "Founder 1 Shares", "placeholder": "Enter number of shares"},
    {"key": "founder1Percentage", "type": "number", "label": "Founder 1 Percentage", "placeholder": "Enter percentage"},
    {"key": "founder2Shares", "type": "number", "label": "Founder 2 Shares", "placeholder": "Enter number of shares"},
    {"key": "founder2Percentage", "type": "number", "label": "Founder 2 Percentage", "placeholder": "Enter percentage"},
    {"key": "founder3Shares", "type": "number", "label": "Founder 3 Shares", "placeholder": "Enter number of shares"},
    {"key": "founder3Percentage", "type": "number", "label": "Founder 3 Percentage", "placeholder": "Enter percentage"},
    {"key": "cliffPeriod", "type": "number", "label": "Cliff Period (months)", "placeholder": "12"},
    {"key": "vestingSchedule", "type": "text", "label": "Vesting Schedule", "placeholder": "e.g., 1/48th monthly over 4 years"},
    {"key": "founder1Role", "type": "text", "label": "Founder 1 Role", "placeholder": "e.g., CEO, CTO, etc."},
    {"key": "founder2Role", "type": "text", "label": "Founder 2 Role", "placeholder": "e.g., CEO, CTO, etc."},
    {"key": "founder3Role", "type": "text", "label": "Founder 3 Role", "placeholder": "e.g., CEO, CTO, etc."},
    {"key": "nonCompetePeriod", "type": "number", "label": "Non-Compete Period (months)", "placeholder": "12"},
    {"key": "accelerationTerms", "type": "text", "label": "Acceleration Terms", "placeholder": "e.g., 50% of unvested shares"},
    {"key": "authorizedSignatory", "type": "text", "label": "Authorized Signatory", "placeholder": "Enter signatory name"},
    {"key": "title", "type": "text", "label": "Signatory Title", "placeholder": "e.g., Director, CEO"},
    {"key": "signatureDate", "type": "date", "label": "Signature Date"}
  ]',
  'true',
  NOW(),
  NOW()
),

(
  gen_random_uuid(),
  'Mutual Non-Disclosure Agreement',
  'Confidentiality',
  'Comprehensive mutual NDA for protecting confidential information',
  'MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of [EFFECTIVE_DATE] by and between [PARTY_A_NAME], a [PARTY_A_TYPE] with its principal place of business at [PARTY_A_ADDRESS] ("Party A"), and [PARTY_B_NAME], a [PARTY_B_TYPE] with its principal place of business at [PARTY_B_ADDRESS] ("Party B") (collectively, the "Parties").

1. PURPOSE
The Parties wish to explore a potential business relationship and may disclose to each other certain confidential and proprietary information for the purpose of [BUSINESS_PURPOSE] (the "Purpose").

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party") that is:
• Marked as confidential or proprietary
• Should reasonably be understood to be confidential given the nature of the information
• Includes but is not limited to: business plans, financial information, customer lists, technical specifications, trade secrets, know-how, and any other proprietary information

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party shall:
• Use the Confidential Information solely for the Purpose
• Maintain the confidentiality of the Confidential Information
• Not disclose the Confidential Information to any third party without prior written consent
• Use the same degree of care to protect the Confidential Information as it uses for its own confidential information of similar importance
• Ensure that its employees, agents, and representatives who have access to Confidential Information are bound by confidentiality obligations at least as restrictive as those in this Agreement

4. EXCEPTIONS
The obligations of confidentiality shall not apply to information that:
• Was known to the Receiving Party prior to disclosure
• Is or becomes publicly available through no fault of the Receiving Party
• Is independently developed by the Receiving Party without use of the Confidential Information
• Is required to be disclosed by law or court order (provided reasonable notice is given to the Disclosing Party)

5. TERM AND TERMINATION
This Agreement shall remain in effect for [CONFIDENTIALITY_PERIOD] from the Effective Date. The obligations of confidentiality shall survive termination for [SURVIVAL_PERIOD] years.

6. RETURN OF MATERIALS
Upon termination or upon request, each Party shall return or destroy all Confidential Information received from the other Party, including all copies and derivatives thereof.

7. NO LICENSE
Nothing in this Agreement shall be construed as granting any license or right to use the other Party''s intellectual property, trademarks, or other proprietary rights.

8. REMEDIES
The Parties acknowledge that monetary damages may not be sufficient to remedy a breach of this Agreement and that injunctive relief may be appropriate.

9. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

10. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior agreements.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

[PARTY_A_NAME]

By: [PARTY_A_SIGNATORY]
Title: [PARTY_A_TITLE]
Date: [SIGNATURE_DATE]

[PARTY_B_NAME]

By: [PARTY_B_SIGNATORY]
Title: [PARTY_B_TITLE]
Date: [SIGNATURE_DATE]',
  '[
    {"key": "effectiveDate", "type": "date", "label": "Effective Date"},
    {"key": "partyAName", "type": "text", "label": "Party A Name", "placeholder": "Enter first party name"},
    {"key": "partyAType", "type": "text", "label": "Party A Type", "placeholder": "e.g., Limited Company, Partnership"},
    {"key": "partyAAddress", "type": "textarea", "label": "Party A Address", "placeholder": "Enter business address"},
    {"key": "partyBName", "type": "text", "label": "Party B Name", "placeholder": "Enter second party name"},
    {"key": "partyBType", "type": "text", "label": "Party B Type", "placeholder": "e.g., Limited Company, Partnership"},
    {"key": "partyBAddress", "type": "textarea", "label": "Party B Address", "placeholder": "Enter business address"},
    {"key": "businessPurpose", "type": "textarea", "label": "Business Purpose", "placeholder": "Describe the business purpose"},
    {"key": "confidentialityPeriod", "type": "number", "label": "Confidentiality Period (months)", "placeholder": "24"},
    {"key": "survivalPeriod", "type": "number", "label": "Survival Period (years)", "placeholder": "3"},
    {"key": "jurisdiction", "type": "text", "label": "Governing Law Jurisdiction", "placeholder": "e.g., England and Wales"},
    {"key": "partyASignatory", "type": "text", "label": "Party A Signatory", "placeholder": "Enter signatory name"},
    {"key": "partyATitle", "type": "text", "label": "Party A Title", "placeholder": "e.g., Director, CEO"},
    {"key": "partyBSignatory", "type": "text", "label": "Party B Signatory", "placeholder": "Enter signatory name"},
    {"key": "partyBTitle", "type": "text", "label": "Party B Title", "placeholder": "e.g., Director, CEO"},
    {"key": "signatureDate", "type": "date", "label": "Signature Date"}
  ]',
  'true',
  NOW(),
  NOW()
),

(
  gen_random_uuid(),
  'Master Services Agreement',
  'Commercial',
  'Standard master services agreement for ongoing business relationships',
  'MASTER SERVICES AGREEMENT

This Master Services Agreement (the "Agreement") is entered into as of [EFFECTIVE_DATE] by and between [CLIENT_NAME], a [CLIENT_TYPE] with its principal place of business at [CLIENT_ADDRESS] ("Client"), and [PROVIDER_NAME], a [PROVIDER_TYPE] with its principal place of business at [PROVIDER_ADDRESS] ("Provider").

1. SERVICES
Provider shall provide the following services to Client as described in individual Statements of Work (SOWs):
[SERVICE_DESCRIPTION]

2. TERM
This Agreement shall commence on [START_DATE] and continue until [END_DATE], unless earlier terminated in accordance with this Agreement. The term may be extended by mutual written agreement.

3. COMPENSATION
Client shall pay Provider for the Services as follows:
• Rate: £[HOURLY_RATE] per hour
• Payment Terms: [PAYMENT_TERMS]
• Late Payment: Interest at [INTEREST_RATE]% per month on overdue amounts
• Expenses: [EXPENSE_TERMS]

4. INTELLECTUAL PROPERTY
All work product created by Provider in connection with the Services shall be owned by [IP_OWNERSHIP_TERMS]. Provider retains ownership of its pre-existing intellectual property.

5. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of any proprietary information shared during the term of this Agreement, in accordance with the confidentiality provisions set forth herein.

6. WARRANTIES
Provider warrants that:
• Services will be performed in a professional manner
• Services will conform to the specifications in the applicable SOW
• Provider has the right to enter into this Agreement

7. LIMITATION OF LIABILITY
Provider''s total liability under this Agreement shall not exceed [LIABILITY_LIMIT]. Neither party shall be liable for indirect, incidental, or consequential damages.

8. TERMINATION
Either party may terminate this Agreement with [NOTICE_PERIOD] days written notice. Upon termination, Client shall pay for all services rendered up to the termination date.

9. FORCE MAJEURE
Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control.

10. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

11. DISPUTE RESOLUTION
Any disputes shall be resolved through [DISPUTE_RESOLUTION_METHOD] in [DISPUTE_JURISDICTION].

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
    {"key": "effectiveDate", "type": "date", "label": "Effective Date"},
    {"key": "clientName", "type": "text", "label": "Client Name", "placeholder": "Enter client company name"},
    {"key": "clientType", "type": "text", "label": "Client Type", "placeholder": "e.g., Limited Company, Partnership"},
    {"key": "clientAddress", "type": "textarea", "label": "Client Address", "placeholder": "Enter client business address"},
    {"key": "providerName", "type": "text", "label": "Provider Name", "placeholder": "Enter service provider name"},
    {"key": "providerType", "type": "text", "label": "Provider Type", "placeholder": "e.g., Limited Company, Sole Trader"},
    {"key": "providerAddress", "type": "textarea", "label": "Provider Address", "placeholder": "Enter provider business address"},
    {"key": "serviceDescription", "type": "textarea", "label": "Service Description", "placeholder": "Describe the services to be provided"},
    {"key": "startDate", "type": "date", "label": "Start Date"},
    {"key": "endDate", "type": "date", "label": "End Date"},
    {"key": "hourlyRate", "type": "number", "label": "Hourly Rate (£)", "placeholder": "Enter hourly rate"},
    {"key": "paymentTerms", "type": "text", "label": "Payment Terms", "placeholder": "e.g., Net 30 days"},
    {"key": "interestRate", "type": "number", "label": "Interest Rate (%)", "placeholder": "Enter interest rate for late payments"},
    {"key": "expenseTerms", "type": "text", "label": "Expense Terms", "placeholder": "e.g., Pre-approved expenses only"},
    {"key": "ipOwnershipTerms", "type": "text", "label": "IP Ownership Terms", "placeholder": "e.g., Client, Provider, or Joint"},
    {"key": "liabilityLimit", "type": "text", "label": "Liability Limit", "placeholder": "e.g., £50,000 or total fees paid"},
    {"key": "noticePeriod", "type": "number", "label": "Notice Period (days)", "placeholder": "Enter notice period in days"},
    {"key": "jurisdiction", "type": "text", "label": "Governing Law Jurisdiction", "placeholder": "e.g., England and Wales"},
    {"key": "disputeResolutionMethod", "type": "text", "label": "Dispute Resolution Method", "placeholder": "e.g., Mediation, Arbitration"},
    {"key": "disputeJurisdiction", "type": "text", "label": "Dispute Jurisdiction", "placeholder": "e.g., London, England"},
    {"key": "clientSignatory", "type": "text", "label": "Client Signatory", "placeholder": "Enter client signatory name"},
    {"key": "clientTitle", "type": "text", "label": "Client Title", "placeholder": "Enter client signatory title"},
    {"key": "providerSignatory", "type": "text", "label": "Provider Signatory", "placeholder": "Enter provider signatory name"},
    {"key": "providerTitle", "type": "text", "label": "Provider Title", "placeholder": "Enter provider signatory title"},
    {"key": "signatureDate", "type": "date", "label": "Signature Date"}
  ]',
  'true',
  NOW(),
  NOW()
),

(
  gen_random_uuid(),
  'Standard Employment Contract',
  'Employment',
  'Comprehensive employment agreement for full-time employees',
  'EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made and entered into as of [EFFECTIVE_DATE] by and between [COMPANY_NAME], a company incorporated under the laws of [JURISDICTION] (the "Company"), and [EMPLOYEE_NAME] (the "Employee").

1. POSITION AND DUTIES
The Company hereby employs the Employee as [POSITION_TITLE] in the [DEPARTMENT] department. The Employee shall report to [REPORTING_MANAGER] and shall perform such duties as may be assigned by the Company from time to time.

2. TERM OF EMPLOYMENT
This Agreement shall commence on [START_DATE] and shall continue until terminated in accordance with the provisions of this Agreement.

3. COMPENSATION
The Employee shall receive:
• Annual Salary: £[ANNUAL_SALARY]
• Payment Schedule: [PAYMENT_SCHEDULE]
• Benefits: [BENEFITS_DESCRIPTION]
• Bonus: [BONUS_TERMS]

4. WORK SCHEDULE
The Employee shall work [WORK_HOURS] hours per week, typically [WORK_DAYS] from [WORK_START_TIME] to [WORK_END_TIME]. The Employee may be required to work additional hours as necessary to fulfill their duties.

5. LOCATION
The Employee shall primarily work at [WORK_LOCATION], with the understanding that the Company may require the Employee to work at other locations as needed.

6. PROBATION PERIOD
The Employee shall serve a probation period of [PROBATION_PERIOD] months, during which time either party may terminate this Agreement with [PROBATION_NOTICE] days notice.

7. HOLIDAYS AND LEAVE
The Employee shall be entitled to:
• [ANNUAL_LEAVE_DAYS] days annual leave per year
• [SICK_LEAVE_DAYS] days sick leave per year
• [MATERNITY_PATERNITY_LEAVE] days maternity/paternity leave as applicable
• Public holidays as observed by the Company

8. CONFIDENTIALITY
The Employee agrees to maintain the confidentiality of the Company''s proprietary information and trade secrets during and after employment.

9. INTELLECTUAL PROPERTY
All intellectual property created by the Employee in connection with their employment shall be owned by the Company.

10. NON-COMPETE
During employment and for [NON_COMPETE_PERIOD] months thereafter, the Employee shall not engage in competitive activities or solicit the Company''s customers or employees.

11. TERMINATION
Either party may terminate this Agreement with [NOTICE_PERIOD] days written notice. The Company may terminate immediately for cause, including but not limited to:
• Gross misconduct
• Breach of confidentiality
• Failure to perform duties
• Violation of company policies

12. POST-TERMINATION OBLIGATIONS
Upon termination, the Employee shall:
• Return all company property
• Maintain confidentiality obligations
• Comply with non-compete provisions
• Provide reasonable assistance with transition

13. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [JURISDICTION].

14. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

[COMPANY_NAME]

By: [AUTHORIZED_SIGNATORY]
Title: [SIGNATORY_TITLE]
Date: [SIGNATURE_DATE]

[EMPLOYEE_NAME]

Signature: _________________
Date: [SIGNATURE_DATE]',
  '[
    {"key": "effectiveDate", "type": "date", "label": "Effective Date"},
    {"key": "companyName", "type": "text", "label": "Company Name", "placeholder": "Enter company name"},
    {"key": "jurisdiction", "type": "text", "label": "Governing Law Jurisdiction", "placeholder": "e.g., England and Wales"},
    {"key": "employeeName", "type": "text", "label": "Employee Name", "placeholder": "Enter employee full name"},
    {"key": "positionTitle", "type": "text", "label": "Position Title", "placeholder": "e.g., Software Engineer, Marketing Manager"},
    {"key": "department", "type": "text", "label": "Department", "placeholder": "e.g., Engineering, Marketing, Sales"},
    {"key": "reportingManager", "type": "text", "label": "Reporting Manager", "placeholder": "Enter manager name"},
    {"key": "startDate", "type": "date", "label": "Start Date"},
    {"key": "annualSalary", "type": "number", "label": "Annual Salary (£)", "placeholder": "Enter annual salary"},
    {"key": "paymentSchedule", "type": "text", "label": "Payment Schedule", "placeholder": "e.g., Monthly, Bi-weekly"},
    {"key": "benefitsDescription", "type": "textarea", "label": "Benefits Description", "placeholder": "Describe benefits package"},
    {"key": "bonusTerms", "type": "text", "label": "Bonus Terms", "placeholder": "e.g., Performance-based, Annual"},
    {"key": "workHours", "type": "number", "label": "Work Hours per Week", "placeholder": "40"},
    {"key": "workDays", "type": "text", "label": "Work Days", "placeholder": "e.g., Monday to Friday"},
    {"key": "workStartTime", "type": "text", "label": "Work Start Time", "placeholder": "e.g., 9:00 AM"},
    {"key": "workEndTime", "type": "text", "label": "Work End Time", "placeholder": "e.g., 5:30 PM"},
    {"key": "workLocation", "type": "text", "label": "Work Location", "placeholder": "e.g., London Office, Remote"},
    {"key": "probationPeriod", "type": "number", "label": "Probation Period (months)", "placeholder": "3"},
    {"key": "probationNotice", "type": "number", "label": "Probation Notice (days)", "placeholder": "7"},
    {"key": "annualLeaveDays", "type": "number", "label": "Annual Leave Days", "placeholder": "25"},
    {"key": "sickLeaveDays", "type": "number", "label": "Sick Leave Days", "placeholder": "10"},
    {"key": "maternityPaternityLeave", "type": "number", "label": "Maternity/Paternity Leave (weeks)", "placeholder": "52"},
    {"key": "nonCompetePeriod", "type": "number", "label": "Non-Compete Period (months)", "placeholder": "12"},
    {"key": "noticePeriod", "type": "number", "label": "Notice Period (days)", "placeholder": "30"},
    {"key": "authorizedSignatory", "type": "text", "label": "Authorized Signatory", "placeholder": "Enter signatory name"},
    {"key": "signatoryTitle", "type": "text", "label": "Signatory Title", "placeholder": "e.g., HR Director, CEO"},
    {"key": "signatureDate", "type": "date", "label": "Signature Date"}
  ]',
  'true',
  NOW(),
  NOW()
); 