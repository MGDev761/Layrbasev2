import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getSalesCollateral, uploadSalesCollateral, deleteSalesCollateral } from '../../../services/marketingService';
import { supabase } from '../../../lib/supabase';
import { 
  InformationCircleIcon, 
  BookOpenIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftRightIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentListIcon,
  CalculatorIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FolderIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Asset types with enhanced metadata
const ASSET_TYPES = [
  { value: 'sales_deck', label: 'Sales Deck', icon: PresentationChartBarIcon, color: 'blue', category: 'Presentations' },
  { value: 'one_pager', label: 'One Pager', icon: DocumentTextIcon, color: 'green', category: 'Documents' },
  { value: 'case_study', label: 'Case Study', icon: ClipboardDocumentListIcon, color: 'purple', category: 'Stories' },
  { value: 'pricing', label: 'Pricing Sheet', icon: CalculatorIcon, color: 'yellow', category: 'Pricing' },
  { value: 'comparison', label: 'Comparison Chart', icon: ChartBarIcon, color: 'indigo', category: 'Competitive' },
  { value: 'datasheet', label: 'Data Sheet', icon: DocumentTextIcon, color: 'gray', category: 'Technical' },
  { value: 'proposal', label: 'Proposal Template', icon: DocumentArrowDownIcon, color: 'orange', category: 'Templates' },
  { value: 'demo_script', label: 'Demo Script', icon: ClipboardDocumentListIcon, color: 'pink', category: 'Scripts' }
];

const CATEGORIES = [
  'All Categories',
  'Presentations', 
  'Documents', 
  'Stories', 
  'Pricing', 
  'Competitive', 
  'Technical', 
  'Templates', 
  'Scripts'
];

const SALES_STAGES = [
  'All Stages',
  'Prospecting',
  'Discovery', 
  'Demo',
  'Proposal',
  'Negotiation',
  'Closing'
];

// Mock data for enhanced demo
const MOCK_ASSETS = [
  {
    id: 1,
    name: 'Q1 2024 Sales Deck',
    description: 'Master sales presentation with latest product updates and customer stories',
    collateral_type: 'sales_deck',
    file_size: 15728640, // 15MB
    uploaded_at: '2024-01-15T10:30:00Z',
    file_path: '/assets/q1-sales-deck.pdf',
    tags: ['Q1', 'product-updates', 'customers'],
    sales_stage: 'Demo',
    last_updated: '2024-01-15',
    downloads: 47,
    created_by: 'Sarah Chen',
    is_featured: true,
    version: '2.1'
  },
  {
    id: 2,
    name: 'Product Comparison Matrix',
    description: 'Detailed comparison with key competitors showing our advantages',
    collateral_type: 'comparison',
    file_size: 2097152, // 2MB
    uploaded_at: '2024-01-10T14:20:00Z',
    file_path: '/assets/comparison-matrix.xlsx',
    tags: ['competitive', 'features', 'pricing'],
    sales_stage: 'Discovery',
    last_updated: '2024-01-10',
    downloads: 23,
    created_by: 'Mike Johnson',
    is_featured: false,
    version: '1.3'
  },
  {
    id: 3,
    name: 'Customer Success Stories',
    description: 'Collection of case studies from Fortune 500 customers',
    collateral_type: 'case_study',
    file_size: 8388608, // 8MB
    uploaded_at: '2024-01-08T09:15:00Z',
    file_path: '/assets/success-stories.pdf',
    tags: ['case-studies', 'Fortune-500', 'ROI'],
    sales_stage: 'Proposal',
    last_updated: '2024-01-08',
    downloads: 31,
    created_by: 'Emma Davis',
    is_featured: true,
    version: '1.0'
  },
  {
    id: 4,
    name: 'Pricing Guide 2024',
    description: 'Complete pricing structure with package options and discounts',
    collateral_type: 'pricing',
    file_size: 1048576, // 1MB
    uploaded_at: '2024-01-05T16:45:00Z',
    file_path: '/assets/pricing-guide.pdf',
    tags: ['pricing', 'packages', 'discounts'],
    sales_stage: 'Negotiation',
    last_updated: '2024-01-05',
    downloads: 89,
    created_by: 'David Wilson',
    is_featured: false,
    version: '3.2'
  },
  {
    id: 5,
    name: 'Demo Script Template',
    description: 'Structured demo flow with talking points and objection handling',
    collateral_type: 'demo_script',
    file_size: 524288, // 512KB
    uploaded_at: '2024-01-03T11:30:00Z',
    file_path: '/assets/demo-script.docx',
    tags: ['demo', 'script', 'objections'],
    sales_stage: 'Demo',
    last_updated: '2024-01-03',
    downloads: 15,
    created_by: 'Lisa Rodriguez',
    is_featured: false,
    version: '1.5'
  }
];

// Help Modal Component
const HelpModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('overview');
  const [openContent, setOpenContent] = useState({ intro: true, features: false, best: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ quick: true, tips: false, organize: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Sales Asset Hub Help</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200">
          <button onClick={() => setTab('overview')} className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${tab==='overview' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-4 h-4" /> Overview
          </button>
          <button onClick={() => setTab('features')} className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${tab==='features' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <Cog6ToothIcon className="w-4 h-4" /> Features
          </button>
          <button onClick={() => setTab('organization')} className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${tab==='organization' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> Organization
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'overview' && (
            <>
              <div className="bg-gray-50 rounded-lg">
                <button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t">
                  <span>What is Sales Asset Hub?</span>
                  {openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.intro && (
                  <div className="px-4 py-3 text-gray-700 text-sm border-t border-gray-200">
                    <p>A centralized repository for all your sales materials—from decks and case studies to pricing sheets and competitive comparisons. Keep your sales team armed with the latest, most effective content.</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg">
                <button onClick={() => toggleContent('features')} className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t">
                  <span>Key Features</span>
                  {openContent.features ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.features && (
                  <div className="px-4 py-3 text-gray-700 text-sm border-t border-gray-200">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Organize assets by type, sales stage, and category</li>
                      <li>Track downloads and usage analytics</li>
                      <li>Version control and update notifications</li>
                      <li>Advanced search and filtering</li>
                      <li>Bulk operations and sharing</li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg">
                <button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t">
                  <span>Best Practices</span>
                  {openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.best && (
                  <div className="px-4 py-3 text-gray-700 text-sm border-t border-gray-200">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use clear, descriptive names and descriptions</li>
                      <li>Tag assets with relevant keywords</li>
                      <li>Keep materials updated and archive old versions</li>
                      <li>Organize by sales stage for easy discovery</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          
          {tab === 'features' && (
            <>
              <div className="bg-gray-50 rounded-lg">
                <button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t">
                  <span>Quick Start Guide</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-4 py-3 text-gray-700 text-sm border-t border-gray-200">
                    <p>1. Upload assets using the "Upload Asset" button<br/>
                    2. Use search and filters to find materials quickly<br/>
                    3. Switch between grid and list views<br/>
                    4. Track downloads and update assets regularly</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t">
                  <span>Pro Tips</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-4 py-3 text-gray-700 text-sm border-t border-gray-200">
                    <p>• Star frequently used assets for quick access<br/>
                    • Use bulk selection for mass downloads<br/>
                    • Filter by sales stage to find stage-specific content<br/>
                    • Monitor download counts to identify popular assets</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          {tab === 'organization' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">Asset Organization</h3>
                <div className="text-sm text-indigo-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">1</div>
                    <span>Category → Type → Stage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Tag with keywords</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">3</div>
                    <span>Version control</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs">4</div>
                    <span>Regular updates</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SalesCollateral = () => {
  const { currentOrganization } = useAuth();
  const [assets, setAssets] = useState(MOCK_ASSETS); // Using mock data for demo
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStage, setFilterStage] = useState('All Stages');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // New asset form state
  const [newAsset, setNewAsset] = useState({
    name: '',
    description: '',
    collateral_type: 'sales_deck',
    sales_stage: 'Demo',
    tags: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [tagInput, setTagInput] = useState('');

  // Filter and search logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'All Categories' || 
                           ASSET_TYPES.find(t => t.value === asset.collateral_type)?.category === filterCategory;
    
    const matchesStage = filterStage === 'All Stages' || asset.sales_stage === filterStage;
    
    const matchesType = filterType === 'all' || asset.collateral_type === filterType;
    
    return matchesSearch && matchesCategory && matchesStage && matchesType;
  });

  // Sort logic
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploaded_at) - new Date(a.uploaded_at);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'downloads':
        return b.downloads - a.downloads;
      case 'size':
        return b.file_size - a.file_size;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalAssets = assets.length;
  const totalDownloads = assets.reduce((sum, asset) => sum + asset.downloads, 0);
  const featuredAssets = assets.filter(asset => asset.is_featured).length;
  const recentAssets = assets.filter(asset => {
    const uploadDate = new Date(asset.uploaded_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return uploadDate > weekAgo;
  }).length;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAssetTypeInfo = (type) => {
    return ASSET_TYPES.find(t => t.value === type) || ASSET_TYPES[0];
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAssets(sortedAssets.map(asset => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId, checked) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    }
  };

  const handleDownloadAsset = (asset) => {
    // Simulate download
    console.log('Downloading:', asset.name);
    // Update download count
    setAssets(prev => prev.map(a => 
      a.id === asset.id ? { ...a, downloads: a.downloads + 1 } : a
    ));
  };

  const handleBulkDownload = () => {
    selectedAssets.forEach(assetId => {
      const asset = assets.find(a => a.id === assetId);
      if (asset) {
        handleDownloadAsset(asset);
      }
    });
    setSelectedAssets([]);
  };

  const handleDeleteAsset = (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(prev => prev.filter(a => a.id !== assetId));
    }
  };

  const handleToggleFeatured = (assetId) => {
    setAssets(prev => prev.map(a => 
      a.id === assetId ? { ...a, is_featured: !a.is_featured } : a
    ));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newAsset.tags.includes(tagInput.trim())) {
        setNewAsset(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewAsset(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUploadAsset = () => {
    if (!selectedFile || !newAsset.name.trim()) return;

    const newAssetData = {
      id: Date.now(),
      ...newAsset,
      file_size: selectedFile.size,
      uploaded_at: new Date().toISOString(),
      file_path: `/assets/${selectedFile.name}`,
      last_updated: new Date().toISOString().split('T')[0],
      downloads: 0,
      created_by: 'Current User',
      is_featured: false,
      version: '1.0'
    };

    setAssets(prev => [newAssetData, ...prev]);
    setShowUploadModal(false);
    setNewAsset({
      name: '',
      description: '',
      collateral_type: 'sales_deck',
      sales_stage: 'Demo',
      tags: []
    });
    setSelectedFile(null);
    setTagInput('');
  };

  if (loading) {
  return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-3 text-gray-600">Loading sales assets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Asset Hub</h1>
          <p className="text-gray-600 mt-1">Centralized repository for all your sales materials and resources</p>
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
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            Upload Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-xl font-semibold text-gray-900">{totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-xl font-semibold text-gray-900">{totalDownloads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-xl font-semibold text-gray-900">{featuredAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Recent</p>
              <p className="text-xl font-semibold text-gray-900">{recentAssets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          {/* Left side - Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
                placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${showFilters ? 'bg-purple-50 text-purple-700 border-purple-300' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters
              {(filterCategory !== 'All Categories' || filterStage !== 'All Stages' || filterType !== 'all') && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Right side - View controls and actions */}
          <div className="flex items-center space-x-3">
            {selectedAssets.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedAssets.length} selected</span>
                <button
                  onClick={handleBulkDownload}
                  className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            )}
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name A-Z</option>
              <option value="downloads">Most Downloaded</option>
              <option value="size">File Size</option>
            </select>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Squares2X2Icon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sales Stage</label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {SALES_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Types</option>
                  {ASSET_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {(filterCategory !== 'All Categories' || filterStage !== 'All Stages' || filterType !== 'all') && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {filteredAssets.length} of {totalAssets} assets shown
                </span>
        <button
                  onClick={() => {
                    setFilterCategory('All Categories');
                    setFilterStage('All Stages');
                    setFilterType('all');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all filters
        </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Assets Display */}
      {sortedAssets.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderIcon className="w-8 h-8 text-gray-400" />
                    </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'All Categories' || filterStage !== 'All Stages' || filterType !== 'all'
              ? "No assets match your current filters. Try adjusting your search or filters."
              : "Get started by uploading your first sales asset."}
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
            Upload First Asset
          </button>
                  </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedAssets.map((asset) => {
                const typeInfo = getAssetTypeInfo(asset.collateral_type);
                const IconComponent = typeInfo.icon;
                
                return (
                  <div key={asset.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="p-4">
                      {/* Header with checkbox and featured star */}
                      <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={(e) => handleSelectAsset(asset.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => handleToggleFeatured(asset.id)}
                          className={`p-1 rounded ${asset.is_featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                          <StarIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Asset Icon and Type */}
                      <div className="flex items-center justify-center mb-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${typeInfo.color}-100`}>
                          <IconComponent className={`w-6 h-6 text-${typeInfo.color}-600`} />
                        </div>
                      </div>

                      {/* Asset Info */}
                      <div className="text-center mb-3">
                        <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-2">{asset.name}</h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{asset.description}</p>
                        
                        {/* Type and Stage badges */}
                        <div className="flex flex-wrap gap-1 justify-center mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                            {typeInfo.label}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {asset.sales_stage}
                          </span>
                        </div>

                        {/* Tags */}
                        {asset.tags && asset.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mb-3">
                            {asset.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                                {tag}
                              </span>
                            ))}
                            {asset.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{asset.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                          {asset.downloads}
                        </div>
                        <div>{formatFileSize(asset.file_size)}</div>
                        <div>{formatDate(asset.uploaded_at)}</div>
                    </div>

                      {/* Actions */}
                      <div className="flex items-center justify-center space-x-1">
                        <button 
                          onClick={() => handleDownloadAsset(asset)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                            <button 
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                            >
                          <EyeIcon className="w-4 h-4" />
                            </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                            </button>
          <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
          >
                          <TrashIcon className="w-4 h-4" />
          </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAssets.length === sortedAssets.length && sortedAssets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Select all ({sortedAssets.length})
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {sortedAssets.map((asset) => {
                  const typeInfo = getAssetTypeInfo(asset.collateral_type);
                  const IconComponent = typeInfo.icon;
                  
                  return (
                    <div key={asset.id} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={(e) => handleSelectAsset(asset.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${typeInfo.color}-100`}>
                            <IconComponent className={`w-4 h-4 text-${typeInfo.color}-600`} />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h3>
                            {asset.is_featured && (
                              <StarIcon className="w-4 h-4 text-yellow-500" />
        )}
      </div>
                          <p className="text-xs text-gray-500 truncate">{asset.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                              {typeInfo.label}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {asset.sales_stage}
                            </span>
                            <span className="text-xs text-gray-500">
                              {asset.downloads} downloads
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(asset.file_size)}
                            </span>
    </div>
      </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleDownloadAsset(asset)}
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Download"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Upload New Asset</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      onChange={e => setSelectedFile(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, PPT, XLS up to 50MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Asset Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asset Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter a descriptive name for your asset"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newAsset.description}
                    onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe what this asset is used for and when to use it"
                  />
                </div>

                {/* Type and Stage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                  <select
                      value={newAsset.collateral_type}
                      onChange={(e) => setNewAsset({ ...newAsset, collateral_type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {ASSET_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Stage</label>
                    <select
                      value={newAsset.sales_stage}
                      onChange={(e) => setNewAsset({ ...newAsset, sales_stage: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {SALES_STAGES.slice(1).map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="space-y-2">
                  <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Type a tag and press Enter"
                    />
                    {newAsset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newAsset.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              <XMarkIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                type="button"
                onClick={handleUploadAsset}
                disabled={saving || !selectedFile || !newAsset.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Uploading...' : 'Upload Asset'}
                </button>
              </div>
          </div>
        </div>
      )}

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default SalesCollateral; 