import React, { useState } from 'react';

const LAWS = [
  {
    id: 'gdpr',
    law: 'GDPR',
    region: 'EU',
    appliesTo: 'All users processing EU citizen data',
    effectiveDate: 'May 2018',
    summary: 'Protects personal data rights',
    type: 'Data Privacy',
    industry: 'All',
    status: 'Active',
  },
  {
    id: 'ccpa',
    law: 'CCPA',
    region: 'California, US',
    appliesTo: 'Businesses with >$25M revenue or >50k users',
    effectiveDate: 'Jan 2020',
    summary: 'Consumer data rights in California',
    type: 'Data Privacy',
    industry: 'All',
    status: 'Active',
  },
  {
    id: 'dsa',
    law: 'DSA',
    region: 'EU',
    appliesTo: 'Platforms hosting user-generated content',
    effectiveDate: 'Feb 2024',
    summary: 'Digital safety and transparency',
    type: 'Digital Services',
    industry: 'Tech/Media',
    status: 'Active',
  },
  {
    id: 'hipaa',
    law: 'HIPAA',
    region: 'US',
    appliesTo: 'Healthcare providers processing patient data',
    effectiveDate: 'Apr 2003',
    summary: 'Protects health information privacy',
    type: 'Healthcare',
    industry: 'Healthcare',
    status: 'Active',
  },
  {
    id: 'lgpd',
    law: 'LGPD',
    region: 'Brazil',
    appliesTo: 'Any business processing Brazilian citizen data',
    effectiveDate: 'Aug 2020',
    summary: 'Brazilian data protection law',
    type: 'Data Privacy',
    industry: 'All',
    status: 'Active',
  },
];

const REGIONS = [...new Set(LAWS.map(l => l.region))];
const TYPES = [...new Set(LAWS.map(l => l.type))];
const INDUSTRIES = [...new Set(LAWS.map(l => l.industry))];
const STATUSES = [...new Set(LAWS.map(l => l.status))];

