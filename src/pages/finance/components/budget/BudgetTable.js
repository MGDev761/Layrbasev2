import React from 'react';

const BudgetTable = ({
  categories,
  lineItems,
  groupedBudgetData,
  groupedComparisonDataFallback,
  totals,
  comparisonTotals,
  viewMode,
  showBudgetComparison,
  expandedCategories,
  toggleCategory,
  editingCategory,
  editName,
  setEditName,
  saveCategoryName,
  handleCategoryNameClick,
  handleAddLineItemModal,
  handleDeleteLineItem,
  handleLineItemNameClick,
  editingLineItem,
  saveLineItemName,
  handleValueChange,
  calculateQuarterlyTotals,
  months,
  expandRevenue,
  setExpandRevenue,
  expandCosts,
  setExpandCosts,
  setAddModalType,
  setAddCategoryType,
  setAddModalParent,
  setShowCategoryModal
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max text-sm border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
            {viewMode === 'months' ? (
              months.map((m) => (
                <th key={m} className="px-3 py-2 text-center font-medium text-gray-500">{m}</th>
              ))
            ) : (
              ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                <th key={q} className="px-3 py-2 text-center font-medium text-gray-500">{q}</th>
              ))
            )}
            <th className="px-3 py-2 text-center font-medium text-gray-500 border-l border-gray-300">Full Year</th>
          </tr>
        </thead>
        <tbody>
          {/* Revenue group */}
          <tr className="bg-green-50 group cursor-pointer" onClick={() => setExpandRevenue(v => !v)}>
            <td className="px-3 py-2 font-bold text-green-800 flex items-center gap-2 border-r border-gray-300">
              <span className="inline-block w-4">{expandRevenue ? '▼' : '▶'}</span> Revenue
              <button
                onClick={e => { e.stopPropagation(); setAddModalType('category'); setAddCategoryType('revenue'); setAddModalParent(null); setShowCategoryModal(true); setEditName(''); }}
                className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                tabIndex={-1}
              >
                <span className="text-base font-bold leading-none text-purple-600">+</span>
              </button>
            </td>
            {viewMode === 'months' ? (
            totals.revenue.map((t, i) => (
                <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
              ))
            ) : (
            calculateQuarterlyTotals(totals.revenue).map((t, i) => (
                <td key={i} className="px-2 py-1 text-center text-green-800 font-sans font-bold">{t.toLocaleString()}</td>
              ))
            )}
            <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans font-bold">
              {totals.revenue.reduce((sum, t) => sum + t, 0).toLocaleString()}
            </td>
          </tr>
          {expandRevenue && categories.filter(cat => cat.type === 'revenue').map(cat => {
            const key = cat.name.trim().toLowerCase();
            const data = showBudgetComparison ? groupedComparisonDataFallback()[key] || { items: [] } : groupedBudgetData[key] || { items: [] };
            return (
              <React.Fragment key={cat.name}>
                <tr className="bg-green-25 hover:bg-green-100 border-b border-green-50">
                  <td className="px-3 py-2 whitespace-nowrap border-r border-gray-300 relative">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center pl-6">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}
                          className="mr-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                        >
                          {expandedCategories.has(cat.name) ? '▼' : '▶'}
                        </button>
                        {editingCategory === cat.id ? (
                          <input
                            className="border px-1 py-0.5 rounded text-sm font-sans"
                            value={editName}
                            autoFocus
                            onChange={e => setEditName(e.target.value)}
                            onBlur={() => saveCategoryName(cat)}
                            onKeyDown={e => { if (e.key === 'Enter') saveCategoryName(cat); }}
                          />
                        ) : (
                          <span onClick={() => handleCategoryNameClick(cat)} className="cursor-pointer hover:underline font-normal">{cat.name}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); const catObj = cat; handleAddLineItemModal(catObj ? { category_id: catObj.id } : null); }}
                        className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                        tabIndex={-1}
                      >
                        <span className="text-base font-bold leading-none text-purple-600">+</span>
                      </button>
                    </div>
                  </td>
                  {viewMode === 'months' ? (
                    Array(12).fill(0).map((_, i) => {
                      const total = data.items.reduce((sum, item) => sum + (item[`month_${i + 1}`] || 0), 0);
                      return (
                      <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">{total.toLocaleString()}</td>
                      );
                    })
                  ) : (
                    calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                      data.items.reduce((sum, item) => sum + (item[`month_${i + 1}`] || 0), 0)
                    )).map((t, i) => (
                      <td key={i} className="px-2 py-1 text-center text-green-900 font-sans">{t.toLocaleString()}</td>
                    ))
                  )}
                  <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                    {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                  </td>
                </tr>
                {expandedCategories.has(cat.name) && data.items.length === 0 && (
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-3 py-2 text-gray-400 pl-16 border-r border-gray-300" colSpan={viewMode === 'months' ? 14 : 6}>
                      No line items
                    </td>
                  </tr>
                )}
                {expandedCategories.has(cat.name) && data.items.map((item) => (
                  <tr key={item.line_item_id} className="bg-white border-b border-gray-200">
                    <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-16 border-r border-gray-300 flex items-center justify-between">
                      <div className="flex-1">
                        {editingLineItem === item.line_item_id ? (
                          <input
                            className="border px-1 py-0.5 rounded text-sm font-sans"
                            value={editName}
                            autoFocus
                            onChange={e => setEditName(e.target.value)}
                            onBlur={() => saveLineItemName(item)}
                            onKeyDown={e => { if (e.key === 'Enter') saveLineItemName(item); }}
                          />
                        ) : (
                          <span onClick={() => handleLineItemNameClick(item)} className="cursor-pointer hover:underline font-normal">{item.line_item_name}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLineItem(item.line_item_id); }}
                        className="ml-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-red-50"
                        tabIndex={-1}
                      >
                        <span className="text-xs font-bold leading-none text-red-500">-</span>
                      </button>
                    </td>
                    {viewMode === 'months' ? (
                      Array(12).fill(0).map((_, i) => (
                        <td key={i} className="px-2 py-1 text-center font-sans">
                          <input
                            type="number"
                            value={item[`month_${i + 1}`] || 0}
                            onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0)}
                            className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          />
                        </td>
                      ))
                    ) : (
                      calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => item[`month_${i + 1}`] || 0)).map((val, quarterIdx) => (
                        <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                          <input
                            type="number"
                            value={val || 0}
                            onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0)}
                            className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          />
                        </td>
                      ))
                    )}
                    <td className="px-3 py-2 text-center text-green-900 border-l border-gray-300 font-sans">
                      {Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
          {/* Costs group */}
          <tr className="bg-red-50 group cursor-pointer" onClick={() => setExpandCosts(v => !v)}>
            <td className="px-3 py-2 font-bold text-red-800 flex items-center gap-2 border-r border-gray-300">
              <span className="inline-block w-4">{expandCosts ? '▼' : '▶'}</span> Costs
              <button
                onClick={e => { e.stopPropagation(); setAddModalType('category'); setAddCategoryType('expense'); setAddModalParent(null); setShowCategoryModal(true); setEditName(''); }}
                className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                tabIndex={-1}
              >
                <span className="text-base font-bold leading-none text-purple-600">+</span>
              </button>
            </td>
            {viewMode === 'months' ? (
            totals.expense.map((t, i) => (
                <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
              ))
            ) : (
            calculateQuarterlyTotals(totals.expense).map((t, i) => (
                <td key={i} className="px-2 py-1 text-center text-red-800 font-sans font-bold">{t.toLocaleString()}</td>
              ))
            )}
            <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans font-bold">
              {totals.expense.reduce((sum, t) => sum + t, 0).toLocaleString()}
            </td>
          </tr>
          {expandCosts && categories.filter(cat => cat.type === 'expense').map(cat => {
            const key = cat.name.trim().toLowerCase();
            const data = showBudgetComparison ? groupedComparisonDataFallback()[key] || { items: [] } : groupedBudgetData[key] || { items: [] };
            return (
              <React.Fragment key={cat.name}>
                <tr className="bg-red-25 hover:bg-red-100 border-b border-red-50">
                  <td className="px-3 py-2 whitespace-nowrap border-r border-gray-300 relative">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center pl-6">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}
                          className="mr-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                        >
                          {expandedCategories.has(cat.name) ? '▼' : '▶'}
                        </button>
                        {editingCategory === cat.id ? (
                          <input
                            className="border px-1 py-0.5 rounded text-sm font-sans"
                            value={editName}
                            autoFocus
                            onChange={e => setEditName(e.target.value)}
                            onBlur={() => saveCategoryName(cat)}
                            onKeyDown={e => { if (e.key === 'Enter') saveCategoryName(cat); }}
                          />
                        ) : (
                          <span onClick={() => handleCategoryNameClick(cat)} className="cursor-pointer hover:underline font-normal">{cat.name}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); const catObj = cat; handleAddLineItemModal(catObj ? { category_id: catObj.id } : null); }}
                        className="ml-auto w-6 h-6 flex items-center justify-center text-purple-600 hover:text-purple-800 hover:bg-white rounded"
                        tabIndex={-1}
                      >
                        <span className="text-base font-bold leading-none text-purple-600">+</span>
                      </button>
                    </div>
                  </td>
                  {viewMode === 'months' ? (
                    Array(12).fill(0).map((_, i) => {
                      const total = data.items.reduce((sum, item) => sum + Math.abs(item[`month_${i + 1}`] || 0), 0);
                      return (
                      <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{total.toLocaleString()}</td>
                      );
                    })
                  ) : (
                    calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                      data.items.reduce((sum, item) => sum + Math.abs(item[`month_${i + 1}`] || 0), 0)
                    )).map((t, i) => (
                      <td key={i} className="px-2 py-1 text-center text-red-900 font-sans">{t.toLocaleString()}</td>
                    ))
                  )}
                  <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                    {data.items.reduce((sum, item) => sum + Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0), 0).toLocaleString()}
                  </td>
                </tr>
                {expandedCategories.has(cat.name) && data.items.length === 0 && (
                  <tr className="bg-white border-b border-gray-200">
                    <td className="px-3 py-2 text-gray-400 pl-16 border-r border-gray-300" colSpan={viewMode === 'months' ? 14 : 6}>
                      No line items
                    </td>
                  </tr>
                )}
                {expandedCategories.has(cat.name) && data.items.map((item) => (
                  <tr key={item.line_item_id} className="bg-white border-b border-gray-200">
                    <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-16 border-r border-gray-300 flex items-center justify-between">
                      <div className="flex-1">
                        {editingLineItem === item.line_item_id ? (
                          <input
                            className="border px-1 py-0.5 rounded text-sm font-sans"
                            value={editName}
                            autoFocus
                            onChange={e => setEditName(e.target.value)}
                            onBlur={() => saveLineItemName(item)}
                            onKeyDown={e => { if (e.key === 'Enter') saveLineItemName(item); }}
                          />
                        ) : (
                          <span onClick={() => handleLineItemNameClick(item)} className="cursor-pointer hover:underline font-normal">{item.line_item_name}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLineItem(item.line_item_id); }}
                        className="ml-2 w-5 h-5 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-red-50"
                        tabIndex={-1}
                      >
                        <span className="text-xs font-bold leading-none text-red-500">-</span>
                      </button>
                    </td>
                    {viewMode === 'months' ? (
                      Array(12).fill(0).map((_, i) => (
                        <td key={i} className="px-2 py-1 text-center font-sans">
                          <input
                            type="number"
                            value={item[`month_${i + 1}`] || 0}
                            onChange={e => handleValueChange(item.line_item_id, i + 1, parseFloat(e.target.value) || 0)}
                            className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          />
                        </td>
                      ))
                    ) : (
                      calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => item[`month_${i + 1}`] || 0)).map((val, quarterIdx) => (
                        <td key={quarterIdx} className="px-2 py-1 text-center font-sans">
                          <input
                            type="number"
                            value={val || 0}
                            onChange={e => handleValueChange(item.line_item_id, quarterIdx * 3 + 1, parseFloat(e.target.value) || 0)}
                            className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          />
                        </td>
                      ))
                    )}
                    <td className="px-3 py-2 text-center text-red-900 border-l border-gray-300 font-sans">
                      {Array.from({length: 12}, (_, i) => item[`month_${i+1}`] || 0).reduce((a, b) => a + b, 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
          {/* Profit/Loss row */}
          <tr className="bg-blue-100">
            <td className="px-3 py-2 text-blue-900 font-sans">Profit / Loss</td>
            {viewMode === 'months' ? (
            totals.profitLoss.map((t, i) => (
                <td key={i} className="px-2 py-1 text-center text-blue-900 font-sans">{t.toLocaleString()}</td>
              ))
            ) : (
            calculateQuarterlyTotals(totals.profitLoss).map((t, i) => (
                <td key={i} className="px-2 py-1 text-center text-blue-900 font-sans">{t.toLocaleString()}</td>
              ))
            )}
            <td className="px-3 py-2 text-center text-blue-900 border-l border-gray-300 font-sans">
              {totals.profitLoss.reduce((sum, t) => sum + t, 0).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTable; 