import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee, linkUserToEmployee, unlinkUserFromEmployee, fetchEmployeeByUserId } from '../../../services/employeesService';
import { fetchHolidays } from '../../../services/holidaysService';
import { createLeaveBalances } from '../../../services/leaveService';
import { supabase } from '../../../lib/supabase';
import Card from '../../../components/common/layout/Card';
import OrgChart from './layout/OrgChart';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const initialForm = {
  name: '',
  email: '',
  position: '',
  department: '',
  manager_id: null,
  start_date: '',
  contract_type: '',
  profile: '',
  user_id: null
};

const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, onboarding: false, roles: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ add: true, edit: false, search: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Employees Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><BookOpenIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><Cog6ToothIcon className="w-5 h-5" /> Platform How-To</button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Manage your organization's employees, roles, and onboarding in one place. Track employee details, contracts, and reporting lines.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('onboarding')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Onboarding</span>{openContent.onboarding ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.onboarding && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Add new employees with their details and contract type</li><li>Assign managers and departments</li><li>Track start dates and onboarding progress</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('roles')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Roles & Departments</span>{openContent.roles ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.roles && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Organize employees by department and role</li><li>Assign reporting lines and managers</li><li>Keep org charts up to date</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('add')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Adding Employees</span>{openPlatform.add ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.add && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use the "Add Employee" button to create new records. Fill in all required fields and assign a manager if needed. Save to update the employee list.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('edit')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Editing & Linking</span>{openPlatform.edit ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.edit && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Edit employee details by clicking on their name. Link users to employees for SSO and permissions management.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('search')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Search & Filter</span>{openPlatform.search ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.search && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Use the search bar to find employees by name, department, or email. Filter by department or contract type for quick access.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your HR assistant. I can help you onboard employees, manage roles, and answer questions about using this platform.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I add a new employee?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the "Add Employee" button, fill in the required details, and save. Assign a manager and department if needed.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I update an employee's department?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Edit the employee record, select the new department, and save changes. The org chart will update automatically.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about HR..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

