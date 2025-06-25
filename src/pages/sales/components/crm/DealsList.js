import React, { useEffect, useState } from 'react';
import { getCrmDeals, createCrmDeal, updateCrmDeal, deleteCrmDeal } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';

export default function DealsList({ onBack }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', value: '', stage: '', close_date: '', notes: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await getCrmDeals(orgId);
    setDeals(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openEdit = (deal) => {
    setEditing(deal);
    setForm(deal || { name: '', value: '', stage: '', close_date: '', notes: '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateCrmDeal(editing.id, form);
    else await createCrmDeal(orgId, form);
    closeModal();
    load();
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this deal?')) {
      await deleteCrmDeal(id);
      load();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
              ← Back
            </button>
          )}
          <h2 className="text-2xl font-semibold">Deals</h2>
        </div>
        <button onClick={() => openEdit(null)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add Deal</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Stage</th>
              <th className="px-4 py-2 text-left">Close Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map(d => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{d.name}</td>
                <td className="px-4 py-2">{d.value}</td>
                <td className="px-4 py-2">{d.stage}</td>
                <td className="px-4 py-2">{d.close_date}</td>
                <td className="px-4 py-2">
                  <button onClick={() => openEdit(d)} className="text-purple-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:underline">Delete</button>
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
              <div className="text-lg font-medium text-gray-900">{editing ? 'Edit' : 'Add'} Deal</div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="w-full px-3 py-2 border rounded" placeholder="Value" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Stage" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} />
              <input className="w-full px-3 py-2 border rounded" type="date" placeholder="Close Date" value={form.close_date} onChange={e => setForm(f => ({ ...f, close_date: e.target.value }))} />
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
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