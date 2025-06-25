import React, { useState } from 'react';
import { useCapTable } from '../../hooks/useCapTable';
import CapTableContent from './components/captable/CapTableContent';
import RoundHistory from './components/roundhistory/RoundHistory';
import ExitScenarios from './components/exitscenarios/ExitScenarios';
import InvestmentPlanning from './components/investment/InvestmentPlanning';
import AddShareClassForm from './components/captable/AddShareClassForm';
import Modal from '../../components/common/layout/Modal';

const CapTable = ({ activeSubTab, onSubTabChange }) => {
  const { addShareClass, loading, error } = useCapTable();

  const [isAddShareClassModalOpen, setAddShareClassModalOpen] = useState(false);

  const handleAddShareClass = async (shareClassData) => {
    await addShareClass(shareClassData);
    setAddShareClassModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return <CapTableContent />;
      case 'rounds':
        return <RoundHistory />;
      case 'shareholders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Shareholders</h2>
              <button
                type="button"
                onClick={() => setAddShareClassModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Share Classes
              </button>
            </div>
            {/* Shareholder table content would go here */}
          </div>
        );
      case 'exits':
        return <ExitScenarios />;
      case 'investment':
        return <InvestmentPlanning />;
      default:
        return <CapTableContent />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}

      <Modal isOpen={isAddShareClassModalOpen} onClose={() => setAddShareClassModalOpen(false)}>
        <AddShareClassForm
          onAdd={handleAddShareClass}
          onCancel={() => setAddShareClassModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CapTable; 