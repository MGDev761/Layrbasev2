import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getMarketingEvents, createMarketingEvent, updateMarketingEvent, deleteMarketingEvent } from '../../../../services/marketingService';
import dayjs from 'dayjs';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <h2 className="text-xl font-bold text-white tracking-tight">Events Calendar Help & Tips</h2>
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
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Introduction</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>The Events Calendar helps you plan, track, and manage all your marketing activities in one place, including blog posts, campaigns, and launches.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Why It's Important</span>{openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.why && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Centralizes all marketing events for better visibility</li><li>Helps avoid scheduling conflicts</li><li>Improves team collaboration and planning</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Best Practice</span>{openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.best && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Keep the calendar updated after every event</li><li>Use filters and search to quickly find activities</li><li>Review upcoming events weekly with your team</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Quick Start</span>{openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.quick && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Switch between List and Calendar views. Add new events with the "Add" button. Use search and filters to find specific activities.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Tips</span>{openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.tips && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Color-code event types for clarity. Use the search bar to quickly locate events. Export the calendar for team sharing.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">FAQ</span>{openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.faq && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Q: Can I sync with Google Calendar? <br/>A: Not yet, but it's on the roadmap.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your marketing events assistant. I can help you plan, schedule, and optimize your marketing calendar.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I avoid overlapping campaigns?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Use the calendar view to spot overlaps and coordinate with your team before scheduling new events.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about marketing events..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

