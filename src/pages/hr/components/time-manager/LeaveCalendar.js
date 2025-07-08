import React, { useEffect, useState } from 'react';
import { fetchLeaveRequests } from '../../../../services/leaveService';
import { supabase } from '../../../../lib/supabase';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarDaysIcon,
  UserGroupIcon,
  UserIcon,
  PlusIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const LEAVE_TYPE_CONFIG = {
  holiday: { 
    color: 'bg-emerald-500', 
    lightColor: 'bg-emerald-100', 
    textColor: 'text-emerald-700',
    label: 'Holiday' 
  },
  sick: { 
    color: 'bg-amber-500', 
    lightColor: 'bg-amber-100', 
    textColor: 'text-amber-700',
    label: 'Sick' 
  },
  unpaid: { 
    color: 'bg-slate-500', 
    lightColor: 'bg-slate-100', 
    textColor: 'text-slate-700',
    label: 'Unpaid' 
  },
  parental: { 
    color: 'bg-blue-500', 
    lightColor: 'bg-blue-100', 
    textColor: 'text-blue-700',
    label: 'Parental' 
  },
  custom: { 
    color: 'bg-purple-500', 
    lightColor: 'bg-purple-100', 
    textColor: 'text-purple-700',
    label: 'Other' 
  }
};

function getDaysInMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LeaveCalendar = ({ orgId, currentUser, currentEmployeeId, onRequestTimeOff, compact = false }) => {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const days = getDaysInMonth(month.year, month.month);
  const today = new Date();

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

  // Get leave requests for a specific day
  const getLeaveForDay = (day) => {
    if (!day) return [];
    return requests.filter(r => {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      return day >= start && day <= end;
    });
  };

  // Filter employees based on selection
  const getFilteredEmployees = () => {
    const me = employees.find(e => e.user_id === currentUser?.id);
    const myTeam = employees.filter(e => e.manager_id === me?.id);
    const colleagues = employees.filter(e => e.user_id !== currentUser?.id && e.manager_id !== me?.id);

    if (selectedEmployee === 'me') return me ? [me] : [];
    if (selectedEmployee === 'team') return myTeam;
    if (selectedEmployee === 'colleagues') return colleagues;
    return employees; // 'all'
  };

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

  const isToday = (day) => {
    if (!day) return false;
    return day.toDateString() === today.toDateString();
  };

  const isWeekend = (day) => {
    if (!day) return false;
    const dayOfWeek = day.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <CalendarDaysIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <div className="text-gray-500">Loading calendar...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <InformationCircleIcon className="w-5 h-5 text-red-500 mr-2" />
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (compact) {
    // Compact view for overview tab
    const currentMonthRequests = requests.filter(r => {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      const monthStart = new Date(month.year, month.month, 1);
      const monthEnd = new Date(month.year, month.month + 1, 0);
      return (start <= monthEnd && end >= monthStart);
    });

    return (
      <div className="space-y-4">
        {currentMonthRequests.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500 font-medium">No time off scheduled this month</div>
            <div className="text-gray-400 text-sm">Click "Request Time Off" to add your first request</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentMonthRequests.slice(0, 6).map(request => {
              const employee = employees.find(e => e.id === request.employee_id);
              const config = LEAVE_TYPE_CONFIG[request.type] || LEAVE_TYPE_CONFIG.custom;
              const startDate = new Date(request.start_date);
              const endDate = new Date(request.end_date);
              const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

              return (
                <div key={request.id} className={`p-3 rounded-lg border ${config.lightColor} ${config.textColor} border-current border-opacity-20`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                  <div className="font-medium text-sm">{employee?.name || 'Unknown'}</div>
                  <div className="text-xs opacity-75">
                    {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                  </div>
                  <div className="text-xs opacity-75">{duration} day{duration !== 1 ? 's' : ''}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
              {monthNames[month.month]} {month.year}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={() => setMonth({ year: today.getFullYear(), month: today.getMonth() })}
            className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Employee Filter */}
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="all">All Team</option>
            <option value="me">Just Me</option>
            <option value="team">My Direct Reports</option>
            <option value="colleagues">Colleagues</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-xs font-medium text-gray-600">Leave Types:</span>
        {Object.entries(LEAVE_TYPE_CONFIG).map(([type, config]) => (
          <div key={type} className="flex items-center space-x-1.5">
            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
            <span className="text-xs text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center">
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">{day}</div>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayLeave = getLeaveForDay(day);
              const filteredEmployees = getFilteredEmployees();
              const relevantLeave = dayLeave.filter(leave => 
                filteredEmployees.some(emp => emp.id === leave.employee_id)
              );

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border-b border-r border-gray-100 ${
                    !day ? 'bg-gray-50' : isWeekend(day) ? 'bg-gray-50' : 'bg-white'
                  } ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday(day) ? 'text-blue-600' : isWeekend(day) ? 'text-gray-400' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {relevantLeave.slice(0, 3).map(leave => {
                          const employee = employees.find(e => e.id === leave.employee_id);
                          const config = LEAVE_TYPE_CONFIG[leave.type] || LEAVE_TYPE_CONFIG.custom;
                          
                          return (
                            <div
                              key={`${leave.id}-${day.toISOString()}`}
                              className={`px-2 py-1 rounded text-xs font-medium ${config.color} text-white truncate`}
                              title={`${employee?.name}: ${config.label} (${leave.start_date} to ${leave.end_date})`}
                            >
                              {employee?.name?.split(' ')[0] || 'Unknown'}
                            </div>
                          );
                        })}
                        
                        {relevantLeave.length > 3 && (
                          <div className="text-xs text-gray-500 px-2">
                            +{relevantLeave.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Timeline View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {getFilteredEmployees().map(employee => {
              const employeeRequests = requests.filter(r => 
                r.employee_id === employee.id &&
                new Date(r.start_date).getMonth() === month.month &&
                new Date(r.start_date).getFullYear() === month.year
              );

              return (
                <div key={employee.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">
                          {employee.user_id === currentUser?.id ? 'You' : 'Team Member'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {employeeRequests.length === 0 ? (
                    <div className="text-sm text-gray-400 italic">No time off this month</div>
                  ) : (
                    <div className="space-y-2">
                      {employeeRequests.map(request => {
                        const config = LEAVE_TYPE_CONFIG[request.type] || LEAVE_TYPE_CONFIG.custom;
                        const startDate = new Date(request.start_date);
                        const endDate = new Date(request.end_date);
                        const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                          <div
                            key={request.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg ${config.lightColor} border border-current border-opacity-20`}
                          >
                            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${config.textColor}`}>
                                {config.label} Leave
                              </div>
                              <div className="text-xs text-gray-600">
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} ({duration} day{duration !== 1 ? 's' : ''})
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'approved' ? 'bg-green-100 text-green-700' :
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {request.status}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar; 