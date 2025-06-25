import React, { useState, useEffect } from 'react';
import { PlusIcon, CurrencyDollarIcon, CalendarIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { getCrmDeals, createCrmDeal, updateCrmDeal, deleteCrmDeal, getCrmCompanies } from '../../../services/salesService';
import { useAuth } from '../../../contexts/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-200' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-200' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-200' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-200' },
  { id: 'closed', name: 'Closed', color: 'bg-green-200' },
];

const PipelineManagement = ({ onBack }) => {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [deals, setDeals] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', value: '', stage: 'lead', close_date: '', notes: '', company_id: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [dealOwnerFilter, setDealOwnerFilter] = useState('all');
  const emptyDeal = { name: '', value: '', stage: 'lead', close_date: '', notes: '', company_id: '' };

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    Promise.all([
      getCrmDeals(orgId),
      getCrmCompanies(orgId)
    ]).then(([dealsRes, companiesRes]) => {
      setDeals(dealsRes.data || []);
      setCompanies(companiesRes.data || []);
      setLoading(false);
    });
  }, [orgId]);

  const getStageValue = (stageDeals) => {
    return stageDeals.reduce((total, deal) => {
      const value = parseFloat(deal.value) || 0;
      return total + value;
    }, 0);
  };

  const openEdit = (deal) => {
    setEditing(deal && deal.id ? deal : null);
    setForm({
      name: deal?.name || '',
      value: deal?.value || '',
      stage: deal?.stage || 'lead',
      close_date: deal?.close_date || '',
      notes: deal?.notes || '',
      company_id: deal?.company_id || ''
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dealData = {
      name: form.name,
      value: form.value ? Number(form.value) : 0,
      stage: form.stage,
      close_date: form.close_date,
      notes: form.notes,
      company_id: form.company_id || null
    };
    let error;
    if (editing && editing.id) {
      ({ error } = await updateCrmDeal(editing.id, dealData));
    } else {
      ({ error } = await createCrmDeal(orgId, dealData));
    }
    if (error) {
      console.error('Supabase error:', error);
      alert(error.message || 'Error saving deal');
      return;
    }
    closeModal();
    setLoading(true);
    Promise.all([
      getCrmDeals(orgId),
      getCrmCompanies(orgId)
    ]).then(([dealsRes, companiesRes]) => {
      setDeals(dealsRes.data || []);
      setCompanies(companiesRes.data || []);
      setLoading(false);
    });
  };

  const getCompanyName = (company_id) => {
    const company = companies.find(c => c.id === company_id);
    return company ? company.name : '';
  };

  // Drag and drop logic
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const dealId = draggableId;
    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    if (sourceStage === destStage) return;
    // Find the deal
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;
    // Update stage in DB
    const { error } = await updateCrmDeal(dealId, { stage: destStage });
    if (error) {
      alert(error.message || 'Error moving deal');
      return;
    }
    // Refresh deals
    getCrmDeals(orgId).then(({ data }) => setDeals(data || []));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900">Pipeline</h3>
        <p className="mt-1 text-sm text-gray-600">
          Manage your sales pipeline and track deal progress through different stages.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-end space-x-4">
        <div className="relative w-64">
          <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <select
          value={dealOwnerFilter}
          onChange={(e) => setDealOwnerFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Deal Owners</option>
          <option value="me">My Deals</option>
          <option value="team">Team Deals</option>
        </select>
        <button 
          onClick={() => openEdit(null)} 
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Deal</span>
        </button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          return (
            <div key={stage.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">{stage.name}</h4>
                <span className="text-xs text-gray-500">{stageDeals.length}</span>
              </div>
              <div className={`w-full h-2 rounded-full ${stage.color} mb-2`} />
              <p className="text-lg font-semibold text-gray-900">£{getStageValue(stageDeals).toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban Board with Drag and Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            return (
              <Droppable droppableId={stage.id} key={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 rounded-lg p-4 min-h-[200px]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">{stage.name}</h4>
                      <span className="text-xs text-gray-500">{stageDeals.length}</span>
                    </div>
                    <div className="space-y-3">
                      {stageDeals.map((deal, idx) => (
                        <Draggable draggableId={deal.id} index={idx} key={deal.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-lg shadow border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => openEdit(deal)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="text-sm font-medium text-gray-900">{deal.name || deal.title}</h5>
                                <span className="text-sm font-semibold text-gray-900">£{parseFloat(deal.value || 0).toLocaleString()}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center text-xs text-gray-500">
                                  <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                                  {getCompanyName(deal.company_id)}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  Created: {deal.created_at ? deal.created_at.slice(0, 10) : ''}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <button onClick={() => openEdit({ stage: stage.id })} className="w-full p-2 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors">
                        + Add Deal
                      </button>
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">{editing ? 'Edit' : 'Add'} Deal</div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded" placeholder="Deal Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" placeholder="Value (£)" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} required />
              <select className="w-full px-3 py-2 border rounded" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select className="w-full px-3 py-2 border rounded" value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))} required>
                <option value="">Select Company</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input className="w-full px-3 py-2 border rounded" type="date" placeholder="Close Date" value={form.close_date} onChange={e => setForm(f => ({ ...f, close_date: e.target.value }))} />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={closeModal} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PipelineManagement; 