const MarketingCalendar = () => {
  const today = dayjs();
  const { currentOrganization } = useAuth();
  const [view, setView] = useState('calendar');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.month());
  const [currentYear, setCurrentYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today);
  const [newActivity, setNewActivity] = useState({
    title: '',
    event_type: 'blog',
    event_date: '',
    description: ''
  });
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [calendarViewType, setCalendarViewType] = useState('monthly'); // 'monthly' or 'weekly'
  const [currentWeekStart, setCurrentWeekStart] = useState(today.startOf('week'));

  const activityTypes = [
    { value: 'blog', label: 'Blog Post', color: 'bg-blue-100 text-blue-800' },
    { value: 'press_release', label: 'Press Release', color: 'bg-green-100 text-green-800' },
    { value: 'ad_campaign', label: 'Ad Campaign', color: 'bg-purple-100 text-purple-800' },
    { value: 'newsletter', label: 'Newsletter', color: 'bg-orange-100 text-orange-800' }
  ];

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800'
  };

  const eventTypes = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'launch', label: 'Launch' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'blog', label: 'Blog' },
    { value: 'other', label: 'Other' },
  ];

  const monthStart = dayjs(`${currentYear}-${currentMonth + 1}-01`);
  const monthMatrix = getMonthMatrix(currentYear, currentMonth);

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = activities.filter(activity => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(activity.event_type);
    const matchesSearch =
      !searchTerm ||
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const eventsByDate = filteredEvents.reduce((acc, activity) => {
    const date = dayjs(activity.event_date).format('YYYY-MM-DD');
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

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

  const handleAddActivity = async () => {
    if (!newActivity.title || !newActivity.event_date) return;

    try {
      setSaving(true);
      await createMarketingEvent(newActivity, currentOrganization.organization_id);
      setShowAddModal(false);
      setNewActivity({ title: '', event_type: 'blog', event_date: '', description: '' });
      setSelectedDate(today);
      await loadActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await deleteMarketingEvent(activityId);
      await loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  const handleDateClick = (date) => {
    if (date.month() === currentMonth) {
      setSelectedDate(date);
      setNewActivity({ ...newActivity, event_date: date.format('YYYY-MM-DD') });
    }
  };

  const handleDateDoubleClick = (date) => {
    if (date.month() === currentMonth) {
      setSelectedDate(date);
      setNewActivity({ ...newActivity, event_date: date.format('YYYY-MM-DD') });
      setShowAddModal(true);
    }
  };

  const handleAddNewForSelectedDate = () => {
    if (selectedDate) {
      setShowAddModal(true);
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

  return (
    <>
      {/* Heading and Help Button (now above the card) */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Marketing Calendar</h1>
          <p className="text-gray-600 text-sm mb-2">Plan and manage your marketing activities including blog posts, press releases, ad campaigns, and newsletters.</p>
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
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        {/* Top controls: Toggle and main actions */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          {/* Toggle group for calendar/list */}
          <div className="flex bg-gray-100 p-1 rounded-lg gap-0.5">
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-100 ${view === 'calendar' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-purple-600'}`}
              onClick={() => setView('calendar')}
            >
              Calendar
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-100 ${view === 'list' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-purple-600'}`}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>
          {/* Main actions */}
          <div className="flex gap-2">
            <button className="px-2 py-1 text-sm font-medium text-purple-700 bg-transparent border-none hover:underline rounded transition-colors">Export CSV</button>
            <button className="px-3 py-1.5 rounded-md text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">+ Add New</button>
          </div>
        </div>

        {/* Month navigation and controls */}
        {view === 'calendar' && (
          <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} className="px-2 py-1 rounded hover:bg-gray-100 text-lg">&#8592;</button>
              {calendarViewType === 'monthly' ? (
                <span className="font-semibold text-gray-900">
                  {monthStart.format('MMMM YYYY')}
                </span>
              ) : (
                <span className="font-semibold text-gray-900">
                  {currentWeekStart.format('MMM D')} – {currentWeekStart.add(6, 'day').format('MMM D, YYYY')}
                </span>
              )}
              <button onClick={handleNext} className="px-2 py-1 rounded hover:bg-gray-100 text-lg">&#8594;</button>
            </div>
            <div className="flex gap-2 items-center">
              <select
                className="px-3 py-2 rounded-md text-sm font-medium border border-purple-200 bg-purple-50 text-purple-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={calendarViewType}
                onChange={e => setCalendarViewType(e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-48"
              />
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border border-gray-200 text-purple-700 bg-white hover:bg-purple-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
                Filter
              </button>
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border border-gray-200 text-purple-700 bg-white hover:bg-purple-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 10h12M9 14h6M12 18h0" /></svg>
                Sort
              </button>
            </div>
          </div>
        )}

        {/* Calendar grid */}
        {view === 'calendar' && calendarViewType === 'monthly' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-xs font-semibold text-gray-500 text-center py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthMatrix.map((date, idx) => {
                const isCurrentMonth = date.month() === currentMonth;
                const isToday = date.isSame(today, 'day');
                const isSelected = selectedDate && date.isSame(selectedDate, 'day');
                const events = eventsByDate[date.format('YYYY-MM-DD')] || [];
                return (
                  <div
                    key={date.format('YYYY-MM-DD')}
                    onClick={() => handleDateClick(date)}
                    onDoubleClick={() => handleDateDoubleClick(date)}
                    className={`relative min-h-[80px] rounded-lg border text-xs flex flex-col px-2 py-1 transition-all duration-100 cursor-pointer
                      ${isCurrentMonth ? 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50' : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'}
                      ${isToday ? 'border-purple-400 ring-2 ring-purple-200' : ''}
                      ${isSelected ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-100' : ''}
                    `}
                    style={!isCurrentMonth ? { backgroundImage: 'repeating-linear-gradient(135deg, #f3f4f6 0px, #f3f4f6 4px, #e5e7eb 4px, #e5e7eb 8px)' } : {}}
                  >
                    <div className={`font-semibold mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}`}>{date.date()}</div>
                    <div className="flex flex-col gap-1">
                      {events.map((event, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs">
                          {/* Example: emoji by type, fallback to 📌 */}
                          <span>{event.event_type === 'blog' ? '📝' : event.event_type === 'press_release' ? '📰' : event.event_type === 'ad_campaign' ? '📢' : event.event_type === 'newsletter' ? '✉️' : '📌'}</span>
                          <span className="truncate max-w-[80px]" title={event.title}>{event.title}</span>
                          <span className="ml-1 px-1 rounded bg-gray-100 text-gray-500 text-[10px]">{event.status || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {view === 'calendar' && calendarViewType === 'weekly' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-xs font-semibold text-gray-500 text-center py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, i) => {
                const date = currentWeekStart.add(i, 'day');
                const isCurrentMonth = date.month() === currentMonth;
                const isToday = date.isSame(today, 'day');
                const isSelected = selectedDate && date.isSame(selectedDate, 'day');
                const events = eventsByDate[date.format('YYYY-MM-DD')] || [];
                return (
                  <div
                    key={date.format('YYYY-MM-DD')}
                    onClick={() => handleDateClick(date)}
                    onDoubleClick={() => handleDateDoubleClick(date)}
                    className={`relative min-h-[80px] rounded-lg border text-xs flex flex-col px-2 py-1 transition-all duration-100 cursor-pointer
                      ${isCurrentMonth ? 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50' : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'}
                      ${isToday ? 'border-purple-400 ring-2 ring-purple-200' : ''}
                      ${isSelected ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-100' : ''}
                    `}
                  >
                    <div className={`font-semibold mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}`}>{date.date()}</div>
                    <div className="flex flex-col gap-1">
                      {events.map((event, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs">
                          <span>{event.event_type === 'blog' ? '📝' : event.event_type === 'press_release' ? '📰' : event.event_type === 'ad_campaign' ? '📢' : event.event_type === 'newsletter' ? '✉️' : '📌'}</span>
                          <span className="truncate max-w-[80px]" title={event.title}>{event.title}</span>
                          <span className="ml-1 px-1 rounded bg-gray-100 text-gray-500 text-[10px]">{event.status || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List view (existing) */}
        {view === 'list' && (
          <div className="mt-4">
            {/* Controls row for list view */}
            <div className="flex gap-2 items-center mb-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-48"
              />
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border border-gray-200 text-purple-700 bg-white hover:bg-purple-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
                Filter
              </button>
              <button className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium border border-gray-200 text-purple-700 bg-white hover:bg-purple-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 10h12M9 14h6M12 18h0" /></svg>
                Sort
              </button>
            </div>
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading activities...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm">No marketing activities yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-500">{activity.description}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activityTypes.find(t => t.value === activity.event_type)?.color || 'bg-gray-100 text-gray-800'}`}>
                            {activityTypes.find(t => t.value === activity.event_type)?.label || activity.event_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(activity.event_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button 
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                <h3 className="text-lg font-medium text-gray-900">Add New Activity</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleAddActivity(); }} className="flex-1 flex flex-col justify-center">
                <div className="flex-1 px-6 py-8 flex flex-col justify-center">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                    <input
                      type="text"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      placeholder="Enter activity title"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newActivity.event_type}
                      onChange={(e) => setNewActivity({ ...newActivity, event_type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                    <input
                      type="date"
                      value={newActivity.event_date}
                      onChange={(e) => setNewActivity({ ...newActivity, event_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Adding...' : 'Add Activity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  );
};

export default MarketingCalendar; 