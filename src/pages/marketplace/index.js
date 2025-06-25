import React, { useState, Fragment } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import MyListing from './components/MyListing';
import MarketplaceListings from './components/MarketplaceListings';

const Marketplace = () => {
  const [activeSubTab, setActiveSubTab] = useState('marketplace');

  return (
    <Fragment>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-6">
            <BuildingStorefrontIcon className="h-16 w-16 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketplace</h1>
            <p className="text-gray-600 text-base max-w-2xl">
              Find and connect with businesses or list your own skills. The Layrbase Marketplace is where startups, freelancers, and companies discover new partners and opportunities.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('marketplace')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              activeSubTab === 'marketplace'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveSubTab('my-listing')}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              activeSubTab === 'my-listing'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            My Listing
          </button>
        </div>
      </div>
      <div>
        {activeSubTab === 'marketplace' ? <MarketplaceListings /> : <MyListing />}
      </div>
    </Fragment>
  );
};

export default Marketplace; 