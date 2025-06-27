import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.old';
import CompanySetup from './pages/company-setup';
import Finance from './pages/finance';
import Legal from './pages/legal';
import CapTable from './pages/cap-table';
import Marketing from './pages/marketing';
import Sales from './pages/sales';
import HR from './pages/hr';
import Marketplace from './pages/marketplace';
import MyOrganizations from './pages/organizations/MyOrganizations';
import JoinOrganizationPage from './pages/JoinOrganization';
import BudgetLanding from './pages/finance/BudgetLanding';
import Budget from './pages/finance/components/budget/Budget';
import ProtectedLayout from './ProtectedLayout';

function App() {
  return (
    <Routes>
      <Route path="/join/:token" element={<JoinOrganizationPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="company/foundation" element={<CompanySetup activeSubTab="foundation" />} />
        <Route path="company/details" element={<CompanySetup activeSubTab="details" />} />
        <Route path="finance/overview" element={<Finance activeSubTab="overview" />} />
        <Route path="finance/budget" element={<BudgetLanding />} />
        <Route path="finance/cashflow" element={<Finance activeSubTab="cashflow" />} />
        <Route path="finance/budget/table" element={<Budget />} />
        <Route path="finance/invoicing" element={<Finance activeSubTab="invoicing" />} />
        <Route path="finance/management" element={<Finance activeSubTab="management" />} />
        <Route path="legal/contracts" element={<Legal activeSubTab="contracts" />} />
        <Route path="legal/templates" element={<Legal activeSubTab="templates" />} />
        <Route path="legal/compliance" element={<Legal activeSubTab="compliance" />} />
        <Route path="legal/risk" element={<Legal activeSubTab="risk" />} />
        <Route path="legal/requirements" element={<Legal activeSubTab="requirements" />} />
        <Route path="captable/captable" element={<CapTable activeSubTab="captable" />} />
        <Route path="captable/rounds" element={<CapTable activeSubTab="rounds" />} />
        <Route path="captable/exits" element={<CapTable activeSubTab="exits" />} />
        <Route path="captable/investment" element={<CapTable activeSubTab="investment" />} />
        <Route path="marketing/events" element={<Marketing activeSubTab="events" />} />
        <Route path="marketing/brand" element={<Marketing activeSubTab="brand" />} />
        <Route path="marketing/sales" element={<Marketing activeSubTab="sales" />} />
        <Route path="sales/crm" element={<Sales activeSubTab="crm" />} />
        <Route path="sales/contacts" element={<Sales activeSubTab="contacts" />} />
        <Route path="sales/pipeline" element={<Sales activeSubTab="pipeline" />} />
        <Route path="hr/employees" element={<HR activeSubTab="employees" />} />
        <Route path="hr/time" element={<HR activeSubTab="time" />} />
        <Route path="hr/policies" element={<HR activeSubTab="policies" />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="myorgs" element={<MyOrganizations />} />
        <Route path="company" element={<Navigate to="company/foundation" replace />} />
        <Route path="finance" element={<Navigate to="finance/overview" replace />} />
        <Route path="legal" element={<Navigate to="legal/contracts" replace />} />
        <Route path="captable" element={<Navigate to="captable/captable" replace />} />
        <Route path="marketing" element={<Navigate to="marketing/events" replace />} />
        <Route path="sales" element={<Navigate to="sales/crm" replace />} />
        <Route path="hr" element={<Navigate to="hr/employees" replace />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App; 