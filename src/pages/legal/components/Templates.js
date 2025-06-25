import React, { useState, useEffect, useCallback } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon, XMarkIcon, PencilSquareIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getTemplates, createContractFromTemplate, getContractFolders, generateContractPDF, saveGeneratedPDF, getCompanyProfile } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';

// Move CustomizeModal outside the Templates component
const CustomizeModal = React.memo(({
  show, onClose, onSave, saving,
  selectedTemplate, customizedName, setCustomizedName,
  customizedData, setCustomizedData, handleFieldChange,
  selectedFolder, setSelectedFolder, folders
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Customize {selectedTemplate?.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="flex">
              <div className="w-1/4">
                <h4 className="text-sm font-bold text-gray-900">Basic Information</h4>
              </div>
              <div className="w-3/4 bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contract Name</label>
                  <input
                    type="text"
                    value={customizedName}
                    onChange={(e) => setCustomizedName(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a name for this contract"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Folder</label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a folder (optional)</option>
                    {folders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template Fields Section */}
            {selectedTemplate?.fields && selectedTemplate.fields.length > 0 && (
              <div className="flex">
                <div className="w-1/4">
                  <h4 className="text-sm font-bold text-gray-900">Template Fields</h4>
                </div>
                <div className="w-3/4 bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {selectedTemplate.fields.map(field => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={customizedData[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={2}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={customizedData[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save to My Contracts'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const Templates = () => {
  const { currentOrganization } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customizedData, setCustomizedData] = useState({});
  const [customizedName, setCustomizedName] = useState('');
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(null);

  useEffect(() => {
    loadTemplates();
    if (currentOrganization) {
      loadFolders(currentOrganization.organization_id);
      getCompanyProfile(currentOrganization.organization_id).then(setCompanyProfile);
    }
  }, [currentOrganization]);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
      if (data.length > 0) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async (orgId) => {
    try {
      if (!orgId) return;
      const data = await getContractFolders(orgId);
      setFolders(data);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomize = () => {
    setCustomizedName(`${selectedTemplate.name} - Customized`);
    setCustomizedData({});
    setSelectedFolder('');
    setShowCustomizeModal(true);
  };

  const handleFieldChange = useCallback((key, value) => {
    setCustomizedData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleSaveCustomized = async () => {
    if (!customizedName.trim()) {
      alert('Please enter a contract name');
      return;
    }

    setSaving(true);
    try {
      const contractData = {
        name: customizedName,
        description: `Customized version of ${selectedTemplate.name}`,
        data: customizedData,
        folderId: selectedFolder || null,
        effectiveDate: customizedData.effectiveDate || customizedData.startDate || null,
        expiryDate: customizedData.expiryDate || null
      };

      if (!currentOrganization) throw new Error('No organization selected.');
      
      // Create the contract in the database
      const contractId = await createContractFromTemplate(selectedTemplate.id, {
        ...contractData,
        organizationId: currentOrganization.organization_id
      });
      
      // Generate PDF from the template and contract data
      const pdfFile = await generateContractPDF(contractData, selectedTemplate);
      
      // Save the generated PDF to storage and update the contract
      await saveGeneratedPDF(pdfFile, contractId, currentOrganization.organization_id);
      
      alert('Customized contract saved to My Contracts with PDF!');
      setShowCustomizeModal(false);
      setTimeout(() => {
        setCustomizedData({});
        setCustomizedName('');
        setSelectedFolder('');
      }, 300);
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error saving contract. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Templates Library</h3>
          <p className="text-sm text-gray-500 mt-1">Browse and customize pre-built legal templates for your business.</p>
        </div>
        <div className="text-center py-20">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  // Group templates by category
  const templatesByCategory = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Templates Library</h3>
        <p className="text-sm text-gray-500 mt-1">Browse and customize pre-built legal templates for your business.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="space-y-4">
            {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">{category}</h3>
                <ul className="space-y-1">
                  {categoryTemplates.map(template => (
                    <li key={template.id}>
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        disabled={showCustomizeModal}
                        className={`w-full flex items-center p-3 text-left text-sm rounded-md transition-colors ${
                          selectedTemplate?.id === template.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        } ${showCustomizeModal ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <DocumentTextIcon className="h-5 w-5 mr-3" />
                        {template.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-8">
            {selectedTemplate ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h2>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span> {selectedTemplate.category}
                      </p>
                      {selectedTemplate.description && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Description:</span> {selectedTemplate.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleCustomize}
                    className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors ml-4"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-1.5" />
                    Customise
                  </button>
                </div>
                
                <div className="border rounded-lg bg-white overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Template Preview</h3>
                  </div>
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {/* Styled template content */}
                      <div className="space-y-4">
                        {/* Header with centered logo, company info right, and centered title */}
                        <div className="flex flex-col items-center mb-2">
                          {/* Centered logo */}
                          {companyProfile?.logo_url ? (
                            <img src={companyProfile.logo_url} alt="Company Logo" className="w-16 h-16 mb-2 rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mb-2 text-gray-400 text-2xl font-bold">Logo</div>
                          )}
                          {/* Company info right-aligned below logo */}
                          <div className="w-full flex justify-end">
                            <div className="text-right">
                              <div className="text-base font-bold text-gray-900">{companyProfile?.name || 'Company Name'}</div>
                              {companyProfile?.registered_office && (
                                <div className="text-xs text-gray-500 mt-1">{companyProfile.registered_office}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Template content */}
                        <div className="space-y-3">
                          {selectedTemplate.template_content.split('\n').map((line, index) => {
                            if (line.trim() === '') return <br key={index} />;
                            
                            // Check if line contains placeholders
                            const hasPlaceholders = line.includes('[') && line.includes(']');
                            
                            if (hasPlaceholders) {
                              // Style placeholder text
                              const styledLine = line.replace(/\[([^\]]+)\]/g, '<span class="bg-yellow-100 text-yellow-800 px-1 rounded text-xs font-mono">[$1]</span>');
                              return <p key={index} className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: styledLine }} />;
                            } else if (line.trim().toUpperCase() === line.trim() && line.length > 10) {
                              // Likely a heading
                              return <h3 key={index} className="text-base font-bold text-gray-900 mt-4 mb-2">{line}</h3>;
                            } else {
                              return <p key={index} className="text-sm text-gray-700 leading-relaxed">{line}</p>;
                            }
                          })}
                        </div>
                        
                        {/* Footer */}
                        <div className="border-t border-gray-200 pt-4 mt-6">
                          <p className="text-xs text-gray-500 text-center">
                            This document was generated using LayrBase Legal Templates
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCustomizeModal && (
        <CustomizeModal
          show={showCustomizeModal}
          onClose={() => setShowCustomizeModal(false)}
          onSave={handleSaveCustomized}
          saving={saving}
          selectedTemplate={selectedTemplate}
          customizedName={customizedName}
          setCustomizedName={setCustomizedName}
          customizedData={customizedData}
          setCustomizedData={setCustomizedData}
          handleFieldChange={handleFieldChange}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folders={folders}
        />
      )}
    </div>
  );
};

export default Templates; 