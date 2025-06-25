import React, { useState, useMemo } from 'react';
import { CalculatorIcon } from '@heroicons/react/20/solid';
import { useCapTable } from '../../../../hooks/useCapTable';

const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value);
const formatPercent = (value) => `${value.toFixed(2)}%`;

const InvestmentPlanning = () => {
  const { capTable } = useCapTable();

  const [scenario, setScenario] = useState({
    type: 'amount', // 'amount' or 'percentage'
    value: 2500000, // amount to raise or percentage to give away
    postMoneyValuation: 15000000,
  });

  const currentCapTableData = useMemo(() => {
    if (!capTable || !capTable.capTable) {
      return {
        shareholders: [],
        totalShares: 0,
      };
    }
    return {
      shareholders: capTable.capTable,
      totalShares: capTable.totalShares,
    };
  }, [capTable]);

  const calculations = useMemo(() => {
    const { type, value, postMoneyValuation } = scenario;
    
    let newShares, investmentAmount, ownershipPercentage;
    const totalCurrentShares = currentCapTableData.totalShares;

    if (totalCurrentShares === 0 || postMoneyValuation === 0) {
      return {
        newShares: 0,
        investmentAmount: 0,
        ownershipPercentage: 0,
        totalSharesAfterRound: 0,
        sharePrice: 0,
        preMoneyValuation: 0,
      };
    }
    
    if (type === 'amount') {
      investmentAmount = value;
      ownershipPercentage = (investmentAmount / postMoneyValuation) * 100;
      newShares = (ownershipPercentage / 100) * totalCurrentShares / (1 - (ownershipPercentage / 100));
    } else {
      ownershipPercentage = value;
      investmentAmount = (ownershipPercentage / 100) * postMoneyValuation;
      newShares = (ownershipPercentage / 100) * totalCurrentShares / (1 - (ownershipPercentage / 100));
    }

    const totalSharesAfterRound = totalCurrentShares + newShares;
    const sharePrice = newShares > 0 ? investmentAmount / newShares : 0;

    return {
      newShares: Math.round(newShares),
      investmentAmount,
      ownershipPercentage,
      totalSharesAfterRound,
      sharePrice,
      preMoneyValuation: postMoneyValuation - investmentAmount,
    };
  }, [scenario, currentCapTableData]);

  const updatedCapTable = useMemo(() => {
    if (!currentCapTableData.shareholders) return [];
    return currentCapTableData.shareholders.map(shareholder => {
      const newOwnership = (shareholder.shares / calculations.totalSharesAfterRound) * 100;
      const dilution = shareholder.ownership - newOwnership;
      
      return {
        ...shareholder,
        newOwnership,
        dilution,
      };
    });
  }, [calculations, currentCapTableData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Investment Planning</h1>
        <p className="text-gray-600 text-sm mb-6">Plan and model future funding rounds and investment scenarios</p>
      </div>

      {/* Investment Calculator */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calculate by:</label>
            <div className="bg-purple-100 p-0.5 rounded-lg flex text-xs w-36">
              <button
                onClick={() => setScenario(prev => ({ ...prev, type: 'amount' }))}
                className={`px-2 py-1 rounded-md flex-1 text-purple-700 ${scenario.type === 'amount' ? 'bg-white shadow-sm' : ''}`}
              >
                Amount
              </button>
              <button
                onClick={() => setScenario(prev => ({ ...prev, type: 'percentage' }))}
                className={`px-2 py-1 rounded-md flex-1 text-purple-700 ${scenario.type === 'percentage' ? 'bg-white shadow-sm' : ''}`}
              >
                Percentage
              </button>
            </div>
          </div>

          {/* Amount/Percentage Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {scenario.type === 'amount' ? 'Amount to Raise (£)' : 'Equity to Give Away (%)'}
            </label>
            <input
              type="number"
              value={scenario.value}
              onChange={(e) => setScenario(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder={scenario.type === 'amount' ? '2500000' : '16.67'}
            />
          </div>

          {/* Post-money Valuation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Post-money Valuation (£)</label>
            <input
              type="number"
              value={scenario.postMoneyValuation}
              onChange={(e) => setScenario(prev => ({ ...prev, postMoneyValuation: parseFloat(e.target.value) || 0 }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="15000000"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">New Shares Needed</p>
            <p className="text-xl font-bold text-purple-900">{formatNumber(calculations.newShares)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Investment Amount</p>
            <p className="text-xl font-bold text-blue-900">{formatCurrency(calculations.investmentAmount)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Equity Given Away</p>
            <p className="text-xl font-bold text-green-900">{formatPercent(calculations.ownershipPercentage)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Share Price</p>
            <p className="text-xl font-bold text-orange-900">£{calculations.sharePrice.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Before/After Cap Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Cap Table Impact</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shareholder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Ownership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">New Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">Post-Round Ownership</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50">Dilution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {updatedCapTable.map((shareholder, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{shareholder.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      shareholder.role === 'Founder' ? 'bg-green-100 text-green-800' :
                      shareholder.role === 'Investor' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {shareholder.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatNumber(shareholder.shares)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatPercent(shareholder.ownership)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-blue-50">
                    {formatNumber(shareholder.shares)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-blue-50">
                    {formatPercent(shareholder.newOwnership)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 bg-red-50 font-medium">
                    {formatPercent(shareholder.dilution)}
                  </td>
                </tr>
              ))}
              {/* New Investor Row */}
              <tr className="bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">New Investor</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Investor
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-blue-50">
                  {formatNumber(calculations.newShares)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-blue-50">
                  {formatPercent(calculations.ownershipPercentage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 bg-red-50">-</td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-3 text-left text-sm font-bold text-gray-700">Totals</td>
                <td className="px-6 py-3"></td>
                <td className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                  {formatNumber(currentCapTableData.totalShares)}
                </td>
                <td className="px-6 py-3 text-left text-sm font-bold text-gray-700">100.00%</td>
                <td className="px-6 py-3 text-left text-sm font-bold text-gray-700 bg-blue-50">
                  {formatNumber(calculations.totalSharesAfterRound)}
                </td>
                <td className="px-6 py-3 text-left text-sm font-bold text-gray-700 bg-blue-50">100.00%</td>
                <td className="px-6 py-3 text-left text-sm font-bold text-gray-700 bg-red-50">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlanning; 