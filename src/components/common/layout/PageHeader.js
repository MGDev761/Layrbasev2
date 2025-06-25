import React from 'react';

export default function PageHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-600 text-sm mb-6">{subtitle}</p>}
    </div>
  );
} 