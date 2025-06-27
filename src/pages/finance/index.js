import React from 'react';
import Overview from './components/Overview';
import Invoices from './components/invoices/Invoices';
import CashFlow from './components/cashflow/CashFlow';
import BudgetLanding from './BudgetLanding';

const Finance = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return <Overview />;
      case 'budget':
        return <BudgetLanding />;
      case 'cashflow':
        return <CashFlow />;
      case 'invoicing':
        return <Invoices />;
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