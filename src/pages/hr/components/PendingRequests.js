import React from 'react';

const RequestItem = ({ type, employee, details, status }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-3 ${
        status === 'Approved' ? 'bg-green-400' : 'bg-yellow-400'
      }`}></div>
      <div>
        <p className="font-medium text-gray-900">{type} - {employee}</p>
        <p className="text-sm text-gray-600">{details}</p>
      </div>
    </div>
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
      status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {status}
    </span>
  </div>
);

const PendingRequests = () => {
  const requests = [
    { type: 'Time Off', employee: 'Alex Morgan', details: 'Vacation - 5 days', status: 'Pending' },
    { type: 'Expense', employee: 'Rachel Green', details: 'Conference travel - $1,200', status: 'Pending' },
    { type: 'Equipment', employee: 'Tom Anderson', details: 'New laptop request', status: 'Approved' },
    { type: 'Time Off', employee: 'Jessica Park', details: 'Sick leave - 2 days', status: 'Pending' },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Requests</h2>
      <div className="space-y-3">
        {requests.map((request, index) => (
          <RequestItem key={index} {...request} />
        ))}
      </div>
    </div>
  );
};

export default PendingRequests; 