import React, { useState } from 'react';
import CompanyProfile from './components/CompanyProfile';
import SectionCompletion from './components/SectionCompletion';
import Card from '../../components/common/layout/Card';

const Dashboard = () => {
  // Company Profile State
  const [companyName, setCompanyName] = useState('Acme Inc.');
  const [companyWebsite, setCompanyWebsite] = useState('acme.com');
  const [companyLinkedin, setCompanyLinkedin] = useState('acme');
  const [logoUrl, setLogoUrl] = useState('');

  // Mock data - in a real app this would come from your backend
  const sectionProgress = [
    { name: 'Company Setup', progress: 85, color: 'bg-teal-500' },
    { name: 'Finance', progress: 60, color: 'bg-pink-500' },
    { name: 'Cap Table', progress: 45, color: 'bg-purple-500' },
    { name: 'Marketing', progress: 30, color: 'bg-lime-500' },
    { name: 'HR', progress: 20, color: 'bg-gray-500' },
  ];

  // Mock financial data
  const financialData = [
    { label: 'Monthly Revenue', value: '$45,230', change: '+12.5%', positive: true },
    { label: 'Cash Flow', value: '$12,450', change: '+8.2%', positive: true },
    { label: 'Expenses', value: '$32,180', change: '-3.1%', positive: false },
    { label: 'Profit Margin', value: '28.9%', change: '+2.4%', positive: true },
  ];

  // Mock marketing releases
  const marketingReleases = [
    { title: 'Q1 Product Launch Campaign', date: 'Mar 15, 2024', status: 'In Progress' },
    { title: 'Brand Refresh Announcement', date: 'Mar 22, 2024', status: 'Scheduled' },
    { title: 'Customer Success Story', date: 'Mar 28, 2024', status: 'Draft' },
    { title: 'Industry Report Publication', date: 'Apr 5, 2024', status: 'Planning' },
  ];

  // Mock team holidays
  const teamHolidays = [
    { name: 'Sarah Johnson', role: 'Marketing Manager', dates: 'Mar 18-22, 2024', status: 'Approved' },
    { name: 'Mike Chen', role: 'Developer', dates: 'Mar 25-29, 2024', status: 'Pending' },
    { name: 'Emma Davis', role: 'Sales Rep', dates: 'Apr 1-5, 2024', status: 'Approved' },
    { name: 'Alex Thompson', role: 'Designer', dates: 'Apr 8-12, 2024', status: 'Requested' },
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-8 bg-red-100">
      {/* Top Section - Company Profile and Section Completion */}
      <div className="flex gap-6">
        <div className="flex-1">
          <CompanyProfile
            companyName={companyName}
            companyWebsite={companyWebsite}
            companyLinkedin={companyLinkedin}
            logoUrl={logoUrl}
            onLogoUpload={handleLogoUpload}
            onCompanyNameChange={setCompanyName}
            onWebsiteChange={setCompanyWebsite}
            onLinkedinChange={setCompanyLinkedin}
          />
        </div>
        <div className="w-80">
          <SectionCompletion sections={sectionProgress} />
        </div>
      </div>

      {/* Financial Widgets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialData.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <div className={`text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Marketing Releases</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {marketingReleases.map((release, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{release.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    release.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    release.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                    release.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Holidays */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Holidays</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {teamHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{holiday.name}</h4>
                    <p className="text-xs text-gray-500">{holiday.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{holiday.dates}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    holiday.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    holiday.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {holiday.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 

  return (
    <div className="flex flex-col space-y-8 bg-red-100">
      {/* Top Section - Company Profile and Section Completion */}
      <div className="flex gap-6">
        <div className="flex-1">
          <CompanyProfile
            companyName={companyName}
            companyWebsite={companyWebsite}
            companyLinkedin={companyLinkedin}
            logoUrl={logoUrl}
            onLogoUpload={handleLogoUpload}
            onCompanyNameChange={setCompanyName}
            onWebsiteChange={setCompanyWebsite}
            onLinkedinChange={setCompanyLinkedin}
          />
        </div>
        <div className="w-80">
          <SectionCompletion sections={sectionProgress} />
        </div>
      </div>

      {/* Financial Widgets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialData.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <div className={`text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Marketing Releases</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {marketingReleases.map((release, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{release.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    release.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    release.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                    release.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Holidays */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Holidays</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {teamHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{holiday.name}</h4>
                    <p className="text-xs text-gray-500">{holiday.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{holiday.dates}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    holiday.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    holiday.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {holiday.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 

  return (
    <div className="flex flex-col space-y-8 bg-red-100">
      {/* Top Section - Company Profile and Section Completion */}
      <div className="flex gap-6">
        <div className="flex-1">
          <CompanyProfile
            companyName={companyName}
            companyWebsite={companyWebsite}
            companyLinkedin={companyLinkedin}
            logoUrl={logoUrl}
            onLogoUpload={handleLogoUpload}
            onCompanyNameChange={setCompanyName}
            onWebsiteChange={setCompanyWebsite}
            onLinkedinChange={setCompanyLinkedin}
          />
        </div>
        <div className="w-80">
          <SectionCompletion sections={sectionProgress} />
        </div>
      </div>

      {/* Financial Widgets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialData.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <div className={`text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Marketing Releases</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {marketingReleases.map((release, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{release.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    release.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    release.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                    release.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Holidays */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Holidays</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {teamHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{holiday.name}</h4>
                    <p className="text-xs text-gray-500">{holiday.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{holiday.dates}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    holiday.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    holiday.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {holiday.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 

  return (
    <div className="flex flex-col space-y-8 bg-red-100">
      {/* Top Section - Company Profile and Section Completion */}
      <div className="flex gap-6">
        <div className="flex-1">
          <CompanyProfile
            companyName={companyName}
            companyWebsite={companyWebsite}
            companyLinkedin={companyLinkedin}
            logoUrl={logoUrl}
            onLogoUpload={handleLogoUpload}
            onCompanyNameChange={setCompanyName}
            onWebsiteChange={setCompanyWebsite}
            onLinkedinChange={setCompanyLinkedin}
          />
        </div>
        <div className="w-80">
          <SectionCompletion sections={sectionProgress} />
        </div>
      </div>

      {/* Financial Widgets */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialData.map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <div className={`text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Marketing Releases</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {marketingReleases.map((release, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{release.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    release.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    release.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                    release.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Team Holidays */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Holidays</h2>
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {teamHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{holiday.name}</h4>
                    <p className="text-xs text-gray-500">{holiday.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{holiday.dates}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    holiday.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    holiday.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {holiday.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
import CompanyProfile from './components/CompanyProfile';
import SectionCompletion from './components/SectionCompletion';

const Dashboard = () => {
  // Company Profile State
  const [companyName, setCompanyName] = useState('Acme Inc.');
  const [companyWebsite, setCompanyWebsite] = useState('acme.com');
  const [companyLinkedin, setCompanyLinkedin] = useState('acme');
  const [logoUrl, setLogoUrl] = useState('');

  // Mock data - in a real app this would come from your backend
  const sectionProgress = [
    { name: 'Company Setup', progress: 85, color: 'bg-teal-500' },
    { name: 'Finance', progress: 60, color: 'bg-pink-500' },
    { name: 'Cap Table', progress: 45, color: 'bg-purple-500' },
    { name: 'Marketing', progress: 30, color: 'bg-lime-500' },
    { name: 'HR', progress: 20, color: 'bg-gray-500' },
  ];

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <CompanyProfile
            companyName={companyName}
            companyWebsite={companyWebsite}
            companyLinkedin={companyLinkedin}
            logoUrl={logoUrl}
            onLogoUpload={handleLogoUpload}
            onCompanyNameChange={setCompanyName}
            onWebsiteChange={setCompanyWebsite}
            onLinkedinChange={setCompanyLinkedin}
          />
        </div>
        <div className="w-80">
          <SectionCompletion sections={sectionProgress} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 