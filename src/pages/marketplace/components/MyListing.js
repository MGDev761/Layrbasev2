import React, { useRef, useState } from 'react';
import { 
  CloudArrowUpIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TagIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'tech', label: 'Technology & Software', color: 'bg-blue-100 text-blue-700' },
  { id: 'design', label: 'Design & Creative', color: 'bg-purple-100 text-purple-700' },
  { id: 'legal', label: 'Legal Services', color: 'bg-green-100 text-green-700' },
  { id: 'finance', label: 'Finance & Accounting', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'marketing', label: 'Marketing & Sales', color: 'bg-pink-100 text-pink-700' },
  { id: 'consulting', label: 'Business Consulting', color: 'bg-orange-100 text-orange-700' },
  { id: 'operations', label: 'Operations & Support', color: 'bg-teal-100 text-teal-700' },
  { id: 'other', label: 'Other Services', color: 'bg-gray-100 text-gray-700' }
];

const teamSizes = [
  { value: '1-5', label: '1-5 employees' },
  { value: '6-10', label: '6-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' }
];

const priceRanges = [
  { value: '$', label: '$ - Budget-friendly' },
  { value: '$$', label: '$$ - Moderate pricing' },
  { value: '$$$', label: '$$$ - Premium pricing' }
];

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
  'Australia', 'Netherlands', 'Sweden', 'Switzerland', 'Other'
];

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const MyListing = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    category: '',
    services: [],
    website: '',
    location: '',
    country: '',
    teamSize: '',
    founded: '',
    priceRange: '',
    responseTime: '',
    contactEmail: '',
    phone: '',
    logo: null
  });
  
  const [currentService, setCurrentService] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    if (currentService.trim() && !formData.services.includes(currentService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, currentService.trim()]
      }));
      setCurrentService('');
    }
  };

  const removeService = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, logo: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Listing submitted successfully!');
    }, 2000);
  };

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const gradientIndex = formData.companyName.charCodeAt(0) % 8;
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

  const isFormValid = formData.companyName && formData.description && formData.category && 
                     formData.location && formData.teamSize && formData.contactEmail;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Company Listing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Showcase your company to thousands of potential clients and partners. Create a compelling profile
          that highlights your expertise and attracts the right opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Basics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
              </div>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {formData.logo ? (
                      <img 
                        src={formData.logo} 
                        alt="Company logo" 
                        className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-r ${gradientColors[gradientIndex]} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                        {formData.companyName ? getInitials(formData.companyName) : '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CloudArrowUpIcon className="w-4 h-4" />
                      <span>{formData.logo ? 'Change Logo' : 'Upload Logo'}</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Brief description of what you do"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe your company, expertise, and what makes you unique..."
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleInputChange('category', category.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.category === category.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-2`}>
                          <TagIcon className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-medium text-gray-900 text-center">
                          {category.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Expertise */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TagIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Services & Expertise</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services Offered
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentService}
                      onChange={(e) => setCurrentService(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Add a service (e.g., Web Development)"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {formData.services.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {service}
                          <button
                            type="button"
                            onClick={() => removeService(service)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location & Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="City, State/Province"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size *
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => handleInputChange('teamSize', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="">Select team size</option>
                    {teamSizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={formData.founded}
                    onChange={(e) => handleInputChange('founded', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select pricing</option>
                    {priceRanges.map(price => (
                      <option key={price.value} value={price.value}>{price.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Time
                  </label>
                  <input
                    type="text"
                    value={formData.responseTime}
                    onChange={(e) => handleInputChange('responseTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="< 24 hours"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <GlobeAltIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isFormValid && !isSubmitting
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview/Progress Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Listing Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {formData.companyName ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
                <span className={formData.companyName ? 'text-green-700' : 'text-gray-500'}>
                  Company Information
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {formData.services.length > 0 ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
                <span className={formData.services.length > 0 ? 'text-green-700' : 'text-gray-500'}>
                  Services & Expertise
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {formData.location && formData.teamSize ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
                <span className={formData.location && formData.teamSize ? 'text-green-700' : 'text-gray-500'}>
                  Company Details
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {formData.contactEmail ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
                <span className={formData.contactEmail ? 'text-green-700' : 'text-gray-500'}>
                  Contact Information
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="font-semibold text-gray-900 mb-4">Tips for Success</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Use clear, professional photos and descriptions</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Highlight your unique value proposition</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>List specific services to improve discoverability</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Keep contact information up to date</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListing; 