import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import TimeManagerDashboard from './time-manager/TimeManagerDashboard';

const TimeManager = () => {
  const { user, currentOrganization } = useAuth();
  if (!user || !currentOrganization) return <div>Select an organization</div>;
  return <TimeManagerDashboard currentUser={user} currentOrganization={currentOrganization} />;
};

export default TimeManager; 