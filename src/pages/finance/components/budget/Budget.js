import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../../../../hooks/useBudget';
import AddBudgetItemModal from './AddBudgetItemModal';
import BudgetTable from './BudgetTable';
import { budgetService } from '../../../../services/budgetService';
import { useAuth } from '../../../../contexts/AuthContext';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import QuickBudgetEditorModal from './QuickBudgetEditorModal';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Budget = () => {
  const navigate = useNavigate();
  const { currentOrganization } = useAuth();
  const {
    budgetData,
    categories,
    lineItems,
    loading,
    error,
    selectedYear,
    isForecast,
    showBudgetComparison,
    comparisonData,
    setSelectedYear,
    setIsForecast,
    setShowBudgetComparison,
    updateBudgetValue,
    createLineItem,
    createCategory,
    deleteLineItem,
    groupedBudgetData,
    totals,
    comparisonTotals,
    loadComparisonData,
    clearError,
    loadBudgetData
  } = useBudget();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [expandRevenue, setExpandRevenue] = useState(true);
  const [expandCosts, setExpandCosts] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState('months'); // 'months' or 'quarters'
  const [activeTab, setActiveTab] = useState('budget'); // 'budget' or 'forecast'
  const [creatingSampleData, setCreatingSampleData] = useState(false);
  const [addModalType, setAddModalType] = useState(null); // 'category' or 'lineItem'
  const [addModalParent, setAddModalParent] = useState(null); // category or null
  const [editingCategory, setEditingCategory] = useState(null); // category id
  const [editingLineItem, setEditingLineItem] = useState(null); // line item id
  const [editName, setEditName] = useState('');
  const [addCategoryType, setAddCategoryType] = useState('revenue');
  const [showQuickEditor, setShowQuickEditor] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Update forecast mode when tab changes
  useEffect(() => {
    setIsForecast(activeTab === 'forecast');
  }, [activeTab, setIsForecast]);

  // Load comparison data when forecast tab is active and comparison is enabled
  useEffect(() => {
    if (activeTab === 'forecast' && currentOrganization?.id) {
      loadComparisonData();
    }
  }, [activeTab, currentOrganization?.id, loadComparisonData]);

  // Force reload data when component mounts
  useEffect(() => {
    if (currentOrganization?.id) {
      console.log('Budget useEffect running, calling loadBudgetData');
      loadBudgetData();
    }
  }, [currentOrganization?.id, loadBudgetData]);

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

  const handleValueChange = async (lineItemId, month, value) => {
    const amount = parseFloat(value) || 0;
    await updateBudgetValue(lineItemId, month, amount);
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
    if (!currentOrganization?.id) return;
    
    setCreatingSampleData(true);
    try {
      await budgetService.createSampleData(currentOrganization.id);
      await loadBudgetData();
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert(error.message || error.toString());
    } finally {
      setCreatingSampleData(false);
    }
  };

  const openAddCategoryModal = () => {
    setAddModalType('category');
    setAddModalParent(null);
    setShowCategoryModal(true);
  };

  const openAddLineItemModal = (category) => {
    setAddModalType('lineItem');
    setAddModalParent(category);
    setShowAddModal(true);
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
    if (editName.trim() && editName !== cat.name) {
      await budgetService.updateCategory(cat.id, { name: editName });
      await loadBudgetData();
    }
    setEditingCategory(null);
  };

  const saveLineItemName = async (item) => {
    if (editName.trim() && editName !== item.line_item_name) {
      await budgetService.updateLineItem(item.line_item_id, { name: editName });
      await loadBudgetData();
    }
    setEditingLineItem(null);
  };

  const batchSaveBudgetChanges = async (changes) => {
    // TODO: implement batch save logic
    return Promise.resolve();
  };

  // Fallback: if comparisonData is empty, use budgetData as the budget side for comparison
  const effectiveComparisonData = comparisonData.length > 0 ? comparisonData : budgetData.map(item => ({
    ...item,
    budget: Object.fromEntries(Array.from({length: 12}, (_, i) => [`month_${i+1}`, item[`month_${i+1}`] || 0])),
    forecast: Object.fromEntries(Array.from({length: 12}, (_, i) => [`month_${i+1}`, 0])),
  }));

  // Use effectiveComparisonData in groupedComparisonDataFallback and totals
  const groupedComparisonDataFallback = useCallback(() => {
    console.log('groupedComparisonDataFallback called with:', effectiveComparisonData.length, 'items');
    const grouped = {};
    effectiveComparisonData.forEach(item => {
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
  }, [effectiveComparisonData]);

  const calculateComparisonTotals = useCallback(() => {
    console.log('calculateComparisonTotals called with comparisonData:', effectiveComparisonData.length, 'items');
    
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
    
    effectiveComparisonData.forEach(item => {
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
  }, [effectiveComparisonData]);

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
          <p className="text-gray-600 text-sm mb-6">Add and manage your revenue and cost lines. Expand/collapse groups to focus on what matters. All values are editable.</p>
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

  // Debug logs for cost line issue
  console.log('DEBUG: budgetData', budgetData);
  console.log('DEBUG: groupedBudgetData', groupedBudgetData);
  console.log('DEBUG: expense categories', categories.filter(cat => cat.type === 'expense'));

  return (
    <>
      <div>
        {/* Heading and sub-description */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
          <p className="text-gray-600 text-sm mb-6">Add and manage your revenue and cost lines. Expand/collapse groups to focus on what matters. All values are editable.</p>
        </div>

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
            <BudgetTable
              categories={categories}
              lineItems={lineItems}
              groupedBudgetData={groupedBudgetData}
              groupedComparisonDataFallback={groupedComparisonDataFallback}
              totals={totals}
              comparisonTotals={comparisonTotals}
              viewMode={viewMode}
              showBudgetComparison={showBudgetComparison}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              editingCategory={editingCategory}
              editName={editName}
              setEditName={setEditName}
              saveCategoryName={saveCategoryName}
              handleCategoryNameClick={handleCategoryNameClick}
              handleAddLineItemModal={openAddLineItemModal}
              handleDeleteLineItem={handleDeleteLineItem}
              handleLineItemNameClick={handleLineItemNameClick}
              editingLineItem={editingLineItem}
              saveLineItemName={saveLineItemName}
              handleValueChange={handleValueChange}
              calculateQuarterlyTotals={calculateQuarterlyTotals}
              months={months}
              expandRevenue={expandRevenue}
              setExpandRevenue={setExpandRevenue}
              expandCosts={expandCosts}
              setExpandCosts={setExpandCosts}
              setAddModalType={setAddModalType}
              setAddCategoryType={setAddCategoryType}
              setAddModalParent={setAddModalParent}
              setShowCategoryModal={setShowCategoryModal}
            />
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
              <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
                    {viewMode === 'months' ? (
                      months.map((m) => (
                        <th key={m} className="px-3 py-2 text-center font-medium text-gray-500">
                          {showBudgetComparison ? (
                            <div>
                              <div className="text-xs text-gray-400">Forecast</div>
                              <div>{m}</div>
                              <div className="text-xs text-gray-400">Budget</div>
                            </div>
                          ) : (
                            m
                          )}
                        </th>
                      ))
                    ) : (
                      ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                        <th key={q} className="px-3 py-2 text-center font-medium text-gray-500">
                          {showBudgetComparison ? (
                            <div>
                              <div className="text-xs text-gray-400">Forecast</div>
                              <div>{q}</div>
                              <div className="text-xs text-gray-400">Budget</div>
                            </div>
                          ) : (
                            q
                          )}
                        </th>
                      ))
                    )}
                    <th className="px-3 py-2 text-center font-medium text-gray-500 border-l border-gray-300">
                      {showBudgetComparison ? (
                        <div>
                          <div className="text-xs text-gray-400">Forecast</div>
                          <div>Full Year</div>
                          <div className="text-xs text-gray-400">Budget</div>
                        </div>
                      ) : (
                        'Full Year'
                      )}
                    </th>
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
                      showBudgetComparison ? (
                        (comparisonTotals?.forecast?.revenue || Array(12).fill(0)).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center">
                            <div className="text-green-800 font-sans font-bold">{t.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                              {comparisonTotals?.budget?.revenue[i]?.toLocaleString() || '0'}
                            </div>
                          </td>
                        ))
                      ) : (
                        totals.revenue.map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                      )
                    ) : (
                      showBudgetComparison ? (
                        calculateQuarterlyTotals(comparisonTotals?.forecast?.revenue || Array(12).fill(0)).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center">
                            <div className="text-green-800 font-sans font-bold">{t.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                              {calculateQuarterlyTotals(comparisonTotals?.budget?.revenue || Array(12).fill(0))[i]?.toLocaleString() || '0'}
                            </div>
                          </td>
                        ))
                      ) : (
                        calculateQuarterlyTotals(totals.revenue).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                      )
                    )}
                    <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans font-bold">
                      {showBudgetComparison ? (
                        <div>
                          <div>{(comparisonTotals?.forecast?.revenue?.reduce((sum, t) => sum + t, 0) || 0).toLocaleString()}</div>
                          <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                            {(comparisonTotals?.budget?.revenue?.reduce((sum, t) => sum + t, 0) || 0).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        totals.revenue.reduce((sum, t) => sum + t, 0).toLocaleString()
                      )}
                    </td>
                  </tr>
                  
                  {/* Revenue categories and line items - similar structure to budget but with comparison */}
                  {expandRevenue && categories.filter(cat => cat.type === 'revenue').map(cat => {
                    const key = cat.name.trim().toLowerCase();
                    const data = showBudgetComparison ? groupedComparisonDataFallback()[key] || { items: [] } : groupedBudgetData[key] || { items: [] };
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
                              const total = data.items.reduce((sum, item) => {
                                if (showBudgetComparison) {
                                  return sum + (item.forecast[`month_${i + 1}`] || 0);
                                } else {
                                  return sum + (item[`month_${i + 1}`] || 0);
                                }
                              }, 0);
                              return (
                                <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">
                                  {showBudgetComparison ? (
                                    <div>
                                      <div>{total.toLocaleString()}</div>
                                      <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                        {data.items.reduce((sum, item) => sum + (item.budget[`month_${i + 1}`] || 0), 0).toLocaleString()}
                                      </div>
                                    </div>
                                  ) : (
                                    total.toLocaleString()
                                  )}
                                </td>
                              );
                            })
                          ) : (
                            calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                              data.items.reduce((sum, item) => {
                                if (showBudgetComparison) {
                                  return sum + (item.forecast[`month_${i + 1}`] || 0);
                                } else {
                                  return sum + (item[`month_${i + 1}`] || 0);
                                }
                              }, 0)
                            )).map((t, i) => (
                              <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">
                                {showBudgetComparison ? (
                                  <div>
                                    <div>{t.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                      {calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                                        data.items.reduce((sum, item) => sum + (item.budget[`month_${i + 1}`] || 0), 0)
                                      ))[i].toLocaleString()}
                                    </div>
                                  </div>
                                ) : (
                                  t.toLocaleString()
                                )}
                              </td>
                            ))
                          )}
                          <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                            {showBudgetComparison ? (
                              <div>
                                <div>{data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item.forecast[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}</div>
                                <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                  {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item.budget[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()
                            )}
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
                                  {showBudgetComparison ? (
                                    <div>
                                      <div style={{ color: '#111' }}>
                                        {item.forecast?.[`month_${i + 1}`] ?? ''}
                                      </div>
                                      <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                        {item.budget?.[`month_${i + 1}`] !== undefined
                                          ? item.budget[`month_${i + 1}`]
                                          : item[`month_${i + 1}`] || ''}
                                      </div>
                                    </div>
                                  ) : (
                                    <input
                                      type="number"
                                      value={item[`month_${i + 1}`] || 0}
                                      onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0)}
                                      className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    />
                                  )}
                                  </td>
                                ))
                              ) : (
                              calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => {
                                if (showBudgetComparison) {
                                  return item.forecast[`month_${i + 1}`] || 0;
                                } else {
                                  return item[`month_${i + 1}`] || 0;
                                }
                              })).map((val, quarterIdx) => (
                                <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                                  {showBudgetComparison ? (
                                    <div>
                                      <div style={{ color: '#111' }}>
                                        {item.forecast?.[`month_${quarterIdx * 3 + 1}`] ?? ''}
                                      </div>
                                      <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                        {item.budget?.[`month_${quarterIdx * 3 + 1}`] !== undefined
                                          ? item.budget[`month_${quarterIdx * 3 + 1}`]
                                          : item[`month_${quarterIdx * 3 + 1}`] || ''}
                                      </div>
                                    </div>
                                  ) : (
                                    <input
                                      type="number"
                                      value={val || 0}
                                      onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0)}
                                      className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                    />
                                  )}
                                </td>
                              ))
                            )}
                            <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                              {showBudgetComparison ? (
                                <div>
                                  <div>{Array.from({length: 12}, (_, i) => item.forecast[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}</div>
                                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                    {Array.from({length: 12}, (_, i) => item.budget[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                                  </div>
                                </div>
                              ) : (
                                Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()
                              )}
                            </td>
                            </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Costs group - similar structure */}
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
                      showBudgetComparison ? (
                        (comparisonTotals?.forecast?.expense || Array(12).fill(0)).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center">
                            <div className="text-red-800 font-sans font-bold">{t.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                              {comparisonTotals?.budget?.expense[i]?.toLocaleString() || '0'}
                            </div>
                          </td>
                        ))
                      ) : (
                        totals.expense.map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                      )
                    ) : (
                      showBudgetComparison ? (
                        calculateQuarterlyTotals(comparisonTotals?.forecast?.expense || Array(12).fill(0)).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center">
                            <div className="text-red-800 font-sans font-bold">{t.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                              {calculateQuarterlyTotals(comparisonTotals?.budget?.expense || Array(12).fill(0))[i]?.toLocaleString() || '0'}
                            </div>
                          </td>
                        ))
                      ) : (
                        calculateQuarterlyTotals(totals.expense).map((t, i) => (
                          <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
                        ))
                      )
                    )}
                    <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans font-bold">
                      {showBudgetComparison ? (
                        <div>
                          <div>{totals.expense.reduce((sum, t) => sum + t, 0).toLocaleString()}</div>
                          <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                            {(comparisonTotals?.budget?.expense?.reduce((sum, t) => sum + t, 0) || 0).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        totals.expense.reduce((sum, t) => sum + t, 0).toLocaleString()
                      )}
                    </td>
                    </tr>
                  
                  {/* Costs categories and line items - similar structure to revenue but for expenses */}
                  {expandCosts && categories.filter(cat => cat.type === 'expense').map(cat => {
                    const key = cat.name.trim().toLowerCase();
                    const data = showBudgetComparison ? groupedComparisonDataFallback()[key] || { items: [] } : groupedBudgetData[key] || { items: [] };
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
                              const total = data.items.reduce((sum, item) => {
                                if (showBudgetComparison) {
                                  return sum + (item.forecast[`month_${i + 1}`] || 0);
                                } else {
                                  return sum + (item[`month_${i + 1}`] || 0);
                                }
                              }, 0);
                              return (
                              <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{total.toLocaleString()}</td>
                              );
                            })
                          ) : (
                            calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                              data.items.reduce((sum, item) => {
                                if (showBudgetComparison) {
                                  return sum + (item.forecast[`month_${i + 1}`] || 0);
                                } else {
                                  return sum + (item[`month_${i + 1}`] || 0);
                                }
                              }, 0)
                            )).map((t, i) => (
                              <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{t.toLocaleString()}</td>
                            ))
                          )}
                          <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                            {showBudgetComparison ? (
                              <div>
                                <div>{data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item.forecast[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}</div>
                                <div className="text-xs text-gray-500 border-t border-gray-200 pt-1">
                                  {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item.budget[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                </div>
              </div>
                            ) : (
                              data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <AddBudgetItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLineItem}
        categories={categories}
        onCreateCategory={handleAddCategory}
        type={addModalType === 'category' ? 'category' : 'lineItem'}
        parent={addModalParent}
        typeOverride={addCategoryType}
      />
      <QuickBudgetEditorModal
        isOpen={showQuickEditor}
        onClose={() => setShowQuickEditor(false)}
        categories={categories}
        loadBudgetData={loadBudgetData}
      />
    </>
  );
};

export default Budget; 