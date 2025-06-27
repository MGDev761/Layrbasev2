import React, { useState, useEffect } from 'react';
import { PlusIcon, CurrencyDollarIcon, CalendarIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
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

// Help Modal Component
const SideInfoModal = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('basics');
  const [openContent, setOpenContent] = useState({ intro: true, stages: false, metrics: false });
  const toggleContent = (key) => setOpenContent(s => ({ ...s, [key]: !s[key] }));
  const [openPlatform, setOpenPlatform] = useState({ navigation: true, management: false, dragdrop: false });
  const togglePlatform = (key) => setOpenPlatform(s => ({ ...s, [key]: !s[key] }));
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 w-full max-w-xl h-screen bg-white shadow-xl flex flex-col m-0 p-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-6 py-4 m-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Sales Pipeline Help & Tips</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 w-full">
          <button onClick={() => setTab('basics')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='basics' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><BookOpenIcon className="w-5 h-5" /> Basics</button>
          <button onClick={() => setTab('platform')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='platform' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><Cog6ToothIcon className="w-5 h-5" /> Platform How-To</button>
          <button onClick={() => setTab('ai')} className={`flex-1 px-0 py-4 text-sm font-medium flex items-center justify-center gap-2 transition border-b-2 ${tab==='ai' ? 'border-purple-600 text-purple-700 bg-white' : 'border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100'}`}><ChatBubbleLeftRightIcon className="w-5 h-5" /> AI</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {tab === 'basics' && (<>
            <div className="bg-gray-50"><button onClick={() => toggleContent('intro')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Pipeline Overview</span>{openContent.intro ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.intro && (<div className="px-6 py-4 text-gray-700 text-sm"><p>The Sales Pipeline helps you track deals through different stages from initial lead to closed sale. Monitor progress, manage deal flow, and optimize your sales process with visual kanban-style management.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('stages')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Pipeline Stages</span>{openContent.stages ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.stages && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li><strong>Lead:</strong> Initial contact or inquiry</li><li><strong>Qualified:</strong> Verified prospect with potential</li><li><strong>Proposal:</strong> Formal offer presented</li><li><strong>Negotiation:</strong> Terms and conditions discussion</li><li><strong>Closed:</strong> Deal won or lost</li></ul></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => toggleContent('metrics')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Key Metrics</span>{openContent.metrics ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openContent.metrics && (<div className="px-6 py-4 text-gray-700 text-sm"><ul className="list-disc pl-5 space-y-2"><li>Deal count per stage</li><li>Total pipeline value</li><li>Conversion rates between stages</li><li>Average deal size</li><li>Time spent in each stage</li></ul></div>)}</div>
          </>)}
          {tab === 'platform' && (<>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('navigation')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Navigation</span>{openPlatform.navigation ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.navigation && (<div className="px-6 py-4 text-gray-700 text-sm"><p>View your pipeline as a kanban board with drag-and-drop functionality. Use the search bar to find specific deals. Filter by deal owner to focus on your deals or team performance.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('management')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Deal Management</span>{openPlatform.management ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.management && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Add new deals using the "Add Deal" button. Edit deal details by clicking on any deal card. Update close dates, values, and notes to keep your pipeline current.</p></div>)}</div>
            <div className="bg-gray-50"><button onClick={() => togglePlatform('dragdrop')} className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-purple-700 bg-gray-50 hover:bg-gray-100 rounded-t focus:outline-none"><span className="text-sm">Drag & Drop</span>{openPlatform.dragdrop ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}</button>{openPlatform.dragdrop && (<div className="px-6 py-4 text-gray-700 text-sm"><p>Drag deals between stages to update their progress. The system automatically saves changes and updates metrics. Use this to quickly move deals through your sales process.</p></div>)}</div>
          </>)}
          {tab === 'ai' && (<div className="flex flex-col h-full bg-gray-50 rounded p-4" style={{ minHeight: 400 }}><div className="flex-1 overflow-y-auto space-y-3 mb-4"><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Hi! I'm your sales pipeline assistant. I can help you optimize your sales process, improve conversion rates, and manage your deals more effectively.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">How can I improve my pipeline conversion rate?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Focus on lead qualification, follow-up timing, and deal stage progression. Consider implementing automated reminders and tracking key metrics like time-in-stage.</div></div><div className="flex justify-end"><div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 text-sm text-purple-900 max-w-xs">What's the best way to organize my pipeline stages?</div></div><div className="flex justify-start"><div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs">Keep stages simple and meaningful. Ensure each stage represents a clear milestone in your sales process. Regularly review and optimize based on your team's workflow.</div></div></div><form className="flex items-center gap-2"><input type="text" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ask about pipeline optimization..." disabled /><button type="submit" className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700" disabled>Send</button></form></div>)}
        </div>
      </div>
    </div>
  );
};

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
  const [showHelpModal, setShowHelpModal] = useState(false);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Pipeline</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage your sales pipeline and track deal progress through different stages.
          </p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ boxShadow: '0 1px 4px 0 rgba(80,80,120,0.06)' }}
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
          Help
        </button>
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

      {/* Help Modal */}
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default PipelineManagement; 