import React from 'react';
import { Popover } from '@headlessui/react';
import { ChevronDownIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const OrganizationSwitcher = ({ onCreateOrganization, onJoinOrganization }) => {
  const { organizations, currentOrganization, setCurrentOrganization } = useAuth();

  const handleOrganizationSelect = (org) => {
    setCurrentOrganization(org);
  };

  if (!organizations || organizations.length === 0) {
    return null;
  }

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <UserGroupIcon className="h-4 w-4 text-gray-400" />
        <span className="truncate max-w-32">
          {currentOrganization?.organization_name || 'Select Organization'}
        </span>
        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
      </Popover.Button>

      <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">Organizations</h3>
            <p className="text-xs text-gray-500">Switch between your organizations</p>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {organizations.map((org) => (
              <button
                key={org.organization_id}
                onClick={() => handleOrganizationSelect(org)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentOrganization?.organization_id === org.organization_id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{org.organization_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{org.role}</p>
                  </div>
                  {currentOrganization?.organization_id === org.organization_id && (
                    <div className="ml-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={onCreateOrganization}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Organization
            </button>
            <button
              onClick={onJoinOrganization}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <UserGroupIcon className="h-4 w-4 mr-2" />
              Join Organization
            </button>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default OrganizationSwitcher; 