import React from 'react';
import MarketingCalendar from './components/events/EventsCalendar';
import BrandAssets from './components/brand/BrandAssets';
import SalesCollateral from './components/SalesCollateral';
import ContentTracker from './components/content/ContentTracker';

const Marketing = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'events':
        return <MarketingCalendar />;
      case 'brand':
        return <BrandAssets />;
      case 'sales':
        return <SalesCollateral />;
      case 'content':
        return <ContentTracker />;
      default:
        return <MarketingCalendar />;
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

export default Marketing; 