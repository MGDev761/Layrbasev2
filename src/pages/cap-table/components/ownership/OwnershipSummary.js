import React, { useState } from 'react';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import Card from '../../../../components/common/layout/Card';

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
            <h2 className="text-xl font-bold text-white tracking-tight">Ownership Summary Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Ownership Basics
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
                  {openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                </button>
                {openContent.intro && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>The ownership summary provides a high-level overview of your company's share structure, including total shares, issued shares, and current valuation. This gives you a quick snapshot of your company's ownership status.</p>
                  </div>
                )}
              </div>
              {/* Why It's Important Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Why It's Important</span>
                  {openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                </button>
                {openContent.why && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Quick overview of your company's share structure</li>
                      <li>Track share issuance and remaining authorized shares</li>
                      <li>Monitor company valuation and growth</li>
                      <li>Essential for board reporting and investor updates</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Best Practice Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Best Practice</span>
                  {openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                </button>
                {openContent.best && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Keep authorized share count appropriate for growth</li>
                      <li>Monitor issued vs authorized share ratio</li>
                      <li>Update valuation after each funding round</li>
                      <li>Plan for future share issuances and option pools</li>
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
                  <span className="text-sm">Understanding Metrics</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Total Shares: Maximum shares your company can issue. Issued Shares: Shares currently owned by shareholders. Company Valuation: Current worth based on latest funding round.</p>
                  </div>
                )}
              </div>
              {/* Tips Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Share Management</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Keep track of your issued vs authorized shares. You need sufficient authorized shares for future funding rounds, employee options, and strategic issuances.</p>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Valuation Updates</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Company valuation should be updated after each funding round. This affects share prices, option strike prices, and helps track your company's growth trajectory.</p>
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
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your ownership summary assistant. I can help you understand share structures, valuations, and answer questions about managing your company's ownership metrics.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What's the difference between authorized and issued shares?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Authorized shares are the maximum number of shares your company can issue. Issued shares are the shares currently owned by shareholders. The difference is available for future issuances.</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about ownership..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon, colors }) => (
  <Card className={`bg-gradient-to-r ${colors.gradient} border ${colors.border}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
        <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
        <p className={`text-xs ${colors.text}`}>{subtitle}</p>
      </div>
      <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </Card>
);

const OwnershipSummary = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  const metrics = [
    {
      title: 'Total Shares',
      value: '10,000,000',
      subtitle: 'Authorized shares',
      colors: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-600',
        value: 'text-blue-900',
        iconBg: 'bg-blue-200'
      },
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Issued Shares',
      value: '7,500,000',
      subtitle: '75% of authorized',
      colors: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-600',
        value: 'text-green-900',
        iconBg: 'bg-green-200'
      },
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Company Valuation',
      value: '$25M',
      subtitle: 'Latest round',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-600',
        value: 'text-purple-900',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Ownership Summary</h1>
            <p className="text-gray-600 text-sm mb-6">Overview of your company's share structure and ownership metrics</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};

export default OwnershipSummary; 