import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AuthError = ({ error }) => {
  const { signOut } = useAuth();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.reload(); // Ensure a full refresh to clear state
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We had trouble loading your session.
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-left">
          <h3 className="text-sm font-medium text-red-800">Error Details:</h3>
          <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
            {error?.message || 'An unknown error occurred.'}
          </pre>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSignOut}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Out
          </button>
          <button
            onClick={handleRetry}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthError; 