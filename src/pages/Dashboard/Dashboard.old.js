import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCompanyProfile } from '../../services/legalService';
import { getUpcomingMarketingEvents } from '../../services/marketingService';
import { getRecentActivities } from '../../services/salesService';
import { fetchHolidays } from '../../services/holidaysService';
import { useBudget } from '../../hooks/useBudget';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  BellIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/20/solid';
import { useNotifications } from '../../contexts/NotificationContext';
import { fetchMyTasks } from '../../services/taskService';

// Icon helper for notifications
const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case 'warning':
      return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
    case 'info':
      return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
    default:
      return <BellIcon className="h-4 w-4 text-gray-500" />;
  }
};

const Dashboard = () => {
  const { currentOrganization, user } = useAuth();
  const { notifications } = useNotifications();
  const { totals: budgetTotals, loading: budgetLoading } = useBudget({ isForecast: false });
  const { totals: forecastTotals, loading: forecastLoading } = useBudget({ isForecast: true });
  const monthIndex = new Date().getMonth(); // 0-based
  const [companyProfile, setCompanyProfile] = useState(null);
  const [marketingEvents, setMarketingEvents] = useState([]);
  const [salesActivities, setSalesActivities] = useState([]);
  const [holidaysSnapshot, setHolidaysSnapshot] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dashboardSections, setDashboardSections] = useState({
    financial: true,
    notifications: true,
    salesActivity: true,
    marketing: true,
    holidays: true,
    businessDetails: false
  });

  // Fetch company profile data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentOrganization?.organization_id) return;
      
      try {
        setLoading(true);
        const [profileData, eventsData, salesActs] = await Promise.all([
          getCompanyProfile(currentOrganization.organization_id),
          getUpcomingMarketingEvents(currentOrganization.organization_id, 5),
          getRecentActivities(currentOrganization.organization_id, 5)
        ]);
        setCompanyProfile(profileData);
        setMarketingEvents(eventsData);
        setSalesActivities(salesActs || []);
        setHolidaysSnapshot(await fetchHolidays(currentOrganization.organization_id, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentOrganization]);

  console.log('budgetTotals', budgetTotals);
  console.log('forecastTotals', forecastTotals);
  console.log('monthIndex', monthIndex);
  console.log('Rendering Revenue:', {
    forecast: forecastTotals?.revenue?.[monthIndex],
    budget: budgetTotals?.revenue?.[monthIndex],
    allForecast: forecastTotals?.revenue,
    allBudget: budgetTotals?.revenue,
    monthIndex
  });

  const financialMetrics = [
    {
      name: 'Revenue',
      value: (forecastTotals?.revenue?.[monthIndex] ?? 0),
      subValue: (budgetTotals?.revenue?.[monthIndex] ?? 0),
      change: '',
      changeType: (forecastTotals?.revenue?.[monthIndex] ?? 0) > (budgetTotals?.revenue?.[monthIndex] ?? 0) ? 'positive' : 
                  (forecastTotals?.revenue?.[monthIndex] ?? 0) < (budgetTotals?.revenue?.[monthIndex] ?? 0) ? 'negative' : 'neutral'
    },
    { 
      name: 'Cash Flow', 
      value: 'set-up-cashflow', 
      change: '', 
      changeType: 'neutral' 
    },
    { 
      name: 'Monthly Costs', 
      value: (forecastTotals?.expense?.[monthIndex] ?? 0),
      subValue: (budgetTotals?.expense?.[monthIndex] ?? 0),
      change: '', 
      changeType: (forecastTotals?.expense?.[monthIndex] ?? 0) < (budgetTotals?.expense?.[monthIndex] ?? 0) ? 'positive' : 
                  (forecastTotals?.expense?.[monthIndex] ?? 0) > (budgetTotals?.expense?.[monthIndex] ?? 0) ? 'negative' : 'neutral'
    },
    { 
      name: 'Runway', 
      value: 'set-up-cashflow', 
      change: '', 
      changeType: 'neutral' 
    },
  ];

  const upcomingReleases = [
    { title: 'Q1 Product Launch', date: 'Mar 15, 2024', status: 'On Track' },
    { title: 'Brand Campaign', date: 'Apr 1, 2024', status: 'In Progress' },
    { title: 'Website Redesign', date: 'Apr 15, 2024', status: 'Planning' },
  ];

  const teamHolidays = [
    { name: 'Sarah Johnson', role: 'Marketing Manager', dates: 'Mar 18-22, 2024', status: 'Approved' },
    { name: 'Mike Chen', role: 'Developer', dates: 'Mar 25-29, 2024', status: 'Pending' },
    { name: 'Emma Davis', role: 'Sales Rep', dates: 'Apr 1-5, 2024', status: 'Approved' },
    { name: 'Alex Thompson', role: 'Designer', dates: 'Apr 8-12, 2024', status: 'Requested' },
  ];

  const handleNotificationClick = (notification) => {
    // This will be handled by the notification modal
    console.log('Notification clicked:', notification);
  };

  const handleSectionToggle = (section) => {
    setDashboardSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // MyTasksWidget styled like Notifications, but with real data
  const MyTasksWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!currentOrganization?.organization_id || !user?.id) {
        setTasks([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      fetchMyTasks(currentOrganization.organization_id, user.id, 5)
        .then(setTasks)
        .catch(setError)
        .finally(() => setLoading(false));
    }, [currentOrganization, user]);

    return (
      <div className="bg-white rounded-md flex flex-col h-[280px]">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg">
          <h2 className="text-base font-semibold text-gray-900">My Tasks</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">Error loading tasks</div>
          ) : tasks.length > 0 ? (
            tasks.map((task, idx) => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate text-gray-900">{task.title}</p>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">Due: {task.due_date || '-'}</span>
                  </div>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Awaiting Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <ClockIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No tasks</p>
              </div>
            </div>
          )}
        </div>
        {/* Footer (optional) */}
        <div className="px-4 py-2 bg-gray-50 rounded-b-lg flex items-center justify-end">
          <a href="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
            Go to Tasks
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's an overview of your organization's key metrics and activities.
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowEditModal(!showEditModal)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Dashboard
          </button>
          
          {/* Edit Dashboard Modal */}
          {showEditModal && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-2xl border border-gray-300 z-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dashboard Sections</h3>
                <div className="space-y-2">
                  {Object.entries(dashboardSections).map(([section, isVisible]) => (
                    <label key={section} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => handleSectionToggle(section)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {section === 'salesActivity' ? 'Sales Activity' : 
                         section === 'businessDetails' ? 'Business Details' : 
                         section}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Overview - Full Width */}
      {dashboardSections.financial && (
        <div>
          <div className="bg-white rounded-md flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg">
              <h2 className="text-base font-semibold text-gray-900">Financial Overview</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-200" title="Settings">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-gray-200">
                {financialMetrics.map((metric, i) => (
                  <div key={metric.name} className="flex flex-col items-start justify-center p-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.name}</p>
                    {metric.value === 'set-up-cashflow' ? (
                      <a href="/finance" className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex items-center justify-center transition-colors">
                        <div className="text-center">
                          <svg className="w-6 h-6 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <p className="text-xs text-gray-600 font-medium">Set up cashflow analysis</p>
                        </div>
                      </a>
                    ) : metric.value === 0 ? (
                      <a href="/finance" className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-3 flex items-center justify-center transition-colors">
                        <div className="text-center">
                          <svg className="w-6 h-6 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-600 font-medium">Set up budget analysis</p>
                        </div>
                      </a>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold text-gray-900">
                            {(forecastLoading || budgetLoading)
                              ? <span>Loading...</span>
                              : ((metric.value !== null && metric.value !== undefined) || (metric.subValue !== null && metric.subValue !== undefined)) ? (
                                <>
                                  <span>£{metric.value !== null && metric.value !== undefined ? metric.value.toLocaleString() : ''}</span>
                                  <div className="text-xs text-gray-500">
                                    vs Budget: £{metric.subValue !== null && metric.subValue !== undefined ? metric.subValue.toLocaleString() : ''}
                                  </div>
                                </>
                              ) : (
                                <span>Loading...</span>
                              )}
                          </p>
                          {metric.changeType !== 'neutral' && (
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              metric.changeType === 'positive' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {metric.changeType === 'positive' ? (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                </svg>
                              )}
                              {metric.change}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications and Sales Activities - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications (replaced with MyTasksWidget) */}
        {dashboardSections.notifications && (
          <MyTasksWidget />
        )}

        {/* Sales Activities */}
        {dashboardSections.salesActivity && (
          <div>
            <div className="bg-white rounded-md flex flex-col h-[280px]">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg">
                <h2 className="text-base font-semibold text-gray-900">Sales Activities</h2>
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-200" title="Add Lead">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="Settings">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading activities...</p>
                  </div>
                ) : salesActivities.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {salesActivities.map((activity, idx) => (
                      <div key={activity.id} className={`flex items-start space-x-3 py-3 ${idx === 0 ? '' : ''}`}>
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          activity.type === 'deal' ? 'text-green-600 bg-green-100' :
                          activity.type === 'contact' ? 'text-blue-600 bg-blue-100' :
                          activity.type === 'company' ? 'text-purple-600 bg-purple-100' :
                          activity.type === 'activity' ? 'text-orange-600 bg-orange-100' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                          {activity.type === 'deal' ? <CurrencyDollarIcon className="h-4 w-4" /> :
                            activity.type === 'contact' ? <UserGroupIcon className="h-4 w-4" /> :
                            activity.type === 'company' ? <StarIcon className="h-4 w-4" /> :
                            <ClockIcon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            {activity.value && (
                              <span className="text-xs font-medium text-green-600">{activity.value}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No recent sales activities</p>
                    <p className="text-xs text-gray-400 mt-1">Activities will appear here as you work</p>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg flex items-center justify-end">
                <a href="/sales/crm" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Go to CRM
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        {dashboardSections.marketing && (
          <div>
            <div className="bg-white rounded-md flex flex-col h-[280px]">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg">
                <h2 className="text-base font-semibold text-gray-900">Upcoming Marketing Releases</h2>
                {/* Options (add, calendar, filter) */}
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-200" title="Add Event">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="View Calendar">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="Filter">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))
                ) : marketingEvents.length > 0 ? (
                  marketingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.event_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-48">{event.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' :
                        event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No upcoming events</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg flex items-center justify-end">
                <a href="/marketing/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Go to Events Calendar
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Team Holidays */}
        {dashboardSections.holidays && (
          <div>
            <div className="bg-white rounded-md flex flex-col h-[280px]">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg">
                <h2 className="text-base font-semibold text-gray-900">Team Holidays</h2>
                <div className="flex space-x-2">
                  <a href="/hr/holiday" className="p-1 rounded hover:bg-gray-200" title="View All">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading holidays...</p>
                  </div>
                ) : holidaysSnapshot && holidaysSnapshot.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {holidaysSnapshot.slice(0, 5).map((holiday, idx) => {
                      const employee = holiday.employee || {};
                      const employeeName = employee.name || 'Unknown';
                      const startDate = holiday.start_date ? new Date(holiday.start_date).toLocaleDateString() : '';
                      const endDate = holiday.end_date ? new Date(holiday.end_date).toLocaleDateString() : '';
                      return (
                        <div key={holiday.id} className="flex items-center justify-between py-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                              {employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{employeeName}</div>
                              <div className="text-xs text-gray-500">{startDate} - {endDate}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            holiday.status === 'approved' ? 'bg-green-100 text-green-800' :
                            holiday.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            holiday.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {holiday.status ? holiday.status.charAt(0).toUpperCase() + holiday.status.slice(1) : 'Unknown'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No time off requests found.</p>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg flex items-center justify-end">
                <a href="/hr/time-manager" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View all in Time Manager
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No dashboard components selected */}
      {Object.values(dashboardSections).every(v => !v) && (
        <div className="flex items-center justify-center min-h-[220px]">
          <div className="bg-white rounded-md shadow flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border border-gray-100">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2zm0 0v2a4 4 0 008 0v-2m0 0a4 4 0 01-8 0" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No Dashboard Components Selected</h2>
            <p className="text-gray-500 text-center">Select at least one component to display your dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 