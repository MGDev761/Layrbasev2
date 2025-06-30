import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getBrandAssets, uploadBrandAsset, deleteBrandAsset, getBrandInformation, upsertBrandInformation, uploadBrandLogo } from '../../../../services/marketingService';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Modal from '../../../../components/common/layout/Modal';

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
            <h2 className="text-xl font-bold text-white tracking-tight">Brand Assets Help & Tips</h2>
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
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Introduction</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Brand Assets is your central hub for managing all company logos, icons, images, and documents. Keep your brand consistent and accessible for your team.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Why It's Important</span>{openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.why && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Ensures everyone uses the latest brand materials</li><li>Prevents off-brand or outdated assets from circulating</li><li>Saves time searching for files</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Best Practice</span>{openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.best && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Organize assets by type and campaign</li><li>Regularly update and archive old assets</li><li>Use clear naming conventions</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Quick Start</span>{openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.quick && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Upload new assets, search and filter by type, and download files as needed. Use the logo uploader for your main company logo.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Tips</span>{openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.tips && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Tag assets for campaigns or departments. Use the color palette tool to keep your brand colors consistent.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">FAQ</span>{openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.faq && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Q: Can I restrict access to certain assets? <br/>A: Not yet, but permissions are coming soon.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your brand assets assistant. I can help you organize, update, and share your brand materials.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I keep my brand assets up to date?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Set a regular review schedule and archive outdated files. Use the uploader to add new versions and keep your team notified.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about brand assets..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

const logoHorizontal = '/logo-horizontal.svg';
const logoVertical = '/logo-vertical.svg';
const logoIcon = '/logo-icon.svg';
const logoWordmark = '/logo-wordmark.svg';

const logoVariations = [
  { label: 'Horizontal', src: logoHorizontal },
  { label: 'Vertical', src: logoVertical },
  { label: 'Icon', src: logoIcon },
  { label: 'Wordmark', src: logoWordmark },
];

const navCards = [
  { key: 'logos', label: 'Logos', icon: (
    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M8 16l4-8 4 8" strokeWidth="2" /></svg>
  ) },
  { key: 'colours', label: 'Colours', icon: (
    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><circle cx="12" cy="12" r="4" strokeWidth="2" /></svg>
  ) },
  { key: 'messaging', label: 'Messaging', icon: (
    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path d="M8 12h8M8 16h5" strokeWidth="2" /></svg>
  ) },
];

