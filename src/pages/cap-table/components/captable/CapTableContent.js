import React, { useState, useMemo } from 'react';
import { useCapTable } from '../../../../hooks/useCapTable';

// --- UTILITY & FORMATTING ---
const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value);
const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

// --- MAIN COMPONENT ---
const CapTableContent = () => {
  const {
    loading,
    error,
    capTable,
    rounds,
    loadCapTableAtRound
  } = useCapTable();

  const [viewMode, setViewMode] = useState('individual'); // individual | group
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(rounds.length); // length = Current

  // Calculate derived table data
  const derivedTable = useMemo(() => {
    if (!capTable || !capTable.capTable) {
      return { displayRows: [], summary: {} };
    }

    const { capTable: tableRows, summary } = capTable;

    // Group rows if needed
    const groupedRows = Object.values(tableRows.reduce((acc, row) => {
      const group = row.role === 'Founder' ? 'Founders' : row.role === 'Investor' ? 'Investors' : 'Employees & Advisors';
      if (!acc[group]) {
        acc[group] = { name: group, role: '', shares: 0, ownership: 0, investment: 0 };
      }
      acc[group].shares += row.shares;
      acc[group].ownership += row.ownership;
      acc[group].investment += row.investment;
      return acc;
    }, {}));

    const displayRows = viewMode === 'individual' ? tableRows : groupedRows;

    // Calculate founders and investors ownership for summary cards
    const foundersOwnership = viewMode === 'individual' 
      ? tableRows.filter(row => row.role === 'Founder').reduce((sum, row) => sum + row.ownership, 0)
      : groupedRows.find(g => g.name === 'Founders')?.ownership || 0;

    const investorsOwnership = viewMode === 'individual'
      ? tableRows.filter(row => row.role === 'Investor').reduce((sum, row) => sum + row.ownership, 0)
      : groupedRows.find(g => g.name === 'Investors')?.ownership || 0;

    return { 
      displayRows, 
      summary: {
        ...summary,
        foundersOwnership,
        investorsOwnership
      }
    };
  }, [capTable, viewMode]);

  const handleRoundChange = async (roundIndex) => {
    setSelectedRoundIndex(roundIndex);
    if (roundIndex === rounds.length) {
      // Current state
      await loadCapTableAtRound();
    } else {
      // Specific round
      const roundId = rounds[roundIndex]?.id;
      if (roundId) {
        await loadCapTableAtRound(roundId);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cap table...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading cap table</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Cap Table Overview</h1>
        <p className="text-gray-600 text-sm mb-6">View and manage your company's ownership structure and shareholder information</p>
      </div>

      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select 
          value={selectedRoundIndex}
          onChange={(e) => handleRoundChange(parseInt(e.target.value, 10))}
          className="w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-purple-600 text-white font-medium px-4 py-2"
        >
          <option value={rounds.length}>Current</option>
          {rounds.map((r, i) => <option key={r.id} value={i}>{r.name}</option>)}
        </select>
        <div className="bg-purple-100 p-0.5 rounded-lg flex text-sm">
          <button
            onClick={() => setViewMode('individual')}
            className={`px-4 py-2 rounded-md flex-1 text-purple-700 ${viewMode === 'individual' ? 'bg-white shadow-sm' : ''}`}
          >
            Individuals
          </button>
          <button
            onClick={() => setViewMode('group')}
            className={`px-4 py-2 rounded-md flex-1 text-purple-700 ${viewMode === 'group' ? 'bg-white shadow-sm' : ''}`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {derivedTable.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Shares</p>
            <p className="text-xl font-bold">{formatNumber(derivedTable.summary.totalShares || 0)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Investment</p>
            <p className="text-xl font-bold">{formatCurrency(derivedTable.summary.totalInvestment || 0)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Founders Ownership</p>
            <p className="text-xl font-bold">
              {formatPercent((derivedTable.summary.foundersOwnership || 0) / 100)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Investors Ownership</p>
            <p className="text-xl font-bold">
              {formatPercent((derivedTable.summary.investorsOwnership || 0) / 100)}
            </p>
          </div>
        </div>
      )}

      {/* Cap Table */}
      <div className="overflow-x-auto">
        <div className="bg-white rounded-lg shadow border border-gray-200 min-w-full inline-block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shareholder</th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Ownership</th>
                {viewMode === 'individual' && <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share Class</th>}
                <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment (£)</th>
                {viewMode === 'individual' && <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share Price (£)</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {derivedTable.displayRows.map(row => (
                <tr key={row.id || row.name}>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{row.name}</div>
                    <div className="text-sm text-gray-500">{row.role}</div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                    {formatNumber(Math.round(row.shares))}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{formatPercent(row.ownership / 100)}</td>
                  {viewMode === 'individual' && <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{row.shareClass}</td>}
                  <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">{formatNumber(row.investment)}</td>
                  {viewMode === 'individual' && (
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                      {row.investment > 0 && row.shares > 0 ? (row.investment / row.shares).toFixed(4) : '-'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-2 text-left text-sm font-bold text-gray-700">Totals</td>
                <td className="px-6 py-2 text-left text-sm font-bold text-gray-700">
                  {formatNumber(derivedTable.summary?.totalShares || 0)}
                </td>
                <td className="px-6 py-2 text-left text-sm font-bold text-gray-700">100.00%</td>
                {viewMode === 'individual' && <td colSpan="1"></td>}
                <td className="px-6 py-2 text-left text-sm font-bold text-gray-700">
                  {formatNumber(derivedTable.summary?.totalInvestment || 0)}
                </td>
                {viewMode === 'individual' && <td colSpan="1"></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CapTableContent; 