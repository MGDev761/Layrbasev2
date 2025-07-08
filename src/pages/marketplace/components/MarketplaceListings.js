import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  StarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ClockIcon,
  FunnelIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const mockListings = [
  { 
    id: 1, 
    name: 'Innovate Inc.', 
    field: 'AI & Machine Learning', 
    description: 'Cutting-edge AI solutions for startups and scale-ups. We help businesses implement machine learning models, automation systems, and intelligent data analytics.', 
    category: 'Tech', 
    country: 'USA', 
    location: 'San Francisco, CA',
    rating: 4.9,
    reviews: 127,
    teamSize: '11-50',
    founded: '2019',
    services: ['AI Development', 'Machine Learning', 'Data Analytics', 'Automation'],
    price: '$$$',
    verified: true,
    responseTime: '< 2 hours'
  },
  { 
    id: 2, 
    name: 'Design Studio Pro', 
    field: 'Brand & Product Design', 
    description: 'Award-winning design studio specializing in brand identity, product design, and user experience. We create memorable brands that drive growth.', 
    category: 'Design', 
    country: 'USA', 
    location: 'New York, NY',
    rating: 4.8,
    reviews: 89,
    teamSize: '6-10',
    founded: '2020',
    services: ['Brand Design', 'UX/UI', 'Product Design', 'Marketing Materials'],
    price: '$$',
    verified: true,
    responseTime: '< 4 hours'
  },
  { 
    id: 3, 
    name: 'Legal Eagles', 
    field: 'Corporate Legal Services', 
    description: 'Comprehensive legal services for startups and growing businesses. From incorporation to contract negotiations and intellectual property protection.', 
    category: 'Legal', 
    country: 'USA', 
    location: 'Austin, TX',
    rating: 4.7,
    reviews: 156,
    teamSize: '21-50',
    founded: '2018',
    services: ['Corporate Law', 'IP Protection', 'Contract Review', 'Compliance'],
    price: '$$$',
    verified: true,
    responseTime: '< 6 hours'
  },
  { 
    id: 4, 
    name: 'Number Crunchers', 
    field: 'Financial Services & CFO', 
    description: 'Expert accounting, financial consulting, and fractional CFO services for growing businesses. We help optimize your financial operations.', 
    category: 'Finance', 
    country: 'USA', 
    location: 'Chicago, IL',
    rating: 4.9,
    reviews: 203,
    teamSize: '11-50',
    founded: '2017',
    services: ['Accounting', 'Fractional CFO', 'Financial Planning', 'Tax Services'],
    price: '$$',
    verified: true,
    responseTime: '< 3 hours'
  },
  { 
    id: 5, 
    name: 'Growth Hackers', 
    field: 'Digital Marketing & Growth', 
    description: 'Data-driven marketing agency focused on growth hacking, performance marketing, and customer acquisition for SaaS and tech companies.', 
    category: 'Marketing', 
    country: 'USA', 
    location: 'Los Angeles, CA',
    rating: 4.6,
    reviews: 94,
    teamSize: '11-50',
    founded: '2020',
    services: ['Growth Marketing', 'PPC Advertising', 'SEO', 'Content Marketing'],
    price: '$$',
    verified: false,
    responseTime: '< 8 hours'
  },
  { 
    id: 6, 
    name: 'Cloud Solutions Pro', 
    field: 'Cloud Infrastructure & DevOps', 
    description: 'Cloud infrastructure and DevOps services for modern businesses. We help scale your applications with reliability and security.', 
    category: 'Tech', 
    country: 'USA', 
    location: 'Seattle, WA',
    rating: 4.8,
    reviews: 76,
    teamSize: '6-10',
    founded: '2021',
    services: ['Cloud Migration', 'DevOps', 'Infrastructure', 'Security'],
    price: '$$$',
    verified: true,
    responseTime: '< 4 hours'
  }
];

const categories = ['All', 'Tech', 'Design', 'Legal', 'Finance', 'Marketing'];
const countries = ['All', 'USA', 'UK', 'Germany', 'Canada'];
const teamSizes = ['All', '1-5', '6-10', '11-50', '51-200', '200+'];
const priceRanges = ['All', '$', '$$', '$$$'];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const CompanyCard = ({ company }) => {
  const gradientColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-teal-500 to-teal-600'
  ];
  
  const gradientIndex = company.name.charCodeAt(0) % gradientColors.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradientColors[gradientIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {getInitials(company.name)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
                {company.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-purple-600 font-medium text-sm">{company.field}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <StarIconSolid className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-gray-900">{company.rating}</span>
              <span className="text-gray-500 text-sm">({company.reviews})</span>
            </div>
            <div className="text-xs text-gray-500">{company.price} pricing</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {company.description}
        </p>

        {/* Services Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {company.services.slice(0, 3).map((service, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
            >
              {service}
            </span>
          ))}
          {company.services.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{company.services.length - 3} more
            </span>
          )}
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UserGroupIcon className="w-4 h-4" />
            <span>{company.teamSize} people</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BuildingOfficeIcon className="w-4 h-4" />
            <span>Since {company.founded}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>{company.responseTime}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button className="flex-1 bg-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors">
            View Profile
          </button>
          <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketplaceListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedTeamSize, setSelectedTeamSize] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = mockListings.filter(listing => {
    const matchesSearch = 
      listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    const matchesCountry = selectedCountry === 'All' || listing.country === selectedCountry;
    const matchesTeamSize = selectedTeamSize === 'All' || listing.teamSize === selectedTeamSize;
    const matchesPriceRange = selectedPriceRange === 'All' || listing.price === selectedPriceRange;
    
    return matchesSearch && matchesCategory && matchesCountry && matchesTeamSize && matchesPriceRange;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies, services, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${
                showFilters 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country === 'All' ? 'All Countries' : country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <select
                  value={selectedTeamSize}
                  onChange={(e) => setSelectedTeamSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {teamSizes.map(size => (
                    <option key={size} value={size}>
                      {size === 'All' ? 'All Sizes' : `${size} employees`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                >
                  {priceRanges.map(price => (
                    <option key={price} value={price}>
                      {price === 'All' ? 'All Prices' : price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {sortedListings.length} Companies Found
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Discover innovative businesses and expert services
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TagIcon className="w-4 h-4" />
          <span>Verified companies available</span>
        </div>
      </div>

      {/* Company Grid */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedListings.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search criteria or filters to find more companies.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedCountry('All');
              setSelectedTeamSize('All');
              setSelectedPriceRange('All');
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketplaceListings; 