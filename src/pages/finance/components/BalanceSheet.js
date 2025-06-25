import React from 'react';
import Card from '../../../components/common/layout/Card';

const BalanceSheetSection = ({ title, items, total }) => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between">
          <span>{item.label}</span>
          <span className="font-semibold">{item.amount}</span>
        </div>
      ))}
      <div className="flex justify-between border-t pt-2">
        <span className="font-medium">Total {title}</span>
        <span className="font-semibold text-lg">{total}</span>
      </div>
    </div>
  </div>
);

const BalanceSheet = () => {
  const assets = [
    { label: 'Cash & Cash Equivalents', amount: '$850,000' },
    { label: 'Accounts Receivable', amount: '$320,000' },
    { label: 'Inventory', amount: '$180,000' },
  ];

  const liabilitiesAndEquity = [
    { label: 'Accounts Payable', amount: '$120,000' },
    { label: 'Short-term Debt', amount: '$200,000' },
    { label: 'Retained Earnings', amount: '$1,030,000' },
  ];

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BalanceSheetSection
          title="Assets"
          items={assets}
          total="$1,350,000"
        />
        <BalanceSheetSection
          title="Liabilities & Equity"
          items={liabilitiesAndEquity}
          total="$1,350,000"
        />
      </div>
    </Card>
  );
};

export default BalanceSheet; 