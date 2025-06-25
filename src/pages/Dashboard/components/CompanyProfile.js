import React from 'react';
import { Popover } from '@headlessui/react';
import Card from '../../../components/common/layout/Card';

const CompanyProfile = ({ 
  companyName, 
  companyWebsite, 
  companyLinkedin, 
  logoUrl, 
  onLogoUpload,
  onCompanyNameChange,
  onWebsiteChange,
  onLinkedinChange 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>
      <Card className="p-6">
        <div className="flex h-[280px]">
          <div className="w-48 border-r border-gray-100">
            {logoUrl ? (
              <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 relative">
            <Popover className="absolute right-4 top-4">
              <Popover.Button className="p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Popover.Button>

              <Popover.Panel className="absolute right-0 z-10 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Company Profile</h3>
                  <div className="space-y-4">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain" />
                          ) : (
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                          <input type="file" className="sr-only" onChange={onLogoUpload} accept="image/*" />
                          Upload Logo
                        </label>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => onCompanyNameChange(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* Company Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => onWebsiteChange(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm mr-2">linkedin.com/company/</span>
                        <input
                          type="text"
                          value={companyLinkedin}
                          onChange={(e) => onLinkedinChange(e.target.value)}
                          placeholder="company-name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>

            <h3 className="text-xl font-medium text-gray-900 mb-4">{companyName}</h3>
            <div className="space-y-2">
              {companyWebsite && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={`https://${companyWebsite}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                    {companyWebsite}
                  </a>
                </div>
              )}
              {companyLinkedin && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <a href={`https://linkedin.com/company/${companyLinkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                    linkedin.com/company/{companyLinkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyProfile; 
import { Popover } from '@headlessui/react';
import Card from '../../../components/common/layout/Card';

const CompanyProfile = ({ 
  companyName, 
  companyWebsite, 
  companyLinkedin, 
  logoUrl, 
  onLogoUpload,
  onCompanyNameChange,
  onWebsiteChange,
  onLinkedinChange 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>
      <Card>
        <div className="flex h-[216px]">
          <div className="w-48 border-r border-gray-100">
            {logoUrl ? (
              <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4">
                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 relative">
            <Popover className="absolute right-4 top-4">
              <Popover.Button className="p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Popover.Button>

              <Popover.Panel className="absolute right-0 z-10 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Company Profile</h3>
                  <div className="space-y-4">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain" />
                          ) : (
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                          <input type="file" className="sr-only" onChange={onLogoUpload} accept="image/*" />
                          Upload Logo
                        </label>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => onCompanyNameChange(e.target.value)}
                        placeholder="Enter company name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* Company Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => onWebsiteChange(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm mr-2">linkedin.com/company/</span>
                        <input
                          type="text"
                          value={companyLinkedin}
                          onChange={(e) => onLinkedinChange(e.target.value)}
                          placeholder="company-name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>

            <h3 className="text-xl font-medium text-gray-900 mb-4">{companyName}</h3>
            <div className="space-y-2">
              {companyWebsite && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={`https://${companyWebsite}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                    {companyWebsite}
                  </a>
                </div>
              )}
              {companyLinkedin && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <a href={`https://linkedin.com/company/${companyLinkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                    linkedin.com/company/{companyLinkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyProfile; 