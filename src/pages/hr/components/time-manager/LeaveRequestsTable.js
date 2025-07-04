import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests, approveLeaveRequest, declineLeaveRequest } from '../../../../services/leaveService';
import { supabase } from '../../../../lib/supabase';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const LEAVE_TYPE_LABELS = {
  holiday: 'Paid Holiday',
  sick: 'Sick Leave',
  unpaid: 'Unpaid Leave',
  parental: 'Parental Leave',
  custom: 'Other'
};

const LeaveRequestsTable = ({ orgId, userId, currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    
    // Fetch leave requests
    fetchLeaveRequests(orgId)
      .then(setRequests)
      .catch(err => setError(err.message || JSON.stringify(err)));
    
    // Fetch employees for names and manager_id
    supabase
      .from('employees')
      .select('id, name, manager_id')
      .eq('organization_id', orgId)
      .then(({ data, error }) => {
        if (!error) setEmployees(data || []);
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : `Employee ${employeeId}`;
  };

  const handleApprove = async (requestId) => {
    setProcessing(requestId);
    try {
      await approveLeaveRequest(requestId, currentUser.id);
      // Refresh the requests list
      const updatedRequests = await fetchLeaveRequests(orgId);
      setRequests(updatedRequests);
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (requestId) => {
    setProcessing(requestId);
    try {
      await declineLeaveRequest(requestId, currentUser.id);
      // Refresh the requests list
      const updatedRequests = await fetchLeaveRequests(orgId);
      setRequests(updatedRequests);
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setProcessing(null);
    }
  };

  // Check if current user is a manager (has direct reports)
  const isManager = employees.some(emp => emp.manager_id === userId);

  return (
    <div className="bg-white rounded-md shadow p-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-900">Leave Requests</h3>
        <div className="flex items-center gap-2">
          {isManager && (
            <span className="text-base text-gray-500">Manager View</span>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading leave requests...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isManager && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.filter(r => r.status === 'pending').length === 0 ? (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="text-center py-8">
                    <div className="text-gray-400">No pending leave requests</div>
                  </td>
                </tr>
              ) : (
                requests.filter(r => r.status === 'pending').map(request => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getEmployeeName(request.employee_id)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {LEAVE_TYPE_LABELS[request.type] || request.type}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.days} {request.half_day ? '(Half day)' : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[request.status] || 'bg-gray-100 text-gray-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    {isManager && (
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        {request.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={processing === request.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {processing === request.id ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleDecline(request.id)}
                              disabled={processing === request.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {processing === request.id ? 'Declining...' : 'Decline'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsTable; 