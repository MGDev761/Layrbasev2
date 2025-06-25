import React, { useState } from 'react';
import CreateOrganization from './CreateOrganization';
import JoinOrganization from './JoinOrganization';

const OrganizationSelection = ({ onOrganizationCreated }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const handleCreateSuccess = (organization) => {
    setShowCreate(false);
    onOrganizationCreated(organization);
  };

  const handleJoinSuccess = (invitation) => {
    setShowJoin(false);
    onOrganizationCreated(invitation);
  };

  if (showCreate) {
    return (
      <CreateOrganization
        onSuccess={handleCreateSuccess}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  if (showJoin) {
    return (
      <JoinOrganization
        onSuccess={handleJoinSuccess}
        onCancel={() => setShowJoin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to Layrbase
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You need to create or join an organization to get started.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Organization
          </button>
          <button
            onClick={() => setShowJoin(true)}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Join Organization
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Organizations help you collaborate with your team and manage your cap table data securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelection; 