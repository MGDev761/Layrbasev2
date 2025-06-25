import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  UserGroupIcon, 
  PlusIcon, 
  CogIcon, 
  UserPlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const MyOrganizations = () => {
  const { organizations, currentOrganization, setCurrentOrganization, user } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInvitationEmail, setNewInvitationEmail] = useState('');
  const [newInvitationRole, setNewInvitationRole] = useState('member');
  const [lastInviteLink, setLastInviteLink] = useState('');
  const [lastInviteToken, setLastInviteToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedOrg) {
      loadOrganizationDetails(selectedOrg.organization_id);
    }
  }, [selectedOrg]);

  const loadOrganizationDetails = async (orgId) => {
    setLoading(true);
    try {
      // Load members
      const { data: membersData, error: membersError } = await supabase
        .from('org_members_visible')
        .select('*')
        .eq('organization_id', orgId);

      if (membersError) {
        console.error('Members error:', membersError);
        // Show error to user
        alert('Error loading members: ' + membersError.message);
        setMembers([]);
      } else {
        console.log('Members loaded:', membersData?.length || 0, 'members');
        setMembers(membersData || []);
      }

      // Load pending invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('organization_invitations')
        .select('*')
        .eq('organization_id', orgId)
        .is('accepted_at', null);

      if (invitationsError) throw invitationsError;
      setInvitations(invitationsData || []);
    } catch (error) {
      console.error('Error loading organization details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!newInvitationEmail.trim() || !selectedOrg) return;

    setLoading(true);
    try {
      // Create invitation in database
      const { data, error } = await supabase.rpc('invite_user_to_organization', {
        p_organization_id: selectedOrg.organization_id,
        p_email: newInvitationEmail,
        p_role: newInvitationRole
      });

      if (error) throw error;

      // Show/copy invitation link and token
      const joinUrl = `${window.location.origin}/join/${data.token}`;
      setLastInviteLink(joinUrl);
      setLastInviteToken(data.token);
      setCopied(false);

      setNewInvitationEmail('');
      loadOrganizationDetails(selectedOrg.organization_id);
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Error creating invitation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    // Remove confirmation for now
    try {
      const { error } = await supabase
        .from('user_organizations')
        .delete()
        .eq('organization_id', selectedOrg.organization_id)
        .eq('user_id', userId);

      if (error) throw error;
      loadOrganizationDetails(selectedOrg.organization_id);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    // Remove confirmation for now
    try {
      const { error } = await supabase
        .from('organization_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;
      loadOrganizationDetails(selectedOrg.organization_id);
    } catch (error) {
      console.error('Error canceling invitation:', error);
    }
  };

  const isAdmin = selectedOrg?.role === 'admin' || selectedOrg?.role === 'owner';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Organizations</h1>
        <p className="text-gray-600 mt-2">Manage your organizations and team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Organization List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Organizations</h2>
            </div>
            <div className="p-4 space-y-2">
              {organizations.map((org) => (
                <button
                  key={org.organization_id}
                  onClick={() => setSelectedOrg(org)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedOrg?.organization_id === org.organization_id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {org.organization_name}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{org.role}</p>
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
          </div>
        </div>

        {/* Organization Details */}
        <div className="lg:col-span-3">
          {selectedOrg ? (
            <div className="bg-white rounded-lg shadow border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedOrg.organization_name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      You are a {selectedOrg.role} of this organization
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {isAdmin && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Invite Member
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentOrganization(selectedOrg)}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Switch to
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'members'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Members ({members.length})
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setActiveTab('invitations')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'invitations'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Invitations ({invitations.length})
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'settings'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Settings
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900">Total Members</h3>
                        <p className="text-3xl font-bold text-blue-600">{members.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900">Pending Invitations</h3>
                        <p className="text-3xl font-bold text-yellow-600">{invitations.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900">Your Role</h3>
                        <p className="text-3xl font-bold text-green-600 capitalize">{selectedOrg.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'members' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Avatar</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Role</th>
                          {isAdmin && <th className="px-3 py-2"></th>}
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.user_id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                                {member.first_name?.[0]}{member.last_name?.[0]}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-sm text-gray-900">
                              {member.first_name} {member.last_name}
                            </td>
                            <td className="px-3 py-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                                {member.role}
                              </span>
                            </td>
                            {isAdmin && (
                              <td className="px-3 py-2">
                                {member.user_id !== user?.id && (
                                  <button
                                    onClick={() => handleRemoveMember(member.user_id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Remove member"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'invitations' && isAdmin && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
                    {invitations.length === 0 ? (
                      <div className="text-gray-500">No pending invitations.</div>
                    ) : (
                      <div className="space-y-4">
                        {invitations.map((inv) => (
                          <div key={inv.id} className="flex flex-col md:flex-row md:items-center md:space-x-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{inv.email}</div>
                              <div className="text-sm text-gray-600">Role: {inv.role}</div>
                              <div className="flex items-center space-x-2 mt-2">
                                <input
                                  type="text"
                                  value={inv.token}
                                  readOnly
                                  className="px-2 py-1 border rounded text-xs w-64"
                                  onFocus={e => e.target.select()}
                                />
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(inv.token);
                                    setCopied(`token-${inv.id}`);
                                  }}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                >
                                  {copied === `token-${inv.id}` ? 'Copied!' : 'Copy Token'}
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => handleCancelInvitation(inv.id)}
                              className="mt-2 md:mt-0 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Settings</h3>
                      <p className="text-gray-600">
                        Organization settings are managed through the main application settings.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No organization selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select an organization from the list to view its details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowInviteModal(false);
                setLastInviteLink('');
                setLastInviteToken('');
                setCopied(false);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Invite Member</h2>
            {lastInviteLink ? (
              <>
                <div className="mb-4 text-green-700 font-medium">Invitation created!</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={lastInviteLink}
                      readOnly
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(lastInviteLink);
                        setCopied('link');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      {copied === 'link' ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={lastInviteToken}
                      readOnly
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(lastInviteToken);
                        setCopied('token');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      {copied === 'token' ? 'Copied!' : 'Copy Token'}
                    </button>
                  </div>
                </div>
                <button
                  className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                  onClick={() => {
                    setShowInviteModal(false);
                    setLastInviteLink('');
                    setLastInviteToken('');
                    setCopied(false);
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={handleInviteMember}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded"
                    value={newInvitationEmail}
                    onChange={e => setNewInvitationEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={newInvitationRole}
                    onChange={e => setNewInvitationRole(e.target.value)}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Inviting...' : 'Send Invitation'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrganizations; 