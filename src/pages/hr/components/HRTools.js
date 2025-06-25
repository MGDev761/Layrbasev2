import React from 'react';
import Card from '../../../components/common/layout/Card';

const ToolCard = ({ title, description, buttonText, buttonColor, icon, colors }) => (
  <Card className={`bg-gradient-to-r ${colors.gradient} border ${colors.border}`}>
    <div className="flex items-center mb-3">
      <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center mr-3`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <button className={`${buttonColor} text-white px-3 py-1 rounded text-sm hover:opacity-90`}>
      {buttonText}
    </button>
  </Card>
);

const HRTools = () => {
  const tools = [
    {
      title: 'Recruitment',
      description: 'Manage job postings, applications, and hiring process.',
      buttonText: 'Post Job',
      buttonColor: 'bg-purple-600',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: 'Time Tracking',
      description: 'Track employee hours, time off, and attendance.',
      buttonText: 'View Timesheets',
      buttonColor: 'bg-purple-600',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Performance',
      description: 'Manage performance reviews and goal setting.',
      buttonText: 'Schedule Review',
      buttonColor: 'bg-purple-600',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool, index) => (
        <ToolCard key={index} {...tool} />
      ))}
    </div>
  );
};

export default HRTools; 