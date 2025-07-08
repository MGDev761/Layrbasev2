import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  CloudArrowUpIcon,
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  CalendarIcon,
  TagIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { getContracts, getContractFolders, deleteContract, createContractFolder, createContract, uploadContractPDF } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';

const contractTemplates = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information shared between parties',
    category: 'Confidentiality',
    icon: ShieldCheckIcon,
    fields: [
      { key: 'party1Name', label: 'First Party Name', type: 'text', placeholder: 'Your company name' },
      { key: 'party1Address', label: 'First Party Address', type: 'textarea', placeholder: 'Your company address' },
      { key: 'party2Name', label: 'Second Party Name', type: 'text', placeholder: 'Other party name' },
      { key: 'party2Address', label: 'Second Party Address', type: 'textarea', placeholder: 'Other party address' },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { key: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'Describe the business purpose...' },
      { key: 'duration', label: 'Duration (years)', type: 'number', placeholder: '2' }
    ],
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of {{effectiveDate}} between {{party1Name}}, located at {{party1Address}} ("First Party") and {{party2Name}}, located at {{party2Address}} ("Second Party").

PURPOSE
The parties wish to explore {{purpose}} and may disclose confidential information for this purpose.

CONFIDENTIAL INFORMATION
"Confidential Information" means any proprietary or sensitive information disclosed by either party, whether oral, written, or electronic, that is marked as confidential or would reasonably be considered confidential.

OBLIGATIONS
Each party agrees to:
- Keep all Confidential Information strictly confidential
- Use the information solely for the stated purpose
- Not disclose to any third parties without written consent
- Take reasonable precautions to protect the information

TERM
This Agreement shall remain in effect for {{duration}} years from the effective date.

RETURN OF INFORMATION
Upon termination or request, each party will return or destroy all Confidential Information received.

GOVERNING LAW
This Agreement shall be governed by applicable law.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{{party1Name}}                    {{party2Name}}

_____________________           _____________________
Signature                        Signature

_____________________           _____________________
Print Name                       Print Name

_____________________           _____________________
Title                           Title

_____________________           _____________________
Date                            Date`
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'Professional services contract with terms and conditions',
    category: 'Commercial',
    icon: UserGroupIcon,
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Client company name' },
      { key: 'providerName', label: 'Service Provider', type: 'text', placeholder: 'Your company name' },
      { key: 'serviceDescription', label: 'Services Description', type: 'textarea', placeholder: 'Detailed description of services...' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'totalFee', label: 'Total Fee', type: 'text', placeholder: '$10,000' },
      { key: 'paymentTerms', label: 'Payment Terms', type: 'text', placeholder: 'Net 30 days' }
    ],
    content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into between {{clientName}} ("Client") and {{providerName}} ("Provider").

SERVICES
Provider agrees to perform the following services: {{serviceDescription}}

TERM
This Agreement shall commence on {{startDate}} and continue until {{endDate}}.

COMPENSATION
Client agrees to pay Provider {{totalFee}} for the services described herein.
Payment terms: {{paymentTerms}}

INTELLECTUAL PROPERTY
All work product created under this Agreement shall be owned by the Client.

CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information.

TERMINATION
Either party may terminate this Agreement with 30 days written notice.

GOVERNING LAW
This Agreement shall be governed by applicable law.

Client: {{clientName}}            Provider: {{providerName}}

_____________________           _____________________
Signature                        Signature

_____________________           _____________________
Date                            Date`
  },
  {
    id: 'consulting-agreement',
    name: 'Consulting Agreement',
    description: 'Independent contractor agreement for consulting services',
    category: 'Professional',
    icon: BriefcaseIcon,
    fields: [
      { key: 'consultantName', label: 'Consultant Name', type: 'text', placeholder: 'Consultant/Company name' },
      { key: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Client company name' },
      { key: 'hourlyRate', label: 'Hourly Rate', type: 'text', placeholder: '$150/hour' },
      { key: 'maxHours', label: 'Maximum Hours/Month', type: 'number', placeholder: '40' },
      { key: 'deliverables', label: 'Key Deliverables', type: 'textarea', placeholder: 'List expected deliverables...' }
    ],
    content: `CONSULTING AGREEMENT

This Consulting Agreement is between {{clientName}} ("Company") and {{consultantName}} ("Consultant").

SERVICES
Consultant will provide professional consulting services as an independent contractor.

KEY DELIVERABLES
{{deliverables}}

COMPENSATION
- Hourly rate: {{hourlyRate}}
- Maximum hours per month: {{maxHours}}
- Payment within 30 days of invoice

INDEPENDENT CONTRACTOR STATUS
Consultant is an independent contractor and not an employee of Company.

CONFIDENTIALITY
Consultant agrees to maintain confidentiality of all Company information.

INTELLECTUAL PROPERTY
All work product shall be owned by Company upon payment.

Company: {{clientName}}           Consultant: {{consultantName}}

_____________________           _____________________
Signature                        Signature

_____________________           _____________________
Date                            Date`
  }
];

