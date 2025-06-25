import React from 'react';
import Card from '../../../../components/common/layout/Card';

const PLItem = ({ label, amount, isTotal = false, isNegative = false }) => (
  <div className="flex justify-between items-center py-2 border-b">
    <span className={`${isTotal ? 'font-medium' : ''}`}>{label}</span>
    <span className={`font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'} ${isTotal ? 'text-lg' : ''}`}>
      {amount}
    </span>
  </div>
);

const ProfitLoss = () => {
  const plItems = [
    { label: 'Revenue', amount: '$2,400,000' },
    { label: 'Cost of Goods Sold', amount: '-$1,200,000', isNegative: true },
    { label: 'Gross Profit', amount: '$1,200,000', isTotal: true },
    { label: 'Operating Expenses', amount: '-$800,000', isNegative: true },
    { label: 'Operating Income', amount: '$400,000', isTotal: true },
    { label: 'Net Income', amount: '$400,000', isTotal: true }
  ];

  return (
    <Card>
      <div className="space-y-4">
        {plItems.map((item, index) => (
          <PLItem key={index} {...item} />
        ))}
      </div>
    </Card>
  );
};

export default ProfitLoss; 