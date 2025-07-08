import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCrmCompanies, getCrmDeals, getRecentActivities } from '../../../../services/salesService';
import { 
  PlusIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  ClockIcon, 
  StarIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const MetricCard = ({ title, value, subValue, icon: Icon, color, trend, onClick }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-indigo-600",
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
          <div className="flex items-baseline space-x-2">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {subValue && (
              <p className="text-xs text-gray-400">{subValue}</p>
            )}
          </div>
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${
              trend.type === 'positive' ? 'text-green-600' : 
              trend.type === 'negative' ? 'text-red-600' : 'text-gray-500'
            }`}>
              <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
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

const QuickActionCard = ({ title, description, icon: Icon, color, onClick, count }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200"
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:border-gray-300"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{title}</h3>
            {count && (
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{count}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
      </div>
    </button>
  );
};

const PipelineStage = ({ stage, deals, value, isActive }) => (
  <div className={`flex-1 p-3 rounded-lg border-2 transition-all ${
    isActive ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
  }`}>
    <div className="text-center">
      <p className="text-xs font-medium text-gray-600 mb-1">{stage}</p>
      <p className="text-lg font-bold text-gray-900">{deals}</p>
      <p className="text-xs text-gray-500">£{value.toLocaleString()}</p>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'deal': return <CurrencyDollarIcon className="w-4 h-4" />;
      case 'contact': return <UserGroupIcon className="w-4 h-4" />;
      case 'company': return <BuildingOfficeIcon className="w-4 h-4" />;
      case 'call': return <PhoneIcon className="w-4 h-4" />;
      case 'email': return <EnvelopeIcon className="w-4 h-4" />;
      case 'meeting': return <CalendarDaysIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'deal': return 'text-green-600 bg-green-100';
      case 'contact': return 'text-blue-600 bg-blue-100';
      case 'company': return 'text-purple-600 bg-purple-100';
      case 'call': return 'text-orange-600 bg-orange-100';
      case 'email': return 'text-cyan-600 bg-cyan-100';
      case 'meeting': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />;
      case 'medium': return <ClockIcon className="w-3 h-3 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`flex-shrink-0 p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-900 font-medium">{activity.message || activity.title}</p>
            <div className="flex items-center mt-1 space-x-2">
              <p className="text-xs text-gray-500">{activity.time}</p>
              {activity.priority && getPriorityIcon(activity.priority)}
            </div>
          </div>
          {activity.value && (
            <span className="text-xs font-medium text-green-600 ml-2">{activity.value}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentDeals = ({ deals }) => (
  <div className="space-y-2">
    {deals.slice(0, 4).map((deal, idx) => (
      <div key={deal.id || idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{deal.name || deal.title}</p>
          <p className="text-xs text-gray-500">{deal.company_name || 'Company'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">£{(deal.value || 0).toLocaleString()}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            deal.stage === 'closed-won' ? 'bg-green-100 text-green-800' :
            deal.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-800' :
            deal.stage === 'proposal' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {deal.stage || 'prospect'}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default function CrmDashboard({ onSection }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [metrics, setMetrics] = useState({ 
    customers: 0, 
    deals: 0, 
    value: 0, 
    activeDeals: 0,
    contacts: 0,
    closedDeals: 0,
    avgDealSize: 0,
    winRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([
      getCrmCompanies(orgId),
      getCrmDeals(orgId),
      getRecentActivities(orgId)
    ]).then(([companiesRes, dealsRes, activitiesRes]) => {
      const companiesData = companiesRes.data || [];
      const dealsData = dealsRes.data || [];
      
      const customers = companiesData.length;
      const totalDeals = dealsData.length;
      const activeDeals = dealsData.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').length;
      const closedWonDeals = dealsData.filter(d => d.stage === 'closed-won').length;
      const totalValue = dealsData.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
      const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
      const winRate = totalDeals > 0 ? (closedWonDeals / totalDeals) * 100 : 0;
      
      setMetrics({ 
        customers, 
        deals: totalDeals, 
        value: totalValue, 
        activeDeals,
        contacts: companiesData.reduce((sum, c) => sum + (c.contact_count || 0), 0),
        closedDeals: closedWonDeals,
        avgDealSize,
        winRate
      });
      
      setDeals(dealsData);
      setCompanies(companiesData);
      setRecentActivities(activitiesRes || []);
    }).finally(() => setLoading(false));
  }, [orgId]);

  const pipelineData = [
    { stage: 'Prospect', deals: deals.filter(d => d.stage === 'prospect').length, value: deals.filter(d => d.stage === 'prospect').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) },
    { stage: 'Qualified', deals: deals.filter(d => d.stage === 'qualified').length, value: deals.filter(d => d.stage === 'qualified').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) },
    { stage: 'Proposal', deals: deals.filter(d => d.stage === 'proposal').length, value: deals.filter(d => d.stage === 'proposal').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) },
    { stage: 'Negotiation', deals: deals.filter(d => d.stage === 'negotiation').length, value: deals.filter(d => d.stage === 'negotiation').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) },
    { stage: 'Closed', deals: deals.filter(d => d.stage === 'closed-won').length, value: deals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0) }
  ];

  const quickActions = [
    {
      title: 'Add Company',
      description: 'Create new customer record',
      icon: BuildingOfficeIcon,
      color: 'blue',
      count: metrics.customers,
      onClick: () => onSection && onSection('customers')
    },
    {
      title: 'Add Contact',
      description: 'Add new contact person',
      icon: UserGroupIcon,
      color: 'green',
      count: metrics.contacts,
      onClick: () => onSection && onSection('contacts')
    },
    {
      title: 'Create Deal',
      description: 'Start new sales opportunity',
      icon: CurrencyDollarIcon,
      color: 'purple',
      count: metrics.activeDeals,
      onClick: () => onSection && onSection('pipeline')
    },
    {
      title: 'Schedule Activity',
      description: 'Plan follow-up actions',
      icon: CalendarDaysIcon,
      color: 'orange',
      onClick: () => onSection && onSection('activities')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sales CRM</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Manage customer relationships and track sales performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Reports
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Deal
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Pipeline"
          value={loading ? '...' : `£${metrics.value.toLocaleString()}`}
          subValue={`${metrics.deals} deals`}
          icon={CurrencyDollarIcon}
          color="green"
          trend={{ type: 'positive', value: '+12% this month' }}
        />
        <MetricCard
          title="Active Deals"
          value={loading ? '...' : metrics.activeDeals.toString()}
          subValue={`£${Math.round(metrics.avgDealSize).toLocaleString()} avg`}
          icon={FunnelIcon}
          color="blue"
        />
        <MetricCard
          title="Win Rate"
          value={loading ? '...' : `${Math.round(metrics.winRate)}%`}
          subValue={`${metrics.closedDeals} won`}
          icon={CheckCircleIcon}
          color="purple"
          trend={{ type: 'positive', value: '+5% vs last month' }}
        />
        <MetricCard
          title="Customers"
          value={loading ? '...' : metrics.customers.toString()}
          subValue={`${metrics.contacts} contacts`}
          icon={UserGroupIcon}
          color="orange"
        />
      </div>

      {/* Pipeline Overview */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Sales Pipeline</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
              View Pipeline
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="flex space-x-2">
            {pipelineData.map((stage, idx) => (
              <PipelineStage
                key={stage.stage}
                stage={stage.stage}
                deals={stage.deals}
                value={stage.value}
                isActive={stage.deals > 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Recent Activities</h2>
              <a 
                href="/sales/crm/activities" 
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                View all
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
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
              ) : recentActivities.length > 0 ? (
                <div className="space-y-1">
                  {recentActivities.slice(0, 6).map((activity, idx) => (
                    <ActivityItem key={activity.id || idx} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ClockIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No recent activities</p>
                  <p className="text-xs text-gray-400 mt-1">Activities will appear here as you work</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Recent Deals</h2>
              <a 
                href="/sales/crm/deals" 
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                View all
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                          <div className="h-2 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-2 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : deals.length > 0 ? (
                <RecentDeals deals={deals} />
              ) : (
                <div className="text-center py-6">
                  <CurrencyDollarIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No deals yet</p>
                  <button className="text-xs text-purple-600 hover:text-purple-700 mt-1">
                    Create your first deal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Moved to Bottom */}
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
}