import { useState, useEffect, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { useAuth } from '../contexts/AuthContext';

export const useBudget = (options = {}) => {
  const { isForecast: initialIsForecast = false } = options;
  const { user, currentOrganization } = useAuth();
  const [budgetData, setBudgetData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isForecast, setIsForecast] = useState(initialIsForecast);
  const [showBudgetComparison, setShowBudgetComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);

  // Load budget data
  const loadBudgetData = useCallback(async () => {
    console.log('loadBudgetData called', currentOrganization?.organization_id, selectedYear, isForecast);
    if (!currentOrganization?.organization_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [budgetDataResult, categoriesResult, lineItemsResult] = await Promise.all([
        budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, isForecast),
        budgetService.getCategories(currentOrganization.organization_id),
        budgetService.getLineItems(currentOrganization.organization_id)
      ]);
      console.log('Fetched categories:', categoriesResult);
      console.log('Fetched lineItems:', lineItemsResult);
      setBudgetData(budgetDataResult);
      setCategories(categoriesResult);
      setLineItems(lineItemsResult);
    } catch (err) {
      setError(err.message);
      console.error('Error loading budget data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization?.organization_id, selectedYear, isForecast]);

  // Initialize budget for a year
  const initializeBudgetForYear = useCallback(async (year, forecast = false) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      await budgetService.initializeBudgetForYear(currentOrganization.organization_id, year, forecast);
      await loadBudgetData();
    } catch (err) {
      setError(err.message);
      console.error('Error initializing budget:', err);
    }
  }, [currentOrganization?.organization_id, loadBudgetData]);

  // Update a single budget value
  const updateBudgetValue = useCallback(async (lineItemId, month, amount) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      await budgetService.updateBudgetValue(
        currentOrganization.organization_id,
        lineItemId,
        selectedYear,
        month,
        amount,
        isForecast
      );
      
      // Update local state
      setBudgetData(prev => prev.map(item => {
        if (item.line_item_id === lineItemId) {
          const updatedItem = { ...item };
          updatedItem[`month_${month}`] = amount;
          updatedItem.total = Object.keys(updatedItem)
            .filter(key => key.startsWith('month_'))
            .reduce((sum, key) => sum + (updatedItem[key] || 0), 0);
          return updatedItem;
        }
        return item;
      }));
    } catch (err) {
      setError(err.message);
      console.error('Error updating budget value:', err);
    }
  }, [currentOrganization?.organization_id, selectedYear, isForecast]);

  // Bulk update budget values for a line item
  const bulkUpdateBudgetValues = useCallback(async (lineItemId, values) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      await budgetService.bulkUpdateBudgetValues(
        currentOrganization.organization_id,
        lineItemId,
        selectedYear,
        values,
        isForecast
      );
      await loadBudgetData();
    } catch (err) {
      setError(err.message);
      console.error('Error bulk updating budget values:', err);
    }
  }, [currentOrganization?.organization_id, selectedYear, isForecast, loadBudgetData]);

  // Create a new category
  const createCategory = useCallback(async (category) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      const newCategory = await budgetService.createCategory(currentOrganization.organization_id, category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err.message);
      console.error('Error creating category:', err);
      throw err;
    }
  }, [currentOrganization?.organization_id]);

  // Create a new line item
  const createLineItem = useCallback(async (lineItem) => {
    if (!currentOrganization?.organization_id) return;
    
    try {
      const newLineItem = await budgetService.createLineItem(currentOrganization.organization_id, lineItem);
      
      // Initialize budget data for the new line item
      const values = lineItem.isRecurring 
        ? Array(12).fill(Math.abs(lineItem.amount || 0))
        : Array(12).fill(0);
      
      await bulkUpdateBudgetValues(newLineItem.id, values);
      
      return newLineItem;
    } catch (err) {
      setError(err.message);
      console.error('Error creating line item:', err);
      throw err;
    }
  }, [currentOrganization?.id, bulkUpdateBudgetValues]);

  // Delete a line item
  const deleteLineItem = useCallback(async (lineItemId) => {
    try {
      await budgetService.deleteLineItem(lineItemId);
      setLineItems(prev => prev.filter(item => item.id !== lineItemId));
      setBudgetData(prev => prev.filter(item => item.line_item_id !== lineItemId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting line item:', err);
      throw err;
    }
  }, []);

  // Get budget summary
  const getBudgetSummary = useCallback(async () => {
    if (!currentOrganization?.id) return null;
    
    try {
      return await budgetService.getBudgetSummary(currentOrganization.id, selectedYear, isForecast);
    } catch (err) {
      setError(err.message);
      console.error('Error getting budget summary:', err);
      return null;
    }
  }, [currentOrganization?.id, selectedYear, isForecast]);

  // Group budget data by category
  const groupedBudgetData = useCallback(() => {
    const grouped = {};
    budgetData.forEach(item => {
      const categoryName = (item.category_name || 'Uncategorized').trim().toLowerCase();
      if (!grouped[categoryName]) {
        grouped[categoryName] = {
          type: item.type,
          items: []
        };
      }
      grouped[categoryName].items.push(item);
    });
    return grouped;
  }, [budgetData]);

  // Calculate totals by type
  const calculateTotals = useCallback(() => {
    const totals = {
      revenue: Array(12).fill(0),
      expense: Array(12).fill(0),
      profitLoss: Array(12).fill(0)
    };
    
    budgetData.forEach(item => {
      for (let month = 1; month <= 12; month++) {
        const amount = item[`month_${month}`] || 0;
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

  // Load comparison data (budget vs forecast)
  const loadComparisonData = useCallback(async () => {
    console.log('loadComparisonData called', currentOrganization?.organization_id, selectedYear);
    if (!currentOrganization?.organization_id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const comparisonResult = await budgetService.getBudgetWithForecastComparison(
        currentOrganization.organization_id, 
        selectedYear
      );
      console.log('Comparison data loaded:', comparisonResult);
      setComparisonData(comparisonResult);
    } catch (err) {
      setError(err.message);
      console.error('Error loading comparison data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization?.organization_id, selectedYear]);

  // Group comparison data by category
  const groupedComparisonData = useCallback(() => {
    console.log('groupedComparisonData called with:', comparisonData.length, 'items');
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

  // Calculate comparison totals
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

  // Load data when dependencies change
  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData]);

  return {
    // State
    budgetData,
    categories,
    lineItems,
    loading,
    error,
    selectedYear,
    isForecast,
    showBudgetComparison,
    comparisonData,
    
    // Actions
    setSelectedYear,
    setIsForecast,
    setShowBudgetComparison,
    loadBudgetData,
    loadComparisonData,
    initializeBudgetForYear,
    updateBudgetValue,
    bulkUpdateBudgetValues,
    createCategory,
    createLineItem,
    deleteLineItem,
    getBudgetSummary,
    
    // Computed
    groupedBudgetData: groupedBudgetData(),
    totals: calculateTotals(),
    groupedComparisonData: groupedComparisonData(),
    comparisonTotals: calculateComparisonTotals(),
    
    // Utilities
    clearError: () => setError(null)
  };
}; 