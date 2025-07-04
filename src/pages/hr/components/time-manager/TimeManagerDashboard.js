import React, { useState, useEffect } from 'react';
import LeaveBalances from './LeaveBalances';
import LeaveCalendar from './LeaveCalendar';
import LeaveRequestsTable from './LeaveRequestsTable';
import LeaveRequestModal from './LeaveRequestModal';
import { supabase } from '../../../../lib/supabase';
import { ChatBubbleLeftRightIcon, InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
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
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><BookOpenIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><Cog6ToothIcon className="w-5 h-5" /> Platform How-To</button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Manage your time off requests, view leave balances, and track team schedules in one place. Request time off, approve team requests, and monitor upcoming holidays.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('timeoff')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Time Off Requests</span>{openContent.timeoff ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.timeoff && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Submit time off requests with start and end dates</li><li>Choose from different leave types (holiday, sick, unpaid, etc.)</li><li>Track request status and approval workflow</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('calendar')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Calendar View</span>{openContent.calendar ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.calendar && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>View upcoming time off across your team</li><li>Navigate between months to see future schedules</li><li>Identify potential conflicts and coverage gaps</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('request')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Requesting Time Off</span>{openPlatform.request ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.request && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Click "Request Time Off" to submit a new request. Select your dates, choose the leave type, and add any notes. Your manager will be notified for approval.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('approve')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Approving Requests</span>{openPlatform.approve ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.approve && (<div className="px-6 py-4 text-gray-700 text-sm"><p>As a manager, you can approve or decline team requests. Review the details and consider team coverage before making decisions.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('balance')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Leave Balances</span>{openPlatform.balance ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.balance && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Track your remaining leave days for different types. Balances update automatically when requests are approved.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your HR assistant. I can help you manage time off requests, understand leave policies, and answer questions about the Time Manager.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I request time off?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the "Request Time Off" button, select your dates, choose the leave type, and submit. Your manager will review and approve.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What if my request is declined?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">You'll receive a notification with the reason. You can submit a new request with different dates or discuss with your manager.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about time management..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
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

  useEffect(() => {
    if (!currentUser?.id || !currentOrganization?.organization_id) return;
    console.log('Looking for employee:', currentUser.id, currentOrganization.organization_id);
    setLoading(true);
    supabase
      .from('employees')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('organization_id', currentOrganization.organization_id)
      .maybeSingle()
      .then(({ data, error }) => {
        console.log('Employee lookup result:', data, error);
        if (error) setError(error.message || JSON.stringify(error));
        else setEmployeeId(data?.id || null);
      })
      .finally(() => setLoading(false));
  }, [currentUser, currentOrganization]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!employeeId) return (
    <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-md p-6 max-w-lg mx-auto mt-12 flex flex-col items-center">
      <div className="text-lg font-semibold mb-2">Account not linked as an employee</div>
      <div className="mb-4 text-blue-800 text-sm text-center">You need to create an employee record for this organization to use the Time Manager.</div>
      <a href="/hr/employees" className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Go to Employee Section</a>
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Manager</h1>
          <p className="text-gray-600 mt-1">Request time off, view your leave balances, and manage your schedule.</p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-purple-500" />
          HR AI Agent
        </button>
      </div>

      {/* Top Section: Balances + Leave Requests */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 items-stretch">
        <div className="lg:w-1/3 w-full h-full">
          <LeaveBalances orgId={currentOrganization.organization_id} userId={employeeId} />
        </div>
        <div className="lg:w-2/3 w-full h-full">
          <LeaveRequestsTable 
            orgId={currentOrganization.organization_id} 
            userId={employeeId} 
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Full-width Upcoming Time Off Calendar */}
      <div className="mb-6 w-full">
        <LeaveCalendar 
          orgId={currentOrganization.organization_id} 
          currentUser={currentUser}
          currentEmployeeId={employeeId}
          onRequestTimeOff={() => setShowRequestModal(true)}
        />
      </div>

      <LeaveRequestModal open={showRequestModal} onClose={() => setShowRequestModal(false)} orgId={currentOrganization.organization_id} userId={employeeId} />
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default TimeManagerDashboard; 