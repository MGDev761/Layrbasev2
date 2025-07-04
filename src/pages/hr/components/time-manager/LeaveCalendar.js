import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '../../../../services/leaveService';
import { supabase } from '../../../../lib/supabase';

const TYPE_COLORS = {
  holiday: 'bg-green-200 text-green-900',
  sick: 'bg-yellow-200 text-yellow-900',
  unpaid: 'bg-gray-200 text-gray-900',
  parental: 'bg-blue-200 text-blue-900',
  custom: 'bg-purple-200 text-purple-900'
};

function getDaysArray(start, end) {
  const arr = [];
  let dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const LeaveCalendar = ({ orgId, currentUser, currentEmployeeId, onRequestTimeOff }) => {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  // Calendar range: selected month
  const startOfMonth = new Date(month.year, month.month, 1);
  const endOfMonth = new Date(month.year, month.month + 1, 0);
  const days = getDaysArray(startOfMonth, endOfMonth);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([
      fetchLeaveRequests(orgId),
      supabase.from('employees').select('id, name, user_id, manager_id').eq('organization_id', orgId)
    ])
      .then(([reqs, { data: emps }]) => {
        setRequests(reqs.filter(r => r.status !== 'declined'));
        setEmployees(emps || []);
      })
      .catch(err => setError(err.message || JSON.stringify(err)))
      .finally(() => setLoading(false));
  }, [orgId]);

  // Helper: get leave for employee
  const getLeaveForDay = (empId, day) => {
    return requests.find(r => {
      if (r.employee_id !== empId) return false;
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      return day >= start && day <= end;
    });
  };

  // Split employees into Me, My Team, Colleagues
  const me = employees.find(e => e.user_id === currentUser?.id);
  const myTeam = employees.filter(e => e.manager_id === me?.id);
  const colleagues = employees.filter(
    e => e.user_id !== currentUser?.id && e.manager_id !== me?.id
  );

  // Month navigation
  const handlePrevMonth = () => {
    setMonth(m => {
      if (m.month === 0) return { year: m.year - 1, month: 11 };
      return { year: m.year, month: m.month - 1 };
    });
  };
  const handleNextMonth = () => {
    setMonth(m => {
      if (m.month === 11) return { year: m.year + 1, month: 0 };
      return { year: m.year, month: m.month + 1 };
    });
  };

  const renderRows = group => group.map(emp => (
    <tr key={emp.id}>
      <td className="sticky left-0 bg-white z-10 font-medium text-gray-700 px-2 py-2 whitespace-nowrap border-r border-gray-100">{emp.name}</td>
      {days.map(day => {
        const leave = getLeaveForDay(emp.id, day);
        return (
          <td key={day.toISOString()} className="px-1 py-1 text-center align-middle">
            {leave ? (
              <span className={`block w-6 h-6 mx-auto rounded ${TYPE_COLORS[leave.type]}`} title={`${leave.type}: ${leave.start_date} to ${leave.end_date}`}></span>
            ) : null}
          </td>
        );
      })}
    </tr>
  ));

  return (
    <div className="bg-white rounded-md shadow p-6 w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Upcoming Time Off (Calendar)</h3>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600">&#8592;</button>
          <span className="font-medium text-gray-700 text-base">{monthNames[month.month]} {month.year}</span>
          <button onClick={handleNextMonth} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600">&#8594;</button>
          <button 
            onClick={onRequestTimeOff} 
            className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-base ml-4"
          >
            Request Time Off
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {loading ? (
        <div className="flex-1 flex items-center justify-center h-40">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-base">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 font-medium text-gray-500 px-2 py-2 text-left">Employee</th>
                {days.map(day => (
                  <th key={day.toISOString()} className="font-normal text-gray-400 px-1 py-1 whitespace-nowrap">{day.getDate()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {me && <tr><td colSpan={days.length + 1} className="bg-gray-50 text-xs font-semibold text-gray-500 px-2 py-1">Me</td></tr>}
              {me && renderRows([me])}
              {myTeam.length > 0 && <tr><td colSpan={days.length + 1} className="bg-gray-50 text-xs font-semibold text-gray-500 px-2 py-1">My Team</td></tr>}
              {renderRows(myTeam)}
              {colleagues.length > 0 && <tr><td colSpan={days.length + 1} className="bg-gray-50 text-xs font-semibold text-gray-500 px-2 py-1">Colleagues</td></tr>}
              {renderRows(colleagues)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar; 