import React, { useEffect, useState } from 'react';
import { getCrmNotes, createCrmNote, updateCrmNote, deleteCrmNote } from '../../../../services/salesService';
import { useAuth } from '../../../../contexts/AuthContext';

export default function NotesList({ onBack }) {
  const { currentOrganization } = useAuth();
  const orgId = currentOrganization?.organization_id;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ content: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await getCrmNotes(orgId);
    setNotes(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openEdit = (note) => {
    setEditing(note);
    setForm(note || { content: '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateCrmNote(editing.id, form);
    else await createCrmNote(orgId, form);
    closeModal();
    load();
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      await deleteCrmNote(id);
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
          <h2 className="text-2xl font-semibold">Notes</h2>
        </div>
        <button onClick={() => openEdit(null)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Add Note</button>
      </div>
      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Content</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{n.content}</td>
                <td className="px-4 py-2">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</td>
                <td className="px-4 py-2">
                  <button onClick={() => openEdit(n)} className="text-purple-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:underline">Delete</button>
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
              <div className="text-lg font-medium text-gray-900">{editing ? 'Edit' : 'Add'} Note</div>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3">
              <textarea className="w-full px-3 py-2 border rounded" placeholder="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
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