import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { budgetService } from '../../../../services/budgetService';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { 
  PlusIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  TrashIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AddBudgetItemModal from './AddBudgetItemModal';
import { useBudget } from '../../../../hooks/useBudget';
import { supabase } from '../../../../lib/supabase';

// Register AG-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const BudgetBuilder = () => {
  const { currentOrganization } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState('months'); // 'months' or 'quarters'
  const [isBudgetLocked, setIsBudgetLocked] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [addCategoryModal, setAddCategoryModal] = useState({ isOpen: false, type: 'revenue' });
  const [addLineItemModal, setAddLineItemModal] = useState({ isOpen: false, category: null });
  const [unlockWarningModal, setUnlockWarningModal] = useState({ isOpen: false });
  const [hoveredSection, setHoveredSection] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Load budget data
  const loadBudgetData = useCallback(async () => {
    if (!currentOrganization?.organization_id) return;
    
    setLoading(true);
    try {
      const [budgetDataResult, categoriesResult, lineItemsResult] = await Promise.all([
        budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, 'budget'),
        budgetService.getCategories(currentOrganization.organization_id),
        budgetService.getLineItems(currentOrganization.organization_id)
      ]);
      
      setBudgetData(budgetDataResult);
      setCategories(categoriesResult);
      setLineItems(lineItemsResult);
      
      // Auto-expand categories that have data
      const categoriesWithData = new Set();
      budgetDataResult.forEach(item => {
        if (item.budget_total > 0) {
          categoriesWithData.add(item.category_name);
        }
      });
      setExpandedCategories(categoriesWithData);
      
    } catch (error) {
      console.error('Error loading budget data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization?.organization_id, selectedYear]);

  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData]);

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

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const totals = {
      revenue: Array(12).fill(0),
      expense: Array(12).fill(0),
      profitLoss: Array(12).fill(0)
    };
    
    budgetData.forEach(item => {
      for (let month = 1; month <= 12; month++) {
        const amount = item[`budget_month_${month}`] || 0;
        if (item.type === 'revenue') {
          totals.revenue[month - 1] += amount;
        } else {
          totals.expense[month - 1] += Math.abs(amount);
        }
      }
    });
    
    // Calculate profit/loss
    for (let i = 0; i < 12; i++) {
      totals.profitLoss[i] = totals.revenue[i] - totals.expense[i];
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
  const handleValueChange = async (lineItemId, month, value) => {
    if (!currentOrganization?.organization_id) return;
    
    // Check if budget is locked - if so, just return without doing anything
    if (isBudgetLocked) {
      return;
    }
    
    await actuallyUpdateValue(lineItemId, month, value);
  };

  const actuallyUpdateValue = async (lineItemId, month, value) => {
    const amount = parseFloat(value) || 0;
    try {
      await budgetService.updateBudgetValue(
        currentOrganization.organization_id,
        lineItemId,
        selectedYear,
        month,
        amount,
        'budget'
      );
      
      // Reload data to reflect changes
      await loadBudgetData();
    } catch (error) {
      console.error('Error updating budget value:', error);
    }
  };

  // Handle category actions
  const handleAddCategory = async (categoryData) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      await budgetService.createCategory(currentOrganization.organization_id, categoryData);
      await loadBudgetData();
      setAddCategoryModal({ isOpen: false, type: 'revenue' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleAddLineItem = async (lineItemData) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      // Create the line item first
      const newLineItem = await budgetService.createLineItem(currentOrganization.organization_id, lineItemData);
      
      // If there's an amount and it's recurring, create budget data for all 12 months
      if (lineItemData.amount && lineItemData.isRecurring) {
        const amount = Math.round(parseFloat(lineItemData.amount) || 0);
        for (let month = 1; month <= 12; month++) {
          await budgetService.updateBudgetValue(
            currentOrganization.organization_id, 
            newLineItem.id, 
            selectedYear, 
            month, 
            amount, 
            'budget'
          );
        }
      } else if (lineItemData.amount && !lineItemData.isRecurring) {
        // If not recurring, add to the selected month
        const amount = Math.round(parseFloat(lineItemData.amount) || 0);
        const month = lineItemData.month || 1; // Default to January if no month specified
        await budgetService.updateBudgetValue(
          currentOrganization.organization_id, 
          newLineItem.id, 
          selectedYear, 
          month, 
          amount, 
          'budget'
        );
      }
      
      await loadBudgetData();
      setAddLineItemModal({ isOpen: false });
    } catch (error) {
      console.error('Error creating line item:', error);
    }
  };

  const handleDeleteLineItem = async (lineItemId) => {
    try {
      await budgetService.deleteLineItem(lineItemId);
      await loadBudgetData();
      setSuccessMessage('Line item deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting line item:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      // First delete all line items in this category
      const categoryLineItems = lineItems.filter(item => item.category_id === categoryId);
      for (const lineItem of categoryLineItems) {
        await budgetService.deleteLineItem(lineItem.id);
      }
      
      // Then delete the category itself
      const { error } = await supabase
        .from('budget_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      await loadBudgetData();
      setSuccessMessage('Category and all line items deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleLockBudget = async () => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      // Lock the budget version
      await budgetService.lockVersion(currentOrganization.organization_id, selectedYear, 'budget', true);
      
      setIsBudgetLocked(true);
    } catch (error) {
      console.error('Error locking budget:', error);
      setSuccessMessage('Error locking budget. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleUnlockBudget = async () => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      // Unlock the budget version
      await budgetService.lockVersion(currentOrganization.organization_id, selectedYear, 'budget', false);
      
      setIsBudgetLocked(false);
      setUnlockWarningModal({ isOpen: false });
    } catch (error) {
      console.error('Error unlocking budget:', error);
      setSuccessMessage('Error unlocking budget. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const openAddCategoryModal = (type) => {
    setAddCategoryModal({ isOpen: true, type });
  };

  const openAddLineItemModal = (category) => {
    setAddLineItemModal({ isOpen: true, category });
  };

  // Handle quarterly changes
  const handleQuarterlyChange = async (lineItemId, quarterIndex, value) => {
    const quarterValue = parseFloat(value) || 0;
    const monthlyValue = quarterValue / 3;
    
    for (let i = 0; i < 3; i++) {
      const month = quarterIndex * 3 + i + 1;
      await handleValueChange(lineItemId, month, monthlyValue);
    }
  };

  // Prepare row data for AG-Grid
  const rowData = useMemo(() => {
    const rows = [];

    // Add revenue section header
    rows.push({
      id: 'revenue-header',
      categoryName: 'REVENUE',
      type: 'section-header',
      isRevenue: true,
      total: totals.revenue.reduce((sum, val) => sum + val, 0)
    });

    // Add revenue categories and line items
    categories.filter(cat => cat.type === 'revenue').forEach(category => {
      const categoryKey = category.name.trim().toLowerCase();
      const categoryData = groupedBudgetData[categoryKey] || { items: [] };
      const categoryLineItems = lineItems.filter(item => item.category_id === category.id);
      
      // Calculate category total
      const categoryTotal = categoryLineItems.reduce((sum, lineItem) => {
        const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
        return sum + (budgetItem.budget_total || 0);
      }, 0);
      
      // Add category header with total
      rows.push({
        id: `category-${category.id}`,
        categoryName: category.name,
        type: 'category-header',
        isRevenue: true,
        categoryId: category.id,
        itemCount: categoryLineItems.length,
        budgetTotal: categoryTotal
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
            lineItemId: lineItem.id,
            budgetTotal: budgetItem.budget_total || 0
          };

          // Add monthly data
          for (let i = 1; i <= 12; i++) {
            row[`month${i}`] = budgetItem[`budget_month_${i}`] || 0;
          }

          rows.push(row);
        });
        
        // Add "Add line item" row
        rows.push({
          id: `add-line-item-${category.id}`,
          categoryName: '+ Add line item',
          type: 'add-line-item',
          isRevenue: true,
          categoryId: category.id
        });
      }
    });



    // Add expense section header
    rows.push({
      id: 'expense-header',
      categoryName: 'EXPENSES',
      type: 'section-header',
      isRevenue: false,
      total: totals.expense.reduce((sum, val) => sum + val, 0)
    });

    // Add expense categories and line items
    categories.filter(cat => cat.type === 'expense').forEach(category => {
      const categoryKey = category.name.trim().toLowerCase();
      const categoryData = groupedBudgetData[categoryKey] || { items: [] };
      const categoryLineItems = lineItems.filter(item => item.category_id === category.id);
      
      // Calculate category total
      const categoryTotal = categoryLineItems.reduce((sum, lineItem) => {
        const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
        return sum + (budgetItem.budget_total || 0);
      }, 0);
      
      // Add category header with total
      rows.push({
        id: `category-${category.id}`,
        categoryName: category.name,
        type: 'category-header',
        isRevenue: false,
        categoryId: category.id,
        itemCount: categoryLineItems.length,
        budgetTotal: categoryTotal
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
            lineItemId: lineItem.id,
            budgetTotal: budgetItem.budget_total || 0
          };

          // Add monthly data
          for (let i = 1; i <= 12; i++) {
            row[`month${i}`] = budgetItem[`budget_month_${i}`] || 0;
          }

          rows.push(row);
        });
        
        // Add "Add line item" row
        rows.push({
          id: `add-line-item-${category.id}`,
          categoryName: '+ Add line item',
          type: 'add-line-item',
          isRevenue: false,
          categoryId: category.id
        });
      }
    });



    // Add profit/loss summary
    rows.push({
      id: 'profit-loss',
      categoryName: 'PROFIT / LOSS',
      type: 'summary',
      total: totals.profitLoss.reduce((sum, val) => sum + val, 0)
    });

    return rows;
  }, [categories, lineItems, groupedBudgetData, expandedCategories, totals]);

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
            const isHovered = hoveredSection === (params.data.isRevenue ? 'revenue' : 'expense');
            
            return React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingLeft: '12px',
                fontWeight: '600',
                fontSize: '13px',
                color: params.data.isRevenue ? '#15803d' : '#7f1d1d',
                position: 'relative',
                width: '100%'
              },
              onMouseEnter: () => setHoveredSection(params.data.isRevenue ? 'revenue' : 'expense'),
              onMouseLeave: () => setHoveredSection(null)
            }, [
              React.createElement('span', { key: 'title' }, params.value),
              // Add category button on hover
              isHovered && !isBudgetLocked ? React.createElement('button', {
                key: 'add-category',
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAddCategoryModal({ 
                    isOpen: true, 
                    type: params.data.isRevenue ? 'revenue' : 'expense'
                  });
                },
                style: {
                  backgroundColor: params.data.isRevenue ? '#f0fdf4' : '#fef2f2',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  marginRight: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: params.data.isRevenue ? '#166534' : '#991b1b',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                },
                onMouseEnter: (e) => {
                  e.target.style.backgroundColor = params.data.isRevenue ? '#dcfce7' : '#fee2e2';
                  e.target.style.color = params.data.isRevenue ? '#14532d' : '#7f1d1d';
                },
                onMouseLeave: (e) => {
                  e.target.style.backgroundColor = params.data.isRevenue ? '#f0fdf4' : '#fef2f2';
                  e.target.style.color = params.data.isRevenue ? '#166534' : '#991b1b';
                },
                title: 'Add category'
              }, '+ Category') : null
            ]);
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
                paddingRight: '12px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                color: params.data.isRevenue ? '#15803d' : '#7f1d1d',
                width: '100%'
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

          if (params.data.type === 'add-line-item') {
            return React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingLeft: '48px',
                paddingRight: '12px',
                justifyContent: 'flex-end',
                cursor: isBudgetLocked ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '13px',
                color: isBudgetLocked ? '#9ca3af' : '#a855f7',
                fontStyle: 'italic',
                opacity: isBudgetLocked ? 0.5 : 1,
                width: '100%'
              },
              onClick: () => {
                if (isBudgetLocked) return; // Prevent adding line items when locked
                const category = categories.find(cat => cat.id === params.data.categoryId);
                openAddLineItemModal(category);
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
        cols.push({
          field: `month${index + 1}`,
          headerName: month,
          width: 120,
          type: 'numericColumn',
          headerClass: 'ag-right-aligned-header',
          cellRenderer: (params) => {
            if (params.data.type === 'section-header') {
              const monthlyTotal = params.data.isRevenue 
                ? totals.revenue[index] 
                : params.data.isRevenue === false 
                  ? totals.expense[index]
                  : null;
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
              const profit = totals.profitLoss[index] || 0;
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
            if (params.data.type === 'category-header') {
              const categoryLineItems = lineItems.filter(item => item.category_id === params.data.categoryId);
              const categoryData = groupedBudgetData[params.data.categoryName.trim().toLowerCase()] || { items: [] };
              const monthlyTotal = categoryLineItems.reduce((sum, lineItem) => {
                const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
                return sum + (budgetItem[`budget_month_${index + 1}`] || 0);
              }, 0);
              return React.createElement('div', {
                style: { 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  justifyContent: 'flex-end', 
                  paddingRight: '12px',
                  width: '100%',
                  textAlign: 'right',
                  color: params.data.isRevenue ? '#15803d' : '#7f1d1d'
                }
              }, Math.round(monthlyTotal).toLocaleString());
            }
            if (params.data.type === 'line-item') {
              return React.createElement('input', {
                key: `${params.data.lineItemId}-month-${index + 1}`,
                type: 'text',
                defaultValue: Math.round(params.value || 0).toLocaleString(),
                readOnly: isBudgetLocked,
                onFocus: (e) => {
                  // Remove commas when editing
                  const numericValue = e.target.value.replace(/,/g, '');
                  e.target.value = numericValue;
                },
                onBlur: (e) => {
                  const value = Math.round(parseFloat(e.target.value.replace(/,/g, '')) || 0);
                  // Add commas back
                  e.target.value = value.toLocaleString();
                  if (value !== Math.round(params.value || 0)) {
                    handleValueChange(params.data.lineItemId, index + 1, value);
                  }
                },
                className: 'budget-input',
                style: { 
                  width: '100%',
                  height: '100%', 
                  textAlign: 'right',
                  backgroundColor: isBudgetLocked ? '#f9fafb' : '#ffffff',
                  cursor: isBudgetLocked ? 'not-allowed' : 'text',
                  boxSizing: 'border-box',
                  margin: 0,
                  border: 'none',
                  outline: 'none'
                }
              });
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
          headerClass: 'ag-right-aligned-header',
          valueGetter: (params) => {
            if (params.data.type === 'line-item') {
              const start = qIndex * 3 + 1;
              const end = start + 2;
              let total = 0;
              for (let i = start; i <= end; i++) {
                total += params.data[`month${i}`] || 0;
              }
              return total;
            }
            return null;
          },
          cellRenderer: (params) => {
            if (params.data.type === 'section-header') {
              const quarterlyTotal = calculateQuarterlyTotals(
                params.data.isRevenue ? totals.revenue : totals.expense
              )[qIndex];
              return React.createElement('div', {
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
              }, Math.round(quarterlyTotal).toLocaleString());
            }
            if (params.data.type === 'summary') {
              const quarterlyProfit = calculateQuarterlyTotals(totals.profitLoss)[qIndex];
              const color = quarterlyProfit >= 0 ? '#1d4ed8' : '#dc2626';
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
              }, Math.round(quarterlyProfit).toLocaleString());
            }
            if (params.data.type === 'category-header') {
              const categoryLineItems = lineItems.filter(item => item.category_id === params.data.categoryId);
              const categoryData = groupedBudgetData[params.data.categoryName.trim().toLowerCase()] || { items: [] };
              const quarterlyTotal = categoryLineItems.reduce((sum, lineItem) => {
                const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
                let lineItemQuarterlyTotal = 0;
                for (let i = qIndex * 3 + 1; i <= (qIndex + 1) * 3; i++) {
                  lineItemQuarterlyTotal += budgetItem[`budget_month_${i}`] || 0;
                }
                return sum + lineItemQuarterlyTotal;
              }, 0);
              return React.createElement('div', {
                style: { 
                  display: 'flex', 
                  alignItems: 'center', 
                  height: '100%', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  justifyContent: 'flex-end', 
                  paddingRight: '12px',
                  width: '100%',
                  textAlign: 'right',
                  color: params.data.isRevenue ? '#15803d' : '#7f1d1d'
                }
              }, Math.round(quarterlyTotal).toLocaleString());
            }
            if (params.data.type === 'line-item') {
              return React.createElement('input', {
                key: `${params.data.lineItemId}-quarter-${qIndex + 1}`,
                type: 'text',
                defaultValue: Math.round(params.value || 0).toLocaleString(),
                readOnly: isBudgetLocked,
                onFocus: (e) => {
                  // Remove commas when editing
                  const numericValue = e.target.value.replace(/,/g, '');
                  e.target.value = numericValue;
                },
                onBlur: (e) => {
                  const value = Math.round(parseFloat(e.target.value.replace(/,/g, '')) || 0);
                  // Add commas back
                  e.target.value = value.toLocaleString();
                  if (value !== Math.round(params.value || 0)) {
                    handleQuarterlyChange(params.data.lineItemId, qIndex, value);
                  }
                },
                className: 'budget-input',
                style: { 
                  width: '100%',
                  height: '100%', 
                  textAlign: 'right',
                  backgroundColor: isBudgetLocked ? '#f9fafb' : '#ffffff',
                  cursor: isBudgetLocked ? 'not-allowed' : 'text',
                  boxSizing: 'border-box',
                  margin: 0,
                  border: 'none',
                  outline: 'none'
                }
              });
            }
            return params.value ? React.createElement('div', {
              style: { display: 'flex', alignItems: 'center', height: '100%' }
            }, params.value.toLocaleString()) : '';
          }
        });
      });
    }

    // Add total column
    cols.push({
      field: 'budgetTotal',
      headerName: 'Total',
      width: 120,
      type: 'numericColumn',
      headerClass: 'ag-right-aligned-header',
      pinned: 'right',
      valueGetter: (params) => {
        if (params.data.type === 'line-item') {
          // Calculate total from monthly values
          let total = 0;
          for (let i = 1; i <= 12; i++) {
            total += params.data[`month${i}`] || 0;
          }
          return total;
        }
        if (params.data.type === 'category-header') {
          // Calculate category total from all line items in this category
          const categoryLineItems = lineItems.filter(item => item.category_id === params.data.categoryId);
          const categoryData = groupedBudgetData[params.data.categoryName.trim().toLowerCase()] || { items: [] };
          return categoryLineItems.reduce((sum, lineItem) => {
            const budgetItem = categoryData.items.find(item => item.line_item_id === lineItem.id) || {};
            let lineItemTotal = 0;
            for (let i = 1; i <= 12; i++) {
              lineItemTotal += budgetItem[`budget_month_${i}`] || 0;
            }
            return sum + lineItemTotal;
          }, 0);
        }
        return params.data.budgetTotal || params.data.total || 0;
      },
      cellRenderer: (params) => {
        if (params.data.type === 'section-header') {
          return React.createElement('div', {
            className: params.data.isRevenue ? 'revenue-total' : 'expense-total',
            style: { display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '12px', justifyContent: 'flex-end', paddingRight: '12px' }
          }, Math.round(params.data.total).toLocaleString());
        }
        if (params.data.type === 'category-header') {
          return React.createElement('div', {
            className: params.data.isRevenue ? 'revenue-total' : 'expense-total',
            style: { fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '12px', justifyContent: 'flex-end', paddingRight: '12px' }
          }, Math.round(params.value || 0).toLocaleString());
        }
        if (params.data.type === 'summary') {
          const className = params.data.total >= 0 ? 'profit-positive' : 'profit-negative';
          return React.createElement('div', {
            className: className,
            style: { display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '12px', justifyContent: 'flex-end', paddingRight: '12px' }
          }, Math.round(params.data.total).toLocaleString());
        }
        if (params.data.type === 'line-item') {
          return React.createElement('div', {
            className: params.data.isRevenue ? 'revenue-total' : 'expense-total',
            style: { fontSize: '13px', display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '12px', justifyContent: 'flex-end', paddingRight: '12px' }
          }, Math.round(params.value || 0).toLocaleString());
        }
        return '';
      }
    });

    // Add actions column
    cols.push({
      field: 'actions',
      headerName: '',
      width: 80,
      pinned: 'right',
      headerClass: 'center-header',
      cellClass: 'center-cell',
      cellRenderer: (params) => {
        if (params.data.type === 'category-header') {
          return React.createElement('button', {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this category and all its line items?')) {
                handleDeleteCategory(params.data.categoryId);
              }
            },
            style: {
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'color 0.2s ease',
              margin: '0 auto'
            },
            onMouseEnter: (e) => e.target.style.color = '#ef4444',
            onMouseLeave: (e) => e.target.style.color = '#9ca3af',
            title: 'Delete category'
          }, React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }, [
            React.createElement('path', { key: 'path1', d: 'M3 6h18' }),
            React.createElement('path', { key: 'path2', d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
            React.createElement('line', { key: 'line1', x1: '10', y1: '11', x2: '10', y2: '17' }),
            React.createElement('line', { key: 'line2', x1: '14', y1: '11', x2: '14', y2: '17' })
          ]));
        }
        if (params.data.type === 'line-item') {
          return React.createElement('button', {
            onClick: () => handleDeleteLineItem(params.data.lineItemId),
            className: 'action-button delete-button',
            style: {
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              margin: '0 auto',
              transition: 'color 0.2s ease'
            },
            onMouseEnter: (e) => e.target.style.color = '#ef4444',
            onMouseLeave: (e) => e.target.style.color = '#9ca3af',
            title: 'Delete line item'
          }, React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }, [
            React.createElement('path', { key: 'path1', d: 'M3 6h18' }),
            React.createElement('path', { key: 'path2', d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }),
            React.createElement('line', { key: 'line1', x1: '10', y1: '11', x2: '10', y2: '17' }),
            React.createElement('line', { key: 'line2', x1: '14', y1: '11', x2: '14', y2: '17' })
          ]));
        }
        return '';
      }
    });

    return cols;
  }, [viewMode, expandedCategories, totals, months, categories, handleValueChange, handleDeleteLineItem, handleDeleteCategory, toggleCategory, openAddLineItemModal, handleQuarterlyChange]);

  // Expose functions to window for grid callbacks
  useEffect(() => {
    // No longer needed since we're using React components directly
    return () => {};
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading budget data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Budget Builder</h2>
        <p className="text-gray-600 text-xs">Create your annual budget by adding revenue and expense categories and line items.</p>
      </div>

      {/* Locked Budget Notification */}
      {isBudgetLocked && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <LockClosedIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Budget is Locked</h3>
              <div className="mt-1 text-sm text-yellow-700">
                This budget is currently locked to prevent accidental changes. Click the lock button to unlock and make edits.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2">
          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
          <span className="text-green-700 text-sm">{successMessage}</span>
        </div>
      )}

      {/* AG-Grid */}
      <div className="ag-theme-alpine bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ width: '100%' }}>
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
            --ag-selected-row-background-color: #f0f9ff !important;
            --ag-range-selection-background-color: #dbeafe !important;
            --ag-cell-horizontal-border: 1px solid #f9fafb !important;
            --ag-row-border-color: #f9fafb !important;
            --ag-header-height: 48px !important;
            --ag-row-height: 48px !important;
            --ag-cell-horizontal-padding: 16px !important;
            --ag-cell-vertical-padding: 12px !important;
            --ag-header-cell-font-size: 12px !important;
            --ag-font-size: 13px !important;
            --ag-font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
          }

          /* Remove border from just the grid element, but add top border */
          .ag-theme-alpine .ag-root-wrapper {
            border: none !important;
            border-top: 1px solid #e5e7eb !important;
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

          /* Expense section styling */
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

          .budget-input {
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
            height: 36px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
          }

          .budget-input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
            border-color: #a855f7;
          }

          /* Number input styling (no longer needed since using text inputs) */

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
            display: flex !important;
            align-items: center !important;
          }

          /* Force right alignment for revenue and expense totals */
          .ag-theme-alpine .ag-cell .revenue-total,
          .ag-theme-alpine .ag-cell .expense-total {
            display: flex !important;
            justify-content: flex-end !important;
            text-align: right !important;
            width: 100% !important;
          }

          /* Remove black border on selected cells */
          .ag-theme-alpine .ag-cell-focus,
          .ag-theme-alpine .ag-cell-focus:not(.ag-cell-range-selected):focus-within {
            border: 1px solid #e5e7eb !important;
            outline: none !important;
          }

          .ag-theme-alpine .ag-cell-range-selected:not(.ag-cell-focus) {
            border: 1px solid #e5e7eb !important;
          }

          /* Ensure full width for cells */
          .ag-theme-alpine .ag-cell {
            padding: 0 !important;
          }

          .ag-theme-alpine .ag-cell .budget-input {
            border: none !important;
            width: 100% !important;
            height: 100% !important;
            padding: 6px 8px !important;
            box-sizing: border-box !important;
            min-width: 0 !important;
            max-width: 100% !important;
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
            text-align: right;
            justify-content: flex-end;
          }

          .expense-total {
            color: #7f1d1d;
            font-weight: 600;
            font-family: inherit;
            text-align: right;
            justify-content: flex-end;
          }

          .profit-positive {
            color: #1d4ed8 !important;
            font-weight: 700 !important;
            font-family: inherit !important;
            text-align: right !important;
            justify-content: flex-end !important;
            display: flex !important;
            align-items: center !important;
            width: 100% !important;
          }

          .profit-negative {
            color: #dc2626 !important;
            font-weight: 700 !important;
            font-family: inherit !important;
            text-align: right !important;
            justify-content: flex-end !important;
            display: flex !important;
            align-items: center !important;
            width: 100% !important;
          }

          .center-header {
            text-align: center !important;
            justify-content: center !important;
          }

          .center-cell {
            text-align: center !important;
            justify-content: center !important;
          }
        `}</style>
        
        {/* Budget Controls */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={isBudgetLocked ? () => setUnlockWarningModal({ isOpen: true }) : handleLockBudget}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                isBudgetLocked 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              <LockClosedIcon className="h-4 w-4" />
              {isBudgetLocked ? 'Budget Locked' : 'Lock Budget'}
            </button>
            
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Change Log
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
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
          </div>
        </div>

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
              return 'line-item-row';
            }

            if (params.data.type === 'add-line-item') {
              return 'add-line-item';
            }
            return '';
          }}
        />
      </div>



      {/* Modals */}
      <AddBudgetItemModal
        isOpen={addCategoryModal.isOpen}
        onClose={() => setAddCategoryModal({ isOpen: false, type: 'revenue' })}
        onCreateCategory={handleAddCategory}
        categories={categories}
        type="category"
        typeOverride={addCategoryModal.type}
      />

      <AddBudgetItemModal
        isOpen={addLineItemModal.isOpen}
        onClose={() => setAddLineItemModal({ isOpen: false })}
        onAdd={handleAddLineItem}
        onCreateCategory={handleAddCategory}
        categories={categories}
        selectedCategory={addLineItemModal.category}
        type="lineItem"
        typeOverride={addLineItemModal.type}
      />

      {/* Unlock Warning Modal */}
      {unlockWarningModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <LockClosedIcon className="w-6 h-6" />
                  Unlock Budget
                </h2>
                <button 
                  onClick={() => setUnlockWarningModal({ isOpen: false })} 
                  className="text-white hover:text-gray-200 text-xl"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                This budget is locked. It can be unlocked and any changes made will be logged. 
                Are you sure you want to unlock this budget?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setUnlockWarningModal({ isOpen: false })}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlockBudget}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Unlock Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-purple-50 text-purple-700 border-b-2 border-purple-300 rounded-b-xl px-8 py-3 shadow-md font-bold text-base flex items-center gap-3" style={{ minWidth: 320, maxWidth: 600 }}>
            <CheckCircleIcon className="w-6 h-6 text-purple-400" />
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetBuilder; 