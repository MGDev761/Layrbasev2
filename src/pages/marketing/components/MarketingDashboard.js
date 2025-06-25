import React from 'react';
import Card from '../../../components/common/layout/Card';
import MarketingMetrics from './MarketingMetrics';
import ActiveCampaigns from './ActiveCampaigns';
import MarketingTools from './MarketingTools';
import QuickActions from './QuickActions';

const MarketingDashboard = () => {
  return (
    <div className="space-y-6">
      <MarketingMetrics />
      <Card>
        <ActiveCampaigns />
      </Card>
      <MarketingTools />
      <QuickActions />
    </div>
  );
};

export default MarketingDashboard; 