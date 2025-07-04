import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { MagnifyingGlassIcon, PlusIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, StarIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, ClockIcon, XMarkIcon, UserIcon } from '@heroicons/react/20/solid';
import { getCrmContacts, createCrmContact, updateCrmContact, deleteCrmContact, getCrmCompanies } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';
import ContactDetail from './ContactDetail';

const ContactsList = forwardRef(({ searchTerm, filterStatus }, ref) => {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [activeTab, setActiveTab] = useState('communication');
  const [editingField, setEditingField] = useState(null);
  const [bulkEditing, setBulkEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_id: '',
    position: '',
    lead_score: 50,
    status: 'prospect',
    notes: '',
    linkedin_url: '',
    twitter_url: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Expose openEdit function to parent component
  useImperativeHandle(ref, () => ({
    openEdit: (contact = null) => {
      setEditing(contact);
      if (contact) {
        setForm({
          first_name: contact.first_name || '',
          last_name: contact.last_name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          company_id: contact.company_id || '',
          position: contact.position || '',
          lead_score: contact.lead_score || 50,
          status: contact.status || 'prospect',
          notes: contact.notes || '',
          linkedin_url: contact.linkedin_url || '',
          twitter_url: contact.twitter_url || ''
        });
      } else {
        setForm({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          company_id: '',
          position: '',
          lead_score: 50,
          status: 'prospect',
          notes: '',
          linkedin_url: '',
          twitter_url: ''
        });
      }
      setShowModal(true);
    }
  }));

  useEffect(() => {
    if (!orgId) return;
    loadData();
  }, [orgId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contactsRes, companiesRes] = await Promise.all([
        getCrmContacts(orgId),
        getCrmCompanies(orgId)
      ]);
      setContacts(contactsRes.data || []);
      setCompanies(companiesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const getCompanyName = (company_id) => {
    const company = companies.find(c => c.id === company_id);
    return company ? company.name : '';
  };

  const getStatusColor = (status) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only send DB-valid fields
    const dbFields = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      company_id: form.company_id || null,
      status: form.status,
      notes: form.notes
    };
    try {
      if (editing) {
        await updateCrmContact(editing.id, dbFields);
      } else {
        await createCrmContact(orgId, dbFields);
      }
      setShowModal(false);
      setEditing(null);
      loadData();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error saving contact');
    }
  };

  const handleDelete = async (contactId) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCrmContact(contactToDelete);
      setShowDeleteModal(false);
      setContactToDelete(null);
      loadData();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const openContactDetail = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactDetail = () => {
    setSelectedContact(null);
    setEditingField(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeContactDetail();
    }
  };

  const startEditing = (field) => {
    setEditingField(field);
  };

  const saveField = async (field, value) => {
    if (!selectedContact) return;
    
    try {
      const updatedContact = { ...selectedContact, [field]: value };
      await updateCrmContact(selectedContact.id, { [field]: value });
      setSelectedContact(updatedContact);
      setEditingField(null);
      // Refresh the contacts list
      loadData();
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
    if (!selectedContact) return;
    
    try {
      // Save all changes at once
      await updateCrmContact(selectedContact.id, selectedContact);
      setBulkEditing(false);
      // Refresh the contacts list
      loadData();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Error updating contact');
    }
  };

  const cancelBulkEditing = () => {
    setBulkEditing(false);
    // Reset to original values if needed
    setSelectedContact(selectedContact);
  };

  const filteredContacts = contacts.filter(contact => {
    const search = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (contact.first_name || '').toLowerCase().includes(search) ||
      (contact.last_name || '').toLowerCase().includes(search) ||
      (contact.email || '').toLowerCase().includes(search) ||
      (getCompanyName(contact.company_id) || '').toLowerCase().includes(search);
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRowClick = (contact, e) => {
    // Don't open detail if clicking on the menu button
    if (e.target.closest('.menu-button')) {
      return;
    }
    openContactDetail(contact);
  };

  const handleMenuClick = (e, contact) => {
    e.stopPropagation();
    // Handle menu actions here
    console.log('Menu clicked for:', contact);
  };

  const EditableField = ({ label, value, field, type = 'text', options = null }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center flex-1">
        <label className="text-sm font-bold text-gray-700 w-24 flex-shrink-0">{label}</label>
        {(editingField === field || bulkEditing) ? (
          <div className="flex items-center space-x-2 flex-1">
            {type === 'select' ? (
              <select
                value={value || ''}
                onChange={(e) => {
                  if (bulkEditing) {
                    setSelectedContact({ ...selectedContact, [field]: e.target.value });
                  } else {
                    saveField(field, e.target.value);
                  }
                }}
                onBlur={() => !bulkEditing && setEditingField(null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                autoFocus={!bulkEditing}
              >
                {options?.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={value || ''}
                onChange={(e) => {
                  if (bulkEditing) {
                    setSelectedContact({ ...selectedContact, [field]: e.target.value });
                  } else {
                    saveField(field, e.target.value);
                  }
                }}
                onBlur={() => !bulkEditing && setEditingField(null)}
                onKeyDown={(e) => {
                  if (!bulkEditing) {
                    handleKeyPress(e, field, e.target.value);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                autoFocus={!bulkEditing}
              />
            )}
          </div>
        ) : (
          <div className="flex-1 px-3 py-2 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-900">{value || 'Not set'}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Main Table */}
      <div className="bg-white rounded-md overflow-hidden">
        {filteredContacts.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  onClick={(e) => handleRowClick(contact, e)}
                  className={`cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id 
                      ? 'bg-purple-50' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {contact.first_name?.[0]}{contact.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500">{contact.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCompanyName(contact.company_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contact.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StarIcon className={`h-4 w-4 ${getLeadScoreColor(contact.lead_score)}`} />
                      <span className={`ml-1 text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                        {contact.lead_score || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="menu-button p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      onClick={(e) => handleMenuClick(e, contact)}
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
            <UserIcon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first contact'
              }
            </p>
            <button
              onClick={() => {
                setEditing(null);
                setForm({
                  first_name: '',
                  last_name: '',
                  email: '',
                  phone: '',
                  company_id: '',
                  position: '',
                  lead_score: 50,
                  status: 'prospect',
                  notes: '',
                  linkedin_url: '',
                  twitter_url: ''
                });
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Contact
            </button>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleBackdropClick}>
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
                  <p className="text-sm text-gray-600">{getCompanyName(selectedContact.company_id)}</p>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('communication')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'communication'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Communication</span>
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'details'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Details</span>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'notes'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Notes</span>
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === 'activities'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <ClockIcon className="h-4 w-4" />
                  <span>Activities</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'communication' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Communication</h3>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No communication history yet</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
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
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">First Name</div>
                      <div className="text-gray-900 font-medium">{selectedContact.first_name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Last Name</div>
                      <div className="text-gray-900 font-medium">{selectedContact.last_name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Email</div>
                      <div className="text-gray-900 font-medium">{selectedContact.email || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Phone</div>
                      <div className="text-gray-900 font-medium">{selectedContact.phone || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Position</div>
                      <div className="text-gray-900 font-medium">{selectedContact.position || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Status</div>
                      <div className="text-gray-900 font-medium capitalize">{selectedContact.status || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Lead Score</div>
                      <div className="text-gray-900 font-medium">{selectedContact.lead_score ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Company</div>
                      <div className="text-gray-900 font-medium">{getCompanyName(selectedContact.company_id) || '-'}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                  {selectedContact.notes ? (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                      <p className="text-gray-500">{selectedContact.notes}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">No notes available</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'activities' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Activities</h3>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClockIcon className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm">No activities yet</p>
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

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editing ? 'Edit Contact' : 'Add New Contact'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({...form, first_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({...form, last_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <select
                    value={form.company_id}
                    onChange={(e) => setForm({...form, company_id: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({...form, position: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="prospect">Prospect</option>
                    <option value="lead">Lead</option>
                    <option value="customer">Company</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lead Score (0-100)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.lead_score}
                    onChange={(e) => setForm({...form, lead_score: parseInt(e.target.value)})}
                    className="mt-1 block w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">{form.lead_score}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => setForm({...form, linkedin_url: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditing(null); }}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700"
                >
                  {editing ? 'Update' : 'Create'} Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Contact</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this contact? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ContactsList; 