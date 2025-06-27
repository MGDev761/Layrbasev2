import React, { useState, useRef } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { budgetService } from '../../../../services/budgetService';
import { PencilIcon, TrashIcon, Bars3Icon, CheckIcon, PlusIcon } from '@heroicons/react/24/outline';

const QuickBudgetEditorModal = ({ isOpen, onClose, categories, onSave, loadBudgetData }) => {
  const { currentOrganization } = useAuth();
  const [localCategories, setLocalCategories] = useState(() => categories.map(c => ({ ...c })));
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const dragItem = useRef();
  const dragOverItem = useRef();

  React.useEffect(() => {
    setLocalCategories(categories.map(c => ({ ...c })));
    setEditingId(null);
    setEditValue('');
  }, [categories, isOpen]);

  if (!isOpen) return null;

  // Drag and drop logic
  const handleDragStart = (index) => { dragItem.current = index; };
  const handleDragEnter = (index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === undefined || to === undefined || from === to) return;
    const updated = [...localCategories];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setLocalCategories(updated);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
  };

  const handleCategoryNameChange = (id, value) => {
    setLocalCategories(cats => cats.map(c => c.id === id ? { ...c, name: value } : c));
  };
  const handleAddCategory = (type) => {
    const newCat = { id: `new-cat-${Date.now()}`, name: '', type, isNew: true };
    setLocalCategories(cats => [...cats, newCat]);
    setEditingId(newCat.id);
    setEditValue('');
  };
  const handleRemoveCategory = (id) => {
    setLocalCategories(cats => cats.map(c => c.id === id ? { ...c, _delete: true } : c));
  };
  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };
  const handleEditSave = (id) => {
    handleCategoryNameChange(id, editValue);
    setEditingId(null);
    setEditValue('');
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
      // TODO: Save new order to DB if needed
      if (typeof loadBudgetData === 'function') await loadBudgetData();
      if (typeof onSave === 'function') onSave();
      onClose();
    } catch (e) {
      setError(e.message || 'Error saving categories');
    } finally {
      setSaving(false);
    }
  };

  const renderCategoryCard = (cat, idx, type) => (
    <div key={cat.id} className="flex items-center justify-between mb-2">
      <div
        className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded px-2 py-1 cursor-pointer text-sm flex-1"
        draggable
        onDragStart={() => handleDragStart(idx)}
        onDragEnter={() => handleDragEnter(idx)}
        onDragEnd={handleDragEnd}
        onDragOver={e => e.preventDefault()}
      >
        <Bars3Icon className="w-5 h-5 text-gray-400 cursor-move mr-2" />
        {editingId === cat.id ? (
          <input
            className="flex-1 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-500"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleEditSave(cat.id); }}
          />
        ) : (
          <span className="flex-1 text-gray-900 font-medium">{cat.name}</span>
        )}
        {editingId === cat.id ? (
          <button onClick={() => handleEditSave(cat.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckIcon className="w-5 h-5" /></button>
        ) : (
          <button onClick={() => handleEdit(cat.id, cat.name)} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><PencilIcon className="w-5 h-5" /></button>
        )}
      </div>
      <button onClick={() => handleRemoveCategory(cat.id)} className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded"><TrashIcon className="w-5 h-5" /></button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCancel} />
      {/* Modal: entire modal scrolls */}
      <div className="relative max-w-xl w-full bg-white rounded-md shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl sticky top-0 z-10">
          <h3 className="text-lg font-medium text-gray-900">Category Editor</h3>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        {/* Content */}
        <div className="px-6 py-0 flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          {/* Revenue */}
          <div className="mb-8 p-0">
            <div className="mb-2 flex items-center">
              <span className="font-semibold text-purple-700 text-sm mt-2">Revenue Categories</span>
            </div>
            <span className="block text-gray-500 text-xs mb-2">These are your revenue categories</span>
            <div className="flex flex-col gap-1">
              {localCategories.filter(c => c.type === 'revenue' && !c._delete).map((cat, idx) => renderCategoryCard(cat, idx, 'revenue'))}
            </div>
            <button
              type="button"
              className="mt-3 flex items-center text-purple-700 hover:text-purple-900 text-xs font-medium gap-1"
              onClick={() => handleAddCategory('revenue')}
            >
              <PlusIcon className="w-4 h-4" /> Add Revenue Category
            </button>
          </div>
          <div className="border-t border-gray-200 my-4" />
          {/* Costs */}
          <div className="mb-6 p-0">
            <div className="mb-2 flex items-center">
              <span className="font-semibold text-purple-700 text-sm">Cost Categories</span>
            </div>
            <span className="block text-gray-500 text-xs mb-2">These are your cost categories</span>
            <div className="flex flex-col gap-1">
              {localCategories.filter(c => c.type === 'expense' && !c._delete).map((cat, idx) => renderCategoryCard(cat, idx, 'expense'))}
            </div>
            <button
              type="button"
              className="mt-3 flex items-center text-purple-700 hover:text-purple-900 text-xs font-medium gap-1"
              onClick={() => handleAddCategory('expense')}
            >
              <PlusIcon className="w-4 h-4" /> Add Cost Category
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl sticky bottom-0 z-10">
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