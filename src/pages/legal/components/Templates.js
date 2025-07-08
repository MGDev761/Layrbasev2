import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { getTemplates, createContractFromTemplate, getContractFolders } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';

const legalTemplates = [
  {
    id: 'nda-standard',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information shared between parties with this comprehensive NDA template.',
    category: 'Confidentiality',
    icon: '🔒',
    complexity: 'Simple',
    estimatedTime: '10 minutes',
    useCase: 'Before sharing sensitive business information',
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
    description: 'Professional services contract with clear terms and payment conditions.',
    category: 'Commercial',
    icon: '🤝',
    complexity: 'Moderate',
    estimatedTime: '20 minutes',
    useCase: 'When hiring contractors or providing services',
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
    description: 'Independent contractor agreement for professional consulting services.',
    category: 'Professional',
    icon: '💼',
    complexity: 'Moderate',
    estimatedTime: '15 minutes',
    useCase: 'Engaging consultants or providing consulting services',
    fields: [
      { key: 'consultantName', label: 'Consultant Name', type: 'text', placeholder: 'Consultant/Company name' },
      { key: 'clientName', label: 'Client Name', type: 'text', placeholder: 'Client company name' },
      { key: 'hourlyRate', label: 'Hourly Rate', type: 'text', placeholder: '$150/hour' },
      { key: 'maxHours', label: 'Maximum Hours/Month', type: 'number', placeholder: '40' },
      { key: 'deliverables', label: 'Key Deliverables', type: 'textarea', placeholder: 'List expected deliverables...' }
    ]
  },
  {
    id: 'employment-offer',
    name: 'Employment Offer Letter',
    description: 'Formal job offer letter with compensation and benefits details.',
    category: 'Employment',
    icon: '👤',
    complexity: 'Simple',
    estimatedTime: '12 minutes',
    useCase: 'Extending job offers to new employees',
    fields: [
      { key: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'Full name' },
      { key: 'position', label: 'Position Title', type: 'text', placeholder: 'Software Developer' },
      { key: 'salary', label: 'Annual Salary', type: 'text', placeholder: '$75,000' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'reportingTo', label: 'Reports To', type: 'text', placeholder: 'Manager name' }
    ]
  },
  {
    id: 'vendor-agreement',
    name: 'Vendor Agreement',
    description: 'Standard agreement for suppliers and service vendors.',
    category: 'Commercial',
    icon: '🏪',
    complexity: 'Complex',
    estimatedTime: '30 minutes',
    useCase: 'Establishing relationships with suppliers',
    fields: [
      { key: 'vendorName', label: 'Vendor Name', type: 'text', placeholder: 'Vendor company name' },
      { key: 'servicesGoods', label: 'Services/Goods', type: 'textarea', placeholder: 'Description of what vendor provides...' },
      { key: 'termLength', label: 'Contract Term', type: 'text', placeholder: '12 months' },
      { key: 'paymentSchedule', label: 'Payment Schedule', type: 'text', placeholder: 'Monthly' }
    ]
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    description: 'Formal agreement between business partners defining roles and responsibilities.',
    category: 'Foundation',
    icon: '🤜🤛',
    complexity: 'Complex',
    estimatedTime: '45 minutes',
    useCase: 'Starting a business partnership',
    fields: [
      { key: 'partner1Name', label: 'Partner 1 Name', type: 'text', placeholder: 'First partner name' },
      { key: 'partner2Name', label: 'Partner 2 Name', type: 'text', placeholder: 'Second partner name' },
      { key: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Partnership business name' },
      { key: 'partner1Contribution', label: 'Partner 1 Contribution', type: 'text', placeholder: '$50,000' },
      { key: 'partner2Contribution', label: 'Partner 2 Contribution', type: 'text', placeholder: '$50,000' }
    ]
  }
];

const categoryIcons = {
  'Confidentiality': <ShieldCheckIcon className="w-5 h-5" />,
  'Commercial': <BuildingOfficeIcon className="w-5 h-5" />,
  'Professional': <BriefcaseIcon className="w-5 h-5" />,
  'Employment': <UserGroupIcon className="w-5 h-5" />,
  'Foundation': <BookOpenIcon className="w-5 h-5" />
};

const complexityColors = {
  'Simple': 'bg-green-100 text-green-700 border-green-200',
  'Moderate': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Complex': 'bg-red-100 text-red-700 border-red-200'
};

const TemplateCard = ({ template, onUse, onPreview }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{template.icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">
            {template.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1 text-purple-600">
              {categoryIcons[template.category]}
              <span className="text-sm font-medium">{template.category}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${complexityColors[template.complexity]}`}>
        {template.complexity}
      </div>
    </div>
    
    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{template.description}</p>
    
    <div className="space-y-2 mb-6">
      <div className="flex items-center text-xs text-gray-500">
        <ClockIcon className="w-4 h-4 mr-1" />
        <span>{template.estimatedTime}</span>
      </div>
      <div className="flex items-start text-xs text-gray-500">
        <CheckCircleIcon className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
        <span>{template.useCase}</span>
      </div>
    </div>
    
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onUse(template)}
        className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
      >
        <PlusIcon className="w-4 h-4 mr-1" />
        Use Template
      </button>
      <button
        onClick={() => onPreview(template)}
        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <EyeIcon className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const TemplatePreview = ({ isOpen, onClose, template }) => {
  if (!isOpen || !template) return null;

  // Generate sample content with placeholder values
  let sampleContent = template.content;
  if (template.fields) {
    template.fields.forEach(field => {
      const placeholder = field.placeholder || `[${field.label}]`;
      const regex = new RegExp(`{{${field.key}}}`, 'g');
      sampleContent = sampleContent.replace(regex, placeholder);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{template.name}</h2>
                <p className="text-purple-100 text-sm">{template.category} • {template.complexity}</p>
              </div>
            </div>
          <button
            onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
          >
              ×
          </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose max-w-none">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Preview:</strong> This shows the template structure with sample data. 
                When you use this template, you'll fill in your specific information.
              </p>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-6 rounded-lg border">
              {sampleContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateCustomizer = ({ isOpen, onClose, template, onSave, folders }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    folder_id: ''
  });
  const [templateFields, setTemplateFields] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && template) {
      setFormData({
        name: template.name,
        description: template.description,
        folder_id: ''
      });
      
      // Initialize template fields
      const fields = {};
      if (template.fields) {
        template.fields.forEach(field => {
          fields[field.key] = '';
        });
      }
      setTemplateFields(fields);
    }
  }, [isOpen, template]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Generate content with filled fields
      let content = template.content;
      Object.entries(templateFields).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, value || `[${key}]`);
      });

      await onSave({
        name: formData.name,
        description: formData.description,
        folder_id: formData.folder_id || null,
        content,
        status: 'draft'
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{template.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">Customize {template.name}</h2>
                <p className="text-purple-100 text-sm">Fill in the details to create your contract</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Contract Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contract Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder
                  </label>
                  <select
                    value={formData.folder_id}
                    onChange={(e) => setFormData({ ...formData, folder_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">No folder</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Template Fields */}
            {template.fields && template.fields.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">Contract Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.fields.map((field) => (
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        ) : (
                          <input
                            type={field.type}
                          value={templateFields[field.key] || ''}
                          onChange={(e) => setTemplateFields({ ...templateFields, [field.key]: e.target.value })}
                            placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Contract'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Templates = () => {
  const { currentOrganization } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPreview, setShowPreview] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (currentOrganization) {
      loadFolders();
    }
  }, [currentOrganization]);

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
      await createContractFromTemplate({
        name: contractData.name,
        description: contractData.description,
        folder_id: contractData.folder_id,
        content: contractData.content,
        status: contractData.status
      }, currentOrganization.organization_id);
      
      // Show success message or redirect
      alert('Contract created successfully!');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Error creating contract');
    }
  };

  const categories = ['All', ...Array.from(new Set(legalTemplates.map(t => t.category)))];
  
  const filteredTemplates = legalTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Legal Templates</h1>
          <p className="text-gray-600 mt-1">Professional contract templates ready to customize</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <TagIcon className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
                </div>
                
      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={(template) => {
                setSelectedTemplate(template);
                setShowCustomizer(true);
              }}
              onPreview={(template) => {
                setSelectedTemplate(template);
                setShowPreview(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreview
        isOpen={showPreview}
        onClose={() => { setShowPreview(false); setSelectedTemplate(null); }}
        template={selectedTemplate}
      />

      {/* Template Customizer Modal */}
      <TemplateCustomizer
        isOpen={showCustomizer}
        onClose={() => { setShowCustomizer(false); setSelectedTemplate(null); }}
        template={selectedTemplate}
        onSave={handleSaveContract}
        folders={folders}
      />
    </div>
  );
};

export default Templates; 