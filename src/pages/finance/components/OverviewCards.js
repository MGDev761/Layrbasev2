import React from 'react';
import Card from '../../../components/common/layout/Card';

const OverviewCard = ({ title, value, change, icon, colors }) => (
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

const OverviewCards = () => {
  const cards = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12% from last month',
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
      title: 'Cash Flow',
      value: '$450K',
      change: '+8% from last month',
      colors: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-600',
        value: 'text-blue-900',
        iconBg: 'bg-blue-200'
      },
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Expenses',
      value: '$1.2M',
      change: '-3% from last month',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-600',
        value: 'text-purple-900',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Profit Margin',
      value: '24%',
      change: '+2% from last month',
      colors: {
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        text: 'text-orange-600',
        value: 'text-orange-900',
        iconBg: 'bg-orange-200'
      },
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <OverviewCard key={index} {...card} />
      ))}
    </div>
  );
};

export default OverviewCards; 