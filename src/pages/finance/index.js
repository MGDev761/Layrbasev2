import React from 'react';
import Budget from './components/budget/Budget';
import Overview from './components/Overview';

const Finance = ({ activeSubTab }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return <Overview />;
      case 'budget':
        return <Budget />;
      case 'invoicing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Invoicing</h3>
            <p className="text-gray-600">Invoicing content coming soon.</p>
          </div>
        );
      case 'management':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Management Accounts</h3>
            <p className="text-gray-600">Management accounts content coming soon.</p>
          </div>
        );
      default:
        return null;
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

export default Finance; 