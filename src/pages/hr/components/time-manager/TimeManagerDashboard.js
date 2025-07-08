import React, { useState, useEffect } from 'react';
import LeaveBalances from './LeaveBalances';
import LeaveCalendar from './LeaveCalendar';
import LeaveRequestsTable from './LeaveRequestsTable';
import LeaveRequestModal from './LeaveRequestModal';
import { supabase } from '../../../../lib/supabase';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  DocumentCheckIcon, 
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('ai');
  const [openContent, setOpenContent] = useState({ intro: true, timeoff: false, calendar: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ request: true, approve: false, balance: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Time Manager Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><DocumentCheckIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChartBarIcon className="w-5 h-5" /> Platform How-To</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (
            <div className="space-y-4 text-sm text-gray-700">
              <p>Manage your time off requests, view leave balances, and track team schedules in one place.</p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Quick Tips:</h4>
                <ul className="space-y-1 text-purple-800">
                  <li>• Submit requests well in advance</li>
                  <li>• Check team calendar for conflicts</li>
                  <li>• Monitor your leave balances</li>
                </ul>
              </div>
            </div>
          )}
          {tab === 'platform' && (
            <div className="space-y-4 text-sm text-gray-700">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Requesting Time Off</h4>
                <p className="text-blue-800">Click "Request Time Off" to submit a new request. Select your dates, choose the leave type, and add any notes.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Approving Requests</h4>
                <p className="text-green-800">As a manager, review team requests and consider coverage before making decisions.</p>
              </div>
            </div>
          )}
          {tab === 'ai' && (
            <div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}>
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">
                    Hi! I'm your HR assistant. I can help you manage time off requests and answer questions.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">
                    How do I request time off?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">
                    Click the "Request Time Off" button, select your dates, choose the leave type, and submit for approval.
                  </div>
                </div>
              </div>
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about time management..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TimeManagerDashboard = ({ currentUser, currentOrganization }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!currentUser?.id || !currentOrganization?.organization_id) return;
    setLoading(true);
    supabase
      .from('employees')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('organization_id', currentOrganization.organization_id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message || JSON.stringify(error));
        else setEmployeeId(data?.id || null);
      })
      .finally(() => setLoading(false));
  }, [currentUser, currentOrganization]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  if (!employeeId) return (
    <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-8 max-w-lg mx-auto mt-12 text-center">
      <div className="text-xl font-semibold mb-3">Account Setup Required</div>
      <div className="mb-6 text-blue-800">You need to create an employee record for this organization to use the Time Manager.</div>
      <a href="/hr/employees" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Go to Employee Section
      </a>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'calendar', label: 'Team Calendar', icon: CalendarDaysIcon },
    { id: 'requests', label: 'All Requests', icon: DocumentCheckIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Primary Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Manager</h1>
          <p className="text-gray-600 mt-1">Manage your time off and view team schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
            Help
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Request Time Off
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LeaveBalances orgId={currentOrganization.organization_id} userId={employeeId} />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Pending Requests - Top Priority */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-orange-500" />
                  Pending Requests
                </h3>
              </div>
              <LeaveRequestsTable 
                orgId={currentOrganization.organization_id} 
                userId={employeeId} 
                currentUser={currentUser}
                compact={true}
              />
            </div>

            {/* Quick Calendar Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-500" />
                  This Month's Time Off
                </h3>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Full Calendar →
                </button>
              </div>
              <LeaveCalendar 
                orgId={currentOrganization.organization_id} 
                currentUser={currentUser}
                currentEmployeeId={employeeId}
                onRequestTimeOff={() => setShowRequestModal(true)}
                compact={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <LeaveCalendar 
              orgId={currentOrganization.organization_id} 
              currentUser={currentUser}
              currentEmployeeId={employeeId}
              onRequestTimeOff={() => setShowRequestModal(true)}
            />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <LeaveRequestsTable 
              orgId={currentOrganization.organization_id} 
              userId={employeeId} 
              currentUser={currentUser}
            />
          </div>
        )}
      </div>

      <LeaveRequestModal 
        open={showRequestModal} 
        onClose={() => setShowRequestModal(false)} 
        orgId={currentOrganization.organization_id} 
        userId={employeeId} 
      />
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default TimeManagerDashboard; 