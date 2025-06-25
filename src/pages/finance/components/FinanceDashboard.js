import React from 'react';
import Card from '../../../components/common/layout/Card';
import OverviewCards from './OverviewCards';
import RecentTransactions from './RecentTransactions';

const FinanceDashboard = () => {
  return (
    <div className="space-y-6">
      <OverviewCards />
      <Card>
        <RecentTransactions />
      </Card>
    </div>
  );
};

export default FinanceDashboard; 