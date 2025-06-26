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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import InvoiceOverview from './InvoiceOverview';
import SentInvoices from './SentInvoices';
import ReceivedInvoices from './ReceivedInvoices';
import CreateInvoiceModal from './CreateInvoiceModal';
import UploadInvoiceModal from './UploadInvoiceModal';

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
    </div>
  );
};

export default Invoices; 