import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getMarketingEvents, createMarketingEvent, updateMarketingEvent, deleteMarketingEvent } from '../../../../services/marketingService';
import dayjs from 'dayjs';
import { 
  InformationCircleIcon, 
  BookOpenIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftRightIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  CalendarDaysIcon,
  ListBulletIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  GlobeAltIcon,
  ChartBarIcon,
  FireIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Content types with enhanced metadata
const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Post', icon: DocumentTextIcon, color: 'blue', channel: 'Website' },
  { value: 'social_post', label: 'Social Media', icon: ChatBubbleOvalLeftEllipsisIcon, color: 'green', channel: 'Social' },
  { value: 'video', label: 'Video', icon: VideoCameraIcon, color: 'red', channel: 'YouTube' },
  { value: 'newsletter', label: 'Newsletter', icon: DocumentTextIcon, color: 'yellow', channel: 'Email' },
  { value: 'press_release', label: 'Press Release', icon: SpeakerWaveIcon, color: 'purple', channel: 'PR' },
  { value: 'ad_campaign', label: 'Ad Campaign', icon: GlobeAltIcon, color: 'indigo', channel: 'Ads' },
  { value: 'webinar', label: 'Webinar', icon: VideoCameraIcon, color: 'pink', channel: 'Events' },
  { value: 'podcast', label: 'Podcast', icon: SpeakerWaveIcon, color: 'orange', channel: 'Audio' }
];

const STATUSES = [
  { value: 'idea', label: 'Idea', icon: ClockIcon, color: 'gray' },
  { value: 'draft', label: 'Draft', icon: PencilIcon, color: 'blue' },
  { value: 'review', label: 'In Review', icon: EyeIcon, color: 'yellow' },
  { value: 'approved', label: 'Approved', icon: CheckCircleIcon, color: 'green' },
  { value: 'scheduled', label: 'Scheduled', icon: CalendarDaysIcon, color: 'purple' },
  { value: 'published', label: 'Published', icon: CheckCircleIcon, color: 'emerald' },
  { value: 'cancelled', label: 'Cancelled', icon: XMarkIcon, color: 'red' }
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
];

const CAMPAIGNS = [
  'Q1 Product Launch',
  'Brand Awareness',
  'Lead Generation',
  'Customer Retention',
  'Holiday Campaign',
  'Event Promotion'
];

// Mock data for enhanced demo
const MOCK_CONTENT = [
  {
    id: 1,
    title: '10 Ways to Boost Your Productivity',
    type: 'blog',
    status: 'published',
    priority: 'high',
    publishDate: '2024-01-15',
    campaign: 'Q1 Product Launch',
    assignee: 'Sarah Chen',
    description: 'Comprehensive guide to productivity techniques for remote workers',
    channels: ['Website', 'LinkedIn', 'Twitter'],
    performance: { views: 2847, shares: 156, engagement: 0.12 },
    tags: ['productivity', 'remote-work', 'tips']
  },
  {
    id: 2,
    title: 'Product Demo Video Series',
    type: 'video',
    status: 'scheduled',
    priority: 'high',
    publishDate: '2024-01-20',
    campaign: 'Q1 Product Launch',
    assignee: 'Mike Johnson',
    description: 'Weekly video series showcasing product features',
    channels: ['YouTube', 'LinkedIn', 'Website'],
    tags: ['product-demo', 'tutorial', 'features']
  },
  {
    id: 3,
    title: 'Customer Success Stories',
    type: 'social_post',
    status: 'draft',
    priority: 'medium',
    publishDate: '2024-01-18',
    campaign: 'Brand Awareness',
    assignee: 'Emma Davis',
    description: 'Highlighting customer achievements and testimonials',
    channels: ['Instagram', 'Facebook', 'LinkedIn'],
    tags: ['customer-stories', 'testimonials', 'success']
  },
  {
    id: 4,
    title: 'Weekly Industry Newsletter',
    type: 'newsletter',
    status: 'review',
    priority: 'medium',
    publishDate: '2024-01-22',
    campaign: 'Lead Generation',
    assignee: 'David Wilson',
    description: 'Curated industry news and insights for subscribers',
    channels: ['Email'],
    tags: ['newsletter', 'industry-news', 'insights']
  },
  {
    id: 5,
    title: 'New Feature Announcement',
    type: 'press_release',
    status: 'approved',
    priority: 'high',
    publishDate: '2024-01-25',
    campaign: 'Q1 Product Launch',
    assignee: 'Lisa Rodriguez',
    description: 'Official announcement of our latest product features',
    channels: ['PR Wire', 'Website', 'Social Media'],
    tags: ['product-launch', 'features', 'announcement']
  }
];

