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

const MarketingTools = () => {
  const tools = [
    {
      title: 'Email Marketing',
      description: 'Create and send email campaigns to your audience.',
      buttonText: 'Create Campaign',
      buttonColor: 'bg-blue-600',
      colors: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        iconBg: 'bg-blue-200'
      },
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Social Media',
      description: 'Schedule and manage social media posts across platforms.',
      buttonText: 'Schedule Post',
      buttonColor: 'bg-green-600',
      colors: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        iconBg: 'bg-green-200'
      },
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
        </svg>
      )
    },
    {
      title: 'Analytics',
      description: 'Track campaign performance and audience insights.',
      buttonText: 'View Reports',
      buttonColor: 'bg-purple-600',
      colors: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconBg: 'bg-purple-200'
      },
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

export default MarketingTools; 