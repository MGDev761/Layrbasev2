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
  PencilIcon,
  CheckIcon,
  InformationCircleIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const roleOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
];

const MyOrganizations = () => {
  const { organizations, currentOrganization, setCurrentOrganization, user } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState(currentOrganization || organizations[0] || null);
  const [orgDetails, setOrgDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInvitationEmail, setNewInvitationEmail] = useState('');
  const [newInvitationRole, setNewInvitationRole] = useState('member');
  const [lastInviteLink, setLastInviteLink] = useState('');
  const [lastInviteToken, setLastInviteToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleValue, setEditRoleValue] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      // Join user_organizations, user_profiles, and auth.users
      const { data, error } = await supabase.rpc('get_org_members_full', { org_id: orgId });
      // get_org_members_full should return: user_id, name, email, role, is_active, joined_at, last_login, created_at
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      setMembers([]);
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
    if (!selectedOrg) return;
    await supabase
      .from('user_organizations')
      .delete()
      .eq('organization_id', selectedOrg.organization_id)
      .eq('user_id', userId);
    loadMembers(selectedOrg.organization_id);
  };

  const isAdmin = selectedOrg?.role === 'admin' || selectedOrg?.role === 'owner';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Organizations</h1>
          <p className="text-gray-600 mt-2">Manage your organizations and team members</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center border border-gray-300 text-gray-700 bg-white px-2 py-1 rounded-md hover:bg-gray-50 focus:outline-none gap-1 text-xs font-medium" onClick={() => setShowHelpModal(true)}>
            <InformationCircleIcon className="w-4 h-4 text-gray-400 mr-1" />
            Help
          </button>
          {showHelpModal && <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />}
        </div>
      </div>

      <div className="bg-white rounded-md flex flex-row">
        <div className="w-64 border-r border-gray-200 p-4 bg-white">
          <div className="mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Organizations</div>
          {organizations.map((org, idx) => (
            <button key={org.organization_id} onClick={() => setSelectedOrg(org)} className={`w-full text-left px-4 py-3 font-medium transition-colors ${selectedOrg?.organization_id === org.organization_id ? 'bg-purple-50 text-purple-800' : 'bg-white text-gray-900 hover:bg-gray-50'}`}>
              <div className="flex items-center">
                <span className="truncate flex-1">{org.organization_name}</span>
                {selectedOrg?.organization_id === org.organization_id && <span className="w-2 h-2 rounded-full bg-purple-600 ml-2" />}
              </div>
              <div className="text-xs text-gray-600 capitalize">{org.role}</div>
            </button>
          ))}
        </div>
        <div className="flex-1">
          {selectedOrg ? (
            <div className="bg-white">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedOrg.website && orgDetails?.website ? (
                      <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(orgDetails.website)}`} alt="favicon" className="w-7 h-7 rounded" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-black flex items-center justify-center text-white font-bold text-base">{selectedOrg.organization_name?.[0] || '?'}</div>
                    )}
                    <span className="text-lg font-bold text-gray-900">{selectedOrg.organization_name}</span>
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
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'members' ? 'text-purple-700 border-b-2 border-purple-600 bg-white' : 'text-gray-600 hover:text-purple-700'}`}
                  onClick={() => setActiveTab('members')}
                >Members</button>
                <button
                  className={`px-6 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-purple-700 border-b-2 border-purple-600 bg-white' : 'text-gray-600 hover:text-purple-700'}`}
                  onClick={() => setActiveTab('overview')}
                >Overview</button>
                {/* Add more tabs as needed */}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'members' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map(member => (
                          <tr key={member.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{member.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.email}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {isAdmin ? (
                                editRoleId === member.user_id ? (
                                  <span className="flex items-center gap-2">
                                    <select
                                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                                      value={editRoleValue}
                                      onChange={e => setEditRoleValue(e.target.value)}
                                    >
                                      {roleOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                    <button onClick={() => handleRoleSave(member.user_id)} className="text-green-600 hover:text-green-800"><CheckIcon className="w-4 h-4" /></button>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    {member.role}
                                    <button onClick={() => handleRoleEdit(member.user_id, member.role)} className="text-gray-400 hover:text-purple-600"><PencilIcon className="w-4 h-4" /></button>
                                  </span>
                                )
                              ) : (
                                <span>{member.role}</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.created_at ? new Date(member.created_at).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.last_login ? new Date(member.last_login).toLocaleDateString() : ''}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{member.is_active ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-2 text-sm">
                              {isAdmin && (
                                <button onClick={() => handleRemoveMember(member.user_id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-4 h-4" /></button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                      <div className="text-gray-700 text-sm">{orgDetails?.description || 'No description available'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Organization Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Industry:</span>
                          <span className="text-gray-900">{orgDetails?.industry || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Created:</span>
                          <span className="text-gray-900">{orgDetails?.created_at ? new Date(orgDetails.created_at).toLocaleDateString() : '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Website:</span>
                          <span className="text-gray-900">
                            {orgDetails?.website ? (
                              <a href={orgDetails.website} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline">
                                {orgDetails.website}
                              </a>
                            ) : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6">
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

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, roles: false, security: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ orgs: true, members: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Organizations Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Basics
          </button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <Cog6ToothIcon className="w-5 h-5" /> Platform How-To
          </button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <ChatBubbleLeftRightIcon className="w-5 h-5" /> AI
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Manage your organizations, members, and roles. Use the left panel to switch between organizations you belong to.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('roles')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Roles & Permissions</span>{openContent.roles ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.roles && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Owners and admins can manage members and settings.</li><li>Members can view and contribute to the organization.</li><li>Viewers have read-only access.</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('security')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Security</span>{openContent.security ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.security && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Only organization admins can invite or remove members. All actions are logged for security and compliance.</p></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('orgs')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Switching Organizations</span>{openPlatform.orgs ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.orgs && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use the left panel to select an organization. The details and members for that org will appear on the right.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('members')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Managing Members</span>{openPlatform.members ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.members && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Edit member roles inline in the table.</li><li>Remove members with the trash icon.</li><li>Invite new members from the details section.</li></ul></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your organizations assistant. I can help you manage members, roles, and answer questions about using this platform.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I change a member's role?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the pencil icon next to the role, select a new role, and click the check to save.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I invite a new member?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the 'Invite Member' button in the details section and enter their email and role.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about organizations..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

export default MyOrganizations; 