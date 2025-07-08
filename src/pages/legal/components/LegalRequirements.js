import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const RequirementModal = ({ isOpen, onClose, requirement, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'compliance',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    status: 'not_started',
    notes: ''
  });

  useEffect(() => {
    if (requirement) {
      setFormData({
        title: requirement.title || '',
        description: requirement.description || '',
        category: requirement.category || 'compliance',
        priority: requirement.priority || 'medium',
        dueDate: requirement.dueDate || '',
        assignedTo: requirement.assignedTo || '',
        status: requirement.status || 'not_started',
        notes: requirement.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'compliance',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
        status: 'not_started',
        notes: ''
      });
    }
  }, [requirement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {requirement ? 'Edit Requirement' : 'Add Legal Requirement'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">&times;</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="e.g., GDPR Compliance Review"
              required
            />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="Describe what needs to be done..."
            />
                  </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="compliance">Compliance</option>
                <option value="data_protection">Data Protection</option>
                <option value="employment">Employment Law</option>
                <option value="corporate">Corporate Governance</option>
                <option value="intellectual_property">Intellectual Property</option>
                <option value="contracts">Contracts</option>
                <option value="insurance">Insurance</option>
                <option value="tax">Tax & Accounting</option>
              </select>
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
                  </div>
              </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
                  </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              </div>
                  </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="e.g., Legal Team, HR Manager"
            />
              </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="Additional notes, links to documents, etc..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Cancel
                </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              {requirement ? 'Update' : 'Add'} Requirement
            </button>
                  </div>
        </form>
              </div>
                  </div>
  );
};

const ComplianceChecklist = ({ onAddRequirement }) => {
  const commonRequirements = [
    {
      category: 'Data Protection',
      icon: ShieldCheckIcon,
      color: 'bg-blue-500',
      items: [
        { title: 'GDPR Privacy Policy', description: 'Create and publish GDPR-compliant privacy policy' },
        { title: 'Data Processing Audit', description: 'Review all data processing activities' },
        { title: 'Cookie Consent Setup', description: 'Implement cookie consent management' },
        { title: 'Data Subject Rights Process', description: 'Establish process for data requests' }
      ]
    },
    {
      category: 'Employment Law',
      icon: UserGroupIcon,
      color: 'bg-green-500',
      items: [
        { title: 'Employee Handbook', description: 'Create comprehensive employee handbook' },
        { title: 'Workplace Policies', description: 'Draft anti-discrimination and harassment policies' },
        { title: 'Employment Contracts', description: 'Review and update employment agreements' },
        { title: 'Pension Auto-Enrollment', description: 'Set up workplace pension scheme' }
      ]
    },
    {
      category: 'Corporate Governance',
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
      items: [
        { title: 'Articles of Association', description: 'File constitutional documents' },
        { title: 'Director Duties Training', description: 'Ensure directors understand their duties' },
        { title: 'Board Meeting Minutes', description: 'Establish proper meeting documentation' },
        { title: 'Share Register Maintenance', description: 'Keep accurate shareholder records' }
      ]
    },
    {
      category: 'Compliance Filings',
      icon: DocumentTextIcon,
      color: 'bg-orange-500',
      items: [
        { title: 'Annual Confirmation Statement', description: 'File yearly company information with Companies House' },
        { title: 'Annual Accounts', description: 'Prepare and file annual financial statements' },
        { title: 'VAT Registration', description: 'Register for VAT if revenue exceeds threshold' },
        { title: 'PAYE Setup', description: 'Register for payroll taxes when hiring employees' }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Compliance Checklist</h3>
        <p className="text-sm text-gray-600">Click items to add to your requirements</p>
              </div>

      {commonRequirements.map((category, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 ${category.color} rounded flex items-center justify-center`}>
                <category.icon className="w-4 h-4 text-white" />
                </div>
              <h4 className="text-base font-medium text-gray-900">{category.category}</h4>
                </div>
                </div>
          <div className="p-4">
            <div className="grid gap-2">
              {category.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  onClick={() => onAddRequirement({
                    title: item.title,
                    description: item.description,
                    category: category.category.toLowerCase().replace(' ', '_'),
                    priority: 'medium'
                  })}
                  className="flex items-start space-x-3 p-2 border border-gray-200 rounded hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors group"
                >
                  <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 group-hover:text-purple-900">{item.title}</h5>
                    <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
              </div>
            </div>
              ))}
        </div>
      </div>
        </div>
      ))}
    </div>
  );
};

const RequirementsWizard = ({ isOpen, onClose, onAddRequirements }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companySize: '',
    industry: '',
    location: '',
    hasEmployees: '',
    processesData: '',
    dataTypes: [],
    revenue: '',
    hasWebsite: '',
    hasOnlinePayments: '',
    businessType: ''
  });

  const steps = [
    { id: 1, title: 'Company Basics', description: 'Tell us about your company' },
    { id: 2, title: 'Business Operations', description: 'How does your business operate?' },
    { id: 3, title: 'Data & Privacy', description: 'What data do you handle?' },
    { id: 4, title: 'Results', description: 'Your legal requirements' }
  ];

  const generateRequirements = () => {
    const requirements = [];

    // Corporate governance (all companies)
    requirements.push({
      title: 'Annual Confirmation Statement',
      description: 'File annual confirmation statement with Companies House',
      category: 'compliance',
      priority: 'critical',
      reason: 'Required for all UK companies'
    });

    // Employee-related requirements
    if (formData.hasEmployees === 'yes') {
      requirements.push({
        title: 'Employee Handbook',
        description: 'Create comprehensive employee handbook with policies',
        category: 'employment',
        priority: 'high',
        reason: 'Required when you have employees'
      });

      requirements.push({
        title: 'PAYE Registration',
        description: 'Register for payroll taxes with HMRC',
        category: 'tax',
        priority: 'critical',
        reason: 'Mandatory for employers'
      });

      requirements.push({
        title: 'Workplace Pension Setup',
        description: 'Set up auto-enrollment pension scheme',
        category: 'employment',
        priority: 'high',
        reason: 'Required for all employers'
      });
    }

    // Revenue-based requirements
    if (formData.revenue && parseInt(formData.revenue) >= 85000) {
      requirements.push({
        title: 'VAT Registration',
        description: 'Register for VAT with HMRC',
        category: 'tax',
        priority: 'critical',
        reason: 'Required when revenue exceeds £85,000'
      });
    }

    // Data protection requirements
    if (formData.processesData === 'yes') {
      requirements.push({
        title: 'GDPR Privacy Policy',
        description: 'Create and publish GDPR-compliant privacy policy',
        category: 'data_protection',
        priority: 'high',
        reason: 'Required when processing personal data'
      });

      requirements.push({
        title: 'Data Processing Records',
        description: 'Maintain records of processing activities',
        category: 'data_protection',
        priority: 'medium',
        reason: 'GDPR compliance requirement'
      });

      if (formData.dataTypes.includes('sensitive')) {
        requirements.push({
          title: 'Data Protection Impact Assessment',
          description: 'Conduct DPIA for sensitive data processing',
          category: 'data_protection',
          priority: 'high',
          reason: 'Required for sensitive data processing'
        });
      }
    }

    // Website and online business requirements
    if (formData.hasWebsite === 'yes') {
      requirements.push({
        title: 'Cookie Consent Policy',
        description: 'Implement cookie consent management',
        category: 'data_protection',
        priority: 'medium',
        reason: 'Required for websites using cookies'
      });

      requirements.push({
        title: 'Terms of Service',
        description: 'Create terms of service for your website',
        category: 'contracts',
        priority: 'medium',
        reason: 'Recommended for all websites'
      });
    }

    if (formData.hasOnlinePayments === 'yes') {
      requirements.push({
        title: 'PCI DSS Compliance',
        description: 'Ensure payment card data security standards',
        category: 'data_protection',
        priority: 'high',
        reason: 'Required for online payment processing'
      });
    }

    // Industry-specific requirements
    if (formData.industry === 'healthcare') {
      requirements.push({
        title: 'Medical Device Registration',
        description: 'Register medical devices with MHRA',
        category: 'compliance',
        priority: 'critical',
        reason: 'Required for healthcare businesses'
      });
    }

    if (formData.industry === 'finance') {
      requirements.push({
        title: 'FCA Authorization',
        description: 'Obtain Financial Conduct Authority authorization',
        category: 'compliance',
        priority: 'critical',
        reason: 'Required for financial services'
      });
    }

    return requirements;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const requirements = generateRequirements();
    onAddRequirements(requirements);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Legal Requirements Wizard</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">&times;</button>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id ? 'bg-white text-purple-600' : 'bg-purple-500 text-white'
                  }`}>
                    {currentStep > step.id ? <CheckCircleIcon className="w-5 h-5" /> : step.id}
          </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ml-2 ${currentStep > step.id ? 'bg-white' : 'bg-purple-400'}`} />
                  )}
        </div>
              ))}
      </div>
            <p className="text-purple-100 text-sm mt-2">{steps[currentStep - 1]?.description}</p>
                    </div>
                  </div>

        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Company Basics</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company size</label>
                <div className="grid grid-cols-2 gap-3">
                  {['1-10 employees', '11-50 employees', '51-250 employees', '250+ employees'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFormData({...formData, companySize: size})}
                      className={`p-3 text-left border rounded-lg ${
                        formData.companySize === size ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm font-medium">{size}</span>
                    </button>
                  ))}
      </div>
    </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Financial Services</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="education">Education</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
        </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary business location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select location</option>
                  <option value="uk">United Kingdom</option>
                  <option value="eu">European Union</option>
                  <option value="us">United States</option>
                  <option value="global">Global/Multiple locations</option>
                </select>
      </div>
    </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Business Operations</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Do you have employees?</label>
                <div className="flex space-x-4">
                  {['yes', 'no'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, hasEmployees: option})}
                      className={`px-4 py-2 border rounded-lg ${
                        formData.hasEmployees === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option === 'yes' ? 'Yes' : 'No'}
        </button>
                  ))}
      </div>
    </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual revenue (£)</label>
                <select
                  value={formData.revenue}
                  onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select revenue range</option>
                  <option value="0">£0 - £10,000</option>
                  <option value="10000">£10,000 - £50,000</option>
                  <option value="50000">£50,000 - £85,000</option>
                  <option value="85000">£85,000 - £250,000</option>
                  <option value="250000">£250,000+</option>
                </select>
        </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Do you have a website?</label>
                <div className="flex space-x-4">
                  {['yes', 'no'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, hasWebsite: option})}
                      className={`px-4 py-2 border rounded-lg ${
                        formData.hasWebsite === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option === 'yes' ? 'Yes' : 'No'}
          </button>
                  ))}
        </div>
      </div>

    <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Do you process online payments?</label>
                <div className="flex space-x-4">
                  {['yes', 'no'].map((option) => (
        <button
                      key={option}
                      onClick={() => setFormData({...formData, hasOnlinePayments: option})}
                      className={`px-4 py-2 border rounded-lg ${
                        formData.hasOnlinePayments === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option === 'yes' ? 'Yes' : 'No'}
        </button>
                  ))}
      </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Data & Privacy</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Do you collect or process personal data?</label>
                <div className="flex space-x-4">
                  {['yes', 'no'].map((option) => (
            <button
                      key={option}
                      onClick={() => setFormData({...formData, processesData: option})}
                      className={`px-4 py-2 border rounded-lg ${
                        formData.processesData === option ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option === 'yes' ? 'Yes' : 'No'}
            </button>
                  ))}
                </div>
              </div>

              {formData.processesData === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">What types of data do you handle?</label>
                  <div className="space-y-2">
                    {[
                      { id: 'basic', label: 'Basic personal data (names, emails, addresses)' },
                      { id: 'sensitive', label: 'Sensitive data (health, financial, legal)' },
                      { id: 'children', label: 'Children\'s data (under 16)' },
                      { id: 'international', label: 'International data transfers' }
                    ].map((type) => (
                      <label key={type.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dataTypes.includes(type.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, dataTypes: [...formData.dataTypes, type.id]});
                            } else {
                              setFormData({...formData, dataTypes: formData.dataTypes.filter(t => t !== type.id)});
                            }
                          }}
                          className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Your Legal Requirements</h3>
              <p className="text-gray-600">Based on your answers, here are the legal requirements that apply to your business:</p>
              
              <div className="space-y-3">
                {generateRequirements().map((req, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{req.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            req.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            req.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {req.priority}
                          </span>
                          <span className="text-xs text-gray-500">{req.reason}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
            <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
              currentStep === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
            </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
            >
              Next
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Add Requirements
              <CheckCircleIcon className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LegalRequirements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requirements');
  const [requirements, setRequirements] = useState([
    {
      id: 1,
      title: 'GDPR Compliance Audit',
      description: 'Complete review of data processing activities and privacy policies',
      category: 'data_protection',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-02-15',
      assignedTo: 'Legal Team',
      notes: 'Waiting for vendor data processing agreements'
    },
    {
      id: 2,
      title: 'Employment Handbook Update',
      description: 'Update employee handbook with new remote work policies',
      category: 'employment',
      priority: 'medium',
      status: 'not_started',
      dueDate: '2024-03-01',
      assignedTo: 'HR Manager',
      notes: ''
    },
    {
      id: 3,
      title: 'Annual Confirmation Statement',
      description: 'File annual confirmation statement with Companies House',
      category: 'compliance',
      priority: 'critical',
      status: 'overdue',
      dueDate: '2024-01-15',
      assignedTo: 'Finance Team',
      notes: 'Due date passed - immediate action required'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <ClockIcon className="w-4 h-4 text-blue-600" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />;
      case 'review':
        return <DocumentTextIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <XCircleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      review: 'bg-purple-100 text-purple-800',
      not_started: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      completed: 'Completed',
      in_progress: 'In Progress',
      overdue: 'Overdue',
      review: 'Under Review',
      not_started: 'Not Started'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      data_protection: ShieldCheckIcon,
      employment: UserGroupIcon,
      corporate: BuildingOfficeIcon,
      compliance: DocumentTextIcon,
      intellectual_property: GlobeAltIcon,
      contracts: DocumentTextIcon,
      insurance: ShieldCheckIcon,
      tax: DocumentTextIcon
    };
    
    const Icon = icons[category] || DocumentTextIcon;
    return <Icon className="w-4 h-4" />;
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || req.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSaveRequirement = (formData) => {
    if (editingRequirement) {
      setRequirements(requirements.map(req => 
        req.id === editingRequirement.id 
          ? { ...req, ...formData }
          : req
      ));
    } else {
      const newRequirement = {
        id: Date.now(),
        ...formData
      };
      setRequirements([...requirements, newRequirement]);
    }
    setEditingRequirement(null);
  };

  const handleAddFromChecklist = (checklistItem) => {
    const newRequirement = {
      id: Date.now(),
      ...checklistItem,
      status: 'not_started',
      dueDate: '',
      assignedTo: '',
      notes: ''
    };
    setRequirements([...requirements, newRequirement]);
  };

  const handleEditRequirement = (requirement) => {
    setEditingRequirement(requirement);
    setShowModal(true);
  };

  const handleDeleteRequirement = (id) => {
    setRequirements(requirements.filter(req => req.id !== id));
  };

  const getOverviewStats = () => {
    const total = requirements.length;
    const completed = requirements.filter(r => r.status === 'completed').length;
    const overdue = requirements.filter(r => r.status === 'overdue').length;
    const inProgress = requirements.filter(r => r.status === 'in_progress').length;

    return { total, completed, overdue, inProgress };
  };

  const stats = getOverviewStats();

  const handleAddRequirementsFromWizard = (wizardRequirements) => {
    const newRequirements = wizardRequirements.map(req => ({
      id: Date.now() + Math.random(),
      ...req,
      status: 'not_started',
      dueDate: '',
      assignedTo: '',
      notes: req.reason || ''
    }));
    setRequirements([...requirements, ...newRequirements]);
  };

  return (
            <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
              <div>
          <h2 className="text-xl font-semibold text-gray-900">Legal Requirements</h2>
          <p className="text-gray-600 text-sm">Manage compliance requirements and legal obligations</p>
              </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
          >
            <QuestionMarkCircleIcon className="w-4 h-4 mr-1.5" />
            Requirements Wizard
          </button>
          <button
            onClick={() => {
              setEditingRequirement(null);
              setShowModal(true);
            }}
            className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Add Requirement
          </button>
              </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DocumentTextIcon className="w-6 h-6 text-gray-600 mr-3" />
              <div>
              <p className="text-xs font-medium text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-500">Completed</p>
              <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-500">In Progress</p>
              <p className="text-lg font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
                </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-500">Overdue</p>
              <p className="text-lg font-semibold text-gray-900">{stats.overdue}</p>
            </div>
                </div>
              </div>
            </div>

      {/* Tabs */}
            <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
                <button
            onClick={() => setActiveTab('requirements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requirements'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
            My Requirements
                </button>
                <button
            onClick={() => setActiveTab('checklist')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'checklist'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
            Compliance Checklist
                </button>
              </nav>
            </div>

      {/* Content */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                    </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Under Review</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="compliance">Compliance</option>
                  <option value="data_protection">Data Protection</option>
                  <option value="employment">Employment Law</option>
                  <option value="corporate">Corporate Governance</option>
                  <option value="intellectual_property">Intellectual Property</option>
                  <option value="contracts">Contracts</option>
                  <option value="insurance">Insurance</option>
                  <option value="tax">Tax & Accounting</option>
                </select>
                  </div>
                      </div>
                      </div>

          {/* Requirements List */}
          <div className="space-y-3">
            {filteredRequirements.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <DocumentTextIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-2">No requirements found</h3>
                <p className="text-gray-600 mb-3 text-sm">
                  {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
                    ? 'Try adjusting your filters or search terms'
                    : 'Get started by adding your first legal requirement'
                  }
                </p>
                <button
                  onClick={() => {
                    setEditingRequirement(null);
                    setShowModal(true);
                  }}
                  className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1.5" />
                  Add Requirement
                </button>
                      </div>
            ) : (
              filteredRequirements.map((requirement) => (
                <div key={requirement.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(requirement.status)}
                        <h3 className="text-base font-medium text-gray-900">{requirement.title}</h3>
                        {getPriorityBadge(requirement.priority)}
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-sm">{requirement.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(requirement.category)}
                          <span className="capitalize text-xs">{requirement.category.replace('_', ' ')}</span>
                  </div>

                        {requirement.dueDate && (
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-xs">{new Date(requirement.dueDate).toLocaleDateString()}</span>
                </div>
              )}
              
                        {requirement.assignedTo && (
                          <div className="flex items-center space-x-1">
                            <UserGroupIcon className="w-4 h-4" />
                            <span className="text-xs">{requirement.assignedTo}</span>
                </div>
              )}
                      </div>
                      
                      {requirement.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                          {requirement.notes}
                </div>
              )}
            </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {getStatusBadge(requirement.status)}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRequirement(requirement)}
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                        >
                          Edit
                </button>
                        <button
                          onClick={() => handleDeleteRequirement(requirement.id)}
                          className="text-red-600 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                </button>
              </div>
            </div>
          </div>
        </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <ComplianceChecklist onAddRequirement={handleAddFromChecklist} />
      )}

      {/* Wizards and Modals */}
      <RequirementsWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onAddRequirements={handleAddRequirementsFromWizard}
      />

      <RequirementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        requirement={editingRequirement}
        onSave={handleSaveRequirement}
      />
    </div>
  );
} 