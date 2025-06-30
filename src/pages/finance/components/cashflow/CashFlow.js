import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { 
  InformationCircleIcon, 
  BookOpenIcon, 
  Cog6ToothIcon, 
  ChatBubbleLeftRightIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Card from '../../../../components/common/layout/Card';
import * as cashFlowService from '../../../../services/cashFlowService';

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, integration: false, runway: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ view: true, forecast: false, actuals: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Cash Flow Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <BookOpenIcon className="w-5 h-5" /> Cash Flow Basics
          </button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <Cog6ToothIcon className="w-5 h-5" /> Platform How-To
          </button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}>
            <ChatBubbleLeftRightIcon className="w-5 h-5" /> AI
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Track actual cash movement based on real payments and forecasted items. This module integrates with your invoicing and forecasting to show current liquidity and projected cash runway.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('integration')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Integration</span>{openContent.integration ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.integration && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Automatically updates when invoices are issued or paid</li><li>Incorporates forecasted items from budget planning</li><li>Shows both actual payments and expected cash flows</li><li>Calculates cash runway based on current position</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('runway')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Cash Runway</span>{openContent.runway ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.runway && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Cash runway shows how long your current cash position will last based on projected income and expenses. This helps with financial planning and fundraising decisions.</p></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('view')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">View Options</span>{openPlatform.view ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.view && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Switch between monthly and quarterly views. Use the summary cards for quick insights and detailed tables for comprehensive analysis.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('forecast')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Forecast vs Actuals</span>{openPlatform.forecast ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.forecast && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Compare forecasted cash flows with actual payments. Green indicates better than expected, red shows shortfalls that need attention.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('actuals')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Actual Cash Movement</span>{openPlatform.actuals ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.actuals && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Track real payments from invoices and other transactions. The system automatically updates when invoices are marked as paid or received.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your cash flow assistant. I can help you understand your financial position, analyze cash runway, and answer questions about using this platform.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How do I improve my cash runway?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Focus on accelerating receivables, delaying payables where possible, and reducing unnecessary expenses. Monitor your cash flow regularly to identify trends.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What's the difference between forecast and actual?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Forecast shows expected cash flows based on your budget and invoice due dates. Actual shows real payments that have been received or made. The variance helps identify planning accuracy.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about cash flow..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

// Cash Flow Summary Cards
const CashFlowCard = ({ title, value, subtitle, icon, color, trend }) => (
  <Card className="bg-white">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 ${color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center text-xs">
        <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-gray-500 ml-1">vs last month</span>
      </div>
    )}
  </Card>
);

// Cash Flow Table Row
const CashFlowRow = ({ item, isActual = false }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="px-4 py-3">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-3 ${isActual ? 'bg-green-500' : 'bg-blue-500'}`}></div>
        <div>
          <p className="text-sm font-medium text-gray-900">{item.description}</p>
          <p className="text-xs text-gray-500">{item.category}</p>
    </div>
  </div>
    </td>
    <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
    <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
    <td className={`px-4 py-3 text-sm font-medium ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {item.amount >= 0 ? '+' : ''}£{Math.abs(item.amount).toLocaleString()}
    </td>
    <td className="px-4 py-3 text-sm text-gray-500">{item.status}</td>
  </tr>
);

const CashFlow = () => {
  const { currentOrganization } = useAuth();
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [actuals, setActuals] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [bankBalance, setBankBalance] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceInput, setBalanceInput] = useState('');
  const [unpaidSentInvoices, setUnpaidSentInvoices] = useState([]);
  const [unpaidReceivedInvoices, setUnpaidReceivedInvoices] = useState([]);

  useEffect(() => {
    console.log('DEBUG: currentOrganization', currentOrganization);
    if (!currentOrganization || !currentOrganization.organization_id) return;
    const orgId = currentOrganization.organization_id;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('DEBUG: Fetching categories for org', orgId);
        const cats = await cashFlowService.getCashFlowCategories(orgId);
        setCategories(cats);
        const startDate = selectedPeriod + '-01';
        const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0).toISOString().slice(0, 10);
        console.log('DEBUG: Fetching actual transactions', { org: orgId, startDate, endDate });
        const actualTx = await cashFlowService.getCashFlowTransactions(orgId, { startDate, endDate, status: 'actual' });
        setActuals(actualTx || []);
        console.log('DEBUG: Fetching forecasts', { org: orgId, startDate, endDate });
        const forecastTx = await cashFlowService.getCashFlowForecasts(orgId, { startDate, endDate });
        setForecasts(forecastTx || []);
        console.log('DEBUG: Fetching summary', { org: orgId, startDate, endDate });
        const sum = await cashFlowService.getCashFlowSummary(orgId, startDate, endDate);
        setSummary(sum);
      } catch (err) {
        console.error('DEBUG: Error loading cash flow data', err);
        setError(err.message || 'Error loading cash flow data');
      }
      setLoading(false);
    };
    fetchData();
  }, [currentOrganization, selectedPeriod]);

  useEffect(() => {
    if (!currentOrganization || !currentOrganization.organization_id) return;
    const orgId = currentOrganization.organization_id;
    cashFlowService.getCurrentBankBalance(orgId)
      .then(balance => setBankBalance(balance))
      .catch(() => setBankBalance(null));
  }, [currentOrganization]);

  useEffect(() => {
    if (!currentOrganization || !currentOrganization.organization_id) return;
    const orgId = currentOrganization.organization_id;
    cashFlowService.getUnpaidSentInvoices(orgId)
      .then(data => {
        console.log('DEBUG: unpaid sent invoices', data);
        setUnpaidSentInvoices(data);
      })
      .catch(() => setUnpaidSentInvoices([]));
    cashFlowService.getUnpaidReceivedInvoices(orgId)
      .then(data => {
        console.log('DEBUG: unpaid received invoices', data);
        setUnpaidReceivedInvoices(data);
      })
      .catch(() => setUnpaidReceivedInvoices([]));
  }, [currentOrganization]);

  const handleSaveBankBalance = async () => {
    if (!currentOrganization || !currentOrganization.organization_id) return;
    const orgId = currentOrganization.organization_id;
    try {
      const newBalance = await cashFlowService.setCurrentBankBalance(orgId, Number(balanceInput));
      setBankBalance(newBalance);
      setShowBalanceModal(false);
    } catch (err) {
      alert('Failed to update bank balance: ' + (err.message || err));
    }
  };

  const getCashRunwayColor = (runway) => {
    if (runway >= 6) return 'text-green-600';
    if (runway >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate forecast/invoice totals
  const totalForecastedIncome = forecasts.filter(f => f.type === 'income').reduce((sum, f) => sum + Number(f.amount), 0);
  const totalForecastedExpenses = forecasts.filter(f => f.type === 'expense').reduce((sum, f) => sum + Number(f.amount), 0);
  const totalUnpaidInvoices = unpaidSentInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
  const totalUnpaidBills = unpaidReceivedInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);

  // Estimate average monthly burn (use actuals if available, fallback to forecast)
  const monthlyBurn = summary && summary.actual.expenses < 0 ? Math.abs(summary.actual.expenses) : (totalForecastedExpenses / 3 || 1);

  // Projected balance and runway
  const projectedBalance = Number(bankBalance || 0) + totalForecastedIncome + totalUnpaidInvoices - totalForecastedExpenses - totalUnpaidBills;
  const cashRunway = monthlyBurn > 0 ? projectedBalance / monthlyBurn : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cash Flow</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded px-3 py-1.5 bg-white shadow-sm">
            <span className="text-sm text-gray-700 mr-2">Current Bank Balance:</span>
            <span className="font-bold text-lg text-purple-700 mr-2">{bankBalance !== null ? `£${Number(bankBalance).toLocaleString()}` : '—'}</span>
            <button
              className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => { setShowBalanceModal(true); setBalanceInput(bankBalance !== null ? bankBalance : ''); }}
            >Update</button>
          </div>
          <button
            className="inline-flex items-center border border-purple-500 text-purple-700 bg-white px-3 py-1.5 rounded-md shadow-sm hover:bg-purple-50 focus:outline-none gap-2"
            onClick={() => setShowHelpModal(true)}
          >
            <InformationCircleIcon className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-sm">Help</span>
          </button>
        </div>
      </div>
      {showHelpModal && <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Update Bank Balance</h3>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={balanceInput}
              onChange={e => setBalanceInput(e.target.value)}
              placeholder="Enter current bank balance"
            />
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1.5 bg-gray-200 rounded" onClick={() => setShowBalanceModal(false)}>Cancel</button>
              <button
                className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleSaveBankBalance}
              >Save</button>
            </div>
          </div>
        </div>
      )}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading cash flow data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <CashFlowCard
              title="Net Cash Flow"
              value={summary ? `£${(summary.actual.netCashFlow || 0).toLocaleString()}` : '—'}
              subtitle="This period"
              icon={<CurrencyDollarIcon className="w-7 h-7 text-green-600" />}
              color="text-green-600"
            />
            <CashFlowCard
              title="Total Income"
              value={summary ? `£${(summary.actual.income || 0).toLocaleString()}` : '—'}
              subtitle="Actual receipts"
              icon={<ArrowUpIcon className="w-7 h-7 text-blue-600" />}
              color="text-blue-600"
            />
            <CashFlowCard
              title="Total Expenses"
              value={summary ? `£${(summary.actual.expenses || 0).toLocaleString()}` : '—'}
              subtitle="Actual outflows"
              icon={<ArrowDownIcon className="w-7 h-7 text-red-600" />}
              color="text-red-600"
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Actual Cash Flows</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Period:</label>
              <input
                type="month"
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {actuals.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-6">No actual cash flows for this period.</td></tr>
                ) : actuals.map(item => (
                  <CashFlowRow key={item.id} item={{
                    description: item.description,
                    category: item.cash_flow_categories?.name || '',
                    date: item.transaction_date,
                    type: item.type,
                    amount: item.amount,
                    status: item.status
                  }} isActual={true} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-8 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Forecasted Cash Flows</h2>
          </div>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-6">No forecasted cash flows for this period.</td></tr>
                ) : forecasts.map(item => (
                  <CashFlowRow key={item.id} item={{
                    description: item.description,
                    category: item.cash_flow_categories?.name || '',
                    date: item.forecast_date,
                    type: item.type,
                    amount: item.amount,
                    status: 'Forecast'
                  }} isActual={false} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <Card className="bg-white">
              <div className="flex items-center gap-4">
                <ChartBarIcon className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-lg font-semibold text-gray-800">Cash Runway</div>
                  <div className={`text-2xl font-bold ${getCashRunwayColor(cashRunway)}`}>{cashRunway ? `${cashRunway.toFixed(1)} months` : '—'}</div>
                  <div className="text-xs text-gray-500">How long your cash will last at current burn rate</div>
        </div>
      </div>
    </Card>
          </div>
          {/* <Card className="bg-white mt-8">
            <div className="text-lg font-semibold text-gray-800 mb-2">Runway Calculation Breakdown</div>
            <div className="text-sm text-gray-700">Bank Balance: <span className="font-bold">£{Number(bankBalance || 0).toLocaleString()}</span></div>
            <div className="text-sm text-gray-700">+ Forecasted Income: <span className="font-bold">£{totalForecastedIncome.toLocaleString()}</span></div>
            <div className="text-sm text-gray-700">+ Unpaid Invoices (incoming): <span className="font-bold">£{totalUnpaidInvoices.toLocaleString()}</span></div>
            <div className="text-sm text-gray-700">- Forecasted Expenses: <span className="font-bold">£{totalForecastedExpenses.toLocaleString()}</span></div>
            <div className="text-sm text-gray-700">- Unpaid Bills (outgoing): <span className="font-bold">£{totalUnpaidBills.toLocaleString()}</span></div>
            <div className="text-sm text-gray-700 mt-2">Monthly Burn: <span className="font-bold">£{monthlyBurn.toLocaleString()}</span></div>
            <div className="text-md font-bold text-purple-700 mt-2">Projected Runway: {cashRunway ? cashRunway.toFixed(1) : '—'} months</div>
          </Card> */}
        </>
      )}
    </div>
  );
};

export default CashFlow; 