const BrandAssets = () => {
  const { currentOrganization } = useAuth();
  const [brandInfo, setBrandInfo] = useState({
    tagline: '',
    brand_blurb: '',
    color_palette: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'],
    logo_url: ''
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [newAsset, setNewAsset] = useState({
    name: '',
    description: '',
    asset_type: 'logo'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [addingColor, setAddingColor] = useState(false);
  const [newColorValue, setNewColorValue] = useState('#000000');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDraft, setEditDraft] = useState({ tagline: '', brand_blurb: '', logo_url: '' });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('logos');
  const [showInfo, setShowInfo] = useState(true);
  const [uploadingMainLogo, setUploadingMainLogo] = useState(true); // true = main logo, false = variation
  const [newLogoRule, setNewLogoRule] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editableDescription, setEditableDescription] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);

  const assetTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'logo', label: 'Logos' },
    { value: 'icon', label: 'Icons' },
    { value: 'document', label: 'Documents' },
    { value: 'image', label: 'Images' }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.asset_type === filterType;
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    if (currentOrganization?.organization_id) {
      loadData();
    }
  }, [currentOrganization]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [brandData, assetsData] = await Promise.all([
        getBrandInformation(currentOrganization.organization_id),
        getBrandAssets(currentOrganization.organization_id)
      ]);
      setBrandInfo(brandData);
      setAssets(assetsData);
    } catch (error) {
      console.error('Error loading brand data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrandInfo = async () => {
    try {
      setSaving(true);
      await upsertBrandInformation(brandInfo, currentOrganization.organization_id);
      alert('Brand information saved successfully!');
    } catch (error) {
      console.error('Error saving brand information:', error);
      alert('Failed to save brand information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAsset = async () => {
    if (!selectedFile || !newAsset.name) return;

    try {
      setSaving(true);
      await uploadBrandAsset(selectedFile, { ...newAsset, is_main_logo: true }, currentOrganization.organization_id);
      setShowUploadModal(false);
      setNewAsset({ name: '', description: '', asset_type: 'logo' });
      setSelectedFile(null);
      await loadData();
    } catch (error) {
      console.error('Error uploading asset:', error);
      alert('Failed to upload asset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    try {
      setSaving(true);
      const logoUrl = await uploadBrandLogo(logoFile, currentOrganization.organization_id);
      setBrandInfo(prev => ({ ...prev, logo_url: logoUrl }));
      setShowLogoUpload(false);
      setLogoFile(null);
      await loadData();
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;

    try {
      await deleteBrandAsset(assetId);
      await loadData();
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addColor = (color) => {
    setBrandInfo(prev => ({
      ...prev,
      color_palette: [...prev.color_palette, color]
    }));
  };

  const removeColor = (index) => {
    setBrandInfo(prev => ({
      ...prev,
      color_palette: prev.color_palette.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index, color) => {
    setBrandInfo(prev => ({
      ...prev,
      color_palette: prev.color_palette.map((c, i) => i === index ? color : c)
    }));
  };

  const handleUpdateColor = async (index, color) => {
    const updatedBrandInfo = {
      ...brandInfo,
      color_palette: brandInfo.color_palette.map((c, i) => i === index ? color : c)
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      console.log('Saving brand info:', updatedBrandInfo);
      console.log('Organization ID:', currentOrganization.organization_id);
      const result = await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
      console.log('Save result:', result);
      setActiveColorIndex(null);
      setAddingColor(false);
      setNewColorValue('#000000');
    } catch (error) {
      console.error('Error saving color:', error);
      alert('Failed to save color. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddColor = async (color) => {
    const updatedBrandInfo = {
      ...brandInfo,
      color_palette: [...brandInfo.color_palette, color]
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      console.log('Saving brand info:', updatedBrandInfo);
      console.log('Organization ID:', currentOrganization.organization_id);
      const result = await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
      console.log('Save result:', result);
      setActiveColorIndex(null);
      setAddingColor(false);
      setNewColorValue('#000000');
    } catch (error) {
      console.error('Error saving color:', error);
      alert('Failed to save color. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveColor = async (index) => {
    const updatedBrandInfo = {
      ...brandInfo,
      color_palette: brandInfo.color_palette.filter((_, i) => i !== index)
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      console.log('Removing color, saving brand info:', updatedBrandInfo);
      console.log('Organization ID:', currentOrganization.organization_id);
      const result = await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
      console.log('Save result:', result);
      setActiveColorIndex(null);
      setAddingColor(false);
      setNewColorValue('#000000');
    } catch (error) {
      console.error('Error removing color:', error);
      alert('Failed to remove color. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Find the main logo asset
  const mainLogo = assets.find(a => a.asset_type === 'logo' && a.is_main_logo);

  // Upload handler for logo (main or variation)
  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !currentOrganization?.organization_id) return;
    setUploading(true);
    try {
      await uploadBrandAsset(
        uploadFile,
        { name: uploadingMainLogo ? 'Main Logo' : 'Logo Variation', asset_type: 'logo', is_main_logo: uploadingMainLogo },
        currentOrganization.organization_id
      );
      setShowUploadModal(false);
      setUploadFile(null);
      await loadData();
    } catch (err) {
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleAddLogoRule = async () => {
    if (!newLogoRule.trim()) return;
    const updatedBrandInfo = {
      ...brandInfo,
      logo_rules: [...(brandInfo.logo_rules || []), newLogoRule.trim()]
    };
    setBrandInfo(updatedBrandInfo);
    setNewLogoRule('');
    try {
      setSaving(true);
      await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
    } catch (error) {
      console.error('Error saving logo rule:', error);
      alert('Failed to save logo rule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveLogoRule = async (index) => {
    const updatedBrandInfo = {
      ...brandInfo,
      logo_rules: brandInfo.logo_rules.filter((_, i) => i !== index)
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
    } catch (error) {
      console.error('Error removing logo rule:', error);
      alert('Failed to remove logo rule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    const updatedBrandInfo = {
      ...brandInfo,
      logo_description: editableDescription
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving description:', error);
      alert('Failed to save description. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Initialize editable description when brandInfo loads
  useEffect(() => {
    if (brandInfo.logo_description) {
      setEditableDescription(brandInfo.logo_description);
    }
  }, [brandInfo.logo_description]);

  const handleDownloadAsset = (asset) => {
    const link = document.createElement('a');
    link.href = asset.file_path;
    link.download = asset.name || 'logo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading brand assets...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Heading and Subheading */}
      <div className="mb-4 w-full">
          <h1 className="text-xl font-semibold text-gray-900">Brand Assets</h1>
        <p className="text-gray-600 text-sm mb-4">Manage your company logos, icons, images, and documents in one place.</p>
        </div>
      {/* Top Tab Menu */}
      <div className="flex gap-2 border-b border-gray-200 mb-8">
        {navCards.map(card => (
        <button
            key={card.key}
            onClick={() => setSelectedSection(card.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium focus:outline-none transition-colors
              ${selectedSection === card.key
                ? 'border-b-2 border-purple-600 text-purple-700 bg-white'
                : 'border-b-2 border-transparent text-gray-600 hover:text-purple-700 hover:bg-gray-50'}`}
            style={{ minWidth: 0 }}
          >
            {React.cloneElement(card.icon, { className: 'w-5 h-5', style: { color: selectedSection === card.key ? '#9333ea' : '#a1a1aa' } })}
            <span>{card.label}</span>
        </button>
        ))}
      </div>
      {/* Blue Info Popup */}
      {showInfo && (
        <div className="flex items-start gap-3 bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-8 max-w-2xl relative">
          <svg className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
          <div className="flex-1 text-sm text-blue-900">This is an info popup. You can use it to highlight important brand guidelines, usage tips, or updates for your team.</div>
          <button onClick={() => setShowInfo(false)} className="ml-2 text-blue-400 hover:text-blue-600 text-lg font-bold focus:outline-none absolute top-2 right-2">&times;</button>
        </div>
      )}
      {/* Main Content */}
      <div className="w-full">
        {/* Section Content */}
        {selectedSection === 'logos' && (
          <div>
            {/* Main Logo */}
            <div className="mb-8 flex flex-col">
              <div className="w-full max-w-xl mb-4">
                {mainLogo ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center h-40 relative group">
                    <img src={mainLogo.file_path} alt={mainLogo.name || 'Main Logo'} className="w-full h-full object-contain" />
                    {/* Hover icons for main logo */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownloadAsset(mainLogo)}
                        className="bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-50 transition-colors"
                        title="Download logo"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(mainLogo.id)}
                        className="bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                        title="Remove logo"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full bg-white border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center py-10 hover:bg-purple-50 transition-colors"
                    onClick={() => { setShowUploadModal(true); setUploadingMainLogo(true); }}
                  >
                    <svg className="w-10 h-10 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-purple-600 font-medium">Add Logo</span>
                  </button>
                )}
              </div>
              <div className="text-left text-gray-600 max-w-2xl text-sm relative group">
                {editingDescription ? (
                  <div className="space-y-2">
                    <textarea
                      value={editableDescription}
                      onChange={(e) => setEditableDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="3"
                      placeholder="Enter logo description..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveDescription}
                        disabled={saving}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingDescription(false);
                          setEditableDescription(brandInfo.logo_description || '');
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div onClick={() => setEditingDescription(true)} className="cursor-pointer">
                      {brandInfo.logo_description || 'Acme has a versatile logo system. Our logo features a symbol, a wordmark, and a full lockup. The main logo, which should always be the first choice, comes in horizontal and vertical variations.'}
                    </div>
                    {/* Pencil icon on text hover */}
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingDescription(true)}
                        className="bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-50 transition-colors"
                        title="Edit description"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Logo Variations Grid */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Alternate Logos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Show uploaded logo variations */}
                {assets.filter(a => a.asset_type === 'logo' && !a.is_main_logo).map((logo, index) => (
                  <div key={logo.id} className="bg-white border border-gray-200 rounded-lg flex items-center justify-center p-4 h-32 relative group">
                    <img src={logo.file_path} alt={logo.name || 'Logo Variation'} className="w-full h-full object-contain" />
                    {/* Hover icons for logo variations */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownloadAsset(logo)}
                        className="bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-50 transition-colors"
                        title="Download logo"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(logo.id)}
                        className="bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                        title="Remove logo"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add Logo square - always present */}
                <button className="bg-white border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center p-4 h-32 hover:bg-purple-50 transition-colors" onClick={() => { setShowUploadModal(true); setUploadingMainLogo(false); }}>
                  <svg className="w-8 h-8 text-purple-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs text-purple-600 font-medium">Add Logo</span>
                </button>
              </div>
            </div>
            {/* Logo Rules Section */}
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo Usage Rules</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex gap-2">
              <input
                type="text"
                      value={newLogoRule}
                      onChange={(e) => setNewLogoRule(e.target.value)}
                      placeholder="Add a logo usage rule..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLogoRule()}
                    />
            <button
                      onClick={handleAddLogoRule}
                      disabled={!newLogoRule.trim() || saving}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
            >
                      Add
            </button>
          </div>
                        </div>
                <div className="space-y-2">
                  {(brandInfo.logo_rules || []).map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-800">{rule}</span>
                        <button
                        onClick={() => handleRemoveLogoRule(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
                  ))}
                  {(brandInfo.logo_rules || []).length === 0 && (
                    <p className="text-gray-500 text-sm italic">No logo rules added yet. Add rules to guide your team on proper logo usage.</p>
                  )}
              </div>
              </div>
            </div>
          </div>
        )}
        {selectedSection === 'colours' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Brand Colours</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              {(brandInfo.color_palette || ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B']).map((color, idx) => (
                <div key={color + idx} className="flex flex-col items-center">
                  {/* Paint card */}
                  <div className="w-20 h-44 rounded-lg shadow border border-gray-200 flex flex-col justify-end relative overflow-hidden" style={{ background: color }}>
                    {/* White box with hex code at bottom */}
                    <div className="w-full bg-white rounded-b-lg px-2 py-2 flex flex-col items-center absolute bottom-0 left-0">
                      <span className="text-xs font-mono text-gray-800">{color}</span>
                    </div>
                    {/* Edit/Download buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-purple-50" title="Edit Colour">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" /></svg>
                      </button>
                      <button className="bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-purple-50" title="Download Colour">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add Colour card */}
              <button className="w-20 h-44 bg-white border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center hover:bg-purple-50 transition-colors" onClick={() => alert('Open add colour modal (placeholder)')}> 
                <svg className="w-8 h-8 text-purple-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs text-purple-600 font-medium">Add Colour</span>
              </button>
            </div>
            {/* Colour usage rules/info box - moved to bottom */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-sm text-yellow-900 max-w-2xl mt-8">
              <strong>Colour Usage:</strong> Use primary brand colours for main UI elements and backgrounds. Accent colours should be used sparingly for highlights, buttons, or calls to action. Ensure sufficient contrast for accessibility. Never use unofficial shades or tints.
            </div>
          </div>
        )}
        {selectedSection === 'messaging' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Brand Messaging</h2>
            {/* Tagline - card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="font-medium text-gray-700 mb-1">Tagline</div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900 text-base leading-relaxed">
                {brandInfo.tagline || <span className="text-gray-400">No tagline set</span>}
              </div>
            </div>
            {/* Brand Blurb - card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="font-medium text-gray-700 mb-1">Description</div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900 text-base leading-relaxed">
                {brandInfo.brand_blurb || <span className="text-gray-400">No brand blurb set</span>}
              </div>
            </div>
            {/* Team Bios - card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="font-medium text-gray-700 mb-1">Team Bios</div>
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <ul className="space-y-3">
                  {(brandInfo.bios && brandInfo.bios.length > 0) ? brandInfo.bios.map((bio, idx) => (
                    <li key={idx} className="text-sm text-gray-800 border-l-4 border-purple-200 pl-3">{bio}</li>
                  )) : (
                    <li className="text-gray-400">No team bios set</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      {/* Upload Modal */}
      {showUploadModal && (
        <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
          <form onSubmit={handleLogoUpload} className="p-6 max-w-md">
            <h2 className="text-lg font-bold mb-4">Upload {uploadingMainLogo ? 'Main Logo' : 'Logo Variation'}</h2>
                      <input
                        type="file"
                        accept="image/*"
              onChange={e => setUploadFile(e.target.files[0])}
              className="mb-4"
              required
            />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">Cancel</button>
              <button type="submit" disabled={uploading || !uploadFile} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default BrandAssets; 