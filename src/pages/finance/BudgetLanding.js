import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { budgetService } from '../../services/budgetService';
import { DocumentDuplicateIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const BudgetLanding = () => {
  const navigate = useNavigate();
  const { currentOrganization } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const checkExistingBudget = async () => {
      if (!currentOrganization?.organization_id) return;
      setCheckingExisting(true);
      try {
        const [categories, lineItems] = await Promise.all([
          budgetService.getCategories(currentOrganization.organization_id),
          budgetService.getLineItems(currentOrganization.organization_id)
        ]);
        if ((categories && categories.length > 0) || (lineItems && lineItems.length > 0)) {
          navigate('/finance/budget/table', { replace: true });
        }
      } catch (e) {
        // ignore
      } finally {
        setCheckingExisting(false);
      }
    };
    checkExistingBudget();
  }, [currentOrganization, navigate]);

  const handleTemplateClick = async () => {
    console.log('handleTemplateClick called', currentOrganization);
    if (!currentOrganization?.organization_id) return;
    setLoading(true);
    try {
      await budgetService.createSampleData(currentOrganization.organization_id);
      // Force a full reload to guarantee fresh data
      window.location.href = '/finance/budget/table';
    } catch (error) {
      alert(error.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleScratchClick = () => {
    navigate('/finance/budget/table');
  };

  if (checkingExisting) {
    return null;
  }

  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
        <p className="text-gray-600 text-sm mb-6">Add and manage your revenue and cost lines. Expand/collapse groups to focus on what matters. All values are editable.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="bg-white rounded-xl shadow p-8 flex-1 max-w-md text-center border border-gray-100">
          <DocumentDuplicateIcon className="mx-auto h-10 w-10 text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Use a Budget Template</h2>
          <p className="mb-6 text-gray-500">Jumpstart your budget with pre-filled categories and example data.</p>
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50"
            onClick={handleTemplateClick}
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Start with Template'}
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-8 flex-1 max-w-md text-center border border-gray-100">
          <PencilSquareIcon className="mx-auto h-10 w-10 text-gray-700 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Build My Own Budget</h2>
          <p className="mb-6 text-gray-500">Create a custom budget with your own categories and items.</p>
          <button
            className="bg-gray-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800"
            onClick={handleScratchClick}
          >
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetLanding; 