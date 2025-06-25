import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logopurple.png';

const JoinOrganization = ({ onSuccess, onCancel }) => {
  const [invitationToken, setInvitationToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { joinOrganization, refreshOrganizations } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!invitationToken.trim()) {
      setError('Invitation token is required');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await joinOrganization(invitationToken);
      
      if (error) {
        setError(error.message);
      } else {
        await refreshOrganizations();
        onSuccess(data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="LayrBase Logo" className="h-12 w-auto" />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Organization
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your invitation token to join an organization
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="invitation-token" className="block text-sm font-medium text-gray-700">
              Invitation Token
            </label>
            <input
              id="invitation-token"
              name="invitationToken"
              type="text"
              required
              value={invitationToken}
              onChange={(e) => setInvitationToken(e.target.value)}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your invitation token"
            />
            <p className="mt-1 text-xs text-gray-500">
              You should have received this token via email or from your organization admin
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Joining...' : 'Join Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinOrganization; 