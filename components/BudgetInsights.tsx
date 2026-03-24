import React from 'react';
import { ChartPieIcon } from './Icons.tsx';

interface BudgetInsightsProps {
  totalSpent: number;
  monthlyBudget: number;
  topCategories: { name: string; amount: number; color: string }[];
}

const BudgetInsights: React.FC<BudgetInsightsProps> = ({ totalSpent, monthlyBudget, topCategories }) => {
  const percentageSpent = (totalSpent / monthlyBudget) * 100;
  const remaining = monthlyBudget - totalSpent;
  
  // Generate smart recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    if (percentageSpent > 80) {
      recommendations.push({
        icon: '⚠️',
        text: 'You\'ve used over 80% of your budget. Consider reducing spending.',
        type: 'warning'
      });
    } else if (percentageSpent < 50) {
      recommendations.push({
        icon: '✨',
        text: 'Great job! You\'re well within your budget this month.',
        type: 'success'
      });
    }
    
    const highestCategory = topCategories[0];
    if (highestCategory && highestCategory.amount > monthlyBudget * 0.3) {
      recommendations.push({
        icon: '💡',
        text: `${highestCategory.name} accounts for a large portion of your spending. Look for savings opportunities.`,
        type: 'info'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        icon: '👍',
        text: 'Your spending is balanced. Keep up the good work!',
        type: 'success'
      });
    }
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
          <ChartPieIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Budget Insights</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered spending analysis</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">of ${monthlyBudget.toFixed(2)} budget</p>
          </div>
          <div className="text-right">
            <p className={`text-base font-semibold ${remaining >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-red-500'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{remaining >= 0 ? 'remaining' : 'over budget'}</p>
          </div>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              percentageSpent > 90 ? 'bg-red-500' :
              percentageSpent > 70 ? 'bg-amber-500' :
              'bg-teal-500'
            }`}
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{percentageSpent.toFixed(1)}% used</p>
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Top Categories</h4>
          {topCategories.map((category, index) => {
            const categoryPercent = (category.amount / totalSpent) * 100;
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">${category.amount.toFixed(2)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${categoryPercent}%`, backgroundColor: category.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Smart Recommendations */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recommendations</h4>
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`px-3 py-2 rounded-lg border-l-4 text-xs ${
              rec.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-400' :
              rec.type === 'success' ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-400' :
              'bg-blue-50 dark:bg-blue-900/10 border-blue-400'
            } text-gray-700 dark:text-gray-300`}
          >
            <span className="mr-1.5">{rec.icon}</span>{rec.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetInsights;
