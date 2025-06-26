import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/common/layout/MainLayout';
import Auth from './pages/Auth';
import AuthError from './pages/AuthError';
import OrganizationSelection from './components/organizations/OrganizationSelection';

const ProtectedLayout = () => {
  const location = useLocation();
  const { user, loading, currentOrganization, authError } = useAuth();

  // Parse current route to determine active tab and sub-tab
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeTab = pathSegments[0] || 'dashboard';
  const activeSubTab = pathSegments[1] || null;

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

  if (authError) {
    return <AuthError error={authError} />;
  }

  if (!user) {
    return <Auth />;
  }

  if (!currentOrganization) {
    return <OrganizationSelection onOrganizationCreated={() => {}} />;
  }

  return (
    <MainLayout
      tabs={tabs}
      activeTab={activeTab}
      activeSubTab={activeSubTab}
      showSideNav={activeTab !== 'marketplace'}
      title={activeTab === 'sales' && activeSubTab === 'customers' ? 'Companies & Contacts' : undefined}
      subtitle={activeTab === 'sales' && activeSubTab === 'customers' ? 'Manage your companies and contacts in one place.' : undefined}
    >
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedLayout; 