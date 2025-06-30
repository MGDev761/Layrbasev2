import React, { useState, useEffect } from 'react';
import { CurrencyPoundIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useCapTable } from '../../../../hooks/useCapTable';

const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
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
            <h2 className="text-xl font-bold text-white tracking-tight">Exit Scenarios Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Exit Basics
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
                    <p>Exit scenarios help you model different acquisition or IPO outcomes and understand how the proceeds would be distributed among shareholders based on their share classes and preference terms.</p>
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
                      <li>Plan for different exit valuations and scenarios</li>
                      <li>Understand the impact of preference terms on returns</li>
                      <li>Help with investor negotiations and term sheet discussions</li>
                      <li>Prepare for due diligence and exit planning</li>
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
                      <li>Model multiple exit scenarios (low, medium, high valuations)</li>
                      <li>Consider both partial and full acquisitions</li>
                      <li>Understand the difference between participating and non-participating preferences</li>
                      <li>Factor in option pool and employee equity considerations</li>
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
                  <span className="text-sm">Set Exit Parameters</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Enter the acquisition amount, percentage being acquired, and preference type. The system will automatically calculate how proceeds would be distributed among shareholders.</p>
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
                    <p>The exit distribution table shows each shareholder's preference amount, conversion value, and final exit value. This helps you understand who gets paid first and how much each party receives.</p>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Preference Types</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Non-participating preferences: Investors take their preference OR convert to common shares. Participating preferences: Investors take their preference AND convert to common shares for additional proceeds.</p>
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
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your exit scenario assistant. I can help you understand preference terms, calculate exit distributions, and answer questions about modeling different exit outcomes.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What's the difference between participating and non-participating preferences?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Non-participating: Investors choose between their preference OR conversion to common. Participating: Investors get their preference AND conversion to common for additional proceeds.</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about exit scenarios..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExitScenarios = () => {
  const { capTable, preferenceTerms, loading, error, calculateExitScenario, organizationId } = useCapTable();

  const [exitScenario, setExitScenario] = useState({
    acquisitionAmount: 50000000, // £50M
    acquisitionPercentage: 100, // 100% acquisition
    preferenceType: 'non-participating', // 'non-participating' or 'participating'
  });

  const [exitCalculations, setExitCalculations] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Exit Scenarios</h1>
            <p className="text-gray-600 text-sm mb-6">Model different exit scenarios and their impact on shareholder returns</p>
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

      {/* Exit Scenario Inputs */}
      <div className="bg-white rounded-lg p-6">
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
        <div className="bg-white rounded-lg overflow-hidden">
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

      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};

export default ExitScenarios; 