import React, { useState } from 'react';
import { DocumentMagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/20/solid';

const mockListings = [
  { id: 1, name: 'Innovate Inc.', field: 'Technology & AI', description: 'Cutting-edge AI solutions for startups and scale-ups.', category: 'Tech', country: 'USA', location: 'San Francisco, CA' },
  { id: 2, name: 'Design Co.', field: 'Creative Design', description: 'Creative branding and design services that help businesses stand out.', category: 'Design', country: 'USA', location: 'New York, NY' },
  { id: 3, name: 'Legal Eagles', field: 'Legal Services', description: 'Affordable legal services for startups and small businesses.', category: 'Legal', country: 'USA', location: 'Austin, TX' },
  { id: 4, name: 'Number Crunchers', field: 'Financial Services', description: 'Accounting and financial consulting for growing businesses.', category: 'Finance', country: 'USA', location: 'Chicago, IL' },
  { id: 5, name: 'Growth Hackers', field: 'Digital Marketing', description: 'Marketing services for fast growth.', category: 'Marketing', country: 'USA', location: 'Los Angeles, CA' },
  { id: 6, name: 'Cloud Solutions Pro', field: 'Cloud Infrastructure', description: 'Cloud infrastructure and DevOps services for modern businesses.', category: 'Tech', country: 'USA', location: 'Seattle, WA' },
  { id: 7, name: 'Euro Legal', field: 'Legal Services', description: 'Legal support for European startups.', category: 'Legal', country: 'UK', location: 'London, UK' },
  { id: 8, name: 'Berlin Design', field: 'Creative Design', description: 'Branding and design for EU companies.', category: 'Design', country: 'Germany', location: 'Berlin, Germany' },
];

const colorPalette = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
  'bg-red-100 text-red-700',
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const industries = ['Tech', 'Design', 'Legal', 'Finance', 'Marketing'];
const industriesAll = ['All', ...industries];
const countries = ['All', 'USA', 'UK', 'Germany'];

const ListingCard = ({ listing, colorIdx }) => (
  <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 flex flex-col space-y-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${colorPalette[colorIdx % colorPalette.length]}`}> 
        {getInitials(listing.name)}
      </div>
      <div>
        <div className="font-semibold text-gray-900 text-base">{listing.name}</div>
        <div className="flex items-center text-gray-500 text-sm mt-0.5">
          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
          {listing.location}
        </div>
      </div>
    </div>
    <div className="text-gray-700 text-sm leading-relaxed border-b border-gray-100 pb-4">{listing.description}</div>
    <div className="pt-2 text-xs text-gray-500 font-medium">{listing.field}</div>
    <div className="pt-2">
      <button className="px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors">View Details</button>
    </div>
  </div>
);

const MarketplaceListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch =
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.field.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || listing.category === selectedIndustry;
    const matchesCountry = selectedCountry === 'All' || listing.country === selectedCountry;
    return matchesSearch && matchesIndustry && matchesCountry;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 gap-3">
        <select
          value={selectedIndustry}
          onChange={e => setSelectedIndustry(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full md:w-56 lg:w-64"
        >
          {industriesAll.map(ind => (
            <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
          ))}
        </select>
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full md:w-56 lg:w-64"
        >
          {countries.map(c => (
            <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
          ))}
        </select>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search businesses, services, or expertise..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <DocumentMagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredListings.length} of {mockListings.length} businesses
        </p>
      </div>
      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredListings.map((listing, idx) => (
          <ListingCard key={listing.id} listing={listing} colorIdx={idx} />
        ))}
      </div>
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentMagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No businesses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceListings; 