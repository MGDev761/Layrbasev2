import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCrmCompanies, getCrmDeals, getRecentActivities } from '../../../../services/salesService';
import { PlusIcon, UserGroupIcon, CurrencyDollarIcon, ChartBarIcon, ClockIcon, StarIcon } from '@heroicons/react/20/solid';
import CompaniesList from './CompaniesList';
import ContactsList from './ContactsList';
import DealsList from './DealsList';
import ActivitiesList from './ActivitiesList';
import NotesList from './NotesList';

const sections = [
  { id: 'customers', name: 'Customers', description: 'Manage all your customers and contacts', icon: UserGroupIcon, color: 'bg-blue-500' },
  { id: 'pipeline', name: 'Pipeline', description: 'Track deals and sales progress', icon: ChartBarIcon, color: 'bg-green-500' },
];

export default function CrmDashboard({ onSection }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [metrics, setMetrics] = useState({ customers: 0, deals: 0, value: 0, activeDeals: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([
      getCrmCompanies(orgId),
      getCrmDeals(orgId),
      getRecentActivities(orgId)
    ]).then(([companiesRes, dealsRes, activitiesRes]) => {
      const customers = companiesRes.data?.length || 0;
      const deals = dealsRes.data?.length || 0;
      const value = (dealsRes.data || []).reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
      const activeDeals = (dealsRes.data || []).filter(d => d.stage !== 'closed').length;
      setMetrics({ customers, deals, value, activeDeals });
      
      // Use real recent activities
      setRecentActivities(activitiesRes || []);
    }).finally(() => setLoading(false));
  }, [orgId]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'deal': return <CurrencyDollarIcon className="h-4 w-4" />;
      case 'contact': return <UserGroupIcon className="h-4 w-4" />;
      case 'company': return <StarIcon className="h-4 w-4" />;
      case 'activity': return <ClockIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'deal': return 'text-green-600 bg-green-100';
      case 'contact': return 'text-blue-600 bg-blue-100';
      case 'company': return 'text-purple-600 bg-purple-100';
      case 'activity': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900">CRM Dashboard</h3>
        <p className="mt-1 text-sm text-gray-600">
          Manage your customer relationships, track deals, and monitor sales performance.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 mb-1">Total Customers</div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics.customers}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 mb-1">Active Deals</div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics.activeDeals}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '...' : `£${metrics.value.toLocaleString()}`}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500 mb-1">Conversion Rate</div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : metrics.deals > 0 ? `${Math.round((metrics.activeDeals / metrics.deals) * 100)}%` : '0%'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map(section => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => onSection && onSection(section.id)}
                    className="block bg-gray-50 rounded-lg hover:bg-gray-100 transition p-6 border border-gray-200 hover:border-gray-300 text-left w-full group"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg ${section.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
                        <IconComponent className={`h-6 w-6 ${section.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="ml-3">
                        <div className="text-lg font-medium text-gray-900">{section.name}</div>
                        <div className="text-sm text-gray-500">{section.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800">
                      <span>Get started</span>
                      <PlusIcon className="h-4 w-4 ml-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h4>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getActivityColor(activity.type)}`}>
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
                ))
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No recent activities</p>
                  <p className="text-xs text-gray-400 mt-1">Activities will appear here as you work</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                View all activities →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 