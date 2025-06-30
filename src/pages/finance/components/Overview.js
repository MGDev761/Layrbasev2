import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { invoiceService } from '../../../services/invoiceService';
import { budgetService } from '../../../services/budgetService';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Combined Bar + Line Chart Component
const CashFlowChart = ({ data, currentBalance = 500000, width = 900, height = 320 }) => {
  if (!data || data.length === 0) return <div className="text-gray-400 text-center py-8">No data available</div>;

  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Bar scaling
  const maxBar = Math.max(...data.map(d => Math.max(d.inflow, d.outflow)), 1);

  // Bar width and spacing
  const barGroupWidth = chartWidth / data.length;
  const barWidth = barGroupWidth * 0.28;
  const barGap = barGroupWidth * 0.08;

  // Remaining cash line (cumulative balance)
  let runningBalance = currentBalance;
  const cashPoints = data.map((point, idx) => {
    runningBalance += point.inflow - point.outflow;
    return { x: padding.left + barGroupWidth * idx + barGroupWidth / 2,
             y: padding.top + chartHeight - (runningBalance / currentBalance) * chartHeight,
             balance: runningBalance };
  });
  const cashPath = cashPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // For right Y axis (remaining cash)
  const maxCash = Math.max(currentBalance, ...cashPoints.map(p => p.balance));
  const minCash = Math.min(currentBalance, ...cashPoints.map(p => p.balance));
  const cashRange = maxCash - minCash || 1;

  // Recalculate y for cashPoints with correct scaling
  runningBalance = currentBalance;
  for (let i = 0; i < cashPoints.length; i++) {
    runningBalance += data[i].inflow - data[i].outflow;
    cashPoints[i].y = padding.top + chartHeight - ((cashPoints[i].balance - minCash) / cashRange) * chartHeight;
  }
  const cashPathFinal = cashPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
      {/* Legend at the top, centered */}
      <g transform={`translate(${width / 2 - 110}, 12)`}>
        <rect x="0" y="0" width="16" height="16" fill="#93c5fd" rx="2" />
        <text x="22" y="13" className="text-sm fill-gray-700">Inflow</text>
        <rect x="90" y="0" width="16" height="16" fill="#1e3a8a" rx="2" />
        <text x="112" y="13" className="text-sm fill-gray-700">Outflow</text>
        <line x1="200" y1="8" x2="216" y2="8" stroke="#8b5cf6" strokeWidth="2.5" />
        <text x="222" y="13" className="text-sm fill-gray-700">Remaining cash</text>
      </g>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
        <line
          key={i}
          x1={padding.left}
          y1={padding.top + r * chartHeight}
          x2={width - padding.right}
          y2={padding.top + r * chartHeight}
          stroke="#e5e7eb"
        />
      ))}
      {/* Bars: Inflow (left bar) */}
      {data.map((month, idx) => {
        const x = padding.left + barGroupWidth * idx + barGap;
        const y = padding.top + chartHeight - (month.inflow / maxBar) * chartHeight;
        const h = (month.inflow / maxBar) * chartHeight;
        return (
          <rect
            key={`in-${idx}`}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            fill="#93c5fd"
            rx={2}
          />
        );
      })}
      {/* Bars: Outflow (right bar) */}
      {data.map((month, idx) => {
        const x = padding.left + barGroupWidth * idx + barGap + barWidth + barGap;
        const y = padding.top + chartHeight - (month.outflow / maxBar) * chartHeight;
        const h = (month.outflow / maxBar) * chartHeight;
        return (
          <rect
            key={`out-${idx}`}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            fill="#1e3a8a"
            rx={2}
          />
        );
      })}
      {/* Remaining cash line */}
      <path
        d={cashPathFinal}
        stroke="#8b5cf6"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Remaining cash points */}
      {cashPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3"
          fill="#8b5cf6"
          stroke="#fff"
          strokeWidth="1"
        />
      ))}
      {/* Y axis labels (left, for bars) */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const v = maxBar - r * maxBar;
        return (
          <text
            key={i}
            x={padding.left - 10}
            y={padding.top + r * chartHeight + 5}
            textAnchor="end"
            className="text-xs fill-gray-500"
          >
            {v === 0 ? '0' : `${Math.abs(v) >= 1000 ? (v/1000).toFixed(0) + 'k' : v.toFixed(0)}`}
          </text>
        );
      })}
      {/* Y axis labels (right, for remaining cash) */}
      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
        const v = maxCash - r * cashRange;
        return (
          <text
            key={i}
            x={width - padding.right + 40}
            y={padding.top + r * chartHeight + 5}
            textAnchor="start"
            className="text-xs fill-gray-500"
          >
            {v === 0 ? '0' : `${Math.abs(v) >= 1000 ? (v/1000).toFixed(0) + 'k' : v.toFixed(0)}`}
          </text>
        );
      })}
      {/* X axis labels */}
      {data.map((month, idx) => (
        <text
          key={idx}
          x={padding.left + barGroupWidth * idx + barGroupWidth / 2}
          y={height - 18}
          textAnchor="middle"
          className="text-xs fill-gray-500"
        >
          {month.label}
        </text>
      ))}
    </svg>
  );
};

