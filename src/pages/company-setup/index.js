import React, { Fragment } from 'react';
import CompanyDetails from './components/details/CompanyDetails';
import FoundationDocuments from './components/foundation/FoundationDocuments';
import FinancialSetup from './components/financial/FinancialSetup';

const CompanySetup = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'foundation':
        return <FoundationDocuments />;
      case 'details':
        return <CompanyDetails />;
      case 'financial':
        return <FinancialSetup />;
      default:
        return <FoundationDocuments />;
    }
  };

  return (
    <Fragment>
      <div>
        {renderContent()}
      </div>
    </Fragment>
  );
};

export default CompanySetup; 