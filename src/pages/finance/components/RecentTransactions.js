import React from 'react';

const Transaction = ({ description, amount, date, type }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-3 ${type === 'income' ? 'bg-green-400' : 'bg-red-400'}`}></div>
      <div>
        <p className="font-medium text-gray-900">{description}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
    <span className={`font-semibold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
      {amount}
    </span>
  </div>
);

const RecentTransactions = () => {
  const transactions = [
    { id: 1, description: 'Customer Payment - TechCorp Inc.', amount: '+$125,000', date: '2024-01-15', type: 'income' },
    { id: 2, description: 'Office Rent Payment', amount: '-$8,500', date: '2024-01-14', type: 'expense' },
    { id: 3, description: 'Software Subscription', amount: '-$2,300', date: '2024-01-13', type: 'expense' },
    { id: 4, description: 'Consulting Revenue', amount: '+$45,000', date: '2024-01-12', type: 'income' },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} {...transaction} />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions; 