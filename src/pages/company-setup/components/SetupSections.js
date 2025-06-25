import React from 'react';

const SetupSection = ({ title, description, icon, iconBg, iconColor }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center mb-3">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mr-3`}>
        <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const SetupSections = () => {
  const sections = [
    {
      title: 'Company Information',
      description: 'Set up your company details, legal structure, and basic information.',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    },
    {
      title: 'Legal Documents',
      description: 'Upload and manage incorporation documents, bylaws, and contracts.',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
    {
      title: 'Team Members',
      description: 'Add founders, employees, and advisors to your team.',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section, index) => (
        <SetupSection key={index} {...section} />
      ))}
    </div>
  );
};

export default SetupSections; 