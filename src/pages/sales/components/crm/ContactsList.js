import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  FunnelIcon,
  StarIcon, 
  PencilIcon, 
  TrashIcon, 
  EllipsisVerticalIcon, 
  XMarkIcon, 
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  LinkIcon,
  ClockIcon,
  DocumentTextIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { getCrmContacts, createCrmContact, updateCrmContact, deleteCrmContact, getCrmCompanies } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';
import ContactDetail from './ContactDetail';

const ContactCard = ({ contact, companies, onView, onEdit, onDelete }) => {
  const getCompanyName = (company_id) => {
    const company = companies.find(c => c.id === company_id);
    return company ? company.name : 'No Company';
  };

  const getStatusColor = (status) => {
    const colors = {
      prospect: 'bg-blue-100 text-blue-800 border-blue-200',
      lead: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      customer: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.prospect;
  };

  const getLeadScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getInitials = () => {
    const first = contact.first_name?.[0] || '';
    const last = contact.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">{getInitials()}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {contact.first_name} {contact.last_name}
              </h3>
              <p className="text-xs text-gray-500">{getCompanyName(contact.company_id)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getLeadScoreColor(contact.lead_score)}`}>
              <span className="text-xs font-bold">{contact.lead_score || 0}</span>
            </div>
            <div className="relative">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-3">
          {contact.email && (
            <div className="flex items-center space-x-2 text-xs">
              <EnvelopeIcon className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-2 text-xs">
              <PhoneIcon className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{contact.phone}</span>
            </div>
          )}
          {contact.position && (
            <div className="flex items-center space-x-2 text-xs">
              <TagIcon className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">{contact.position}</span>
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(contact.status)}`}>
            {contact.status}
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => onView(contact)}
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
            >
              <UserIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(contact.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactsTable = ({ contacts, companies, onView, onEdit, onDelete, sortField, sortDirection, onSort }) => {
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

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-left hover:text-purple-600 transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? 
        <ArrowUpIcon className="w-3 h-3" /> : 
        <ArrowDownIcon className="w-3 h-3" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortButton field="name">Contact</SortButton>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortButton field="company">Company</SortButton>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortButton field="status">Status</SortButton>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SortButton field="lead_score">Score</SortButton>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr 
              key={contact.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onView(contact)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">
                      {contact.first_name?.[0]}{contact.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{contact.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {getCompanyName(contact.company_id)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {contact.position || '-'}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-1">
                  <StarIcon className={`w-4 h-4 ${getLeadScoreColor(contact.lead_score)}`} />
                  <span className={`text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                    {contact.lead_score || 0}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(contact);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(contact.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ContactsList = forwardRef(({ hideHeader = false, ...props }, ref) => {
  const { currentOrganization } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteContactId, setDeleteContactId] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_id: '',
    position: '',
    status: 'prospect',
    lead_score: 50,
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contactsResponse, companiesResponse] = await Promise.all([
        getCrmContacts(currentOrganization.organization_id),
        getCrmCompanies(currentOrganization.organization_id)
      ]);
      
      setContacts(contactsResponse.data || []);
      setCompanies(companiesResponse.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentOrganization?.organization_id) {
      loadData();
    }
  }, [currentOrganization?.organization_id]);

  useImperativeHandle(ref, () => ({
    refresh: loadData,
    openEdit: openContactModal
  }));

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = `${contact.first_name} ${contact.last_name} ${contact.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesCompany = companyFilter === 'all' || contact.company_id === companyFilter;
    
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'name':
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
        break;
      case 'company':
        const aCompany = companies.find(c => c.id === a.company_id);
        const bCompany = companies.find(c => c.id === b.company_id);
        aValue = aCompany ? aCompany.name.toLowerCase() : '';
        bValue = bCompany ? bCompany.name.toLowerCase() : '';
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'lead_score':
        aValue = a.lead_score || 0;
        bValue = b.lead_score || 0;
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const contactData = {
        ...form,
        lead_score: parseInt(form.lead_score),
        company_id: form.company_id || null
      };

      if (editingContact) {
        await updateCrmContact(editingContact.id, contactData);
      } else {
        await createCrmContact(currentOrganization.organization_id, contactData);
      }

      await loadData();
      setIsModalOpen(false);
      setEditingContact(null);
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_id: '',
        position: '',
        status: 'prospect',
        lead_score: 50,
        notes: ''
      });
    } catch (err) {
      console.error('Error saving contact:', err);
      setError('Failed to save contact. Please try again.');
    }
  };

  const handleDelete = async (contactId) => {
    setDeleteContactId(contactId);
  };

  const confirmDelete = async () => {
    try {
      await deleteCrmContact(deleteContactId);
      await loadData();
      setDeleteContactId(null);
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact. Please try again.');
    }
  };

  const openContactModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setForm({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company_id: contact.company_id || '',
        position: contact.position || '',
        status: contact.status || 'prospect',
        lead_score: contact.lead_score || 50,
        notes: contact.notes || ''
      });
    } else {
      setEditingContact(null);
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_id: '',
        position: '',
        status: 'prospect',
        lead_score: 50,
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your contact database</p>
          </div>
          <button
            onClick={() => openContactModal()}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Contact
          </button>
        </div>
      )}

      {/* Filters */}
      {!hideHeader && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="prospect">Prospect</option>
                <option value="lead">Lead</option>
                <option value="customer">Customer</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Companies</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'table' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm font-medium ${
                    viewMode === 'cards' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {sortedContacts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || companyFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Get started by adding your first contact'
            }
          </p>
          <button
            onClick={() => openContactModal()}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Contact
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <ContactsTable
              contacts={sortedContacts}
              companies={companies}
              onView={handleViewContact}
              onEdit={openContactModal}
              onDelete={handleDelete}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  companies={companies}
                  onView={handleViewContact}
                  onEdit={openContactModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        editing={editingContact}
        form={form}
        setForm={setForm}
        companies={companies}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
      />

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        companies={companies}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContact(null);
        }}
        onEdit={openContactModal}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      {deleteContactId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Contact</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this contact? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteContactId(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

// Contact Detail Modal Component
const ContactDetailModal = ({ contact, companies, onClose, onEdit, onDelete }) => {
  if (!contact) return null;

  const getCompanyName = (company_id) => {
    const company = companies.find(c => c.id === company_id);
    return company ? company.name : 'No Company';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {contact.first_name?.[0]}{contact.last_name?.[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {contact.first_name} {contact.last_name}
                </h2>
                <p className="text-purple-100">{getCompanyName(contact.company_id)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{contact.email}</p>
                  </div>
                </div>

                {contact.phone && (
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{contact.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-gray-900">{getCompanyName(contact.company_id)}</p>
                  </div>
                </div>

                {contact.position && (
                  <div className="flex items-center space-x-3">
                    <TagIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-gray-900">{contact.position}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Status & Metrics</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Lead Score</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${contact.lead_score || 0}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                      {contact.lead_score || 0}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="text-gray-900">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between">
            <button
              onClick={() => onDelete(contact.id)}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
              Delete Contact
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => onEdit(contact)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Edit Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Form Modal Component
const ContactFormModal = ({ isOpen, editing, form, setForm, companies, onSubmit, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {editing ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => setForm({...form, first_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => setForm({...form, last_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <select
                  value={form.company_id}
                  onChange={(e) => setForm({...form, company_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={form.position}
                  onChange={(e) => setForm({...form, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="prospect">Prospect</option>
                  <option value="lead">Lead</option>
                  <option value="customer">Customer</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Score: {form.lead_score}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.lead_score}
                  onChange={(e) => setForm({...form, lead_score: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Add any additional notes about this contact..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                {editing ? 'Update' : 'Create'} Contact
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactsList; 