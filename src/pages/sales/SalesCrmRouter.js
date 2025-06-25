import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CrmDashboard from './components/crm/CrmDashboard';
import CompaniesList from './components/crm/CompaniesList';
import ContactsList from './components/crm/ContactsList';
import DealsList from './components/crm/DealsList';
import ActivitiesList from './components/crm/ActivitiesList';
import NotesList from './components/crm/NotesList';
import CompanyDetail from './components/crm/CompanyDetail';
import ContactDetail from './components/crm/ContactDetail';
import DealDetail from './components/crm/DealDetail';
import ActivityDetail from './components/crm/ActivityDetail';
import NoteDetail from './components/crm/NoteDetail';

const SalesCrmRouter = () => (
  <Routes>
    <Route path="crm" element={<CrmDashboard />} />
    <Route path="crm/companies" element={<CompaniesList />} />
    <Route path="crm/companies/:id" element={<CompanyDetail />} />
    <Route path="crm/contacts" element={<ContactsList />} />
    <Route path="crm/contacts/:id" element={<ContactDetail />} />
    <Route path="crm/deals" element={<DealsList />} />
    <Route path="crm/deals/:id" element={<DealDetail />} />
    <Route path="crm/activities" element={<ActivitiesList />} />
    <Route path="crm/activities/:id" element={<ActivityDetail />} />
    <Route path="crm/notes" element={<NotesList />} />
    <Route path="crm/notes/:id" element={<NoteDetail />} />
  </Routes>
);

export default SalesCrmRouter; 