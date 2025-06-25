import React from 'react';
import Card from '../../../components/common/layout/Card';

const MetricCard = ({ title, value, change, icon, colors }) => (
  <Card className={`bg-gradient-to-r ${colors.gradient} border ${colors.border}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
        <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
        <p className={`text-xs ${colors.text}`}>{change}</p>
      </div>
      <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </Card>
);

const MarketingMetrics = () => {
  const metrics = [
    {
      title: 'Website Traffic',
      value: '45.2K',
      change: '+18% from last month',
      colors: {
        gradient: 'from-pink-50 to-pink-100',
        border: 'border-pink-200',
        text: 'text-pink-600',
        value: 'text-pink-900',
        iconBg: 'bg-pink-200'
      },
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Lead Generation',
      value: '1,247',
      change: '+25% from last month',
      colors: {
        gradient: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        text: 'text-indigo-600',
        value: 'text-indigo-900',
        iconBg: 'bg-indigo-200'
      },
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8% from last month',
      colors: {
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        text: 'text-yellow-600',
        value: 'text-yellow-900',
        iconBg: 'bg-yellow-200'
      },
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Social Reach',
      value: '89.5K',
      change: '+12% from last month',
      colors: {
        gradient: 'from-teal-50 to-teal-100',
        border: 'border-teal-200',
        text: 'text-teal-600',
        value: 'text-teal-900',
        iconBg: 'bg-teal-200'
      },
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default MarketingMetrics; 