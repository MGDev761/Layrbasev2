import React, { useEffect, useState, useRef } from 'react';
import { getCrmCompanies, createCrmCompany, updateCrmCompany, deleteCrmCompany, getCrmContacts } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon, UserIcon, DocumentTextIcon, ClockIcon, XMarkIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid';
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Companies & Contacts</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage your companies and contacts in one place.
          </p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
          Help
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tabs for Companies/Contacts */}
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
        {/* Top bar: search, filter, add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 rounded-t-md px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {activeTab === 'contacts' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="prospect">Prospects</option>
                <option value="lead">Leads</option>
                <option value="customer">Companies</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>
            <button
              onClick={() => activeTab === 'companies' ? setShowModal(true) : contactsListRef.current?.openEdit()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Add {activeTab === 'companies' ? 'Company' : 'Contact'}
            </button>
        </div>
        {activeTab === 'companies' ? (
          <div className="bg-white rounded-md overflow-hidden">
            {filteredCompanies.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompanies.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => openCompanyDetail(c)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
                        {c.website && (
                          <img src={getFaviconUrl(c.website)} alt="favicon" className="w-5 h-5 rounded mr-2" />
                        )}
                        <span className="text-left text-gray-900 font-medium">
                          {c.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{c.industry}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status || 'active')}`}>
                          {c.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{c.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="menu-button p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add menu functionality here if needed
                          }}
                        >
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search' 
                    : 'Get started by adding your first company'
                  }
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Company
                </button>
              </div>
            )}
          </div>
        ) : (
          <ContactsList searchTerm={searchTerm} filterStatus={filterStatus} ref={contactsListRef} />
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="text-lg font-medium text-gray-900">{editing ? 'Edit' : 'Add'} Customer</div>
                <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>
              <div className="space-y-3">
                <input className="w-full px-3 py-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <input className="w-full px-3 py-2 border rounded" placeholder="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
                <input className="w-full px-3 py-2 border rounded" placeholder="Size" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l">https://</span>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-r focus:outline-none"
                    placeholder="example.com"
                    value={form.website.replace(/^https?:\/\//, '')}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value.replace(/^https?:\/\//, '') }))}
                    style={{ borderLeft: 'none' }}
                  />
                </div>
                <input className="w-full px-3 py-2 border rounded" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <input className="w-full px-3 py-2 border rounded" placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                <select className="w-full px-3 py-2 border rounded" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-8">
                <button type="button" onClick={closeModal} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">Save</button>
              </div>
            </form>
          </div>
        )}

        {/* Company Detail Side Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleBackdropClick}>
            <div className="absolute top-0 right-0 h-full w-11/12 max-w-2xl bg-white shadow-2xl flex flex-col">
              {/* Company Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
                  <button
                    onClick={closeCompanyDetail}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 flex items-center justify-center">
                    {selectedCompany.website && (
                      <img src={getFaviconUrl(selectedCompany.website)} alt="favicon" className="w-8 h-8 rounded" />
                    )}
                    {!selectedCompany.website && (
                      <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h2>
                    <p className="text-sm text-gray-600">{selectedCompany.industry}</p>
                    <p className="text-sm text-gray-500">{selectedCompany.phone}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setCompanyDetailTab('contacts')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      companyDetailTab === 'contacts'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Contacts</span>
                  </button>
                  <button
                    onClick={() => setCompanyDetailTab('details')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      companyDetailTab === 'details'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <BuildingOfficeIcon className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                  <button
                    onClick={() => setCompanyDetailTab('activities')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      companyDetailTab === 'activities'
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span>Activities</span>
                  </button>
                  <button
                    onClick={() => setCompanyDetailTab('notes')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      companyDetailTab === 'notes'
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
                {companyDetailTab === 'contacts' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Company Contacts</h3>
                    {contacts.length > 0 ? (
                      <div className="space-y-2">
                        {contacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={(e) => handleContactRowClick(contact, e)}
                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {contact.first_name?.[0]}{contact.last_name?.[0]}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {contact.first_name} {contact.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{contact.email}</div>
                                {contact.phone && (
                                  <div className="text-sm text-gray-500">{contact.phone}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContactStatusColor(contact.status)}`}>
                                  {contact.status}
                                </span>
                                <div className="flex items-center">
                                  <span className={`text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                                    {contact.lead_score || 0}
                                  </span>
                                </div>
                              </div>
                              <button
                                className="menu-button p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                onClick={(e) => handleContactMenuClick(e, contact)}
                              >
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <UserIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-sm">No contacts for this company</p>
                      </div>
                    )}
                  </div>
                )}

                {companyDetailTab === 'details' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
                      {!bulkEditing ? (
                        <button
                          onClick={startBulkEditing}
                          className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={saveBulkChanges}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelBulkEditing}
                            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Company Name</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <input
                              type="text"
                              value={selectedCompany.name || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, name: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-900">{selectedCompany.name || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Industry</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <input
                              type="text"
                              value={selectedCompany.industry || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, industry: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-900">{selectedCompany.industry || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Size</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <input
                              type="text"
                              value={selectedCompany.size || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, size: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-900">{selectedCompany.size || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Website</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <input
                              type="url"
                              value={selectedCompany.website || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, website: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="https://example.com"
                            />
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-900">
                                {selectedCompany.website ? (
                                  <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {selectedCompany.website}
                                  </a>
                                ) : 'Not set'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Phone</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <input
                              type="tel"
                              value={selectedCompany.phone || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, phone: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-900">{selectedCompany.phone || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Address</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <textarea
                              value={selectedCompany.address || ''}
                              onChange={(e) => setSelectedCompany({...selectedCompany, address: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              rows={2}
                            />
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <p className="text-sm text-gray-900">{selectedCompany.address || 'Not set'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-medium text-gray-700 min-w-[120px]">Status</span>
                        <div className="flex-1 ml-4">
                          {bulkEditing ? (
                            <select
                              value={selectedCompany.status || 'active'}
                              onChange={(e) => setSelectedCompany({...selectedCompany, status: e.target.value})}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="prospect">Prospect</option>
                            </select>
                          ) : (
                            <div className="flex-1 px-3 py-1 bg-gray-100 rounded-md">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCompany.status || 'active')}`}>
                                {selectedCompany.status || 'active'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {companyDetailTab === 'activities' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Activities</h3>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ClockIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">No activities yet</p>
                    </div>
                  </div>
                )}

                {companyDetailTab === 'notes' && (
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
                  onClick={() => handleDelete(selectedCompany.id)}
                  className="px-4 py-2 text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                >
                  Delete Company
                </button>
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
    </div>
  );
} 