const Overview = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { currentOrganization } = useAuth();
  const [outstandingInvoices, setOutstandingInvoices] = useState([]);
  const [receivedInvoices, setReceivedInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoiceType, setInvoiceType] = useState('sent'); // 'sent' or 'received'
  const [budgetData, setBudgetData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loadingBudget, setLoadingBudget] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Fetch budget and forecast data
  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!currentOrganization?.organization_id) return;
      
      setLoadingBudget(true);
      try {
        const [budget, forecast] = await Promise.all([
          budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, false),
          budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, true)
        ]);
        
        setBudgetData(budget || []);
        setForecastData(forecast || []);
      } catch (error) {
        console.error('Error fetching budget data:', error);
        setBudgetData([]);
        setForecastData([]);
      } finally {
        setLoadingBudget(false);
      }
    };

    fetchBudgetData();
  }, [currentOrganization?.organization_id, selectedYear]);

  // Group data by category
  const groupDataByCategory = (data) => {
    return data.reduce((acc, row) => {
      const categoryName = row.category_name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = { type: row.type, subcategories: {} };
      }
      if (!acc[categoryName].subcategories[row.line_item_name]) {
        acc[categoryName].subcategories[row.line_item_name] = [];
      }
      acc[categoryName].subcategories[row.line_item_name].push(row);
      return acc;
    }, {});
  };

  const budgetGrouped = groupDataByCategory(budgetData);
  const forecastGrouped = groupDataByCategory(forecastData);

  // Calculate totals for selected month
  const calculateMonthTotals = (data, monthIndex) => {
    const revenue = data.filter(row => row.type === 'revenue').reduce((sum, row) => sum + (row[`month_${monthIndex + 1}`] || 0), 0);
    const expenses = data.filter(row => row.type === 'expense').reduce((sum, row) => sum + Math.abs(row[`month_${monthIndex + 1}`] || 0), 0);
    return { revenue, expenses, profit: revenue - expenses };
  };

  const budgetTotals = calculateMonthTotals(budgetData, selectedMonth);
  const forecastTotals = calculateMonthTotals(forecastData, selectedMonth);
  const previousMonthForecastTotals = calculateMonthTotals(forecastData, Math.max(0, selectedMonth - 1));

  // Calculate burn rate (monthly cash burn)
  const monthlyBurnRate = Math.abs(budgetTotals.expenses);
  const runwayMonths = 500000 / monthlyBurnRate; // Assuming $500k cash balance

  // Calculate cash flow
  const cashInflow = budgetTotals.revenue;
  const cashOutflow = Math.abs(budgetTotals.expenses);
  const netCashFlow = cashInflow - cashOutflow;

  // Calculate cash flow data for chart
  const generateCashFlowData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      const monthData = calculateMonthTotals(budgetData, i);
      data.push({
        label: months[i],
        inflow: monthData.revenue,
        outflow: monthData.expenses,
        net: monthData.revenue - monthData.expenses
      });
    }
    return data;
  };

  const cashFlowData = generateCashFlowData();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!currentOrganization?.organization_id) return;
      setLoadingInvoices(true);
      try {
        if (invoiceType === 'sent') {
          const invoices = await invoiceService.getSentInvoices(currentOrganization.organization_id, { status: 'all' });
          const filtered = invoices.filter(inv => ['sent', 'overdue'].includes(inv.status));
          setOutstandingInvoices(filtered);
        } else {
          const invoices = await invoiceService.getReceivedInvoices(currentOrganization.organization_id, { status: 'all' });
          const filtered = invoices.filter(inv => ['pending', 'scheduled', 'overdue'].includes(inv.status));
          setReceivedInvoices(filtered);
        }
      } catch (e) {
        setOutstandingInvoices([]);
        setReceivedInvoices([]);
      } finally {
        setLoadingInvoices(false);
      }
    };
    fetchInvoices();
  }, [currentOrganization, invoiceType]);

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
        {loadingBudget ? (
          <div className="text-center py-8 text-gray-400">Loading budget data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-500 w-40">Line</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">Budget</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">Forecast</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">Variance</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 border-l-4 border-gray-300">Last Month</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-500 border-l">MoM Change</th>
                </tr>
              </thead>
              <tbody>
                {/* Revenue */}
                <tr className="bg-green-100">
                  <td className="px-3 py-2 font-bold text-green-800">Revenue</td>
                  <td className="px-2 py-1 text-center text-green-800 font-semibold border-l">{budgetTotals.revenue.toLocaleString()}</td>
                  <td className="px-2 py-1 text-center text-green-800 font-semibold border-l">{forecastTotals.revenue.toLocaleString()}</td>
                  <td className={`px-2 py-1 text-center font-semibold border-l ${forecastTotals.revenue >= budgetTotals.revenue ? 'text-green-600' : 'text-red-600'}`}>
                    {budgetTotals.revenue > 0 ? ((forecastTotals.revenue - budgetTotals.revenue) / budgetTotals.revenue * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-2 py-1 text-center text-green-800 font-semibold border-l-4 border-gray-300">{previousMonthForecastTotals.revenue.toLocaleString()}</td>
                  <td className={`px-2 py-1 text-center font-semibold border-l ${forecastTotals.revenue >= previousMonthForecastTotals.revenue ? 'text-green-600' : 'text-red-600'}`}>
                    {previousMonthForecastTotals.revenue > 0 ? ((forecastTotals.revenue - previousMonthForecastTotals.revenue) / previousMonthForecastTotals.revenue * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                {Object.entries(budgetGrouped).filter(([category, data]) => data.type === 'revenue').map(([category, data]) => {
                  const budgetAmount = Object.values(data.subcategories).flat().reduce((sum, row) => sum + (row[`month_${selectedMonth + 1}`] || 0), 0);
                  const forecastAmount = Object.values(forecastGrouped[category]?.subcategories || {}).flat().reduce((sum, row) => sum + (row[`month_${selectedMonth + 1}`] || 0), 0);
                  const previousForecastAmount = Object.values(forecastGrouped[category]?.subcategories || {}).flat().reduce((sum, row) => sum + (row[`month_${selectedMonth}`] || 0), 0);
                  return (
                    <tr key={category} className="bg-green-50">
                      <td className="px-3 py-2 font-medium text-green-900 pl-8">{category}</td>
                      <td className="px-2 py-1 text-center text-green-900 border-l">{budgetAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center text-green-900 border-l">{forecastAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center text-gray-600 border-l">
                        {budgetAmount > 0 ? ((forecastAmount - budgetAmount) / budgetAmount * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-2 py-1 text-center text-green-900 border-l-4 border-gray-300">{previousForecastAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center text-gray-600 border-l">
                        {previousForecastAmount > 0 ? ((forecastAmount - previousForecastAmount) / previousForecastAmount * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  );
                })}
                {/* Expenses */}
                <tr className="bg-red-100">
                  <td className="px-3 py-2 font-bold text-red-800">Expenses</td>
                  <td className="px-2 py-1 text-center text-red-800 font-semibold border-l">{Math.abs(budgetTotals.expenses).toLocaleString()}</td>
                  <td className="px-2 py-1 text-center text-red-800 font-semibold border-l">{Math.abs(forecastTotals.expenses).toLocaleString()}</td>
                  <td className={`px-2 py-1 text-center font-semibold border-l ${Math.abs(forecastTotals.expenses) <= Math.abs(budgetTotals.expenses) ? 'text-green-600' : 'text-red-600'}`}>
                    {budgetTotals.expenses > 0 ? ((Math.abs(forecastTotals.expenses) - Math.abs(budgetTotals.expenses)) / Math.abs(budgetTotals.expenses) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-2 py-1 text-center text-red-800 font-semibold border-l-4 border-gray-300">{Math.abs(previousMonthForecastTotals.expenses).toLocaleString()}</td>
                  <td className={`px-2 py-1 text-center font-semibold border-l ${Math.abs(forecastTotals.expenses) <= Math.abs(previousMonthForecastTotals.expenses) ? 'text-green-600' : 'text-red-600'}`}>
                    {previousMonthForecastTotals.expenses > 0 ? ((Math.abs(forecastTotals.expenses) - Math.abs(previousMonthForecastTotals.expenses)) / Math.abs(previousMonthForecastTotals.expenses) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                {Object.entries(budgetGrouped).filter(([category, data]) => data.type === 'expense').map(([category, data]) => {
                  const budgetAmount = Math.abs(Object.values(data.subcategories).flat().reduce((sum, row) => sum + (row[`month_${selectedMonth + 1}`] || 0), 0));
                  const forecastAmount = Math.abs(Object.values(forecastGrouped[category]?.subcategories || {}).flat().reduce((sum, row) => sum + (row[`month_${selectedMonth + 1}`] || 0), 0));
                  const previousForecastAmount = Math.abs(Object.values(forecastGrouped[category]?.subcategories || {}).flat().reduce((sum, row) => sum + (row[`month_${selectedMonth}`] || 0), 0));
                  return (
                    <tr key={category} className="bg-red-50">
                      <td className="px-3 py-2 font-medium text-red-900 pl-8">{category}</td>
                      <td className="px-2 py-1 text-center text-red-900 border-l">{budgetAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center text-red-900 border-l">{forecastAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center text-gray-600 border-l">
                        {budgetAmount > 0 ? ((forecastAmount - budgetAmount) / budgetAmount * 100).toFixed(1) : 0}%
                      </td>
                      <td className="px-2 py-1 text-center text-red-900 border-l-4 border-gray-300">{previousForecastAmount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center text-gray-600 border-l">
                        {previousForecastAmount > 0 ? ((forecastAmount - previousForecastAmount) / previousForecastAmount * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  );
                })}
                {/* Profit/Loss */}
                <tr className="bg-blue-100 font-bold">
                  <td className="px-3 py-2 text-blue-900">Profit / Loss</td>
                  <td className="px-2 py-1 text-center text-blue-900 border-l">{budgetTotals.profit.toLocaleString()}</td>
                  <td className="px-2 py-1 text-center text-blue-900 border-l">{forecastTotals.profit.toLocaleString()}</td>
                  <td className={`px-2 py-1 text-center border-l ${forecastTotals.profit >= budgetTotals.profit ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(budgetTotals.profit) > 0 ? ((forecastTotals.profit - budgetTotals.profit) / Math.abs(budgetTotals.profit) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-2 py-1 text-center text-blue-900 border-l-4 border-gray-300">{previousMonthForecastTotals.profit.toLocaleString()}</td>
                  <td className={`px-2 py-1 text-center border-l ${forecastTotals.profit >= previousMonthForecastTotals.profit ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(previousMonthForecastTotals.profit) > 0 ? ((forecastTotals.profit - previousMonthForecastTotals.profit) / Math.abs(previousMonthForecastTotals.profit) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Burn Rate and Cash Flow Analysis */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Cash Flow & Burn Rate Analysis</h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* Metrics stacked left, smaller, in a card with grey bg, no border */}
          <div className="flex flex-col justify-start gap-4 min-w-[180px] max-w-[220px] bg-gray-50 rounded-lg p-4">
            <div className="text-left">
              <div className="text-lg font-semibold text-blue-900">£{(500000).toLocaleString()}</div>
              <div className="text-xs text-gray-600">Cash Balance</div>
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold text-red-700">£{monthlyBurnRate.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Burn Rate</div>
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold text-green-700">{runwayMonths.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Runway (Months)</div>
            </div>
          </div>
          {/* Chart right, no heading */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <CashFlowChart data={cashFlowData} currentBalance={500000} />
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Outstanding Invoices</h3>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium border ${invoiceType === 'sent' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
              onClick={() => setInvoiceType('sent')}
            >
              Invoices Owed To Us
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium border ${invoiceType === 'received' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}`}
              onClick={() => setInvoiceType('received')}
            >
              Invoices We Owe
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-500">{invoiceType === 'sent' ? 'Client' : 'Supplier'}</th>
                <th className="px-3 py-2 text-right font-medium text-gray-500">Amount</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Due Date</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Status</th>
                <th className="px-3 py-2 text-center font-medium text-gray-500">Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {loadingInvoices ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : invoiceType === 'sent' ? (
                outstandingInvoices.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-400">No outstanding invoices</td></tr>
                ) : outstandingInvoices.map((invoice) => {
                  const dueDate = new Date(invoice.due_date);
                  const now = new Date();
                  const daysOverdue = invoice.status === 'overdue' ? Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))) : 0;
                  return (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="px-3 py-3 font-medium text-gray-900">{invoice.client_name}</td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-900">£{parseFloat(invoice.total_amount).toLocaleString()}</td>
                      <td className="px-3 py-3 text-center text-gray-600">{dueDate.toLocaleDateString()}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status === 'overdue' ? 'Overdue' : 'Outstanding'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-600">
                        {daysOverdue > 0 ? `${daysOverdue} days` : '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                receivedInvoices.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-400">No outstanding invoices</td></tr>
                ) : receivedInvoices.map((invoice) => {
                  const dueDate = new Date(invoice.due_date);
                  const now = new Date();
                  const daysOverdue = invoice.status === 'overdue' ? Math.max(0, Math.floor((now - dueDate) / (1000 * 60 * 60 * 24))) : 0;
                  return (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="px-3 py-3 font-medium text-gray-900">{invoice.supplier_name}</td>
                      <td className="px-3 py-3 text-right font-semibold text-gray-900">£{parseFloat(invoice.total_amount).toLocaleString()}</td>
                      <td className="px-3 py-3 text-center text-gray-600">{dueDate.toLocaleDateString()}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status === 'overdue' ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-600">
                        {daysOverdue > 0 ? `${daysOverdue} days` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="px-3 py-3 text-gray-900">Total Outstanding</td>
                <td className="px-3 py-3 text-right text-gray-900">
                  £{(invoiceType === 'sent' ? outstandingInvoices : receivedInvoices).reduce((sum, invoice) => sum + parseFloat(invoice.total_amount), 0).toLocaleString()}
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