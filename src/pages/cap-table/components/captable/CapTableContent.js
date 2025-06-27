import React, { useState, useMemo } from 'react';
import { useCapTable } from '../../../../hooks/useCapTable';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// --- UTILITY & FORMATTING ---
const formatCurrency = (value) => `£${(value / 1000000).toFixed(2)}M`;
const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(value);
const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openSections, setOpenSections] = useState({
    basics: true,
    platform: false,
    ai: false
  });
  const toggleSection = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
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
            <h2 className="text-xl font-bold text-white tracking-tight">Cap Table Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Cap Table Basics
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
                    <p>A cap table (capitalization table) shows the ownership structure of your company, including who owns what percentage and how much they invested. It's essential for fundraising, exits, and governance.</p>
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
                      <li>Essential for fundraising and investor negotiations</li>
                      <li>Helps track ownership dilution over time</li>
                      <li>Critical for exit planning and valuations</li>
                      <li>Required for corporate governance and compliance</li>
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
                      <li>Keep your cap table updated after every transaction</li>
                      <li>Document all share issuances and transfers properly</li>
                      <li>Understand the impact of new rounds on existing shareholders</li>
                      <li>Plan for employee stock options and vesting schedules</li>
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
                  <span className="text-sm">View and Navigate</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Use the round selector to view your cap table at different points in time. Switch between "Individuals" and "Groups" views to see detailed or summarized ownership information.</p>
                  </div>
                )}
              </div>
              {/* Tips Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Summary Cards</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Monitor key metrics in the summary cards: total shares, total investment, founders ownership, and investors ownership. These help you track your company's financial health and ownership distribution.</p>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Understanding the Table</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>The cap table shows each shareholder's name, role, shares owned, ownership percentage, investment amount, and share class. Use this to understand your company's complete ownership structure.</p>
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
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your cap table assistant. I can help you understand ownership structures, calculate dilution, and answer questions about using this platform.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I calculate ownership dilution?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Ownership dilution occurs when new shares are issued. Use the round selector to compare ownership percentages before and after funding rounds to see the dilution impact.</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about cap tables..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  const [showInfoModal, setShowInfoModal] = useState(false);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Cap Table Overview</h1>
            <p className="text-gray-600 text-sm mb-6">View and manage your company's ownership structure and shareholder information</p>
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

      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};

export default CapTableContent; 