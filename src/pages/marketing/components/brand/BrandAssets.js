import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getBrandAssets, uploadBrandAsset, deleteBrandAsset, getBrandInformation, upsertBrandInformation, uploadBrandLogo } from '../../../../services/marketingService';
import { 
  InformationCircleIcon, 
  BookOpenIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftRightIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  PhotoIcon,
  SwatchIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  ClipboardDocumentIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
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
            <h2 className="text-xl font-bold text-white tracking-tight">Brand Store Help & Tips</h2>
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
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Brand Store Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Your Brand Store is the central hub for managing all company assets, guidelines, and brand resources. Keep your brand consistent and accessible for your entire team.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Why It's Important</span>{openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.why && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Ensures brand consistency across all materials</li><li>Provides easy access to approved assets</li><li>Reduces time searching for brand resources</li><li>Maintains professional brand standards</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Best Practices</span>{openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.best && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Organize assets by type and use case</li><li>Keep guidelines updated and accessible</li><li>Use consistent naming conventions</li><li>Regularly audit and update assets</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Quick Start</span>{openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.quick && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Upload logos and assets, manage your color palette, and set brand messaging. Use the download buttons to get assets in the formats you need.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Pro Tips</span>{openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.tips && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use high-resolution images for logos. Set up usage guidelines for your team. Copy color codes directly from the palette.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">FAQ</span>{openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.faq && (<div className="px-6 py-4 text-gray-700 text-sm"><p><strong>Q:</strong> What file formats are supported?<br/><strong>A:</strong> PNG, JPG, SVG for images. PDF for documents.<br/><br/><strong>Q:</strong> How do I share assets with my team?<br/><strong>A:</strong> Use the download links or copy asset URLs.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your brand assistant. I can help you organize your brand assets and maintain consistency across all your marketing materials.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I ensure brand consistency?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Use the approved logos, colors, and messaging from your brand store. Set clear usage guidelines and share them with your team.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about brand management..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
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
    logo_url: '',
    logo_description: '',
    logo_rules: []
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
  const [activeSection, setActiveSection] = useState('overview');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColor, setNewColor] = useState('#000000');
  const [isPrimaryLogoUpload, setIsPrimaryLogoUpload] = useState(false);

  const sections = [
    { id: 'overview', name: 'Overview', icon: EyeIcon },
    { id: 'logos', name: 'Logos & Assets', icon: PhotoIcon },
    { id: 'colors', name: 'Brand Colors', icon: SwatchIcon },
    { id: 'guidelines', name: 'Brand Guidelines', icon: DocumentTextIcon }
  ];

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

  const handleSaveBrandInfo = async (updates) => {
    try {
      setSaving(true);
      const updatedInfo = { ...brandInfo, ...updates };
      await upsertBrandInformation(updatedInfo, currentOrganization.organization_id);
      setBrandInfo(updatedInfo);
    } catch (error) {
      console.error('Error saving brand information:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAsset = async () => {
    if (!selectedFile || !newAsset.name) return;

    try {
      setUploading(true);
      
      if (isPrimaryLogoUpload) {
        // Handle primary logo upload
        await uploadBrandLogo(selectedFile, currentOrganization.organization_id);
      } else {
        // Handle regular asset upload
        await uploadBrandAsset(selectedFile, newAsset, currentOrganization.organization_id);
      }
      
      setShowUploadModal(false);
      setNewAsset({ name: '', description: '', asset_type: 'logo' });
      setSelectedFile(null);
      setIsPrimaryLogoUpload(false);
      await loadData();
    } catch (error) {
      console.error('Error uploading asset:', error);
      alert('Failed to upload asset. Please try again.');
    } finally {
      setUploading(false);
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

  const handleDownloadAsset = (asset) => {
    const link = document.createElement('a');
    link.href = asset.file_path;
    link.download = asset.name || 'brand-asset';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleEditSave = (field, value) => {
    handleSaveBrandInfo({ [field]: value });
    setEditingField(null);
    setTempValue('');
  };

  const handleColorAdd = () => {
    const newPalette = [...(brandInfo.color_palette || []), newColor];
    handleSaveBrandInfo({ color_palette: newPalette });
    setShowColorModal(false);
    setNewColor('#000000');
  };

  const handleColorRemove = (index) => {
    const newPalette = brandInfo.color_palette.filter((_, i) => i !== index);
    handleSaveBrandInfo({ color_palette: newPalette });
  };

  const mainLogo = brandInfo.logo_url ? {
    file_path: brandInfo.logo_url,
    name: 'Primary Logo',
    description: brandInfo.logo_description || 'Main company logo'
  } : null;
  const logoVariations = assets.filter(asset => asset.asset_type === 'logo');
  const otherAssets = assets.filter(asset => asset.asset_type !== 'logo');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your brand store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Store</h1>
          <p className="text-gray-600 mt-1">Manage your brand assets, guidelines, and resources</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <InformationCircleIcon className="w-4 h-4 mr-2" />
            Help
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <CloudArrowUpIcon className="w-4 h-4 mr-2" />
            Upload Asset
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <nav className="flex space-x-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {section.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Sections */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Brand Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Logo Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Primary Logo</h3>
              {mainLogo ? (
                <div className="w-full h-24 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                  <img src={mainLogo.file_path} alt="Main Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <PhotoIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">No logo uploaded</p>
                  </div>
                </div>
              )}
              <div className="text-center">
                <span className="text-sm text-gray-600">{logoVariations.length} variations available</span>
              </div>
            </div>

            {/* Color Palette Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Brand Colors</h3>
              <div className="flex space-x-2 mb-3">
                {(brandInfo.color_palette || []).slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600">{brandInfo.color_palette?.length || 0} colors defined</span>
              </div>
            </div>

            {/* Brand Message */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Brand Message</h3>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Tagline</h4>
                  <p className="text-sm text-gray-600 italic">
                    {brandInfo.tagline || 'No tagline set'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Description</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {brandInfo.brand_blurb || 'No description set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Brand Assets Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-semibold text-purple-600">{assets.length}</div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-blue-600">{assets.filter(a => a.asset_type === 'logo').length}</div>
                <div className="text-sm text-gray-600">Logo Variations</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600">{brandInfo.color_palette?.length || 0}</div>
                <div className="text-sm text-gray-600">Brand Colors</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-orange-600">{otherAssets.length}</div>
                <div className="text-sm text-gray-600">Other Assets</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'logos' && (
        <div className="space-y-6">
          {/* Main Logo Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Primary Logo</h3>
              {mainLogo && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownloadAsset(mainLogo)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => copyToClipboard(mainLogo.file_path)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Copy URL
                  </button>
                </div>
              )}
            </div>
            
            {mainLogo ? (
              <div className="w-full max-w-sm mx-auto">
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                  <img src={mainLogo.file_path} alt="Main Logo" className="w-full h-auto object-contain" />
                </div>
                <div className="mt-3 text-center">
                  <h4 className="font-medium text-gray-900">{mainLogo.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{mainLogo.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-2">No primary logo</h4>
                <p className="text-gray-600 mb-4">Upload your main company logo to get started</p>
                <button
                  onClick={() => {
                    setIsPrimaryLogoUpload(true);
                    setShowUploadModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                  <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                  Upload Logo
                </button>
              </div>
            )}
          </div>

          {/* Logo Variations */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Logo Variations</h3>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Variation
              </button>
            </div>

            {logoVariations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {logoVariations.map((logo) => (
                  <div key={logo.id} className="group relative">
                    <div className="bg-gray-50 rounded-lg p-3 border-2 border-gray-200 group-hover:border-purple-300 transition-colors">
                      <img src={logo.file_path} alt={logo.name} className="w-full h-20 object-contain" />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="text-sm font-medium text-gray-900">{logo.name}</h4>
                      {logo.description && (
                        <p className="text-xs text-gray-600 mt-1">{logo.description}</p>
                      )}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDownloadAsset(logo)}
                          className="p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(logo.id)}
                          className="p-1 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-red-50"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <PhotoIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No logo variations uploaded yet</p>
              </div>
            )}
          </div>

          {/* Other Assets */}
          {otherAssets.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Other Brand Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-3">
                      <DocumentTextIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h4>
                      <p className="text-xs text-gray-600">{asset.asset_type}</p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleDownloadAsset(asset)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'colors' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Brand Color Palette</h3>
              <button
                onClick={() => setShowColorModal(true)}
                className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Color
              </button>
            </div>

            {brandInfo.color_palette && brandInfo.color_palette.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {brandInfo.color_palette.map((color, index) => (
                  <div key={index} className="group">
                    <div className="relative">
                      <div
                        className="w-full h-32 rounded-lg border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <button
                        onClick={() => handleColorRemove(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => copyToClipboard(color)}
                        className="font-mono text-sm text-gray-900 hover:text-purple-600 transition-colors"
                        title="Click to copy"
                      >
                        {color}
                      </button>
                      <div className="flex justify-center space-x-2 mt-2">
                        <button
                          onClick={() => copyToClipboard(color)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy hex code"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SwatchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No colors defined</h4>
                <p className="text-gray-600 mb-6">Add your brand colors to maintain consistency</p>
                <button
                  onClick={() => setShowColorModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add First Color
                </button>
              </div>
            )}
          </div>

          {/* Color Usage Guidelines */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Color Usage Guidelines</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Use primary brand colors for main UI elements and key messaging</p>
              <p>• Apply accent colors sparingly for highlights and call-to-action elements</p>
              <p>• Ensure sufficient contrast ratios for accessibility compliance</p>
              <p>• Maintain color consistency across all brand touchpoints</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'guidelines' && (
        <div className="space-y-8">
          {/* Brand Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Brand Information</h3>
            
            <div className="space-y-6">
              {/* Tagline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Brand Tagline</label>
                  {editingField !== 'tagline' && (
                    <button
                      onClick={() => {
                        setEditingField('tagline');
                        setTempValue(brandInfo.tagline || '');
                      }}
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'tagline' ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your brand tagline..."
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditSave('tagline', tempValue)}
                      className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                      disabled={saving}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-900">{brandInfo.tagline || 'No tagline set'}</p>
                  </div>
                )}
              </div>

              {/* Brand Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Brand Description</label>
                  {editingField !== 'brand_blurb' && (
                    <button
                      onClick={() => {
                        setEditingField('brand_blurb');
                        setTempValue(brandInfo.brand_blurb || '');
                      }}
                      className="text-purple-600 hover:text-purple-700 text-sm"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editingField === 'brand_blurb' ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="4"
                      placeholder="Describe your brand, mission, and values..."
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSave('brand_blurb', tempValue)}
                        className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                        disabled={saving}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">{brandInfo.brand_blurb || 'No description set'}</p>
                  </div>
                )}
              </div>

              {/* Logo Usage Rules */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Logo Usage Rules</label>
                <div className="space-y-2">
                  {(brandInfo.logo_rules || []).map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-800">{rule}</span>
                      <button
                        onClick={() => {
                          const newRules = brandInfo.logo_rules.filter((_, i) => i !== index);
                          handleSaveBrandInfo({ logo_rules: newRules });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {editingField === 'logo_rules' ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Add a logo usage rule..."
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          const newRules = [...(brandInfo.logo_rules || []), tempValue];
                          handleSaveBrandInfo({ logo_rules: newRules });
                          setEditingField(null);
                          setTempValue('');
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                        disabled={!tempValue.trim() || saving}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingField('logo_rules');
                        setTempValue('');
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-colors"
                    >
                      + Add Logo Usage Rule
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => {
            setShowUploadModal(false);
            setIsPrimaryLogoUpload(false);
          }} />
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl mx-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white">
                {isPrimaryLogoUpload ? 'Upload Primary Logo' : 'Upload Brand Asset'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              {!isPrimaryLogoUpload && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                    <input
                      type="text"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter asset name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={newAsset.description}
                      onChange={(e) => setNewAsset(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="2"
                      placeholder="Describe this asset..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                    <select
                      value={newAsset.asset_type}
                      onChange={(e) => setNewAsset(prev => ({ ...prev, asset_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="logo">Logo</option>
                      <option value="icon">Icon</option>
                      <option value="image">Image</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                </>
              )}

              {isPrimaryLogoUpload && (
                <div className="text-center py-4">
                  <PhotoIcon className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Your Primary Logo</h4>
                  <p className="text-gray-600 text-sm">This will be your main company logo displayed across your brand materials.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {isPrimaryLogoUpload && (
                  <p className="text-xs text-gray-500 mt-1">Recommended: PNG or SVG format, high resolution</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setIsPrimaryLogoUpload(false);
                }}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadAsset}
                disabled={uploading || !selectedFile || (!isPrimaryLogoUpload && !newAsset.name)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Modal */}
      {showColorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowColorModal(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl mx-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white">Add Brand Color</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex space-x-3 items-center">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowColorModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleColorAdd}
                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
              >
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandAssets; 