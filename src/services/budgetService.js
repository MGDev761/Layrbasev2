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

  // Budget Data - Updated for new schema
  async getBudgetData(organizationId, year, dataType = 'all') {
    const { data, error } = await supabase
      .rpc('get_budget_summary', {
        p_organization_id: organizationId,
        p_year: year,
        p_data_type: dataType
      });
    
    if (error) throw error;
    return data;
  },

  async updateBudgetValue(organizationId, lineItemId, year, month, amount, dataType = 'budget') {
    // First try to update existing record
    const updateData = {};
    if (dataType === 'budget') {
      updateData.budget_amount = amount;
    } else if (dataType === 'forecast') {
      updateData.forecast_amount = amount;
    } else if (dataType === 'actuals') {
      updateData.actual_amount = amount;
    }

    const { data: updateResult, error: updateError } = await supabase
      .from('budget_data')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('organization_id', organizationId)
      .eq('line_item_id', lineItemId)
      .eq('year', year)
      .eq('month', month)
      .select()
      .single();

    if (updateError && updateError.code === 'PGRST116') {
      // Record doesn't exist, create it
      const insertData = {
        organization_id: organizationId,
        line_item_id: lineItemId,
        year,
        month,
        budget_amount: dataType === 'budget' ? amount : 0,
        forecast_amount: dataType === 'forecast' ? amount : 0,
        actual_amount: dataType === 'actuals' ? amount : 0
      };

      const { data: insertResult, error: insertError } = await supabase
        .from('budget_data')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) throw insertError;
      return insertResult;
    }
    
    if (updateError) throw updateError;
    return updateResult;
  },

  async bulkUpdateBudgetValues(organizationId, lineItemId, year, values, dataType = 'budget') {
    const budgetData = values.map((amount, index) => ({
      organization_id: organizationId,
      line_item_id: lineItemId,
      year,
      month: index + 1,
      budget_amount: dataType === 'budget' ? amount : 0,
      forecast_amount: dataType === 'forecast' ? amount : 0,
      actual_amount: dataType === 'actuals' ? amount : 0
    }));

    // Delete existing data for this line item and year
    await supabase
      .from('budget_data')
      .delete()
      .eq('organization_id', organizationId)
      .eq('line_item_id', lineItemId)
      .eq('year', year);

    // Insert new data
    const { data, error } = await supabase
      .from('budget_data')
      .insert(budgetData)
      .select();
    
    if (error) throw error;
    return data;
  },

  // Versions - Updated for new schema
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

  async createVersion(organizationId, year, versionName, versionType = 'budget', createdBy) {
    const { data, error } = await supabase
      .from('budget_versions')
      .insert({
        organization_id: organizationId,
        year,
        version_name: versionName,
        version_type: versionType,
        created_by: createdBy
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Lock a version (budget only, forecast should always be editable)
  async lockVersion(organizationId, year, versionType = 'budget', isLocked = true) {
    try {
      let lockedBy = null;
      if (isLocked) {
        const user = (await supabase.auth.getUser()).data.user;
        lockedBy = user && user.id ? user.id : null;
      }
      // Only add locked_by if locking and it's a valid UUID
      const updateObj = {
        is_locked: isLocked,
        locked_at: isLocked ? new Date().toISOString() : null,
      };
      if (
        isLocked &&
        typeof lockedBy === 'string' &&
        lockedBy.length === 36 &&
        lockedBy !== 'undefined'
      ) {
        updateObj.locked_by = lockedBy;
      }
      console.log('PATCH updateObj:', updateObj);
      const { data, error } = await supabase
        .from('budget_versions')
        .update(updateObj)
        .eq('organization_id', organizationId)
        .eq('year', year)
        .eq('version_type', versionType)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error locking version:', error);
      throw error;
    }
  },

  // Create forecast from budget
  async createForecastFromBudget(organizationId, year) {
    try {
      const { data, error } = await supabase
        .rpc('create_forecast_from_budget', {
          p_organization_id: organizationId,
          p_year: year
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating forecast from budget:', error);
      throw error;
    }
  },

  // Initialize budget for a year
  async initializeBudgetForYear(organizationId, year, versionType = 'budget') {
    try {
      // Create version
      const version = await this.createVersion(
        organizationId, 
        year, 
        `${versionType.charAt(0).toUpperCase() + versionType.slice(1)} ${year}`, 
        versionType,
        (await supabase.auth.getUser()).data.user?.id
      );

      // Initialize budget data for all line items
      const lineItems = await this.getLineItems(organizationId);
      const budgetData = [];

      lineItems.forEach(item => {
        for (let month = 1; month <= 12; month++) {
          budgetData.push({
            organization_id: organizationId,
            line_item_id: item.id,
            year,
            month,
            budget_amount: versionType === 'budget' ? 0 : 0,
            forecast_amount: versionType === 'forecast' ? 0 : 0,
            actual_amount: 0
          });
        }
      });

      if (budgetData.length > 0) {
        const { error } = await supabase
          .from('budget_data')
          .insert(budgetData);

        if (error) throw error;
      }

      return version;
    } catch (error) {
      console.error('Error initializing budget for year:', error);
      throw error;
    }
  },

  // Get budget summary
  async getBudgetSummary(organizationId, year, dataType = 'all') {
    try {
      const { data, error } = await supabase
        .rpc('get_budget_summary', {
          p_organization_id: organizationId,
          p_year: year,
          p_data_type: dataType
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting budget summary:', error);
      throw error;
    }
  },

  // Create sample data
  async createSampleData(organizationId) {
    try {
      const currentYear = new Date().getFullYear();
      
      // Create sample categories
      const categories = [
        { name: 'Sales Revenue', type: 'revenue', description: 'Revenue from product sales', color: '#10B981' },
        { name: 'Subscription Revenue', type: 'revenue', description: 'Monthly subscription revenue', color: '#059669' },
        { name: 'Personnel Costs', type: 'expense', description: 'Salaries and benefits', color: '#DC2626' },
        { name: 'Office & Admin', type: 'expense', description: 'Office rent and utilities', color: '#B91C1C' },
        { name: 'Marketing & Sales', type: 'expense', description: 'Marketing campaigns and sales activities', color: '#991B1B' }
      ];

      const createdCategories = [];
      for (const category of categories) {
        const created = await this.createCategory(organizationId, category);
        createdCategories.push(created);
      }

      // Create sample line items
      const lineItems = [
        { categoryId: createdCategories[0].id, name: 'Product Sales', type: 'revenue', isRecurring: true },
        { categoryId: createdCategories[1].id, name: 'SaaS Subscriptions', type: 'revenue', isRecurring: true },
        { categoryId: createdCategories[2].id, name: 'Developer Salaries', type: 'expense', isRecurring: true },
        { categoryId: createdCategories[2].id, name: 'Sales Team Salaries', type: 'expense', isRecurring: true },
        { categoryId: createdCategories[3].id, name: 'Office Rent', type: 'expense', isRecurring: true },
        { categoryId: createdCategories[4].id, name: 'Digital Marketing', type: 'expense', isRecurring: true }
      ];

      const createdLineItems = [];
      for (const item of lineItems) {
        const created = await this.createLineItem(organizationId, item);
        createdLineItems.push(created);
      }

      // Initialize budget for current year
      await this.initializeBudgetForYear(organizationId, currentYear, 'budget');

      // Add sample budget data
      const sampleData = [
        { lineItemId: createdLineItems[0].id, amounts: [50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 105000] },
        { lineItemId: createdLineItems[1].id, amounts: [20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000] },
        { lineItemId: createdLineItems[2].id, amounts: [80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000] },
        { lineItemId: createdLineItems[3].id, amounts: [60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000, 60000] },
        { lineItemId: createdLineItems[4].id, amounts: [5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000] },
        { lineItemId: createdLineItems[5].id, amounts: [10000, 12000, 15000, 18000, 20000, 22000, 25000, 28000, 30000, 32000, 35000, 38000] }
      ];

      for (const item of sampleData) {
        await this.bulkUpdateBudgetValues(organizationId, item.lineItemId, currentYear, item.amounts, 'budget');
      }

      return { categories: createdCategories, lineItems: createdLineItems };
    } catch (error) {
      console.error('Error creating sample data:', error);
      throw error;
    }
  },

  // Get budget with forecast comparison
  async getBudgetWithForecastComparison(organizationId, year) {
    try {
      const { data, error } = await supabase
        .rpc('get_budget_summary', {
          p_organization_id: organizationId,
          p_year: year,
          p_data_type: 'all'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting budget with forecast comparison:', error);
      throw error;
    }
  },

  async lockForecastAsActual(organizationId, lineItemId, year, month) {
    // Get the forecast value for this cell
    const { data, error } = await supabase
      .from('budget_data')
      .select('forecast_amount')
      .eq('organization_id', organizationId)
      .eq('line_item_id', lineItemId)
      .eq('year', year)
      .eq('month', month)
      .single();
    if (error) throw error;
    const forecastValue = data?.forecast_amount || 0;
    // Set actual_amount = forecast_amount
    return this.updateBudgetValue(organizationId, lineItemId, year, month, forecastValue, 'actuals');
  }
}; 