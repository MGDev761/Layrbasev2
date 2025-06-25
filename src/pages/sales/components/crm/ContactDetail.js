import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, GlobeAltIcon, StarIcon, PencilIcon, PlusIcon, CalendarIcon, ChatBubbleLeftIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import { getCrmContact, updateCrmContact, getCrmCompanies, getCrmActivities, createCrmActivity, updateCrmActivity, deleteCrmActivity } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';

const ContactDetail = ({ contactId, onBack }) => {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [contact, setContact] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [newNote, setNewNote] = useState('');
  const [activities, setActivities] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({ type: 'task', title: '', description: '', due_date: '', status: 'open', company_id: '' });

  useEffect(() => {
    if (!contactId || !orgId) return;
    loadContact();
    loadActivities();
  }, [contactId, orgId]);

  const loadContact = async () => {
    setLoading(true);
    try {
      const [contactRes, companiesRes] = await Promise.all([
        getCrmContact(contactId),
        getCrmCompanies(orgId)
      ]);
      setContact(contactRes.data);
      setCompanies(companiesRes.data || []);
      setForm(contactRes.data);
    } catch (error) {
      console.error('Error loading contact:', error);
    }
    setLoading(false);
  };

  const loadActivities = async () => {
    if (!contactId || !orgId) return;
    const { data } = await getCrmActivities(orgId);
    setActivities((data || []).filter(a => a.contact_id === contactId));
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

  const handleSave = async () => {
    try {
      await updateCrmContact(contactId, form);
      setContact(form);
      setEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Error updating contact');
    }
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    // TODO: Implement notes functionality
    setNewNote('');
  };

  const openActivityModal = (activity) => {
    setEditingActivity(activity);
    setActivityForm(activity ? {
      type: activity.type || 'task',
      title: activity.title || '',
      description: activity.description || '',
      due_date: activity.due_date ? activity.due_date.slice(0, 16) : '',
      status: activity.status || 'open',
      company_id: activity.company_id || ''
    } : { type: 'task', title: '', description: '', due_date: '', status: 'open', company_id: '' });
    setShowActivityModal(true);
  };

  const closeActivityModal = () => { setShowActivityModal(false); setEditingActivity(null); };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    const payload = { ...activityForm, due_date: activityForm.due_date ? new Date(activityForm.due_date).toISOString() : null, contact_id: contactId };
    if (editingActivity) await updateCrmActivity(editingActivity.id, payload);
    else await createCrmActivity(orgId, payload);
    closeActivityModal();
    loadActivities();
  };

  const handleActivityDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      await deleteCrmActivity(id);
      loadActivities();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading contact...</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Contact not found</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'communication', name: 'Communication', icon: ChatBubbleLeftIcon },
    { id: 'notes', name: 'Notes', icon: DocumentTextIcon },
    { id: 'activities', name: 'Activities', icon: CalendarIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {contact.first_name} {contact.last_name}
            </h2>
            <p className="text-gray-600">{contact.position} at {getCompanyName(contact.company_id)}</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PencilIcon className="h-4 w-4" />
          <span>{editing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {/* Contact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <StarIcon className={`h-5 w-5 ${getLeadScoreColor(contact.lead_score)}`} />
            <span className={`ml-2 text-lg font-bold ${getLeadScoreColor(contact.lead_score)}`}>
              {contact.lead_score || 0}
            </span>
          </div>
          <div className="text-sm text-gray-600">Lead Score</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-lg font-bold text-gray-900">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
              {contact.status}
            </span>
          </div>
          <div className="text-sm text-gray-600">Status</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-lg font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Activities</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-lg font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Notes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {editing ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        value={form.first_name || ''}
                        onChange={(e) => setForm({...form, first_name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        value={form.last_name || ''}
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
                        value={form.email || ''}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={form.phone || ''}
                        onChange={(e) => setForm({...form, phone: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <select
                        value={form.company_id || ''}
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
                        value={form.position || ''}
                        onChange={(e) => setForm({...form, position: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={form.status || 'prospect'}
                        onChange={(e) => setForm({...form, status: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="prospect">Prospect</option>
                        <option value="lead">Lead</option>
                        <option value="customer">Customer</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Lead Score (0-100)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form.lead_score || 50}
                        onChange={(e) => setForm({...form, lead_score: parseInt(e.target.value)})}
                        className="mt-1 block w-full"
                      />
                      <div className="text-sm text-gray-500 mt-1">{form.lead_score || 50}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                    <input
                      type="url"
                      value={form.linkedin_url || ''}
                      onChange={(e) => setForm({...form, linkedin_url: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                      <div className="mt-4 space-y-3">
                        {contact.email && (
                          <div className="flex items-center space-x-3">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-900">{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center space-x-3">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-900">{contact.phone}</span>
                          </div>
                        )}
                        {contact.linkedin_url && (
                          <div className="flex items-center space-x-3">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                            <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center space-x-3">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{getCompanyName(contact.company_id)}</span>
                        </div>
                        {contact.position && (
                          <div className="text-gray-600 ml-8">{contact.position}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Lead Score:</span>
                          <div className="flex items-center">
                            <StarIcon className={`h-5 w-5 ${getLeadScoreColor(contact.lead_score)}`} />
                            <span className={`ml-1 font-medium ${getLeadScoreColor(contact.lead_score)}`}>
                              {contact.lead_score || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {contact.notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700">{contact.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Communication History</h3>
              <p className="text-gray-600">Track emails, calls, and meetings with this contact</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto">
                <PlusIcon className="h-4 w-4" />
                <span>Add Communication</span>
              </button>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Sample Note</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-gray-700">This is a sample note about the contact. You can add detailed notes here about conversations, preferences, or important information.</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={addNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-900">Activities</h3>
                <button onClick={() => openActivityModal(null)} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Activity</button>
              </div>
              {activities.length === 0 ? (
                <div className="text-gray-500">No activities for this contact.</div>
              ) : (
                <table className="min-w-full bg-white rounded shadow">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Due Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(a => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{a.type}</td>
                        <td className="px-4 py-2">{a.title}</td>
                        <td className="px-4 py-2">{a.due_date ? a.due_date.slice(0, 10) : ''}</td>
                        <td className="px-4 py-2">{a.status}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => openActivityModal(a)} className="text-blue-600 hover:underline mr-2">Edit</button>
                          <button onClick={() => handleActivityDelete(a.id)} className="text-red-500 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {showActivityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <form onSubmit={handleActivitySubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                      <div className="text-lg font-medium text-gray-900">{editingActivity ? 'Edit' : 'Add'} Activity</div>
                      <button type="button" onClick={closeActivityModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                    </div>
                    <div className="space-y-3">
                      <select className="w-full px-3 py-2 border rounded" value={activityForm.type} onChange={e => setActivityForm(f => ({ ...f, type: e.target.value }))} required>
                        <option value="task">Task</option>
                        <option value="call">Call</option>
                        <option value="meeting">Meeting</option>
                        <option value="reminder">Reminder</option>
                      </select>
                      <input className="w-full px-3 py-2 border rounded" placeholder="Title" value={activityForm.title} onChange={e => setActivityForm(f => ({ ...f, title: e.target.value }))} required />
                      <textarea className="w-full px-3 py-2 border rounded" placeholder="Description" value={activityForm.description} onChange={e => setActivityForm(f => ({ ...f, description: e.target.value }))} />
                      <input className="w-full px-3 py-2 border rounded" type="datetime-local" placeholder="Due Date" value={activityForm.due_date} onChange={e => setActivityForm(f => ({ ...f, due_date: e.target.value }))} />
                      <select className="w-full px-3 py-2 border rounded" value={activityForm.status} onChange={e => setActivityForm(f => ({ ...f, status: e.target.value }))} required>
                        <option value="open">Open</option>
                        <option value="done">Done</option>
                        <option value="snoozed">Snoozed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-8">
                      <button type="button" onClick={closeActivityModal} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Save</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple user icon component
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default ContactDetail; 