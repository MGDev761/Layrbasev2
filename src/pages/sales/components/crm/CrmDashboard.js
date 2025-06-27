import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCrmCompanies, getCrmDeals, getRecentActivities } from '../../../../services/salesService';
import { PlusIcon, UserGroupIcon, CurrencyDollarIcon, ChartBarIcon, ClockIcon, StarIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import CompaniesList from './CompaniesList';
import ContactsList from './ContactsList';
import DealsList from './DealsList';
import ActivitiesList from './ActivitiesList';
import NotesList from './NotesList';

const sections = [
  { id: 'customers', name: 'Customers', description: 'Manage all your customers and contacts', icon: UserGroupIcon, color: 'bg-blue-500' },
  { id: 'pipeline', name: 'Pipeline', description: 'Track deals and sales progress', icon: ChartBarIcon, color: 'bg-green-500' },
];

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, metrics: false, activities: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ navigation: true, data: false, permissions: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">CRM Dashboard Help & Tips</h2>
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
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Dashboard Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>The CRM Dashboard provides a comprehensive view of your sales performance and customer relationships. Key metrics include total customers, active deals, total pipeline value, and conversion rates.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('metrics')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Understanding Metrics</span>{openContent.metrics ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.metrics && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li><strong>Total Customers:</strong> Number of companies in your CRM database</li><li><strong>Active Deals:</strong> Deals currently in your sales pipeline</li><li><strong>Total Value:</strong> Combined value of all deals in your pipeline</li><li><strong>Conversion Rate:</strong> Percentage of deals that progress through your pipeline</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('activities')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Recent Activities</span>{openContent.activities ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.activities && (<div className="px-6 py-4 text-gray-700 text-sm"><p>The Recent Activities section shows the latest updates and interactions in your CRM. Activities include new deals, contact updates, company changes, and general CRM activities. Click "View all activities" to see a complete history.</p></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('navigation')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Navigation</span>{openPlatform.navigation ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.navigation && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use the Quick Actions cards to navigate to different sections:</p><ul className="list-disc pl-5 space-y-2"><li><strong>Customers:</strong> Manage your customer database and contacts</li><li><strong>Pipeline:</strong> Track deals and sales progress through stages</li></ul><p>You can also use the main navigation menu to access other CRM features.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('data')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Data Management</span>{openPlatform.data ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.data && (<div className="px-6 py-4 text-gray-700 text-sm"><p>All CRM data is automatically saved and synchronized across your organization. Changes to companies, contacts, and deals are reflected immediately in the dashboard. Use the search and filter options in each section to find specific information quickly.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('permissions')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Permissions & Access</span>{openPlatform.permissions ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.permissions && (<div className="px-6 py-4 text-gray-700 text-sm"><p>CRM access is controlled by your organization's user permissions. Team members can view and edit CRM data based on their assigned roles. Contact your administrator to modify user permissions or access levels.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your CRM assistant. I can help you improve your sales pipeline, organize contacts, and optimize your customer relationships.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How can I improve my sales pipeline conversion rate?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Focus on lead qualification, follow-up timing, and deal stage progression. Consider implementing automated reminders and tracking key metrics like time-in-stage.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What's the best way to organize my customer contacts?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Group contacts by company, use tags for different roles, and maintain consistent communication history. Regular data cleanup helps keep your CRM organized.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about CRM best practices..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

export default function CrmDashboard({ onSection }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [metrics, setMetrics] = useState({ customers: 0, deals: 0, value: 0, activeDeals: 0 });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">CRM Dashboard</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage your customer relationships, track deals, and monitor sales performance.
          </p>
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

      {/* Help Modal */}
      {showHelpModal && (
        <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      )}

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