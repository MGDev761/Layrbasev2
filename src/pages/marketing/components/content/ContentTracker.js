import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ShareIcon,
  TagIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import Modal from '../../../../components/common/layout/Modal';

// Enhanced mock data with more realistic content examples
const MOCK_CONTENT = [
  {
    id: 1,
    title: 'AI in TV Planning: The Future of Advertising',
    type: 'Blog',
    channel: 'Website',
    status: 'Draft',
    owner: 'Sam Johnson',
    publishDate: '2025-01-15',
    tags: ['Thought Leadership', 'AI', 'Technology'],
    description: 'Comprehensive guide on how AI is revolutionizing television advertising planning and execution.',
    wordCount: 2500,
    estimatedReadTime: '10 min',
    priority: 'High',
    createdDate: '2025-01-05',
    lastUpdated: '2025-01-08',
    performance: { views: 1250, shares: 45, engagement: 0.08 }
  },
  {
    id: 2,
    title: 'Product Demo: New Dashboard Features',
    type: 'Video',
    channel: 'LinkedIn',
    status: 'Scheduled',
    owner: 'Jess Williams',
    publishDate: '2025-01-12',
    tags: ['Product Update', 'Demo', 'Features'],
    description: 'Walkthrough of our latest dashboard improvements and new analytics capabilities.',
    wordCount: null,
    estimatedReadTime: '5 min',
    priority: 'Medium',
    createdDate: '2025-01-02',
    lastUpdated: '2025-01-10',
    performance: { views: 850, shares: 32, engagement: 0.12 }
  },
  {
    id: 3,
    title: 'Series A Funding Announcement',
    type: 'Email',
    channel: 'Email Campaign',
    status: 'In Review',
    owner: 'Mark Davis',
    publishDate: '2025-01-20',
    tags: ['Investor Comms', 'Funding', 'Company News'],
    description: 'Official announcement of our Series A funding round to investors and stakeholders.',
    wordCount: 800,
    estimatedReadTime: '3 min',
    priority: 'High',
    createdDate: '2025-01-01',
    lastUpdated: '2025-01-09',
    performance: { views: 0, shares: 0, engagement: 0 }
  },
  {
    id: 4,
    title: 'Customer Success Stories',
    type: 'Social',
    channel: 'Twitter',
    status: 'Published',
    owner: 'Sarah Chen',
    publishDate: '2025-01-08',
    tags: ['Customer Stories', 'Social Proof', 'Success'],
    description: 'Thread showcasing how our clients achieve success with our platform.',
    wordCount: 280,
    estimatedReadTime: '2 min',
    priority: 'Medium',
    createdDate: '2024-12-28',
    lastUpdated: '2025-01-08',
    performance: { views: 3200, shares: 87, engagement: 0.15 }
  },
  {
    id: 5,
    title: 'Q1 Growth Strategies Webinar',
    type: 'Webinar',
    channel: 'Zoom',
    status: 'Idea',
    owner: 'Alex Rodriguez',
    publishDate: '2025-02-01',
    tags: ['Education', 'Growth', 'Strategy'],
    description: 'Interactive session on growth strategies for Q1 featuring industry experts.',
    wordCount: null,
    estimatedReadTime: '60 min',
    priority: 'High',
    createdDate: '2025-01-03',
    lastUpdated: '2025-01-07',
    performance: { views: 0, shares: 0, engagement: 0 }
  }
];

const CONTENT_TYPES = [
  { value: 'Blog', label: 'Blog Post', icon: DocumentTextIcon, color: 'blue' },
  { value: 'Video', label: 'Video', icon: VideoCameraIcon, color: 'red' },
  { value: 'Email', label: 'Email', icon: ChatBubbleLeftRightIcon, color: 'green' },
  { value: 'Social', label: 'Social Media', icon: ShareIcon, color: 'purple' },
  { value: 'Webinar', label: 'Webinar', icon: CalendarIcon, color: 'orange' },
  { value: 'Infographic', label: 'Infographic', icon: PhotoIcon, color: 'pink' }
];

const STATUSES = [
  { value: 'Idea', label: 'Idea', color: 'gray', icon: SparklesIcon },
  { value: 'Draft', label: 'Draft', color: 'yellow', icon: PencilIcon },
  { value: 'In Review', label: 'In Review', color: 'orange', icon: EyeIcon },
  { value: 'Scheduled', label: 'Scheduled', color: 'blue', icon: ClockIcon },
  { value: 'Published', label: 'Published', color: 'green', icon: CheckCircleIcon },
  { value: 'Archived', label: 'Archived', color: 'gray', icon: ExclamationTriangleIcon }
];

