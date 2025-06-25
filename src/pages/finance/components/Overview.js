import React, { useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Mock data - in real app this would come from the budget component
const mockBudgetData = [
  { id: 1, type: 'revenue', category: 'Product Sales', subcategory: 'Software Licenses', values: [12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000] },
  { id: 2, type: 'revenue', category: 'Consulting', subcategory: 'Strategy', values: [4000, 4200, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200] },
  { id: 3, type: 'expense', category: 'Salaries', subcategory: 'Engineering', values: [-8000, -8200, -8300, -8400, -8500, -8600, -8700, -8800, -8900, -9000, -9100, -9200] },
  { id: 4, type: 'expense', category: 'Marketing', subcategory: 'Digital Ads', values: [-2000, -2100, -2200, -2300, -2400, -2500, -2600, -2700, -2800, -2900, -3000, -3100] },
];

const mockForecastData = [
  { id: 1, type: 'revenue', category: 'Product Sales', subcategory: 'Software Licenses', values: [12500, 13500, 14500, 15500, 16500, 17500, 18500, 19500, 20500, 21500, 22500, 23500] },
  { id: 2, type: 'revenue', category: 'Consulting', subcategory: 'Strategy', values: [4100, 4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000, 5100, 5200, 5300] },
  { id: 3, type: 'expense', category: 'Salaries', subcategory: 'Engineering', values: [-8100, -8300, -8400, -8500, -8600, -8700, -8800, -8900, -9000, -9100, -9200, -9300] },
  { id: 4, type: 'expense', category: 'Marketing', subcategory: 'Digital Ads', values: [-2100, -2200, -2300, -2400, -2500, -2600, -2700, -2800, -2900, -3000, -3100, -3200] },
];

const mockInvoices = [
  { id: 1, client: 'TechCorp Inc', amount: 15000, dueDate: '2024-01-15', status: 'Overdue', daysOverdue: 5 },
  { id: 2, client: 'StartupXYZ', amount: 8500, dueDate: '2024-01-20', status: 'Due Soon', daysOverdue: 0 },
  { id: 3, client: 'Enterprise Solutions', amount: 22000, dueDate: '2024-01-25', status: 'Pending', daysOverdue: 0 },
  { id: 4, client: 'Digital Agency', amount: 12000, dueDate: '2024-01-10', status: 'Overdue', daysOverdue: 10 },
];

const Overview = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Group data by category
  const groupDataByCategory = (data) => {
    return data.reduce((acc, row) => {
      const [category, subcategory] = row.label ? row.label.split(' - ') : [row.category, row.subcategory];
      if (!acc[category]) {
        acc[category] = { type: row.type, subcategories: {} };
      }
      if (!acc[category].subcategories[subcategory]) {
        acc[category].subcategories[subcategory] = [];
      }
      acc[category].subcategories[subcategory].push(row);
      return acc;
    }, {});
  };

  const budgetGrouped = groupDataByCategory(mockBudgetData);
  const forecastGrouped = groupDataByCategory(mockForecastData);

  // Calculate totals for selected month
  const calculateMonthTotals = (data, monthIndex) => {
    const revenue = data.filter(row => row.type === 'revenue').reduce((sum, row) => sum + row.values[monthIndex], 0);
    const expenses = data.filter(row => row.type === 'expense').reduce((sum, row) => sum + row.values[monthIndex], 0);
    return { revenue, expenses, profit: revenue + expenses };
  };

  const budgetTotals = calculateMonthTotals(mockBudgetData, selectedMonth);
  const forecastTotals = calculateMonthTotals(mockForecastData, selectedMonth);
  const previousMonthTotals = calculateMonthTotals(mockBudgetData, Math.max(0, selectedMonth - 1));

  // Calculate burn rate (monthly cash burn)
  const monthlyBurnRate = Math.abs(budgetTotals.expenses);
  const runwayMonths = 500000 / monthlyBurnRate; // Assuming $500k cash balance

  // Calculate cash flow
  const cashInflow = budgetTotals.revenue;
  const cashOutflow = Math.abs(budgetTotals.expenses);
  const netCashFlow = cashInflow - cashOutflow;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Finance Overview</h2>
        <p className="text-gray-600 text-base">Month-on-month summary of budget, forecast, invoicing, and management accounts.</p>
      </div>

      {/* Month Selector */}
      <div className="flex gap-4 items-center mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm w-32"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Budget vs Forecast Comparison */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Budget vs Forecast - {months[selectedMonth]} {selectedYear}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">Budget</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">Forecast</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">Variance</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 border-l-4 border-gray-300">Previous Year</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue */}
              <tr className="bg-green-100">
                <td className="px-3 py-2 font-bold text-green-800">Revenue</td>
                <td className="px-2 py-1 text-center text-green-800 font-semibold border-l">{budgetTotals.revenue.toLocaleString()}</td>
                <td className="px-2 py-1 text-center text-green-800 font-semibold border-l">{forecastTotals.revenue.toLocaleString()}</td>
                <td className={`px-2 py-1 text-center font-semibold border-l ${forecastTotals.revenue >= budgetTotals.revenue ? 'text-green-600' : 'text-red-600'}`}>
                  {((forecastTotals.revenue - budgetTotals.revenue) / budgetTotals.revenue * 100).toFixed(1)}%
                </td>
                <td className="px-2 py-1 text-center text-green-800 font-semibold border-l-4 border-gray-300">{(budgetTotals.revenue * 0.85).toLocaleString()}</td>
                <td className={`px-2 py-1 text-center font-semibold border-l ${budgetTotals.revenue >= budgetTotals.revenue * 0.85 ? 'text-green-600' : 'text-red-600'}`}>
                  {((budgetTotals.revenue - budgetTotals.revenue * 0.85) / (budgetTotals.revenue * 0.85) * 100).toFixed(1)}%
                </td>
              </tr>
              {Object.entries(budgetGrouped).filter(([category, data]) => data.type === 'revenue').map(([category, data]) => (
                <tr key={category} className="bg-green-50">
                  <td className="px-3 py-2 font-medium text-green-900 pl-8">{category}</td>
                  <td className="px-2 py-1 text-center text-green-900 border-l">
                    {Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[selectedMonth], 0).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center text-green-900 border-l">
                    {Object.values(forecastGrouped[category]?.subcategories || {}).flat().reduce((sum, row) => sum + row.values[selectedMonth], 0).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-600 border-l">-</td>
                  <td className="px-2 py-1 text-center text-green-900 border-l-4 border-gray-300">
                    {(Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[selectedMonth], 0) * 0.85).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-600 border-l">-</td>
                </tr>
              ))}
              {/* Expenses */}
              <tr className="bg-red-100">
                <td className="px-3 py-2 font-bold text-red-800">Expenses</td>
                <td className="px-2 py-1 text-center text-red-800 font-semibold border-l">{Math.abs(budgetTotals.expenses).toLocaleString()}</td>
                <td className="px-2 py-1 text-center text-red-800 font-semibold border-l">{Math.abs(forecastTotals.expenses).toLocaleString()}</td>
                <td className={`px-2 py-1 text-center font-semibold border-l ${Math.abs(forecastTotals.expenses) <= Math.abs(budgetTotals.expenses) ? 'text-green-600' : 'text-red-600'}`}>
                  {((Math.abs(forecastTotals.expenses) - Math.abs(budgetTotals.expenses)) / Math.abs(budgetTotals.expenses) * 100).toFixed(1)}%
                </td>
                <td className="px-2 py-1 text-center text-red-800 font-semibold border-l-4 border-gray-300">{(Math.abs(budgetTotals.expenses) * 0.9).toLocaleString()}</td>
                <td className={`px-2 py-1 text-center font-semibold border-l ${Math.abs(budgetTotals.expenses) <= Math.abs(budgetTotals.expenses) * 0.9 ? 'text-green-600' : 'text-red-600'}`}>
                  {((Math.abs(budgetTotals.expenses) - Math.abs(budgetTotals.expenses) * 0.9) / (Math.abs(budgetTotals.expenses) * 0.9) * 100).toFixed(1)}%
                </td>
              </tr>
              {Object.entries(budgetGrouped).filter(([category, data]) => data.type === 'expense').map(([category, data]) => (
                <tr key={category} className="bg-red-50">
                  <td className="px-3 py-2 font-medium text-red-900 pl-8">{category}</td>
                  <td className="px-2 py-1 text-center text-red-900 border-l">
                    {Math.abs(Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[selectedMonth], 0)).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center text-red-900 border-l">
                    {Math.abs(Object.values(forecastGrouped[category]?.subcategories || {}).flat().reduce((sum, row) => sum + row.values[selectedMonth], 0)).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-600 border-l">-</td>
                  <td className="px-2 py-1 text-center text-red-900 border-l-4 border-gray-300">
                    {(Math.abs(Object.values(data.subcategories).flat().reduce((sum, row) => sum + row.values[selectedMonth], 0)) * 0.9).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center text-gray-600 border-l">-</td>
                </tr>
              ))}
              {/* Profit/Loss */}
              <tr className="bg-blue-100 font-bold">
                <td className="px-3 py-2 text-blue-900">Profit / Loss</td>
                <td className="px-2 py-1 text-center text-blue-900 border-l">{budgetTotals.profit.toLocaleString()}</td>
                <td className="px-2 py-1 text-center text-blue-900 border-l">{forecastTotals.profit.toLocaleString()}</td>
                <td className={`px-2 py-1 text-center border-l ${forecastTotals.profit >= budgetTotals.profit ? 'text-green-600' : 'text-red-600'}`}>
                  {((forecastTotals.profit - budgetTotals.profit) / Math.abs(budgetTotals.profit) * 100).toFixed(1)}%
                </td>
                <td className="px-2 py-1 text-center text-blue-900 border-l-4 border-gray-300">{(budgetTotals.profit * 0.8).toLocaleString()}</td>
                <td className={`px-2 py-1 text-center border-l ${budgetTotals.profit >= budgetTotals.profit * 0.8 ? 'text-green-600' : 'text-red-600'}`}>
                  {((budgetTotals.profit - budgetTotals.profit * 0.8) / Math.abs(budgetTotals.profit * 0.8) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Burn Rate and Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burn Rate */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Burn Rate Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Burn Rate</span>
              <span className="text-2xl font-bold text-red-600">${monthlyBurnRate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Runway (Months)</span>
              <span className="text-2xl font-bold text-blue-600">{runwayMonths.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash Balance</span>
              <span className="text-2xl font-bold text-green-600">$500,000</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                At current burn rate, you have approximately <strong>{runwayMonths.toFixed(1)} months</strong> of runway remaining.
              </p>
            </div>
          </div>
        </div>

        {/* Cash Flow */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash Inflow</span>
              <span className="text-2xl font-bold text-green-600">${cashInflow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash Outflow</span>
              <span className="text-2xl font-bold text-red-600">${cashOutflow.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600 font-semibold">Net Cash Flow</span>
              <span className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netCashFlow.toLocaleString()}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                {netCashFlow >= 0 ? 'Positive cash flow this month.' : 'Negative cash flow this month.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Outstanding Invoices</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500">Client</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500">Amount</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Due Date</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Status</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100">
                  <td className="px-3 py-3 font-medium text-gray-900">{invoice.client}</td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-900">${invoice.amount.toLocaleString()}</td>
                  <td className="px-3 py-3 text-center text-gray-600">{invoice.dueDate}</td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      invoice.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-gray-600">
                    {invoice.daysOverdue > 0 ? `${invoice.daysOverdue} days` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-3 text-gray-900">Total Outstanding</td>
                <td className="px-3 py-3 text-right text-gray-900">
                  ${mockInvoices.reduce((sum, invoice) => sum + invoice.amount, 0).toLocaleString()}
                </td>
                <td className="px-3 py-3"></td>
                <td className="px-3 py-3"></td>
                <td className="px-3 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview; 