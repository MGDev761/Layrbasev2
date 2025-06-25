import { supabase } from '../lib/supabase';

// Shareholders
export const capTableService = {
  // Shareholders
  async getShareholders(organizationId) {
    const { data, error } = await supabase
      .from('shareholders')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createShareholder(shareholder, organizationId) {
    const { data, error } = await supabase
      .from('shareholders')
      .insert([{ ...shareholder, organization_id: organizationId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateShareholder(id, updates, organizationId) {
    const { data, error } = await supabase
      .from('shareholders')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteShareholder(id, organizationId) {
    const { error } = await supabase
      .from('shareholders')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw error;
  },

  // Share Classes
  async getShareClasses(organizationId) {
    const { data, error } = await supabase
      .from('share_classes')
      .select('*')
      .eq('organization_id', organizationId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async createShareClass(shareClass, organizationId) {
    const { data, error } = await supabase
      .from('share_classes')
      .insert([{ ...shareClass, organization_id: organizationId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Financing Rounds
  async getFinancingRounds(organizationId) {
    const { data, error } = await supabase
      .from('financing_rounds')
      .select(`
        *,
        share_classes(name)
      `)
      .eq('organization_id', organizationId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createFinancingRound(round, participants, organizationId) {
    const { data, error } = await supabase.rpc('create_financing_round_with_options', {
      p_organization_id: organizationId,
      round_name: round.name,
      round_date: round.date,
      pre_money_valuation: round.pre_money_valuation,
      share_class_id: round.share_class_id,
      option_pool_shares: round.option_pool_shares,
      participants_data: participants.map(p => ({
        shareholder_id: p.shareholder_id,
        investment_amount: p.investment_amount
      }))
    });

    if (error) {
      console.error('Error creating financing round with options:', error);
      throw error;
    }
    
    return data;
  },

  async updateFinancingRound(id, updates, organizationId) {
    const { data, error } = await supabase
      .from('financing_rounds')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFinancingRound(id, organizationId) {
    const { error } = await supabase
      .from('financing_rounds')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw error;
  },

  // Transactions
  async getTransactions(organizationId, roundId = null) {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          shareholders(name, role),
          financing_rounds(name, date)
        `)
        .eq('organization_id', organizationId)
        .order('created_at');
      
      if (roundId) {
        query = query.eq('round_id', roundId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return this.attachShareClassesToTransactions(data, organizationId);
    } catch (error) {
      console.error('Error in getTransactions:', error);
      throw error;
    }
  },

  async createTransaction(transaction, organizationId) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, organization_id: organizationId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTransaction(id, updates, organizationId) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('organization_id', organizationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTransaction(id, organizationId) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('organization_id', organizationId);
    
    if (error) throw error;
  },

  // Preference Terms
  async getPreferenceTerms(organizationId) {
    const { data, error } = await supabase
      .from('preference_terms')
      .select('*')
      .eq('organization_id', organizationId);
    
    if (error) throw error;
    return data;
  },

  async createPreferenceTerm(term, organizationId) {
    const { data, error } = await supabase
      .from('preference_terms')
      .insert([{ ...term, organization_id: organizationId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCapTableAtRound(organizationId, roundId = null) {
    try {
      const transactions = await this.getTransactions(organizationId, roundId);
      return this.calculateCapTableFromTransactions(transactions);
    } catch (error) {
      console.error('Error in getCapTableAtRound:', error);
      throw error;
    }
  },

  async attachShareClassesToTransactions(transactions, organizationId) {
    if (!transactions || transactions.length === 0) return [];
    
    const roundIds = [...new Set(transactions.map(tx => tx.round_id).filter(Boolean))];
    if (roundIds.length === 0) return transactions;
    
    const { data: roundsData, error } = await supabase
      .from('financing_rounds')
      .select('id, share_classes(name)')
      .in('id', roundIds)
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error fetching rounds to attach share classes:', error);
      return transactions;
    }
    
    const roundMap = {};
    roundsData?.forEach(round => {
      roundMap[round.id] = round.share_classes?.name || 'Common';
    });
    
    return transactions.map(tx => ({
      ...tx,
      shareClass: roundMap[tx.round_id] || 'Common'
    }));
  },

  calculateCapTableFromTransactions(transactions) {
    const holdings = {};
    let totalShares = 0;

    // Aggregate shares by shareholder
    transactions.forEach(tx => {
      const shareholderId = tx.shareholder_id;
      if (!holdings[shareholderId]) {
        holdings[shareholderId] = {
          id: shareholderId,
          name: tx.shareholders?.name || 'Unknown',
          role: tx.shareholders?.role || 'Unknown',
          shares: 0,
          investment: 0,
          shareClass: tx.shareClass || 'Common',
        };
      }
      
      holdings[shareholderId].shares += parseFloat(tx.shares_issued || 0);
      holdings[shareholderId].investment += parseFloat(tx.investment_amount || 0);
      totalShares += parseFloat(tx.shares_issued || 0);
    });

    // Calculate ownership percentages
    const capTable = Object.values(holdings).map(holding => ({
      ...holding,
      ownership: totalShares > 0 ? (holding.shares / totalShares) * 100 : 0,
    }));

    return {
      capTable,
      totalShares,
      summary: {
        totalShares,
        totalInvestment: capTable.reduce((sum, h) => sum + h.investment, 0),
      }
    };
  },

  // Exit Scenario Calculations
  async calculateExitScenario(organizationId, acquisitionAmount, acquisitionPercentage, preferenceType = 'non-participating') {
    const { capTable } = await this.getCapTableAtRound(organizationId);
    const actualAcquisitionValue = (acquisitionAmount * acquisitionPercentage) / 100;
    
    // Get preference terms
    const preferenceTerms = await this.getPreferenceTerms(organizationId);
    
    return this.calculateExitValues(capTable, actualAcquisitionValue, preferenceTerms, preferenceType);
  },

  calculateExitValues(capTable, acquisitionValue, preferenceTerms, preferenceType) {
    // Calculate preference payouts
    const preferencePayouts = capTable
      .filter(shareholder => shareholder.shareClass.includes('Preferred'))
      .map(shareholder => {
        const term = preferenceTerms.find(t => t.share_classes.name === shareholder.shareClass);
        const multiplier = term ? term.multiplier : 1;
        const preferenceAmount = shareholder.investment * multiplier;
        const conversionValue = (shareholder.ownership / 100) * acquisitionValue;
        
        let finalValue;
        if (preferenceType === 'non-participating') {
          finalValue = Math.max(preferenceAmount, conversionValue);
        } else {
          finalValue = preferenceAmount + conversionValue;
        }

        return {
          ...shareholder,
          preferenceAmount,
          conversionValue,
          finalValue,
          tookPreference: preferenceType === 'participating' || preferenceAmount > conversionValue,
          multiplier,
        };
      });

    // Calculate remaining proceeds
    const totalPreferencePayout = preferencePayouts.reduce((sum, p) => sum + p.finalValue, 0);
    const remainingProceeds = Math.max(0, acquisitionValue - totalPreferencePayout);

    // Distribute remaining to common shareholders
    const commonShareholders = capTable.filter(s => s.shareClass === 'Common');
    const totalCommonOwnership = commonShareholders.reduce((sum, s) => sum + s.ownership, 0);

    const exitCalculations = capTable.map(shareholder => {
      if (shareholder.shareClass.includes('Preferred')) {
        const preferencePayout = preferencePayouts.find(p => p.id === shareholder.id);
        return preferencePayout;
      } else {
        const commonShare = totalCommonOwnership > 0 ? (shareholder.ownership / totalCommonOwnership) * remainingProceeds : 0;
        return {
          ...shareholder,
          preferenceAmount: 0,
          conversionValue: commonShare,
          finalValue: commonShare,
          tookPreference: false,
          multiplier: 1,
        };
      }
    });

    return {
      exitCalculations,
      totalExitValue: exitCalculations.reduce((sum, calc) => sum + calc.finalValue, 0),
      totalPreferencePayout,
      remainingProceeds,
    };
  }
}; 