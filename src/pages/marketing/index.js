import React from 'react';
import EventsCalendar from './components/events/EventsCalendar';
import BrandAssets from './components/brand/BrandAssets';
import SalesCollateral from './components/SalesCollateral';

const Marketing = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'events':
        return <EventsCalendar />;
      case 'brand':
        return <BrandAssets />;
      case 'sales':
        return <SalesCollateral />;
      default:
        return <EventsCalendar />;
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