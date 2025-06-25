import React from 'react';

const EmployeeCard = ({ name, role, department, startDate, avatar }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center mb-3">
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
        <span className="text-sm font-medium text-primary-600">{avatar}</span>
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">{department}</span>
      <span className="text-xs text-gray-500">Started {startDate}</span>
    </div>
  </div>
);

const RecentHires = () => {
  const employees = [
    { name: 'Sarah Johnson', role: 'Senior Developer', department: 'Engineering', startDate: '2024-01-15', avatar: 'SJ' },
    { name: 'Michael Chen', role: 'Product Manager', department: 'Product', startDate: '2024-01-10', avatar: 'MC' },
    { name: 'Emily Rodriguez', role: 'Marketing Specialist', department: 'Marketing', startDate: '2024-01-08', avatar: 'ER' },
    { name: 'David Kim', role: 'Sales Representative', department: 'Sales', startDate: '2024-01-05', avatar: 'DK' },
    { name: 'Lisa Thompson', role: 'UX Designer', department: 'Design', startDate: '2024-01-03', avatar: 'LT' },
    { name: 'James Wilson', role: 'Data Analyst', department: 'Analytics', startDate: '2024-01-01', avatar: 'JW' },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Hires</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee, index) => (
          <EmployeeCard key={index} {...employee} />
        ))}
      </div>
    </div>
  );
};

export default RecentHires; 