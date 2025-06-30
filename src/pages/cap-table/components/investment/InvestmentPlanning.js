import React, { useState, useMemo } from 'react';
import { CalculatorIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useCapTable } from '../../../../hooks/useCapTable';

const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value);
const formatPercent = (value) => `${value.toFixed(2)}%`;

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
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
            <h2 className="text-xl font-bold text-white tracking-tight">Investment Planning Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Investment Basics
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
                    <p>Investment planning helps you model future funding rounds and understand the impact on ownership, dilution, and share prices. This tool calculates how much equity you'll need to give up for a specific investment amount or percentage.</p>
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
                      <li>Plan fundraising strategy and understand dilution impact</li>
                      <li>Negotiate better terms with investors</li>
                      <li>Set realistic valuation expectations</li>
                      <li>Prepare for investor discussions and due diligence</li>
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
                      <li>Model multiple scenarios with different valuations</li>
                      <li>Consider both amount-based and percentage-based calculations</li>
                      <li>Factor in option pool and employee equity</li>
                      <li>Plan for multiple funding rounds ahead</li>
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
                  <span className="text-sm">Use the Calculator</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Choose whether to calculate by investment amount or equity percentage. Enter your target post-money valuation and the calculator will show you the new shares needed, share price, and ownership impact.</p>
                  </div>
                )}
              </div>
              {/* Tips Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Understanding Results</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>The cap table impact shows how each shareholder's ownership will change after the round. Pay attention to dilution percentages - this shows how much each party's ownership will decrease.</p>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Valuation Tips</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Post-money valuation = Pre-money valuation + Investment amount. Set realistic valuations based on your company's stage, market, and comparable companies. Higher valuations mean less dilution for existing shareholders.</p>
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
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your investment planning assistant. I can help you understand dilution, calculate share prices, and answer questions about funding round planning.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I calculate dilution?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Dilution = (Current ownership - New ownership) / Current ownership × 100%. When new shares are issued, existing shareholders' percentage ownership decreases proportionally.</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about investment planning..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InvestmentPlanning = () => {
  const { capTable } = useCapTable();

  const [scenario, setScenario] = useState({
    type: 'amount', // 'amount' or 'percentage'
    value: 2500000, // amount to raise or percentage to give away
    postMoneyValuation: 15000000,
  });

  const [showInfoModal, setShowInfoModal] = useState(false);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Investment Planning</h1>
            <p className="text-gray-600 text-sm mb-6">Plan and model future funding rounds and investment scenarios</p>
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
      </div>

      {/* Investment Calculator */}
      <div className="bg-white rounded-lg p-6">
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
      <div className="bg-white rounded-lg overflow-hidden">
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

      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};

export default InvestmentPlanning; 