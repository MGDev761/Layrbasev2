import React from 'react';
import Employees from './components/Employees';
import TimeManager from './components/TimeManager';
import CompanyPolicies from './components/CompanyPolicies';

const HR = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'employees':
        return <Employees />;
      case 'time':
        return <TimeManager />;
      case 'policies':
        return <CompanyPolicies />;
      default:
        return <Employees />;
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

export default HR; 