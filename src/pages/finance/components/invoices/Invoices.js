import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { 
  DocumentTextIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import InvoiceOverview from './InvoiceOverview';
import SentInvoices from './SentInvoices';
import ReceivedInvoices from './ReceivedInvoices';
import CreateInvoiceModal from './CreateInvoiceModal';
import UploadInvoiceModal from './UploadInvoiceModal';

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
            <h2 className="text-xl font-bold text-white tracking-tight">Invoicing Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Invoicing Basics
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
                    <p>Invoicing is a critical part of business cash flow management. This section covers best practices for creating, sending, and tracking invoices effectively.</p>
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
                      <li>Ensures timely payment and cash flow</li>
                      <li>Maintains professional business relationships</li>
                      <li>Provides clear documentation for accounting</li>
                      <li>Helps track business performance and revenue</li>
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
                      <li>Always include clear payment terms and due dates</li>
                      <li>Provide detailed line items and descriptions</li>
                      <li>Send invoices promptly after work is completed</li>
                      <li>Follow up on overdue invoices regularly</li>
                      <li>Keep your contact and bank details up to date</li>
                      <li>Use sequential invoice numbers for easy tracking</li>
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
                  <span className="text-sm">Create and Send Invoices</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Create, send, and track invoices from the Sent Invoices tab. Use the "New Invoice" button to create professional invoices with line items and payment terms.</p>
                  </div>
                )}
              </div>
              {/* Tips Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Manage Received Invoices</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Upload and manage received invoices in the Received Invoices tab. Use filters and search to quickly find invoices and monitor your payables.</p>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Track and Monitor</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Monitor outstanding and overdue invoices in the dashboard. Export invoice data for accounting or reporting, and set up payment reminders to reduce late payments.</p>
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
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your invoicing assistant. I can help you create invoices, manage payments, and answer questions about using this platform.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I create a new invoice?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click "New Invoice" in the Sent Invoices tab. Fill in the client details, add line items with descriptions and amounts, set payment terms, and send it to your client.</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about invoicing..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Invoices = () => {
  const { currentOrganization } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invoiceStats, setInvoiceStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalOverdue: 0,
    outstandingReceivables: 0,
    outstandingPayables: 0,
    netFlow: 0
  });
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (currentOrganization?.organization_id) {
      fetchInvoiceStats();
    }
  }, [currentOrganization]);

  const fetchInvoiceStats = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const stats = await invoiceService.getStats(currentOrganization.organization_id);
      
      // Mock data for now
      const mockStats = {
        totalSent: 24,
        totalReceived: 18,
        totalPaid: 32,
        totalUnpaid: 8,
        totalOverdue: 3,
        outstandingReceivables: 45000,
        outstandingPayables: 12000,
        netFlow: 33000
      };
      
      setInvoiceStats(mockStats);
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: EyeIcon },
    { id: 'sent', name: 'Sent Invoices', icon: ArrowUpIcon },
    { id: 'received', name: 'Received Invoices', icon: ArrowDownIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <InvoiceOverview stats={invoiceStats} loading={loading} />;
      case 'sent':
        return <SentInvoices organizationId={currentOrganization?.organization_id} />;
      case 'received':
        return <ReceivedInvoices organizationId={currentOrganization?.organization_id} />;
      default:
        return <InvoiceOverview stats={invoiceStats} loading={loading} />;
    }
  };

  const handleCreateInvoice = () => {
    setShowCreateModal(true);
  };

  const handleInvoiceCreated = () => {
    // This will trigger a refresh of the data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoicing</h1>
          <p className="text-gray-600 mt-1">
            Manage sent and received invoices, track payments, and monitor cash flow
          </p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'sent' && (
            <button
              onClick={handleCreateInvoice}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Invoice
            </button>
          )}
          {activeTab === 'received' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Upload Invoice
            </button>
          )}
          <button
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
          >
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            Invoicing Help
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleInvoiceCreated}
      />

      {showUploadModal && (
        <UploadInvoiceModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          organizationId={currentOrganization?.organization_id}
          onInvoiceUploaded={() => {
            setShowUploadModal(false);
            fetchInvoiceStats();
          }}
        />
      )}

      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
};

export default Invoices; 