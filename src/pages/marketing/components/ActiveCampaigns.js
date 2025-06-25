import React from 'react';

const CampaignCard = ({ name, status, progress, leads, budget }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-3 ${
          status === 'Active' ? 'bg-green-400' : 'bg-yellow-400'
        }`}></div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </div>
      <div className="text-sm text-gray-500">Budget: {budget}</div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex-1 mr-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {leads} leads generated
      </div>
    </div>
  </div>
);

const ActiveCampaigns = () => {
  const campaigns = [
    { name: 'Q1 Product Launch', status: 'Active', progress: 75, leads: 342, budget: '$15K' },
    { name: 'LinkedIn B2B Campaign', status: 'Active', progress: 45, leads: 189, budget: '$8K' },
    { name: 'Email Newsletter Series', status: 'Active', progress: 90, leads: 567, budget: '$2K' },
    { name: 'Trade Show Preparation', status: 'Planning', progress: 20, leads: 0, budget: '$25K' },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Active Campaigns</h2>
      <div className="space-y-4">
        {campaigns.map((campaign, index) => (
          <CampaignCard key={index} {...campaign} />
        ))}
      </div>
    </div>
  );
};

export default ActiveCampaigns; 