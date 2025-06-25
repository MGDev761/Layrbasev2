import React from 'react';
import Card from '../../../../components/common/layout/Card';

const CashFlowSection = ({ title, items }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <div className="space-y-2 pl-4">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span>{item.label}</span>
          <span className={`font-semibold ${item.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
            {item.amount}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const CashFlow = () => {
  const sections = [
    {
      title: 'Operating Activities',
      items: [
        { label: 'Net Income', amount: '$400,000' },
        { label: 'Depreciation', amount: '$50,000' },
        { label: 'Changes in Working Capital', amount: '-$100,000' },
      ]
    },
    {
      title: 'Investing Activities',
      items: [
        { label: 'Purchase of Equipment', amount: '-$200,000' },
        { label: 'Sale of Investments', amount: '$150,000' },
      ]
    },
    {
      title: 'Financing Activities',
      items: [
        { label: 'Debt Repayment', amount: '-$100,000' },
        { label: 'Dividend Payment', amount: '-$50,000' },
      ]
    }
  ];

  const netCashFlow = {
    title: 'Net Cash Flow',
    items: [
      { label: 'Net Change in Cash', amount: '$150,000' },
      { label: 'Beginning Cash Balance', amount: '$700,000' },
      { label: 'Ending Cash Balance', amount: '$850,000' },
    ]
  };

  return (
    <Card>
      <div className="space-y-6">
        {sections.map((section, index) => (
          <CashFlowSection key={index} {...section} />
        ))}
        <div className="border-t pt-4">
          <CashFlowSection {...netCashFlow} />
        </div>
      </div>
    </Card>
  );
};

export default CashFlow; 