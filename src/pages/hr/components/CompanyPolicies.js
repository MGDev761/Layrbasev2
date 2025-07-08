import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPolicies, addPolicy, updatePolicy, deletePolicy, uploadPolicyFile } from '../../../services/policiesService';
import { getCompanyProfile } from '../../../services/legalService';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  CloudArrowUpIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  TagIcon,
  UserGroupIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const initialForm = {
  name: '',
  category: '',
  description: '',
  version: '1.0',
  last_updated: '',
  file: null,
  file_url: '',
  department: '',
  required_reading: false
};

const policyTemplates = [
  {
    id: 'employee-handbook',
    name: 'Employee Handbook',
    description: 'Comprehensive guide covering company values, benefits, and expectations',
    category: 'HR',
    icon: DocumentTextIcon,
    sections: [
      { title: 'Welcome Message', content: 'Welcome to our company! This handbook will guide you through our culture, values, and expectations.' },
      { title: 'Company Values', content: 'Our core values drive everything we do and shape our company culture.' },
      { title: 'Code of Conduct', content: 'All employees are expected to act professionally and ethically at all times.' },
      { title: 'Benefits & Compensation', content: 'Overview of employee benefits, compensation structure, and perks.' },
      { title: 'Leave Policies', content: 'Details about vacation, sick leave, parental leave, and other time-off policies.' }
    ]
  },
  {
    id: 'remote-work',
    name: 'Remote Work Policy',
    description: 'Guidelines for remote work arrangements and expectations',
    category: 'Workplace',
    icon: BuildingOfficeIcon,
    sections: [
      { title: 'Overview', content: 'This policy outlines the guidelines and expectations for remote work arrangements.' },
      { title: 'Eligibility', content: 'Criteria for employees eligible for remote work opportunities.' },
      { title: 'Equipment & Security', content: 'Requirements for equipment, security measures, and data protection.' },
      { title: 'Communication Standards', content: 'Expected communication protocols and meeting schedules.' }
    ]
  },
  {
    id: 'data-privacy',
    name: 'Data Privacy Policy',
    description: 'Data protection and privacy guidelines for handling sensitive information',
    category: 'Technology',
    icon: CheckCircleIcon,
    sections: [
      { title: 'Purpose', content: 'This policy ensures compliance with data protection regulations and protects sensitive information.' },
      { title: 'Data Classification', content: 'How to identify and classify different types of data.' },
      { title: 'Handling Procedures', content: 'Proper procedures for collecting, storing, and sharing data.' },
      { title: 'Incident Response', content: 'Steps to take in case of a data breach or security incident.' }
    ]
  },
  {
    id: 'expenses',
    name: 'Expense Policy',
    description: 'Guidelines for business expenses and reimbursement procedures',
    category: 'Finance',
    icon: TagIcon,
    sections: [
      { title: 'Policy Overview', content: 'Guidelines for appropriate business expenses and reimbursement procedures.' },
      { title: 'Eligible Expenses', content: 'Types of expenses that qualify for reimbursement.' },
      { title: 'Approval Process', content: 'Required approvals for different expense categories and amounts.' },
      { title: 'Submission Requirements', content: 'How to submit expenses and required documentation.' }
    ]
  }
];

const PolicyCard = ({ policy, onEdit, onDelete, onView }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
          <DocumentTextIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{policy.name}</h3>
          <p className="text-sm text-gray-500">{policy.category}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {policy.required_reading && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            Required
          </span>
        )}
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          v{policy.version}
        </span>
      </div>
    </div>
    
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{policy.description}</p>
    
    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
      <div className="flex items-center space-x-1">
        <ClockIcon className="w-4 h-4" />
        <span>Updated {new Date(policy.last_updated).toLocaleDateString()}</span>
      </div>
      {policy.department && (
        <div className="flex items-center space-x-1">
          <UserGroupIcon className="w-4 h-4" />
          <span>{policy.department}</span>
        </div>
      )}
    </div>
    
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onView(policy)}
        className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
      >
        View Policy
      </button>
      <button
        onClick={() => onEdit(policy)}
        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <PencilIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(policy.id)}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  </div>
);

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

