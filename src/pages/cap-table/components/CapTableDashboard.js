import React from 'react';
import Card from '../../../components/common/layout/Card';
import OwnershipSummary from './ownership/OwnershipSummary';
import ShareholderTable from './shareholders/ShareholderTable';
import OwnershipVisualization from './visualization/OwnershipVisualization';
import QuickActions from './QuickActions';

const CapTableDashboard = ({ capTable, rounds, shareholders, onRefresh, onAddShareholder, onAddRound, onViewScenarios }) => {
  return (
    <div className="space-y-6 w-full">
      <Card>
        <OwnershipSummary capTable={capTable} shareholders={shareholders} />
      </Card>
      <Card>
        <ShareholderTable 
          shareholders={shareholders}
          onRefresh={onRefresh}
        />
      </Card>
      <Card>
        <OwnershipVisualization capTable={capTable} shareholders={shareholders} />
      </Card>
      <QuickActions 
        onAddShareholder={onAddShareholder}
        onAddRound={onAddRound}
        onViewScenarios={onViewScenarios}
      />
    </div>
  );
};

export default CapTableDashboard; 