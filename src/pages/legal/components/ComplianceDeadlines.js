import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getComplianceDeadlines, createComplianceDeadline, updateComplianceDeadline, deleteComplianceDeadline } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openSections, setOpenSections] = useState({
    basics: true,
    platform: false,
    ai: false
  });
  const toggleSection = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
  const [openContent, setOpenContent] = useState({
    intro: true,
    why: false,
    best: false
  });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({
    quick: true,
    tips: false,
    faq: false
  });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Compliance Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Compliance Basics
          </button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <Cog6ToothIcon className="w-5 h-5" /> Platform How-To
          </button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <ChatBubbleLeftRightIcon className="w-5 h-5" /> AI
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (
            <>
              {/* Introduction Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Introduction</span>
                  {openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.intro && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Compliance deadlines are critical dates for legal, regulatory, and business obligations. Staying on top of these deadlines helps your organization avoid penalties and maintain good standing.</p>
                  </div>
                )}
              </div>
              {/* Why It's Important Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Why It's Important</span>
                  {openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.why && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Missing deadlines can result in fines, legal action, or loss of business licenses.</li>
                      <li>Proactive compliance builds trust with stakeholders and regulators.</li>
                      <li>Good compliance processes reduce business risk and operational surprises.</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Best Practice Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Best Practice</span>
                  {openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.best && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Track all key legal and regulatory deadlines in one place.</li>
                      <li>Set reminders for upcoming filings and renewals.</li>
                      <li>Document compliance actions and keep records up to date.</li>
                      <li>Assign responsibility for each compliance item.</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          {tab === 'platform' && (
            <>
              {/* Quick Start Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Quick Start</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Click "Add New Deadline" to create your first compliance item.</li>
                      <li>Fill in the name, due date, and category.</li>
                      <li>Save and track your deadlines from the dashboard.</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Tips Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Tips</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use the search bar to quickly find deadlines by name or category.</li>
                      <li>Mark deadlines as complete to keep your dashboard up to date.</li>
                      <li>Export your deadlines for reporting or sharing with your team.</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">FAQ</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li><b>Can I edit a deadline after creating it?</b> Yes, click the deadline name to edit details.</li>
                      <li><b>How do I delete a deadline?</b> Click the trash icon next to the deadline in the list.</li>
                      <li><b>Can I get reminders?</b> Reminders are coming soon!</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          {tab === 'ai' && (
            <div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your compliance AI assistant. Ask me anything about deadlines, best practices, or the platform.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I add a new compliance deadline?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click "Add New Deadline" and fill in the details. You can set reminders and assign categories too!</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Type your question..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComplianceDeadlines = () => {
  const { currentOrganization } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ name: '', description: '', dueDate: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    loadDeadlines();
  }, [currentOrganization]);

  const loadDeadlines = async () => {
    if (!currentOrganization?.organization_id) {
      console.warn('No organization_id found in currentOrganization:', currentOrganization);
      setDeadlines([]);
      setLoading(false);
      return;
    }
    try {
      // TEMP: Direct select instead of RPC
      const { data, error } = await supabase
        .from('legal_compliance_deadlines')
        .select('*')
        .eq('organization_id', currentOrganization.organization_id);
      console.log('Current org ID:', currentOrganization.organization_id, typeof currentOrganization.organization_id);
      console.log('Fetched deadlines:', data);
      const filtered = (data || []).filter(
        d => d.organization_id === currentOrganization.organization_id
      );
      setDeadlines(filtered);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeadline = async (e) => {
    e.preventDefault();
    if (!newDeadline.name || !newDeadline.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const deadlineData = {
        name: newDeadline.name,
        description: newDeadline.description,
        due_date: newDeadline.dueDate,
        category: newDeadline.category || 'general',
        organization_id: currentOrganization?.organization_id
      };

      await createComplianceDeadline(deadlineData);
      await loadDeadlines();
      setNewDeadline({ name: '', description: '', dueDate: '', category: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding deadline:', error);
      alert('Error adding deadline. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeadline = async (id) => {
    if (window.confirm('Are you sure you want to delete this deadline?')) {
      try {
        await deleteComplianceDeadline(id);
        await loadDeadlines();
      } catch (error) {
        console.error('Error deleting deadline:', error);
        alert('Error deleting deadline. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplianceDeadline(id, { status: newStatus });
      await loadDeadlines();
    } catch (error) {
      console.error('Error updating deadline status:', error);
      alert('Error updating deadline status. Please try again.');
    }
  };

  const filteredDeadlines = deadlines.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status, isOverdue) => {
    if (isOverdue) return 'bg-red-100 text-red-800';
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDueText = (daysUntilDue, isOverdue) => {
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days ago`;
    return `${daysUntilDue} days remaining`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Compliance Deadlines</h2>
          <p className="text-gray-600 text-sm mb-6">Track upcoming legal and regulatory deadlines to stay compliant.</p>
        </div>
        <div className="text-center py-20">
          <p className="text-gray-500">Loading deadlines...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 mt-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Compliance Deadlines</h2>
          <p className="text-gray-600 text-sm mb-2">Track upcoming legal and regulatory deadlines to stay compliant.</p>
        </div>
        <button
          onClick={() => setShowInfoModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
          Help
        </button>
      </div>
      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />

      {/* Actions Bar - now visually attached to table */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 rounded-t-md px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deadlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-b-2 border-transparent focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {showAddForm ? 'Cancel' : 'Add New Deadline'}
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddForm(false)} />
          <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-medium text-gray-900">Add New Compliance Deadline</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleAddDeadline} className="flex-1 flex flex-col justify-center">
              <div className="flex-1 px-6 py-8 flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="deadlineName" className="block text-sm font-medium text-gray-700">Deadline Name *</label>
                    <input
                      type="text"
                      id="deadlineName"
                      value={newDeadline.name}
                      onChange={(e) => setNewDeadline({ ...newDeadline, name: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="deadlineCategory" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="deadlineCategory"
                      value={newDeadline.category}
                      onChange={(e) => setNewDeadline({ ...newDeadline, category: e.target.value })}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      <option value="">Select category</option>
                      <option value="annual_filing">Annual Filing</option>
                      <option value="tax_return">Tax Return</option>
                      <option value="regulatory">Regulatory</option>
                      <option value="contract_renewal">Contract Renewal</option>
                      <option value="insurance">Insurance</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newDeadline.dueDate}
                    onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={newDeadline.description}
                    onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Add any additional details about this deadline..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Deadline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table Container - flat, no border/shadow, rounded bottom only */}
      <div className="bg-white rounded-b-md overflow-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeadlines.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No deadlines found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDeadlines.map(deadline => (
                <tr key={deadline.id} className={deadline.is_overdue ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{deadline.name}</div>
                    {deadline.description && (
                      <div className="text-sm text-gray-500">{deadline.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(deadline.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getDaysUntilDueText(deadline.days_until_due, deadline.is_overdue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={deadline.status}
                      onChange={(e) => handleStatusChange(deadline.id, e.target.value)}
                      className={`text-sm font-medium rounded-full px-2.5 py-0.5 ${getStatusColor(deadline.status, deadline.is_overdue)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deadline.category ? deadline.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteDeadline(deadline.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceDeadlines; 