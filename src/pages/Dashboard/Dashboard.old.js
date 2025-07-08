import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCompanyProfile } from '../../services/legalService';
import { getUpcomingMarketingEvents } from '../../services/marketingService';
import { getRecentActivities, getCrmDeals } from '../../services/salesService';
import { fetchHolidays } from '../../services/holidaysService';
import { fetchEmployees } from '../../services/employeesService';
import { useBudget } from '../../hooks/useBudget';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  BellIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  PlayIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  InformationCircleIcon as InformationCircleIconSolid
} from '@heroicons/react/24/solid';
import { useNotifications } from '../../contexts/NotificationContext';
import { fetchMyTasks } from '../../services/taskService';

const StatCard = ({ title, value, subValue, icon: Icon, trend, color = "purple", onClick, showVs = true }) => {
  const colorClasses = {
    purple: "from-purple-500 to-indigo-600",
    green: "from-green-500 to-emerald-600", 
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-red-500",
    gray: "from-gray-500 to-slate-600"
  };

  return (
    <div 
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-gray-300' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {subValue && (
            <p className="text-xs text-gray-400 mt-1">
              {showVs ? `vs ${subValue} budget` : subValue}
            </p>
          )}
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${
              trend.type === 'positive' ? 'text-green-600' : 
              trend.type === 'negative' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend.type === 'positive' && <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />}
              {trend.type === 'negative' && <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, color = "purple", onClick }) => {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:border-gray-300"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>
    </button>
  );
};

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'deal': return <CurrencyDollarIcon className="w-4 h-4" />;
      case 'contact': return <UserGroupIcon className="w-4 h-4" />;
      case 'company': return <BuildingOfficeIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
  switch (type) {
      case 'deal': return 'text-green-600 bg-green-100';
      case 'contact': return 'text-blue-600 bg-blue-100';
      case 'company': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`flex-shrink-0 p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
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
  );
};

const TaskItem = ({ task }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Awaiting Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
        <div className="flex items-center justify-between mt-1">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          {task.due_date && (
            <span className="text-xs text-gray-500">Due: {task.due_date}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const EventItem = ({ event }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(event.event_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </div>
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </span>
    </div>
  );
};

const HolidayItem = ({ holiday }) => {
  const employee = holiday.employee || {};
  const employeeName = employee.name || 'Unknown';
  const startDate = holiday.start_date ? new Date(holiday.start_date).toLocaleDateString() : '';
  const endDate = holiday.end_date ? new Date(holiday.end_date).toLocaleDateString() : '';

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {employeeName.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{employeeName}</div>
          <div className="text-xs text-gray-500">{startDate} - {endDate}</div>
        </div>
      </div>
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(holiday.status)}`}>
        {holiday.status ? holiday.status.charAt(0).toUpperCase() + holiday.status.slice(1) : 'Unknown'}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { currentOrganization, user } = useAuth();
  const { notifications } = useNotifications();
  const { totals: budgetTotals, loading: budgetLoading } = useBudget({ isForecast: false });
  const { totals: forecastTotals, loading: forecastLoading } = useBudget({ isForecast: true });
  const monthIndex = new Date().getMonth();
  
  const [companyProfile, setCompanyProfile] = useState(null);
  const [marketingEvents, setMarketingEvents] = useState([]);
  const [salesActivities, setSalesActivities] = useState([]);
  const [holidaysSnapshot, setHolidaysSnapshot] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentOrganization?.organization_id) return;
      
      try {
        setLoading(true);
        const [profileData, eventsData, salesActs, holidaysData, tasksData, dealsData, employeesData] = await Promise.all([
          getCompanyProfile(currentOrganization.organization_id),
          getUpcomingMarketingEvents(currentOrganization.organization_id, 5),
          getRecentActivities(currentOrganization.organization_id, 5),
          fetchHolidays(currentOrganization.organization_id, 5),
          user?.id ? fetchMyTasks(currentOrganization.organization_id, user.id, 5) : Promise.resolve([]),
          getCrmDeals(currentOrganization.organization_id),
          fetchEmployees(currentOrganization.organization_id)
        ]);
        
        setCompanyProfile(profileData);
        setMarketingEvents(eventsData);
        setSalesActivities(salesActs || []);
        setHolidaysSnapshot(holidaysData);
        setTasks(tasksData || []);
        setDeals(dealsData?.data || []);
        setEmployees(employeesData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentOrganization, user]);

  const financialMetrics = [
    {
      title: 'Revenue',
      value: forecastTotals?.revenue?.[monthIndex] ? `£${Math.round(forecastTotals.revenue[monthIndex]).toLocaleString()}` : 'Set up budget',
      subValue: budgetTotals?.revenue?.[monthIndex] ? `£${Math.round(budgetTotals.revenue[monthIndex]).toLocaleString()}` : null,
      icon: BanknotesIcon,
      color: 'green',
      onClick: () => window.location.href = '/finance',
      showVs: true
    },
    {
      title: 'Monthly Costs',
      value: forecastTotals?.expense?.[monthIndex] ? `£${Math.round(forecastTotals.expense[monthIndex]).toLocaleString()}` : 'Set up budget', 
      subValue: budgetTotals?.expense?.[monthIndex] ? `£${Math.round(budgetTotals.expense[monthIndex]).toLocaleString()}` : null,
      icon: ChartBarIcon,
      color: 'orange',
      onClick: () => window.location.href = '/finance',
      showVs: true
    },
    {
      title: 'Active Deals',
      value: deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost' && d.stage !== 'closed').length.toString(),
      subValue: `£${Math.round(deals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0)).toLocaleString()} total value`,
      icon: ArrowTrendingUpIcon,
      color: 'blue',
      onClick: () => window.location.href = '/sales/crm',
      showVs: false
    },
    {
      title: 'Team Members',
      value: employees.length.toString(),
      subValue: `${employees.filter(e => e.user_id).length} linked users`,
      icon: UserGroupIcon,
      color: 'purple',
      onClick: () => window.location.href = '/hr',
      showVs: false
    }
  ];

  const quickActions = [
    {
      title: 'Create Invoice',
      description: 'Generate a new invoice for clients',
      icon: BanknotesIcon,
      color: 'green',
      onClick: () => window.location.href = '/finance/invoices'
    },
    {
      title: 'Add New Contact',
      description: 'Add a contact to your CRM',
      icon: UserGroupIcon,
      color: 'blue',
      onClick: () => window.location.href = '/sales/crm'
    },
    {
      title: 'Schedule Event',
      description: 'Plan marketing campaigns',
      icon: CalendarDaysIcon,
      color: 'purple',
      onClick: () => window.location.href = '/marketing/events'
    },
    {
      title: 'Create Contract',
      description: 'Generate legal documents',
      icon: BuildingOfficeIcon,
      color: 'orange',
      onClick: () => window.location.href = '/legal/contracts'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Here's what's happening with {companyProfile?.name || 'your business'} today.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialMetrics.map((metric, index) => (
          <StatCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Recent Activities</h2>
            <a 
              href="/sales/crm" 
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              View all
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
            </div>
          <div className="p-4">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : salesActivities.length > 0 ? (
              <div className="space-y-1">
                {salesActivities.slice(0, 5).map((activity, idx) => (
                  <ActivityItem key={activity.id || idx} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <ClockIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No recent activities</p>
            </div>
            )}
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">My Tasks</h2>
            <a 
              href="/tasks" 
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              View all
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
                </div>
          <div className="p-4">
                {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="flex justify-between">
                      <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-1">
                {tasks.slice(0, 5).map((task, idx) => (
                  <TaskItem key={task.id || idx} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircleIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No tasks assigned</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Upcoming Events</h2>
            <a 
              href="/marketing/events" 
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              View calendar
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
                </div>
          <div className="p-4">
                {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                        <div className="h-2 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : marketingEvents.length > 0 ? (
              <div className="space-y-1">
                {marketingEvents.slice(0, 5).map((event, idx) => (
                  <EventItem key={event.id || idx} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CalendarDaysIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No upcoming events</p>
            </div>
            )}
          </div>
        </div>

        {/* Team Time Off */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Team Time Off</h2>
            <a 
              href="/hr/time-manager" 
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
            >
              View all
              <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </a>
                </div>
          <div className="p-4">
                {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                          <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                            </div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : holidaysSnapshot.length > 0 ? (
              <div className="space-y-1">
                {holidaysSnapshot.slice(0, 5).map((holiday, idx) => (
                  <HolidayItem key={holiday.id || idx} holiday={holiday} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <UserGroupIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No time off requests</p>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 