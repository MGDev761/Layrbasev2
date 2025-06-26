import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { budgetService } from '../../../../services/budgetService';

const QuickBudgetEditorModal = ({ isOpen, onClose, categories, onSave, loadBudgetData }) => {
  const { currentOrganization } = useAuth();
  const [localCategories, setLocalCategories] = useState(() => categories.map(c => ({ ...c })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLocalCategories(categories.map(c => ({ ...c })));
  }, [categories, isOpen]);

  if (!isOpen) return null;

  const handleCategoryNameChange = (id, value) => {
    setLocalCategories(cats => cats.map(c => c.id === id ? { ...c, name: value } : c));
  };
  const handleAddCategory = (type) => {
    const newCat = { id: `new-cat-${Date.now()}`, name: '', type, isNew: true };
    setLocalCategories(cats => [...cats, newCat]);
  };
  const handleRemoveCategory = (id) => {
    setLocalCategories(cats => cats.map(c => c.id === id ? { ...c, _delete: true } : c));
  };
  const handleCancel = () => {
    setLocalCategories(categories.map(c => ({ ...c })));
    setError(null);
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const orgId = currentOrganization?.organization_id || currentOrganization?.id;
      if (!orgId) throw new Error('No organization selected');
      // Save new, updated, and deleted categories
      for (const cat of localCategories) {
        if (cat._delete && !cat.isNew) {
          await budgetService.deleteCategory(cat.id);
        } else if (cat.isNew && cat.name.trim()) {
          await budgetService.createCategory(orgId, cat);
        } else if (!cat.isNew) {
          const orig = categories.find(c => c.id === cat.id);
          if (orig && orig.name !== cat.name && cat.name.trim()) {
            await budgetService.updateCategory(cat.id, { name: cat.name });
          }
        }
      }
      if (typeof loadBudgetData === 'function') await loadBudgetData();
      if (typeof onSave === 'function') onSave();
      onClose();
    } catch (e) {
      setError(e.message || 'Error saving categories');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCancel} />
      {/* Modal: entire modal scrolls */}
      <div className="relative max-w-xl w-full bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h3 className="text-lg font-medium text-gray-900">Category Editor</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        {/* Content */}
        <div className="px-6 py-8 flex flex-col justify-center">
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          {/* Revenue */}
          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="mb-2 flex items-center">
              <span className="font-semibold text-green-700">Revenue Categories</span>
            </div>
            <div className="border-b border-gray-300 mb-3" />
            <ul className="mb-4">
              {localCategories.filter(c => c.type === 'revenue' && !c._delete).map(cat => (
                <li key={cat.id} className="flex items-center gap-2 mb-2 rounded-sm p-2">
                  <input
                    className="bg-white focus:bg-white px-1 py-0.5 rounded-sm w-full font-sans border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    style={{ boxShadow: 'none' }}
                    value={cat.name}
                    onChange={e => handleCategoryNameChange(cat.id, e.target.value)}
                    placeholder="Category name"
                  />
                  <button type="button" onClick={() => handleRemoveCategory(cat.id)} className="px-2 py-0.5 border border-gray-400 text-gray-700 text-xs font-medium rounded-sm bg-white hover:bg-gray-100 transition-colors">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          {/* Costs */}
          <div className="mb-6 bg-gray-50 border border-gray-200 rounded-md p-4">
            <div className="mb-2 flex items-center">
              <span className="font-semibold text-red-700">Cost Categories</span>
            </div>
            <div className="border-b border-gray-300 mb-3" />
            <ul>
              {localCategories.filter(c => c.type === 'expense' && !c._delete).map(cat => (
                <li key={cat.id} className="flex items-center gap-2 mb-2 rounded-sm p-2">
                  <input
                    className="bg-white focus:bg-white px-1 py-0.5 rounded-sm w-full font-sans border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    style={{ boxShadow: 'none' }}
                    value={cat.name}
                    onChange={e => handleCategoryNameChange(cat.id, e.target.value)}
                    placeholder="Category name"
                  />
                  <button type="button" onClick={() => handleRemoveCategory(cat.id)} className="px-2 py-0.5 border border-gray-400 text-gray-700 text-xs font-medium rounded-sm bg-white hover:bg-gray-100 transition-colors">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBudgetEditorModal; 