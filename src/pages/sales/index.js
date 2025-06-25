import React from 'react';
import CrmDashboard from './components/crm/CrmDashboard';
import CompaniesList from './components/crm/CompaniesList';
import ContactsList from './components/crm/ContactsList';
import PipelineManagement from './components/PipelineManagement';
import SalesReports from './components/SalesReports';
import MainLayout from '../../components/common/layout/MainLayout';

const Sales = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'crm':
        return <CrmDashboard onSection={onSubTabChange} />;
      case 'contacts':
        return <CompaniesList />;
      case 'pipeline':
        return <PipelineManagement />;
      case 'reports':
        return <SalesReports />;
      default:
        return <CrmDashboard onSection={onSubTabChange} />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Sales; 