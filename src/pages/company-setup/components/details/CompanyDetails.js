import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon, CheckIcon, ClipboardIcon, ArrowDownTrayIcon, BuildingOfficeIcon, EnvelopeIcon, BanknotesIcon, PhotoIcon, LinkIcon, CalendarIcon, GlobeAltIcon, IdentificationIcon, CreditCardIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCompanyProfile, upsertCompanyProfile } from '../../../../services/legalService';
import { supabase } from '../../../../lib/supabase';

const CompanyDetails = () => {
  const { currentOrganization } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  
  const [formData, setFormData] = useState({});
  const [logoUrl, setLogoUrl] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentOrganization?.organization_id) return;
      const data = await getCompanyProfile(currentOrganization.organization_id);
      if (data) {
        const profile = {
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
        };
        setCompanyInfo(profile);
        setFormData(profile);
        setLogoUrl(data.logo_url || '');
      }
    };
    fetchProfile();
  }, [currentOrganization]);

  const handleSave = async () => {
    setError('');
    setLoading(true);
    
    if (!currentOrganization?.organization_id) return;
    
    const profile = {
      organization_id: currentOrganization.organization_id,
      name: formData.name,
      company_number: formData.companyNumber,
      incorporation_date: formData.incorporationDate,
      registered_office: formData.registeredOffice,
      website: formData.website,
      contact_email: formData.contactEmail,
      linkedin_profile: formData.linkedinProfile,
      vat_number: formData.vatNumber,
      bank_provider: formData.bankProvider,
      bank_account_opened: formData.bankAccountOpened
    };
    
    try {
      await upsertCompanyProfile(profile);
      setCompanyInfo(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save company details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(companyInfo);
    setIsEditing(false);
    setError('');
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentOrganization?.organization_id) return;
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${currentOrganization.organization_id}/logo.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      alert('Error uploading logo: ' + uploadError.message);
      return;
    }
    
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);
    
    if (urlError || !publicUrlData?.publicUrl) {
      alert('Error getting logo URL');
      return;
    }
    
    const publicUrl = publicUrlData.publicUrl;
    setLogoUrl(publicUrl);
    await upsertCompanyProfile({ 
      organization_id: currentOrganization.organization_id, 
      logo_url: publicUrl 
    });
  };

  const handleCopyDetails = () => {
    const details = Object.entries(companyInfo)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(details);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BuildingOfficeIcon },
    { id: 'contact', label: 'Contact', icon: EnvelopeIcon },
    { id: 'legal', label: 'Legal', icon: IdentificationIcon },
    { id: 'banking', label: 'Banking', icon: CreditCardIcon }
  ];

  const InputField = ({ label, value, onChange, type = 'text', icon: Icon, placeholder, rows }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            rows={rows || 3}
            className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm`}
            placeholder={placeholder}
            disabled={!isEditing}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm`}
            placeholder={placeholder}
            disabled={!isEditing}
          />
        )}
      </div>
    </div>
  );

  const DisplayField = ({ label, value, icon: Icon }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm text-gray-900">{value || 'Not set'}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">Manage your company information and settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyDetails}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ClipboardIcon className="w-4 h-4 mr-2" />
            Copy Details
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Company Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                {logoUrl ? (
                  <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
                ) : (
                  <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <PhotoIcon className="w-3 h-3 text-gray-600" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {companyInfo.name || 'Your Company Name'}
              </h2>
              <div className="space-y-1">
                <div className="flex items-center text-purple-100">
                  <IdentificationIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {companyInfo.companyNumber || 'Company Number not set'}
                  </span>
                </div>
                {companyInfo.website && (
                  <div className="flex items-center text-purple-100">
                    <GlobeAltIcon className="w-4 h-4 mr-2" />
                    <a
                      href={companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {companyInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <InputField
                      label="Company Name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      icon={BuildingOfficeIcon}
                      placeholder="Enter company name"
                    />
                    <InputField
                      label="Company Number"
                      value={formData.companyNumber || ''}
                      onChange={(e) => setFormData({ ...formData, companyNumber: e.target.value })}
                      icon={IdentificationIcon}
                      placeholder="Enter company number"
                    />
                    <InputField
                      label="Incorporation Date"
                      value={formData.incorporationDate || ''}
                      onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
                      type="date"
                      icon={CalendarIcon}
                    />
                  </>
                ) : (
                  <>
                    <DisplayField
                      label="Company Name"
                      value={companyInfo.name}
                      icon={BuildingOfficeIcon}
                    />
                    <DisplayField
                      label="Company Number"
                      value={companyInfo.companyNumber}
                      icon={IdentificationIcon}
                    />
                    <DisplayField
                      label="Incorporation Date"
                      value={companyInfo.incorporationDate}
                      icon={CalendarIcon}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <div className="md:col-span-2">
                      <InputField
                        label="Registered Office Address"
                        value={formData.registeredOffice || ''}
                        onChange={(e) => setFormData({ ...formData, registeredOffice: e.target.value })}
                        type="textarea"
                        icon={BuildingOfficeIcon}
                        placeholder="Enter registered office address"
                        rows={3}
                      />
                    </div>
                    <InputField
                      label="Website"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      type="url"
                      icon={GlobeAltIcon}
                      placeholder="https://yourcompany.com"
                    />
                    <InputField
                      label="Contact Email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      type="email"
                      icon={EnvelopeIcon}
                      placeholder="contact@yourcompany.com"
                    />
                    <InputField
                      label="LinkedIn Profile"
                      value={formData.linkedinProfile || ''}
                      onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                      type="url"
                      icon={LinkIcon}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <DisplayField
                        label="Registered Office Address"
                        value={companyInfo.registeredOffice}
                        icon={BuildingOfficeIcon}
                      />
                    </div>
                    <DisplayField
                      label="Website"
                      value={companyInfo.website}
                      icon={GlobeAltIcon}
                    />
                    <DisplayField
                      label="Contact Email"
                      value={companyInfo.contactEmail}
                      icon={EnvelopeIcon}
                    />
                    <DisplayField
                      label="LinkedIn Profile"
                      value={companyInfo.linkedinProfile}
                      icon={LinkIcon}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <InputField
                    label="VAT Number"
                    value={formData.vatNumber || ''}
                    onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    icon={IdentificationIcon}
                    placeholder="Enter VAT number"
                  />
                ) : (
                  <DisplayField
                    label="VAT Number"
                    value={companyInfo.vatNumber}
                    icon={IdentificationIcon}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'banking' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <InputField
                      label="Bank Provider"
                      value={formData.bankProvider || ''}
                      onChange={(e) => setFormData({ ...formData, bankProvider: e.target.value })}
                      icon={BanknotesIcon}
                      placeholder="Enter bank name"
                    />
                    <InputField
                      label="Account Opening Date"
                      value={formData.bankAccountOpened || ''}
                      onChange={(e) => setFormData({ ...formData, bankAccountOpened: e.target.value })}
                      type="date"
                      icon={CalendarIcon}
                    />
                  </>
                ) : (
                  <>
                    <DisplayField
                      label="Bank Provider"
                      value={companyInfo.bankProvider}
                      icon={BanknotesIcon}
                    />
                    <DisplayField
                      label="Account Opening Date"
                      value={companyInfo.bankAccountOpened}
                      icon={CalendarIcon}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails; 