export default function LegalRequirements() {
  const [activeTab, setActiveTab] = useState('directory');
  const [detailActiveTab, setDetailActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [type, setType] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('');
  const [showChecker, setShowChecker] = useState(false);
  const [showDetail, setShowDetail] = useState(null);

  const filteredLaws = LAWS.filter(law => {
    const matchesSearch = !search || 
      law.law.toLowerCase().includes(search.toLowerCase()) ||
      law.summary.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = !region || law.region === region;
    const matchesType = !type || law.type === type;
    const matchesIndustry = !industry || law.industry === industry;
    const matchesStatus = !status || law.status === status;
    
    return matchesSearch && matchesRegion && matchesType && matchesIndustry && matchesStatus;
  });

  const renderDirectoryTab = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="border px-3 py-2 rounded min-w-[200px]"
          placeholder="Search laws..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border px-3 py-2 rounded" value={region} onChange={e => setRegion(e.target.value)}>
          <option value="">All Regions</option>
          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="border px-3 py-2 rounded" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="border px-3 py-2 rounded" value={industry} onChange={e => setIndustry(e.target.value)}>
          <option value="">All Industries</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select className="border px-3 py-2 rounded" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      
      <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-900 font-semibold text-base">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Law</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applies to</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLaws.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No laws found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLaws.map(law => (
                  <tr
                    key={law.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setShowDetail(law)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{law.law}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{law.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{law.appliesTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{law.effectiveDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{law.summary}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {law.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCheckerTab = () => (
    <div className="bg-white border border-gray-300 rounded-md p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Eligibility Checker</h3>
        <p className="text-gray-500 mb-6">Answer a few questions to determine which laws apply to your business.</p>
        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => setShowChecker(true)}
        >
          Start Eligibility Check
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="bg-white border border-gray-300 rounded-md p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Law Updates & Monitoring</h3>
        <p className="text-gray-500 mb-6">Subscribe to updates and get notified when relevant laws change.</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          Set Up Notifications
        </button>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="bg-white border border-gray-300 rounded-md p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Export & Documentation</h3>
        <p className="text-gray-500 mb-6">Export your matched obligations as PDF or CSV for compliance reporting.</p>
        <div className="flex justify-center space-x-3">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Export as PDF
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Legal Requirements</h1>
        <p className="text-gray-600 text-sm mb-6">Browse laws, check eligibility, and manage compliance requirements for your business.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab('directory')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'directory'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Law Directory
            </button>
            <button
              onClick={() => setActiveTab('checker')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'checker'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Eligibility Checker
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'export'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Export
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'directory' && renderDirectoryTab()}
      {activeTab === 'checker' && renderCheckerTab()}
      {activeTab === 'notifications' && renderNotificationsTab()}
      {activeTab === 'export' && renderExportTab()}

      {/* Smart Eligibility Checker Modal */}
      {showChecker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowChecker(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Smart Eligibility Checker</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What industry is your business in?</label>
                <select className="w-full border px-3 py-2 rounded">
                  <option>Select industry...</option>
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Where do you operate?</label>
                <select className="w-full border px-3 py-2 rounded">
                  <option>Select regions...</option>
                  <option>EU</option>
                  <option>US</option>
                  <option>UK</option>
                  <option>Global</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you process personal data?</label>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input type="radio" name="data" className="mr-2" />
                    Yes
                  </label>
                  <label className="inline-flex items-center">
                    <input type="radio" name="data" className="mr-2" />
                    No
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50" onClick={() => setShowChecker(false)}>Cancel</button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Check Eligibility</button>
            </div>
          </div>
        </div>
      )}

      {/* Law Detail Side Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowDetail(null)}>
          <div
            className="absolute top-0 right-0 h-full w-11/12 max-w-2xl bg-white shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Law Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Law Details</h3>
                <button
                  onClick={() => setShowDetail(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{showDetail.law}</h2>
                  <p className="text-sm text-gray-600">{showDetail.region} • {showDetail.effectiveDate}</p>
                  <p className="text-sm text-gray-500">{showDetail.type} • {showDetail.industry}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setDetailActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    detailActiveTab === 'overview'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setDetailActiveTab('obligations')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    detailActiveTab === 'obligations'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Obligations</span>
                </button>
                <button
                  onClick={() => setDetailActiveTab('resources')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    detailActiveTab === 'resources'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Resources</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {detailActiveTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{showDetail.summary}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Region</dt>
                        <dd className="text-sm text-gray-900">{showDetail.region}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Effective Date</dt>
                        <dd className="text-sm text-gray-900">{showDetail.effectiveDate}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Applies To</dt>
                        <dd className="text-sm text-gray-900">{showDetail.appliesTo}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Industry</dt>
                        <dd className="text-sm text-gray-900">{showDetail.industry}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Law Type</dt>
                        <dd className="text-sm text-gray-900">{showDetail.type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {showDetail.status}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Enforcement</h3>
                    <p className="text-sm text-gray-700">(Placeholder: e.g. ICO, FTC)</p>
                  </div>
                </div>
              )}
              
              {detailActiveTab === 'obligations' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Key Obligations</h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Data Protection</h4>
                      <p className="text-sm text-yellow-700">Implement appropriate technical and organizational measures to ensure data security.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">User Consent</h4>
                      <p className="text-sm text-blue-700">Obtain clear and informed consent before processing personal data.</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Transparency</h4>
                      <p className="text-sm text-green-700">Provide clear information about data processing activities to users.</p>
                    </div>
                  </div>
                </div>
              )}

              {detailActiveTab === 'resources' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Resources</h3>
                  <div className="space-y-3">
                    <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Full Legislation</h4>
                          <p className="text-sm text-gray-500">Complete legal text and amendments</p>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                    <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Official Guidance</h4>
                          <p className="text-sm text-gray-500">Regulatory guidance and best practices</p>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                    <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Compliance Checklist</h4>
                          <p className="text-sm text-gray-500">Step-by-step compliance requirements</p>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex space-x-3">
                <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm font-medium">
                  Subscribe to Updates
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 