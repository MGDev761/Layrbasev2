import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, UserPlusIcon } from '@heroicons/react/20/solid';
import { Popover } from '@headlessui/react';
import { useAuth } from '../../../contexts/AuthContext';
import CreateOrganization from '../../organizations/CreateOrganization';
import JoinOrganization from '../../organizations/JoinOrganization';

const SideNav = ({ 
  tabs, 
  activeTab, 
  subTabs, 
  activeSubTab
}) => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState([activeTab]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { organizations, currentOrganization, setCurrentOrganization, refreshOrganizations } = useAuth();

  const toggleSection = (tabId) => {
    setExpandedSections(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const handleTabClick = (tabId) => {
    console.log('handleTabClick called with', tabId);
    // Navigate to the main section with default sub-tab
    const defaultSubTabs = {
      company: 'foundation',
      finance: 'overview',
      legal: 'contracts',
      captable: 'captable',
      marketing: 'events',
      sales: 'crm',
      hr: 'employees',
    };
    const defaultSubTab = defaultSubTabs[tabId];
    const newPath = defaultSubTab ? `/${tabId}/${defaultSubTab}` : `/${tabId}`;
    console.log('Navigating to', newPath);
    navigate(newPath);
    
    if (!expandedSections.includes(tabId)) {
      setExpandedSections(prev => [...prev, tabId]);
    }
  };

  const handleTabButtonClick = (tabId, hasSubsections) => {
    if (hasSubsections) {
      toggleSection(tabId);
    } else {
      handleTabClick(tabId);
    }
  };

  // Define subsections for each main tab
  const sectionSubsections = {
    dashboard: [],
    company: [
      { id: 'foundation', name: 'Company Foundations' },
      { id: 'details', name: 'Company Details' },
    ],
    finance: [
      { id: 'overview', name: 'Overview' },
      { id: 'budget', name: 'Budget & Forecast' },
      { id: 'cashflow', name: 'Cash Flow' },
      { id: 'scenario', name: 'Scenario Planning' },
      { id: 'invoicing', name: 'Invoicing' },
      { id: 'management', name: 'Management Accounts' },
    ],
    legal: [
      { id: 'contracts', name: 'Contracts' },
      { id: 'templates', name: 'Templates' },
      { id: 'compliance', name: 'Compliance Deadlines' },
      { id: 'risk', name: 'Risk & Insurance' },
      { id: 'requirements', name: 'Legal Requirements' },
    ],
    captable: [
      { id: 'captable', name: 'Cap Table' },
      { id: 'rounds', name: 'Round History' },
      { id: 'exits', name: 'Exit Scenarios' },
      { id: 'investment', name: 'Investment Planning' },
    ],
    marketing: [
      { id: 'events', name: 'Marketing Calendar' },
      { id: 'content', name: 'Content Tracker' },
      { id: 'brand', name: 'Brand Assets' },
      { id: 'sales', name: 'Sales Collateral' },
    ],
    sales: [
      { id: 'crm', name: 'CRM Dashboard' },
      { id: 'contacts', name: 'Contacts' },
      { id: 'pipeline', name: 'Pipeline' },
    ],
    hr: [
      { id: 'employees', name: 'Employees' },
      { id: 'time', name: 'Time Manager' },
      { id: 'policies', name: 'Company Policies' },
    ],
  };

  const handleCreateSuccess = async (organization) => {
    setShowCreateModal(false);
    await refreshOrganizations();
  };

  const handleJoinSuccess = async (invitation) => {
    setShowJoinModal(false);
    await refreshOrganizations();
  };

  return (
    <div className="w-64 min-w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Organization Button */}
      <div className="px-4 pt-4 pb-2 relative">
        <Popover className="relative w-full">
          <Popover.Button className="w-full max-w-full flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm px-3 py-2 transition group border border-gray-200">
            {/* Logo or Initial */}
            {currentOrganization?.logoUrl ? (
              <img src={currentOrganization.logoUrl} alt={currentOrganization.organization_name} className="w-10 h-10 rounded-lg object-cover bg-white border" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-xl font-bold text-white border">
                {currentOrganization?.organization_name?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-gray-900 text-sm leading-tight truncate max-w-[110px]">
                {currentOrganization?.organization_name || 'Select Organization'}
              </div>
              <div className="text-xs text-gray-500">{currentOrganization?.member_count || 0} Members</div>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-transform" />
          </Popover.Button>
          <Popover.Panel className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2 space-y-1 min-w-[320px] w-full">
            <div className="p-2">
              <div className="mb-2 text-xs text-gray-500 font-semibold uppercase">Organizations</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {organizations?.map((org) => (
                  <button
                    key={org.organization_id}
                    onClick={() => setCurrentOrganization(org)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      currentOrganization?.organization_id === org.organization_id
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-base font-bold text-white border">
                      {org.organization_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{org.organization_name}</div>
                      <div className="text-xs text-gray-500">{org.member_count || 0} Members</div>
                    </div>
                    {currentOrganization?.organization_id === org.organization_id && (
                      <div className="ml-2 w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4 text-gray-500" />
                  Create Organization
                </button>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <UserPlusIcon className="h-4 w-4 text-gray-500" />
                  Join Organization
                </button>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-100 mb-2"></div>
      <nav className="space-y-1 pt-0">
        {tabs.map((tab) => {
          const isExpanded = expandedSections.includes(tab.id);
          const hasSubsections = sectionSubsections[tab.id]?.length > 0;
          
          return (
            <div key={tab.id}>
              <button
                onClick={() => handleTabButtonClick(tab.id, hasSubsections)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.name}</span>
                </div>
                {hasSubsections && (
                  isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )
                )}
              </button>
              
              {isExpanded && hasSubsections && (
                <div className="bg-gray-50 border-l border-gray-300 ml-4 pl-3">
                  {sectionSubsections[tab.id].map((subsection) => (
                    <Link
                      key={subsection.id}
                      to={`/${tab.id}/${subsection.id}`}
                      className={`w-full flex items-center py-2 text-left text-sm transition-colors px-4
                        ${activeSubTab === subsection.id
                          ? 'text-purple-700 bg-purple-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      style={{ textDecoration: 'none' }}
                    >
                      {subsection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>
        
        {/* Marketplace Link */}
        <button
          onClick={() => navigate('/marketplace')}
          className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Marketplace</span>
          </div>
        </button>
      </nav>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <CreateOrganization
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Join Organization Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <JoinOrganization
              onSuccess={handleJoinSuccess}
              onCancel={() => setShowJoinModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav; 