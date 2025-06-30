import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Forecast = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to budget page with forecast tab active
    navigate('/finance/budget?tab=forecast');
  }, [navigate]);

  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Forecast...</h3>
      <p className="text-gray-500">Please wait while we redirect you to the forecast view.</p>
    </div>
  );
};

export default Forecast; 