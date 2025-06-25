import React, { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const initialRows = [
  { id: 1, type: 'revenue', label: 'Product Sales', values: [12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000], repeat: 'Repeating' },
  { id: 2, type: 'revenue', label: 'Consulting', values: [4000, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200], repeat: 'Repeating' },
  { id: 3, type: 'expense', label: 'Salaries', values: [-8000, -8200, -8300, -8400, -8500, -8600, -8700, -8800, -8900, -9000, -9100, -9200], repeat: 'Repeating' },
  { id: 4, type: 'expense', label: 'Marketing', values: [-2000, -2100, -2200, -2300, -2400, -2500, -2600, -2700, -2800, -2900, -3000, -3100], repeat: 'Repeating' },
];

const Budget = () => {
  const [rows, setRows] = useState(initialRows);
  const [expandRevenue, setExpandRevenue] = useState(true);
  const [expandCosts, setExpandCosts] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('revenue');
  const [modalCategory, setModalCategory] = useState('');
  const [modalSubcategory, setModalSubcategory] = useState('');
  const [modalRepeat, setModalRepeat] = useState('Repeating');
  const [modalAmount, setModalAmount] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isBudgetLocked, setIsBudgetLocked] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [viewMode, setViewMode] = useState('months'); // 'months' or 'quarters'
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [activeTab, setActiveTab] = useState('budget'); // 'budget' or 'forecast'

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Mock categories and subcategories
  const categories = {
    revenue: ['Product Sales', 'Consulting', 'Licensing', 'Subscriptions'],
    expense: ['Salaries', 'Marketing', 'Office', 'Technology', 'Legal']
  };

  const subcategories = {
    'Product Sales': ['Software Licenses', 'Hardware Sales', 'Support Services'],
    'Consulting': ['Strategy', 'Implementation', 'Training'],
    'Salaries': ['Engineering', 'Sales', 'Marketing', 'Admin'],
    'Marketing': ['Digital Ads', 'Content', 'Events', 'PR'],
    'Office': ['Rent', 'Utilities', 'Supplies'],
    'Technology': ['Software', 'Hardware', 'Cloud Services'],
    'Legal': ['Contracts', 'Compliance', 'IP']
  };

  // Group rows by category and subcategory
  const groupedRows = rows.reduce((acc, row) => {
    const [category, subcategory] = row.label.split(' - ');
    if (!acc[category]) {
      acc[category] = { type: row.type, subcategories: {} };
    }
    if (!acc[category].subcategories[subcategory]) {
      acc[category].subcategories[subcategory] = [];
    }
    acc[category].subcategories[subcategory].push(row);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Calculate quarterly totals
  const calculateQuarterlyTotals = (values) => {
    const quarters = [];
    for (let i = 0; i < 4; i++) {
      const start = i * 3;
      const quarterTotal = values.slice(start, start + 3).reduce((sum, val) => sum + val, 0);
      quarters.push(quarterTotal);
    }
    return quarters;
  };

  const handleValueChange = (rowIdx, monthIdx, value) => {
    const updated = rows.map((row, i) =>
      i === rowIdx
        ? { ...row, values: row.values.map((v, j) => (j === monthIdx ? Number(value) : v)) }
        : row
    );
    setRows(updated);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!modalCategory || !modalAmount) return;
    const amount = Number(modalAmount);
    let values;
    if (modalRepeat === 'Repeating') {
      values = Array(12).fill(modalType === 'expense' ? -Math.abs(amount) : Math.abs(amount));
    } else {
      values = Array(12).fill(0);
      values[0] = modalType === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    }
    setRows([
      ...rows,
      {
        id: Date.now(),
        type: modalType,
        label: `${modalCategory} - ${modalSubcategory}`,
        values,
        repeat: modalRepeat,
      },
    ]);
    setShowModal(false);
    setModalType('revenue');
    setModalCategory('');
    setModalSubcategory('');
    setModalRepeat('Repeating');
    setModalAmount('');
  };

  // Calculate totals
  const revenueRows = rows.filter(r => r.type === 'revenue');
  const expenseRows = rows.filter(r => r.type === 'expense');
  const revenueTotals = Array(12).fill(0);
  const expenseTotals = Array(12).fill(0);
  const profitLoss = Array(12).fill(0);

  revenueRows.forEach(row => {
    row.values.forEach((v, i) => {
      revenueTotals[i] += v;
    });
  });
  expenseRows.forEach(row => {
    row.values.forEach((v, i) => {
      expenseTotals[i] += v;
    });
  });
  for (let i = 0; i < 12; i++) {
    profitLoss[i] = revenueTotals[i] + expenseTotals[i];
  }

  return (
    <div>
      {/* Heading and sub-description */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Budget & Forecast</h2>
        <p className="text-gray-600 text-sm mb-6">Add and manage your revenue and cost lines. Expand/collapse groups to focus on what matters. All values are editable.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab('budget')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'budget'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'forecast'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Forecast
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'budget' ? (
        <>
          {/* Controls row: Add item, year, lock, toggle (right) */}
          <div className="mb-2 flex items-end gap-2 w-full">
            <button
              className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
              onClick={() => setShowModal(true)}
            >
              + Add Item
            </button>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-32"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 ${
                isBudgetLocked 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setIsBudgetLocked(!isBudgetLocked)}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              {isBudgetLocked ? 'Unlock Budget' : 'Lock Budget'}
            </button>
            <div className="ml-auto flex items-center bg-purple-100 rounded-md p-0.5 shadow-inner">
              <button
                onClick={() => setViewMode('months')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                  ${viewMode === 'months' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
              >
                Months
              </button>
              <button
                onClick={() => setViewMode('quarters')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-150 focus:outline-none
                  ${viewMode === 'quarters' ? 'bg-white text-purple-700 shadow z-10' : 'bg-transparent text-purple-600'}`}
              >
                Quarters
              </button>
            </div>
          </div>

          {/* Table remains in its own overflow-x-auto box below */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg">
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
                  </tr>
                </thead>
                <tbody>
                  {/* Revenue group */}
                  <tr className="bg-green-100 cursor-pointer group" onClick={() => setExpandRevenue(v => !v)}>
                    <td className="px-3 py-2 font-bold text-green-800 flex items-center gap-2">
                      <span className="inline-block w-4">{expandRevenue ? '▼' : '▶'}</span> Revenue
                    </td>
                    {viewMode === 'months' ? (
                      revenueTotals.map((t, i) => (
                        <td key={i} className="px-2 py-1 text-center text-green-800 font-semibold">{t.toLocaleString()}</td>
                      ))
                    ) : (
                      calculateQuarterlyTotals(revenueTotals).map((t, i) => (
                        <td key={i} className="px-2 py-1 text-center text-green-800 font-semibold">{t.toLocaleString()}</td>
                      ))
                    )}
                  </tr>
                  {expandRevenue && Object.entries(groupedRows).filter(([category, data]) => data.type === 'revenue').map(([category, data]) => (
                    <React.Fragment key={category}>
                      <tr className="bg-green-50 cursor-pointer" onClick={() => toggleCategory(category)}>
                        <td className="px-3 py-2 font-medium text-green-900 flex items-center gap-2 pl-8">
                          <span className="inline-block w-4">{expandedCategories.has(category) ? '▼' : '▶'}</span> {category}
                        </td>
                        {viewMode === 'months' ? (
                          Array(12).fill(0).map((_, i) => (
                            <td key={i} className="px-2 py-1 text-center text-green-900 font-medium">
                              {Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[i], 0).toLocaleString()}
                            </td>
                          ))
                        ) : (
                          calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                            Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[i], 0)
                          )).map((t, i) => (
                            <td key={i} className="px-2 py-1 text-center text-green-900 font-medium">{t.toLocaleString()}</td>
                          ))
                        )}
                      </tr>
                      {expandedCategories.has(category) && Object.entries(data.subcategories).map(([subcategory, subRows]) => (
                        subRows.map((row, rowIdx) => (
                          <tr key={row.id} className="bg-white">
                            <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-12">{subcategory}</td>
                            {viewMode === 'months' ? (
                              row.values.map((val, monthIdx) => (
                                <td key={monthIdx} className="px-2 py-1 text-center">
                                  <input
                                    type="number"
                                    value={val}
                                    onChange={e => handleValueChange(rows.indexOf(row), monthIdx, e.target.value)}
                                    className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  />
                                </td>
                              ))
                            ) : (
                              calculateQuarterlyTotals(row.values).map((val, quarterIdx) => (
                                <td key={quarterIdx} className="px-2 py-1 text-center font-medium">{val.toLocaleString()}</td>
                              ))
                            )}
                          </tr>
                        ))
                      ))}
                    </React.Fragment>
                  ))}
                  {/* Costs group */}
                  <tr className="bg-red-100 cursor-pointer group" onClick={() => setExpandCosts(v => !v)}>
                    <td className="px-3 py-2 font-bold text-red-800 flex items-center gap-2">
                      <span className="inline-block w-4">{expandCosts ? '▼' : '▶'}</span> Costs
                    </td>
                    {viewMode === 'months' ? (
                      expenseTotals.map((t, i) => (
                        <td key={i} className="px-2 py-1 text-center text-red-800 font-semibold">{t.toLocaleString()}</td>
                      ))
                    ) : (
                      calculateQuarterlyTotals(expenseTotals).map((t, i) => (
                        <td key={i} className="px-2 py-1 text-center text-red-800 font-semibold">{t.toLocaleString()}</td>
                      ))
                    )}
                  </tr>
                  {expandCosts && Object.entries(groupedRows).filter(([category, data]) => data.type === 'expense').map(([category, data]) => (
                    <React.Fragment key={category}>
                      <tr className="bg-red-50 cursor-pointer" onClick={() => toggleCategory(category)}>
                        <td className="px-3 py-2 font-medium text-red-900 flex items-center gap-2 pl-8">
                          <span className="inline-block w-4">{expandedCategories.has(category) ? '▼' : '▶'}</span> {category}
                        </td>
                        {viewMode === 'months' ? (
                          Array(12).fill(0).map((_, i) => (
                            <td key={i} className="px-2 py-1 text-center text-red-900 font-medium">
                              {Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[i], 0).toLocaleString()}
                            </td>
                          ))
                        ) : (
                          calculateQuarterlyTotals(Array(12).fill(0).map((_, i) => 
                            Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[i], 0)
                          )).map((t, i) => (
                            <td key={i} className="px-2 py-1 text-center text-red-900 font-medium">{t.toLocaleString()}</td>
                          ))
                        )}
                      </tr>
                      {expandedCategories.has(category) && Object.entries(data.subcategories).map(([subcategory, subRows]) => (
                        subRows.map((row, rowIdx) => (
                          <tr key={row.id} className="bg-white">
                            <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap pl-12">{subcategory}</td>
                            {viewMode === 'months' ? (
                              row.values.map((val, monthIdx) => (
                                <td key={monthIdx} className="px-2 py-1 text-center">
                                  <input
                                    type="number"
                                    value={val}
                                    onChange={e => handleValueChange(rows.indexOf(row), monthIdx, e.target.value)}
                                    className="w-20 rounded border-gray-200 text-right px-2 py-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  />
                                </td>
                              ))
                            ) : (
                              calculateQuarterlyTotals(row.values).map((val, quarterIdx) => (
                                <td key={quarterIdx} className="px-2 py-1 text-center font-medium">{val.toLocaleString()}</td>
                              ))
                            )}
                          </tr>
                        ))
                      ))}
                    </React.Fragment>
                  ))}
                  {/* Profit/Loss row */}
                  <tr className="bg-blue-100 font-bold">
                    <td className="px-3 py-2 text-blue-900">Profit / Loss</td>
                    {viewMode === 'months' ? (
                      profitLoss.map((t, i) => (
                        <td key={i} className="px-2 py-1 text-center text-blue-900">{t.toLocaleString()}</td>
                      ))
                    ) : (
                      calculateQuarterlyTotals(profitLoss).map((t, i) => (
                        <td key={i} className="px-2 py-1 text-center text-blue-900">{t.toLocaleString()}</td>
                      ))
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-12 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Forecast Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-500">Forecast functionality will be available in the next update.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget; 