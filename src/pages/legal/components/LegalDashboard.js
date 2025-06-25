import React from 'react';
import { DocumentTextIcon, ShieldCheckIcon, CalendarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

const LegalDashboard = ({ activeTab = 'documents' }) => {
  const legalDocuments = [
    { name: 'Articles of Association', status: 'uploaded', date: '2024-01-15', type: 'constitutional' },
    { name: 'Shareholder Agreement', status: 'pending', date: null, type: 'governance' },
    { name: 'Founder Agreements', status: 'uploaded', date: '2024-01-20', type: 'employment' },
    { name: 'IP Assignment Agreements', status: 'uploaded', date: '2024-01-18', type: 'intellectual-property' },
    { name: 'Employment Contracts', status: 'pending', date: null, type: 'employment' },
    { name: 'NDA Templates', status: 'uploaded', date: '2024-01-22', type: 'confidentiality' },
  ];

  const complianceItems = [
    { name: 'Annual Confirmation Statement', dueDate: '2025-01-15', status: 'pending', type: 'companies-house' },
    { name: 'Annual Accounts Filing', dueDate: '2025-01-31', status: 'pending', type: 'companies-house' },
    { name: 'VAT Returns', dueDate: '2024-12-31', status: 'pending', type: 'hmrc' },
    { name: 'PAYE Registration', dueDate: '2024-02-15', status: 'completed', type: 'hmrc' },
    { name: 'Data Protection Registration', dueDate: '2024-03-01', status: 'pending', type: 'ico' },
  ];

  const regulatoryRequirements = [
    { name: 'GDPR Compliance', status: 'in-progress', priority: 'high', description: 'Data protection and privacy compliance' },
    { name: 'Anti-Money Laundering', status: 'pending', priority: 'medium', description: 'AML checks and procedures' },
    { name: 'Health & Safety', status: 'completed', priority: 'medium', description: 'Workplace safety requirements' },
    { name: 'Insurance Requirements', status: 'in-progress', priority: 'high', description: 'Public liability and employer liability' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Legal Documents</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Upload Document
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {legalDocuments.map((doc) => (
                <div key={doc.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{doc.type.replace('-', ' ')}</p>
                      {doc.date && (
                        <p className="text-xs text-gray-500 mt-1">Uploaded: {doc.date}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                    <button className="text-xs text-gray-600 hover:text-gray-800">Download</button>
                    {doc.status === 'pending' && (
                      <button className="text-xs text-green-600 hover:text-green-800">Upload</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Compliance Deadlines</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add Deadline
              </button>
            </div>
            
            <div className="space-y-3">
              {complianceItems.map((item) => (
                <div key={item.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {item.status === 'completed' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.type.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-900">Due: {item.dueDate}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        {item.status === 'completed' ? 'View' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Regulatory Requirements</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add Requirement
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regulatoryRequirements.map((req) => (
                <div key={req.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">{req.name}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{req.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Details</button>
                    <button className="text-xs text-gray-600 hover:text-gray-800">Documents</button>
                    {req.status !== 'completed' && (
                      <button className="text-xs text-green-600 hover:text-green-800">Update Status</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalDashboard; 