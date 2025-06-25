import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getRecentActivities } from '../../../services/salesService';
import { CurrencyDollarIcon, UserGroupIcon, StarIcon, ClockIcon } from '@heroicons/react/20/solid';
import Card from '../../../components/common/layout/Card';

export default function SalesActivities() {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SalesActivities: useEffect triggered, orgId:', orgId);
    if (!orgId) return;
    setLoading(true);
    getRecentActivities(orgId, 5).then((activities) => {
      console.log('SalesActivities: Got activities:', activities);
      setRecentActivities(activities || []);
      setLoading(false);
    }).catch(error => {
      console.error('SalesActivities: Error loading activities:', error);
      setLoading(false);
    });
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
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sales Activities</h2>
      <Card className="overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading activities...</p>
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
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
        <div className="px-6 py-4 border-t border-gray-100">
          <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            View all sales activities →
          </button>
        </div>
      </Card>
    </div>
  );
} 