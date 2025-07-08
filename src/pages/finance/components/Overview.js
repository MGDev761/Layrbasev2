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
  const [expandedSections, setExpandedSections] = useState(new Set()); // Collapsed by default

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Fetch budget and forecast data
  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!currentOrganization?.organization_id) return;
      
      setLoadingBudget(true);
      try {
        const [budget, forecast] = await Promise.all([
          budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, 'budget'),
          budgetService.getBudgetData(currentOrganization.organization_id, selectedYear, 'forecast')
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

  // Group budget data by category (like BudgetBuilder)
  const groupedBudgetData = budgetData.reduce((acc, item) => {
    const categoryName = (item.category_name || 'Uncategorized').trim().toLowerCase();
    if (!acc[categoryName]) {
      acc[categoryName] = {
        type: item.type,
        items: []
      };
    }
    acc[categoryName].items.push(item);
    return acc;
  }, {});

  // Group forecast data by category  
  const groupedForecastData = forecastData.reduce((acc, item) => {
    const categoryName = (item.category_name || 'Uncategorized').trim().toLowerCase();
    if (!acc[categoryName]) {
      acc[categoryName] = {
        type: item.type,
        items: []
      };
    }
    acc[categoryName].items.push(item);
    return acc;
  }, {});

  // Calculate totals for selected month
  const calculateBudgetTotals = (data, monthIndex) => {
    const revenue = data.filter(row => row.type === 'revenue').reduce((sum, row) => sum + (row[`budget_month_${monthIndex + 1}`] || 0), 0);
    const expenses = data.filter(row => row.type === 'expense').reduce((sum, row) => sum + Math.abs(row[`budget_month_${monthIndex + 1}`] || 0), 0);
    return { revenue, expenses, profit: revenue - expenses };
  };

  const calculateForecastTotals = (data, monthIndex) => {
    const revenue = data.filter(row => row.type === 'revenue').reduce((sum, row) => sum + (row[`forecast_month_${monthIndex + 1}`] || 0), 0);
    const expenses = data.filter(row => row.type === 'expense').reduce((sum, row) => sum + Math.abs(row[`forecast_month_${monthIndex + 1}`] || 0), 0);
    return { revenue, expenses, profit: revenue - expenses };
  };

  const budgetTotals = calculateBudgetTotals(budgetData, selectedMonth);
  const forecastTotals = calculateForecastTotals(forecastData, selectedMonth);
  const previousMonthForecastTotals = calculateForecastTotals(forecastData, Math.max(0, selectedMonth - 1));

  // Calculate burn rate (monthly cash burn)
  const monthlyBurnRate = Math.abs(budgetTotals.expenses);
  const runwayMonths = monthlyBurnRate > 0 ? 500000 / monthlyBurnRate : 0; // Assuming $500k cash balance

  // Calculate cash flow
  const cashInflow = budgetTotals.revenue;
  const cashOutflow = Math.abs(budgetTotals.expenses);
  const netCashFlow = cashInflow - cashOutflow;

  // Calculate cash flow data for chart
  const generateCashFlowData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      const revenue = budgetData.filter(row => row.type === 'revenue').reduce((sum, row) => sum + (row[`budget_month_${i + 1}`] || 0), 0);
      const expenses = budgetData.filter(row => row.type === 'expense').reduce((sum, row) => sum + Math.abs(row[`budget_month_${i + 1}`] || 0), 0);
      data.push({
        label: months[i],
        inflow: revenue,
        outflow: expenses,
        net: revenue - expenses
      });
    }
    return data;
  };

  const cashFlowData = generateCashFlowData();

  // Toggle section expansion
  const toggleSection = (sectionName) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

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



      {/* Budget vs Forecast Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Budget vs Forecast - 
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-purple-50 text-lg font-bold text-gray-900 cursor-pointer focus:outline-none focus:ring-0 pr-8 pl-3 py-1 rounded-md appearance-none"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-purple-50 text-lg font-bold text-gray-900 cursor-pointer focus:outline-none focus:ring-0 pr-8 pl-3 py-1 rounded-md appearance-none"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </h3>
        </div>
        {loadingBudget ? (
          <div className="text-center py-8 text-gray-400">Loading budget data...</div>
        ) : (
          <div className="overview-table-container" style={{ borderTop: '1px solid #e5e7eb' }}>
            <style>{`
              .overview-table-container {
                --ag-background-color: #ffffff !important;
                --ag-odd-row-background-color: #ffffff !important;
                --ag-header-background-color: #f9fafb !important;
                --ag-row-hover-color: #f9fafb !important;
                --ag-border-color: #f3f4f6 !important;
                --ag-secondary-border-color: #f9fafb !important;
                --ag-header-cell-hover-background-color: #f3f4f6 !important;
                --ag-selected-row-background-color: transparent !important;
                --ag-range-selection-background-color: transparent !important;
                --ag-cell-horizontal-border: 1px solid #f3f4f6 !important;
                --ag-row-border-color: #f3f4f6 !important;
                --ag-header-height: 48px !important;
                --ag-row-height: 48px !important;
                --ag-cell-horizontal-padding: 0px !important;
                --ag-cell-vertical-padding: 0px !important;
                --ag-header-cell-font-size: 12px !important;
                --ag-font-size: 13px !important;
                --ag-font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
              }

              .overview-table {
                width: 100%;
                border-collapse: collapse;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
              }

              .overview-table thead tr {
                background-color: #f9fafb;
                height: 48px;
              }

              .overview-table th {
                padding: 16px 12px;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                border-right: 1px solid #e5e7eb;
                text-align: left;
              }

              .overview-table th.text-right {
                text-align: right;
              }

              .overview-table tbody tr {
                height: 48px;
                border-bottom: 1px solid #f3f4f6;
              }

              .overview-table tbody tr:hover {
                background-color: #f9fafb;
              }

              .overview-table td {
                padding: 10px 12px;
                font-size: 13px;
                color: #374151;
                border-right: 1px solid #f3f4f6;
                text-align: left;
              }

              .overview-table td.text-right {
                text-align: right;
              }

                             /* Revenue section styling */
               .overview-table .revenue-header {
                 background-color: #f0fdf4;
                 color: #15803d;
                 font-weight: 600;
                 cursor: pointer;
               }

               .overview-table .revenue-header:hover {
                 background-color: #dcfce7;
               }

              .overview-table .revenue-category {
                background-color: #f9fefb;
                color: #15803d;
                font-weight: 500;
              }

              .overview-table .revenue-category td:first-child {
                padding-left: 48px;
                border-left: 3px solid #e5e7eb;
              }

                             /* Expense section styling */
               .overview-table .expense-header {
                 background-color: #fef2f2;
                 color: #7f1d1d;
                 font-weight: 600;
                 cursor: pointer;
               }

               .overview-table .expense-header:hover {
                 background-color: #fee2e2;
               }

              .overview-table .expense-category {
                background-color: #fffbfb;
                color: #7f1d1d;
                font-weight: 500;
              }

              .overview-table .expense-category td:first-child {
                padding-left: 48px;
                border-left: 3px solid #e5e7eb;
              }

              /* Summary section styling */
              .overview-table .summary-header {
                background-color: #f9fafb;
                font-weight: 600;
                color: #374151;
                font-size: 14px;
              }

              .overview-table .summary-header td {
                padding: 16px 12px;
                border-right: 1px solid #e5e7eb;
              }
            `}</style>
            <table className="overview-table">
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>Line</th>
                  <th className="text-right">Budget</th>
                  <th className="text-right">Forecast</th>
                  <th className="text-right">Variance</th>
                  <th className="text-right" style={{ borderLeft: '4px solid #d1d5db' }}>Last Month</th>
                  <th className="text-right">MoM Change</th>
                </tr>
              </thead>
              <tbody>
                {/* Revenue */}
                <tr className="revenue-header" onClick={() => toggleSection('revenue')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ cursor: 'pointer', userSelect: 'none', color: '#6b7280', fontSize: '12px' }}>
                      {expandedSections.has('revenue') ? '▼' : '▶'}
                    </span>
                    REVENUE
                  </td>
                  <td className="text-right">{Math.round(budgetTotals.revenue).toLocaleString()}</td>
                  <td className="text-right">{Math.round(forecastTotals.revenue).toLocaleString()}</td>
                  <td className={`text-right ${forecastTotals.revenue >= budgetTotals.revenue ? 'text-green-600' : 'text-red-600'}`} style={{ fontWeight: '500' }}>
                    {budgetTotals.revenue > 0 ? ((forecastTotals.revenue - budgetTotals.revenue) / budgetTotals.revenue * 100).toFixed(0) : 0}%
                  </td>
                  <td className="text-right" style={{ borderLeft: '4px solid #d1d5db' }}>{Math.round(previousMonthForecastTotals.revenue).toLocaleString()}</td>
                  <td className={`text-right ${forecastTotals.revenue >= previousMonthForecastTotals.revenue ? 'text-green-600' : 'text-red-600'}`} style={{ fontWeight: '500' }}>
                    {previousMonthForecastTotals.revenue > 0 ? ((forecastTotals.revenue - previousMonthForecastTotals.revenue) / previousMonthForecastTotals.revenue * 100).toFixed(0) : 0}%
                  </td>
                </tr>
                {expandedSections.has('revenue') && Object.entries(groupedBudgetData).filter(([category, data]) => data.type === 'revenue').map(([category, data]) => {
                  const budgetAmount = data.items.reduce((sum, row) => sum + (row[`budget_month_${selectedMonth + 1}`] || 0), 0);
                  const forecastAmount = (groupedForecastData[category]?.items || []).reduce((sum, row) => sum + (row[`forecast_month_${selectedMonth + 1}`] || 0), 0);
                  const previousForecastAmount = (groupedForecastData[category]?.items || []).reduce((sum, row) => sum + (row[`forecast_month_${selectedMonth}`] || 0), 0);
                  
                  // Display the category name with proper capitalization
                  const displayName = Object.keys(groupedBudgetData).find(key => key.toLowerCase() === category.toLowerCase()) || category;
                  const properDisplayName = data.items[0]?.category_name || displayName;
                  
                  return (
                    <tr key={category} className="revenue-category">
                      <td>{properDisplayName}</td>
                      <td className="text-right">{Math.round(budgetAmount).toLocaleString()}</td>
                      <td className="text-right">{Math.round(forecastAmount).toLocaleString()}</td>
                      <td className="text-right text-gray-600">
                        {budgetAmount > 0 ? ((forecastAmount - budgetAmount) / budgetAmount * 100).toFixed(0) : 0}%
                      </td>
                      <td className="text-right" style={{ borderLeft: '4px solid #d1d5db' }}>{Math.round(previousForecastAmount).toLocaleString()}</td>
                      <td className="text-right text-gray-600">
                        {previousForecastAmount > 0 ? ((forecastAmount - previousForecastAmount) / previousForecastAmount * 100).toFixed(0) : 0}%
                      </td>
                    </tr>
                  );
                })}
                {/* Expenses */}
                <tr className="expense-header" onClick={() => toggleSection('expenses')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ cursor: 'pointer', userSelect: 'none', color: '#6b7280', fontSize: '12px' }}>
                      {expandedSections.has('expenses') ? '▼' : '▶'}
                    </span>
                    EXPENSES
                  </td>
                  <td className="text-right">{Math.round(Math.abs(budgetTotals.expenses)).toLocaleString()}</td>
                  <td className="text-right">{Math.round(Math.abs(forecastTotals.expenses)).toLocaleString()}</td>
                  <td className={`text-right ${Math.abs(forecastTotals.expenses) <= Math.abs(budgetTotals.expenses) ? 'text-green-600' : 'text-red-600'}`} style={{ fontWeight: '500' }}>
                    {budgetTotals.expenses > 0 ? ((Math.abs(forecastTotals.expenses) - Math.abs(budgetTotals.expenses)) / Math.abs(budgetTotals.expenses) * 100).toFixed(0) : 0}%
                  </td>
                  <td className="text-right" style={{ borderLeft: '4px solid #d1d5db' }}>{Math.round(Math.abs(previousMonthForecastTotals.expenses)).toLocaleString()}</td>
                  <td className={`text-right ${Math.abs(forecastTotals.expenses) <= Math.abs(previousMonthForecastTotals.expenses) ? 'text-green-600' : 'text-red-600'}`} style={{ fontWeight: '500' }}>
                    {previousMonthForecastTotals.expenses > 0 ? ((Math.abs(forecastTotals.expenses) - Math.abs(previousMonthForecastTotals.expenses)) / Math.abs(previousMonthForecastTotals.expenses) * 100).toFixed(0) : 0}%
                  </td>
                </tr>
                {expandedSections.has('expenses') && Object.entries(groupedBudgetData).filter(([category, data]) => data.type === 'expense').map(([category, data]) => {
                  const budgetAmount = Math.abs(data.items.reduce((sum, row) => sum + (row[`budget_month_${selectedMonth + 1}`] || 0), 0));
                  const forecastAmount = Math.abs((groupedForecastData[category]?.items || []).reduce((sum, row) => sum + (row[`forecast_month_${selectedMonth + 1}`] || 0), 0));
                  const previousForecastAmount = Math.abs((groupedForecastData[category]?.items || []).reduce((sum, row) => sum + (row[`forecast_month_${selectedMonth}`] || 0), 0));
                  
                  // Display the category name with proper capitalization
                  const displayName = Object.keys(groupedBudgetData).find(key => key.toLowerCase() === category.toLowerCase()) || category;
                  const properDisplayName = data.items[0]?.category_name || displayName;
                  
                  return (
                    <tr key={category} className="expense-category">
                      <td>{properDisplayName}</td>
                      <td className="text-right">{Math.round(budgetAmount).toLocaleString()}</td>
                      <td className="text-right">{Math.round(forecastAmount).toLocaleString()}</td>
                      <td className="text-right text-gray-600">
                        {budgetAmount > 0 ? ((forecastAmount - budgetAmount) / budgetAmount * 100).toFixed(0) : 0}%
                      </td>
                      <td className="text-right" style={{ borderLeft: '4px solid #d1d5db' }}>{Math.round(previousForecastAmount).toLocaleString()}</td>
                      <td className="text-right text-gray-600">
                        {previousForecastAmount > 0 ? ((forecastAmount - previousForecastAmount) / previousForecastAmount * 100).toFixed(0) : 0}%
                      </td>
                    </tr>
                  );
                })}
                {/* Profit/Loss */}
                <tr className="summary-header">
                  <td>Profit / Loss</td>
                  <td className="text-right">{Math.round(budgetTotals.profit).toLocaleString()}</td>
                  <td className="text-right">{Math.round(forecastTotals.profit).toLocaleString()}</td>
                  <td className={`text-right ${forecastTotals.profit >= budgetTotals.profit ? 'text-green-600' : 'text-red-600'}`} style={{ fontWeight: '500' }}>
                    {Math.abs(budgetTotals.profit) > 0 ? ((forecastTotals.profit - budgetTotals.profit) / Math.abs(budgetTotals.profit) * 100).toFixed(0) : 0}%
                  </td>
                  <td className="text-right" style={{ borderLeft: '4px solid #d1d5db' }}>{Math.round(previousMonthForecastTotals.profit).toLocaleString()}</td>
                  <td className={`text-right ${forecastTotals.profit >= previousMonthForecastTotals.profit ? 'text-green-600' : 'text-red-600'}`} style={{ fontWeight: '500' }}>
                    {Math.abs(previousMonthForecastTotals.profit) > 0 ? ((forecastTotals.profit - previousMonthForecastTotals.profit) / Math.abs(previousMonthForecastTotals.profit) * 100).toFixed(0) : 0}%
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