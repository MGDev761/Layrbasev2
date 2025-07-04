import React, { useEffect, useState } from 'react';
import { fetchLeaveBalances } from '../../../../services/leaveService';

const LEAVE_TYPE_LABELS = {
  holiday: 'Paid Holiday',
  sick: 'Sick Leave',
  unpaid: 'Unpaid Leave',
  parental: 'Parental Leave',
  custom: 'Other'
};

const LeaveBalances = ({ orgId, userId }) => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId || !userId) return;
    setLoading(true);
    fetchLeaveBalances(orgId, userId)
      .then(setBalances)
      .catch(err => setError(err.message || JSON.stringify(err)))
      .finally(() => setLoading(false));
  }, [orgId, userId]);

  return (
    <div className="bg-white rounded-md shadow p-2 min-h-[180px] max-h-[180px] h-[180px] flex flex-col">
      <h3 className="text-base font-semibold mb-1">My Leave Balance</h3>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="flex-1">
          <ul className="space-y-0">
            {balances.length === 0 && <li className="text-gray-400 text-sm">No balances found</li>}
            {balances.map(b => (
              <li key={`${b.type}-${b.year}`} className="flex justify-between items-center py-1">
                <span className="text-sm text-gray-600">{LEAVE_TYPE_LABELS[b.type] || b.type}</span>
                <span className="text-base font-bold text-purple-600">{(b.balance + b.carryover - b.used).toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeaveBalances; 