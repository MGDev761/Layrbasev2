import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  PencilIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarSquareIcon,
  EllipsisVerticalIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { budgetService } from '../../../../services/budgetService';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const ForecastManager = () => {
  const { currentOrganization } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState('months'); // 'months' or 'quarters'
  const [dataView, setDataView] = useState('forecast'); // 'forecast' or 'variance'
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    x: 0,
    y: 0,
    month: '',
    onConfirm: null,
    onCancel: null
  });
  const [editPopup, setEditPopup] = useState({
    show: false,
    x: 0,
    y: 0,
    month: '',
    value: 0,
    lineItemId: null,
    monthIndex: null,
    dataType: null
  });
  const [showMenu, setShowMenu] = useState(false);
  const [resetWarningPopup, setResetWarningPopup] = useState({
    show: false
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  // Load forecast data
  const loadForecastData = useCallback(async () => {
    if (!currentOrganization?.organization_id) return;
    
    setLoading(true);
    try {
      const [budgetDataResult, categoriesResult, lineItemsResult] = await Promise.all([
        budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, 'all'),
        budgetService.getCategories(currentOrganization.organization_id),
        budgetService.getLineItems(currentOrganization.organization_id)
      ]);
      
      setBudgetData(budgetDataResult);
      setCategories(categoriesResult);
      setLineItems(lineItemsResult);
      
      // Categories start collapsed by default
      // Removed auto-expansion logic - user can manually expand as needed
      
    } catch (error) {
      console.error('Error loading forecast data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization?.organization_id, selectedYear]);

  useEffect(() => {
    loadForecastData();
  }, [loadForecastData]);

  // Group budget data by category
  const groupedBudgetData = budgetData.reduce((acc, item) => {
    const categoryName = (item.category_name || 'Uncategorized').trim().toLowerCase();
    if (!acc[categoryName]) {
      acc[categoryName] = {
        type: item.type,
        items: []
      };
    }
    acc[categoryName].items.push(item);
    return acc;
  }, {});

  // Calculate totals with variance
  const calculateTotals = useCallback(() => {
    const totals = {
      budget: { revenue: Array(12).fill(0), expense: Array(12).fill(0), profitLoss: Array(12).fill(0) },
      forecast: { revenue: Array(12).fill(0), expense: Array(12).fill(0), profitLoss: Array(12).fill(0) },
      actual: { revenue: Array(12).fill(0), expense: Array(12).fill(0), profitLoss: Array(12).fill(0) },
      variance: { revenue: Array(12).fill(0), expense: Array(12).fill(0), profitLoss: Array(12).fill(0) }
    };
    
    budgetData.forEach(item => {
      for (let month = 1; month <= 12; month++) {
        const budgetAmount = item[`budget_month_${month}`] || 0;
        const forecastAmount = item[`forecast_month_${month}`] || 0;
        const actualAmount = item[`actual_month_${month}`] || 0;
        
        if (item.type === 'revenue') {
          totals.budget.revenue[month - 1] += budgetAmount;
          totals.forecast.revenue[month - 1] += forecastAmount;
          totals.actual.revenue[month - 1] += actualAmount;
          totals.variance.revenue[month - 1] += (forecastAmount - budgetAmount);
        } else {
          totals.budget.expense[month - 1] += Math.abs(budgetAmount);
          totals.forecast.expense[month - 1] += Math.abs(forecastAmount);
          totals.actual.expense[month - 1] += Math.abs(actualAmount);
          totals.variance.expense[month - 1] += (Math.abs(forecastAmount) - Math.abs(budgetAmount));
        }
      }
    });
    
    // Calculate profit/loss
    for (let i = 0; i < 12; i++) {
      totals.budget.profitLoss[i] = totals.budget.revenue[i] - totals.budget.expense[i];
      totals.forecast.profitLoss[i] = totals.forecast.revenue[i] - totals.forecast.expense[i];
      totals.actual.profitLoss[i] = totals.actual.revenue[i] - totals.actual.expense[i];
      totals.variance.profitLoss[i] = totals.variance.revenue[i] - totals.variance.expense[i];
    }
    
    return totals;
  }, [budgetData]);

  const totals = calculateTotals();

  // Calculate quarterly totals
  const calculateQuarterlyTotals = (monthlyValues) => {
    const quarters = [];
    for (let q = 0; q < 4; q++) {
      const quarterTotal = monthlyValues.slice(q * 3, (q + 1) * 3).reduce((sum, val) => sum + (val || 0), 0);
      quarters.push(quarterTotal);
    }
    return quarters;
  };

  // Handle value changes
  const handleValueChange = useCallback(async (lineItemId, month, value, dataType) => {
    if (!currentOrganization?.organization_id) return;
    
    const amount = parseFloat(value) || 0;
    console.log('Updating value:', { lineItemId, month, amount, dataType, year: selectedYear });
    
    try {
      await budgetService.updateBudgetValue(
        currentOrganization.organization_id,
        lineItemId,
        selectedYear,
        month,
        amount,
        dataType
      );

      // Reload data to get updated values
      await loadForecastData();

      addNotification({
        message: `Updated ${dataType} for ${months[month - 1]}`,
        type: 'success'
      });

    } catch (error) {
      console.error('Error updating forecast value:', error);
      addNotification({
        message: 'Failed to update forecast data',
        type: 'error'
      });
    }
  }, [currentOrganization?.organization_id, selectedYear, months, addNotification, loadForecastData]);

  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  // Reset forecast to budget values
  const resetForecastToBudget = useCallback(async () => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      setLoading(true);
      
      // Get all budget data for current year (including budget and forecast columns)
      const allBudgetData = await budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, 'all');
      
      console.log('Budget data for reset:', allBudgetData);
      
      // Update each line item's values to match budget values
      for (const item of allBudgetData) {
        if (item.line_item_id) { // Only process actual line items, not summary rows
          for (let month = 1; month <= 12; month++) {
            const budgetAmount = item[`budget_month_${month}`] || 0;
            const monthStatus = getMonthStatus(month - 1); // month-1 because getMonthStatus expects 0-based index
            
            // Determine which data type to update based on month status
            let dataTypeToUpdate;
            if (monthStatus === 'past') {
              dataTypeToUpdate = 'actual';
            } else {
              dataTypeToUpdate = 'forecast';
            }
            
            // Update the appropriate data type to match budget
            try {
              await budgetService.updateBudgetValue(
                currentOrganization.organization_id,
                item.line_item_id,
                selectedYear,
                month,
                budgetAmount,
                dataTypeToUpdate
              );
            } catch (updateError) {
              console.error(`Error updating line item ${item.line_item_id} month ${month} (${dataTypeToUpdate}):`, updateError);
            }
          }
        }
      }
      
      // Reload data
      await loadForecastData();
      
      addNotification({
        message: 'Forecast values have been reset to match budget values',
        type: 'success'
      });
      
    } catch (error) {
      console.error('Error resetting forecast to budget:', error);
      addNotification({
        message: 'Failed to reset forecast values',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [currentOrganization?.organization_id, selectedYear, loadForecastData, addNotification]);

  // Calculate variance percentage
  const calculateVariancePercent = (forecast, budget) => {
    if (budget === 0) return forecast === 0 ? 0 : 100;
    return ((forecast - budget) / Math.abs(budget)) * 100;
  };

  // Format variance display
  const formatVariance = (variance, percentage) => {
    const absPercentage = Math.abs(percentage);
    const isPositive = variance >= 0;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    const icon = isPositive ? '+' : '';
    
    return (
      <span className={`${color} font-medium`}>
        {icon}{variance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ({icon}{percentage.toFixed(0)}%)
      </span>
    );
  };

  // Check if month is past, current, or future
  const getMonthStatus = (monthIndex) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    if (selectedYear < currentYear || (selectedYear === currentYear && monthIndex < currentMonth)) {
      return 'past';
    } else if (selectedYear === currentYear && monthIndex === currentMonth) {
      return 'current';
    }
    return 'future';
  };

  // Prepare data for AG-Grid
  const rowData = useMemo(() => {
    const rows = [];
    

    
    // Add revenue section header
    rows.push({
      id: 'revenue-header',
      categoryName: 'REVENUE',
      type: 'section-header',
      isRevenue: true,
      budgetTotal: totals.budget.revenue.reduce((sum, val) => sum + val, 0),
      forecastTotal: totals.forecast.revenue.reduce((sum, val) => sum + val, 0),
      varianceTotal: totals.variance.revenue.reduce((sum, val) => sum + val, 0)
    });

    // Add revenue categories and line items
    categories.filter(cat => cat.type === 'revenue').forEach(category => {
      const categoryKey = category.name.trim().toLowerCase();
      const categoryData = groupedBudgetData[categoryKey] || { items: [] };
      const categoryLineItems = lineItems.filter(item => item.category_id === category.id);
      
      // Calculate category totals
      let categoryBudgetTotal = 0;
      let categoryForecastTotal = 0;
      categoryLineItems.forEach(lineItem => {
        const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
        for (let i = 1; i <= 12; i++) {
          const monthBudget = budgetItem[`budget_month_${i}`] || 0;
          const monthForecast = budgetItem[`forecast_month_${i}`] || 0;
          const monthActual = budgetItem[`actual_month_${i}`] || 0;
          const status = getMonthStatus(i - 1);
          
          categoryBudgetTotal += monthBudget;
          categoryForecastTotal += (status === 'past' ? monthActual : monthForecast);
        }
      });
      
      // Add category header
      rows.push({
        id: `category-${category.id}`,
        categoryName: category.name,
        type: 'category-header',
        isRevenue: true,
        categoryId: category.id,
        itemCount: categoryLineItems.length,
        budgetTotal: categoryBudgetTotal,
        forecastTotal: categoryForecastTotal,
        varianceTotal: categoryForecastTotal - categoryBudgetTotal
      });

      // Add line items if category is expanded
      if (expandedCategories.has(category.name)) {
        categoryLineItems.forEach(lineItem => {
          const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
          const row = {
            id: `lineitem-${lineItem.id}`,
            categoryName: `  ${lineItem.name}`,
            type: 'line-item',
            isRevenue: true,
            lineItemId: lineItem.id
          };

          // Add monthly data and calculate totals
          let budgetTotal = 0;
          let forecastTotal = 0;
          for (let i = 1; i <= 12; i++) {
            const monthBudget = budgetItem[`budget_month_${i}`] || 0;
            const monthForecast = budgetItem[`forecast_month_${i}`] || 0;
            const monthActual = budgetItem[`actual_month_${i}`] || 0;
            const status = getMonthStatus(i - 1);
            
            row[`month${i}`] = {
              budget: monthBudget,
              forecast: monthForecast,
              actual: monthActual,
              status: status
            };
            
            budgetTotal += monthBudget;
            // For forecast total, use actual for past months, forecast for future
            forecastTotal += (status === 'past' ? monthActual : monthForecast);
          }

          row.budgetTotal = budgetTotal;
          row.forecastTotal = forecastTotal;
          row.varianceTotal = forecastTotal - budgetTotal;

          rows.push(row);
        });
      }
    });

    // Add expense section header
    rows.push({
      id: 'expense-header',
      categoryName: 'EXPENSES',
      type: 'section-header',
      isRevenue: false,
      budgetTotal: totals.budget.expense.reduce((sum, val) => sum + val, 0),
      forecastTotal: totals.forecast.expense.reduce((sum, val) => sum + val, 0),
      varianceTotal: totals.variance.expense.reduce((sum, val) => sum + val, 0)
    });

    // Add expense categories and line items
    categories.filter(cat => cat.type === 'expense').forEach(category => {
      const categoryKey = category.name.trim().toLowerCase();
      const categoryData = groupedBudgetData[categoryKey] || { items: [] };
      const categoryLineItems = lineItems.filter(item => item.category_id === category.id);
      
      // Calculate category totals
      let categoryBudgetTotal = 0;
      let categoryForecastTotal = 0;
      categoryLineItems.forEach(lineItem => {
        const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
        for (let i = 1; i <= 12; i++) {
          const monthBudget = budgetItem[`budget_month_${i}`] || 0;
          const monthForecast = budgetItem[`forecast_month_${i}`] || 0;
          const monthActual = budgetItem[`actual_month_${i}`] || 0;
          const status = getMonthStatus(i - 1);
          
          categoryBudgetTotal += monthBudget;
          categoryForecastTotal += (status === 'past' ? monthActual : monthForecast);
        }
      });
      
      // Add category header
      rows.push({
        id: `category-${category.id}`,
        categoryName: category.name,
        type: 'category-header',
        isRevenue: false,
        categoryId: category.id,
        itemCount: categoryLineItems.length,
        budgetTotal: categoryBudgetTotal,
        forecastTotal: categoryForecastTotal,
        varianceTotal: categoryForecastTotal - categoryBudgetTotal
      });

      // Add line items if category is expanded
      if (expandedCategories.has(category.name)) {
        categoryLineItems.forEach(lineItem => {
          const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
          const row = {
            id: `lineitem-${lineItem.id}`,
            categoryName: `  ${lineItem.name}`,
            type: 'line-item',
            isRevenue: false,
            lineItemId: lineItem.id
          };

          // Add monthly data and calculate totals
          let budgetTotal = 0;
          let forecastTotal = 0;
          for (let i = 1; i <= 12; i++) {
            const monthBudget = budgetItem[`budget_month_${i}`] || 0;
            const monthForecast = budgetItem[`forecast_month_${i}`] || 0;
            const monthActual = budgetItem[`actual_month_${i}`] || 0;
            const status = getMonthStatus(i - 1);
            
            row[`month${i}`] = {
              budget: monthBudget,
              forecast: monthForecast,
              actual: monthActual,
              status: status
            };
            
            budgetTotal += monthBudget;
            // For forecast total, use actual for past months, forecast for future
            forecastTotal += (status === 'past' ? monthActual : monthForecast);
          }

          row.budgetTotal = budgetTotal;
          row.forecastTotal = forecastTotal;
          row.varianceTotal = forecastTotal - budgetTotal;

          rows.push(row);
        });
      }
    });

    // Add profit/loss summary
    rows.push({
      id: 'profit-loss',
      categoryName: 'PROFIT / LOSS',
      type: 'summary',
      budgetTotal: totals.budget.profitLoss.reduce((sum, val) => sum + val, 0),
      forecastTotal: totals.forecast.profitLoss.reduce((sum, val) => sum + val, 0),
      varianceTotal: totals.variance.profitLoss.reduce((sum, val) => sum + val, 0)
    });

    return rows;
  }, [categories, lineItems, groupedBudgetData, expandedCategories, totals, viewMode, getMonthStatus]);

  // Define columns for AG-Grid
  const columnDefs = useMemo(() => {
    const cols = [
      {
        field: 'categoryName',
        headerName: 'Category / Line Item',
        width: 250,
        pinned: 'left',
        cellRenderer: (params) => {
          if (params.data.type === 'section-header') {
            return React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingLeft: '12px',
                fontWeight: '600',
                fontSize: '13px',
                color: params.data.isRevenue ? '#15803d' : '#7f1d1d'
              }
            }, params.value);
          }
          if (params.data.type === 'category-header') {
            const isExpanded = expandedCategories.has(params.data.categoryName);
            const ChevronIcon = isExpanded ? ChevronDownIcon : ChevronRightIcon;
            return React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingLeft: '12px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                color: params.data.isRevenue ? '#15803d' : '#7f1d1d'
              },
              onClick: () => toggleCategory(params.data.categoryName)
            }, [
              React.createElement(ChevronIcon, { 
                key: 'icon', 
                style: { 
                  marginRight: '6px', 
                  width: '14px', 
                  height: '14px',
                  color: '#6b7280'
                } 
              }),
              React.createElement('span', { key: 'name' }, params.value),
              React.createElement('span', { 
                key: 'count',
                style: {
                  marginLeft: 'auto',
                  fontSize: '11px',
                  opacity: 0.6,
                  color: params.data.isRevenue ? '#15803d' : '#7f1d1d'
                }
              }, `(${params.data.itemCount})`)
            ]);
          }
          if (params.data.type === 'summary') {
            return React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingLeft: '12px',
                fontWeight: '700',
                fontSize: '13px',
                color: '#1d4ed8'
              }
            }, params.value);
          }
          return React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              paddingLeft: '48px',
              fontSize: '13px',
              color: '#374151'
            }
          }, params.value);
        }
      }
    ];

    if (viewMode === 'months') {
      months.forEach((month, index) => {
        const status = getMonthStatus(index);
        const statusText = status === 'past' ? 'Actual' : status === 'current' ? 'Current' : 'Forecast';
        const textColor = status === 'past' ? '#1d4ed8' : status === 'current' ? '#ca8a04' : '#16a34a';
        
        cols.push({
          field: `month${index + 1}`,
          headerName: month,
          width: 120,
          type: 'numericColumn',
          headerClass: `ag-right-aligned-header ${status === 'past' ? 'bg-blue-50' : status === 'current' ? 'bg-yellow-50' : 'bg-green-50'}`,
          headerComponent: (params) => {
            return React.createElement('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'right'
              }
            }, [
              React.createElement('div', {
                key: 'month',
                style: {
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#374151'
                }
              }, month),
              React.createElement('div', {
                key: 'status',
                style: {
                  fontSize: '10px',
                  color: textColor,
                  fontWeight: '500',
                  marginTop: '1px'
                }
              }, statusText)
            ]);
          },
          cellRenderer: (params) => {
            if (params.data.type === 'section-header') {
              const monthlyTotal = params.data.isRevenue 
                ? totals.forecast.revenue[index] 
                : params.data.isRevenue === false 
                  ? totals.forecast.expense[index]
                  : totals.forecast.profitLoss[index];
              return monthlyTotal ? React.createElement('div', {
                style: { 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%', 
                  justifyContent: 'flex-end', 
                  paddingRight: '12px',
                  width: '100%',
                  textAlign: 'right',
                  fontWeight: '600'
                }
              }, Math.round(monthlyTotal).toLocaleString()) : '';
            }
            if (params.data.type === 'summary') {
              const profit = totals.forecast.profitLoss[index] || 0;
              const color = profit >= 0 ? '#1d4ed8' : '#dc2626';
              return React.createElement('div', {
                style: {
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%', 
                  justifyContent: 'flex-end', 
                  paddingRight: '12px',
                  width: '100%',
                  textAlign: 'right',
                  fontWeight: '700',
                  color: color
                }
              }, Math.round(profit).toLocaleString());
            }
            if (params.data.type === 'line-item' && params.value) {
              const status = params.value.status;
              const value = dataView === 'forecast' 
                ? (status === 'past' ? params.value.actual : params.value.forecast)
                : (params.value.forecast - params.value.budget);
              
              if (dataView === 'variance') {
                // Variance view shows differences with budget at bottom
                const color = value >= 0 ? '#059669' : '#dc2626';
                const budgetValue = params.value.budget || 0;
                
                return React.createElement('div', {
                  style: {
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    height: '100%', 
                    justifyContent: 'center', 
                    paddingRight: '12px'
                  }
                }, [
                  React.createElement('div', {
                    key: 'variance',
                    style: {
                      color: color,
                      fontWeight: '500',
                      fontSize: '13px'
                    }
                  }, `${value > 0 ? '+' : ''}${Math.round(value).toLocaleString()}`),
                  React.createElement('div', {
                    key: 'budget',
                    style: {
                      fontSize: '10px',
                      color: '#6b7280',
                      fontWeight: '400',
                      marginTop: '1px'
                    }
                  }, `vs ${Math.round(budgetValue).toLocaleString()}`)
                ]);
              } else {
                // All months are editable, but past months show a warning
                const dataType = status === 'past' ? 'actual' : 'forecast';
                const isPastMonth = status === 'past';
                
                return React.createElement('input', {
                  key: `${params.data.lineItemId}-${index + 1}-${dataType}`,
                  type: 'number',
                  step: '1',
                  defaultValue: Math.round(value || 0),
                  onFocus: (e) => {
                    e.target.select();
                    if (isPastMonth) {
                      // Show custom popup for past months
                      const rect = e.target.getBoundingClientRect();
                      setConfirmPopup({
                        show: true,
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        month: months[index],
                        onConfirm: () => {
                          setConfirmPopup({ show: false, x: 0, y: 0, month: '', onConfirm: null, onCancel: null });
                          // Show edit popup
                          setEditPopup({
                            show: true,
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            month: months[index],
                            value: Math.round(value || 0),
                            lineItemId: params.data.lineItemId,
                            monthIndex: index + 1,
                            dataType: dataType
                          });
                        },
                        onCancel: () => {
                          setConfirmPopup({ show: false, x: 0, y: 0, month: '', onConfirm: null, onCancel: null });
                          e.target.blur();
                        }
                      });
                    } else {
                      // For future months, go directly to edit popup
                      const rect = e.target.getBoundingClientRect();
                      setEditPopup({
                        show: true,
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        month: months[index],
                        value: Math.round(value || 0),
                        lineItemId: params.data.lineItemId,
                        monthIndex: index + 1,
                        dataType: dataType
                      });
                    }
                  },
                  readOnly: true, // Make input read-only since we use popup for editing
                  onClick: (e) => e.stopPropagation(),
                  style: {
                    width: '100%',
                    height: '100%',
                    textAlign: 'right',
                    border: '2px solid transparent',
                    outline: 'none',
                    backgroundColor: isPastMonth ? '#eff6ff' : 'transparent',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    color: isPastMonth ? '#1d4ed8' : '#374151',
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                    padding: '0 12px',
                    transition: 'border-color 0.15s ease-in-out'
                  },
                  className: 'budget-input',
                  title: isPastMonth ? 'Warning: This is a past month actual - click to edit with confirmation' : 'Click to edit forecast'
                });
              }
            }
            if (params.data.type === 'category-header') {
              // Calculate category total for this month
              const categoryLineItems = lineItems.filter(item => item.category_id === params.data.categoryId);
              const categoryKey = params.data.categoryName.trim().toLowerCase();
              const categoryData = groupedBudgetData[categoryKey] || { items: [] };
              
              let monthlyTotal = 0;
              categoryLineItems.forEach(lineItem => {
                const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
                const status = getMonthStatus(index);
                const value = dataView === 'forecast' 
                  ? (status === 'past' ? (budgetItem[`actual_month_${index + 1}`] || 0) : (budgetItem[`forecast_month_${index + 1}`] || 0))
                  : ((budgetItem[`forecast_month_${index + 1}`] || 0) - (budgetItem[`budget_month_${index + 1}`] || 0));
                monthlyTotal += value;
              });

              if (dataView === 'variance') {
                const color = monthlyTotal >= 0 ? '#059669' : '#dc2626';
                
                // Calculate category budget total for this month
                let monthlyBudgetTotal = 0;
                categoryLineItems.forEach(lineItem => {
                  const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
                  monthlyBudgetTotal += budgetItem[`budget_month_${index + 1}`] || 0;
                });
                
                return React.createElement('div', {
                  style: {
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    height: '100%', 
                    justifyContent: 'center', 
                    paddingRight: '12px',
                    width: '100%',
                    cursor: 'pointer'
                  },
                  onClick: () => toggleCategory(params.data.categoryName)
                }, [
                  React.createElement('div', {
                    key: 'variance',
                    style: {
                      color: color,
                      fontWeight: '600',
                      fontSize: '13px'
                    }
                  }, `${monthlyTotal > 0 ? '+' : ''}${Math.round(monthlyTotal).toLocaleString()}`),
                  React.createElement('div', {
                    key: 'budget',
                    style: {
                      fontSize: '10px',
                      color: '#6b7280',
                      fontWeight: '400',
                      marginTop: '1px'
                    }
                  }, `vs ${Math.round(monthlyBudgetTotal).toLocaleString()}`)
                ]);
              } else {
                return React.createElement('div', {
                  style: {
                    display: 'flex', 
                    alignItems: 'center', 
                    height: '100%', 
                    justifyContent: 'flex-end', 
                    paddingRight: '12px',
                    width: '100%',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: params.data.isRevenue ? '#15803d' : '#7f1d1d',
                    cursor: 'pointer'
                  },
                  onClick: () => toggleCategory(params.data.categoryName)
                }, Math.round(monthlyTotal).toLocaleString());
              }
            }
            return '';
          }
        });
      });
    } else {
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter, qIndex) => {
        cols.push({
          field: `quarter${qIndex + 1}`,
          headerName: quarter,
          width: 120,
          type: 'numericColumn',
          valueGetter: (params) => {
            if (params.data.type === 'line-item') {
              const start = qIndex * 3 + 1;
              const end = start + 2;
              let total = 0;
              for (let i = start; i <= end; i++) {
                const monthData = params.data[`month${i}`];
                if (monthData) {
                  const value = dataView === 'forecast' 
                    ? (monthData.status === 'past' ? monthData.actual : monthData.forecast)
                    : (monthData.forecast - monthData.budget);
                  total += value;
                }
              }
              return total;
            }
            return null;
          },
          cellRenderer: (params) => {
            if (params.value !== null && params.data.type === 'line-item') {
              if (dataView === 'variance') {
                const color = params.value >= 0 ? '#059669' : '#dc2626';
                
                // Calculate quarterly budget total
                const start = qIndex * 3 + 1;
                const end = start + 2;
                let budgetTotal = 0;
                for (let i = start; i <= end; i++) {
                  const monthData = params.data[`month${i}`];
                  if (monthData) {
                    budgetTotal += monthData.budget;
                  }
                }
                
                return React.createElement('div', {
                  style: {
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    height: '100%', 
                    justifyContent: 'center', 
                    paddingRight: '12px'
                  }
                }, [
                  React.createElement('div', {
                    key: 'variance',
                    style: {
                      color: color,
                      fontWeight: '500',
                      fontSize: '13px'
                    }
                  }, `${params.value > 0 ? '+' : ''}${Math.round(params.value).toLocaleString()}`),
                  React.createElement('div', {
                    key: 'budget',
                    style: {
                      fontSize: '10px',
                      color: '#6b7280',
                      fontWeight: '400',
                      marginTop: '1px'
                    }
                  }, `vs ${Math.round(budgetTotal).toLocaleString()}`)
                ]);
              } else {
                return React.createElement('div', {
                  style: {
                    display: 'flex', 
                    alignItems: 'center', 
                    height: '100%', 
                    justifyContent: 'flex-end', 
                    paddingRight: '12px'
                  }
                }, Math.round(params.value).toLocaleString());
              }
            }
            return params.value ? Math.round(params.value).toLocaleString() : '';
          }
        });
      });
    }

    // Add total column
    cols.push({
      field: dataView === 'forecast' ? 'forecastTotal' : 'varianceTotal',
      headerName: dataView === 'forecast' ? 'Forecast Total' : 'Variance Total',
      width: 120,
      type: 'numericColumn',
      headerClass: 'ag-right-aligned-header',
      pinned: 'right',
      cellRenderer: (params) => {
        if (params.data.type === 'section-header') {
          const value = dataView === 'forecast' ? params.data.forecastTotal : params.data.varianceTotal;
          const color = params.data.isRevenue ? '#15803d' : '#7f1d1d';
          return React.createElement('div', {
            style: { 
              display: 'flex', 
              alignItems: 'center', 
              height: '100%', 
              paddingLeft: '12px', 
              justifyContent: 'flex-end', 
              paddingRight: '12px',
              fontWeight: '600',
              color: color
            }
          }, Math.round(value).toLocaleString());
        }
        if (params.data.type === 'summary') {
          const value = dataView === 'forecast' ? params.data.forecastTotal : params.data.varianceTotal;
          const color = value >= 0 ? '#1d4ed8' : '#dc2626';
          return React.createElement('div', {
            style: {
              display: 'flex', 
              alignItems: 'center', 
              height: '100%', 
              paddingLeft: '12px', 
              justifyContent: 'flex-end', 
              paddingRight: '12px',
              fontWeight: '700',
              color: color
            }
          }, Math.round(value).toLocaleString());
        }
        if (params.data.type === 'category-header') {
          const value = dataView === 'forecast' ? params.data.forecastTotal : params.data.varianceTotal;
          if (dataView === 'variance') {
            const color = value >= 0 ? '#059669' : '#dc2626';
            return React.createElement('div', {
              style: {
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-end',
                height: '100%', 
                justifyContent: 'center', 
                paddingRight: '12px',
                cursor: 'pointer'
              },
              onClick: () => toggleCategory(params.data.categoryName)
            }, [
              React.createElement('div', {
                key: 'variance',
                style: {
                  color: color,
                  fontWeight: '600',
                  fontSize: '13px'
                }
              }, `${value > 0 ? '+' : ''}${Math.round(value).toLocaleString()}`),
              React.createElement('div', {
                key: 'budget',
                style: {
                  fontSize: '10px',
                  color: '#6b7280',
                  fontWeight: '400',
                  marginTop: '1px'
                }
              }, `vs ${Math.round(params.data.budgetTotal).toLocaleString()}`)
            ]);
          } else {
            const color = params.data.isRevenue ? '#15803d' : '#7f1d1d';
            return React.createElement('div', {
              style: {
                display: 'flex', 
                alignItems: 'center', 
                height: '100%', 
                paddingLeft: '12px', 
                justifyContent: 'flex-end', 
                paddingRight: '12px',
                fontSize: '13px',
                color: color,
                fontWeight: '600',
                cursor: 'pointer'
              },
              onClick: () => toggleCategory(params.data.categoryName)
            }, Math.round(value).toLocaleString());
          }
        }
        if (params.data.type === 'line-item') {
          const value = dataView === 'forecast' ? params.data.forecastTotal : params.data.varianceTotal;
          if (dataView === 'variance') {
            const color = value >= 0 ? '#059669' : '#dc2626';
            return React.createElement('div', {
              style: {
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-end',
                height: '100%', 
                justifyContent: 'center', 
                paddingRight: '12px'
              }
            }, [
              React.createElement('div', {
                key: 'variance',
                style: {
                  color: color,
                  fontWeight: '500',
                  fontSize: '13px'
                }
              }, `${value > 0 ? '+' : ''}${Math.round(value).toLocaleString()}`),
              React.createElement('div', {
                key: 'budget',
                style: {
                  fontSize: '10px',
                  color: '#6b7280',
                  fontWeight: '400',
                  marginTop: '1px'
                }
              }, `vs ${Math.round(params.data.budgetTotal).toLocaleString()}`)
            ]);
          } else {
            const color = params.data.isRevenue ? '#15803d' : '#7f1d1d';
            return React.createElement('div', {
              style: {
                display: 'flex', 
                alignItems: 'center', 
                height: '100%', 
                paddingLeft: '12px', 
                justifyContent: 'flex-end', 
                paddingRight: '12px',
                fontSize: '13px',
                color: color
              }
            }, Math.round(value).toLocaleString());
          }
        }
        return '';
      }
    });

    return cols;
  }, [viewMode, expandedCategories, totals, dataView, months, getMonthStatus, handleValueChange, toggleCategory]);

  // Expose functions to window for grid callbacks
  useEffect(() => {
    window.toggleCategory = (categoryName) => {
      toggleCategory(categoryName);
    };
    window.handleValueChange = handleValueChange;

    return () => {
      delete window.toggleCategory;
      delete window.handleValueChange;
    };
  }, [handleValueChange, toggleCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading forecast data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Forecast Manager</h2>
          <p className="text-gray-600 text-xs">Manage forecasts and track actuals against your budget. Update forecasts for future periods and enter actuals for completed periods.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
            <h3 className="font-medium text-gray-900 text-sm">Revenue Variance</h3>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatVariance(
              totals.variance.revenue.reduce((sum, val) => sum + val, 0),
              calculateVariancePercent(
                totals.forecast.revenue.reduce((sum, val) => sum + val, 0),
                totals.budget.revenue.reduce((sum, val) => sum + val, 0)
              )
            )}
          </div>
          <p className="text-xs text-gray-500">vs Budget</p>
        </div>
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
            <h3 className="font-medium text-gray-900 text-sm">Expense Variance</h3>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatVariance(
              totals.variance.expense.reduce((sum, val) => sum + val, 0),
              calculateVariancePercent(
                totals.forecast.expense.reduce((sum, val) => sum + val, 0),
                totals.budget.expense.reduce((sum, val) => sum + val, 0)
              )
            )}
          </div>
          <p className="text-xs text-gray-500">vs Budget</p>
        </div>
        <div className="bg-white p-3 rounded border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarSquareIcon className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium text-gray-900 text-sm">Profit Variance</h3>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatVariance(
              totals.variance.profitLoss.reduce((sum, val) => sum + val, 0),
              calculateVariancePercent(
                totals.forecast.profitLoss.reduce((sum, val) => sum + val, 0),
                totals.budget.profitLoss.reduce((sum, val) => sum + val, 0)
              )
            )}
          </div>
          <p className="text-xs text-gray-500">vs Budget</p>
        </div>
      </div>

      {/* AG-Grid */}
      <div className="ag-theme-alpine bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ width: '100%' }}>
        {/* Controls row */}
        <div className="px-4 py-4 flex items-center gap-2 w-full border-b border-gray-200">
          <div className="flex items-center bg-purple-100 rounded-md p-0.5 shadow-inner">
            <button
              onClick={() => setDataView('forecast')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none ${
                dataView === 'forecast' 
                  ? 'bg-white text-purple-700 shadow z-10' 
                  : 'bg-transparent text-purple-600'
              }`}
            >
              Forecast View
            </button>
            <button
              onClick={() => setDataView('variance')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none ${
                dataView === 'variance' 
                  ? 'bg-white text-purple-700 shadow z-10' 
                  : 'bg-transparent text-purple-600'
              }`}
            >
              Variance Analysis
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-32"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="flex items-center bg-purple-100 rounded-md p-0.5 shadow-inner">
              <button
                onClick={() => setViewMode('months')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none ${
                  viewMode === 'months' 
                    ? 'bg-white text-purple-700 shadow z-10' 
                    : 'bg-transparent text-purple-600'
                }`}
              >
                Months
              </button>
              <button
                onClick={() => setViewMode('quarters')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none ${
                  viewMode === 'quarters' 
                    ? 'bg-white text-purple-700 shadow z-10' 
                    : 'bg-transparent text-purple-600'
                }`}
              >
                Quarters
              </button>
            </div>
            
            {/* 3-dot Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
              
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          // TODO: Implement download functionality
                          addNotification({
                            message: 'Download functionality coming soon',
                            type: 'info'
                          });
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-3" />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setResetWarningPopup({ show: true });
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4 mr-3" />
                        Reset to Budget
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <style>{`
          /* AG-Grid CSS Variable Overrides */
          .ag-theme-alpine {
            --ag-background-color: #ffffff !important;
            --ag-odd-row-background-color: #ffffff !important;
            --ag-header-background-color: #f9fafb !important;
            --ag-row-hover-color: #f9fafb !important;
            --ag-border-color: #f3f4f6 !important;
            --ag-secondary-border-color: #f9fafb !important;
            --ag-header-cell-hover-background-color: #f3f4f6 !important;
            --ag-selected-row-background-color: transparent !important;
            --ag-range-selection-background-color: transparent !important;
            --ag-cell-horizontal-border: 1px solid #f9fafb !important;
            --ag-row-border-color: #f9fafb !important;
            --ag-header-height: 48px !important;
            --ag-row-height: 48px !important;
            --ag-cell-horizontal-padding: 0px !important;
            --ag-cell-vertical-padding: 0px !important;
            --ag-header-cell-font-size: 12px !important;
            --ag-font-size: 13px !important;
            --ag-font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
          }

          /* Remove AG-Grid specific borders only */
          .ag-theme-alpine .ag-root-wrapper {
            border: none !important;
          }
          
          .ag-theme-alpine .ag-root {
            border: none !important;
          }

          /* Remove cell focus outline */
          .ag-theme-alpine .ag-cell-focus,
          .ag-theme-alpine .ag-cell-range-selected,
          .ag-theme-alpine .ag-cell-range-selected-1,
          .ag-theme-alpine .ag-cell-range-selected-2,
          .ag-theme-alpine .ag-cell-range-selected-3,
          .ag-theme-alpine .ag-cell-range-selected-4 {
            border: none !important;
            outline: none !important;
          }

          /* Remove input focus border */
          .budget-input:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
            border-bottom: 2px solid #8b5cf6 !important;
          }

          /* Make inputs full width/height */
          .ag-theme-alpine .ag-cell {
            padding: 0 !important;
          }

          .budget-input {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            padding: 0 12px !important;
          }

          /* Remove number input arrows */
          .budget-input::-webkit-outer-spin-button,
          .budget-input::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0 !important;
          }

          .budget-input[type=number] {
            -moz-appearance: textfield !important;
          }

          /* Header styling to match existing tables */
          .ag-theme-alpine .ag-header {
            border-top-left-radius: 12px !important;
            border-top-right-radius: 12px !important;
            background-color: #f9fafb !important;
          }

          .ag-theme-alpine .ag-header-cell {
            border-right: 1px solid #e5e7eb !important;
            font-family: inherit !important;
            background-color: #f9fafb !important;
            color: #6b7280 !important;
            font-weight: 500 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
          }

          /* Right-aligned headers for numeric columns */
          .ag-theme-alpine .ag-header-cell.ag-right-aligned-header .ag-header-cell-text {
            text-align: right !important;
            justify-content: flex-end !important;
            padding-right: 12px !important;
          }

          .ag-theme-alpine .ag-header-cell.ag-right-aligned-header {
            text-align: right !important;
          }

          .ag-theme-alpine .ag-header-cell.ag-right-aligned-header > * {
            justify-content: flex-end !important;
          }

          .ag-theme-alpine .ag-cell {
            border-right: 1px solid #f3f4f6 !important;
            font-family: inherit !important;
            line-height: 1.5 !important;
            color: #374151 !important;
            font-size: 13px !important;
          }

          .ag-theme-alpine .ag-row {
            border-bottom: 1px solid #f3f4f6 !important;
            font-family: inherit !important;
            background-color: #ffffff !important;
          }

          .ag-theme-alpine .ag-row:hover {
            background-color: #f9fafb !important;
          }

          .ag-theme-alpine .ag-row:hover .ag-cell {
            background-color: #f9fafb !important;
          }

          /* Revenue section styling - inspired by campaign dashboard */
          .ag-theme-alpine .ag-row.revenue-header {
            background-color: #dcfce7 !important;
            border-top: 1px solid #e5e7eb !important;
            border-bottom: none !important;
          }
          
          .ag-theme-alpine .ag-row.revenue-header .ag-cell {
            background-color: #dcfce7 !important;
            font-weight: 600 !important;
            color: #14532d !important;
            font-size: 14px !important;
            padding: 16px 12px !important;
            border-right: 1px solid #bbf7d0 !important;
          }

          .ag-theme-alpine .ag-row.revenue-category {
            background-color: #f8fffe !important;
            cursor: pointer !important;
            border-bottom: 1px solid #e5e7eb !important;
          }

          .ag-theme-alpine .ag-row.revenue-category .ag-cell {
            background-color: #f8fffe !important;
            color: #166534 !important;
            font-weight: 500 !important;
            padding: 12px !important;
            border-right: 1px solid #e5e7eb !important;
          }

          .ag-theme-alpine .ag-row.revenue-category:hover {
            background-color: #f0fdf4 !important;
          }

          .ag-theme-alpine .ag-row.revenue-category:hover .ag-cell {
            background-color: #f0fdf4 !important;
          }

          /* Line items under revenue */
          .ag-theme-alpine .ag-row.revenue-line-item {
            background-color: #ffffff !important;
            border-bottom: 1px solid #f3f4f6 !important;
          }

          .ag-theme-alpine .ag-row.revenue-line-item .ag-cell {
            background-color: #ffffff !important;
            color: #374151 !important;
            padding: 10px 12px !important;
            border-right: 1px solid #f3f4f6 !important;
          }

          .ag-theme-alpine .ag-row.revenue-line-item:hover {
            background-color: #f9fafb !important;
          }

          .ag-theme-alpine .ag-row.revenue-line-item:hover .ag-cell {
            background-color: #f9fafb !important;
          }

          /* Expense section styling - inspired by campaign dashboard */
          .ag-theme-alpine .ag-row.expense-header {
            background-color: #fee2e2 !important;
            border-top: 1px solid #e5e7eb !important;
            border-bottom: none !important;
          }

          .ag-theme-alpine .ag-row.expense-header .ag-cell {
            background-color: #fee2e2 !important;
            font-weight: 600 !important;
            color: #7f1d1d !important;
            font-size: 14px !important;
            padding: 16px 12px !important;
            border-right: 1px solid #fca5a5 !important;
          }

          .ag-theme-alpine .ag-row.expense-category {
            background-color: #fef7f7 !important;
            cursor: pointer !important;
            border-bottom: 1px solid #e5e7eb !important;
          }

          .ag-theme-alpine .ag-row.expense-category .ag-cell {
            background-color: #fef7f7 !important;
            color: #991b1b !important;
            font-weight: 500 !important;
            padding: 12px !important;
            border-right: 1px solid #e5e7eb !important;
          }

          .ag-theme-alpine .ag-row.expense-category:hover {
            background-color: #fef5f5 !important;
          }

          .ag-theme-alpine .ag-row.expense-category:hover .ag-cell {
            background-color: #fef5f5 !important;
          }

          /* Line items under expenses */
          .ag-theme-alpine .ag-row.expense-line-item {
            background-color: #ffffff !important;
            border-bottom: 1px solid #f3f4f6 !important;
          }

          .ag-theme-alpine .ag-row.expense-line-item .ag-cell {
            background-color: #ffffff !important;
            color: #374151 !important;
            padding: 10px 12px !important;
            border-right: 1px solid #f3f4f6 !important;
          }

          .ag-theme-alpine .ag-row.expense-line-item:hover {
            background-color: #f9fafb !important;
          }

          .ag-theme-alpine .ag-row.expense-line-item:hover .ag-cell {
            background-color: #f9fafb !important;
          }

          /* Summary section styling */
          .ag-theme-alpine .ag-row.summary-header {
            background-color: #f9fafb !important;
          }

          .ag-theme-alpine .ag-row.summary-header .ag-cell {
            background-color: #f9fafb !important;
            font-weight: 600 !important;
            color: #374151 !important;
            font-size: 14px !important;
            padding: 16px 12px !important;
            border-right: 1px solid #e5e7eb !important;
          }

          /* Line item styling */
          .ag-theme-alpine .ag-row.line-item-row .ag-cell {
            color: #374151 !important;
            font-size: 13px !important;
          }

          .ag-theme-alpine .ag-row.line-item-row .ag-cell:first-child {
            padding-left: 48px !important;
            border-left: 3px solid #e5e7eb !important;
          }

          .budget-value {
            text-align: right;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }

          .budget-value:hover {
            background-color: #f3f4f6;
          }

          /* Add row styling */
          .ag-theme-alpine .ag-row.add-row {
            background-color: #f9fafb !important;
            cursor: pointer !important;
          }

          .ag-theme-alpine .ag-row.add-row .ag-cell {
            background-color: #f9fafb !important;
            color: #059669 !important;
            font-weight: 500 !important;
            font-style: italic !important;
          }

          .ag-theme-alpine .ag-row.add-row:hover {
            background-color: #f0fdf4 !important;
          }

          .ag-theme-alpine .ag-row.add-row:hover .ag-cell {
            background-color: #f0fdf4 !important;
            color: #047857 !important;
          }

          /* Add line item specific styling */
          .ag-theme-alpine .ag-row.add-line-item {
            background-color: #faf9ff !important;
            cursor: pointer !important;
          }

          .ag-theme-alpine .ag-row.add-line-item .ag-cell {
            background-color: #faf9ff !important;
            color: #a855f7 !important;
            font-weight: 500 !important;
            font-style: italic !important;
            text-align: right !important;
          }

          .ag-theme-alpine .ag-row.add-line-item:hover {
            background-color: #f3f0ff !important;
          }

          .ag-theme-alpine .ag-row.add-line-item:hover .ag-cell {
            background-color: #f3f0ff !important;
            color: #9333ea !important;
          }

          /* Custom component styles */
          .category-name {
            display: flex;
            align-items: center;
            gap: 6px;
            font-family: inherit;
          }

          .expand-icon {
            cursor: pointer;
            user-select: none;
            color: #6b7280;
            transition: color 0.2s ease;
            font-size: 12px;
          }

          .expand-icon:hover {
            color: #374151;
          }

          .item-count {
            margin-left: auto;
            font-size: 11px;
            opacity: 0.6;
            color: #6b7280;
          }

          .forecast-input {
            width: 100%;
            padding: 6px 8px;
            text-align: right;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 13px;
            font-family: inherit;
            background-color: #ffffff;
            transition: all 0.2s ease;
            color: #374151;
          }

          .forecast-input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
            border-color: #a855f7;
          }

          .actual-value {
            color: #1d4ed8;
            font-weight: 600;
            font-family: inherit;
            background-color: #eff6ff;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 13px;
          }

          .positive-variance {
            color: #059669;
            font-family: inherit;
            font-weight: 500;
          }

          .negative-variance {
            color: #dc2626;
            font-family: inherit;
            font-weight: 500;
          }

          .action-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: inherit;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .action-button:hover {
            background-color: #f3f4f6;
          }

          .add-button {
            color: #059669;
          }

          .add-button:hover {
            color: #047857;
            background-color: #f0fdf4;
          }

          .delete-button {
            color: #dc2626;
          }

          .delete-button:hover {
            color: #b91c1c;
            background-color: #fef2f2;
          }

          .revenue-total {
            color: #15803d;
            font-weight: 600;
            font-family: inherit;
          }

          .expense-total {
            color: #dc2626;
            font-weight: 600;
            font-family: inherit;
          }

          .profit-positive {
            color: #1d4ed8;
            font-weight: 700;
            font-family: inherit;
          }

          .profit-negative {
            color: #dc2626;
            font-weight: 700;
            font-family: inherit;
          }
        `}</style>
        {rowData.length === 0 ? (
          <div className="flex items-center justify-center h-full bg-gray-50 border border-gray-200 rounded">
            <div className="text-center">
              <p className="text-gray-500 text-sm">No forecast data available</p>
              <p className="text-gray-400 text-xs mt-1">Create budget categories and line items to start forecasting</p>
            </div>
          </div>
        ) : (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout='autoHeight'
            defaultColDef={{
              sortable: false,
              filter: false,
              resizable: true,
              suppressMenu: true
            }}
            suppressClickEdit={true}
            suppressRowClickSelection={true}
            suppressHorizontalScroll={false}
            alwaysShowHorizontalScroll={false}
            suppressMovableColumns={true}
            headerHeight={40}
            rowHeight={48}
            getRowClass={(params) => {
              if (params.data.type === 'section-header') {
                return params.data.isRevenue ? 'revenue-header' : 'expense-header';
              }
              if (params.data.type === 'summary') {
                return 'summary-header';
              }
              if (params.data.type === 'category-header') {
                return params.data.isRevenue ? 'revenue-category' : 'expense-category';
              }
              if (params.data.type === 'line-item') {
                return params.data.isRevenue ? 'revenue-line-item' : 'expense-line-item';
              }
              return '';
            }}
          />
        )}
      </div>
      
      {/* Custom Confirmation Popup */}
      {confirmPopup.show && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => confirmPopup.onCancel && confirmPopup.onCancel()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-10" />
          
          {/* Popup */}
          <div 
            className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-4"
            style={{
              position: 'fixed',
              left: confirmPopup.x,
              top: confirmPopup.y,
              transform: 'translate(-50%, -50%)' // Center popup on the coordinates
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Historical Data
                </h3>
              </div>
            </div>
            
            {/* Message */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                You are editing <span className="font-semibold text-gray-900">{confirmPopup.month}</span> actuals for a past month. 
                This will update historical data that may be used for reporting and analysis.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to continue?
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => confirmPopup.onCancel && confirmPopup.onCancel()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmPopup.onConfirm && confirmPopup.onConfirm()}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 border border-transparent rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Continue Editing
              </button>
            </div>
                     </div>
         </div>
       )}

       {/* Edit Value Popup */}
       {editPopup.show && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center"
           onClick={() => setEditPopup({ show: false, x: 0, y: 0, month: '', value: 0, lineItemId: null, monthIndex: null, dataType: null })}
         >
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black bg-opacity-10" />
           
                      {/* Popup */}
           <div 
             className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs mx-4"
             style={{
               position: 'fixed',
               left: editPopup.x,
               top: editPopup.y,
               transform: 'translate(-50%, -50%)'
             }}
             onClick={(e) => e.stopPropagation()}
           >
             {/* Header */}
             <div className="mb-3">
               <h3 className="text-sm font-medium text-gray-900">
                 {editPopup.month} {editPopup.dataType === 'actual' ? 'Actual' : 'Forecast'}
               </h3>
             </div>
             
             {/* Input Field */}
             <div className="mb-3">
               <input
                 type="number"
                 step="1"
                 defaultValue={editPopup.value}
                 className="w-full px-2 py-1.5 text-sm font-medium text-gray-900 border-2 border-purple-400 rounded focus:outline-none focus:border-purple-500 text-right compact-number-input"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const newValue = Math.round(parseFloat(e.target.value) || 0);
                      handleValueChange(editPopup.lineItemId, editPopup.monthIndex, newValue, editPopup.dataType);
                      setEditPopup({ show: false, x: 0, y: 0, month: '', value: 0, lineItemId: null, monthIndex: null, dataType: null });
                    } else if (e.key === 'Escape') {
                      setEditPopup({ show: false, x: 0, y: 0, month: '', value: 0, lineItemId: null, monthIndex: null, dataType: null });
                    }
                  }}
                  id="edit-value-input"
                />
              </div>
              
              <style>{`
                .compact-number-input::-webkit-outer-spin-button,
                .compact-number-input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                .compact-number-input[type=number] {
                  -moz-appearance: textfield;
                }
              `}</style>
             
             {/* Buttons */}
             <div className="flex gap-6 justify-center">
               <button
                 onClick={() => setEditPopup({ show: false, x: 0, y: 0, month: '', value: 0, lineItemId: null, monthIndex: null, dataType: null })}
                 className="text-purple-500 font-medium hover:text-purple-600 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={() => {
                   const input = document.getElementById('edit-value-input');
                   const newValue = Math.round(parseFloat(input.value) || 0);
                   handleValueChange(editPopup.lineItemId, editPopup.monthIndex, newValue, editPopup.dataType);
                   setEditPopup({ show: false, x: 0, y: 0, month: '', value: 0, lineItemId: null, monthIndex: null, dataType: null });
                 }}
                 className="text-purple-500 font-medium hover:text-purple-600 transition-colors"
               >
                 Save
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Reset Warning Popup */}
       {resetWarningPopup.show && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center"
           onClick={() => setResetWarningPopup({ show: false })}
         >
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black bg-opacity-10" />
           
           {/* Popup */}
           <div 
             className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-4"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Warning Icon */}
             <div className="flex items-center mb-4">
               <div className="flex-shrink-0">
                 <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
               </div>
               <div className="ml-3">
                 <h3 className="text-lg font-medium text-gray-900">
                   Reset Forecast to Budget
                 </h3>
               </div>
             </div>
             
             {/* Message */}
             <div className="mb-6">
               <p className="text-sm text-gray-600">
                 This action will <span className="font-semibold text-red-600">completely overwrite</span> all your current forecast values 
                 and replace them with the original budget numbers for {selectedYear}.
               </p>
               <p className="text-sm text-gray-500 mt-3">
                 <strong>Warning:</strong> This cannot be undone. All forecast adjustments you've made will be lost.
               </p>
               <p className="text-sm text-gray-600 mt-3">
                 Are you sure you want to reset all forecast values to match the budget?
               </p>
             </div>
             
             {/* Buttons */}
             <div className="flex gap-3 justify-end">
               <button
                 onClick={() => setResetWarningPopup({ show: false })}
                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={() => {
                   setResetWarningPopup({ show: false });
                   resetForecastToBudget();
                 }}
                 className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
               >
                 Reset to Budget
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default ForecastManager; 