function getMonthMatrix(year, month) {
  const firstDay = dayjs(`${year}-${month + 1}-01`);
  const startDay = firstDay.startOf('week');
  const endDay = firstDay.endOf('month').endOf('week');
  const days = [];
  let curr = startDay;
  while (curr.isBefore(endDay) || curr.isSame(endDay, 'day')) {
    days.push(curr);
    curr = curr.add(1, 'day');
  }
  return days;
}

// Help Modal Component
const HelpModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('overview');
  const [openContent, setOpenContent] = useState({ intro: true, features: false, best: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ quick: true, tips: false, workflow: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Content Calendar Help</h2>
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
          <button onClick={() => setTab('workflow')} className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 ${tab==='workflow' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> Workflow
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'overview' && (
            <>
              <div className="bg-gray-50 rounded-lg">
                <button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t">
                  <span>What is Content Calendar?</span>
                  {openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.intro && (
                  <div className="px-4 py-3 text-gray-700 text-sm border-t border-gray-200">
                    <p>A comprehensive content planning and campaign management system that helps you organize, schedule, and track all your marketing content across multiple channels.</p>
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
                      <li>Multi-channel content planning</li>
                      <li>Campaign organization & tracking</li>
                      <li>Team collaboration & assignments</li>
                      <li>Performance analytics</li>
                      <li>Content workflow management</li>
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
                      <li>Plan content 2-4 weeks in advance</li>
                      <li>Maintain consistent brand voice</li>
                      <li>Track performance metrics regularly</li>
                      <li>Coordinate campaigns across channels</li>
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
                    <p>1. Switch between Calendar and List views<br/>
                    2. Use filters to find specific content<br/>
                    3. Click "Create Content" to add new items<br/>
                    4. Track performance metrics for published content</p>
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
                    <p>• Color-code content by campaign<br/>
                    • Use priority levels for important content<br/>
                    • Set up content templates for consistency<br/>
                    • Review analytics weekly for optimization</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          {tab === 'workflow' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">Content Workflow</h3>
                <div className="text-sm text-indigo-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">1</div>
                    <span>Idea → Draft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Draft → Review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">3</div>
                    <span>Review → Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">4</div>
                    <span>Approved → Scheduled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs">5</div>
                    <span>Scheduled → Published</span>
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

const ContentCalendar = () => {
  const today = dayjs();
  const { currentOrganization } = useAuth();
  
  // Main state
  const [view, setView] = useState('calendar');
  const [calendarViewType, setCalendarViewType] = useState('monthly');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Calendar navigation
  const [currentMonth, setCurrentMonth] = useState(today.month());
  const [currentYear, setCurrentYear] = useState(today.year());
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Content data
  const [content, setContent] = useState(MOCK_CONTENT);
  const [activities, setActivities] = useState([]);
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    campaign: '',
    assignee: ''
  });
  
  // New content form
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'blog',
    status: 'idea',
    priority: 'medium',
    publishDate: '',
    campaign: '',
    assignee: '',
    description: '',
    channels: [],
    tags: []
  });

  const getTypeConfig = (type) => CONTENT_TYPES.find(t => t.value === type) || CONTENT_TYPES[0];
  const getStatusConfig = (status) => STATUSES.find(s => s.value === status) || STATUSES[0];
  const getPriorityColor = (priority) => PRIORITIES.find(p => p.value === priority)?.color || 'gray';

  const monthStart = dayjs(`${currentYear}-${currentMonth + 1}-01`);
  const monthMatrix = getMonthMatrix(currentYear, currentMonth);

  // Filter content based on search and filters
  const filteredContent = content.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filters.type || item.type === filters.type;
    const matchesStatus = !filters.status || item.status === filters.status;
    const matchesPriority = !filters.priority || item.priority === filters.priority;
    const matchesCampaign = !filters.campaign || item.campaign === filters.campaign;
    const matchesAssignee = !filters.assignee || item.assignee === filters.assignee;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesCampaign && matchesAssignee;
  });

  // Group content by date for calendar view
  const contentByDate = filteredContent.reduce((acc, item) => {
    const date = dayjs(item.publishDate).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  // Statistics for dashboard
  const stats = {
    total: content.length,
    published: content.filter(item => item.status === 'published').length,
    scheduled: content.filter(item => item.status === 'scheduled').length,
    inProgress: content.filter(item => ['draft', 'review', 'approved'].includes(item.status)).length
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrev = () => {
    if (calendarViewType === 'weekly') {
      setCurrentWeekStart(currentWeekStart.subtract(1, 'week'));
    } else {
      handlePrevMonth();
    }
  };

  const handleNext = () => {
    if (calendarViewType === 'weekly') {
      setCurrentWeekStart(currentWeekStart.add(1, 'week'));
    } else {
      handleNextMonth();
    }
  };

  const handleDateClick = (date) => {
    if (date.month() === currentMonth) {
      setSelectedDate(date);
      setNewContent({ ...newContent, publishDate: date.format('YYYY-MM-DD') });
    }
  };

  const handleDateDoubleClick = (date) => {
    if (date.month() === currentMonth) {
      setSelectedDate(date);
      setNewContent({ ...newContent, publishDate: date.format('YYYY-MM-DD') });
      setShowAddModal(true);
    }
  };

  const handleAddContent = async () => {
    if (!newContent.title || !newContent.publishDate) return;

    try {
      setSaving(true);
      // In a real app, this would call an API
      const newItem = {
        ...newContent,
        id: Date.now(),
        assignee: newContent.assignee || 'Current User'
      };
      setContent([...content, newItem]);
      setShowAddModal(false);
      setNewContent({
        title: '',
        type: 'blog',
        status: 'idea',
        priority: 'medium',
        publishDate: '',
        campaign: '',
        assignee: '',
        description: '',
        channels: [],
        tags: []
      });
    } catch (error) {
      console.error('Error adding content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    setContent(content.filter(item => item.id !== contentId));
  };

  // Load activities (compatibility with existing service)
  useEffect(() => {
    if (currentOrganization?.organization_id) {
      loadActivities();
    }
  }, [currentOrganization]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getMarketingEvents(currentOrganization.organization_id);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modern Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Plan, schedule, and track your marketing content across all channels</p>
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

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Content</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-xl font-semibold text-emerald-600">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-xl font-semibold text-purple-600">{stats.scheduled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-xl font-semibold text-yellow-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Enhanced Navigation */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* View Toggle and Search */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setView('calendar')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'calendar' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-purple-600'
                  }`}
            >
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'list' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-purple-600'
                  }`}
            >
                  <ListBulletIcon className="w-4 h-4 mr-2" />
              List
            </button>
          </div>

              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
          </div>
        </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
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
                value={filters.campaign}
                onChange={(e) => setFilters(prev => ({ ...prev, campaign: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map(campaign => (
                  <option key={campaign} value={campaign}>{campaign}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="p-4">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRightIcon className="w-5 h-5 rotate-180" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {calendarViewType === 'monthly' 
                    ? monthStart.format('MMMM YYYY')
                    : `${currentWeekStart.format('MMM D')} – ${currentWeekStart.add(6, 'day').format('MMM D, YYYY')}`
                  }
                </h2>
                <button onClick={handleNext} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
              <select
                value={calendarViewType}
                onChange={e => setCalendarViewType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(calendarViewType === 'monthly' ? monthMatrix : 
                [...Array(7)].map((_, i) => currentWeekStart.add(i, 'day'))
              ).map((date, idx) => {
                const isCurrentMonth = date.month() === currentMonth;
                const isToday = date.isSame(today, 'day');
                const isSelected = selectedDate && date.isSame(selectedDate, 'day');
                const dayContent = contentByDate[date.format('YYYY-MM-DD')] || [];
                
                return (
                  <div
                    key={date.format('YYYY-MM-DD')}
                    onClick={() => handleDateClick(date)}
                    onDoubleClick={() => handleDateDoubleClick(date)}
                    className={`relative min-h-[100px] rounded-lg border text-xs flex flex-col p-2 transition-all cursor-pointer
                      ${isCurrentMonth ? 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50' : 'bg-gray-50 border-gray-100'}
                      ${isToday ? 'border-purple-400 ring-2 ring-purple-200' : ''}
                      ${isSelected ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-100' : ''}
                    `}
                  >
                    <div className={`font-medium mb-2 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'} ${isToday ? 'text-purple-600' : ''}`}>
                      {date.date()}
                        </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {dayContent.slice(0, 3).map((item, i) => {
                        const typeConfig = getTypeConfig(item.type);
                        const statusConfig = getStatusConfig(item.status);
                        return (
                          <div 
                            key={i} 
                            className={`flex items-center gap-1 p-1 rounded text-xs bg-${typeConfig.color}-100 text-${typeConfig.color}-800`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContent(item);
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full bg-${statusConfig.color}-400`} />
                            <span className="truncate flex-1" title={item.title}>{item.title}</span>
                  </div>
                );
              })}
                      {dayContent.length > 3 && (
                        <div className="text-xs text-gray-500 px-1">+{dayContent.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced List View */}
        {view === 'list' && (
          <div className="p-6">
            {filteredContent.length === 0 ? (
              <div className="text-center py-16">
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
              <div className="overflow-x-auto">
                <table className="w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                      <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="w-12 px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContent.map((item) => {
                      const typeConfig = getTypeConfig(item.type);
                      const statusConfig = getStatusConfig(item.status);
                      const TypeIcon = typeConfig.icon;
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedContent(item)}>
                          <td className="px-4 py-4">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 bg-${typeConfig.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <TypeIcon className={`w-4 h-4 text-${typeConfig.color}-600`} />
                          </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate" title={item.title}>{item.title}</div>
                                <div className="text-xs text-gray-500 truncate" title={item.description}>{item.description}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.tags?.slice(0, 2).map((tag) => (
                                    <span key={tag} className="inline-block px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {item.tags?.length > 2 && (
                                    <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>
                                  )}
                                </div>
                              </div>
                        </div>
                      </td>
                          <td className="px-3 py-4">
                            <div className="text-xs text-gray-900 truncate">{typeConfig.label}</div>
                            <div className="text-xs text-gray-500 truncate">{typeConfig.channel}</div>
                        </td>
                          <td className="px-3 py-4">
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs bg-${statusConfig.color}-100 text-${statusConfig.color}-800 w-fit`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              <span className="truncate">{item.status}</span>
                            </div>
                        </td>
                          <td className="px-3 py-4">
                            <div className="text-sm text-gray-900 truncate" title={item.assignee}>
                              {item.assignee?.split(' ')[0]}
                            </div>
                        </td>
                          <td className="px-3 py-4">
                            <div className="text-xs text-gray-500">
                              {new Date(item.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </td>
                          <td className="px-3 py-4">
                            <div className="text-xs text-gray-500 truncate" title={item.campaign}>
                              {item.campaign}
                            </div>
                          </td>
                          <td className="px-2 py-4 text-right">
                          <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContent(item);
                              }}
                              className="text-purple-600 hover:text-purple-700 p-1"
                            >
                              <EyeIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      );
                    })}
                </tbody>
              </table>
              </div>
            )}
          </div>
        )}

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowAddModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex border border-gray-200 overflow-hidden relative" onClick={e => e.stopPropagation()}>
              {/* Left panel */}
              <div className="w-1/3 bg-gradient-to-br from-purple-50 to-indigo-50 border-r border-gray-200 flex flex-col justify-center items-center p-8 text-center">
                <div className="flex flex-col justify-center items-center h-full w-full">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <PlusIcon className="w-8 h-8 text-purple-600" />
              </div>
                  <div className="text-xl font-bold text-purple-900 mb-2">Create Content</div>
                  <div className="text-sm text-gray-600 mb-4">Plan and schedule your next piece of marketing content</div>
                  <div className="text-xs text-gray-500">Choose content type, set publication date, and assign team members</div>
                </div>
              </div>
              
              {/* Right form panel */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="max-w-lg mx-auto space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Title</label>
                    <input
                      type="text"
                        value={newContent.title}
                        onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter content title"
                    />
                  </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <select
                          value={newContent.type}
                          onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {CONTENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={newContent.status}
                          onChange={(e) => setNewContent({ ...newContent, status: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {STATUSES.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          value={newContent.priority}
                          onChange={(e) => setNewContent({ ...newContent, priority: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {PRIORITIES.map(priority => (
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
                    <input
                      type="date"
                          value={newContent.publishDate}
                          onChange={(e) => setNewContent({ ...newContent, publishDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign</label>
                        <select
                          value={newContent.campaign}
                          onChange={(e) => setNewContent({ ...newContent, campaign: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select campaign</option>
                          {CAMPAIGNS.map(campaign => (
                            <option key={campaign} value={campaign}>{campaign}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                        <input
                          type="text"
                          value={newContent.assignee}
                          onChange={(e) => setNewContent({ ...newContent, assignee: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Assign to team member"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        value={newContent.description}
                        onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Describe the content..."
                    />
                  </div>
                </div>
                </div>
                
                {/* Modal footer */}
                <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddContent}
                    disabled={saving || !newContent.title || !newContent.publishDate}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Creating...' : 'Create Content'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedContent(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const typeConfig = getTypeConfig(selectedContent.type);
                    const TypeIcon = typeConfig.icon;
                    return (
                      <div className={`w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center`}>
                        <TypeIcon className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()}
                  <h3 className="text-lg font-semibold text-white">{selectedContent.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-white hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              {/* Status and Type */}
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
                      return (
                        <div className={`flex items-center px-3 py-2 rounded-md bg-${typeConfig.color}-100 text-${typeConfig.color}-800 w-fit`}>
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
                  <label className="text-sm font-medium text-gray-700">Assignee</label>
                  <p className="mt-1 text-gray-900">{selectedContent.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Campaign</label>
                  <p className="mt-1 text-gray-900">{selectedContent.campaign}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Publish Date</label>
                  <p className="mt-1 text-gray-900">{new Date(selectedContent.publishDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <p className="mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(selectedContent.priority)}-100 text-${getPriorityColor(selectedContent.priority)}-800`}>
                      {selectedContent.priority}
                    </span>
                  </p>
                </div>
              </div>

              {/* Channels */}
              {selectedContent.channels && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Channels</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedContent.channels.map((channel) => (
                      <span key={channel} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedContent.tags && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedContent.tags.map((tag) => (
                      <span key={tag} className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance metrics for published content */}
              {selectedContent.status === 'published' && selectedContent.performance && (
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

            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={() => handleDeleteContent(selectedContent.id)}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
              <div className="flex space-x-3">
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
        </div>
      )}

      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  );
};

export default ContentCalendar; 