import React from 'react';

const QuickActions = () => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          Add Company Details
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          Upload Documents
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          Invite Team Members
        </button>
      </div>
    </div>
  );
};

export default QuickActions; 