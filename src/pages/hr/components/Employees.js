import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee, linkUserToEmployee, unlinkUserFromEmployee, fetchEmployeeByUserId } from '../../../services/employeesService';
import { fetchHolidays } from '../../../services/holidaysService';
import { createLeaveBalances, fetchLeaveBalances, updateLeaveBalance } from '../../../services/leaveService';
import { supabase } from '../../../lib/supabase';
import Card from '../../../components/common/layout/Card';
import OrgChart from './layout/OrgChart';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import '../../../styles/thinPurpleScrollbar.css';

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
  const [unlinkModal, setUnlinkModal] = useState({ open: false, employee: null });
  const [profileTab, setProfileTab] = useState('details');
  const [holidayAllowance, setHolidayAllowance] = useState(0);
  const [holidayUsed, setHolidayUsed] = useState(0);
  const [holidayBalanceId, setHolidayBalanceId] = useState(null);
  const modalScrollRef = React.useRef();

  React.useEffect(() => {
    if (modalOpen && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [modalOpen]);

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
    setProfileTab('details');
    setProfileModalOpen(true);
    
    // Load all profile data
    loadProfileHolidays(emp);
    loadProfileTeam(emp);
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

  // Fetch holiday leave balance when profile modal opens or employee changes
  useEffect(() => {
    if (!profileModalOpen || !profileEmployee || !currentOrganization) return;
    const fetchHolidayBalance = async () => {
      try {
        const balances = await fetchLeaveBalances(currentOrganization.organization_id, profileEmployee.id);
        const currentYear = new Date().getFullYear();
        const holiday = balances.find(b => b.type === 'holiday' && b.year === currentYear);
        if (holiday) {
          setHolidayAllowance(Number(holiday.balance));
          setHolidayUsed(Number(holiday.used));
          setHolidayBalanceId(holiday.id);
        } else {
          setHolidayAllowance(0);
          setHolidayUsed(0);
          setHolidayBalanceId(null);
        }
      } catch (err) {
        setHolidayAllowance(0);
        setHolidayUsed(0);
        setHolidayBalanceId(null);
      }
    };
    fetchHolidayBalance();
  }, [profileModalOpen, profileEmployee, currentOrganization]);

  // Handler for updating holiday allowance
  const handleHolidayAllowanceChange = async (val) => {
    setHolidayAllowance(val);
    const currentYear = new Date().getFullYear();
    if (!profileEmployee || !currentOrganization) return;
    try {
      if (holidayBalanceId) {
        await updateLeaveBalance(holidayBalanceId, { balance: val });
      } else {
        await createLeaveBalances(currentOrganization.organization_id, profileEmployee.id, [{ type: 'holiday', balance: val }]);
      }
    } catch (err) {
      // Optionally show error
    }
  };

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-2">Manage your organization's team members, roles, and organizational structure.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors shadow-sm"
          >
            <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
            Help & Tips
          </button>
          <button 
            onClick={() => openModal()} 
            className="inline-flex items-center px-6 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Linked Users</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.user_id).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{[...new Set(employees.map(e => e.department).filter(Boolean))].length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">{employees.filter(e => e.start_date && new Date(e.start_date) > new Date(new Date().getFullYear(), new Date().getMonth(), 1)).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setView('table')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              view === 'table'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Table View</span>
          </button>
          <button
            onClick={() => setView('orgchart')}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              view === 'orgchart'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Organization Chart</span>
          </button>
        </nav>
      </div>

      {view === 'table' ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header with Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
              <div className="flex items-center space-x-3">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>All Departments</option>
                  {[...new Set(employees.map(e => e.department).filter(Boolean))].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <div className="text-sm text-gray-500">
                  {filteredEmployees.length} of {employees.length} employees
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="ml-4">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 bg-gray-200 rounded w-8"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {searchTerm ? 'No employees found' : 'No employees yet'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm 
                            ? 'Try adjusting your search terms.' 
                            : 'Get started by adding your first employee.'
                          }
                        </p>
                        {!searchTerm && (
                          <div className="mt-6">
                            <button
                              onClick={() => openModal()}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Add Employee
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openProfileModal(employee)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{employee.position || 'No position'}</div>
                        <div className="text-sm text-gray-500">{employee.department || 'No department'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.manager_id 
                            ? employees.find(e => e.id === employee.manager_id)?.name || 'Unknown'
                            : 'No manager'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.start_date 
                            ? new Date(employee.start_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'Not set'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {employee.user_id ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
                              Pending Setup
                            </span>
                          )}
                          {employee.contract_type && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {employee.contract_type}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(employee);
                            }}
                            className="text-purple-600 hover:text-purple-900 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(employee.id);
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <OrgChart onEmployeeClick={openProfileModal} />
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Employee' : 'Add New Employee'}
                  </h2>
                  <p className="text-purple-100 text-sm">
                    {editingId ? 'Update employee information' : 'Create a new employee profile'}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6" ref={modalScrollRef}>
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Account Linking Section */}
                {!editingId && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-blue-900 mb-1">Link to User Account</h3>
                        <p className="text-sm text-blue-700 mb-3">Connect this employee to an existing user account for system access.</p>
                        <select 
                          className="w-full px-3 py-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={form.user_id || ''} 
                          onChange={e => {
                            const selectedUser = users.find(u => u.id === e.target.value);
                            setForm(f => ({
                              ...f,
                              user_id: e.target.value || null,
                              name: (!f.name && selectedUser) ? (selectedUser.first_name + ' ' + selectedUser.last_name || selectedUser.email || '') : f.name,
                              email: (!f.email && selectedUser) ? selectedUser.email : f.email
                            }));
                          }}
                        >
                          <option value="">Create employee without user account</option>
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
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-name-input">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        id="employee-name-input" 
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        placeholder="Enter employee's full name"
                        value={form.name || ''} 
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-email-input">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        id="employee-email-input" 
                        type="email"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        placeholder="employee@company.com"
                        value={form.email || ''} 
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-position-input">
                        Job Title
                      </label>
                      <input 
                        id="employee-position-input" 
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        placeholder="e.g. Software Engineer, Marketing Manager"
                        value={form.position || ''} 
                        onChange={e => setForm(f => ({ ...f, position: e.target.value }))} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-department-input">
                        Department
                      </label>
                      <input 
                        id="employee-department-input" 
                        type="text"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        placeholder="e.g. Engineering, Marketing, Sales"
                        value={form.department || ''} 
                        onChange={e => setForm(f => ({ ...f, department: e.target.value }))} 
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Employment Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-manager-input">
                        Reporting Manager
                      </label>
                      <select 
                        id="employee-manager-input" 
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        value={form.manager_id || ''} 
                        onChange={e => setForm(f => ({ ...f, manager_id: e.target.value ? Number(e.target.value) : null }))}
                      >
                        <option value="">No direct manager</option>
                        {employees.filter(e => !editingId || e.id !== editingId).map(e => (
                          <option key={e.id} value={e.id}>{e.name} - {e.position}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="start-date-input">
                        Start Date
                      </label>
                      <input 
                        id="start-date-input" 
                        type="date"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        value={form.start_date || ''} 
                        onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-contract-input">
                        Contract Type
                      </label>
                      <select 
                        id="employee-contract-input" 
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
                        value={form.contract_type || ''} 
                        onChange={e => setForm(f => ({ ...f, contract_type: e.target.value }))}
                      >
                        <option value="">Select contract type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="employee-profile-input">
                      About Employee
                    </label>
                    <textarea 
                      id="employee-profile-input" 
                      rows="3"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none" 
                      placeholder="Brief description of the employee's background, skills, or any relevant information..."
                      value={form.profile || ''} 
                      onChange={e => setForm(f => ({ ...f, profile: e.target.value }))} 
                    />
                  </div>
                </div>

                {/* Leave Balances */}
                {!editingId && (
                  <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Initial Leave Balances</h3>
                    <p className="text-sm text-gray-600 mb-4">Set up the employee's annual leave entitlements</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                          <label className="block text-sm font-medium text-emerald-900">Holiday</label>
                        </div>
                        <input 
                          type="number" 
                          min="0" 
                          max="365"
                          value={leaveBalances.holiday || 0} 
                          onChange={e => setLeaveBalances(lb => ({ 
                            ...lb, 
                            holiday: parseInt(e.target.value) || 0
                          }))} 
                          className="w-full px-3 py-2 text-base font-semibold border border-emerald-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <p className="text-xs text-emerald-700 mt-1">Annual vacation days</p>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                          <label className="block text-sm font-medium text-amber-900">Sick Leave</label>
                        </div>
                        <input 
                          type="number" 
                          min="0" 
                          max="365"
                          value={leaveBalances.sick || 0} 
                          onChange={e => setLeaveBalances(lb => ({ 
                            ...lb, 
                            sick: parseInt(e.target.value) || 0
                          }))} 
                          className="w-full px-3 py-2 text-base font-semibold border border-amber-300 rounded-md bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <p className="text-xs text-amber-700 mt-1">Annual sick days</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-slate-500 rounded-full"></div>
                          <label className="block text-sm font-medium text-slate-900">Unpaid</label>
                        </div>
                        <input 
                          type="number" 
                          min="0" 
                          max="365"
                          value={leaveBalances.unpaid || 0} 
                          onChange={e => setLeaveBalances(lb => ({ 
                            ...lb, 
                            unpaid: parseInt(e.target.value) || 0
                          }))} 
                          className="w-full px-3 py-2 text-base font-semibold border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                        />
                        <p className="text-xs text-slate-700 mt-1">Unpaid leave days</p>
                      </div>

                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                          <label className="block text-sm font-medium text-pink-900">Parental</label>
                        </div>
                        <input 
                          type="number" 
                          min="0" 
                          max="365"
                          value={leaveBalances.parental || 0} 
                          onChange={e => setLeaveBalances(lb => ({ 
                            ...lb, 
                            parental: parseInt(e.target.value) || 0
                          }))} 
                          className="w-full px-3 py-2 text-base font-semibold border border-pink-300 rounded-md bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                        <p className="text-xs text-pink-700 mt-1">Maternity/paternity days</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={saving || !form.name || !form.email} 
                  className="px-8 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Employee' : 'Create Employee'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
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

      {/* Profile Side Drawer */}
      {profileModalOpen && profileEmployee && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setProfileModalOpen(false)} />
          <div className={`relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col transform transition-all duration-300 ease-out ${profileModalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {profileEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{profileEmployee.name}</h2>
                  <p className="text-purple-100 text-lg">{profileEmployee.position || 'No position set'}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-purple-200 text-sm">{profileEmployee.department || 'No department'}</span>
                    {profileEmployee.user_id ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                        Linked
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
                        Not Linked
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-6">
                {!profileEmployee.user_id && (
                  <button className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white text-sm font-medium rounded-lg hover:bg-opacity-30 transition-all">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Link User
                  </button>
                )}
                <button
                  onClick={() => setProfileEdit(!profileEdit)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    profileEdit 
                      ? 'bg-white text-purple-600 hover:bg-gray-50' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  {profileEdit ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </>
                  )}
                </button>
                {profileEdit && (
                  <button
                    onClick={handleProfileSave}
                    className="inline-flex items-center px-4 py-2 bg-white text-purple-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-white">
              <nav className="flex px-6" aria-label="Tabs">
                {[
                  { id: 'details', label: 'Details', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { id: 'timeoff', label: 'Time Off', icon: 'M8 7V3a1 1 0 012 0v4h4V3a1 1 0 012 0v4h1a2 2 0 012 2v1h-1V9h-1v1H10V9H9v1H8V9a2 2 0 012-2h1z' },
                  { id: 'activity', label: 'Activity', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 mr-8 border-b-2 font-medium text-sm transition-colors ${
                      profileTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {profileTab === 'details' && (
                <div className="p-6">
                  {!profileEdit ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Email</dt>
                              <dd className="text-sm text-gray-600">{profileEmployee.email || 'Not specified'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Position</dt>
                              <dd className="text-sm text-gray-600">{profileEmployee.position || 'Not specified'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Department</dt>
                              <dd className="text-sm text-gray-600">{profileEmployee.department || 'Not specified'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Manager</dt>
                              <dd className="text-sm text-gray-600">{employees.find(e => e.id === profileEmployee.manager_id)?.name || 'No manager assigned'}</dd>
                            </div>
                          </dl>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 mb-4">Employment Details</h3>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Contract Type</dt>
                              <dd className="text-sm text-gray-600">{profileEmployee.contract_type || 'Not specified'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Start Date</dt>
                              <dd className="text-sm text-gray-600">{profileEmployee.start_date ? new Date(profileEmployee.start_date).toLocaleDateString() : 'Not specified'}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Employee ID</dt>
                              <dd className="text-sm text-gray-600">#{profileEmployee.id}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-900">Account Status</dt>
                              <dd className="text-sm text-gray-600">
                                {profileEmployee.user_id ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active & Linked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending Setup
                                  </span>
                                )}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      {/* Direct Reports */}
                      {profileTeam.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 mb-4">Direct Reports ({profileTeam.length})</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {profileTeam.map(member => (
                              <div key={member.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-xs font-medium text-purple-700">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                  <p className="text-xs text-gray-500">{member.position}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* About Section */}
                      {profileEmployee.profile && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h3 className="text-sm font-medium text-gray-500 mb-4">About</h3>
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {profileEmployee.profile}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Employee Details</h3>
                      <form onSubmit={e => { e.preventDefault(); handleProfileSave(); }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                            <input 
                              type="text"
                              value={profileForm.name || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input 
                              type="email"
                              value={profileForm.email || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              required 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <input 
                              type="text"
                              value={profileForm.position || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, position: e.target.value }))} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <input 
                              type="text"
                              value={profileForm.department || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, department: e.target.value }))} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                            <select 
                              value={profileForm.manager_id || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, manager_id: e.target.value ? Number(e.target.value) : null }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                              <option value="">No Manager</option>
                              {employees.filter(e => e.id !== profileEmployee.id).map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                            <input 
                              type="text"
                              value={profileForm.contract_type || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, contract_type: e.target.value }))} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input 
                              type="date"
                              value={profileForm.start_date || ''} 
                              onChange={e => setProfileForm(f => ({ ...f, start_date: e.target.value }))} 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                          <textarea 
                            rows="4"
                            value={profileForm.profile || ''} 
                            onChange={e => setProfileForm(f => ({ ...f, profile: e.target.value }))} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Tell us about this employee..."
                          />
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {profileTab === 'timeoff' && (
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4h4V3a1 1 0 012 0v4h1a2 2 0 012 2v1h-1V9h-1v1H10V9H9v1H8V9a2 2 0 012-2h1z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Days Taken</p>
                            <p className="text-2xl font-bold text-gray-900">{holidayUsed}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Days Remaining</p>
                            <p className="text-2xl font-bold text-gray-900">{holidayAllowance - holidayUsed}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time Off History */}
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Time Off History</h3>
                      </div>
                      <div className="overflow-hidden">
                        {profileHolidays.length === 0 ? (
                          <div className="px-6 py-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 012 0v4h4V3a1 1 0 012 0v4h1a2 2 0 012 2v1h-1V9h-1v1H10V9H9v1H8V9a2 2 0 012-2h1z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No time off requests</h3>
                            <p className="mt-1 text-sm text-gray-500">This employee hasn't submitted any time off requests yet.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {profileHolidays.map(holiday => (
                                  <tr key={holiday.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {new Date(holiday.start_date).toLocaleDateString()} - {new Date(holiday.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <span className="capitalize">{holiday.type || 'holiday'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{holiday.days}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        holiday.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        holiday.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        {holiday.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{holiday.reason || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'activity' && (
                <div className="p-6">
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                      {profileActivity.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No activity yet</h3>
                          <p className="mt-1 text-sm text-gray-500">Activity will appear here as this employee interacts with the system.</p>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul className="-mb-8">
                            {profileActivity.map((activity, activityIdx) => (
                              <li key={activityIdx}>
                                <div className="relative pb-8">
                                  {activityIdx !== profileActivity.length - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                  ) : null}
                                  <div className="relative flex space-x-3">
                                    <div>
                                      <span className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                      <div>
                                        <p className="text-sm text-gray-900">{activity.desc}</p>
                                      </div>
                                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                        {formatDate(activity.date)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'settings' && (
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Holiday Allowance */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">Holiday Allowance</h3>
                          <p className="text-sm text-gray-500 mt-1">Set the annual paid holiday allowance for this employee.</p>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="number" 
                              min="0" 
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right" 
                              value={holidayAllowance} 
                              onChange={e => handleHolidayAllowanceChange(Number(e.target.value))} 
                            />
                            <span className="text-sm text-gray-500">days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                      <div className="space-y-4">
                        {profileEmployee.user_id && (
                          <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                            <div>
                              <h4 className="text-sm font-medium text-blue-900">Unlink User Account</h4>
                              <p className="text-sm text-blue-700">Remove the connection between this employee and their user account.</p>
                            </div>
                            <button 
                              onClick={() => setUnlinkModal({ open: true, employee: profileEmployee })}
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Unlink
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                          <div>
                            <h4 className="text-sm font-medium text-yellow-900">Edit Employee</h4>
                            <p className="text-sm text-yellow-700">Modify this employee's basic information and details.</p>
                          </div>
                          <button 
                            onClick={() => openModal(profileEmployee)}
                            className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-red-200">
                      <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-red-900">Delete Employee</h4>
                            <p className="text-sm text-red-700 mt-1">Permanently delete this employee and all associated data. This action cannot be undone.</p>
                          </div>
                          <button
                            onClick={() => { 
                              setDeleteId(profileEmployee.id); 
                              setDeleteModalOpen(true);
                              setProfileModalOpen(false);
                            }}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Delete Employee
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unlink Modal */}
      {unlinkModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">Unlink User</div>
              <button type="button" onClick={() => setUnlinkModal({ open: false, employee: null })} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <p>Are you sure you want to unlink this user from <b>{unlinkModal.employee?.name}</b>?</p>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={() => setUnlinkModal({ open: false, employee: null })} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={async () => { await handleUnlinkUser(unlinkModal.employee.id); setUnlinkModal({ open: false, employee: null }); }} className="px-4 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700">Unlink</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };

export default Employees; 