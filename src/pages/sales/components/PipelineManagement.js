import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  CurrencyDollarIcon, 
  CalendarIcon, 
  PencilIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/20/solid';
import { InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getCrmDeals, createCrmDeal, updateCrmDeal, deleteCrmDeal, getCrmCompanies } from '../../../services/salesService';
import { useAuth } from '../../../contexts/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { id: 'qualified', name: 'Qualified', color: 'bg-indigo-500', lightColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-700' },
  { id: 'closed', name: 'Closed', color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' },
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

  useEffect(() => {
    if (!orgId) return;
    loadData();
  }, [orgId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsRes, companiesRes] = await Promise.all([
        getCrmDeals(orgId),
        getCrmCompanies(orgId)
      ]);
      setDeals(dealsRes.data || []);
      setCompanies(companiesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const getStageValue = (stageDeals) => {
    return stageDeals.reduce((total, deal) => {
      const value = parseFloat(deal.value) || 0;
      return total + value;
    }, 0);
  };

  const getStageData = (stageId) => {
    const stageDeals = deals.filter(d => d.stage === stageId);
    return {
      count: stageDeals.length,
      value: getStageValue(stageDeals),
      deals: stageDeals
    };
  };

  const getTotalPipelineValue = () => {
    return deals.reduce((total, deal) => total + (parseFloat(deal.value) || 0), 0);
  };

  const getFilteredDeals = (stageDeals) => {
    return stageDeals.filter(deal => {
      const matchesSearch = searchTerm === '' || 
        deal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCompanyName(deal.company_id).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Add more filters based on dealOwnerFilter when you have user data
      return matchesSearch;
    });
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

  const closeModal = () => { 
    setShowModal(false); 
    setEditing(null); 
  };

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
    
    try {
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
      loadData();
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Error saving deal');
    }
  };

  const getCompanyName = (company_id) => {
    const company = companies.find(c => c.id === company_id);
    return company ? company.name : '';
  };

  // Enhanced drag and drop logic
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
    
    // Optimistically update local state
    const updatedDeals = deals.map(d => 
      d.id === dealId ? { ...d, stage: destStage } : d
    );
    setDeals(updatedDeals);
    
    // Update stage in DB
    try {
      const { error } = await updateCrmDeal(dealId, { stage: destStage });
      if (error) {
        // Revert on error
        setDeals(deals);
        alert(error.message || 'Error moving deal');
      }
    } catch (error) {
      // Revert on error
      setDeals(deals);
      alert('Error moving deal');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-sm text-gray-600">
            Track deals, manage opportunities, and optimize your sales process
          </p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        >
          <InformationCircleIcon className="w-4 h-4 mr-2 text-purple-500" />
          Help
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Pipeline</p>
              <p className="text-xl font-bold text-gray-900">£{getTotalPipelineValue().toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-green-600">
              <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Active Deals</p>
              <p className="text-xl font-bold text-gray-900">{deals.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-gray-500">
              <span>Across {STAGES.length} stages</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Avg Deal Size</p>
              <p className="text-xl font-bold text-gray-900">
                £{deals.length > 0 ? Math.round(getTotalPipelineValue() / deals.length).toLocaleString() : 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-gray-500">
              <span>Based on active deals</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Close Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {deals.filter(d => d.stage === 'closed').length > 0 ? 
                  Math.round((deals.filter(d => d.stage === 'closed').length / deals.length) * 100) : 0}%
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-gray-500">
              <span>This quarter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-3">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals and companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={dealOwnerFilter}
              onChange={(e) => setDealOwnerFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Deal Owners</option>
              <option value="me">My Deals</option>
              <option value="team">Team Deals</option>
            </select>
            <button 
              onClick={() => openEdit(null)} 
              className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add Deal
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Kanban Board with Drag and Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {STAGES.map((stage) => {
            const stageData = getStageData(stage.id);
            const filteredDeals = getFilteredDeals(stageData.deals);
            
            return (
              <div key={stage.id} className="flex flex-col">
                {/* Stage Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                      <h3 className="font-semibold text-gray-900 text-sm">{stage.name}</h3>
                      <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                        {filteredDeals.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-gray-900">
                      £{stageData.value.toLocaleString()}
                    </p>
                    <div className={`w-full h-1.5 rounded-full ${stage.lightColor}`}>
                      <div 
                        className={`h-1.5 rounded-full ${stage.color} transition-all duration-300`}
                        style={{ 
                          width: `${deals.length > 0 ? (stageData.count / deals.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 rounded-lg p-2 min-h-[300px] transition-all duration-200 ${
                        snapshot.isDraggingOver 
                          ? `${stage.lightColor} border-2 border-dashed border-current ${stage.textColor}` 
                          : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="space-y-2">
                        {filteredDeals.map((deal, idx) => (
                          <Draggable draggableId={deal.id} index={idx} key={deal.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg border border-gray-200 p-3 cursor-pointer transition-all duration-200 ${
                                  snapshot.isDragging 
                                    ? 'shadow-xl transform rotate-3 scale-105' 
                                    : 'hover:shadow-md hover:border-purple-300'
                                }`}
                                onClick={() => openEdit(deal)}
                              >
                                <div className="space-y-2">
                                  {/* Deal Header */}
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                                      {deal.name || 'Untitled Deal'}
                                    </h4>
                                    <span className="text-sm font-bold text-purple-600 ml-2">
                                      £{parseFloat(deal.value || 0).toLocaleString()}
                                    </span>
                                  </div>

                                  {/* Company Info */}
                                  {deal.company_id && (
                                    <div className="flex items-center space-x-1">
                                      <BuildingOfficeIcon className="w-3 h-3 text-gray-400" />
                                      <span className="text-xs text-gray-600 truncate">
                                        {getCompanyName(deal.company_id)}
                                      </span>
                                    </div>
                                  )}

                                  {/* Timeline */}
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <ClockIcon className="w-3 h-3" />
                                      <span>
                                        {deal.close_date 
                                          ? new Date(deal.close_date).toLocaleDateString() 
                                          : 'No close date'
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Add Deal Button */}
                        <button 
                          onClick={() => openEdit({ stage: stage.id })} 
                          className="w-full p-3 text-xs text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center space-x-1"
                        >
                          <PlusIcon className="w-3 h-3" />
                          <span>Add Deal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modern Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {editing ? 'Edit Deal' : 'Create New Deal'}
                    </h2>
                    <p className="text-purple-100 text-sm">
                      {editing ? 'Update deal information and track progress' : 'Add a new opportunity to your pipeline'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Deal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CurrencyDollarIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Deal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deal Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        placeholder="Enter deal name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deal Value *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">£</span>
                        </div>
                        <input
                          type="number"
                          value={form.value}
                          onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pipeline Stage
                      </label>
                      <select
                        value={form.stage}
                        onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      >
                        {STAGES.map(stage => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company *
                      </label>
                      <select
                        value={form.company_id}
                        onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>{company.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Close Date
                      </label>
                      <input
                        type="date"
                        value={form.close_date}
                        onChange={e => setForm(f => ({ ...f, close_date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    placeholder="Add any additional notes about this deal..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                  >
                    {editing ? 'Update Deal' : 'Create Deal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help Modal */}
      <SideInfoModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};

export default PipelineManagement; 