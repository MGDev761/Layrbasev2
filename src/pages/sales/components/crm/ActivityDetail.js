import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCrmActivity } from '../../../../services/salesService';

export default function ActivityDetail() {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getCrmActivity(id).then(({ data }) => setActivity(data));
  }, [id]);

  if (!activity) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">{activity.subject}</h2>
      <div className="mb-2"><b>Type:</b> {activity.type}</div>
      <div className="mb-2"><b>Due Date:</b> {activity.due_date}</div>
      <div className="mb-2"><b>Completed:</b> {activity.completed ? 'Yes' : 'No'}</div>
      <div className="mb-2"><b>Notes:</b> {activity.notes}</div>
      <Link to="/sales/crm/activities" className="text-purple-600 underline mt-4 inline-block">Back to Activities</Link>
    </div>
  );
} 