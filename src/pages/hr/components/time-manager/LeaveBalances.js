import React, { useEffect, useState } from 'react';
import { fetchLeaveBalances } from '../../../../services/leaveService';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  HeartIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const LEAVE_TYPE_CONFIG = {
  holiday: { 
    label: 'Holiday', 
    icon: CalendarDaysIcon, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    lightBgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  sick: { 
    label: 'Sick', 
    icon: ExclamationTriangleIcon, 
    color: 'text-amber-600',
    bgColor: 'bg-amber-500',
    lightBgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  unpaid: { 
    label: 'Unpaid', 
    icon: ClockIcon, 
    color: 'text-slate-600',
    bgColor: 'bg-slate-500',
    lightBgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
  parental: { 
    label: 'Parental', 
    icon: HeartIcon, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    lightBgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  custom: { 
    label: 'Other', 
    icon: AcademicCapIcon, 
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    lightBgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
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

  if (loading) {
    return (
      <>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 animate-pulse">
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-end justify-between">
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
              <div className="w-12 h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="text-red-700 text-sm">{error}</div>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="col-span-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <ClockIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
        <div className="text-gray-500 text-sm font-medium">No leave balances found</div>
        <div className="text-gray-400 text-xs">Contact HR to set up your leave entitlements</div>
      </div>
    );
  }

  const renderBalanceCard = (balance) => {
    const config = LEAVE_TYPE_CONFIG[balance.type] || LEAVE_TYPE_CONFIG.custom;
    const remaining = (balance.balance + balance.carryover - balance.used).toFixed(1);
    const total = (balance.balance + balance.carryover).toFixed(1);
    const usedPercentage = Math.min(100, Math.max(0, (balance.used / total) * 100));
    const IconComponent = config.icon;
    
    return (
      <div 
        key={`${balance.type}-${balance.year}`} 
        className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-all duration-200 hover:border-gray-300"
      >
        {/* Header */}
        <div className="flex items-center space-x-2.5 mb-2">
          <div className={`w-6 h-6 ${config.bgColor} rounded-full flex items-center justify-center`}>
            <IconComponent className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">{config.label}</div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className={`text-xl font-bold ${config.color} leading-none`}>{remaining}</div>
            <div className="text-xs text-gray-500">of {total} days</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-0.5">{balance.year}</div>
            <div className="text-xs font-medium text-gray-700">{balance.used} used</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${config.bgColor}`}
            style={{ width: `${100 - usedPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  const renderEmptyCard = (index) => (
    <div key={`empty-${index}`} className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center min-h-[100px]">
      <ClockIcon className="w-5 h-5 text-gray-400 mb-1" />
      <div className="text-xs text-gray-500 text-center">
        <div>No additional</div>
        <div>leave types</div>
      </div>
    </div>
  );

  // Always show 4 cards - fill with empty placeholders if needed
  const cardsToShow = [];
  balances.forEach(balance => {
    cardsToShow.push(renderBalanceCard(balance));
  });
  
  // Add empty cards to fill up to 4 total
  const remainingSlots = Math.max(0, 4 - balances.length);
  for (let i = 0; i < remainingSlots; i++) {
    cardsToShow.push(renderEmptyCard(i));
  }

  return <>{cardsToShow}</>;
};

export default LeaveBalances; 