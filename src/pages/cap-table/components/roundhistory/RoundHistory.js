import React, { useState } from 'react';
import { PlusIcon, ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useCapTable } from '../../../../hooks/useCapTable';
import AddShareClassForm from '../captable/AddShareClassForm';
import Modal from '../../../../components/common/layout/Modal';

const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const RoundHistory = ({ onAddRound }) => {
  const {
    rounds,
    shareholders,
    shareClasses,
    transactions,
    deleteRound,
    deleteTransaction,
    addRound,
    addShareClass,
    addShareholder,
    loading,
    error,
  } = useCapTable();

  const [expandedRounds, setExpandedRounds] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNewShareClassForm, setShowNewShareClassForm] = useState(false);
  const [showNewShareholderForm, setShowNewShareholderForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    pre_money_valuation: 0,
    share_class_id: '',
    option_pool_shares: 0,
  });
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({
    shareholder_id: '',
    investment_amount: 0,
    shares_issued: 0,
    preference_multiplier: 1
  });
  
  const toggleRound = (roundId) => {
    const newExpanded = new Set(expandedRounds);
    if (newExpanded.has(roundId)) {
      newExpanded.delete(roundId);
    } else {
      newExpanded.add(roundId);
    }
    setExpandedRounds(newExpanded);
  };

  const handleAddNewShareClass = async (shareClassData) => {
    try {
      const newShareClass = await addShareClass(shareClassData);
      setFormData(prev => ({ ...prev, share_class_id: newShareClass.id }));
      setShowNewShareClassForm(false);
    } catch (err) {
      console.error('Error adding new share class:', err);
      alert(`Failed to add share class: ${err.message}`);
    }
  };

  const handleAddNewShareholder = async (shareholderData) => {
    try {
      await addShareholder(shareholderData);
      setShowNewShareholderForm(false);
    } catch (err) {
      console.error('Error adding new shareholder:', err);
      alert(`Failed to add shareholder: ${err.message}`);
    }
  };

  const addParticipant = () => {
    if (newParticipant.shareholder_id && newParticipant.shares_issued > 0) {
      setParticipants([...participants, { ...newParticipant, id: Date.now() }]);
      setNewParticipant({
        shareholder_id: '',
        investment_amount: 0,
        shares_issued: 0,
        preference_multiplier: 1
      });
    }
  };

  const removeParticipant = (participantId) => {
    setParticipants(participants.filter(p => p.id !== participantId));
  };
  
  const handleAddRound = async (e) => {
    e.preventDefault();
    try {
      const participantsToSend = participants.filter(p => p.shareholder_id && p.investment_amount > 0);
      if (participantsToSend.length === 0) {
        alert("Please add at least one participant with an investment amount.");
        return;
      }
      const newRoundId = await addRound(formData, participantsToSend);
      setShowAddForm(false);
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        pre_money_valuation: 0,
        share_class_id: '',
        option_pool_shares: 0,
      });
      setParticipants([]);
      if(newRoundId) {
        setExpandedRounds(new Set([newRoundId]));
      }
    } catch (err) {
      console.error('Error adding round:', err);
      alert(`Error adding round: ${err.message}`);
    }
  };

  const handleDeleteRound = async (roundId) => {
    if (window.confirm('Are you sure you want to delete this round? This will also delete all associated transactions.')) {
      try {
        const roundTransactions = transactions.filter(t => t.round_id === roundId);
        for (const transaction of roundTransactions) {
          await deleteTransaction(transaction.id);
        }
        await deleteRound(roundId);
      } catch (err) {
        console.error('Error deleting round:', err);
      }
    }
  };

  const getRoundParticipants = (roundId) => {
    return transactions.filter(t => t.round_id === roundId);
  };

  const calculateTotalInvestment = (participantsList) => {
    return participantsList.reduce((sum, p) => sum + (p.investment_amount || 0), 0);
  };

  const calculatePostMoney = (round) => {
    const roundParticipants = getRoundParticipants(round.id);
    const totalInvestment = calculateTotalInvestment(roundParticipants);
    return round.pre_money_valuation + totalInvestment;
  };

  const calculateRoundInvestment = (roundId) => {
    const roundParticipants = getRoundParticipants(roundId);
    return calculateTotalInvestment(roundParticipants);
  };

  const renderAddRoundForm = () => (
    <div className="bg-white rounded-lg shadow-lg border p-6 my-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Round</h3>
      <form onSubmit={handleAddRound} className="space-y-6">
        {/* Round Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Round Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pre-money Valuation (£)</label>
            <input
              type="number"
              value={formData.pre_money_valuation}
              onChange={(e) => setFormData({ ...formData, pre_money_valuation: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Option Pool Shares</label>
            <input
              type="number"
              min="0"
              step="1"
              value={formData.option_pool_shares}
              onChange={(e) => setFormData({ ...formData, option_pool_shares: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Share Class</label>
          <select
            value={formData.share_class_id}
            onChange={(e) => {
              if (e.target.value === 'new') {
                setShowNewShareClassForm(true);
              } else {
                setFormData({ ...formData, share_class_id: e.target.value });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Share Class</option>
            {shareClasses.map(shareClass => (
              <option key={shareClass.id} value={shareClass.id}>{shareClass.name}</option>
            ))}
            <option value="new" className="font-semibold text-purple-600 bg-purple-50">+ Add New Share Class</option>
          </select>
        </div>

        {/* Participants Section */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Round Participants</h4>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shareholder</label>
                <select
                  value={newParticipant.shareholder_id}
                  onChange={(e) => {
                    if (e.target.value === 'new') {
                      setShowNewShareholderForm(true);
                    } else {
                      setNewParticipant({ ...newParticipant, shareholder_id: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Shareholder</option>
                  {shareholders.map(shareholder => (
                    <option key={shareholder.id} value={shareholder.id}>{shareholder.name}</option>
                  ))}
                  <option value="new" className="font-semibold text-purple-600 bg-purple-50">+ Add New Shareholder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment (£)</label>
                <input
                  type="number"
                  value={newParticipant.investment_amount}
                  onChange={(e) => setNewParticipant({ ...newParticipant, investment_amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                <input
                  type="number"
                  value={newParticipant.shares_issued}
                  onChange={(e) => setNewParticipant({ ...newParticipant, shares_issued: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preference Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={newParticipant.preference_multiplier}
                  onChange={(e) => setNewParticipant({ ...newParticipant, preference_multiplier: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addParticipant}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Participant
                </button>
              </div>
            </div>
          </div>
          {participants.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shareholder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((p) => {
                    const shareholder = shareholders.find(sh => sh.id === p.shareholder_id);
                    return (
                      <tr key={p.id}>
                        <td className="px-4 py-3">{shareholder?.name || '...'}</td>
                        <td className="px-4 py-3">{formatCurrency(p.investment_amount)}</td>
                        <td className="px-4 py-3">{formatNumber(p.shares_issued)}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => removeParticipant(p.id)} className="text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={participants.length === 0}
            className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:bg-gray-300"
          >
            Add Round
          </button>
        </div>
      </form>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const noRounds = !rounds || rounds.length === 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Round History</h1>
        <p className="text-sm text-gray-600 mt-1">Track and manage your funding rounds, valuations, and investment details</p>
      </div>

      <Modal isOpen={showNewShareClassForm} onClose={() => setShowNewShareClassForm(false)}>
        <AddShareClassForm
          onAdd={handleAddNewShareClass}
          onCancel={() => setShowNewShareClassForm(false)}
        />
      </Modal>

      <Modal isOpen={showNewShareholderForm} onClose={() => setShowNewShareholderForm(false)}>
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Shareholder</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleAddNewShareholder({
              name: formData.get('name'),
              role: formData.get('role'),
              email: formData.get('email')
            });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter shareholder name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Role</option>
                <option value="Founder">Founder</option>
                <option value="Investor">Investor</option>
                <option value="Employee">Employee</option>
                <option value="Advisor">Advisor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter email address"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowNewShareholderForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Shareholder
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {noRounds ? (
        showAddForm ? (
          renderAddRoundForm()
        ) : (
          <div className="text-center bg-white p-12 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2-2H4a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No financing rounds</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your company's first financing round.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Round
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900">Round History</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Round</span>
            </button>
          </div>
          
          {showAddForm && renderAddRoundForm()}

          <div className="space-y-4">
            {rounds.map((round) => (
              <div key={round.id} className="bg-white rounded-lg shadow border border-gray-200">
                {/* Round Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleRound(round.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-48">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{round.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(round.date)}</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Pre-money</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(round.pre_money_valuation)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Investment</p>
                          <p className="font-semibold text-purple-600">{formatCurrency(calculateRoundInvestment(round.id))}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Post-money</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(calculatePostMoney(round))}</p>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500">Share Class</p>
                          <p className="font-semibold text-gray-900">
                            {shareClasses.find(sc => sc.id === round.share_class_id)?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {getRoundParticipants(round.id).length} participants
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRounds(new Set([round.id]));
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRound(round.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {expandedRounds.has(round.id) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedRounds.has(round.id) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Round Participants</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getRoundParticipants(round.id).map(tx => {
                              const shareholder = shareholders.find(sh => sh.id === tx.shareholder_id);
                              return (
                                <tr key={tx.id}>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {shareholder?.name || 'N/A'}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {shareholder?.role || 'N/A'}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(tx.investment_amount)}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatNumber(tx.shares_issued)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RoundHistory; 