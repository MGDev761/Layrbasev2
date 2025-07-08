import React, { useState, useEffect } from 'react';

const AddBudgetItemModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  categories = [], // Add default empty array
  onCreateCategory,
  type = 'lineItem', // 'lineItem' or 'category'
  selectedCategory, // Changed from parent to selectedCategory
  typeOverride
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'revenue',
    amount: '',
    isRecurring: true,
    categoryId: '',
    month: '1'
  });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCategory && type === 'lineItem') {
      // Find the full category object if we only have an ID
      let fullCategory = selectedCategory;
      if (selectedCategory.id && !selectedCategory.type) {
        fullCategory = categories.find(cat => cat.id === selectedCategory.id);
      }
      
      if (fullCategory) {
        setFormData(f => ({ 
          ...f, 
          categoryId: fullCategory.id,
          type: fullCategory.type 
        }));
      }
    } else {
      setFormData(f => ({ ...f, categoryId: '' }));
    }
    
    // Reset form data when modal opens
    if (isOpen) {
      setFormData(f => ({ ...f, name: '', description: '', amount: '', month: '1' }));
      
      // Set type from typeOverride if provided
      if (typeOverride) {
        setFormData(f => ({ ...f, type: typeOverride }));
      }
    }
  }, [isOpen, selectedCategory, type, typeOverride, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'category') {
        await onCreateCategory({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          color: '#6B7280' // Default color
        });
      } else {
        let amount = parseFloat(formData.amount) || 0;
        // Always save as positive for both revenue and expense
        amount = Math.abs(amount);
        await onAdd({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          amount,
          isRecurring: formData.isRecurring,
          categoryId: formData.categoryId,
          month: formData.isRecurring ? null : parseInt(formData.month)
        });
      }
      
      handleClose();
    } catch (error) {
      console.error('Error adding item:', error);
      alert(error.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: 'revenue',
      amount: '',
      isRecurring: true,
      categoryId: '',
      month: '1'
    });
    setShowCategoryForm(false);
    onClose();
  };

  // Safe filtering with default empty array
  const filteredCategories = (categories || []).filter(cat => cat.type === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {type === 'category' ? 'Add Category' : 'Add Budget Item'}
                </h2>
                <p className="text-purple-100 text-sm">
                  {type === 'category' ? 'Create a new budget category' : 'Add a new line item to your budget'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === 'category' ? 'Category Name' : 'Item Name'}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder={type === 'category' ? 'e.g., Product Sales' : 'e.g., Software Licenses'}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              rows="2"
              placeholder="Optional description"
            />
          </div>

          {/* Category Selection (only for line items) */}
          {type === 'lineItem' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(true)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Amount (only for line items) */}
          {type === 'lineItem' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          )}

                    {/* Recurring (only for line items) */}
          {type === 'lineItem' && (
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
                  Recurring monthly
                </label>
              </div>
              
              {/* Month Selection (only when not recurring) */}
              {!formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apply to Month
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              )}
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
        </div>

        {/* Quick Category Creation Modal */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white">Quick Add Category</h3>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const newCategory = await onCreateCategory({
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                    color: '#6B7280' // Default color
                  });
                  setFormData({ ...formData, categoryId: newCategory.id });
                  setShowCategoryForm(false);
                } catch (error) {
                  console.error('Error creating category:', error);
                }
              }}>
                <div className="p-6 space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Category name"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBudgetItemModal; 