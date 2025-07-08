import React, { useEffect, useState } from 'react';
import { getCrmActivities, createCrmActivity, updateCrmActivity, deleteCrmActivity, getCrmCompanies } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Done' },
  { value: 'snoozed', label: 'Snoozed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TYPE_OPTIONS = [
  { value: 'task', label: 'Task' },
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'reminder', label: 'Reminder' },
];

export default function ActivitiesList({ onBack }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [activities, setActivities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: 'task', title: '', description: '', due_date: '', status: 'open', company_id: '' });

  const load = async () => {
    setLoading(true);
    const [{ data: acts }, { data: comps }] = await Promise.all([
      getCrmActivities(orgId),
      getCrmCompanies(orgId)
    ]);
    setActivities(acts || []);
    setCompanies(comps || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openEdit = (activity) => {
    setEditing(activity);
    setForm(activity ? {
      type: activity.type || 'task',
      title: activity.title || '',
      description: activity.description || '',
      due_date: activity.due_date ? activity.due_date.slice(0, 16) : '',
      status: activity.status || 'open',
      company_id: activity.company_id || ''
    } : { type: 'task', title: '', description: '', due_date: '', status: 'open', company_id: '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, due_date: form.due_date ? new Date(form.due_date).toISOString() : null };
    if (editing) await updateCrmActivity(editing.id, payload);
    else await createCrmActivity(orgId, payload);
    closeModal();
    load();
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      await deleteCrmActivity(id);
      load();
    }
  };

  const getCompanyName = (id) => companies.find(c => c.id === id)?.name || '';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
              ← Back
            </button>
          )}
          <h2 className="text-2xl font-semibold">Activities</h2>
        </div>
        <button onClick={() => openEdit(null)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add Activity</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{a.type}</td>
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2">{a.due_date ? a.due_date.slice(0, 10) : ''}</td>
                <td className="px-4 py-2">{a.status}</td>
                <td className="px-4 py-2">{getCompanyName(a.company_id)}</td>
                <td className="px-4 py-2">
                  <button onClick={() => openEdit(a)} className="text-purple-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Left info panel */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col justify-center items-center p-8 text-center">
              <div className="flex flex-col justify-center items-center h-full w-full">
                <div className="text-xl font-bold text-purple-700 mb-2">{editing ? 'Edit Activity' : 'Add Activity'}</div>
                <div className="text-sm text-gray-500 mb-4">Log a sales activity for your CRM.</div>
                <div className="text-xs text-gray-400">Activities help you track tasks, calls, meetings, and reminders.</div>
              </div>
            </div>
            {/* Right form panel */}
            <div className="w-2/3 p-8 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                  {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                <input className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" type="datetime-local" placeholder="Due Date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} required>
                  {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}>
                  <option value="">No Company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            {/* Sticky footer */}
            <div className="absolute bottom-0 right-0 left-1/3 bg-white border-t border-gray-200 flex justify-end gap-3 px-8 py-4 rounded-b-2xl z-10">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 