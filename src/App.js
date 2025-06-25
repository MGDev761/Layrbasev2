import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './components/common/layout/MainLayout';
import Auth from './pages/Auth';
import AuthError from './pages/AuthError';
import Dashboard from './pages/Dashboard/Dashboard.old';
import CompanySetup from './pages/company-setup';
import Finance from './pages/finance';
import Legal from './pages/legal';
import CapTable from './pages/cap-table';
import Marketing from './pages/marketing';
import Sales from './pages/sales';
import HR from './pages/hr';
import Marketplace from './pages/marketplace';
import OrganizationSelection from './components/organizations/OrganizationSelection';
import CreateOrganization from './components/organizations/CreateOrganization';
import JoinOrganization from './components/organizations/JoinOrganization';
import MyOrganizations from './pages/organizations/MyOrganizations';
import JoinOrganizationPage from './pages/JoinOrganization';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showJoinOrg, setShowJoinOrg] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const { user, loading, currentOrganization, authError } = useAuth();

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'company', name: 'Company Setup', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'finance', name: 'Finance', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
    { id: 'legal', name: 'Legal & Compliance', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'captable', name: 'Cap Table', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'marketing', name: 'Marketing', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
    { id: 'sales', name: 'Sales CRM', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'hr', name: 'HR', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const pageTitles = {
    dashboard: 'Dashboard',
    company: 'Company Setup',
    finance: 'Finance',
    legal: 'Legal & Compliance',
    sales: 'Sales CRM',
    captable: 'Cap Table',
    marketing: 'Marketing',
    hr: 'HR',
    marketplace: 'Marketplace',
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Set default sub-tab for the new section
    const defaultSubTabs = {
      company: 'foundation',
      finance: 'overview',
      legal: 'contracts',
      captable: 'overview',
      marketing: 'events',
      sales: 'crm',
      hr: 'employees',
    };
    setActiveSubTab(defaultSubTabs[tabId] || null);
  };

  const handleSubTabChange = (subTabId) => {
    setActiveSubTab(subTabId);
  };

  const handleCreateOrganization = () => {
    setShowCreateOrg(true);
  };

  const handleJoinOrganization = () => {
    setShowJoinOrg(true);
  };

  const handleOrganizationCreated = (organization) => {
    setShowCreateOrg(false);
    setShowJoinOrg(false);
    // The AuthContext will handle updating the current organization
  };

  const renderContent = () => {
    const pageContent = () => {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard notificationModalOpen={notificationModalOpen} setNotificationModalOpen={setNotificationModalOpen} />;
        case 'company':
          return <CompanySetup activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'finance':
          return <Finance activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'legal':
          return <Legal activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'sales':
          return <Sales activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'captable':
          return <CapTable activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'marketing':
          return <Marketing activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'hr':
          return <HR activeSubTab={activeSubTab} onSubTabChange={handleSubTabChange} />;
        case 'marketplace':
          return <Marketplace />;
        case 'myorgs':
          return <MyOrganizations />;
        default:
          return <Dashboard notificationModalOpen={notificationModalOpen} setNotificationModalOpen={setNotificationModalOpen} />;
      }
    };
    return (
      <div>
        {pageContent()}
      </div>
    );
  };

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // New: Handle auth initialization errors
  if (authError) {
    return <AuthError error={authError} />;
  }

  // Show auth page if not logged in
  if (!user) {
    return <Auth />;
  }

  // Show create/join organization modals
  if (showCreateOrg) {
    return (
      <CreateOrganization
        onSuccess={handleOrganizationCreated}
        onCancel={() => setShowCreateOrg(false)}
      />
    );
  }
  if (showJoinOrg) {
    return (
      <JoinOrganization
        onSuccess={handleOrganizationCreated}
        onCancel={() => setShowJoinOrg(false)}
      />
    );
  }
  
  // Show organization selection if logged in but no org is selected/available
  if (!currentOrganization) {
    return (
      <OrganizationSelection onOrganizationCreated={handleOrganizationCreated} />
    );
  }

  return (
    <MainLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      activeSubTab={activeSubTab}
      onSubTabChange={handleSubTabChange}
      showSideNav={activeTab !== 'marketplace'}
      title={activeTab === 'sales' && activeSubTab === 'customers' ? 'Companies & Contacts' : undefined}
      subtitle={activeTab === 'sales' && activeSubTab === 'customers' ? 'Manage your companies and contacts in one place.' : undefined}
      onCreateOrganization={handleCreateOrganization}
      onJoinOrganization={handleJoinOrganization}
      notificationModalOpen={notificationModalOpen}
      setNotificationModalOpen={setNotificationModalOpen}
    >
      {renderContent()}
    </MainLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/join/:token" element={<JoinOrganizationPage />} />
          <Route path="*" element={<AppContent />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 