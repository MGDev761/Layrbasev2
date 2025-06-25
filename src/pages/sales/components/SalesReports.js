import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/20/solid';

const SalesReports = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 45000, deals: 8, customers: 12 },
    { month: 'Feb', revenue: 52000, deals: 10, customers: 15 },
    { month: 'Mar', revenue: 48000, deals: 9, customers: 13 },
    { month: 'Apr', revenue: 61000, deals: 12, customers: 18 },
    { month: 'May', revenue: 55000, deals: 11, customers: 16 },
    { month: 'Jun', revenue: 68000, deals: 14, customers: 20 },
  ];

  const topCustomers = [
    { name: 'TechCorp Ltd', revenue: 25000, deals: 3 },
    { name: 'InnovateTech', revenue: 22000, deals: 2 },
    { name: 'Acme Solutions', revenue: 18000, deals: 2 },
    { name: 'StartupXYZ', revenue: 15000, deals: 1 },
    { name: 'GrowthCo', revenue: 12000, deals: 1 },
  ];

  const conversionRates = [
    { stage: 'Lead to Qualified', rate: 65, change: '+5%' },
    { stage: 'Qualified to Proposal', rate: 45, change: '+2%' },
    { stage: 'Proposal to Negotiation', rate: 30, change: '-1%' },
    { stage: 'Negotiation to Closed', rate: 75, change: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Sales Reports</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">£329,000</p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12.5%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Customers</p>
              <p className="text-2xl font-semibold text-gray-900">94</p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8.2%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Deals Closed</p>
              <p className="text-2xl font-semibold text-gray-900">64</p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +15.3%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Deal Size</p>
              <p className="text-2xl font-semibold text-gray-900">£5,140</p>
              <div className="flex items-center text-sm text-red-600">
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                -2.1%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h4>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{data.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(data.revenue / 70000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">£{data.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Conversion Rates</h4>
          <div className="space-y-4">
            {conversionRates.map((rate) => (
              <div key={rate.stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{rate.stage}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${rate.rate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{rate.rate}%</span>
                  <span className={`text-xs ${rate.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {rate.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Top Customers</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Deal Size
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCustomers.map((customer) => (
                <tr key={customer.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{customer.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.deals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    £{(customer.revenue / customer.deals).toLocaleString()}
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

export default SalesReports; 