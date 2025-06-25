import React from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';
import PageHeader from './PageHeader';

const MainLayout = ({ 
  children, 
  tabs, 
  activeTab, 
  onTabChange, 
  subTabs, 
  activeSubTab, 
  onSubTabChange, 
  showSideNav = true,
  onCreateOrganization,
  onJoinOrganization,
  title,
  subtitle,
  notificationModalOpen,
  setNotificationModalOpen
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav 
        onTabChange={onTabChange} 
        onCreateOrganization={onCreateOrganization}
        onJoinOrganization={onJoinOrganization}
        notificationModalOpen={notificationModalOpen}
        setNotificationModalOpen={setNotificationModalOpen}
      />
      
      <div className="flex flex-1">
        {showSideNav && tabs && (
          <SideNav 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            subTabs={subTabs}
            activeSubTab={activeSubTab}
            onSubTabChange={onSubTabChange}
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
    </div>
  );
};

export default MainLayout; 