import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, CalendarIcon, ExclamationTriangleIcon, CheckCircleIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { getComplianceDeadlines, createComplianceDeadline, updateComplianceDeadline, deleteComplianceDeadline } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const AddDeadlineModal = ({ show, onClose, onSubmit, saving, newDeadline, setNewDeadline }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Add Compliance Deadline</h3>
          <p className="text-purple-100 text-sm mt-1">Track important legal and regulatory deadlines</p>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline Name</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                placeholder="e.g., Annual Filing" 
                value={newDeadline.name} 
                onChange={e => setNewDeadline(d => ({ ...d, name: e.target.value }))} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                value={newDeadline.category} 
                onChange={e => setNewDeadline(d => ({ ...d, category: e.target.value }))}
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                type="date" 
                value={newDeadline.dueDate} 
                onChange={e => setNewDeadline(d => ({ ...d, dueDate: e.target.value }))} 
                required 
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                placeholder="Additional details (optional)" 
                rows={3} 
                value={newDeadline.description} 
                onChange={e => setNewDeadline(d => ({ ...d, description: e.target.value }))} 
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onSubmit} 
            disabled={saving} 
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Deadline'}
          </button>
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

  const getStatusBadge = (status, isOverdue) => {
    if (isOverdue) {
      return { bg: 'bg-red-100', text: 'text-red-800', icon: ExclamationTriangleIcon };
    }
    switch (status) {
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'annual_filing':
      case 'regulatory':
        return BuildingOfficeIcon;
      case 'tax_return':
        return CalendarIcon;
      default:
        return CalendarIcon;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDaysText = (days) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days remaining`;
  };

  // Stats calculation
  const totalDeadlines = deadlines.length;
  const completedDeadlines = deadlines.filter(d => d.status === 'completed').length;
  const overdueDeadlines = deadlines.filter(d => getDaysUntilDue(d.due_date) < 0 && d.status !== 'completed').length;
  const upcomingDeadlines = deadlines.filter(d => {
    const days = getDaysUntilDue(d.due_date);
    return days >= 0 && days <= 30 && d.status !== 'completed';
  }).length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Compliance Deadlines</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage legal and regulatory deadlines</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Deadline
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Deadlines</p>
              <p className="text-2xl font-bold text-gray-900">{totalDeadlines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedDeadlines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming (30d)</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingDeadlines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueDeadlines}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deadlines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Deadlines Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredDeadlines.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No deadlines found</h3>
            <p className="text-sm text-gray-500 mb-4">Get started by adding your first compliance deadline</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add First Deadline
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDeadlines.map(deadline => {
              const days = getDaysUntilDue(deadline.due_date);
              const isOverdue = days < 0 && deadline.status !== 'completed';
              const statusBadge = getStatusBadge(deadline.status, isOverdue);
              const CategoryIcon = getCategoryIcon(deadline.category);
              
              return (
                <div key={deadline.id} className={`p-4 hover:bg-gray-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <CategoryIcon className={`w-5 h-5 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{deadline.name}</h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            <statusBadge.icon className="w-3 h-3 mr-1" />
                            {deadline.status === 'completed' ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
                          </div>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{new Date(deadline.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>{formatDaysText(days)}</span>
                          {deadline.category && (
                            <>
                              <span>•</span>
                              <span>{deadline.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </>
                          )}
                        </div>
                        
                        {deadline.description && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{deadline.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={deadline.status}
                        onChange={(e) => handleStatusChange(deadline.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                      
                      <button
                        onClick={() => handleDeleteDeadline(deadline.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddDeadlineModal
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddDeadline}
        saving={saving}
        newDeadline={newDeadline}
        setNewDeadline={setNewDeadline}
      />
    </div>
  );
};

export default ComplianceDeadlines; 