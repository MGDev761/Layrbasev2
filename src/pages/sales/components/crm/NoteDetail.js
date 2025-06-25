import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCrmNote } from '../../../../services/salesService';

export default function NoteDetail() {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    getCrmNote(id).then(({ data }) => setNote(data));
  }, [id]);

  if (!note) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">Note</h2>
      <div className="mb-2"><b>Content:</b> {note.content}</div>
      <div className="mb-2"><b>Created:</b> {note.created_at ? new Date(note.created_at).toLocaleString() : ''}</div>
      <Link to="/sales/crm/notes" className="text-purple-600 underline mt-4 inline-block">Back to Notes</Link>
    </div>
  );
} 