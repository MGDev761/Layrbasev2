import React from 'react';

const ShareholderTable = () => {
  const shareholders = [
    { name: 'Founders', shares: 3000000, ownership: 40, value: '$10M', type: 'Common' },
    { name: 'Series A Investors', shares: 2000000, ownership: 26.67, value: '$6.67M', type: 'Preferred' },
    { name: 'Series B Investors', shares: 1500000, ownership: 20, value: '$5M', type: 'Preferred' },
    { name: 'Employee Pool', shares: 750000, ownership: 10, value: '$2.5M', type: 'Options' },
    { name: 'Advisors', shares: 250000, ownership: 3.33, value: '$833K', type: 'Options' },
  ];

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Common': return 'bg-blue-100 text-blue-800';
      case 'Preferred': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Shareholders</h1>
        <p className="text-gray-600 text-sm mb-6">Manage your company's shareholders and their ownership details</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shareholder Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shareholder</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shareholders.map((shareholder, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-primary-600">
                          {shareholder.name.charAt(0)}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{shareholder.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shareholder.shares.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shareholder.ownership}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shareholder.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(shareholder.type)}`}>
                      {shareholder.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShareholderTable; 