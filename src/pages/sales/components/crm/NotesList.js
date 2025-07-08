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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex border border-gray-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Left info panel */}
            <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col justify-center items-center p-8 text-center">
              <div className="flex flex-col justify-center items-center h-full w-full">
                <div className="text-xl font-bold text-purple-700 mb-2">{editing ? 'Edit Note' : 'Add Note'}</div>
                <div className="text-sm text-gray-500 mb-4">Add a note for this deal, contact, or company.</div>
                <div className="text-xs text-gray-400">Notes are visible to your team.</div>
              </div>
            </div>
            {/* Right form panel */}
            <div className="w-2/3 p-8 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500" placeholder="Content" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
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