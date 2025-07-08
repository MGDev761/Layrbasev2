import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { budgetService } from '../../services/budgetService';
import { 
  DocumentDuplicateIcon, 
  PencilSquareIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';
import BudgetBuilder from './components/budget/BudgetBuilder';
import ForecastManager from './components/forecast/ForecastManager';

const BudgetLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrganization } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [activeTab, setActiveTab] = useState('landing');
  const [hasBudgetData, setHasBudgetData] = useState(false);

  useEffect(() => {
    const checkExistingBudget = async () => {
      if (!currentOrganization?.organization_id) return;
      setCheckingExisting(true);
      try {
        const [categories, lineItems, budgetData] = await Promise.all([
          budgetService.getCategories(currentOrganization.organization_id),
          budgetService.getLineItems(currentOrganization.organization_id),
          budgetService.getBudgetData(currentOrganization.organization_id, new Date().getFullYear(), 'all')
        ]);
        
        const hasData = (categories && categories.length > 0) || 
                       (lineItems && lineItems.length > 0) ||
                       (budgetData && budgetData.length > 0);
        
        setHasBudgetData(hasData);
        
        // Check URL path to determine which tab to show
        const pathParts = location.pathname.split('/');
        if (pathParts.includes('builder')) {
          setActiveTab('builder');
        } else if (pathParts.includes('forecast')) {
          setActiveTab('forecast');
        } else if (hasData) {
          // If they have data and no specific tab, show builder
          setActiveTab('builder');
        }
      } catch (e) {
        console.error('Error checking existing budget:', e);
      } finally {
        setCheckingExisting(false);
      }
    };
    checkExistingBudget();
  }, [currentOrganization, location.pathname]);

  const handleTemplateClick = async () => {
    console.log('handleTemplateClick called', currentOrganization);
    if (!currentOrganization?.organization_id) return;
    setLoading(true);
    try {
      await budgetService.createSampleData(currentOrganization.organization_id);
      setHasBudgetData(true);
      setActiveTab('builder');
    } catch (error) {
      alert(error.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleScratchClick = () => {
    setActiveTab('builder');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without full navigation
    const basePath = '/finance/budget';
    const newPath = tab === 'landing' ? basePath : `${basePath}/${tab}`;
    window.history.replaceState(null, '', newPath);
  };

  if (checkingExisting) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const renderTabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => handleTabChange('builder')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'builder'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-5 w-5" />
            Budget Builder
          </div>
        </button>
        <button
          onClick={() => handleTabChange('forecast')}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'forecast'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            Forecast Manager
          </div>
        </button>
      </nav>
    </div>
  );

  const renderLandingContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget & Forecast</h2>
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          Create comprehensive budgets and manage forecasts with variance analysis. 
          Build your annual P&L, track performance, and make data-driven decisions.
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200 hover:shadow-md transition-shadow">
          <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold mb-3">Start with Template</h3>
          <p className="mb-6 text-gray-600">
            Jumpstart your budget with pre-built categories and sample data to get started quickly.
          </p>
          <button
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
            onClick={handleTemplateClick}
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Use Template'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200 hover:shadow-md transition-shadow">
          <PencilSquareIcon className="mx-auto h-12 w-12 text-gray-700 mb-4" />
          <h3 className="text-xl font-bold mb-3">Build from Scratch</h3>
          <p className="mb-6 text-gray-600">
            Create a custom budget with your own categories and line items tailored to your business.
          </p>
          <button
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            onClick={handleScratchClick}
          >
            Build Custom Budget
          </button>
        </div>
      </div>

      {hasBudgetData && (
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Existing Budget</h3>
            <p className="text-gray-600">You have existing budget data. Continue building or manage forecasts.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => handleTabChange('builder')}
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ClipboardDocumentListIcon className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900">Budget Builder</div>
                <div className="text-sm text-green-700">Edit categories and line items</div>
              </div>
            </button>
            
            <button
              onClick={() => handleTabChange('forecast')}
              className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900">Forecast Manager</div>
                <div className="text-sm text-blue-700">Track actuals vs forecasts</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'builder':
        return <BudgetBuilder />;
      case 'forecast':
        return <ForecastManager />;
      default:
        return renderLandingContent();
    }
  };

  return (
    <div className="space-y-6">
      {activeTab !== 'landing' && renderTabNavigation()}
      {renderContent()}
    </div>
  );
};

export default BudgetLanding; 