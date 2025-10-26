import React from 'react';
import { ChartPieIcon, LightBulbIcon, CurrencyDollarIcon, SparklesIcon } from './Icons.tsx';

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-brand-primary to-purple-600 rounded-lg">
            <ChartPieIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Budget Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered spending analysis</p>
          </div>
        </div>
        <SparklesIcon className="w-5 h-5 text-brand-primary animate-pulse" />
      </div>

      {/* Budget Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              of ${monthlyBudget.toFixed(2)} budget
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${remaining >= 0 ? 'text-brand-secondary' : 'text-risk-high'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {remaining >= 0 ? 'remaining' : 'over budget'}
            </p>
          </div>
        </div>
        
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
              percentageSpent > 90 ? 'bg-gradient-to-r from-risk-high to-red-600' :
              percentageSpent > 70 ? 'bg-gradient-to-r from-risk-medium to-orange-600' :
              'bg-gradient-to-r from-brand-primary to-brand-secondary'
            }`}
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          {percentageSpent.toFixed(1)}% of monthly budget used
        </p>
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <CurrencyDollarIcon className="w-4 h-4 mr-2" />
            Top Spending Categories
          </h4>
          <div className="space-y-2">
            {topCategories.map((category, index) => {
              const categoryPercent = (category.amount / totalSpent) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {category.name}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      ${category.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${categoryPercent}%`,
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Smart Recommendations */}
      <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <LightBulbIcon className="w-4 h-4 mr-2" />
          Smart Recommendations
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                rec.type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20 border-risk-medium' :
                rec.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-brand-secondary' :
                'bg-blue-50 dark:bg-blue-900/20 border-risk-low'
              }`}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="mr-2">{rec.icon}</span>
                {rec.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetInsights;
