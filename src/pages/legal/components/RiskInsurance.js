import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon, ShieldCheckIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon, CurrencyPoundIcon, CalendarIcon, BuildingOfficeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { getInsurancePolicies, createInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const AddPolicyModal = ({ show, onClose, onSubmit, saving, newPolicy, setNewPolicy }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">Add Insurance Policy</h3>
          <p className="text-purple-100 text-sm mt-1">Add a new insurance policy to track coverage and renewals</p>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                placeholder="e.g., General Liability Insurance" 
                value={newPolicy.name} 
                onChange={e => setNewPolicy(p => ({ ...p, name: e.target.value }))} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                placeholder="e.g., Aviva, AXA" 
                value={newPolicy.provider} 
                onChange={e => setNewPolicy(p => ({ ...p, provider: e.target.value }))} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                placeholder="Policy reference number" 
                value={newPolicy.policyNumber} 
                onChange={e => setNewPolicy(p => ({ ...p, policyNumber: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Amount (£)</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                type="number" 
                placeholder="1000000" 
                value={newPolicy.coverageAmount} 
                onChange={e => setNewPolicy(p => ({ ...p, coverageAmount: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Premium (£)</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                type="number" 
                placeholder="1200" 
                value={newPolicy.premiumAmount} 
                onChange={e => setNewPolicy(p => ({ ...p, premiumAmount: e.target.value }))} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                type="date" 
                value={newPolicy.effectiveDate} 
                onChange={e => setNewPolicy(p => ({ ...p, effectiveDate: e.target.value }))} 
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                type="date" 
                value={newPolicy.expiryDate} 
                onChange={e => setNewPolicy(p => ({ ...p, expiryDate: e.target.value }))} 
                required 
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" 
                placeholder="Additional details about the policy (optional)" 
                rows={3} 
                value={newPolicy.notes} 
                onChange={e => setNewPolicy(p => ({ ...p, notes: e.target.value }))} 
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
            {saving ? 'Adding...' : 'Add Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RiskInsurance = () => {
  const { currentOrganization } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    provider: '',
    policyNumber: '',
    coverageAmount: '',
    premiumAmount: '',
    effectiveDate: '',
    expiryDate: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, [currentOrganization]);

  const loadPolicies = async () => {
    if (!currentOrganization?.organization_id) {
      console.warn('No organization_id found in currentOrganization:', currentOrganization);
      setPolicies([]);
      setLoading(false);
      return;
    }
    try {
      // Direct select instead of RPC
      const { data, error } = await supabase
        .from('legal_insurance_policies')
        .select('*')
        .eq('organization_id', currentOrganization.organization_id);
      console.log('Direct select policies:', data, error);
      const filtered = (data || []).filter(
        p => p.organization_id === currentOrganization.organization_id
      );
      setPolicies(filtered);
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    if (!newPolicy.name || !newPolicy.provider || !newPolicy.effectiveDate || !newPolicy.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const policyData = {
        name: newPolicy.name,
        provider: newPolicy.provider,
        policy_number: newPolicy.policyNumber || null,
        coverage_amount: newPolicy.coverageAmount ? parseFloat(newPolicy.coverageAmount) : null,
        premium_amount: newPolicy.premiumAmount ? parseFloat(newPolicy.premiumAmount) : null,
        effective_date: newPolicy.effectiveDate,
        expiry_date: newPolicy.expiryDate,
        notes: newPolicy.notes || null,
        organization_id: currentOrganization?.organization_id
      };

      await createInsurancePolicy(policyData);
      await loadPolicies();
      setNewPolicy({ 
        name: '', 
        provider: '', 
        policyNumber: '', 
        coverageAmount: '', 
        premiumAmount: '', 
        effectiveDate: '', 
        expiryDate: '', 
        notes: '' 
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding policy:', error);
      alert('Error adding policy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePolicy = async (id) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await deleteInsurancePolicy(id);
        await loadPolicies();
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Error deleting policy. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateInsurancePolicy(id, { status: newStatus });
      await loadPolicies();
    } catch (error) {
      console.error('Error updating policy status:', error);
      alert('Error updating policy status. Please try again.');
    }
  };

  const filteredPolicies = policies.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.policy_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status, isExpiringSoon) => {
    if (isExpiringSoon) {
      return { bg: 'bg-orange-100', text: 'text-orange-800', icon: ExclamationTriangleIcon };
    }
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon };
      case 'expired':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: ClockIcon };
      case 'cancelled':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon };
    }
  };

  const getPolicyIcon = (policyName) => {
    const name = policyName.toLowerCase();
    if (name.includes('liability') || name.includes('professional')) {
      return ShieldCheckIcon;
    }
    if (name.includes('property') || name.includes('building')) {
      return BuildingOfficeIcon;
    }
    return DocumentTextIcon;
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDaysText = (days) => {
    if (days < 0) return `${Math.abs(days)} days expired`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days remaining`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  // Stats calculation
  const totalPolicies = policies.length;
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const expiredPolicies = policies.filter(p => p.status === 'expired').length;
  const expiringSoonPolicies = policies.filter(p => {
    const days = getDaysUntilExpiry(p.expiry_date);
    return days >= 0 && days <= 30 && p.status === 'active';
  }).length;

  const totalCoverage = policies
    .filter(p => p.status === 'active' && p.coverage_amount)
    .reduce((sum, p) => sum + p.coverage_amount, 0);

  const totalPremiums = policies
    .filter(p => p.status === 'active' && p.premium_amount)
    .reduce((sum, p) => sum + p.premium_amount, 0);

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
          <h1 className="text-xl font-bold text-gray-900">Risk & Insurance</h1>
          <p className="text-sm text-gray-600 mt-1">Manage insurance policies and track coverage</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Policy
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">{totalPolicies}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">{activePolicies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{expiringSoonPolicies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Coverage</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCoverage)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CurrencyPoundIcon className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annual Premiums</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPremiums)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{expiredPolicies}</p>
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
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>
      </div>

      {/* Policies Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No policies found</h3>
            <p className="text-sm text-gray-500 mb-4">Get started by adding your first insurance policy</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add First Policy
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPolicies.map(policy => {
              const days = getDaysUntilExpiry(policy.expiry_date);
              const isExpiringSoon = days >= 0 && days <= 30 && policy.status === 'active';
              const statusBadge = getStatusBadge(policy.status, isExpiringSoon);
              const PolicyIcon = getPolicyIcon(policy.name);
              
              return (
                <div key={policy.id} className={`p-4 hover:bg-gray-50 transition-colors ${isExpiringSoon ? 'bg-orange-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isExpiringSoon ? 'bg-orange-100' : 'bg-gray-100'}`}>
                          <PolicyIcon className={`w-5 h-5 ${isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}`} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{policy.name}</h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            <statusBadge.icon className="w-3 h-3 mr-1" />
                            {policy.status === 'active' ? 'Active' : policy.status === 'expired' ? 'Expired' : 'Cancelled'}
                          </div>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>{policy.provider}</span>
                          {policy.policy_number && (
                            <>
                              <span>•</span>
                              <span>#{policy.policy_number}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(policy.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span className={isExpiringSoon ? 'text-orange-600 font-medium' : ''}>{formatDaysText(days)}</span>
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                          {policy.coverage_amount && (
                            <span>Coverage: {formatCurrency(policy.coverage_amount)}</span>
                          )}
                          {policy.premium_amount && (
                            <>
                              <span>•</span>
                              <span>Premium: {formatCurrency(policy.premium_amount)}</span>
                            </>
                          )}
                        </div>
                        
                        {policy.notes && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{policy.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={policy.status}
                        onChange={(e) => handleStatusChange(policy.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
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

      <AddPolicyModal
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddPolicy}
        saving={saving}
        newPolicy={newPolicy}
        setNewPolicy={setNewPolicy}
      />
    </div>
  );
};

export default RiskInsurance; 