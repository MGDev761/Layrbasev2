import React from 'react';
import Contracts from './components/Contracts';
import Templates from './components/Templates';
import ComplianceDeadlines from './components/ComplianceDeadlines';
import RiskInsurance from './components/RiskInsurance';
import LegalRequirements from './components/LegalRequirements';

const subTabs = [
  { id: 'contracts', name: 'Contracts' },
  { id: 'templates', name: 'Templates' },
  { id: 'compliance', name: 'Compliance Deadlines' },
  { id: 'risk', name: 'Risk & Insurance' },
  { id: 'requirements', name: 'Legal Requirements' },
];

const Legal = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'contracts':
        return <Contracts />;
      case 'templates':
        return <Templates />;
      case 'compliance':
        return <ComplianceDeadlines />;
      case 'risk':
        return <RiskInsurance />;
      case 'requirements':
        return <LegalRequirements />;
      default:
        return <Contracts />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export { subTabs };
export default Legal; 