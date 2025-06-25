import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getInsurancePolicies, createInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

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

  const getStatusColor = (status, isExpiringSoon) => {
    if (isExpiringSoon) return 'bg-orange-100 text-orange-800';
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilExpiryText = (daysUntilExpiry, isExpiringSoon) => {
    if (daysUntilExpiry < 0) return `${Math.abs(daysUntilExpiry)} days expired`;
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    if (isExpiringSoon) return `${daysUntilExpiry} days remaining (expiring soon)`;
    return `${daysUntilExpiry} days remaining`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Risk & Insurance</h2>
          <p className="text-gray-600 text-sm mb-6">Manage your company's insurance policies and assess business risks.</p>
        </div>
        <div className="text-center py-20">
          <p className="text-gray-500">Loading policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Risk & Insurance</h2>
        <p className="text-gray-600 text-sm mb-6">Manage your company's insurance policies and assess business risks.</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-1 relative max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {showAddForm ? 'Cancel' : 'Add New Policy'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Insurance Policy</h3>
          <form onSubmit={handleAddPolicy} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="policyName" className="block text-sm font-medium text-gray-700">Policy Name *</label>
                <input
                  type="text"
                  id="policyName"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider *</label>
                <input
                  type="text"
                  id="provider"
                  value={newPolicy.provider}
                  onChange={(e) => setNewPolicy({ ...newPolicy, provider: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">Policy Number</label>
                <input
                  type="text"
                  id="policyNumber"
                  value={newPolicy.policyNumber}
                  onChange={(e) => setNewPolicy({ ...newPolicy, policyNumber: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700">Coverage Amount</label>
                <input
                  type="number"
                  id="coverageAmount"
                  value={newPolicy.coverageAmount}
                  onChange={(e) => setNewPolicy({ ...newPolicy, coverageAmount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="premiumAmount" className="block text-sm font-medium text-gray-700">Premium Amount</label>
                <input
                  type="number"
                  id="premiumAmount"
                  value={newPolicy.premiumAmount}
                  onChange={(e) => setNewPolicy({ ...newPolicy, premiumAmount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">Effective Date *</label>
                <input
                  type="date"
                  id="effectiveDate"
                  value={newPolicy.effectiveDate}
                  onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date *</label>
                <input
                  type="date"
                  id="expiryDate"
                  value={newPolicy.expiryDate}
                  onChange={(e) => setNewPolicy({ ...newPolicy, expiryDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                value={newPolicy.notes}
                onChange={(e) => setNewPolicy({ ...newPolicy, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional notes about this policy..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Policy'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPolicies.map(policy => (
              <tr key={policy.id} className={policy.is_expiring_soon ? 'bg-orange-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                  {policy.policy_number && (
                    <div className="text-sm text-gray-500">#{policy.policy_number}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.provider}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(policy.coverage_amount)}</div>
                  {policy.premium_amount && (
                    <div className="text-sm text-gray-500">Premium: {formatCurrency(policy.premium_amount)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(policy.expiry_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getDaysUntilExpiryText(policy.days_until_expiry, policy.is_expiring_soon)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={policy.status}
                    onChange={(e) => handleStatusChange(policy.id, e.target.value)}
                    className={`text-sm font-medium rounded-full px-2.5 py-0.5 ${getStatusColor(policy.status, policy.is_expiring_soon)}`}
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeletePolicy(policy.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No policies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskInsurance; 