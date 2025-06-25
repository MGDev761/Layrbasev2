import React from 'react';
import Card from '../../../../components/common/layout/Card';

const MetricCard = ({ title, value, subtitle, icon, colors }) => (
  <Card className={`bg-gradient-to-r ${colors.gradient} border ${colors.border}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
        <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
        <p className={`text-xs ${colors.text}`}>{subtitle}</p>
      </div>
      <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </Card>
);

const OwnershipSummary = () => {
  const metrics = [
    {
      title: 'Total Shares',
      value: '10,000,000',
      subtitle: 'Authorized shares',
      colors: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-600',
        value: 'text-blue-900',
        iconBg: 'bg-blue-200'
      },
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Issued Shares',
      value: '7,500,000',
      subtitle: '75% of authorized',
      colors: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        text: 'text-green-600',
        value: 'text-green-900',
        iconBg: 'bg-green-200'
      },
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Company Valuation',
      value: '$25M',
      subtitle: 'Latest round',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-600',
        value: 'text-purple-900',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Ownership Summary</h1>
        <p className="text-gray-600 text-sm mb-6">Overview of your company's share structure and ownership metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default OwnershipSummary; 