import { supabase } from '../lib/supabase';

export const budgetService = {
  // Categories
  async getCategories(organizationId) {
    const { data, error } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createCategory(organizationId, category) {
    const { data, error } = await supabase
      .from('budget_categories')
      .insert({
        organization_id: organizationId,
        name: category.name,
        type: category.type,
        description: category.description,
        color: category.color || '#6B7280'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(categoryId, updates) {
    const { data, error } = await supabase
      .from('budget_categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(categoryId) {
    const { error } = await supabase
      .from('budget_categories')
      .delete()
      .eq('id', categoryId);
    
    if (error) throw error;
  },

  // Line Items
  async getLineItems(organizationId) {
    const { data, error } = await supabase
      .from('budget_line_items')
      .select(`
        *,
        budget_categories (
          id,
          name,
          type,
          color
        )
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createLineItem(organizationId, lineItem) {
    const { data, error } = await supabase
      .from('budget_line_items')
      .insert({
        organization_id: organizationId,
        category_id: lineItem.categoryId,
        name: lineItem.name,
        description: lineItem.description,
        type: lineItem.type,
        is_recurring: lineItem.isRecurring
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateLineItem(lineItemId, updates) {
    const { data, error } = await supabase
      .from('budget_line_items')
      .update(updates)
      .eq('id', lineItemId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteLineItem(lineItemId) {
    const { error } = await supabase
      .from('budget_line_items')
      .delete()
      .eq('id', lineItemId);
    
    if (error) throw error;
  },

  // Budget Data
  async getBudgetData(organizationId, year, isForecast = false) {
    const { data, error } = await supabase
      .rpc('get_budget_summary', {
        p_organization_id: organizationId,
        p_year: year,
        p_is_forecast: isForecast
      });
    
    if (error) throw error;
    return data;
  },

  async updateBudgetValue(organizationId, lineItemId, year, month, amount, isForecast = false) {
    // First try to update existing record
    const { data: updateData, error: updateError } = await supabase
      .from('budget_data')
      .update({ amount, updated_at: new Date().toISOString() })
      .eq('organization_id', organizationId)
      .eq('line_item_id', lineItemId)
      .eq('year', year)
      .eq('month', month)
      .eq('is_forecast', isForecast)
      .select()
      .single();

    if (updateError && updateError.code === 'PGRST116') {
      // Record doesn't exist, create it
      const { data: insertData, error: insertError } = await supabase
        .from('budget_data')
        .insert({
          organization_id: organizationId,
          line_item_id: lineItemId,
          year,
          month,
          amount,
          is_forecast: isForecast
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      return insertData;
    }
    
    if (updateError) throw updateError;
    return updateData;
  },

  async bulkUpdateBudgetValues(organizationId, lineItemId, year, values, isForecast = false) {
    const budgetData = values.map((amount, index) => ({
      organization_id: organizationId,
      line_item_id: lineItemId,
      year,
      month: index + 1,
      amount,
      is_forecast: isForecast
    }));

    // Delete existing data for this line item and year
    await supabase
      .from('budget_data')
      .delete()
      .eq('organization_id', organizationId)
      .eq('line_item_id', lineItemId)
      .eq('year', year)
      .eq('is_forecast', isForecast);

    // Insert new data
    const { data, error } = await supabase
      .from('budget_data')
      .insert(budgetData)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Versions
  async getVersions(organizationId, year) {
    const { data, error } = await supabase
      .from('budget_versions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('year', year)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createVersion(organizationId, year, versionName, isForecast = false, createdBy) {
    const { data, error } = await supabase
      .from('budget_versions')
      .insert({
        organization_id: organizationId,
        year,
        version_name: versionName,
        is_forecast: isForecast,
        created_by: createdBy
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async lockVersion(versionId, isLocked) {
    const { data, error } = await supabase
      .from('budget_versions')
      .update({ is_locked: isLocked })
      .eq('id', versionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Helper functions
  async initializeBudgetForYear(organizationId, year, isForecast = false) {
    // Get all active line items
    const lineItems = await this.getLineItems(organizationId);
    
    // Create budget data entries for each line item
    const budgetData = [];
    lineItems.forEach(item => {
      for (let month = 1; month <= 12; month++) {
        budgetData.push({
          organization_id: organizationId,
          line_item_id: item.id,
          year,
          month,
          amount: 0,
          is_forecast: isForecast
        });
      }
    });

    if (budgetData.length > 0) {
      const { error } = await supabase
        .from('budget_data')
        .upsert(budgetData, { onConflict: 'organization_id,line_item_id,year,month,is_forecast' });
      
      if (error) throw error;
    }
  },

  // Get summary statistics
  async getBudgetSummary(organizationId, year, isForecast = false) {
    const budgetData = await this.getBudgetData(organizationId, year, isForecast);
    
    const summary = {
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0,
      revenueItems: 0,
      expenseItems: 0
    };

    budgetData.forEach(item => {
      const total = item.total || 0;
      if (item.type === 'revenue') {
        summary.totalRevenue += total;
        summary.revenueItems++;
      } else {
        summary.totalExpenses += Math.abs(total);
        summary.expenseItems++;
      }
    });

    summary.netIncome = summary.totalRevenue - summary.totalExpenses;
    return summary;
  },

  // Create sample data for testing
  async createSampleData(organizationId) {
    try {
      // Always create these categories and line items for the template
      const revenueCategory = await this.createCategory(organizationId, {
        name: 'Revenue',
        type: 'revenue',
        description: 'All revenue streams',
        color: '#10B981'
      });

      const productSalesCategory = await this.createCategory(organizationId, {
        name: 'Product Sales',
        type: 'revenue',
        description: 'Revenue from product sales',
        color: '#3B82F6'
      });

      const consultingCategory = await this.createCategory(organizationId, {
        name: 'Consulting',
        type: 'revenue',
        description: 'Revenue from consulting services',
        color: '#6366F1'
      });

      // Add a Sales line under Revenue
      const salesLine = await this.createLineItem(organizationId, {
        categoryId: revenueCategory.id,
        name: 'Sales',
        description: 'Sales revenue',
        type: 'revenue',
        isRecurring: true
      });

      const costsCategory = await this.createCategory(organizationId, {
        name: 'Costs',
        type: 'expense',
        description: 'All costs',
        color: '#EF4444'
      });

      const salariesCategory = await this.createCategory(organizationId, {
        name: 'Salaries',
        type: 'expense',
        description: 'Employee salaries and benefits',
        color: '#F59E0B'
      });

      const marketingCategory = await this.createCategory(organizationId, {
        name: 'Marketing',
        type: 'expense',
        description: 'Marketing and advertising expenses',
        color: '#A21CAF'
      });

      // Add Salaries and Marketing lines under Costs
      const salariesLine = await this.createLineItem(organizationId, {
        categoryId: costsCategory.id,
        name: 'Salaries',
        description: 'Salaries expense',
        type: 'expense',
        isRecurring: true
      });
      const marketingLine = await this.createLineItem(organizationId, {
        categoryId: costsCategory.id,
        name: 'Marketing',
        description: 'Marketing expense',
        type: 'expense',
        isRecurring: true
      });

      // Create line items for each category
      const productSales = await this.createLineItem(organizationId, {
        categoryId: productSalesCategory.id,
        name: 'Product Sales',
        description: 'Product sales revenue',
        type: 'revenue',
        isRecurring: true
      });

      const consulting = await this.createLineItem(organizationId, {
        categoryId: consultingCategory.id,
        name: 'Consulting',
        description: 'Consulting revenue',
        type: 'revenue',
        isRecurring: true
      });

      const salaries = await this.createLineItem(organizationId, {
        categoryId: salariesCategory.id,
        name: 'Salaries',
        description: 'Salaries expense',
        type: 'expense',
        isRecurring: true
      });

      const marketing = await this.createLineItem(organizationId, {
        categoryId: marketingCategory.id,
        name: 'Marketing',
        description: 'Marketing expense',
        type: 'expense',
        isRecurring: true
      });

      // No budget values, just structure
      return {
        categories: [revenueCategory, productSalesCategory, consultingCategory, costsCategory, salariesCategory, marketingCategory],
        lineItems: [salesLine, productSales, consulting, salariesLine, marketingLine, salaries, marketing]
      };
    } catch (error) {
      console.error('Error creating sample data:', error);
      throw error;
    }
  },

  // Get budget data with forecast comparison
  async getBudgetWithForecastComparison(organizationId, year) {
    console.log('getBudgetWithForecastComparison called with:', { organizationId, year });
    
    const [budgetData, forecastData] = await Promise.all([
      this.getBudgetData(organizationId, year, false), // Budget data
      this.getBudgetData(organizationId, year, true)   // Forecast data
    ]);

    console.log('Budget data loaded:', budgetData.length, 'items');
    console.log('Forecast data loaded:', forecastData.length, 'items');

    // Create a map of line items with both budget and forecast data
    const comparisonMap = new Map();

    // Process budget data
    budgetData.forEach(item => {
      const key = item.line_item_id;
      if (!comparisonMap.has(key)) {
        comparisonMap.set(key, {
          line_item_id: item.line_item_id,
          line_item_name: item.line_item_name,
          category_id: item.category_id,
          category_name: item.category_name,
          type: item.type,
          budget: {},
          forecast: {},
          budget_total: 0,
          forecast_total: 0
        });
      }
      const entry = comparisonMap.get(key);
      for (let month = 1; month <= 12; month++) {
        const monthKey = `month_${month}`;
        entry.budget[monthKey] = item[monthKey] || 0;
        entry.budget_total += item[monthKey] || 0;
      }
    });

    // Process forecast data
    forecastData.forEach(item => {
      const key = item.line_item_id;
      if (!comparisonMap.has(key)) {
        comparisonMap.set(key, {
          line_item_id: item.line_item_id,
          line_item_name: item.line_item_name,
          category_id: item.category_id,
          category_name: item.category_name,
          type: item.type,
          budget: {},
          forecast: {},
          budget_total: 0,
          forecast_total: 0
        });
      }
      const entry = comparisonMap.get(key);
      for (let month = 1; month <= 12; month++) {
        const monthKey = `month_${month}`;
        entry.forecast[monthKey] = item[monthKey] || 0;
        entry.forecast_total += item[monthKey] || 0;
      }
    });

    // Ensure every entry has both budget and forecast months filled (default to 0)
    const allKeys = new Set([
      ...budgetData.map(item => item.line_item_id),
      ...forecastData.map(item => item.line_item_id)
    ]);
    allKeys.forEach(key => {
      const entry = comparisonMap.get(key);
      if (!entry) return;
      if (!entry.budget) entry.budget = {};
      if (!entry.forecast) entry.forecast = {};
      for (let month = 1; month <= 12; month++) {
        const m = `month_${month}`;
        if (entry.budget[m] === undefined) entry.budget[m] = 0;
        if (entry.forecast[m] === undefined) entry.forecast[m] = 0;
      }
    });

    const result = Array.from(comparisonMap.values());
    console.log('Comparison result:', result.length, 'items');
    console.log('Sample comparison item:', result[0]);
    
    return result;
  }
}; 