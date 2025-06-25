import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon, CheckIcon, ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCompanyProfile, upsertCompanyProfile } from '../../../../services/legalService';
import { supabase } from '../../../../lib/supabase';

const CompanyDetails = () => {
  const { currentOrganization } = useAuth();
  // Section edit states
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  // Section error states
  const [saveErrorBasic, setSaveErrorBasic] = useState('');
  const [saveErrorContact, setSaveErrorContact] = useState('');
  const [saveErrorBank, setSaveErrorBank] = useState('');
  // Section form states
  const [basicForm, setBasicForm] = useState({ name: '', companyNumber: '', incorporationDate: '' });
  const [contactForm, setContactForm] = useState({ registeredOffice: '', website: '', contactEmail: '', linkedinProfile: '', vatNumber: '' });
  const [bankForm, setBankForm] = useState({ bankProvider: '', bankAccountOpened: '' });
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    companyNumber: '',
    incorporationDate: '',
    registeredOffice: '',
    website: '',
    contactEmail: '',
    linkedinProfile: '',
    vatNumber: '',
    bankProvider: '',
    bankAccountOpened: ''
  });
  const [logoUrl, setLogoUrl] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentOrganization?.organization_id) return;
      const data = await getCompanyProfile(currentOrganization.organization_id);
      if (data) {
        setCompanyInfo({
          name: data.name || '',
          companyNumber: data.company_number || '',
          incorporationDate: data.incorporation_date || '',
          registeredOffice: data.registered_office || '',
          website: data.website || '',
          contactEmail: data.contact_email || '',
          linkedinProfile: data.linkedin_profile || '',
          vatNumber: data.vat_number || '',
          bankProvider: data.bank_provider || '',
          bankAccountOpened: data.bank_account_opened || ''
        });
        setBasicForm({
          name: data.name || '',
          companyNumber: data.company_number || '',
          incorporationDate: data.incorporation_date || ''
        });
        setContactForm({
          registeredOffice: data.registered_office || '',
          website: data.website || '',
          contactEmail: data.contact_email || '',
          linkedinProfile: data.linkedin_profile || '',
          vatNumber: data.vat_number || ''
        });
        setBankForm({
          bankProvider: data.bank_provider || '',
          bankAccountOpened: data.bank_account_opened || ''
        });
        setLogoUrl(data.logo_url || '');
      }
    };
    fetchProfile();
  }, [currentOrganization]);

  // Basic Info Save
  const handleSaveBasic = async () => {
    setSaveErrorBasic('');
    if (!currentOrganization?.organization_id) return;
    const profile = {
      organization_id: currentOrganization.organization_id,
      name: basicForm.name,
      company_number: basicForm.companyNumber,
      incorporation_date: basicForm.incorporationDate
    };
    try {
      await upsertCompanyProfile(profile);
      setCompanyInfo(prev => ({ ...prev, ...basicForm }));
      setIsEditingBasic(false);
    } catch (err) {
      setSaveErrorBasic(err.message || 'Failed to save.');
    }
  };
  // Contact Save
  const handleSaveContact = async () => {
    setSaveErrorContact('');
    if (!currentOrganization?.organization_id) return;
    const profile = {
      organization_id: currentOrganization.organization_id,
      registered_office: contactForm.registeredOffice,
      website: contactForm.website,
      contact_email: contactForm.contactEmail,
      linkedin_profile: contactForm.linkedinProfile,
      vat_number: contactForm.vatNumber
    };
    try {
      await upsertCompanyProfile(profile);
      setCompanyInfo(prev => ({ ...prev, ...contactForm }));
      setIsEditingContact(false);
    } catch (err) {
      setSaveErrorContact(err.message || 'Failed to save.');
    }
  };
  // Bank Save
  const handleSaveBank = async () => {
    setSaveErrorBank('');
    if (!currentOrganization?.organization_id) return;
    const profile = {
      organization_id: currentOrganization.organization_id,
      bank_provider: bankForm.bankProvider,
      bank_account_opened: bankForm.bankAccountOpened
    };
    try {
      await upsertCompanyProfile(profile);
      setCompanyInfo(prev => ({ ...prev, ...bankForm }));
      setIsEditingBank(false);
    } catch (err) {
      setSaveErrorBank(err.message || 'Failed to save.');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentOrganization?.organization_id) return;
    const fileExt = file.name.split('.').pop();
    const filePath = `${currentOrganization.organization_id}/logo.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('company-logos').upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert('Error uploading logo: ' + uploadError.message);
      return;
    }
    // Only get public URL after successful upload
    const { data: publicUrlData, error: urlError } = supabase.storage.from('company-logos').getPublicUrl(filePath);
    if (urlError || !publicUrlData?.publicUrl) {
      alert('Error getting logo URL');
      return;
    }
    const publicUrl = publicUrlData.publicUrl;
    setLogoUrl(publicUrl);
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, logo_url: publicUrl });
  };

  const handleCopyDetails = () => {
    const details = `Company Name: ${companyInfo.name}\nCompany Number: ${companyInfo.companyNumber}\nIncorporation Date: ${companyInfo.incorporationDate}\nRegistered Office: ${companyInfo.registeredOffice}\nWebsite: ${companyInfo.website}\nContact Email: ${companyInfo.contactEmail}\nLinkedIn Profile: ${companyInfo.linkedinProfile}\nVAT Number: ${companyInfo.vatNumber}\nBank Provider: ${companyInfo.bankProvider}\nBank Account Opened: ${companyInfo.bankAccountOpened}`;
    navigator.clipboard.writeText(details);
  };

  const handleDownloadDetails = () => {
    const details = `Company Name: ${companyInfo.name}\nCompany Number: ${companyInfo.companyNumber}\nIncorporation Date: ${companyInfo.incorporationDate}\nRegistered Office: ${companyInfo.registeredOffice}\nWebsite: ${companyInfo.website}\nContact Email: ${companyInfo.contactEmail}\nLinkedIn Profile: ${companyInfo.linkedinProfile}\nVAT Number: ${companyInfo.vatNumber}\nBank Provider: ${companyInfo.bankProvider}\nBank Account Opened: ${companyInfo.bankAccountOpened}`;
    const blob = new Blob([details], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company-details.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Company Details</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your company's core information, contact details, and banking setup. This information is used throughout the platform and can be updated at any time.</p>
      </div>
      {/* Action buttons */}
      <div className="mb-10" />
        <div className="space-y-4">
        {/* Top row: logo + basic info */}
        <div className="w-full flex flex-col md:flex-row gap-8 mb-4">
          {/* Logo upload, 1/3 width */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-white rounded-xl shadow p-6 min-h-[220px] h-full">
            <div className="mb-4 w-32 h-32 flex items-center justify-center rounded-lg overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Company Logo" className="object-contain w-full h-full" />
              ) : (
                <span className="text-gray-400 text-4xl font-bold">Logo</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
            >
              {logoUrl ? 'Change Logo' : 'Upload Logo'}
            </button>
          </div>
          {/* Basic Info, 2/3 width */}
          <div className="w-full md:w-2/3 flex flex-col h-full">
            <div className="bg-white rounded-xl shadow p-0 space-y-0 w-full min-h-[220px] h-full flex flex-col">
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <div className="text-lg font-bold text-gray-900 mb-4">Basic Information</div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyDetails}
                    className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-transparent border-none shadow-none"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <ClipboardIcon className="h-4 w-4 mr-1" /> Copy
                  </button>
                  <button
                    onClick={() => isEditingBasic ? handleSaveBasic() : setIsEditingBasic(true)}
                    className="inline-flex items-center text-xs text-blue-600 border border-blue-600 bg-white rounded-md px-3 py-1.5 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
                    style={{ boxShadow: 'none' }}
                  >
                    {isEditingBasic ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" /> Save
                </>
              ) : (
                <>
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                </>
              )}
            </button>
          </div>
              </div>
              <div className="px-6 pb-6 pt-0 space-y-4">
                {/* Field: Company Name */}
                <div className="flex items-center gap-4">
                  <label className="block w-40 text-xs font-medium text-gray-500">Company Name</label>
                  {isEditingBasic ? (
                    <input type="text" value={basicForm.name} onChange={e => setBasicForm(f => ({ ...f, name: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  ) : (
                    <div className="flex-1 text-gray-900 text-sm">{companyInfo.name}</div>
                  )}
              </div>
                {/* Field: Company Number */}
                <div className="flex items-center gap-4">
                  <label className="block w-40 text-xs font-bold text-gray-500">Company Number</label>
                  {isEditingBasic ? (
                    <input type="text" value={basicForm.companyNumber} onChange={e => setBasicForm(f => ({ ...f, companyNumber: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  ) : (
                    <div className="flex-1 text-gray-900 text-sm">{companyInfo.companyNumber}</div>
                  )}
              </div>
                {/* Field: Incorporation Date */}
                <div className="flex items-center gap-4">
                  <label className="block w-40 text-xs font-medium text-gray-500">Incorporation Date</label>
                  {isEditingBasic ? (
                    <input type="date" value={basicForm.incorporationDate} onChange={e => setBasicForm(f => ({ ...f, incorporationDate: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  ) : (
                    <div className="flex-1 text-gray-900 text-sm">{companyInfo.incorporationDate}</div>
                  )}
              </div>
              </div>
              </div>
              </div>
              </div>
        {/* Contact Section */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow p-0 space-y-0 w-full">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div className="text-lg font-bold text-gray-900 mb-4">Contact</div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyDetails}
                  className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-transparent border-none shadow-none"
                  style={{ background: 'none', border: 'none' }}
                >
                  <ClipboardIcon className="h-4 w-4 mr-1" /> Copy
                </button>
                <button
                  onClick={() => isEditingContact ? handleSaveContact() : setIsEditingContact(true)}
                  className="inline-flex items-center text-xs text-blue-600 border border-blue-600 bg-white rounded-md px-3 py-1.5 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
                  style={{ boxShadow: 'none' }}
                >
                  {isEditingContact ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1" /> Save
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="px-6 pb-6 pt-0 space-y-4">
              {/* Field: Registered Office */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">Registered Office</label>
                {isEditingContact ? (
                  <textarea value={contactForm.registeredOffice} onChange={e => setContactForm(f => ({ ...f, registeredOffice: e.target.value }))} rows={2} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.registeredOffice}</div>
                )}
              </div>
              {/* Field: Website */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">Website</label>
                {isEditingContact ? (
                  <input type="url" value={contactForm.website} onChange={e => setContactForm(f => ({ ...f, website: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.website}</div>
                )}
              </div>
              {/* Field: Contact Email */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">Contact Email</label>
                {isEditingContact ? (
                  <input type="email" value={contactForm.contactEmail} onChange={e => setContactForm(f => ({ ...f, contactEmail: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.contactEmail}</div>
                )}
              </div>
              {/* Field: LinkedIn Profile */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">LinkedIn Profile</label>
                {isEditingContact ? (
                  <input type="url" value={contactForm.linkedinProfile} onChange={e => setContactForm(f => ({ ...f, linkedinProfile: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.linkedinProfile}</div>
                )}
              </div>
              {/* Field: VAT Number */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">VAT Number</label>
                {isEditingContact ? (
                  <input type="text" value={contactForm.vatNumber} onChange={e => setContactForm(f => ({ ...f, vatNumber: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.vatNumber}</div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Banking Section */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow p-0 space-y-0 w-full">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div className="text-lg font-bold text-gray-900 mb-4">Banking</div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyDetails}
                  className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-transparent border-none shadow-none"
                  style={{ background: 'none', border: 'none' }}
                >
                  <ClipboardIcon className="h-4 w-4 mr-1" /> Copy
                </button>
                <button
                  onClick={() => isEditingBank ? handleSaveBank() : setIsEditingBank(true)}
                  className="inline-flex items-center text-xs text-blue-600 border border-blue-600 bg-white rounded-md px-3 py-1.5 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
                  style={{ boxShadow: 'none' }}
                >
                  {isEditingBank ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1" /> Save
                    </>
                  ) : (
                    <>
                      <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </>
                  )}
                </button>
              </div>
              </div>
            <div className="px-6 pb-6 pt-0 space-y-4">
              {/* Field: Bank Provider */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">Bank Provider</label>
                {isEditingBank ? (
                  <input type="text" value={bankForm.bankProvider} onChange={e => setBankForm(f => ({ ...f, bankProvider: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.bankProvider}</div>
                )}
              </div>
              {/* Field: Bank Account Opened */}
              <div className="flex items-center gap-4">
                <label className="block w-40 text-xs font-medium text-gray-500">Bank Account Opened</label>
                {isEditingBank ? (
                  <input type="date" value={bankForm.bankAccountOpened} onChange={e => setBankForm(f => ({ ...f, bankAccountOpened: e.target.value }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                ) : (
                  <div className="flex-1 text-gray-900 text-sm">{companyInfo.bankAccountOpened}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails; 