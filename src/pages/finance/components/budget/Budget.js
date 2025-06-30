import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBudget } from '../../../../hooks/useBudget';
import AddBudgetItemModal from './AddBudgetItemModal';
import QuickBudgetEditorModal from './QuickBudgetEditorModal';
import { useAuth } from '../../../../contexts/AuthContext';
import { budgetService } from '../../../../services/budgetService';
import { ArrowLeftIcon, PlusIcon, InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Side modal for help/tips (matches legal/compliance format)
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openSections, setOpenSections] = useState({
    basics: true,
    platform: false,
    ai: false
  });
  const toggleSection = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
  const [openContent, setOpenContent] = useState({
    intro: true,
    why: false,
    best: false
  });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({
    quick: true,
    tips: false,
    faq: false
  });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Budget & Forecast Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Budgeting Basics
          </button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <Cog6ToothIcon className="w-5 h-5" /> Platform How-To
          </button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <ChatBubbleLeftRightIcon className="w-5 h-5" /> AI
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (
            <>
              {/* Introduction Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Introduction</span>
                  {openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.intro && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Budgeting and forecasting are essential for business planning and financial management. This section helps you understand best practices for creating and managing budgets effectively.</p>
                  </div>
                )}
              </div>
              {/* Why It's Important Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('why')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Why It's Important</span>
                  {openContent.why ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.why && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Helps plan and allocate resources effectively</li>
                      <li>Provides financial control and accountability</li>
                      <li>Enables better decision-making and strategy</li>
                      <li>Facilitates performance monitoring and analysis</li>
                    </ul>
                  </div>
                )}
              </div>
              {/* Best Practice Section */}
              <div className="bg-gray-50">
                <button onClick={() => toggleContent('best')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Best Practice</span>
                  {openContent.best ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openContent.best && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Set clear revenue and cost categories for transparency</li>
                      <li>Review and update your forecast regularly</li>
                      <li>Compare actuals vs. budget to spot trends early</li>
                      <li>Use recurring items for predictable expenses</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          {tab === 'platform' && (
            <>
              {/* Quick Start Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('quick')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Edit Values Directly</span>
                  {openPlatform.quick ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.quick && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Click any cell to edit values directly. Use the quick editor for fast category changes and switch between months/quarters for different views.</p>
                  </div>
                )}
              </div>
              {/* Tips Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('tips')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Compare and Analyze</span>
                  {openPlatform.tips ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.tips && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Compare forecast vs. budget with one click. Use the budget comparison feature to analyze variances and track performance against targets.</p>
                  </div>
                )}
              </div>
              {/* FAQ Section */}
              <div className="bg-gray-50">
                <button onClick={() => togglePlatform('faq')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none">
                  <span className="text-sm">Organize and Structure</span>
                  {openPlatform.faq ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                </button>
                {openPlatform.faq && (
                  <div className="px-6 py-4 text-gray-700 text-sm">
                    <p>Expand/collapse groups to focus on what matters. All values are editable and organized by revenue and cost categories for easy management.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {tab === 'ai' && (
            <div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your budgeting assistant. I can help you create budgets, analyze forecasts, and answer questions about using this platform.</div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I add a new budget category?</div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Click the "+" button next to "Revenue" or "Costs" to add a new category. You can also add line items within each category for more detailed budgeting.</div>
                </div>
              </div>
              {/* Input box */}
              <form className="flex items-center gap-2">
                <input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about budgeting..." disabled />
                <button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Budget = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentOrganization } = useAuth();
  const {
    budgetData,
    categories,
    lineItems,
    loading,
    error,
    selectedYear,
    showBudgetComparison,
    comparisonData,
    hasBudget,
    hasForecast,
    setSelectedYear,
    setShowBudgetComparison,
    updateBudgetValue,
    createLineItem,
    createCategory,
    deleteLineItem,
    groupedBudgetData,
    totals,
    actualsTotals,
    comparisonTotals,
    loadComparisonData,
    clearError,
    loadBudgetData,
    createForecastFromBudget,
    updateCategoryName,
    updateLineItemName,
    lockForecastAsActual
  } = useBudget();

  const [activeTab, setActiveTab] = useState('budget');
  const [viewMode, setViewMode] = useState('months');
  const [expandRevenue, setExpandRevenue] = useState(true);
  const [expandCosts, setExpandCosts] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLineItemModal, setShowLineItemModal] = useState(false);
  const [addModalType, setAddModalType] = useState('category');
  const [addModalParent, setAddModalParent] = useState(null);
  const [addCategoryType, setAddCategoryType] = useState('revenue');
  const [showQuickEditor, setShowQuickEditor] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isBudgetLocked, setIsBudgetLocked] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingLineItem, setEditingLineItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [creatingSampleData, setCreatingSampleData] = useState(false);
  // 1. Add state for lock modal
  const [lockModal, setLockModal] = useState({ open: false, lineItemId: null, monthNum: null });
  // Add state for lock notification
  const [showLockNotification, setShowLockNotification] = useState(false);
  // Add state for custom success notification
  const [successMessage, setSuccessMessage] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Handle URL parameters for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'forecast') {
      setActiveTab('forecast');
    }
  }, [location.search]);

  // Load comparison data when forecast tab is active and comparison is enabled
  useEffect(() => {
    if (activeTab === 'forecast' && currentOrganization?.organization_id) {
      loadComparisonData();
    }
  }, [activeTab, currentOrganization?.organization_id, loadComparisonData]);

  // Force reload data when component mounts
  useEffect(() => {
    if (currentOrganization?.organization_id) {
      console.log('Budget useEffect running, calling loadBudgetData');
      loadBudgetData();
    }
  }, [currentOrganization?.organization_id, loadBudgetData]);

  // Check if budget is locked
  useEffect(() => {
    const checkLockStatus = async () => {
      if (!currentOrganization?.organization_id) return;
      
      try {
        const budgetVersions = await budgetService.getVersions(currentOrganization.organization_id, selectedYear);
        const budgetVersion = budgetVersions.find(v => v.version_type === 'budget');
        
        setIsBudgetLocked(budgetVersion?.is_locked || false);
      } catch (error) {
        console.error('Error checking lock status:', error);
      }
    };
    
    checkLockStatus();
  }, [currentOrganization?.organization_id, selectedYear]);

  // Calculate quarterly totals
  const calculateQuarterlyTotals = (values) => {
    const quarters = [];
    for (let i = 0; i < 4; i++) {
      const start = i * 3;
      const quarterTotal = values.slice(start, start + 3).reduce((sum, val) => sum + val, 0);
      quarters.push(quarterTotal);
    }
    return quarters;
  };

  const handleValueChange = async (lineItemId, month, value, dataType = 'budget') => {
    const amount = parseFloat(value) || 0;
    await updateBudgetValue(lineItemId, month, amount, dataType);
  };

  const handleAddLineItem = async (lineItemData) => {
    await createLineItem(lineItemData);
  };

  const handleAddCategory = async (categoryData) => {
    await createCategory(categoryData);
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDeleteLineItem = async (lineItemId) => {
    if (window.confirm('Are you sure you want to delete this line item?')) {
      await deleteLineItem(lineItemId);
    }
  };

  const handleCreateSampleData = async () => {
    if (!currentOrganization?.organization_id) return;
    
    setCreatingSampleData(true);
    try {
      await budgetService.createSampleData(currentOrganization.organization_id);
      await loadBudgetData();
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert(error.message || error.toString());
    } finally {
      setCreatingSampleData(false);
    }
  };

  const handleLockBudget = async () => {
    if (!currentOrganization?.organization_id) {
      alert('No organization selected!');
      return;
    }
    try {
      await budgetService.lockVersion(currentOrganization.organization_id, selectedYear, 'budget', true);
      setIsBudgetLocked(true);
      setSuccessMessage('Budget has been locked successfully! You can now create a forecast.');
    } catch (error) {
      console.error('Error locking budget:', error);
      alert('Error locking budget: ' + error.message);
    }
  };

  const handleCreateForecast = async () => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      await createForecastFromBudget(selectedYear);
      setActiveTab('forecast');
      alert('Forecast created successfully from your budget!');
    } catch (error) {
      console.error('Error creating forecast:', error);
      alert('Error creating forecast: ' + error.message);
    }
  };

  const openAddCategoryModal = () => {
    setAddModalType('category');
    setAddModalParent(null);
    setShowCategoryModal(true);
    setEditName('');
  };

  const openAddLineItemModal = (category) => {
    setAddModalType('lineItem');
    setAddModalParent(category);
    setShowLineItemModal(true);
    setEditName('');
  };

  const handleCategoryNameClick = (cat) => {
    setEditingCategory(cat.id);
    setEditName(cat.name);
  };

  const handleLineItemNameClick = (item) => {
    setEditingLineItem(item.line_item_id);
    setEditName(item.line_item_name);
  };

  const saveCategoryName = async (cat) => {
    try {
      await updateCategoryName(cat.id, editName);
    setEditingCategory(null);
      setEditName('');
    } catch (error) {
      console.error('Error saving category name:', error);
    }
  };

  const saveLineItemName = async (item) => {
    try {
      await updateLineItemName(item.line_item_id, editName);
    setEditingLineItem(null);
      setEditName('');
    } catch (error) {
      console.error('Error saving line item name:', error);
    }
  };

  const batchSaveBudgetChanges = async (changes) => {
    // Implementation for batch saving
    console.log('Batch save changes:', changes);
  };

  // Group comparison data for easier access
  const groupedComparisonDataFallback = useCallback(() => {
    const grouped = {};
    comparisonData.forEach(item => {
      const categoryName = (item.category_name || 'Uncategorized').trim().toLowerCase();
      if (!grouped[categoryName]) {
        grouped[categoryName] = {
          type: item.type,
          items: []
        };
      }
      grouped[categoryName].items.push(item);
    });
    console.log('Grouped comparison data:', Object.keys(grouped), grouped);
    return grouped;
  }, [comparisonData]);

  const calculateComparisonTotals = useCallback(() => {
    console.log('calculateComparisonTotals called with comparisonData:', comparisonData.length, 'items');
    
    const totals = {
      budget: {
        revenue: Array(12).fill(0),
        expense: Array(12).fill(0),
        profitLoss: Array(12).fill(0)
      },
      forecast: {
        revenue: Array(12).fill(0),
        expense: Array(12).fill(0),
        profitLoss: Array(12).fill(0)
      }
    };
    
    comparisonData.forEach(item => {
      for (let month = 1; month <= 12; month++) {
        const budgetAmount = item.budget[`month_${month}`] || 0;
        const forecastAmount = item.forecast[`month_${month}`] || 0;
        
        if (item.type === 'revenue') {
          totals.budget.revenue[month - 1] += budgetAmount;
          totals.forecast.revenue[month - 1] += forecastAmount;
        } else {
          totals.budget.expense[month - 1] += Math.abs(budgetAmount);
          totals.forecast.expense[month - 1] += Math.abs(forecastAmount);
        }
      }
    });
    
    // Calculate profit/loss
  for (let i = 0; i < 12; i++) {
      totals.budget.profitLoss[i] = totals.budget.revenue[i] - totals.budget.expense[i];
      totals.forecast.profitLoss[i] = totals.forecast.revenue[i] - totals.forecast.expense[i];
    }
    
    console.log('Comparison totals calculated:', totals);
    return totals;
  }, [comparisonData]);

  // Helper: for a given month, are all line items locked?
  const isMonthLocked = (monthNum) => {
    for (const cat of categories) {
      const key = cat.name.trim().toLowerCase();
      const data = groupedBudgetData[key] || { items: [] };
      for (const item of data.items) {
        if (!item[`actual_month_${monthNum}`] || item[`actual_month_${monthNum}`] === 0) {
          return false;
        }
      }
    }
    return true;
  };

  // Auto-hide success notification after 1.5s
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 1500);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading budget data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading budget</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <button
                onClick={clearError}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (categories.length === 0 && lineItems.length === 0) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
          <p className="text-gray-600 text-sm mb-6">Create your annual budget, lock it, then create a rolling forecast with actuals tracking.</p>
      </div>

        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No budget data yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first budget categories and line items.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
              >
                + Add Category
              </button>
              <button
                onClick={() => {
                  console.log('Create Sample Data Clicked');
                  handleCreateSampleData();
                }}
                disabled={creatingSampleData}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm font-medium"
              >
                {creatingSampleData ? 'Creating...' : 'Create Sample Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Category Modal */}
        <AddBudgetItemModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onAdd={handleAddCategory}
          onCreateCategory={handleAddCategory}
          categories={categories}
          type="category"
        />
      </div>
    );
  }

  // Show workflow guidance if no budget exists yet
  if (!hasBudget) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
          <p className="text-gray-600 text-sm mb-6">Create your annual budget, lock it, then create a rolling forecast with actuals tracking.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Workflow Guide</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ol className="list-decimal list-inside space-y-1">
                  <li><strong>Create Budget:</strong> Add categories and line items, then set your budget amounts</li>
                  <li><strong>Lock Budget:</strong> Once satisfied, lock the budget to prevent changes</li>
                  <li><strong>Create Forecast:</strong> System creates a forecast copy of your budget</li>
                  <li><strong>Track Actuals:</strong> Update forecast and actuals as the year progresses</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Creation Interface */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Step 1: Create Your Budget</h3>
          
          {/* Controls row */}
          <div className="mb-4 flex items-center gap-2 w-full">
            <button
              className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
              onClick={() => {
                console.log('Add Item Clicked');
                openAddLineItemModal(null);
              }}
            >
              + Add Item
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700"
              onClick={() => setShowQuickEditor(true)}
            >
              Quick Editor
            </button>
            <div className="ml-auto flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-32"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="flex items-center bg-purple-100 rounded-md p-0.5 shadow-inner">
                <button
                  onClick={() => setViewMode('months')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                    ${viewMode === 'months' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
                >
                  Months
                </button>
                <button
                  onClick={() => setViewMode('quarters')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                    ${viewMode === 'quarters' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
                >
                  Quarters
                </button>
              </div>
            </div>
          </div>

          {/* Budget Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-sm border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
                  {viewMode === 'months' ? (
                    months.map((m) => (
                      <th key={m} className="px-3 py-2 text-center font-medium text-gray-500">{m}</th>
                    ))
                  ) : (
                    ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                      <th key={q} className="px-3 py-2 text-center font-medium text-gray-500">{q}</th>
                    ))
                  )}
                  <th className="px-3 py-2 text-center font-medium text-gray-500 border-l border-gray-300">Full Year</th>
                </tr>
              </thead>
              <tbody>
                {/* Revenue group */}
                <tr className="bg-green-50 group cursor-pointer" onClick={() => setExpandRevenue(v => !v)}>
                  <td className="px-3 py-2 font-bold text-green-800 flex items-center gap-2 border-r border-gray-300">
                    <span className="inline-block w-4">{expandRevenue ? '▼' : '▶'}</span> Revenue
                    <button
                      onClick={e => { e.stopPropagation(); setAddModalType('category'); setAddCategoryType('revenue'); setAddModalParent(null); setShowCategoryModal(true); setEditName(''); }}
                      className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                      tabIndex={-1}
                    >
                      <span className="text-base font-bold leading-none text-purple-600">+</span>
                    </button>
                  </td>
                  {viewMode === 'months' ? (
                    totals.revenue.map((t, i) => (
                      <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
                    ))
                  ) : (
                    calculateQuarterlyTotals(totals.revenue).map((t, i) => (
                      <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
                    ))
                  )}
                  <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans font-bold">
                    {totals.revenue.reduce((sum, t) => sum + t, 0).toLocaleString()}
                  </td>
                </tr>
                
                {/* Revenue categories and line items */}
                {expandRevenue && categories.filter(cat => cat.type === 'revenue').map(cat => {
                  const key = cat.name.trim().toLowerCase();
                  const data = groupedBudgetData[key] || { items: [] };
                  return (
                    <React.Fragment key={cat.name}>
                      <tr className="bg-green-25 hover:bg-green-100 border-b border-green-50">
                        <td className="px-3 py-2 whitespace-nowrap border-r border-gray-300 relative">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center pl-6">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}
                                className="mr-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                              >
                                {expandedCategories.has(cat.name) ? '▼' : '▶'}
                              </button>
                              {editingCategory === cat.id ? (
                                <input
                                  className="border px-1 py-0.5 rounded text-sm font-sans"
                                  value={editName}
                                  autoFocus
                                  onChange={e => setEditName(e.target.value)}
                                  onBlur={() => saveCategoryName(cat)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveCategoryName(cat); }}
                                />
                              ) : (
                                <span onClick={() => handleCategoryNameClick(cat)} className="cursor-pointer hover:underline font-normal">{cat.name}</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); const catObj = cat; openAddLineItemModal(catObj ? { category_id: catObj.id } : null); }}
                              className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                              tabIndex={-1}
                            >
                              <span className="text-base font-bold leading-none text-purple-600">+</span>
                            </button>
                          </div>
                        </td>
                        {viewMode === 'months' ? (
                          Array(12).fill(0).map((_, i) => {
                            const total = data.items.reduce((sum, item) => sum + (item[`budget_month_${i + 1}`] || 0), 0);
                            return (
                              <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">{total.toLocaleString()}</td>
                            );
                          })
                        ) : (
                          calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                            data.items.reduce((sum, item) => sum + (item[`budget_month_${i + 1}`] || 0), 0)
                          )).map((t, i) => (
                            <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">{t.toLocaleString()}</td>
                          ))
                        )}
                        <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                          {data.items.reduce((sum, item) => sum + (item.budget_total || 0), 0).toLocaleString()}
                        </td>
                      </tr>
                      
                      {/* Line items for revenue categories */}
                      {expandedCategories.has(cat.name) && data.items.length === 0 && (
                        <tr className="bg-white border-b border-gray-200">
                          <td className="px-3 py-2 text-gray-400 pl-16 border-r border-gray-300" colSpan={viewMode === 'months' ? 14 : 6}>
                            No line items
                          </td>
                        </tr>
                      )}
                      
                      {expandedCategories.has(cat.name) && data.items.map((item) => (
                        <tr key={item.line_item_id} className="bg-white border-b border-gray-200">
                          <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-16 border-r border-gray-300 flex items-center justify-between">
                            <div className="flex-1">
                              {editingLineItem === item.line_item_id ? (
                                <input
                                  className="border px-1 py-0.5 rounded text-sm font-sans"
                                  value={editName}
                                  autoFocus
                                  onChange={e => setEditName(e.target.value)}
                                  onBlur={() => saveLineItemName(item)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveLineItemName(item); }}
                                />
                              ) : (
                                <span onClick={() => handleLineItemNameClick(item)} className="cursor-pointer hover:underline font-normal">{item.line_item_name}</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteLineItem(item.line_item_id); }}
                              className="ml-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-red-50"
                              tabIndex={-1}
                            >
                              <span className="text-xs font-bold leading-none text-red-500">-</span>
                            </button>
                          </td>
                          {viewMode === 'months' ? (
                            Array(12).fill(0).map((_, i) => (
                              <td key={i} className="px-2 py-1 text-center font-sans">
                                <input
                                  type="number"
                                  value={item[`budget_month_${i + 1}`] || 0}
                                  onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0, 'budget')}
                                  className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                />
                              </td>
                            ))
                          ) : (
                            calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => item[`budget_month_${i + 1}`] || 0)).map((val, quarterIdx) => (
                              <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                                <input
                                  type="number"
                                  value={val || 0}
                                  onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0, 'budget')}
                                  className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                />
                              </td>
                            ))
                          )}
                          <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                            {(item.budget_total || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
                
                {/* Costs group */}
                <tr className="bg-red-50 group cursor-pointer" onClick={() => setExpandCosts(v => !v)}>
                  <td className="px-3 py-2 font-bold text-red-800 flex items-center gap-2 border-r border-gray-300">
                    <span className="inline-block w-4">{expandCosts ? '▼' : '▶'}</span> Costs
                    <button
                      onClick={e => { e.stopPropagation(); setAddModalType('category'); setAddCategoryType('expense'); setAddModalParent(null); setShowCategoryModal(true); setEditName(''); }}
                      className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                      tabIndex={-1}
                    >
                      <span className="text-base font-bold leading-none text-purple-600">+</span>
                    </button>
                  </td>
                  {viewMode === 'months' ? (
                    totals.expense.map((t, i) => (
                      <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
                    ))
                  ) : (
                    calculateQuarterlyTotals(totals.expense).map((t, i) => (
                      <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
                    ))
                  )}
                  <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans font-bold">
                    {totals.expense.reduce((sum, t) => sum + t, 0).toLocaleString()}
                  </td>
                </tr>
                
                {/* Costs categories and line items */}
                {expandCosts && categories.filter(cat => cat.type === 'expense').map(cat => {
                  const key = cat.name.trim().toLowerCase();
                  const data = groupedBudgetData[key] || { items: [] };
                  return (
                    <React.Fragment key={cat.name}>
                      <tr className="bg-red-25 hover:bg-red-100 border-b border-red-50">
                        <td className="px-3 py-2 whitespace-nowrap border-r border-gray-300 relative">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center pl-6">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}
                                className="mr-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                              >
                                {expandedCategories.has(cat.name) ? '▼' : '▶'}
                              </button>
                              {editingCategory === cat.id ? (
                                <input
                                  className="border px-1 py-0.5 rounded text-sm font-sans"
                                  value={editName}
                                  autoFocus
                                  onChange={e => setEditName(e.target.value)}
                                  onBlur={() => saveCategoryName(cat)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveCategoryName(cat); }}
                                />
                              ) : (
                                <span onClick={() => handleCategoryNameClick(cat)} className="cursor-pointer hover:underline font-normal">{cat.name}</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); const catObj = cat; openAddLineItemModal(catObj ? { category_id: catObj.id } : null); }}
                              className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                              tabIndex={-1}
                            >
                              <span className="text-base font-bold leading-none text-purple-600">+</span>
                            </button>
                          </div>
                        </td>
                        {viewMode === 'months' ? (
                          Array(12).fill(0).map((_, i) => {
                            const total = data.items.reduce((sum, item) => sum + Math.abs(item[`month_${i + 1}`] || 0), 0);
                            return (
                              <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{total.toLocaleString()}</td>
                            );
                          })
                        ) : (
                          calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                            data.items.reduce((sum, item) => sum + Math.abs(item[`month_${i + 1}`] || 0), 0)
                          )).map((t, i) => (
                            <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{t.toLocaleString()}</td>
                          ))
                        )}
                        <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                          {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                        </td>
                      </tr>
                      
                      {/* Line items for expense categories */}
                      {expandedCategories.has(cat.name) && data.items.length === 0 && (
                        <tr className="bg-white border-b border-gray-200">
                          <td className="px-3 py-2 text-gray-400 pl-16 border-r border-gray-300" colSpan={viewMode === 'months' ? 14 : 6}>
                            No line items
                          </td>
                        </tr>
                      )}
                      
                      {expandedCategories.has(cat.name) && data.items.map((item) => (
                        <tr key={item.line_item_id} className="bg-white border-b border-gray-200">
                          <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-16 border-r border-gray-300 flex items-center justify-between">
                            <div className="flex-1">
                              {editingLineItem === item.line_item_id ? (
                                <input
                                  className="border px-1 py-0.5 rounded text-sm font-sans"
                                  value={editName}
                                  autoFocus
                                  onChange={e => setEditName(e.target.value)}
                                  onBlur={() => saveLineItemName(item)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveLineItemName(item); }}
                                />
                              ) : (
                                <span onClick={() => handleLineItemNameClick(item)} className="cursor-pointer hover:underline font-normal">{item.line_item_name}</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteLineItem(item.line_item_id); }}
                              className="ml-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-red-50"
                              tabIndex={-1}
                            >
                              <span className="text-xs font-bold leading-none text-red-500">-</span>
                            </button>
                          </td>
                          {viewMode === 'months' ? (
                            Array(12).fill(0).map((_, i) => (
                              <td key={i} className="px-2 py-1 text-center font-sans">
                                <input
                                  type="number"
                                  value={item[`month_${i + 1}`] || 0}
                                  onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0)}
                                  className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                />
                              </td>
                            ))
                          ) : (
                            calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => item[`month_${i + 1}`] || 0)).map((val, quarterIdx) => (
                              <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                                <input
                                  type="number"
                                  value={val || 0}
                                  onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0)}
                                  className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                />
                              </td>
                            ))
                          )}
                          <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                            {Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
                
                {/* Profit/Loss row */}
                <tr className="bg-blue-100">
                  <td className="px-3 py-2 text-blue-900 font-sans font-bold">Profit / Loss</td>
                  {viewMode === 'months' ? (
                    totals.profitLoss.map((t, i) => (
                      <td key={i} className={`px-2 py-1 text-center font-sans font-bold ${t >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{t.toLocaleString()}</td>
                    ))
                  ) : (
                    calculateQuarterlyTotals(totals.profitLoss).map((t, i) => (
                      <td key={i} className={`px-2 py-1 text-center font-sans font-bold ${t >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{t.toLocaleString()}</td>
                    ))
                  )}
                  <td className="px-3 py-2 text-center text-blue-900 border-l border-gray-300 font-sans font-bold">
                    <span className={totals.profitLoss.reduce((sum, t) => sum + t, 0) >= 0 ? 'text-blue-800' : 'text-red-800'}>
                      {totals.profitLoss.reduce((sum, t) => sum + t, 0).toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Lock Budget Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleLockBudget}
              className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
            >
              Lock Budget & Create Forecast
            </button>
          </div>
        </div>

        {/* Modals */}
        <AddBudgetItemModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onAdd={handleAddCategory}
          onCreateCategory={handleAddCategory}
          categories={categories}
          type="category"
        />
        <AddBudgetItemModal
          isOpen={showLineItemModal}
          onClose={() => setShowLineItemModal(false)}
          onAdd={handleAddLineItem}
          onCreateCategory={handleAddCategory}
          categories={categories}
          type="lineItem"
          parent={addModalParent}
          typeOverride={addCategoryType}
        />
        <QuickBudgetEditorModal
          isOpen={showQuickEditor}
          onClose={() => setShowQuickEditor(false)}
          onSave={batchSaveBudgetChanges}
          categories={categories}
          lineItems={lineItems}
          budgetData={budgetData}
        />
        <SideInfoModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
      </div>
    );
  }

  // Show locked budget state with option to create forecast
  if (hasBudget && !hasForecast) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
          <p className="text-gray-600 text-sm mb-6">Your budget is locked. Create a forecast to start tracking actuals.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Step 2: Create Forecast</h3>
          <p className="text-gray-600 mb-6">Your forecast will start as a copy of your budget, but you can update it as the year progresses and track actual performance.</p>
          
          <div className="flex justify-center">
            <button
              onClick={handleCreateForecast}
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
            >
              Create Forecast from Budget
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug logs for cost line issue
  console.log('DEBUG: budgetData', budgetData);
  console.log('DEBUG: groupedBudgetData', groupedBudgetData);
  console.log('DEBUG: expense categories', categories.filter(cat => cat.type === 'expense'));

  return (
    <>
      <div>
        {/* Heading and sub-description */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
            <p className="text-gray-600 mt-1 text-sm">Add and manage your revenue and cost lines. Expand/collapse groups to focus on what matters. All values are editable.</p>
          </div>
          <button
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
          >
            <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
            Help
          </button>
        </div>
      </div>
      <div>
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab('budget')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'budget'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'forecast'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Forecast
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'budget' && hasForecast && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {isBudgetLocked ? 'Budget Locked & Forecast Created' : 'Budget Unlocked'}
            </h3>
            <p className="text-blue-700 text-sm">
              {isBudgetLocked
                ? `Your budget for ${selectedYear} is locked and a forecast has been created. To make changes to the budget, unlock it below. Once unlocked, you can edit the budget and re-lock when done.`
                : `Your budget for ${selectedYear} is unlocked. You can edit the budget and re-lock when done.`}
            </p>
          </div>
          {isBudgetLocked ? (
            <button
              className="ml-4 px-3 py-1.5 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 shadow"
              onClick={async () => {
                if (!currentOrganization?.organization_id) {
                  alert('No organization selected!');
                  return;
                }
                try {
                  await budgetService.lockVersion(currentOrganization.organization_id, selectedYear, 'budget', false);
                  setIsBudgetLocked(false);
                  setSuccessMessage('Budget has been unlocked. You can now edit the budget.');
                } catch (err) {
                  alert('Error unlocking budget: ' + (err.message || JSON.stringify(err)));
                }
              }}
            >
              Unlock Budget
            </button>
          ) : (
              <button
              className="ml-4 px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow"
              onClick={handleLockBudget}
              >
              Lock Budget
              </button>
          )}
                </div>
      )}

      {activeTab === 'budget' ? (
        <>
            {/* Controls row */}
            <div className="mb-4 flex items-center gap-2 w-full">
              <button
                className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
                onClick={() => {
                  console.log('Add Item Clicked');
                  openAddLineItemModal(null);
                }}
              >
                + Add Item
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700"
                onClick={() => setShowQuickEditor(true)}
              >
                Quick Editor
              </button>
              <div className="ml-auto flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-32"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="flex items-center bg-purple-100 rounded-md p-0.5 shadow-inner">
                  <button
                    onClick={() => setViewMode('months')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                      ${viewMode === 'months' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
                  >
                    Months
                  </button>
                  <button
                    onClick={() => setViewMode('quarters')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                      ${viewMode === 'quarters' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
                  >
                    Quarters
                  </button>
                </div>
            </div>
          </div>

            {/* Budget Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
                    {viewMode === 'months' ? (
                      months.map((m) => (
                        <th key={m} className="px-3 py-2 text-center font-medium text-gray-500">{m}</th>
                      ))
                    ) : (
                      ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                        <th key={q} className="px-3 py-2 text-center font-medium text-gray-500">{q}</th>
                      ))
                    )}
                    <th className="px-3 py-2 text-center font-medium text-gray-500 border-l border-gray-300">Full Year</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Revenue group */}
                  <tr className="bg-green-50 group cursor-pointer" onClick={() => setExpandRevenue(v => !v)}>
                    <td className="px-3 py-2 font-bold text-green-800 flex items-center gap-2 border-r border-gray-300">
                      <span className="inline-block w-4">{expandRevenue ? '▼' : '▶'}</span> Revenue
                      <button
                        onClick={e => { e.stopPropagation(); setAddModalType('category'); setAddCategoryType('revenue'); setAddModalParent(null); setShowCategoryModal(true); setEditName(''); }}
                        className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                        tabIndex={-1}
                      >
                        <span className="text-base font-bold leading-none text-purple-600">+</span>
                      </button>
                    </td>
                    {viewMode === 'months' ? (
                        totals.revenue.map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                      ) : (
                        calculateQuarterlyTotals(totals.revenue).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                    )}
                    <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans font-bold">
                      {totals.revenue.reduce((sum, t) => sum + t, 0).toLocaleString()}
                    </td>
                  </tr>
                  
                  {/* Revenue categories and line items */}
                  {expandRevenue && categories.filter(cat => cat.type === 'revenue').map(cat => {
                    const key = cat.name.trim().toLowerCase();
                    const data = groupedBudgetData[key] || { items: [] };
                    return (
                      <React.Fragment key={cat.name}>
                        <tr className="bg-green-25 hover:bg-green-100 border-b border-green-50">
                          <td className="px-3 py-2 whitespace-nowrap border-r border-gray-300 relative">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center pl-6">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}
                                  className="mr-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                                >
                                  {expandedCategories.has(cat.name) ? '▼' : '▶'}
                                </button>
                                {editingCategory === cat.id ? (
                                  <input
                                    className="border px-1 py-0.5 rounded text-sm font-sans"
                                    value={editName}
                                    autoFocus
                                    onChange={e => setEditName(e.target.value)}
                                    onBlur={() => saveCategoryName(cat)}
                                    onKeyDown={e => { if (e.key === 'Enter') saveCategoryName(cat); }}
                                  />
                                ) : (
                                  <span onClick={() => handleCategoryNameClick(cat)} className="cursor-pointer hover:underline font-normal">{cat.name}</span>
                                )}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); const catObj = cat; openAddLineItemModal(catObj ? { category_id: catObj.id } : null); }}
                                className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                                tabIndex={-1}
                              >
                                <span className="text-base font-bold leading-none text-purple-600">+</span>
                              </button>
                            </div>
                        </td>
                        {viewMode === 'months' ? (
                            Array(12).fill(0).map((_, i) => {
                            const total = data.items.reduce((sum, item) => sum + (item[`month_${i + 1}`] || 0), 0);
                              return (
                              <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">{total.toLocaleString()}</td>
                              );
                            })
                        ) : (
                          calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                              data.items.reduce((sum, item) => sum + (item[`month_${i + 1}`] || 0), 0)
                          )).map((t, i) => (
                              <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">{t.toLocaleString()}</td>
                            ))
                          )}
                          <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                            {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                          </td>
                        </tr>
                        
                        {/* Line items for revenue categories */}
                        {expandedCategories.has(cat.name) && data.items.length === 0 && (
                          <tr className="bg-white border-b border-gray-200">
                            <td className="px-3 py-2 text-gray-400 pl-16 border-r border-gray-300" colSpan={viewMode === 'months' ? 14 : 6}>
                              No line items
                            </td>
                          </tr>
                        )}
                        
                        {expandedCategories.has(cat.name) && data.items.map((item) => (
                          <tr key={item.line_item_id} className="bg-white border-b border-gray-200">
                            <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-16 border-r border-gray-300 flex items-center justify-between">
                              <div className="flex-1">
                                {editingLineItem === item.line_item_id ? (
                                  <input
                                    className="border px-1 py-0.5 rounded text-sm font-sans"
                                    value={editName}
                                    autoFocus
                                    onChange={e => setEditName(e.target.value)}
                                    onBlur={() => saveLineItemName(item)}
                                    onKeyDown={e => { if (e.key === 'Enter') saveLineItemName(item); }}
                                  />
                                ) : (
                                  <span onClick={() => handleLineItemNameClick(item)} className="cursor-pointer hover:underline font-normal">{item.line_item_name}</span>
                                )}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteLineItem(item.line_item_id); }}
                                className="ml-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-red-50"
                                tabIndex={-1}
                              >
                                <span className="text-xs font-bold leading-none text-red-500">-</span>
                              </button>
                            </td>
                              {viewMode === 'months' ? (
                              Array(12).fill(0).map((_, i) => (
                                <td key={i} className="px-2 py-1 text-center font-sans">
                                    <input
                                      type="number"
                                      value={item[`month_${i + 1}`] || 0}
                                      onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0)}
                                      className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    />
                                </td>
                              ))
                            ) : (
                              calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => item[`month_${i + 1}`] || 0)).map((val, quarterIdx) => (
                                <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                                    <input
                                      type="number"
                                      value={val || 0}
                                      onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0)}
                                      className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    />
                                </td>
                              ))
                            )}
                            <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                              {Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                            </td>
                          </tr>
                      ))}
                    </React.Fragment>
                    );
                  })}
                  
                  {/* Costs group */}
                  <tr className="bg-red-50 group cursor-pointer" onClick={() => setExpandCosts(v => !v)}>
                    <td className="px-3 py-2 font-bold text-red-800 flex items-center gap-2 border-r border-gray-300">
                      <span className="inline-block w-4">{expandCosts ? '▼' : '▶'}</span> Costs
                      <button
                        onClick={e => { e.stopPropagation(); setAddModalType('category'); setAddCategoryType('expense'); setAddModalParent(null); setShowCategoryModal(true); setEditName(''); }}
                        className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                        tabIndex={-1}
                      >
                        <span className="text-base font-bold leading-none text-purple-600">+</span>
                      </button>
                    </td>
                    {viewMode === 'months' ? (
                        totals.expense.map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
                          ))
                        ) : (
                        calculateQuarterlyTotals(totals.expense).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                    )}
                    <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans font-bold">
                      {totals.expense.reduce((sum, t) => sum + t, 0).toLocaleString()}
                    </td>
                      </tr>
                  
                  {/* Costs categories and line items */}
                  {expandCosts && categories.filter(cat => cat.type === 'expense').map(cat => {
                    const key = cat.name.trim().toLowerCase();
                    const data = groupedBudgetData[key] || { items: [] };
                    return (
                      <React.Fragment key={cat.name}>
                        <tr className="bg-red-25 hover:bg-red-100 border-b border-red-50">
                          <td className="px-3 py-2 whitespace-nowrap border-r border-gray-300 relative">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center pl-6">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}
                                  className="mr-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                                >
                                  {expandedCategories.has(cat.name) ? '▼' : '▶'}
                                </button>
                                {editingCategory === cat.id ? (
                                  <input
                                    className="border px-1 py-0.5 rounded text-sm font-sans"
                                    value={editName}
                                    autoFocus
                                    onChange={e => setEditName(e.target.value)}
                                    onBlur={() => saveCategoryName(cat)}
                                    onKeyDown={e => { if (e.key === 'Enter') saveCategoryName(cat); }}
                                  />
                                ) : (
                                  <span onClick={() => handleCategoryNameClick(cat)} className="cursor-pointer hover:underline font-normal">{cat.name}</span>
                                )}
                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); const catObj = cat; openAddLineItemModal(catObj ? { category_id: catObj.id } : null); }}
                                  className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                                  tabIndex={-1}
                                >
                                  <span className="text-base font-bold leading-none text-purple-600">+</span>
                                </button>
              </div>
                                </td>
                          {viewMode === 'months' ? (
                            Array(12).fill(0).map((_, i) => {
                              const total = data.items.reduce((sum, item) => sum + Math.abs(item[`month_${i + 1}`] || 0), 0);
                              return (
                              <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{total.toLocaleString()}</td>
                              );
                            })
                          ) : (
                            calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                              data.items.reduce((sum, item) => sum + Math.abs(item[`month_${i + 1}`] || 0), 0)
                            )).map((t, i) => (
                              <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{t.toLocaleString()}</td>
                            ))
                          )}
                          <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                            {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                          </td>
                        </tr>
                        
                        {/* Line items for expense categories */}
                        {expandedCategories.has(cat.name) && data.items.length === 0 && (
                          <tr className="bg-white border-b border-gray-200">
                            <td className="px-3 py-2 text-gray-400 pl-16 border-r border-gray-300" colSpan={viewMode === 'months' ? 14 : 6}>
                              No line items
                            </td>
                          </tr>
                        )}
                        
                        {expandedCategories.has(cat.name) && data.items.map((item) => (
                          <tr key={item.line_item_id} className="bg-white border-b border-gray-200">
                            <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-16 border-r border-gray-300 flex items-center justify-between">
                              <div className="flex-1">
                                {editingLineItem === item.line_item_id ? (
                                  <input
                                    className="border px-1 py-0.5 rounded text-sm font-sans"
                                    value={editName}
                                    autoFocus
                                    onChange={e => setEditName(e.target.value)}
                                    onBlur={() => saveLineItemName(item)}
                                    onKeyDown={e => { if (e.key === 'Enter') saveLineItemName(item); }}
                                  />
                                ) : (
                                  <span onClick={() => handleLineItemNameClick(item)} className="cursor-pointer hover:underline font-normal">{item.line_item_name}</span>
                                )}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteLineItem(item.line_item_id); }}
                                className="ml-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-red-50"
                                tabIndex={-1}
                              >
                                <span className="text-xs font-bold leading-none text-red-500">-</span>
                              </button>
                            </td>
                            {viewMode === 'months' ? (
                              Array(12).fill(0).map((_, i) => (
                                <td key={i} className="px-2 py-1 text-center font-sans">
                                  <input
                                    type="number"
                                    value={item[`month_${i + 1}`] || 0}
                                    onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0)}
                                    className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  />
                                </td>
                              ))
                            ) : (
                              calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => item[`month_${i + 1}`] || 0)).map((val, quarterIdx) => (
                                <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                                  <input
                                    type="number"
                                    value={val || 0}
                                    onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0)}
                                    className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  />
                                </td>
                              ))
                            )}
                            <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                              {Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Profit/Loss row */}
                  <tr className="bg-blue-100">
                    <td className="px-3 py-2 text-blue-900 font-sans font-bold">Profit / Loss</td>
                    {viewMode === 'months' ? (
                      totals.profitLoss.map((t, i) => (
                        <td key={i} className={`px-2 py-1 text-center font-sans font-bold ${t >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{t.toLocaleString()}</td>
                      ))
                    ) : (
                      calculateQuarterlyTotals(totals.profitLoss).map((t, i) => (
                        <td key={i} className={`px-2 py-1 text-center font-sans font-bold ${t >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{t.toLocaleString()}</td>
                      ))
                    )}
                    <td className="px-3 py-2 text-center text-blue-900 border-l border-gray-300 font-sans font-bold">
                      <span className={totals.profitLoss.reduce((sum, t) => sum + t, 0) >= 0 ? 'text-blue-800' : 'text-red-800'}>
                        {totals.profitLoss.reduce((sum, t) => sum + t, 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            {/* Controls row for forecast */}
            <div className="mb-4 flex items-center gap-2 w-full">
              <button
                className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
                onClick={() => {
                  console.log('Add Item Clicked');
                  openAddLineItemModal(null);
                }}
              >
                + Add Item
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm font-semibold hover:bg-gray-700"
                onClick={() => setShowQuickEditor(true)}
              >
                Quick Editor
              </button>
              <div className="ml-auto flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showBudgetComparison}
                    onChange={(e) => {
                      console.log('Comparison checkbox changed:', e.target.checked);
                      console.log('Current comparisonData:', comparisonData.length, 'items');
                      console.log('Current comparisonTotals:', comparisonTotals);
                      console.log('Sample comparisonData item:', comparisonData[0]);
                      setShowBudgetComparison(e.target.checked);
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Vs Budget
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-32"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="flex items-center bg-purple-100 rounded-md p-0.5 shadow-inner">
                  <button
                    onClick={() => setViewMode('months')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                      ${viewMode === 'months' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
                  >
                    Months
                  </button>
                  <button
                    onClick={() => setViewMode('quarters')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                      ${viewMode === 'quarters' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
                  >
                    Quarters
                  </button>
                </div>
              </div>
            </div>

            {/* Forecast Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
                    {months.flatMap((m, i) => {
                      const monthNum = i + 1;
                      const locked = isMonthLocked(monthNum);
                      const cells = [];
                      if (showBudgetComparison) {
                        cells.push(<th key={`budget-${m}`} className="px-2 py-2 text-center font-medium text-gray-500">{m} Budget</th>);
                      }
                      cells.push(
                        <th key={`forecast-${m}`} className="px-2 py-2 text-center font-medium text-gray-500" style={{ borderRight: '2px solid #E5E7EB' }}>
                              <div>
                            <div>{m}</div>
                            <div className="flex items-center justify-center gap-1 mt-0.5">
                              {locked ? (
                                <>
                                  <span>Actual</span>
                                  <svg className="ml-1 w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.5A4.5 4.5 0 008 7.5v3m8.25 0A2.25 2.25 0 0120 12.75v4.5A2.25 2.25 0 0117.75 19.5h-11.5A2.25 2.25 0 014 17.25v-4.5A2.25 2.25 0 016.25 10.5h11.5zm-6 3.75h.008v.008H12.5v-.008z" /></svg>
                                </>
                              ) : (
                                <>
                                  <span>Forecast</span>
                                  <button
                                    className="ml-1 text-purple-400 hover:text-purple-700"
                                    onClick={() => setLockModal({ open: true, lineItemId: null, monthNum })}
                                    title={`Lock ${m} as Actuals`}
                                    type="button"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5A4.5 4.5 0 008 7.5v3m8.25 0A2.25 2.25 0 0120 12.75v4.5A2.25 2.25 0 0117.75 19.5h-11.5A2.25 2.25 0 014 17.25v-4.5A2.25 2.25 0 016.25 10.5h11.5zm-6 3.75h.008v.008H12.5v-.008z" />
                                    </svg>
                                  </button>
                                </>
                              )}
                </div>
              </div>
                        </th>
                      );
                      return cells;
                    })}
                    <th className="px-3 py-2 text-center font-medium text-gray-500 border-l border-gray-300">Full Year</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Revenue group */}
                  <tr className="bg-green-50 group cursor-pointer" onClick={() => setExpandRevenue(v => !v)}>
                    <td className="px-3 py-2 font-bold text-green-800 flex items-center gap-2 border-r border-gray-300">
                      <span className="inline-block w-4">{expandRevenue ? '▼' : '▶'}</span> Revenue
                    </td>
                    {months.flatMap((m, i) => {
                      const monthNum = i + 1;
                      const cells = [];
                      if (showBudgetComparison) {
                        cells.push(
                          <td key={`budget-total-${i}`} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{totals.revenue[i].toLocaleString()}</td>
                        );
                      }
                      cells.push(
                        <td key={`forecast-total-${i}`} className="px-2 py-1 text-center text-green-800 font-sans font-bold"></td>
                      );
                      return cells;
                    })}
                    <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans font-bold">
                      {totals.revenue.reduce((sum, t) => sum + t, 0).toLocaleString()}
                    </td>
                  </tr>
                  {/* Revenue categories and line items */}
                  {expandRevenue && categories.filter(cat => cat.type === 'revenue').map(cat => {
                    const key = cat.name.trim().toLowerCase();
                    const data = groupedBudgetData[key] || { items: [] };
                    // Get all line items for this category, not just those with forecast data
                    const allLineItems = lineItems.filter(item => item.category_id === cat.id);
                    
                    return (
                      <React.Fragment key={cat.name}>
                        {allLineItems.map((lineItem) => {
                          // Find the corresponding budget data for this line item
                          const budgetItem = data.items.find(item => item.line_item_id === lineItem.id) || {};
                          
                          return (
                            <tr key={lineItem.id} className="bg-white border-b border-gray-200">
                              <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-8 border-r border-gray-300">{lineItem.name}</td>
                              {months.flatMap((m, i) => {
                                const monthNum = i + 1;
                                const now = new Date();
                                const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && monthNum < now.getMonth() + 1);
                                const isCurrentOrFuture = !isPast;
                                const cells = [];
                                if (showBudgetComparison) {
                                  cells.push(
                                    <td key={`budget-${lineItem.id}-${i}`} className="px-2 py-1 text-center font-sans bg-gray-50">
                                      {budgetItem[`budget_month_${monthNum}`] || 0}
                                    </td>
                                  );
                                }
                                cells.push(
                                  <td key={`forecast-${lineItem.id}-${i}`} className="px-2 py-1 text-center font-sans" style={{ borderRight: '2px solid #E5E7EB' }}>
                                    {budgetItem[`actual_month_${monthNum}`] != null && budgetItem[`actual_month_${monthNum}`] !== 0 ? (
                                      <input
                                        type="number"
                                        value={budgetItem[`actual_month_${monthNum}`]}
                                        disabled
                                        className="w-20 rounded border-gray-200 text-right px-2 py-1 bg-gray-100 text-gray-500 text-sm"
                                      />
                                    ) : (
                                      <input
                                        type="number"
                                        value={budgetItem[`forecast_month_${monthNum}`] || 0}
                                        onChange={e => handleValueChange(lineItem.id, monthNum, parseFloat(e.target.value) || 0, 'forecast')}
                                        className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                      />
                                    )}
                                  </td>
                                );
                                return cells;
                              })}
                              <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                                {/* Full year sum: sum actuals for past, forecast for current/future */}
                                {(() => {
                                  let sum = 0;
                                  for (let i = 1; i <= 12; i++) {
                                    const now = new Date();
                                    const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && i < now.getMonth() + 1);
                                    sum += isPast ? (budgetItem[`actual_month_${i}`] || 0) : (budgetItem[`forecast_month_${i}`] || 0);
                                  }
                                  return sum.toLocaleString();
                                })()}
                          </td>
                          </tr>
                          );
                        })}
                    </React.Fragment>
                    );
                  })}
                  {/* Costs group */}
                  <tr className="bg-red-50 group cursor-pointer" onClick={() => setExpandCosts(v => !v)}>
                    <td className="px-3 py-2 font-bold text-red-800 flex items-center gap-2 border-r border-gray-300">
                      <span className="inline-block w-4">{expandCosts ? '▼' : '▶'}</span> Costs
                    </td>
                    {months.flatMap((m, i) => {
                      const monthNum = i + 1;
                      const cells = [];
                      if (showBudgetComparison) {
                        cells.push(
                          <td key={`budget-total-${i}`} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{totals.expense[i].toLocaleString()}</td>
                        );
                      }
                      cells.push(
                        <td key={`forecast-total-${i}`} className="px-2 py-1 text-center text-red-800 font-sans font-bold"></td>
                      );
                      return cells;
                    })}
                    <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans font-bold">
                      {totals.expense.reduce((sum, t) => sum + t, 0).toLocaleString()}
                    </td>
                  </tr>
                  {/* Costs categories and line items */}
                  {expandCosts && categories.filter(cat => cat.type === 'expense').map(cat => {
                    const key = cat.name.trim().toLowerCase();
                    const data = groupedBudgetData[key] || { items: [] };
                    // Get all line items for this category, not just those with forecast data
                    const allLineItems = lineItems.filter(item => item.category_id === cat.id);
                    
                    return (
                      <React.Fragment key={cat.name}>
                        {allLineItems.map((lineItem) => {
                          // Find the corresponding budget data for this line item
                          const budgetItem = data.items.find(item => item.line_item_id === lineItem.id) || {};
                          
                          return (
                            <tr key={lineItem.id} className="bg-white border-b border-gray-200">
                              <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-8 border-r border-gray-300">{lineItem.name}</td>
                              {months.flatMap((m, i) => {
                                const monthNum = i + 1;
                                const now = new Date();
                                const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && monthNum < now.getMonth() + 1);
                                const isCurrentOrFuture = !isPast;
                                const cells = [];
                                if (showBudgetComparison) {
                                  cells.push(
                                    <td key={`budget-${lineItem.id}-${i}`} className="px-2 py-1 text-center font-sans bg-gray-50">
                                      {budgetItem[`budget_month_${monthNum}`] || 0}
                                    </td>
                                  );
                                }
                                cells.push(
                                  <td key={`forecast-${lineItem.id}-${i}`} className="px-2 py-1 text-center font-sans" style={{ borderRight: '2px solid #E5E7EB' }}>
                                    {budgetItem[`actual_month_${monthNum}`] != null && budgetItem[`actual_month_${monthNum}`] !== 0 ? (
                                      <input
                                        type="number"
                                        value={budgetItem[`actual_month_${monthNum}`]}
                                        disabled
                                        className="w-20 rounded border-gray-200 text-right px-2 py-1 bg-gray-100 text-gray-500 text-sm"
                                      />
                                    ) : (
                                      <input
                                        type="number"
                                        value={budgetItem[`forecast_month_${monthNum}`] || 0}
                                        onChange={e => handleValueChange(lineItem.id, monthNum, parseFloat(e.target.value) || 0, 'forecast')}
                                        className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                      />
                                    )}
                                  </td>
                                );
                                return cells;
                              })}
                              <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                                {/* Full year sum: sum actuals for past, forecast for current/future */}
                                {(() => {
                                  let sum = 0;
                                  for (let i = 1; i <= 12; i++) {
                                    const now = new Date();
                                    const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && i < now.getMonth() + 1);
                                    sum += isPast ? (budgetItem[`actual_month_${i}`] || 0) : (budgetItem[`forecast_month_${i}`] || 0);
                                  }
                                  return sum.toLocaleString();
                                })()}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                  {/* Profit/Loss row */}
                  <tr className="bg-blue-100">
                    <td className="px-3 py-2 text-blue-900 font-sans font-bold">Profit / Loss</td>
                    {months.flatMap((m, i) => {
                      const monthNum = i + 1;
                      const cells = [];
                      if (showBudgetComparison) {
                        cells.push(
                          <td key={`budget-pl-${i}`} className={`px-2 py-1 text-center font-sans font-bold ${totals.profitLoss[i] >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                            {totals.profitLoss[i].toLocaleString()}
                          </td>
                        );
                      }
                      cells.push(
                        <td key={`forecast-pl-${i}`} className={`px-2 py-1 text-center font-sans font-bold ${totals.profitLoss[i] >= 0 ? 'text-blue-800' : 'text-red-800'}`} style={{ borderRight: '2px solid #E5E7EB' }}>
                          {/* Calculate forecast P&L: revenue - expenses */}
                          {(() => {
                            let revenue = 0;
                            let expenses = 0;
                            budgetData.forEach(item => {
                              const now = new Date();
                              const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && monthNum < now.getMonth() + 1);
                              const amount = isPast ? (item[`actual_month_${monthNum}`] || 0) : (item[`forecast_month_${monthNum}`] || 0);
                              if (item.type === 'revenue') {
                                revenue += amount;
                              } else {
                                expenses += Math.abs(amount);
                              }
                            });
                            const profitLoss = revenue - expenses;
                            return profitLoss.toLocaleString();
                          })()}
                        </td>
                      );
                      return cells;
                    })}
                    <td className="px-3 py-2 text-center text-blue-900 border-l border-gray-300 font-sans font-bold">
                      {/* Full year P&L */}
                      {(() => {
                        let totalRevenue = 0;
                        let totalExpenses = 0;
                        for (let i = 1; i <= 12; i++) {
                          const now = new Date();
                          const isPast = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && i < now.getMonth() + 1);
                          budgetData.forEach(item => {
                            const amount = isPast ? (item[`actual_month_${i}`] || 0) : (item[`forecast_month_${i}`] || 0);
                            if (item.type === 'revenue') {
                              totalRevenue += amount;
                            } else {
                              totalExpenses += Math.abs(amount);
                            }
                          });
                        }
                        const totalProfitLoss = totalRevenue - totalExpenses;
                        return (
                          <span className={totalProfitLoss >= 0 ? 'text-blue-800' : 'text-red-800'}>
                            {totalProfitLoss.toLocaleString()}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </>
      )}
    </div>
      <AddBudgetItemModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onAdd={handleAddCategory}
        onCreateCategory={handleAddCategory}
        categories={categories}
        type="category"
      />
      <QuickBudgetEditorModal
        isOpen={showQuickEditor}
        onClose={() => setShowQuickEditor(false)}
        categories={categories}
        loadBudgetData={loadBudgetData}
      />
      <SideInfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
      {lockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 border-2 border-purple-200 font-sans">
            <h3 className="text-xl font-bold mb-3 text-purple-700 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V7.5A4.5 4.5 0 008 7.5v3m8.25 0A2.25 2.25 0 0120 12.75v4.5A2.25 2.25 0 0117.75 19.5h-11.5A2.25 2.25 0 014 17.25v-4.5A2.25 2.25 0 016.25 10.5h11.5zm-6 3.75h.008v.008H12.5v-.008z" /></svg>
              Lock Month as Actuals
            </h3>
            <p className="mb-6 text-gray-700">Are you sure you want to lock <span className="font-semibold text-purple-700">{months[lockModal.monthNum - 1]}</span> as actuals for all forecasted line items?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium border border-gray-200"
                onClick={() => setLockModal({ open: false, lineItemId: null, monthNum: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-semibold shadow"
                onClick={async () => {
                  for (const cat of categories) {
                    const key = cat.name.trim().toLowerCase();
                    const data = groupedBudgetData[key] || { items: [] };
                    for (const item of data.items) {
                      if (item[`actual_month_${lockModal.monthNum}`] == null || item[`actual_month_${lockModal.monthNum}`] === 0) {
                        await lockForecastAsActual(item.line_item_id, lockModal.monthNum);
                      }
                    }
                  }
                  setLockModal({ open: false, lineItemId: null, monthNum: null });
                }}
              >
                Lock
              </button>
            </div>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-purple-50 text-purple-700 border-b-2 border-purple-300 rounded-b-xl px-8 py-3 shadow-md font-bold text-base flex items-center gap-3" style={{ minWidth: 320, maxWidth: 600 }}>
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {successMessage}
          </div>
        </div>
      )}
    </>
  );
};

export default Budget; 