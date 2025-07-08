import React, { useEffect, useState, useRef } from 'react';
import { getCrmCompanies, createCrmCompany, updateCrmCompany, deleteCrmCompany, getCrmContacts } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon, UserIcon, DocumentTextIcon, ClockIcon, XMarkIcon, EllipsisVerticalIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CompanyDetail from './CompanyDetail';
import ContactsList from './ContactsList';

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, companies: false, contacts: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ navigation: true, management: false, search: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Contacts & Companies Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><BookOpenIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><Cog6ToothIcon className="w-5 h-5" /> Platform How-To</button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>The Contacts & Companies section helps you manage your customer database, organize contacts by company, and track all customer interactions in one centralized location.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('companies')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Managing Companies</span>{openContent.companies ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.companies && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Add new companies with basic information like name, industry, and website</li><li>Track company status (active, inactive, prospect)</li><li>View all contacts associated with each company</li><li>Edit company details and manage relationships</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('contacts')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Managing Contacts</span>{openContent.contacts ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.contacts && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Add contacts with detailed information and communication history</li><li>Track contact status and lead scores</li><li>Organize contacts by company and role</li><li>Maintain communication logs and notes</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('navigation')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Navigation</span>{openPlatform.navigation ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.navigation && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Switch between Companies and Contacts tabs. Use the search bar to find specific companies or contacts. Click on any company to view its details and associated contacts.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('management')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Data Management</span>{openPlatform.management ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.management && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Add new companies and contacts using the "Add" button. Edit existing records by clicking the edit icon. Use bulk editing for multiple records. All changes are automatically saved.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('search')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Search & Filters</span>{openPlatform.search ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.search && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use the search bar to find companies by name or website. Filter by status to view active, inactive, or prospect companies. Sort by any column for better organization.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your contacts management assistant. I can help you organize your customer database, improve contact relationships, and optimize your CRM workflow.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How should I organize my customer contacts?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Group contacts by company, use consistent naming conventions, and maintain regular communication logs. Consider using tags for different roles and interests.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What's the best way to track customer interactions?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Log all communications, meetings, and follow-ups. Use notes to record important details and set reminders for follow-up actions.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about contact management..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

export default function CompaniesList({ onBack }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const contactsListRef = useRef();
  const [companyDetailTab, setCompanyDetailTab] = useState('contacts');
  const [contactDetailTab, setContactDetailTab] = useState('communication');
  const [editingField, setEditingField] = useState(null);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    phone: '',
    address: '',
    status: 'active'
  });

  useEffect(() => { 
    load(); 
  }, [orgId]);

  const load = async () => {
    if (!orgId) return;
    try {
      const { data } = await getCrmCompanies(orgId);
      setCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
    setLoading(false);
  };

  const loadContacts = async (companyId) => {
    if (!orgId) return;
    try {
      const { data } = await getCrmContacts(orgId);
      const companyContacts = (data || []).filter(contact => contact.company_id === companyId);
      setContacts(companyContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const openEdit = (company) => {
    setEditing(company);
    setForm(company || { name: '', industry: '', size: '', website: '', phone: '', address: '', status: 'active' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formToSave = { ...form, website: form.website ? `https://${form.website.replace(/^https?:\/\//, '')}` : '' };
    if (editing) await updateCrmCompany(editing.id, formToSave);
    else await createCrmCompany(orgId, formToSave);
    closeModal();
    load();
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this company?')) {
      await deleteCrmCompany(id);
      load();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'prospect':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getContactStatusColor = (status) => {
    const colors = {
      prospect: 'bg-blue-100 text-blue-800',
      lead: 'bg-yellow-100 text-yellow-800',
      customer: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.prospect;
  };

  const getLeadScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getFaviconUrl = (website) => {
    if (!website) return '';
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
    } catch {
      return '';
    }
  };

  const filteredCompanies = companies.filter(company =>
    (company.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.website || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCompanyDetail = (company) => {
    setSelectedCompany(company);
    loadContacts(company.id);
  };
  const closeCompanyDetail = () => setSelectedCompany(null);

  const openContactDetail = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactDetail = () => {
    setSelectedContact(null);
    setEditingField(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCompanyDetail();
    }
  };

  const handleContactBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeContactDetail();
    }
  };

  const handleContactRowClick = (contact, e) => {
    // Don't open contact detail if clicking on the menu button
    if (e.target.closest('.menu-button')) {
      return;
    }
    openContactDetail(contact);
  };

  const handleContactMenuClick = (e, contact) => {
    e.stopPropagation();
    // Add menu functionality here if needed
  };

  const startEditing = (field) => {
    setEditingField(field);
  };

  const saveField = async (field, value) => {
    if (!selectedContact) return;
    
    try {
      const updatedContact = { ...selectedContact, [field]: value };
      // Update contact in the list
      setContacts(prev => prev.map(c => c.id === selectedContact.id ? updatedContact : c));
      setSelectedContact(updatedContact);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Error updating contact');
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const handleKeyPress = (e, field, value) => {
    if (e.key === 'Enter') {
      saveField(field, value);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const startBulkEditing = () => {
    setBulkEditing(true);
  };

  const saveBulkChanges = async () => {
    try {
      // Save company changes
      await updateCrmCompany(selectedCompany.id, selectedCompany);
      // Update the companies list
      setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? selectedCompany : c));
      setBulkEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes');
    }
  };

  const cancelBulkEditing = () => {
    setBulkEditing(false);
    setEditingField(null);
  };

  const EditableField = ({ label, value, field, type = 'text', options = null }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex-1 ml-4">
        {editingField === field || bulkEditing ? (
          <div className="flex items-center space-x-2">
            {type === 'select' ? (
              <select
                value={value || ''}
                onChange={(e) => saveField(field, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, field, e.target.value)}
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoFocus
              >
                {options?.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={value || ''}
                onChange={(e) => saveField(field, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, field, e.target.value)}
                onBlur={() => saveField(field, value)}
                className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                autoFocus
              />
            )}
            <button
              onClick={() => saveField(field, value)}
              className="text-green-600 hover:text-green-800"
            >
              ✓
            </button>
            <button
              onClick={cancelEditing}
              className="text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-900">{value || 'Not set'}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Companies & Contacts</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Manage your companies and contacts in one place.
          </p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        >
          <InformationCircleIcon className="w-4 h-4 mr-2 text-purple-500" />
          Help
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('companies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'companies'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Companies
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contacts'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contacts
          </button>
        </nav>
      </div>

      {activeTab === 'companies' ? (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Companies</p>
                  <p className="text-xl font-bold text-gray-900">{companies.length}</p>
                </div>
                <BuildingOfficeIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Active</p>
                  <p className="text-xl font-bold text-gray-900">
                    {companies.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Prospects</p>
                  <p className="text-xl font-bold text-gray-900">
                    {companies.filter(c => c.status === 'prospect').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Industries</p>
                  <p className="text-xl font-bold text-gray-900">
                    {new Set(companies.filter(c => c.industry).map(c => c.industry)).size}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Company
              </button>
            </div>

            {/* Results count */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {filteredCompanies.length} of {companies.length} companies
              </p>
            </div>
          </div>

          {/* Companies Table */}
          {filteredCompanies.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => openCompanyDetail(c)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {c.website && (
                            <img 
                              src={getFaviconUrl(c.website)} 
                              alt="favicon" 
                              className="w-6 h-6 rounded mr-3" 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                            {c.website && (
                              <div className="text-xs text-gray-500">{c.website}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{c.industry || '-'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(c.status || 'active')}`}>
                          {c.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{c.phone || '-'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(c);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <div className="text-center">
                <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500 text-sm mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search filters'
                    : 'Get started by adding your first company'
                  }
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Company
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ContactsList hideHeader={true} ref={contactsListRef} />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {editing ? 'Edit Company' : 'Add New Company'}
                    </h2>
                    <p className="text-purple-100 text-sm">
                      {editing ? 'Update company information and details' : 'Create a new company record in your CRM'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Company Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={form.industry}
                        onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="e.g., Technology, Healthcare"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Size
                      </label>
                      <select
                        value={form.size}
                        onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="prospect">Prospect</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">https://</span>
                        </div>
                        <input
                          type="text"
                          value={form.website.replace(/^https?:\/\//, '')}
                          onChange={e => setForm(f => ({ ...f, website: e.target.value.replace(/^https?:\/\//, '') }))}
                          className="w-full pl-16 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <PhoneIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                  >
                    {editing ? 'Update Company' : 'Create Company'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Company Detail Side Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleBackdropClick}>
          <div className="absolute top-0 right-0 h-full w-11/12 max-w-3xl bg-white shadow-2xl flex flex-col">
            {/* Modern Header */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                    {selectedCompany.website ? (
                      <img 
                        src={getFaviconUrl(selectedCompany.website)} 
                        alt="favicon" 
                        className="w-10 h-10 rounded" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <BuildingOfficeIcon className="w-10 h-10 text-white" style={{ display: selectedCompany.website ? 'none' : 'block' }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedCompany.name}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                      {selectedCompany.industry && (
                        <span className="text-purple-100 text-sm">{selectedCompany.industry}</span>
                      )}
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full bg-white bg-opacity-20 text-white`}>
                        {selectedCompany.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeCompanyDetail}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="text-purple-100 text-xs font-medium">Contacts</div>
                  <div className="text-white text-lg font-bold">{contacts.length}</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="text-purple-100 text-xs font-medium">Website</div>
                  <div className="text-white text-sm truncate">
                    {selectedCompany.website ? (
                      <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {selectedCompany.website.replace(/^https?:\/\//, '')}
                      </a>
                    ) : 'Not set'}
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <div className="text-purple-100 text-xs font-medium">Size</div>
                  <div className="text-white text-sm">{selectedCompany.size || 'Not set'}</div>
                </div>
              </div>
            </div>

            {/* Modern Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex px-6">
                <button
                  onClick={() => setCompanyDetailTab('contacts')}
                  className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    companyDetailTab === 'contacts'
                      ? 'border-purple-500 text-purple-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Contacts ({contacts.length})</span>
                </button>
                <button
                  onClick={() => setCompanyDetailTab('details')}
                  className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    companyDetailTab === 'details'
                      ? 'border-purple-500 text-purple-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => setCompanyDetailTab('activities')}
                  className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    companyDetailTab === 'activities'
                      ? 'border-purple-500 text-purple-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ClockIcon className="w-4 h-4" />
                  <span>Activities</span>
                </button>
                <button
                  onClick={() => setCompanyDetailTab('notes')}
                  className={`py-4 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    companyDetailTab === 'notes'
                      ? 'border-purple-500 text-purple-600 bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Notes</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {companyDetailTab === 'contacts' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Company Contacts</h3>
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Contact
                    </button>
                  </div>
                  
                  {contacts.length > 0 ? (
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={(e) => handleContactRowClick(contact, e)}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                  {contact.first_name?.[0]}{contact.last_name?.[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {contact.first_name} {contact.last_name}
                                </div>
                                <div className="text-sm text-gray-600">{contact.position || 'No position'}</div>
                                <div className="flex items-center space-x-4 mt-1">
                                  {contact.email && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <EnvelopeIcon className="w-3 h-3 mr-1" />
                                      {contact.email}
                                    </div>
                                  )}
                                  {contact.phone && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <PhoneIcon className="w-3 h-3 mr-1" />
                                      {contact.phone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getContactStatusColor(contact.status)}`}>
                                {contact.status}
                              </span>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">Lead Score</div>
                                <div className={`text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                                  {contact.lead_score || 0}
                                </div>
                              </div>
                              <button
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={(e) => handleContactMenuClick(e, contact)}
                              >
                                <EllipsisVerticalIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12">
                      <div className="text-center">
                        <UserIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts yet</h3>
                        <p className="text-gray-500 text-sm mb-6">Start building relationships by adding contacts for this company.</p>
                        <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add First Contact
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {companyDetailTab === 'details' && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                        {!bulkEditing ? (
                          <button
                            onClick={startBulkEditing}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit Details
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={saveBulkChanges}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelBulkEditing}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                          {bulkEditing ? (
                            <input
                              type="text"
                              value={selectedCompany.name || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, name: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="px-3 py-1 bg-gray-50 rounded-lg">
                              <p className="text-gray-900">{selectedCompany.name || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                          {bulkEditing ? (
                            <input
                              type="text"
                              value={selectedCompany.industry || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, industry: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="px-3 py-1 bg-gray-50 rounded-lg">
                              <p className="text-gray-900">{selectedCompany.industry || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                          {bulkEditing ? (
                            <select
                              value={selectedCompany.size || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, size: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">Select size</option>
                              <option value="1-10">1-10 employees</option>
                              <option value="11-50">11-50 employees</option>
                              <option value="51-200">51-200 employees</option>
                              <option value="201-1000">201-1000 employees</option>
                              <option value="1000+">1000+ employees</option>
                            </select>
                          ) : (
                            <div className="px-3 py-1 bg-gray-50 rounded-lg">
                              <p className="text-gray-900">{selectedCompany.size || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          {bulkEditing ? (
                            <select
                              value={selectedCompany.status || 'active'}
                              onChange={(e) => setSelectedCompany({...selectedCompany, status: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="active">Active</option>
                              <option value="prospect">Prospect</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            <div className="px-3 py-1 bg-gray-50 rounded-lg">
                              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCompany.status || 'active')}`}>
                                {selectedCompany.status || 'active'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          {bulkEditing ? (
                            <input
                              type="url"
                              value={selectedCompany.website || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, website: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="https://example.com"
                            />
                          ) : (
                            <div className="px-3 py-1 bg-gray-50 rounded-lg">
                              {selectedCompany.website ? (
                                <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                  {selectedCompany.website}
                                </a>
                              ) : (
                                <p className="text-gray-900">Not set</p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          {bulkEditing ? (
                            <input
                              type="tel"
                              value={selectedCompany.phone || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, phone: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="px-3 py-1 bg-gray-50 rounded-lg">
                              <p className="text-gray-900">{selectedCompany.phone || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        {bulkEditing ? (
                          <textarea
                            value={selectedCompany.address || ''}
                            onChange={(e) => setSelectedCompany({...selectedCompany, address: e.target.value})}
                            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            rows={3}
                          />
                        ) : (
                          <div className="px-3 py-1 bg-gray-50 rounded-lg">
                            <p className="text-gray-900">{selectedCompany.address || 'Not set'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {companyDetailTab === 'activities' && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-12">
                    <div className="text-center">
                      <ClockIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
                      <p className="text-gray-500 text-sm">Activity history will appear here when you start interacting with this company.</p>
                    </div>
                  </div>
                </div>
              )}

              {companyDetailTab === 'notes' && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-12">
                    <div className="text-center">
                      <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                      <p className="text-gray-500 text-sm">Add notes about this company to keep track of important information.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(selectedCompany.updated_at || selectedCompany.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => openEdit(selectedCompany)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    Edit Company
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCompany.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                  >
                    Delete Company
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Side Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleContactBackdropClick}>
          <div className="absolute top-0 right-0 h-full w-11/12 max-w-2xl bg-white shadow-2xl flex flex-col">
            {/* Contact Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
                <button
                  onClick={closeContactDetail}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-blue-600">
                    {selectedContact.first_name?.[0]}{selectedContact.last_name?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedContact.first_name} {selectedContact.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">{selectedCompany?.name}</p>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setContactDetailTab('communication')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    contactDetailTab === 'communication'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Communication</span>
                </button>
                <button
                  onClick={() => setContactDetailTab('notes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    contactDetailTab === 'notes'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Notes</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {contactDetailTab === 'communication' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Communication</h3>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No communication history yet</p>
                  </div>
                </div>
              )}

              {contactDetailTab === 'notes' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No notes yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="px-4 py-2 text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 