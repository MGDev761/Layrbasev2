import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const VarianceAnalysis = ({ budgetData, selectedYear }) => {
  // Calculate category-level variances
  const calculateCategoryVariances = () => {
    const categoryVariances = {};
    
    budgetData.forEach(item => {
      const categoryName = item.category_name || 'Uncategorized';
      if (!categoryVariances[categoryName]) {
        categoryVariances[categoryName] = {
          type: item.type,
          budget: 0,
          forecast: 0,
          actual: 0,
          items: []
        };
      }
      
      const category = categoryVariances[categoryName];
      category.budget += item.budget_total || 0;
      category.forecast += item.forecast_total || 0;
      category.actual += item.actual_total || 0;
      category.items.push(item);
    });
    
    return Object.entries(categoryVariances).map(([name, data]) => ({
      name,
      ...data,
      variance: data.forecast - data.budget,
      variancePercent: data.budget !== 0 ? ((data.forecast - data.budget) / Math.abs(data.budget)) * 100 : 0
    }));
  };

  const categoryVariances = calculateCategoryVariances();

  // Get significant variances (>10% or >$10k)
  const significantVariances = categoryVariances.filter(cat => 
    Math.abs(cat.variancePercent) > 10 || Math.abs(cat.variance) > 10000
  );

  // Format variance for display
  const formatVariance = (variance, percentage, type = 'revenue') => {
    const isPositive = variance >= 0;
    const color = (type === 'revenue' && isPositive) || (type === 'expense' && !isPositive) 
      ? 'text-green-600' 
      : 'text-red-600';
    const icon = isPositive ? '+' : '';
    
    return (
      <span className={`${color} font-medium`}>
        {icon}{variance.toLocaleString()} ({icon}{percentage.toFixed(1)}%)
      </span>
    );
  };

  // Get variance insights
  const getVarianceInsights = () => {
    const insights = [];
    
    // Revenue insights
    const revenueCategories = categoryVariances.filter(cat => cat.type === 'revenue');
    const totalRevenueVariance = revenueCategories.reduce((sum, cat) => sum + cat.variance, 0);
    
    if (totalRevenueVariance > 0) {
      insights.push({
        type: 'positive',
        title: 'Revenue Above Budget',
        message: `Total revenue forecast is ${totalRevenueVariance.toLocaleString()} above budget. This indicates strong performance or optimistic projections.`
      });
    } else if (totalRevenueVariance < -10000) {
      insights.push({
        type: 'warning',
        title: 'Revenue Below Budget',
        message: `Total revenue forecast is ${Math.abs(totalRevenueVariance).toLocaleString()} below budget. Consider reviewing sales strategies or updating assumptions.`
      });
    }
    
    // Expense insights
    const expenseCategories = categoryVariances.filter(cat => cat.type === 'expense');
    const totalExpenseVariance = expenseCategories.reduce((sum, cat) => sum + cat.variance, 0);
    
    if (totalExpenseVariance > 10000) {
      insights.push({
        type: 'warning',
        title: 'Expenses Above Budget',
        message: `Total expenses forecast is ${totalExpenseVariance.toLocaleString()} above budget. Review cost control measures.`
      });
    } else if (totalExpenseVariance < 0) {
      insights.push({
        type: 'positive',
        title: 'Expenses Below Budget',
        message: `Total expenses forecast is ${Math.abs(totalExpenseVariance).toLocaleString()} below budget. Good cost management.`
      });
    }
    
    return insights;
  };

  const insights = getVarianceInsights();

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-500" />
            Key Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-md ${
                  insight.type === 'positive' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  {insight.type === 'positive' ? (
                    <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      insight.type === 'positive' ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {insight.title}
                    </h4>
                    <p className={`text-sm ${
                      insight.type === 'positive' ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Significant Variances */}
      {significantVariances.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Significant Variances</h3>
          <div className="space-y-4">
            {significantVariances.map((category, index) => (
              <div 
                key={index}
                className={`p-4 rounded-md border ${
                  category.type === 'revenue' 
                    ? 'border-green-200' 
                    : 'border-red-200'
                }`}
                style={{ 
                  backgroundColor: category.type === 'revenue' ? '#fafffe' : '#fffefe'
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${
                      category.type === 'revenue' ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {category.name}
                    </h4>
                    <div className="mt-1 text-sm text-gray-600">
                      Budget: {category.budget.toLocaleString()} | 
                      Forecast: {category.forecast.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Variance</div>
                    <div>
                      {formatVariance(category.variance, category.variancePercent, category.type)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Category Variance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-700">Category</th>
                <th className="px-6 py-3 text-center font-medium text-gray-700">Type</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">Budget</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">Forecast</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">Variance</th>
                <th className="px-6 py-3 text-right font-medium text-gray-700">% Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categoryVariances
                .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
                .map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      category.type === 'revenue' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {category.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    {category.forecast.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <span className={`${
                      category.variance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.variance >= 0 ? '+' : ''}{category.variance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">
                    <span className={`${
                      Math.abs(category.variancePercent) > 10 
                        ? 'font-bold text-orange-600' 
                        : category.variance >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                    }`}>
                      {category.variance >= 0 ? '+' : ''}{category.variancePercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VarianceAnalysis; 