import { supabase } from '../lib/supabase';

// Categories
export const getCashFlowCategories = async (organizationId) => {
  const { data, error } = await supabase
    .from('cash_flow_categories')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createCashFlowCategory = async (category) => {
  const { data, error } = await supabase
    .from('cash_flow_categories')
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCashFlowCategory = async (id, updates) => {
  const { data, error } = await supabase
    .from('cash_flow_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCashFlowCategory = async (id) => {
  const { error } = await supabase
    .from('cash_flow_categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Subcategories
export const getCashFlowSubcategories = async (categoryId) => {
  const { data, error } = await supabase
    .from('cash_flow_subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createCashFlowSubcategory = async (subcategory) => {
  const { data, error } = await supabase
    .from('cash_flow_subcategories')
    .insert(subcategory)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Transactions
export const getCashFlowTransactions = async (organizationId, filters = {}) => {
  let query = supabase
    .from('cash_flow_transactions')
    .select(`
      *,
      cash_flow_categories(name, type),
      cash_flow_subcategories(name)
    `)
    .eq('organization_id', organizationId);
  
  if (filters.startDate) {
    query = query.gte('transaction_date', filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte('transaction_date', filters.endDate);
  }
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  const { data, error } = await query.order('transaction_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createCashFlowTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('cash_flow_transactions')
    .insert({
      ...transaction,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCashFlowTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('cash_flow_transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCashFlowTransaction = async (id) => {
  const { error } = await supabase
    .from('cash_flow_transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Forecasts
export const getCashFlowForecasts = async (organizationId, filters = {}) => {
  let query = supabase
    .from('cash_flow_forecasts')
    .select(`
      *,
      cash_flow_categories(name, type),
      cash_flow_subcategories(name)
    `)
    .eq('organization_id', organizationId);
  
  if (filters.startDate) {
    query = query.gte('forecast_date', filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte('forecast_date', filters.endDate);
  }
  
  const { data, error } = await query.order('forecast_date');
  
  if (error) throw error;
  return data;
};

export const createCashFlowForecast = async (forecast) => {
  const { data, error } = await supabase
    .from('cash_flow_forecasts')
    .insert({
      ...forecast,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCashFlowForecast = async (id, updates) => {
  const { data, error } = await supabase
    .from('cash_flow_forecasts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCashFlowForecast = async (id) => {
  const { error } = await supabase
    .from('cash_flow_forecasts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Snapshots
export const getCashFlowSnapshots = async (organizationId, startDate, endDate) => {
  const { data, error } = await supabase
    .from('cash_flow_snapshots')
    .select('*')
    .eq('organization_id', organizationId)
    .gte('snapshot_date', startDate)
    .lte('snapshot_date', endDate)
    .order('snapshot_date');
  
  if (error) throw error;
  return data;
};

export const createCashFlowSnapshot = async (snapshot) => {
  const { data, error } = await supabase
    .from('cash_flow_snapshots')
    .insert(snapshot)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Analytics
export const getCashFlowSummary = async (organizationId, startDate, endDate) => {
  const { data: transactions, error: transactionsError } = await supabase
    .from('cash_flow_transactions')
    .select('amount, type, transaction_date')
    .eq('organization_id', organizationId)
    .eq('status', 'actual')
    .gte('transaction_date', startDate)
    .lte('transaction_date', endDate);
  
  if (transactionsError) throw transactionsError;
  
  const { data: forecasts, error: forecastsError } = await supabase
    .from('cash_flow_forecasts')
    .select('amount, type, forecast_date')
    .eq('organization_id', organizationId)
    .gte('forecast_date', startDate)
    .lte('forecast_date', endDate);
  
  if (forecastsError) throw forecastsError;
  
  const actualIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const actualExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const forecastIncome = forecasts
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + parseFloat(f.amount), 0);
  
  const forecastExpenses = forecasts
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + parseFloat(f.amount), 0);
  
  return {
    actual: {
      income: actualIncome,
      expenses: actualExpenses,
      netCashFlow: actualIncome - actualExpenses
    },
    forecast: {
      income: forecastIncome,
      expenses: forecastExpenses,
      netCashFlow: forecastIncome - forecastExpenses
    },
    combined: {
      income: actualIncome + forecastIncome,
      expenses: actualExpenses + forecastExpenses,
      netCashFlow: (actualIncome + forecastIncome) - (actualExpenses + forecastExpenses)
    }
  };
};

// Initialize default categories for a new organization
export const initializeDefaultCategories = async (organizationId) => {
  const defaultCategories = [
    { name: 'Sales Revenue', description: 'Revenue from product or service sales', type: 'income' },
    { name: 'Investment Income', description: 'Income from investments, interest, dividends', type: 'income' },
    { name: 'Other Income', description: 'Miscellaneous income sources', type: 'income' },
    { name: 'Operating Expenses', description: 'Day-to-day business operations', type: 'expense' },
    { name: 'Payroll', description: 'Employee salaries, benefits, and taxes', type: 'expense' },
    { name: 'Marketing & Sales', description: 'Marketing campaigns, advertising, sales costs', type: 'expense' },
    { name: 'Technology', description: 'Software, hardware, IT services', type: 'expense' },
    { name: 'Office & Admin', description: 'Rent, utilities, office supplies', type: 'expense' },
    { name: 'Professional Services', description: 'Legal, accounting, consulting fees', type: 'expense' },
    { name: 'Other Expenses', description: 'Miscellaneous business expenses', type: 'expense' }
  ];
  
  const categoriesWithOrgId = defaultCategories.map(cat => ({
    ...cat,
    organization_id: organizationId
  }));
  
  const { data, error } = await supabase
    .from('cash_flow_categories')
    .insert(categoriesWithOrgId)
    .select();
  
  if (error) throw error;
  return data;
};

// Get the latest bank balance for an organization
export const getCurrentBankBalance = async (organizationId) => {
  const { data, error } = await supabase
    .from('cash_flow_snapshots')
    .select('current_bank_balance, snapshot_date')
    .eq('organization_id', organizationId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // ignore no rows error
  return data?.current_bank_balance ?? null;
};

// Update or insert the latest bank balance for an organization
export const setCurrentBankBalance = async (organizationId, balance) => {
  const today = new Date().toISOString().slice(0, 10);
  // Upsert by org+date
  const { data, error } = await supabase
    .from('cash_flow_snapshots')
    .upsert([
      {
        organization_id: organizationId,
        snapshot_date: today,
        current_bank_balance: balance
      }
    ], { onConflict: ['organization_id', 'snapshot_date'] })
    .select()
    .single();
  if (error) throw error;
  return data.current_bank_balance;
};

// Get unpaid sent invoices (incoming)
export const getUnpaidSentInvoices = async (organizationId) => {
  const { data, error } = await supabase
    .from('sent_invoices')
    .select('total_amount, due_date')
    .eq('organization_id', organizationId)
    .in('status', ['pending', 'scheduled'])
    .gte('due_date', new Date().toISOString().slice(0, 10));
  if (error) throw error;
  return data || [];
};

// Get unpaid received invoices (outgoing)
export const getUnpaidReceivedInvoices = async (organizationId) => {
  const { data, error } = await supabase
    .from('received_invoices')
    .select('total_amount, due_date')
    .eq('organization_id', organizationId)
    .in('status', ['pending', 'scheduled'])
    .gte('due_date', new Date().toISOString().slice(0, 10));
  if (error) throw error;
  return data || [];
}; 