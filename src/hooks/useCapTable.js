import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { capTableService } from '../services/capTableService';

export const useCapTable = () => {
  const { currentOrganization } = useAuth();
  const organizationId = currentOrganization?.organization_id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capTable, setCapTable] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [shareholders, setShareholders] = useState([]);
  const [shareClasses, setShareClasses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [preferenceTerms, setPreferenceTerms] = useState([]);

  // Load all data
  const loadData = useCallback(async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [
        shareholdersData,
        shareClassesData,
        roundsData,
        transactionsData,
        preferenceTermsData,
        capTableData
      ] = await Promise.all([
        capTableService.getShareholders(organizationId),
        capTableService.getShareClasses(organizationId),
        capTableService.getFinancingRounds(organizationId),
        capTableService.getTransactions(organizationId),
        capTableService.getPreferenceTerms(organizationId),
        capTableService.getCapTableAtRound(organizationId)
      ]);

      setShareholders(shareholdersData);
      setShareClasses(shareClassesData);
      setRounds(roundsData);
      setTransactions(transactionsData);
      setPreferenceTerms(preferenceTermsData);
      setCapTable(capTableData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading cap table data:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load cap table at specific round
  const loadCapTableAtRound = useCallback(async (roundId) => {
    if (!organizationId) return;
    try {
      setLoading(true);
      const data = await capTableService.getCapTableAtRound(organizationId, roundId);
      setCapTable(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading cap table at round:', err);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  // Calculate exit scenario
  const calculateExitScenario = useCallback(async (acquisitionAmount, acquisitionPercentage, preferenceType) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      const result = await capTableService.calculateExitScenario(
        organizationId,
        acquisitionAmount,
        acquisitionPercentage,
        preferenceType
      );
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error calculating exit scenario:', err);
      throw err;
    }
  }, [organizationId]);

  // CRUD operations for shareholders
  const addShareholder = useCallback(async (shareholder) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      const newShareholder = await capTableService.createShareholder(shareholder, organizationId);
      setShareholders(prev => [...prev, newShareholder]);
      return newShareholder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId]);

  const updateShareholder = useCallback(async (id, updates) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      const updatedShareholder = await capTableService.updateShareholder(id, updates, organizationId);
      setShareholders(prev => prev.map(sh => sh.id === id ? updatedShareholder : sh));
      return updatedShareholder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId]);

  const deleteShareholder = useCallback(async (id) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      await capTableService.deleteShareholder(id, organizationId);
      setShareholders(prev => prev.filter(sh => sh.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId]);

  // CRUD for Share Classes
  const addShareClass = useCallback(async (shareClassData) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      const newShareClass = await capTableService.createShareClass(shareClassData, organizationId);
      setShareClasses(prev => [...prev, newShareClass].sort((a,b) => a.name.localeCompare(b.name)));
      return newShareClass;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId]);

  // CRUD operations for rounds
  const addRound = useCallback(async (roundData, participants) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      const newRound = await capTableService.createFinancingRound(roundData, participants, organizationId);
      await loadData();
      return newRound;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId, loadData]);

  const updateRound = useCallback(async (id, updates) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      const updatedRound = await capTableService.updateFinancingRound(id, updates, organizationId);
      setRounds(prev => prev.map(r => r.id === id ? updatedRound : r));
      return updatedRound;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId]);

  const deleteRound = useCallback(async (id) => {
    if (!organizationId) throw new Error("No organization selected");
    try {
      await capTableService.deleteFinancingRound(id, organizationId);
      setRounds(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [organizationId]);

  // CRUD operations for transactions
  const addTransaction = useCallback(async (transaction) => {
    if (!organizationId) throw new Error("No organization selected");
    const newTransaction = await capTableService.createTransaction(transaction, organizationId);
    await loadData(); // Reload all data for simplicity
    return newTransaction;
  }, [organizationId, loadData]);

  const updateTransaction = useCallback(async (id, updates) => {
    if (!organizationId) throw new Error("No organization selected");
    const updatedTransaction = await capTableService.updateTransaction(id, updates, organizationId);
    await loadData(); // Reload all data
    return updatedTransaction;
  }, [organizationId, loadData]);

  const deleteTransaction = useCallback(async (id) => {
    if (!organizationId) throw new Error("No organization selected");
    await capTableService.deleteTransaction(id, organizationId);
    await loadData(); // Reload all data
  }, [organizationId, loadData]);

  // CRUD operations for preference terms
  const addPreferenceTerm = useCallback(async (term) => {
    try {
      const newTerm = await capTableService.createPreferenceTerm(term);
      setPreferenceTerms(prev => [...prev, newTerm]);
      return newTerm;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    // State
    loading,
    error,
    capTable,
    rounds,
    shareholders,
    shareClasses,
    transactions,
    preferenceTerms,
    
    // Actions
    loadData,
    loadCapTableAtRound,
    calculateExitScenario,
    
    // Shareholder operations
    addShareholder,
    updateShareholder,
    deleteShareholder,
    
    // Share Class operations
    addShareClass,
    
    // Round operations
    addRound,
    updateRound,
    deleteRound,
    
    // Transaction operations
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Preference term operations
    addPreferenceTerm,
    
    // Utility
    clearError: () => setError(null),
    organizationId,
  };
}; 