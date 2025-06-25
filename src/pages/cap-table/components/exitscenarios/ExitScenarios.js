import React, { useState, useEffect } from 'react';
import { CurrencyPoundIcon } from '@heroicons/react/20/solid';
import { useCapTable } from '../../../../hooks/useCapTable';

const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatPercent = (value) => `${value.toFixed(2)}%`;

const ExitScenarios = () => {
  const { capTable, preferenceTerms, loading, error, calculateExitScenario, organizationId } = useCapTable();

  const [exitScenario, setExitScenario] = useState({
    acquisitionAmount: 50000000, // £50M
    acquisitionPercentage: 100, // 100% acquisition
    preferenceType: 'non-participating', // 'non-participating' or 'participating'
  });

  const [exitCalculations, setExitCalculations] = useState(null);

  useEffect(() => {
    const runCalculation = async () => {
      if (organizationId && capTable && capTable.capTable && preferenceTerms) {
        try {
          const results = await calculateExitScenario(
            exitScenario.acquisitionAmount,
            exitScenario.acquisitionPercentage,
            exitScenario.preferenceType
          );
          setExitCalculations(results);
        } catch (err) {
          console.error("Error calculating exit scenario:", err);
          setExitCalculations(null);
        }
      }
    };
    runCalculation();
  }, [exitScenario, capTable, preferenceTerms, calculateExitScenario, organizationId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Exit Scenarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
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
        <h1 className="text-xl font-semibold text-gray-900">Exit Scenarios</h1>
        <p className="text-gray-600 text-sm mb-6">Model different exit scenarios and their impact on shareholder returns</p>
      </div>

      {/* Exit Scenario Inputs */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Exit Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Acquisition Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acquisition Amount (£)</label>
            <input
              type="number"
              value={exitScenario.acquisitionAmount}
              onChange={(e) => setExitScenario(prev => ({ 
                ...prev, 
                acquisitionAmount: parseFloat(e.target.value) || 0 
              }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="50000000"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrency(exitScenario.acquisitionAmount)}
            </p>
          </div>

          {/* Acquisition Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">% Being Acquired</label>
            <input
              type="number"
              value={exitScenario.acquisitionPercentage}
              onChange={(e) => setExitScenario(prev => ({ 
                ...prev, 
                acquisitionPercentage: parseFloat(e.target.value) || 0 
              }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="100"
              min="0"
              max="100"
            />
            <p className="text-sm text-gray-500 mt-1">
              {exitScenario.acquisitionPercentage}% of company
            </p>
          </div>

          {/* Preference Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preference Type</label>
            <div className="bg-purple-100 p-0.5 rounded-lg flex text-xs w-64">
              <button
                onClick={() => setExitScenario(prev => ({ ...prev, preferenceType: 'non-participating' }))}
                className={`px-2 py-1 rounded-md flex-1 text-purple-700 ${exitScenario.preferenceType === 'non-participating' ? 'bg-white shadow-sm' : ''}`}
              >
                Non-Participating
              </button>
              <button
                onClick={() => setExitScenario(prev => ({ ...prev, preferenceType: 'participating' }))}
                className={`px-2 py-1 rounded-md flex-1 text-purple-700 ${exitScenario.preferenceType === 'participating' ? 'bg-white shadow-sm' : ''}`}
              >
                Participating
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {exitScenario.preferenceType === 'non-participating' ? 'Take preference OR conversion' : 'Take preference + conversion'}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Total Exit Value</p>
          <p className="text-2xl font-bold text-purple-900">
            {formatCurrency((exitScenario.acquisitionAmount * exitScenario.acquisitionPercentage) / 100)}
          </p>
        </div>
      </div>

      {/* Exit Cap Table */}
      {exitCalculations && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Exit Distribution</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shareholder</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share Class</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership %</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">Preference Multiplier</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50">Preference Amount</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-orange-50">Conversion Value</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">Final Exit Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exitCalculations.exitCalculations.map((shareholder, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{shareholder.name}</div>
                      <div className="text-sm text-gray-500">{shareholder.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {shareholder.shareClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatPercent(shareholder.ownership)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-blue-50">
                      {shareholder.shareClass.includes('Preferred') ? `${shareholder.multiplier}x` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-yellow-50">
                      {shareholder.preferenceAmount > 0 ? formatCurrency(shareholder.preferenceAmount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-orange-50">
                      {formatCurrency(shareholder.conversionValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 bg-green-50 font-bold">
                      {formatCurrency(shareholder.finalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan="6" className="px-6 py-3 text-right text-sm font-bold text-gray-700">Total Payout</td>
                  <td className="px-6 py-3 text-left text-sm font-bold text-green-800 bg-green-100">
                    {formatCurrency(exitCalculations.totalExitValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitScenarios; 