const PolicyEditor = ({ isOpen, onClose, policy, onSave, isTemplate = false, templateData = null }) => {
  const [formData, setFormData] = useState(initialForm);
  const [sections, setSections] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (policy) {
        setFormData({
          name: policy.name || '',
          category: policy.category || '',
          description: policy.description || '',
          version: policy.version || '1.0',
          last_updated: policy.last_updated || '',
          file: null,
          file_url: policy.file_url || '',
          department: policy.department || '',
          required_reading: !!policy.required_reading
        });
      } else if (isTemplate && templateData) {
        setFormData({
          ...initialForm,
          name: templateData.name,
          category: templateData.category,
          description: templateData.description
        });
        setSections([...templateData.sections]);
      } else {
        setFormData(initialForm);
        setSections([]);
      }
    }
  }, [isOpen, policy, isTemplate, templateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const policyData = {
        ...formData,
        last_updated: new Date().toISOString().split('T')[0]
      };

      if (isTemplate) {
        policyData.description = JSON.stringify({ sections, originalDescription: formData.description });
      }

      await onSave(policyData);
      onClose();
    } catch (error) {
      console.error('Error saving policy:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {isTemplate ? `Create Policy: ${templateData?.name}` : policy ? 'Edit Policy' : 'Add New Policy'}
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
                  Policy Name *
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
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Workplace">Workplace</option>
                  <option value="Technology">Technology</option>
                  <option value="General">General</option>
                  <option value="Communication">Communication</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., All Departments, Engineering, Sales"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
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
                placeholder="Brief description of the policy..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required_reading"
                checked={formData.required_reading}
                onChange={(e) => setFormData({ ...formData, required_reading: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="required_reading" className="ml-2 block text-sm text-gray-900">
                Mark as required reading for all employees
              </label>
            </div>

            {/* File Upload for non-template policies */}
            {!isTemplate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload a file or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
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

            {/* Sections for template policies */}
            {isTemplate && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Policy Sections</h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Section
                  </button>
                </div>
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                          placeholder="Section title"
                          className="flex-1 font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                        placeholder="Section content..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
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
                {saving ? 'Saving...' : policy ? 'Update Policy' : 'Create Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PolicyViewer = ({ isOpen, onClose, policy }) => {
  if (!isOpen || !policy) return null;

  let parsedContent = null;
  try {
    parsedContent = JSON.parse(policy.description);
  } catch (e) {
    // Not JSON, treat as regular description
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{policy.name}</h2>
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
          <div className="prose max-w-none">
            {parsedContent?.sections ? (
              <div className="space-y-6">
                {parsedContent.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                    <div className="text-gray-700 whitespace-pre-line">{section.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-4">{policy.description}</p>
                {policy.file_url && (
                  <a
                    href={policy.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    View Document
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyPolicies = () => {
  const { currentOrganization } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const loadPolicies = async () => {
    if (!currentOrganization) return;
    setLoading(true);
    try {
      const data = await fetchPolicies(currentOrganization.organization_id);
      setPolicies(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, [currentOrganization]);

  const handleSavePolicy = async (policyData) => {
    try {
      let file_url = policyData.file_url;
      if (policyData.file) {
        file_url = await uploadPolicyFile(policyData.file, currentOrganization.organization_id);
      }

      const finalData = { 
        ...policyData, 
        file_url, 
        organization_id: currentOrganization.organization_id 
      };

      if (editingPolicy) {
        await updatePolicy(editingPolicy.id, finalData);
      } else {
        await addPolicy(finalData);
      }
      
      loadPolicies();
      setShowEditor(false);
      setEditingPolicy(null);
      setSelectedTemplate(null);
    } catch (err) {
      setError(err);
    }
  };

  const handleDeletePolicy = async () => {
    try {
      await deletePolicy(deleteId);
      loadPolicies();
      setDeleteModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      setError(err);
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'HR', 'Finance', 'Workplace', 'Technology', 'General', 'Communication'];

  if (!currentOrganization) return <div>Select an organization</div>;
  if (loading) return <div>Loading policies...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Policies</h1>
          <p className="text-gray-600 mt-1">Manage your company policies and employee guidelines</p>
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
            onClick={() => { setEditingPolicy(null); setSelectedTemplate(null); setShowEditor(true); }}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Policy
        </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
          </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredPolicies.length} policies found</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-100 rounded-full"></div>
              <span>Required Reading</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-100 rounded-full"></div>
              <span>Version Controlled</span>
            </div>
          </div>
        </div>
        </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Choose a Policy Template</h2>
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
                {policyTemplates.map((template) => (
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

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first company policy.</p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Use Template
                    </button>
            <button
              onClick={() => { setEditingPolicy(null); setSelectedTemplate(null); setShowEditor(true); }}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Policy
                    </button>
                  </div>
                </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onEdit={(policy) => { setEditingPolicy(policy); setSelectedTemplate(null); setShowEditor(true); }}
              onDelete={(id) => { setDeleteId(id); setDeleteModalOpen(true); }}
              onView={(policy) => { setSelectedPolicy(policy); setShowViewer(true); }}
            />
          ))}
                </div>
              )}

      {/* Policy Editor Modal */}
      <PolicyEditor
        isOpen={showEditor}
        onClose={() => { setShowEditor(false); setEditingPolicy(null); setSelectedTemplate(null); }}
        policy={editingPolicy}
        onSave={handleSavePolicy}
        isTemplate={!!selectedTemplate}
        templateData={selectedTemplate}
      />

      {/* Policy Viewer Modal */}
      <PolicyViewer
        isOpen={showViewer}
        onClose={() => { setShowViewer(false); setSelectedPolicy(null); }}
        policy={selectedPolicy}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Policy</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this policy? This action cannot be undone.</p>
            <div className="flex items-center justify-end space-x-3">
                    <button
                onClick={() => { setDeleteModalOpen(false); setDeleteId(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
                    <button
                onClick={handleDeletePolicy}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPolicies; 