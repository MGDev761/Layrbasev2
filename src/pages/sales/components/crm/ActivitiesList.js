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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="text-lg font-medium text-gray-900">{editing ? 'Edit' : 'Add'} Activity</div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border rounded" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                {TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <input className="w-full px-3 py-2 border rounded" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" type="datetime-local" placeholder="Due Date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
              <select className="w-full px-3 py-2 border rounded" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} required>
                {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <select className="w-full px-3 py-2 border rounded" value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}>
                <option value="">No Company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-8">
              <button type="button" onClick={closeModal} className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 