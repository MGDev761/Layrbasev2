import React, { useState } from 'react';
import CompanyProfile from './components/CompanyProfile';
import SectionCompletion from './components/SectionCompletion';
import Card from '../../components/common/layout/Card';
import { useBudget } from '../../hooks/useBudget';

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

  const { totals, loading: budgetLoading, error: budgetError } = useBudget();
  const monthIndex = new Date().getMonth(); // 0-based

  // Calculate values for widgets
  const revenue = totals.revenue[monthIndex] || 0;
  const costs = totals.expense[monthIndex] || 0;

  // Optionally, you can add more widgets for profit/loss, etc.
  const financialData = [
    { label: 'Monthly Revenue', value: revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), change: '', positive: true },
    { label: 'Monthly Costs', value: costs.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), change: '', positive: false },
  ];

  // Mock tasks for dashboard widget
  const myTasks = [
    { title: 'Review contract for supplier', due: '2024-06-10', status: 'To Do' },
    { title: 'Publish Q2 marketing report', due: '2024-06-12', status: 'In Progress' },
    { title: 'Approve invoice #123', due: '2024-06-15', status: 'Awaiting Review' },
    { title: 'Send contract to supplier', due: '2024-06-18', status: 'Done' },
    { title: 'Update onboarding checklist', due: '2024-06-20', status: 'To Do' },
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
        {/* My Tasks Widget */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Tasks</h2>
          <Card className="overflow-hidden">
            <div>
              {myTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-100 bg-white">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Due: {task.due}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Awaiting Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
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
            <div>
              {teamHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0 border-gray-100 bg-white">
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