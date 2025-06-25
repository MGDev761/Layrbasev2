import React, { useRef, useState } from 'react';
import Card from '../../../components/common/layout/Card';

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

const industries = ['Tech', 'Design', 'Legal', 'Finance', 'Marketing', 'Other'];

const MyListing = () => {
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [services, setServices] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => fileInputRef.current.click();

  const colorIdx = name ? name.charCodeAt(0) % colorPalette.length : 0;

  return (
    <Card>
      <form className="max-w-lg mx-auto p-8 flex flex-col items-center space-y-6">
        <h2 className="text-xl font-bold">Your Marketplace Listing</h2>
        {/* Photo/Initials */}
        <div className="flex flex-col items-center">
          <div className="mb-2">
            {photo ? (
              <img src={photo} alt="Logo" className="h-20 w-20 rounded-xl object-cover border border-gray-200" />
            ) : (
              <div className={`h-20 w-20 rounded-xl flex items-center justify-center font-bold text-2xl ${colorPalette[colorIdx]}`}>{name ? getInitials(name) : '?'}</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button type="button" onClick={handlePhotoClick} className="text-xs text-purple-700 hover:underline mt-1">{photo ? 'Change Photo' : 'Upload Photo'}</button>
        </div>
        {/* Name */}
        <div className="w-full">
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="company-name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Your company or personal name"
          />
        </div>
        {/* Industry */}
        <div className="w-full">
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <select
            id="industry"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Select industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
        {/* Services */}
        <div className="w-full">
          <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">Services (comma separated)</label>
          <input
            type="text"
            id="services"
            value={services}
            onChange={e => setServices(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="e.g. Branding, Web Design, Consulting"
          />
          {services && (
            <div className="flex flex-wrap gap-2 mt-2">
              {services.split(',').map((s, i) => (
                <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">{s.trim()}</span>
              ))}
            </div>
          )}
        </div>
        {/* Description */}
        <div className="w-full">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Describe your business, skills, or offering"
          />
        </div>
        <button type="submit" className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold text-base shadow hover:bg-purple-700 transition-colors">Save Listing</button>
      </form>
    </Card>
  );
};

export default MyListing; 