const Employees = () => {
  const { currentOrganization } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('table');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [leaveBalances, setLeaveBalances] = useState({
    holiday: 25,
    sick: 10,
    unpaid: 0,
    parental: 0,
    custom: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileEmployee, setProfileEmployee] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const [profileForm, setProfileForm] = useState(initialForm);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profileHolidays, setProfileHolidays] = useState([]);
  const [profileTeam, setProfileTeam] = useState([]);
  const [profileActivity, setProfileActivity] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees
  const loadEmployees = () => {
    if (!currentOrganization) return;
    setLoading(true);
    fetchEmployees(currentOrganization.organization_id)
      .then(setEmployees)
      .catch(setError)
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadEmployees(); /* eslint-disable-next-line */ }, [currentOrganization]);

  // Fetch users for linking
  useEffect(() => {
    if (!currentOrganization) return;
    supabase
      .rpc('get_org_members_full', { org_id: currentOrganization.organization_id })
      .then(({ data, error }) => {
        if (error) { setUsers([]); return; }
        setUsers((data || []).map(row => ({
          id: row.user_id,
          first_name: row.name?.split(' ')[0] || '',
          last_name: row.name?.split(' ').slice(1).join(' ') || '',
          email: row.email || '',
        })));
      });
  }, [currentOrganization]);

  // Fetch current user id
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data?.user?.id || null));
  }, []);

  // Fetch holidays for profile
  const loadProfileHolidays = async (emp) => {
    if (!emp) return;
    const { data } = await supabase.from('holidays').select('*').eq('employee_id', emp.id).order('start_date', { ascending: false });
    setProfileHolidays(data || []);
  };

  // Fetch team (direct reports)
  const loadProfileTeam = async (emp) => {
    if (!emp) return;
    const { data } = await supabase.from('employees').select('*').eq('manager_id', emp.id);
    setProfileTeam(data || []);
  };

  // Build activity feed (demo: recent holidays + profile edits)
  const buildProfileActivity = (emp, holidays) => {
    const feed = [];
    if (emp.updated_at && emp.updated_at !== emp.created_at) {
      feed.push({
        type: 'profile_edit',
        date: emp.updated_at,
        desc: 'Profile updated'
      });
    }
    holidays.forEach(h => {
      feed.push({
        type: 'holiday',
        date: h.submitted_at || h.start_date,
        desc: `Holiday request (${h.status}) from ${h.start_date} to ${h.end_date}`
      });
    });
    feed.sort((a, b) => new Date(b.date) - new Date(a.date));
    setProfileActivity(feed);
  };

  // Open add/edit modal
  const openModal = (emp = null) => {
    setEditingId(emp ? emp.id : null);
    setForm(emp ? {
      name: emp.name || '',
      email: emp.email || '',
      position: emp.position || '',
      department: emp.department || '',
      manager_id: emp.manager_id || null,
      start_date: emp.start_date || '',
      contract_type: emp.contract_type || '',
      profile: emp.profile || '',
      user_id: emp.user_id || null
    } : initialForm);
    setModalOpen(true);
  };
  // Open delete modal
  const openDeleteModal = (id) => { setDeleteId(id); setDeleteModalOpen(true); };

  // Open profile modal
  const openProfileModal = (emp) => {
    setProfileEmployee(emp);
    setProfileForm(emp);
    setProfileEdit(false);
    setProfileModalOpen(true);
    loadProfileHolidays(emp).then(() => {
      loadProfileTeam(emp);
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
      } else {
        const newEmployee = await addEmployee({ ...form, organization_id: currentOrganization.organization_id });
        
        // Create leave balances for new employee
        const balances = Object.entries(leaveBalances)
          .filter(([_, balance]) => balance > 0)
          .map(([type, balance]) => ({ type, balance }));
        
        if (balances.length > 0) {
          await createLeaveBalances(currentOrganization.organization_id, newEmployee.id, balances);
        }
      }
      setModalOpen(false);
      loadEmployees();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };
  // Handle delete
  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteEmployee(deleteId);
      setDeleteModalOpen(false);
      loadEmployees();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  // Add link/unlink logic
  const handleLinkUser = async (employeeId, userId) => {
    setSaving(true);
    try {
      await linkUserToEmployee(employeeId, userId);
      loadEmployees();
    } finally {
      setSaving(false);
    }
  };
  const handleUnlinkUser = async (employeeId) => {
    setSaving(true);
    try {
      await unlinkUserFromEmployee(employeeId);
      loadEmployees();
    } finally {
      setSaving(false);
    }
  };

  // Save profile edits
  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await updateEmployee(profileEmployee.id, profileForm);
      setProfileEdit(false);
      loadEmployees();
      setProfileEmployee({ ...profileEmployee, ...profileForm });
    } finally {
      setSaving(false);
    }
  };

  // After loading holidays, build activity feed
  useEffect(() => {
    if (profileEmployee && profileHolidays) {
      buildProfileActivity(profileEmployee, profileHolidays);
    }
    // eslint-disable-next-line
  }, [profileEmployee, profileHolidays]);

  if (!currentOrganization) return <div>Select an organization</div>;
  if (loading) return <div>Loading employees...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2 mt-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
          <p className="text-gray-600 text-sm mb-2">Manage your organization's employees, onboarding, and roles.</p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
          Help
        </button>
      </div>
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('table')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === 'table'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setView('orgchart')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                view === 'orgchart'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Org Chart
            </button>
          </nav>
        </div>
      </div>

      {view === 'table' ? (
        <div>
          {/* Actions Bar - now visually attached to table */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 rounded-t-md px-4 pt-4 pb-2 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-b-2 border-transparent focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <button onClick={() => openModal()} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
              Add Employee
            </button>
          </div>

          {/* Table Container - flat, no border/shadow, rounded bottom only */}
          <div className="bg-white rounded-b-md overflow-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position & Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holiday
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Linked User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No employees found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openProfileModal(employee)}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                    <div className="text-xs text-gray-400">{employee.team}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {employee.manager || (employees && employee.manager_id ? (employees.find(e => e.id === employee.manager_id)?.name || '-') : '-')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {(employee.startDate || employee.start_date) ? (isNaN(new Date(employee.startDate || employee.start_date).getTime()) ? '-' : new Date(employee.startDate || employee.start_date).toLocaleDateString('en-GB')) : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {employee.contract}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {Number.isFinite(employee.holidayTaken) ? employee.holidayTaken : 0}/{Number.isFinite(employee.holidayTaken) && Number.isFinite(employee.holidayRemaining) ? employee.holidayTaken + employee.holidayRemaining : 0} taken
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number.isFinite(employee.holidayRemaining) ? employee.holidayRemaining : 0} remaining
                    </div>
                    {Number.isFinite(employee.sickDays) && employee.sickDays > 0 && (
                      <div className="text-xs text-red-500">
                        {employee.sickDays} sick days
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {employee.user_id ? (
                      <span className="text-xs text-green-600">Linked
                        <button onClick={() => handleUnlinkUser(employee.id)} className="ml-2 text-red-500 underline">Unlink</button>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Not linked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openModal(employee)} className="text-purple-600 hover:text-purple-900">Edit</button>
                      <button onClick={() => openDeleteModal(employee.id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <OrgChart onEmployeeClick={openProfileModal} />
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg max-h-[95vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">{editingId ? 'Edit' : 'Add'} Employee</div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded" value={form.user_id || ''} onChange={e => {
                const selectedUser = users.find(u => u.id === e.target.value);
                setForm(f => ({
                  ...f,
                  user_id: e.target.value || null,
                  name: (!f.name && selectedUser) ? (selectedUser.first_name + ' ' + selectedUser.last_name || selectedUser.email || '') : f.name,
                  email: (!f.email && selectedUser) ? selectedUser.email : f.email
                }));
              }}>
                <option value="">No Linked User</option>
                {form.user_id && !users.find(u => u.id === form.user_id) && (
                  <option value={form.user_id} disabled>
                    {form.email || form.user_id} (not in user list)
                  </option>
                )}
                {users.map(u => {
                  const label = (u.first_name || u.last_name) ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : (u.email || `Unknown User (${u.id})`);
                  return <option key={u.id} value={u.id}>{label}</option>;
                })}
              </select>
              <input className="w-full px-3 py-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" placeholder="Position" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Department" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
              <select className="w-full px-3 py-2 border rounded" value={form.manager_id || ''} onChange={e => setForm(f => ({ ...f, manager_id: e.target.value ? Number(e.target.value) : null }))}>
                <option value="">No Manager</option>
                {employees.filter(e => !editingId || e.id !== editingId).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              <input className="w-full px-3 py-2 border rounded" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Contract Type" value={form.contract_type} onChange={e => setForm(f => ({ ...f, contract_type: e.target.value }))} />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Profile" value={form.profile} onChange={e => setForm(f => ({ ...f, profile: e.target.value }))} />
              
              {/* Leave Balance Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Initial Leave Balances</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Holiday (days)</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={leaveBalances.holiday || 0} 
                      onChange={e => setLeaveBalances(lb => ({ 
                        ...lb, 
                        holiday: parseInt(e.target.value) || 0
                      }))} 
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Sick Leave (days)</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={leaveBalances.sick || 0} 
                      onChange={e => setLeaveBalances(lb => ({ 
                        ...lb, 
                        sick: parseInt(e.target.value) || 0
                      }))} 
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Unpaid Leave (days)</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={leaveBalances.unpaid || 0} 
                      onChange={e => setLeaveBalances(lb => ({ 
                        ...lb, 
                        unpaid: parseInt(e.target.value) || 0
                      }))} 
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Parental Leave (days)</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={leaveBalances.parental || 0} 
                      onChange={e => setLeaveBalances(lb => ({ 
                        ...lb, 
                        parental: parseInt(e.target.value) || 0
                      }))} 
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">Delete Employee</div>
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p>Are you sure you want to delete this employee?</p>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={saving} className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">{saving ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
      {profileModalOpen && profileEmployee && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-40" onClick={() => setProfileModalOpen(false)} />
          <div className={`relative h-full w-2/3 max-w-3xl bg-white shadow-2xl p-0 flex flex-col transform transition-transform duration-1000 ease-in-out ${profileModalOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ right: 0 }}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl z-10" onClick={() => setProfileModalOpen(false)}>&times;</button>
            <div className="p-0 overflow-y-auto h-full">
              {/* Header */}
              <div className="flex items-center bg-gray-50 border-b border-gray-200 px-8 py-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-blue-100 mr-6" style={{ color: '#2563eb', background: '#e0e7ff' }}>
                  {profileEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{profileEmployee.name}</span>
                  <span className="text-gray-700 text-lg font-medium">{profileEmployee.position || '-'}</span>
                  <span className="text-gray-500 text-base">{profileEmployee.department || '-'}</span>
                  <span className="text-gray-500 text-base">{profileEmployee.email}</span>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-white px-8">
                <button className="px-4 py-3 -mb-px border-b-2 border-purple-600 text-purple-700 font-semibold focus:outline-none">Employee Information</button>
                <button className="px-4 py-3 text-gray-400 cursor-not-allowed">Phone Numbers</button>
                <button className="px-4 py-3 text-gray-400 cursor-not-allowed">Payroll Data</button>
                <button className="px-4 py-3 text-gray-400 cursor-not-allowed">Pay Method</button>
                <button className="px-4 py-3 text-gray-400 cursor-not-allowed">Notes</button>
              </div>
              {/* Info grid */}
              <div className="px-8 py-8 bg-white">
                {!profileEdit ? (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Position</div>
                      <div className="text-gray-900 font-medium">{profileEmployee.position || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Department</div>
                      <div className="text-gray-900 font-medium">{profileEmployee.department || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Manager</div>
                      <div className="text-gray-900 font-medium">{employees.find(e => e.id === profileEmployee.manager_id)?.name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Contract Type</div>
                      <div className="text-gray-900 font-medium">{profileEmployee.contract_type || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Start Date</div>
                      <div className="text-gray-900 font-medium">{profileEmployee.start_date || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Email</div>
                      <div className="text-gray-900 font-medium">{profileEmployee.email}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-400 font-semibold mb-1">About</div>
                      <div className="text-gray-700 whitespace-pre-line min-h-[48px]">{profileEmployee.profile || <span className="text-gray-400">No profile info yet.</span>}</div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); handleProfileSave(); }} className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <input className="w-full px-3 py-2 border rounded" placeholder="Name" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} required />
                    <input className="w-full px-3 py-2 border rounded" placeholder="Email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} required />
                    <input className="w-full px-3 py-2 border rounded" placeholder="Position" value={profileForm.position} onChange={e => setProfileForm(f => ({ ...f, position: e.target.value }))} />
                    <input className="w-full px-3 py-2 border rounded" placeholder="Department" value={profileForm.department} onChange={e => setProfileForm(f => ({ ...f, department: e.target.value }))} />
                    <select className="w-full px-3 py-2 border rounded" value={profileForm.manager_id || ''} onChange={e => setProfileForm(f => ({ ...f, manager_id: e.target.value ? Number(e.target.value) : null }))}>
                      <option value="">No Manager</option>
                      {employees.filter(e => e.id !== profileEmployee.id).map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                    <input className="w-full px-3 py-2 border rounded" type="date" value={profileForm.start_date} onChange={e => setProfileForm(f => ({ ...f, start_date: e.target.value }))} />
                    <input className="w-full px-3 py-2 border rounded" placeholder="Contract Type" value={profileForm.contract_type} onChange={e => setProfileForm(f => ({ ...f, contract_type: e.target.value }))} />
                    <textarea className="w-full px-3 py-2 border rounded" placeholder="Profile" value={profileForm.profile} onChange={e => setProfileForm(f => ({ ...f, profile: e.target.value }))} />
                  </form>
                )}
              </div>
              {/* Holidays section */}
              <div className="px-8 pb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Holiday Requests</h3>
                <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Start</th>
                      <th className="px-3 py-2 text-left">End</th>
                      <th className="px-3 py-2 text-left">Days</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileHolidays.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-4">No holiday requests</td></tr>
                    )}
                    {profileHolidays.map(h => (
                      <tr key={h.id} className={h.status === 'pending' ? 'bg-yellow-50' : h.status === 'approved' ? 'bg-green-50' : 'bg-red-50'}>
                        <td className="px-3 py-2">{h.start_date}</td>
                        <td className="px-3 py-2">{h.end_date}</td>
                        <td className="px-3 py-2">{h.days}</td>
                        <td className="px-3 py-2 capitalize">{h.status}</td>
                        <td className="px-3 py-2">{h.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees; 