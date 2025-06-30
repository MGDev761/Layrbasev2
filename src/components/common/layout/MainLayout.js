import React, { useState } from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';
import PageHeader from './PageHeader';
import CreateOrganization from '../../organizations/CreateOrganization';
import JoinOrganization from '../../organizations/JoinOrganization';

const MainLayout = ({ 
  children, 
  tabs, 
  activeTab, 
  subTabs, 
  activeSubTab, 
  showSideNav = true,
  title,
  subtitle
}) => {
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showJoinOrg, setShowJoinOrg] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const handleOrganizationCreated = (organization) => {
    setShowCreateOrg(false);
    setShowJoinOrg(false);
    // The AuthContext will handle updating the current organization
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNav 
        notificationModalOpen={notificationModalOpen}
        setNotificationModalOpen={setNotificationModalOpen}
      />
      
      <div className="flex flex-1">
        {showSideNav && tabs && (
          <SideNav 
            tabs={tabs}
            activeTab={activeTab}
            subTabs={subTabs}
            activeSubTab={activeSubTab}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            <div className="pt-8 pb-8 px-4 sm:px-6 lg:px-8">
              {title && <PageHeader title={title} subtitle={subtitle} />}
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>

      {/* Organization Modals */}
      {showCreateOrg && (
        <CreateOrganization
          onSuccess={handleOrganizationCreated}
          onCancel={() => setShowCreateOrg(false)}
        />
      )}
      {showJoinOrg && (
        <JoinOrganization
          onSuccess={handleOrganizationCreated}
          onCancel={() => setShowJoinOrg(false)}
        />
      )}
    </div>
  );
};

export default MainLayout; 