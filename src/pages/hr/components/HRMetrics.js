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

const HRMetrics = () => {
  const metrics = [
    {
      title: 'Total Employees',
      value: '47',
      change: '+3 this month',
      colors: {
        gradient: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        text: 'text-emerald-600',
        value: 'text-emerald-900',
        iconBg: 'bg-emerald-200'
      },
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      title: 'Open Positions',
      value: '8',
      change: '5 in final stages',
      colors: {
        gradient: 'from-rose-50 to-rose-100',
        border: 'border-rose-200',
        text: 'text-rose-600',
        value: 'text-rose-900',
        iconBg: 'bg-rose-200'
      },
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
        </svg>
      )
    },
    {
      title: 'Time Off Requests',
      value: '12',
      change: '3 pending approval',
      colors: {
        gradient: 'from-amber-50 to-amber-100',
        border: 'border-amber-200',
        text: 'text-amber-600',
        value: 'text-amber-900',
        iconBg: 'bg-amber-200'
      },
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Employee Satisfaction',
      value: '4.6/5',
      change: '+0.2 from last quarter',
      colors: {
        gradient: 'from-violet-50 to-violet-100',
        border: 'border-violet-200',
        text: 'text-violet-600',
        value: 'text-violet-900',
        iconBg: 'bg-violet-200'
      },
      icon: (
        <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default HRMetrics; 