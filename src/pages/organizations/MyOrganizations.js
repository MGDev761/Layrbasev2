import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  UserGroupIcon, 
  PlusIcon, 
  UserPlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  InformationCircleIcon,
  XMarkIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const roleOptions = [
  { value: 'owner', label: 'Owner', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'admin', label: 'Admin', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { value: 'member', label: 'Member', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'viewer', label: 'Viewer', color: 'bg-gray-50 text-gray-700 border-gray-200' },
];

const getRoleColor = (role) => {
  const roleConfig = roleOptions.find(r => r.value === role);
  return roleConfig?.color || 'bg-gray-50 text-gray-700 border-gray-200';
};

const InviteModal = ({ isOpen, onClose, onInvite, loading, inviteLink, inviteToken, copied, setCopied }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email, role);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl mx-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Invite Team Member</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {inviteLink ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Invitation Created!</h4>
                <p className="text-sm text-gray-600">Share the link below with your team member</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Link</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      onClick={() => copyToClipboard(inviteLink, 'link')}
                      className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                    >
                      {copied === 'link' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Token</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inviteToken}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 font-mono"
                      onFocus={e => e.target.select()}
                    />
                    <button
                      onClick={() => copyToClipboard(inviteToken, 'token')}
                      className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
                    >
                      {copied === 'token' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter email address..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {roleOptions.filter(r => r.value !== 'owner').map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const MyOrganizations = () => {
  const { organizations, currentOrganization, setCurrentOrganization, user } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState(currentOrganization || organizations[0] || null);
  const [orgDetails, setOrgDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState('');
  const [lastInviteToken, setLastInviteToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleValue, setEditRoleValue] = useState('');
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  useEffect(() => {
    if (selectedOrg) {
      loadMembers(selectedOrg.organization_id);
      loadOrgDetails(selectedOrg.organization_id);
    }
  }, [selectedOrg]);

  const loadOrgDetails = async (orgId) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('description, industry, website, created_at')
        .eq('id', orgId)
        .single();
      
      if (error) throw error;
      setOrgDetails(data);
    } catch (error) {
      console.error('Error loading org details:', error);
      setOrgDetails(null);
    }
  };

  const loadMembers = async (orgId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_org_members_full', { org_id: orgId });
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (email, role) => {
    if (!selectedOrg) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('invite_user_to_organization', {
        p_organization_id: selectedOrg.organization_id,
        p_email: email,
        p_role: role
      });

      if (error) throw error;

      const joinUrl = `${window.location.origin}/join/${data.token}`;
      setLastInviteLink(joinUrl);
      setLastInviteToken(data.token);
      setCopied(false);

      loadMembers(selectedOrg.organization_id);
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Error creating invitation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleEdit = (userId, currentRole) => {
    setEditRoleId(userId);
    setEditRoleValue(currentRole);
  };

  const handleRoleSave = async (userId) => {
    if (!selectedOrg) return;
    await supabase
      .from('user_organizations')
      .update({ role: editRoleValue })
      .eq('organization_id', selectedOrg.organization_id)
      .eq('user_id', userId);
    setEditRoleId(null);
    loadMembers(selectedOrg.organization_id);
  };

  const handleRemoveMember = async (userId) => {
    if (!selectedOrg || !window.confirm('Are you sure you want to remove this member?')) return;
    await supabase
      .from('user_organizations')
      .delete()
      .eq('organization_id', selectedOrg.organization_id)
      .eq('user_id', userId);
    loadMembers(selectedOrg.organization_id);
  };

  const handleSwitchOrganization = (org) => {
    setCurrentOrganization(org);
    setSelectedOrg(org);
    setShowOrgDropdown(false);
  };

  const isAdmin = selectedOrg?.role === 'admin' || selectedOrg?.role === 'owner';

  return (
    <div className="space-y-6">
      {/* Header with Organization Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600 mt-1">Manage your organizations and team members</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <InformationCircleIcon className="w-4 h-4 mr-2" />
            Help
          </button>
        </div>
      </div>

      {/* Organization Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Current Organization:</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {selectedOrg ? (
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{selectedOrg.organization_name?.charAt(0) || '?'}</span>
                  </div>
                  <span>{selectedOrg.organization_name}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getRoleColor(selectedOrg.role)}`}>
                    {selectedOrg.role}
                  </span>
              </div>
              ) : (
                'Select Organization'
              )}
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </button>

            {showOrgDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  {organizations.map((org) => (
                    <button
                      key={org.organization_id}
                      onClick={() => handleSwitchOrganization(org)}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex items-center justify-between ${
                        selectedOrg?.organization_id === org.organization_id
                          ? 'bg-purple-50 text-purple-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{org.organization_name?.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{org.organization_name}</div>
                          <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getRoleColor(org.role)}`}>
                            {org.role}
                          </div>
                        </div>
                      </div>
                      {selectedOrg?.organization_id === org.organization_id && (
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      )}
            </button>
          ))}
                </div>
              </div>
            )}
          </div>
        </div>
                  </div>

      {selectedOrg && (
        <>
          {/* Organization Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Organization Information</h2>
                  <div className="flex items-center space-x-3">
                    {isAdmin && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                        Invite Member
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentOrganization(selectedOrg)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  Switch To
                    </button>
                  </div>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900">{orgDetails?.description || 'No description available'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <p className="text-gray-900">{orgDetails?.industry || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                {orgDetails?.website ? (
                  <a 
                    href={orgDetails.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-purple-600 hover:text-purple-700 flex items-center"
                  >
                    <GlobeAltIcon className="w-4 h-4 mr-1" />
                    {orgDetails.website}
                  </a>
                ) : (
                  <p className="text-gray-500">Not specified</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{members.length}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{members.filter(m => m.is_active).length}</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{members.filter(m => m.role === 'admin' || m.role === 'owner').length}</div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {orgDetails?.created_at ? new Date(orgDetails.created_at).toLocaleDateString() : 'Unknown'}
                </div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
            </div>
              </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Member
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
                ))}
              </div>
            ) : members.length > 0 ? (
                  <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Member</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      {isAdmin && <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>}
                        </tr>
                      </thead>
                  <tbody className="divide-y divide-gray-200">
                        {members.map(member => (
                      <tr key={member.user_id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{member.name?.charAt(0) || member.email?.charAt(0) || '?'}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{member.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {isAdmin && editRoleId === member.user_id ? (
                            <div className="flex items-center space-x-2">
                                    <select
                                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                      value={editRoleValue}
                                      onChange={e => setEditRoleValue(e.target.value)}
                                    >
                                      {roleOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                              <button 
                                onClick={() => handleRoleSave(member.user_id)} 
                                className="p-1 text-green-600 hover:text-green-700"
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${getRoleColor(member.role)}`}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                  </span>
                              {isAdmin && (
                                <button 
                                  onClick={() => handleRoleEdit(member.user_id, member.role)} 
                                  className="p-1 text-gray-400 hover:text-purple-600"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {member.last_login ? new Date(member.last_login).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="py-4 px-4">
                            <button 
                              onClick={() => handleRemoveMember(member.user_id)} 
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                            </td>
                        )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            ) : (
              <div className="text-center py-8">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
                <p className="text-gray-500 mb-4">Get started by inviting your first team member</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                  >
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Invite Member
                  </button>
                )}
            </div>
          )}
        </div>
        </>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => {
                setShowInviteModal(false);
                setLastInviteLink('');
                setLastInviteToken('');
                setCopied(false);
              }}
        onInvite={handleInviteMember}
        loading={loading}
        inviteLink={lastInviteLink}
        inviteToken={lastInviteToken}
        copied={copied}
        setCopied={setCopied}
      />
    </div>
  );
};

export default MyOrganizations; 