const ContractCard = ({ contract, onView, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
            <DocumentTextIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{contract.name}</h3>
            <p className="text-sm text-gray-500">{new Date(contract.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
          {contract.status}
        </div>
      </div>
      
      <div className="flex-1">
        {contract.description && (
          <p className="text-gray-600 text-sm line-clamp-3">{contract.description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <button
          onClick={() => onView(contract)}
          className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          View Contract
        </button>
        <button
          onClick={() => onEdit(contract)}
          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(contract)}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const TemplateCard = ({ template, onSelect }) => {
  const IconComponent = template.icon;
  return (
    <button
      onClick={() => onSelect(template)}
      className="w-full bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 transition-all duration-200 text-left group"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
          <IconComponent className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">{template.name}</h3>
          <p className="text-sm text-purple-600">{template.category}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4">{template.description}</p>
      <div className="flex items-center text-sm text-purple-600 font-medium">
        <PlusIcon className="w-4 h-4 mr-1" />
        Create from template
      </div>
    </button>
  );
};

const FolderCard = ({ folder, contractCount, isSelected, onSelect, onEdit, onDelete }) => (
  <div 
    onClick={() => onSelect(folder.id)}
    className={`p-3 rounded-lg border cursor-pointer transition-all ${
      isSelected 
        ? 'border-purple-500 bg-purple-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <FolderIcon className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
        <div>
          <h3 className={`text-sm font-medium ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
            {folder.name}
          </h3>
          <p className="text-xs text-gray-500">{contractCount} contracts</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(folder); }}
          className="p-1 text-gray-400 hover:text-purple-600 rounded"
        >
          <PencilIcon className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(folder); }}
          className="p-1 text-gray-400 hover:text-red-600 rounded"
        >
          <TrashIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
);

const ContractEditor = ({ isOpen, onClose, contract, onSave, isTemplate = false, templateData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    folder_id: '',
    file: null
  });
  const [templateFields, setTemplateFields] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (contract) {
        setFormData({
          name: contract.name || '',
          description: contract.description || '',
          folder_id: contract.folder_id || '',
          file: null
        });
      } else if (isTemplate && templateData) {
        setFormData({
          name: templateData.name,
          description: templateData.description,
          folder_id: '',
          file: null
        });
        // Initialize template fields
        const fields = {};
        templateData.fields.forEach(field => {
          fields[field.key] = '';
        });
        setTemplateFields(fields);
      } else {
        setFormData({
          name: '',
          description: '',
          folder_id: '',
          file: null
        });
        setTemplateFields({});
      }
    }
  }, [isOpen, contract, isTemplate, templateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isTemplate) {
        // Generate contract content from template
        let content = templateData.content;
        Object.entries(templateFields).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          content = content.replace(regex, value || `[${key}]`);
        });
        
        await onSave({
          ...formData,
          content,
          status: 'draft'
        });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isTemplate ? `Create Contract: ${templateData?.name}` : contract ? 'Edit Contract' : 'Add New Contract'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder
                </label>
                <select
                  value={formData.folder_id}
                  onChange={(e) => setFormData({ ...formData, folder_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">No folder</option>
                  {/* Folders will be passed as props */}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Brief description of the contract..."
              />
            </div>

            {/* Template Fields */}
            {isTemplate && templateData?.fields && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contract Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {templateData.fields.map((field) => (
                    <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={templateFields[field.key] || ''}
                          onChange={(e) => setTemplateFields({ ...templateFields, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={templateFields[field.key] || ''}
                          onChange={(e) => setTemplateFields({ ...templateFields, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Upload for non-template contracts */}
            {!isTemplate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload a file or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">PDF up to 10MB</span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      className="sr-only"
                    />
                  </div>
                </div>
                {formData.file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : contract ? 'Update Contract' : 'Create Contract'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContractViewer = ({ isOpen, onClose, contract }) => {
  if (!isOpen || !contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{contract.name}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {contract.content ? (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-lg">
                {contract.content}
              </pre>
            </div>
          ) : contract.pdf_file_path ? (
            <iframe
              src={contract.pdf_file_path}
              title="Contract PDF"
              className="w-full h-96 border rounded-lg"
            />
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No content available for this contract</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FolderModal = ({ isOpen, onClose, onSave, saving }) => {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFolderName('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSave({ name: folderName.trim() });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Create New Folder</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter folder name..."
              autoFocus
              required
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !folderName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContractTable = ({ contracts, onView, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white mr-3">
                      <DocumentTextIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{contract.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {contract.type || 'Contract'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(contract.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(contract.expiry_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(contract)}
                      className="text-purple-600 hover:text-purple-900 p-1"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(contract)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(contract)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contracts.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first contract.</p>
        </div>
      )}
    </div>
  );
};

const Contracts = () => {
  const { currentOrganization } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'grid' or 'table'
  const [showEditor, setShowEditor] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [editingContract, setEditingContract] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentOrganization) {
      loadContracts();
      loadFolders();
    }
  }, [currentOrganization]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const data = await getContracts(currentOrganization.organization_id);
      setContracts(data);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await getContractFolders(currentOrganization.organization_id);
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const handleSaveContract = async (contractData) => {
    try {
      if (contractData.content) {
        // Template-based contract
        await createContract({
          name: contractData.name,
          description: contractData.description || contractData.content.substring(0, 100) + '...',
          folder_id: contractData.folder_id || null,
          status: contractData.status || 'draft',
          content: contractData.content
        }, currentOrganization.organization_id);
      } else if (contractData.file) {
        // File-based contract
        const contract = await createContract({
          name: contractData.name,
          description: contractData.description,
          folder_id: contractData.folder_id || null
        }, currentOrganization.organization_id);
        
        await uploadContractPDF(contractData.file, contract.id, currentOrganization.organization_id);
      }
      
      loadContracts();
      setShowEditor(false);
      setEditingContract(null);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  const handleDeleteContract = async (contract) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await deleteContract(contract.id);
        loadContracts();
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const handleCreateFolder = async (folderData) => {
    setSaving(true);
    try {
      await createContractFolder(folderData, currentOrganization.organization_id);
      await loadFolders();
      setShowFolderModal(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contract.description && contract.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || contract.folder_id === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  if (!currentOrganization) return <div>Select an organization</div>;
  if (loading) return <div>Loading contracts...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage your legal contracts and agreements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowTemplates(true)}
            className="inline-flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create from Template
          </button>
          <button
            onClick={() => { setEditingContract(null); setSelectedTemplate(null); setShowEditor(true); }}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Upload Contract
          </button>
        </div>
      </div>

      {/* Search and Folder Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Folders ({contracts.length})</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name} ({contracts.filter(c => c.folder_id === folder.id).length})
                </option>
              ))}
            </select>
            
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => setShowFolderModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              New Folder
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredContracts.length} contracts found</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-100 rounded-full"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-100 rounded-full"></div>
              <span>Draft</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-100 rounded-full"></div>
              <span>Expired</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Display */}
      {filteredContracts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first contract.</p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Use Template
            </button>
            <button
              onClick={() => { setEditingContract(null); setSelectedTemplate(null); setShowEditor(true); }}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Upload Contract
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <ContractTable
          contracts={filteredContracts}
          onView={(contract) => { setSelectedContract(contract); setShowViewer(true); }}
          onEdit={(contract) => { setEditingContract(contract); setSelectedTemplate(null); setShowEditor(true); }}
          onDelete={handleDeleteContract}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={(contract) => { setSelectedContract(contract); setShowViewer(true); }}
              onEdit={(contract) => { setEditingContract(contract); setSelectedTemplate(null); setShowEditor(true); }}
              onDelete={handleDeleteContract}
            />
          ))}
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Choose a Contract Template</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contractTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={(template) => {
                      setSelectedTemplate(template);
                      setShowTemplates(false);
                      setShowEditor(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Editor Modal */}
      <ContractEditor
        isOpen={showEditor}
        onClose={() => { setShowEditor(false); setEditingContract(null); setSelectedTemplate(null); }}
        contract={editingContract}
        onSave={handleSaveContract}
        isTemplate={!!selectedTemplate}
        templateData={selectedTemplate}
      />

      {/* Contract Viewer Modal */}
      <ContractViewer
        isOpen={showViewer}
        onClose={() => { setShowViewer(false); setSelectedContract(null); }}
        contract={selectedContract}
      />

      {/* Folder Modal */}
      <FolderModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSave={handleCreateFolder}
        saving={saving}
      />
    </div>
  );
};

export default Contracts;
