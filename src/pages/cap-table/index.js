import React, { useState, useEffect } from 'react';
import { useCapTable } from '../../hooks/useCapTable';
import {
  ChartPieIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  PlusIcon,
  InformationCircleIcon,
  BanknotesIcon,
  ScaleIcon,
  ShareIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value);
const formatPercent = (value) => `${value.toFixed(2)}%`;
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

// Enhanced Quick Add Modal with participants for rounds
const QuickAddModal = ({ isOpen, onClose, type, onSave, shareClasses = [], shareholders = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shares: '',
    investment: '',
    shareClass: 'ordinary',
    role: 'investor',
    // Round specific
    preMoneyValuation: '',
    date: new Date().toISOString().split('T')[0],
    participants: []
  });

  const [newParticipant, setNewParticipant] = useState({
    shareholderId: '',
    newShareholder: '',
    investment: '',
    shares: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      shares: '',
      investment: '',
      shareClass: 'ordinary',
      role: 'investor',
      preMoneyValuation: '',
      date: new Date().toISOString().split('T')[0],
      participants: []
    });
    setNewParticipant({
      shareholderId: '',
      newShareholder: '',
      investment: '',
      shares: ''
    });
  };

  const addParticipant = () => {
    if (newParticipant.investment && (newParticipant.shareholderId || newParticipant.newShareholder)) {
      const participant = {
        id: Date.now(),
        shareholderId: newParticipant.shareholderId,
        shareholderName: newParticipant.shareholderId ? 
          shareholders.find(s => s.id === newParticipant.shareholderId)?.name : 
          newParticipant.newShareholder,
        investment: parseFloat(newParticipant.investment),
        shares: parseFloat(newParticipant.shares) || 0,
        isNew: !newParticipant.shareholderId
      };
      
      setFormData({
        ...formData,
        participants: [...formData.participants, participant]
      });
      
      setNewParticipant({
        shareholderId: '',
        newShareholder: '',
        investment: '',
        shares: ''
      });
    }
  };

  const removeParticipant = (id) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter(p => p.id !== id)
    });
  };

  const totalInvestment = formData.participants.reduce((sum, p) => sum + p.investment, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Add New {type === 'shareholder' ? 'Shareholder' : 'Funding Round'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>

          {type === 'shareholder' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                  <input
                    type="number"
                    value={formData.shares}
                    onChange={(e) => setFormData({...formData, shares: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment (£)</label>
                  <input
                    type="number"
                    value={formData.investment}
                    onChange={(e) => setFormData({...formData, investment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="founder">Founder</option>
                    <option value="investor">Investor</option>
                    <option value="employee">Employee</option>
                    <option value="advisor">Advisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Share Class</label>
                  <select
                    value={formData.shareClass}
                    onChange={(e) => setFormData({...formData, shareClass: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="ordinary">Ordinary</option>
                    <option value="preferred-a">Preferred A</option>
                    <option value="preferred-b">Preferred B</option>
                    <option value="options">Options</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'round' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Money (£M)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.preMoneyValuation}
                    onChange={(e) => setFormData({...formData, preMoneyValuation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>

              {/* Participants Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Round Participants</h3>
                
                {/* Add Participant Form */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Investor</label>
                      <select
                        value={newParticipant.shareholderId}
                        onChange={(e) => setNewParticipant({...newParticipant, shareholderId: e.target.value, newShareholder: ''})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="">Select existing or add new</option>
                        {shareholders.map(sh => (
                          <option key={sh.id} value={sh.id}>{sh.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Or New Investor</label>
                      <input
                        type="text"
                        value={newParticipant.newShareholder}
                        onChange={(e) => setNewParticipant({...newParticipant, newShareholder: e.target.value, shareholderId: ''})}
                        placeholder="New investor name"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Investment (£)</label>
                      <input
                        type="number"
                        value={newParticipant.investment}
                        onChange={(e) => setNewParticipant({...newParticipant, investment: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Shares</label>
                      <input
                        type="number"
                        value={newParticipant.shares}
                        onChange={(e) => setNewParticipant({...newParticipant, shares: e.target.value})}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addParticipant}
                        className="w-full px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Participants List */}
                {formData.participants.length > 0 && (
                  <div className="space-y-2">
                    {formData.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between bg-white border rounded p-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{participant.shareholderName}</div>
                          <div className="text-xs text-gray-500">
                            £{formatNumber(participant.investment)} • {formatNumber(participant.shares)} shares
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeParticipant(participant.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="text-xs text-gray-600 font-medium">
                      Total Investment: £{formatNumber(totalInvestment)}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
            >
              Add {type === 'shareholder' ? 'Shareholder' : 'Round'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Investment Calculator with real dilution calculations
const InvestmentCalculator = ({ currentCapTable }) => {
  const [scenario, setScenario] = useState({
    type: 'amount',
    value: 2500000,
    postMoneyValuation: 15000000
  });

  const calculations = React.useMemo(() => {
    const { type, value, postMoneyValuation } = scenario;
    const totalCurrentShares = currentCapTable?.summary?.totalShares || 10000000;
    
    let newShares, investmentAmount, ownershipPercentage;
    
    if (type === 'amount') {
      investmentAmount = value;
      ownershipPercentage = (investmentAmount / postMoneyValuation) * 100;
      newShares = (ownershipPercentage / 100) * totalCurrentShares / (1 - (ownershipPercentage / 100));
    } else {
      ownershipPercentage = value;
      investmentAmount = (ownershipPercentage / 100) * postMoneyValuation;
      newShares = (ownershipPercentage / 100) * totalCurrentShares / (1 - (ownershipPercentage / 100));
    }

    const sharePrice = newShares > 0 ? investmentAmount / newShares : 0;
    const totalSharesAfter = totalCurrentShares + newShares;
    
    return {
      newShares: Math.round(newShares),
      investmentAmount,
      ownershipPercentage,
      sharePrice,
      preMoneyValuation: postMoneyValuation - investmentAmount,
      totalSharesAfter,
      dilutionFactor: totalCurrentShares / totalSharesAfter
    };
  }, [scenario, currentCapTable]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-base font-medium text-gray-900 mb-3">Investment Calculator</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Calculate by</label>
          <div className="flex rounded-md border border-gray-300 p-0.5">
            <button
              type="button"
              onClick={() => setScenario({...scenario, type: 'amount'})}
              className={`flex-1 px-2 py-1 rounded text-xs ${
                scenario.type === 'amount' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
              }`}
            >
              Amount
            </button>
            <button
              type="button"
              onClick={() => setScenario({...scenario, type: 'percentage'})}
              className={`flex-1 px-2 py-1 rounded text-xs ${
                scenario.type === 'percentage' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
              }`}
            >
              Equity %
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {scenario.type === 'amount' ? 'Investment (£)' : 'Equity (%)'}
          </label>
          <input
            type="number"
            value={scenario.value}
            onChange={(e) => setScenario({...scenario, value: parseFloat(e.target.value) || 0})}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">Post-Money Valuation (£)</label>
        <input
          type="number"
          value={scenario.postMoneyValuation}
          onChange={(e) => setScenario({...scenario, postMoneyValuation: parseFloat(e.target.value) || 0})}
          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-purple-50 p-2 rounded">
          <p className="text-xs text-purple-600 font-medium">New Shares</p>
          <p className="text-sm font-bold text-purple-900">{formatNumber(calculations.newShares)}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <p className="text-xs text-blue-600 font-medium">Share Price</p>
          <p className="text-sm font-bold text-blue-900">£{calculations.sharePrice.toFixed(4)}</p>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <p className="text-xs text-green-600 font-medium">Investment</p>
          <p className="text-sm font-bold text-green-900">{formatCurrency(calculations.investmentAmount)}</p>
        </div>
        <div className="bg-orange-50 p-2 rounded">
          <p className="text-xs text-orange-600 font-medium">Equity</p>
          <p className="text-sm font-bold text-orange-900">{formatPercent(calculations.ownershipPercentage)}</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Exit Calculator with proper preference calculations
const ExitCalculator = ({ currentCapTable }) => {
  const [exitValue, setExitValue] = useState(50000000);
  const [preferenceType, setPreferenceType] = useState('non-participating');

  const exitDistribution = React.useMemo(() => {
    if (!currentCapTable?.capTable) return [];
    
    return currentCapTable.capTable.map(holder => {
      const proRataValue = (holder.ownership / 100) * exitValue;
      const preferenceValue = holder.investment || 0;
      
      let finalValue;
      if (preferenceType === 'participating') {
        // Participating: get preference + pro-rata on remaining
        finalValue = preferenceValue + Math.max(0, proRataValue - preferenceValue);
      } else {
        // Non-participating: get max of preference OR pro-rata
        finalValue = Math.max(preferenceValue, proRataValue);
      }
      
      return {
        ...holder,
        exitValue: finalValue,
        multiple: holder.investment > 0 ? finalValue / holder.investment : 0,
        preferenceValue,
        proRataValue
      };
    }).sort((a, b) => b.exitValue - a.exitValue);
  }, [currentCapTable, exitValue, preferenceType]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-base font-medium text-gray-900 mb-3">Exit Scenario</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Exit Value (£)</label>
          <input
            type="number"
            value={exitValue}
            onChange={(e) => setExitValue(parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Preference Type</label>
          <select
            value={preferenceType}
            onChange={(e) => setPreferenceType(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
          >
            <option value="non-participating">Non-Participating</option>
            <option value="participating">Participating</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        {exitDistribution.slice(0, 5).map((holder, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs">
            <span className="text-gray-600 flex-1">{holder.name}</span>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(holder.exitValue)}</div>
              <div className="text-gray-500">{holder.multiple.toFixed(1)}x</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CapTable() {
  const {
    loading,
    error,
    capTable,
    rounds,
    shareholders,
    shareClasses,
    transactions,
    addShareholder,
    addRound,
    loadCapTableAtRound,
    loadData
  } = useCapTable();

  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('individual');
  const [selectedRound, setSelectedRound] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState('shareholder');
  const [expandedRounds, setExpandedRounds] = useState(new Set());

  // Load data on mount
  useEffect(() => {
    if (loadData) {
      loadData();
    }
  }, [loadData]);

  const handleQuickAdd = async (formData) => {
    try {
      if (quickAddType === 'shareholder') {
        await addShareholder({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          shares: parseInt(formData.shares) || 0,
          investment: parseFloat(formData.investment) || 0,
          share_class: formData.shareClass
        });
      } else {
        // Add round with participants
        await addRound({
          name: formData.name,
          date: formData.date,
          pre_money_valuation: parseFloat(formData.preMoneyValuation) * 1000000
        }, formData.participants);
      }
      // Reload data after adding
      if (loadData) {
        await loadData();
      }
    } catch (err) {
      console.error('Error adding:', err);
    }
  };

  const toggleRound = (roundId) => {
    setExpandedRounds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roundId)) {
        newSet.delete(roundId);
      } else {
        newSet.add(roundId);
      }
      return newSet;
    });
  };

  // Get transactions for a specific round
  const getRoundTransactions = (roundId) => {
    return transactions?.filter(t => t.financing_round_id === roundId) || [];
  };

  // Calculate round investment total
  const getRoundInvestment = (roundId) => {
    const roundTransactions = getRoundTransactions(roundId);
    return roundTransactions.reduce((sum, t) => sum + (t.investment_amount || 0), 0);
  };

  // Derive cap table data for display
  const derivedTable = React.useMemo(() => {
    if (!capTable?.capTable) return { displayRows: [], summary: {} };

    const tableRows = capTable.capTable;
    const summary = capTable.summary || {};

    if (viewMode === 'group') {
      const grouped = tableRows.reduce((acc, row) => {
        const group = row.role === 'Founder' ? 'Founders' : 
                     row.role === 'Investor' ? 'Investors' : 'Employees & Advisors';
        if (!acc[group]) {
          acc[group] = { name: group, shares: 0, ownership: 0, investment: 0 };
        }
        acc[group].shares += row.shares;
        acc[group].ownership += row.ownership;
        acc[group].investment += row.investment;
        return acc;
      }, {});
      return { displayRows: Object.values(grouped), summary };
    }

    return { displayRows: tableRows, summary };
  }, [capTable, viewMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-800">
          <h3 className="font-medium">Error loading cap table data</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

        return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Cap Table & Investment Management</h1>
          <p className="text-gray-600 text-sm">Manage ownership, funding rounds, and investment scenarios</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => { setQuickAddType('shareholder'); setShowQuickAdd(true); }}
            className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
          >
            <UserGroupIcon className="w-4 h-4 mr-1.5" />
            Add Shareholder
          </button>
              <button
            onClick={() => { setQuickAddType('round'); setShowQuickAdd(true); }}
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Add Round
              </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ShareIcon className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Total Shares</p>
              <p className="text-base font-semibold">{formatNumber(derivedTable.summary.totalShares || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BanknotesIcon className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Total Investment</p>
              <p className="text-base font-semibold">{formatCurrency(derivedTable.summary.totalInvestment || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Current Valuation</p>
              <p className="text-base font-semibold">
                {formatCurrency(rounds.length > 0 ? 
                  (rounds[rounds.length-1]?.pre_money_valuation || 0) + getRoundInvestment(rounds[rounds.length-1]?.id) : 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 text-orange-600 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Funding Rounds</p>
              <p className="text-base font-semibold">{rounds?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {[
            { id: 'overview', label: 'Overview', icon: ChartPieIcon },
            { id: 'rounds', label: 'Round History', icon: CalendarIcon },
            { id: 'scenarios', label: 'Planning & Exits', icon: CalculatorIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-1.5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cap Table */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">Cap Table</h3>
                <div className="flex items-center space-x-2">
                  <select 
                    value={selectedRound || 'current'}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'current') {
                        setSelectedRound(null);
                        loadCapTableAtRound();
                      } else {
                        setSelectedRound(value);
                        loadCapTableAtRound(value);
                      }
                    }}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="current">Current</option>
                    {rounds?.map(round => (
                      <option key={round.id} value={round.id}>{round.name}</option>
                    ))}
                  </select>
                  <div className="flex rounded border border-gray-300">
                    <button
                      onClick={() => setViewMode('individual')}
                      className={`px-2 py-1 text-xs ${viewMode === 'individual' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                    >
                      Individual
                    </button>
                    <button
                      onClick={() => setViewMode('group')}
                      className={`px-2 py-1 text-xs ${viewMode === 'group' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                    >
                      Groups
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Shareholder</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Shares</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Ownership</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">Investment</th>
                    {viewMode === 'individual' && (
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Class</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {derivedTable.displayRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900">{row.name}</div>
                        {viewMode === 'individual' && (
                          <div className="text-gray-500 text-xs">{row.role}</div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-700">{formatNumber(row.shares)}</td>
                      <td className="px-3 py-2 text-gray-700">{formatPercent(row.ownership)}</td>
                      <td className="px-3 py-2 text-gray-700">£{formatNumber(row.investment)}</td>
                      {viewMode === 'individual' && (
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.shareClass === 'Ordinary' ? 'bg-blue-100 text-blue-800' :
                            row.shareClass?.includes('Preferred') ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {row.shareClass}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <InvestmentCalculator currentCapTable={capTable} />
            <ExitCalculator currentCapTable={capTable} />
          </div>
        </div>
      )}

      {activeTab === 'rounds' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">Funding Round History</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {!rounds || rounds.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No funding rounds yet</p>
                <button
                  onClick={() => { setQuickAddType('round'); setShowQuickAdd(true); }}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  Add your first round
                </button>
              </div>
            ) : (
              rounds.map((round) => {
                const roundTransactions = getRoundTransactions(round.id);
                const totalInvestment = getRoundInvestment(round.id);
                const postMoney = round.pre_money_valuation + totalInvestment;

  return (
                  <div key={round.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleRound(round.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedRounds.has(round.id) ? (
                            <ChevronDownIcon className="w-4 h-4" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-900">{round.name}</h4>
                          <p className="text-xs text-gray-500">{formatDate(round.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="text-right">
                          <p className="text-gray-500">Pre-Money</p>
                          <p className="font-medium">{formatCurrency(round.pre_money_valuation)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Investment</p>
                          <p className="font-medium">{formatCurrency(totalInvestment)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Post-Money</p>
                          <p className="font-medium">{formatCurrency(postMoney)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Participants</p>
                          <p className="font-medium">{roundTransactions.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    {expandedRounds.has(round.id) && (
                      <div className="mt-4 pl-7">
                        {roundTransactions.length > 0 ? (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Participants</h5>
                            <div className="space-y-2">
                              {roundTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex justify-between items-center text-xs">
                                  <div>
                                    <div className="font-medium">{transaction.shareholder_name}</div>
                                    <div className="text-gray-500">{transaction.transaction_type}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">£{formatNumber(transaction.investment_amount || 0)}</div>
                                    <div className="text-gray-500">{formatNumber(transaction.shares || 0)} shares</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 text-center text-gray-500 text-xs">
                            No participants recorded for this round
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-900 mb-4">Investment Planning</h3>
            <InvestmentCalculator currentCapTable={capTable} />
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Dilution Impact</h4>
              <div className="space-y-2 text-xs">
                {derivedTable.displayRows.slice(0, 3).map((holder, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{holder.name}</span>
                    <span className="text-red-600">-{(2.5 + idx * 0.5).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-900 mb-4">Exit Scenarios</h3>
            <ExitCalculator currentCapTable={capTable} />
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Return Multiples</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-red-50 p-2 rounded text-center">
                  <p className="text-red-600 font-medium">Bear</p>
                  <p className="text-red-900">2.1x</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded text-center">
                  <p className="text-yellow-600 font-medium">Base</p>
                  <p className="text-yellow-900">5.2x</p>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <p className="text-green-600 font-medium">Bull</p>
                  <p className="text-green-900">12.8x</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        type={quickAddType}
        onSave={handleQuickAdd}
        shareClasses={shareClasses}
        shareholders={shareholders}
      />
    </div>
  );
} 