const CHANNELS = [
  'Website', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube', 
  'Email Campaign', 'Newsletter', 'Zoom', 'Blog', 'Podcast'
];

const OWNERS = ['Sam Johnson', 'Jess Williams', 'Mark Davis', 'Sarah Chen', 'Alex Rodriguez'];

const PRIORITIES = [
  { value: 'Low', color: 'gray' },
  { value: 'Medium', color: 'yellow' },
  { value: 'High', color: 'red' }
];

// Help Modal Component
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Content Management Help</h3>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Getting Started</h4>
            <p className="text-sm text-gray-600 mb-3">Your Content Hub helps you plan, create, and track all marketing content across channels.</p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Plan content with ideas and drafts</li>
              <li>• Track progress through review stages</li>
              <li>• Schedule and publish across channels</li>
              <li>• Monitor performance and engagement</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Content Workflow</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {STATUSES.map((status) => {
                const Icon = status.icon;
                return (
                  <div key={status.value} className={`flex items-center px-2 py-1 rounded-full text-xs bg-${status.color}-100 text-${status.color}-800`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {status.label}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-600">Content moves through these stages from idea to published.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Pro Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Use tags to organize content by campaign or theme</li>
              <li>• Set priorities to focus on high-impact content</li>
              <li>• Track performance to optimize future content</li>
              <li>• Use the calendar view for content planning</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentTracker = () => {
  const [content, setContent] = useState(MOCK_CONTENT);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'calendar'
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    owner: '',
    priority: '',
    channel: ''
  });
  const [selectedContent, setSelectedContent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [sortBy, setSortBy] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter content based on current filters
  const filteredContent = content.filter(item => {
    return (
      (!filters.search || 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      ) &&
      (!filters.type || item.type === filters.type) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.owner || item.owner === filters.owner) &&
      (!filters.priority || item.priority === filters.priority) &&
      (!filters.channel || item.channel === filters.channel)
    );
  });

  // Sort content
  const sortedContent = [...filteredContent].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'publishDate' || sortBy === 'createdDate' || sortBy === 'lastUpdated') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getTypeConfig = (type) => CONTENT_TYPES.find(t => t.value === type) || CONTENT_TYPES[0];
  const getStatusConfig = (status) => STATUSES.find(s => s.value === status) || STATUSES[0];
  const getPriorityColor = (priority) => PRIORITIES.find(p => p.value === priority)?.color || 'gray';

  // Calculate stats
  const stats = {
    total: content.length,
    published: content.filter(c => c.status === 'Published').length,
    inProgress: content.filter(c => ['Draft', 'In Review'].includes(c.status)).length,
    scheduled: content.filter(c => c.status === 'Scheduled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Hub</h1>
          <p className="text-gray-600 mt-1">Plan, create, and track all your marketing content in one place</p>
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
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Content
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Content</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-xl font-semibold text-gray-900">{stats.published}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <PencilIcon className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-xl font-semibold text-gray-900">{stats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-xl font-semibold text-gray-900">{stats.scheduled}</div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
                placeholder="Search content, tags, or descriptions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

            <div className="flex space-x-2">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
              <option value="">All Types</option>
                {CONTENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
            </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
              <option value="">All Statuses</option>
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
            </select>

              <select
                value={filters.owner}
                onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
              <option value="">All Owners</option>
                {OWNERS.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
            </select>
            </div>
          </div>

          {/* View Mode Toggle */}
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
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 ${viewMode === 'calendar' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {sortedContent.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-600 mb-6">Create your first piece of content to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Content
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          {viewMode === 'grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedContent.map((item) => {
                  const typeConfig = getTypeConfig(item.type);
                  const statusConfig = getStatusConfig(item.status);
                  const TypeIcon = typeConfig.icon;
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={item.id}
                      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedContent(item)}
                    >
                      {/* Priority badge */}
                      {item.priority && (
                        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full bg-${getPriorityColor(item.priority)}-400`} />
                      )}
                      
                      {/* Type icon */}
                      <div className={`w-10 h-10 bg-${typeConfig.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                        <TypeIcon className={`w-5 h-5 text-${typeConfig.color}-600`} />
                      </div>
                      
                      {/* Content */}
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      
                      {/* Status and meta */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {item.status}
                        </div>
                        <span className="text-xs text-gray-500">{item.estimatedReadTime}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                        )}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <UserIcon className="w-3 h-3 mr-1" />
                          {item.owner.split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.publishDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {/* Performance for published content */}
                      {item.status === 'Published' && item.performance && (
                        <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                          <span>{item.performance.views} views</span>
                          <span>{item.performance.shares} shares</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                      <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">Content</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="w-12 px-2 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                    {sortedContent.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16">
                          <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600">No content found</p>
                        </td>
                      </tr>
                    ) : (
                      sortedContent.map((item) => {
                        const typeConfig = getTypeConfig(item.type);
                        const statusConfig = getStatusConfig(item.status);
                        const TypeIcon = typeConfig.icon;
                        const StatusIcon = statusConfig.icon;
                        
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedContent(item)}>
                            <td className="px-4 py-4 min-w-0">
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 bg-${typeConfig.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <TypeIcon className={`w-4 h-4 text-${typeConfig.color}-600`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate" title={item.title}>{item.title}</div>
                                  <div className="text-xs text-gray-500 truncate" title={item.description}>{item.description}</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.tags.slice(0, 2).map((tag) => (
                                      <span key={tag} className="inline-block px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs truncate max-w-16" title={tag}>
                                        {tag}
                                      </span>
                                    ))}
                                    {item.tags.length > 2 && (
                                      <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="text-xs text-gray-900 truncate" title={typeConfig.label}>{typeConfig.label}</div>
                              <div className="text-xs text-gray-500 truncate" title={item.channel}>{item.channel}</div>
                            </td>
                            <td className="px-3 py-4">
                              <div className={`flex items-center px-2 py-1 rounded-full text-xs bg-${statusConfig.color}-100 text-${statusConfig.color}-800 w-fit max-w-full`}>
                                <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{item.status}</span>
                    </div>
                            </td>
                            <td className="px-3 py-4">
                              <div className="text-sm text-gray-900 truncate" title={item.owner}>
                                {item.owner.split(' ')[0]}
                  </div>
                </td>
                            <td className="px-3 py-4">
                              <div className="text-xs text-gray-500">
                                {new Date(item.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                </td>
                            <td className="px-3 py-4">
                              {item.status === 'Published' && item.performance ? (
                                <div className="text-xs text-gray-500">
                                  {item.performance.views}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                </td>
                            <td className="px-2 py-4 text-right">
                              <button className="text-purple-600 hover:text-purple-700 p-1">
                                <EyeIcon className="w-4 h-4" />
                              </button>
                </td>
              </tr>
                        );
                      })
                    )}
          </tbody>
        </table>
      </div>
            </div>
          )}

          {viewMode === 'calendar' && (
            <div className="p-6">
              <div className="text-center py-16">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Calendar view coming soon with full scheduling capabilities</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedContent(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedContent.title}</h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              {/* Status and meta info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {(() => {
                      const statusConfig = getStatusConfig(selectedContent.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <div className={`flex items-center px-3 py-2 rounded-md bg-${statusConfig.color}-100 text-${statusConfig.color}-800 w-fit`}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {selectedContent.status}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <div className="mt-1">
                    {(() => {
                      const typeConfig = getTypeConfig(selectedContent.type);
                      const TypeIcon = typeConfig.icon;
                      return (
                        <div className={`flex items-center px-3 py-2 rounded-md bg-${typeConfig.color}-100 text-${typeConfig.color}-800 w-fit`}>
                          <TypeIcon className="w-4 h-4 mr-2" />
                          {typeConfig.label}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-gray-900">{selectedContent.description}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Owner</label>
                  <p className="mt-1 text-gray-900">{selectedContent.owner}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Channel</label>
                  <p className="mt-1 text-gray-900">{selectedContent.channel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Publish Date</label>
                  <p className="mt-1 text-gray-900">{new Date(selectedContent.publishDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estimated Read Time</label>
                  <p className="mt-1 text-gray-900">{selectedContent.estimatedReadTime}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedContent.tags.map((tag) => (
                    <span key={tag} className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performance metrics for published content */}
              {selectedContent.status === 'Published' && selectedContent.performance && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Performance</label>
                  <div className="mt-1 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-semibold text-blue-900">{selectedContent.performance.views}</div>
                      <div className="text-sm text-blue-700">Views</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-lg font-semibold text-green-900">{selectedContent.performance.shares}</div>
                      <div className="text-sm text-green-700">Shares</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-lg font-semibold text-purple-900">{(selectedContent.performance.engagement * 100).toFixed(1)}%</div>
                      <div className="text-sm text-purple-700">Engagement</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50">
              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                Edit Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-xl mx-4">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white">Create New Content</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Enter content title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Describe your content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {CONTENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {CHANNELS.map(channel => (
                      <option key={channel} value={channel}>{channel}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {OWNERS.map(owner => (
                      <option key={owner} value={owner}>{owner}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {PRIORITIES.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.value}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Enter tags separated by commas..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                Create Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default ContentTracker; 