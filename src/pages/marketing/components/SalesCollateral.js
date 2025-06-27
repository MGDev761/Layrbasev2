import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getSalesCollateral, uploadSalesCollateral, deleteSalesCollateral } from '../../../services/marketingService';
import { supabase } from '../../../lib/supabase';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, why: false, best: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ quick: true, tips: false, faq: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Sales Collateral Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><BookOpenIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><Cog6ToothIcon className="w-5 h-5" /> Platform How-To</button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Introduction</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Sales Collateral is your repository for all sales materials—decks, one-pagers, case studies, and more. Keep your team aligned and your sales process sharp.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Why It's Important</span>{openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.why && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Ensures sales teams use the latest, approved materials</li><li>Improves consistency in messaging and branding</li><li>Speeds up onboarding for new team members</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Best Practice</span>{openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.best && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Organize collateral by type and sales stage</li><li>Archive outdated materials regularly</li><li>Use clear, descriptive file names</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Quick Start</span>{openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.quick && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Upload new collateral, search and filter by type, and download files as needed. Use the upload button to add new materials.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Tips</span>{openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.tips && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Tag collateral for campaigns or sales stages. Use the search bar to quickly locate materials.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">FAQ</span>{openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.faq && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Q: Can I track downloads? <br/>A: Not yet, but analytics are coming soon.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your sales collateral assistant. I can help you organize, update, and share your sales materials.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I keep my sales collateral up to date?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Set a regular review schedule and archive outdated files. Use the uploader to add new versions and keep your team notified.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about sales collateral..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

const SalesCollateral = () => {
  const { currentOrganization } = useAuth();
  const [collateral, setCollateral] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCollateral, setNewCollateral] = useState({
    name: '',
    description: '',
    collateral_type: 'sales_deck'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const collateralTypes = [
    { value: 'sales_deck', label: 'Sales Deck' },
    { value: 'one_pager', label: 'One Pager' },
    { value: 'case_study', label: 'Case Study' },
    { value: 'pricing', label: 'Pricing Sheet' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'calculator', label: 'Calculator' }
  ];

  const filteredCollateral = collateral.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (currentOrganization?.organization_id) {
      loadCollateral();
    }
  }, [currentOrganization]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const loadCollateral = async () => {
    try {
      setLoading(true);
      const data = await getSalesCollateral(currentOrganization.organization_id);
      setCollateral(data);
    } catch (error) {
      console.error('Error loading sales collateral:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCollateral = async () => {
    if (!selectedFile || !newCollateral.name) return;

    try {
      setSaving(true);
      await uploadSalesCollateral(selectedFile, newCollateral, currentOrganization.organization_id);
      setShowUploadModal(false);
      setNewCollateral({ name: '', description: '', collateral_type: 'sales_deck' });
      setSelectedFile(null);
      await loadCollateral();
    } catch (error) {
      console.error('Error uploading collateral:', error);
      alert('Failed to upload collateral. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCollateral = async (collateralId) => {
    if (!window.confirm('Are you sure you want to delete this collateral?')) return;

    try {
      await deleteSalesCollateral(collateralId);
      await loadCollateral();
    } catch (error) {
      console.error('Error deleting collateral:', error);
      alert('Failed to delete collateral. Please try again.');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredCollateral.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleDownloadSelected = () => {
    selectedItems.forEach(itemId => {
      const item = collateral.find(c => c.id === itemId);
      if (item) {
        const link = document.createElement('a');
        link.href = item.file_path;
        link.download = item.name;
        link.target = '_blank';
        link.click();
      }
    });
  };

  const handleDownloadCollateral = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
  return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading sales collateral...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sales Collateral</h1>
          <p className="text-gray-600 text-sm mb-6">Manage your sales materials including decks, one-pagers, case studies, and pricing sheets.</p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
          Help
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search collateral..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {selectedItems.length > 0 && (
            <button
              onClick={handleDownloadSelected}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Selected ({selectedItems.length})
            </button>
          )}
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Collateral
        </button>
      </div>

      {/* Collateral Table */}
      <div className="bg-white border border-gray-300 rounded-md overflow-visible">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredCollateral.length && filteredCollateral.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collateral
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCollateral.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <p className="text-gray-500 text-sm">No sales collateral uploaded yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCollateral.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {collateralTypes.find(t => t.value === item.collateral_type)?.label || item.collateral_type}
            </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(item.file_size)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.uploaded_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium overflow-visible">
                    <div className="flex items-center space-x-2">
                      <div className="relative dropdown-container">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        {openDropdown === item.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999] border border-gray-200">
                            <button 
                              onClick={() => handleDownloadCollateral(item.file_path, item.name)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download
                            </button>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Edit
                            </button>
          <button
                              onClick={() => handleDeleteCollateral(item.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
                              Delete
          </button>
                          </div>
        )}
      </div>
    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)} />
          <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-medium text-gray-900">Upload Sales Collateral</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleUploadCollateral(); }} className="flex-1 flex flex-col justify-center">
              <div className="flex-1 px-6 py-8 flex flex-col justify-center">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collateral Name</label>
                  <input
                    type="text"
                    value={newCollateral.name}
                    onChange={(e) => setNewCollateral({ ...newCollateral, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Enter collateral name"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCollateral.description}
                    onChange={(e) => setNewCollateral({ ...newCollateral, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newCollateral.collateral_type}
                    onChange={(e) => setNewCollateral({ ...newCollateral, collateral_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    {collateralTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                  <input
                    type="file"
                    onChange={e => setSelectedFile(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !selectedFile || !newCollateral.name}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Uploading...' : 'Upload Collateral'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default SalesCollateral; 