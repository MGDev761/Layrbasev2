import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchHolidays, addHoliday, updateHoliday, deleteHoliday } from '../../../services/holidaysService';
import { fetchEmployees } from '../../../services/employeesService';
import Card from '../../../components/common/layout/Card';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const initialForm = {
  employee_id: '',
  start_date: '',
  end_date: '',
  days: 1,
  reason: '',
  status: 'pending'
};

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, requests: false, approvals: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ add: true, filter: false, status: false });
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
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Manage holiday requests, time off, and approval workflows for your team. Track all requests and approvals in one place.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('requests')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Requests</span>{openContent.requests ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.requests && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Submit new holiday or time off requests</li><li>View pending, approved, and rejected requests</li><li>Track request history for each employee</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('approvals')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Approvals</span>{openContent.approvals ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.approvals && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Managers can approve or reject requests</li><li>Automated notifications for status changes</li><li>Keep records for compliance and reporting</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('add')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Adding Requests</span>{openPlatform.add ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.add && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Click "Add Request" to submit a new holiday or time off. Fill in the required details and submit for approval.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('filter')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Filtering & Status</span>{openPlatform.filter ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.filter && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Filter requests by status (pending, approved, rejected) using the dropdown. Quickly find requests by employee or date.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('status')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Status Updates</span>{openPlatform.status ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.status && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Managers can update the status of requests. Employees are notified automatically of any changes.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your time management assistant. I can help you manage requests, approvals, and answer questions about using this platform.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I submit a holiday request?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the "Add Request" button, fill in the details, and submit. Your manager will review and approve or reject the request.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I filter requests by status?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Use the status dropdown to filter requests. You can view all, pending, approved, or rejected requests easily.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about time management..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

const TimeManager = () => {
  const { currentOrganization } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const loadData = () => {
    if (!currentOrganization) return;
    setLoading(true);
    Promise.all([
      fetchHolidays(currentOrganization.organization_id),
      fetchEmployees(currentOrganization.organization_id)
    ])
      .then(([holidays, employees]) => {
        setHolidays(holidays);
        setEmployees(employees);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadData(); /* eslint-disable-next-line */ }, [currentOrganization]);

  const openModal = (holiday = null) => {
    setEditingId(holiday ? holiday.id : null);
    setForm(holiday ? {
      employee_id: holiday.employee_id,
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      days: holiday.days,
      reason: holiday.reason,
      status: holiday.status
    } : initialForm);
    setModalOpen(true);
  };
  const openDeleteModal = (id) => { setDeleteId(id); setDeleteModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateHoliday(editingId, form);
      } else {
        await addHoliday(form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteHoliday(deleteId);
      setDeleteModalOpen(false);
      loadData();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredRequests = filterStatus === 'all' ? holidays : holidays.filter(request => request.status === filterStatus);

  if (!currentOrganization) return <div>Select an organization</div>;
  if (loading) return <div>Loading holiday requests...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Time Manager</h1>
          <p className="text-gray-600 text-sm mb-6">Manage holiday requests, time off, and approval workflows for your team.</p>
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
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button onClick={() => openModal()} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          Add Request
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dates
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manager
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
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No time off requests found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => {
                // Defensive: get employee name/email from joined employee object
                const employee = request.employee || {};
                const employeeName = employee.name || 'Unknown';
                const employeeEmail = employee.email || '';
                // Defensive: fallback for initials
                const initials = employeeName ? employeeName.split(' ').map(n => n[0]).join('') : '?';
                // Use correct field names from holidays table
                const startDate = request.start_date;
                const endDate = request.end_date;
                const submittedDate = request.created_at;
                const requestType = request.reason ? 'Holiday' : 'Time Off';
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {initials}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employeeName}</div>
                          <div className="text-sm text-gray-500">{employeeEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{requestType}</div>
                      <div className="text-sm text-gray-500">{request.days} days</div>
                      <div className="text-xs text-gray-400 max-w-xs truncate">{request.reason}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(startDate)}</div>
                      <div className="text-sm text-gray-500">to {formatDate(endDate)}</div>
                      <div className="text-xs text-gray-400">Submitted: {formatDate(submittedDate)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {request.manager || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => openModal(request)} className="text-purple-600 hover:text-purple-900">Edit</button>
                        <button onClick={() => openDeleteModal(request.id)} className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">{editingId ? 'Edit' : 'Add'} Holiday Request</div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded" value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: Number(e.target.value) }))} required>
                <option value="">Select Employee</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <input className="w-full px-3 py-2 border rounded" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" type="number" min="1" value={form.days} onChange={e => setForm(f => ({ ...f, days: Number(e.target.value) }))} required />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Reason" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
              <select className="w-full px-3 py-2 border rounded" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">Delete Holiday Request</div>
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p>Are you sure you want to delete this request?</p>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">{saving ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeManager; 