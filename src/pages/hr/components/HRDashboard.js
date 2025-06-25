import React from 'react';
import Card from '../../../components/common/layout/Card';
import HRMetrics from './HRMetrics';
import RecentHires from './RecentHires';
import HRTools from './HRTools';
import PendingRequests from './PendingRequests';
import QuickActions from './QuickActions';

const HRDashboard = () => {
  return (
    <div className="space-y-6">
      <HRMetrics />
      <Card>
        <RecentHires />
      </Card>
      <HRTools />
      <Card>
        <PendingRequests />
      </Card>
      <QuickActions />
    </div>
  );
};

export default HRDashboard; 