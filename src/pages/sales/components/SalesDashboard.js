import React from 'react';
import { ArrowTrendingUpIcon, UsersIcon, CurrencyDollarIcon, ClockIcon, PlusIcon } from '@heroicons/react/20/solid';

const SalesDashboard = () => {
  const metrics = [
    { name: 'Total Revenue', value: '£125,000', change: '+12%', changeType: 'positive', icon: CurrencyDollarIcon },
    { name: 'Active Deals', value: '24', change: '+3', changeType: 'positive', icon: ArrowTrendingUpIcon },
    { name: 'Customers', value: '156', change: '+8', changeType: 'positive', icon: UsersIcon },
    { name: 'Avg. Deal Cycle', value: '45 days', change: '-5 days', changeType: 'positive', icon: ClockIcon },
  ];

  const recentActivities = [
    { type: 'deal', message: 'New deal created: TechCorp Ltd - £25,000', time: '2 hours ago', status: 'new' },
    { type: 'customer', message: 'Customer updated: Acme Solutions', time: '4 hours ago', status: 'updated' },
    { type: 'deal', message: 'Deal closed: StartupXYZ - £15,000', time: '1 day ago', status: 'closed' },
    { type: 'customer', message: 'New customer added: InnovateTech', time: '2 days ago', status: 'new' },
    { type: 'deal', message: 'Deal moved to negotiation: GrowthCo', time: '3 days ago', status: 'updated' },
  ];

  const quickActions = [
    { name: 'Add New Customer', icon: PlusIcon, action: 'customer' },
    { name: 'Create New Deal', icon: PlusIcon, action: 'deal' },
    { name: 'Schedule Meeting', icon: ClockIcon, action: 'meeting' },
    { name: 'Generate Report', icon: ArrowTrendingUpIcon, action: 'report' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'text-green-600 bg-green-100';
      case 'updated':
        return 'text-blue-600 bg-blue-100';
      case 'closed':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <metric.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <action.icon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'new' ? 'bg-green-400' : 
                      activity.status === 'closed' ? 'bg-purple-400' : 'bg-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stage: 'Lead', count: 12, value: '£45,000', color: 'bg-gray-200' },
            { stage: 'Qualified', count: 8, value: '£85,000', color: 'bg-blue-200' },
            { stage: 'Proposal', count: 5, value: '£120,000', color: 'bg-yellow-200' },
            { stage: 'Negotiation', count: 3, value: '£75,000', color: 'bg-orange-200' },
            { stage: 'Closed', count: 2, value: '£35,000', color: 'bg-green-200' },
          ].map((stage) => (
            <div key={stage.stage} className="text-center">
              <div className={`w-full h-2 rounded-full ${stage.color} mb-2`} />
              <p className="text-sm font-medium text-gray-900">{stage.stage}</p>
              <p className="text-lg font-semibold text-gray-900">{stage.count}</p>
              <p className="text-xs text-gray-500">{stage.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard; 