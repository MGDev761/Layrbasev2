import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCrmDeal } from '../../../../services/salesService';

export default function DealDetail() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    getCrmDeal(id).then(({ data }) => setDeal(data));
  }, [id]);

  if (!deal) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">{deal.name}</h2>
      <div className="mb-2"><b>Value:</b> {deal.value}</div>
      <div className="mb-2"><b>Stage:</b> {deal.stage}</div>
      <div className="mb-2"><b>Close Date:</b> {deal.close_date}</div>
      <div className="mb-2"><b>Notes:</b> {deal.notes}</div>
      <Link to="/sales/crm/deals" className="text-purple-600 underline mt-4 inline-block">Back to Deals</Link>
    </div>
  );
} 