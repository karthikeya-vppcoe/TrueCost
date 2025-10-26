import React, { useState, useEffect } from 'react';
import { 
    SpendingTrend, 
    CategorySpending, 
    MonthlyComparison, 
    AnalyticsInsight,
    PredictiveAnalytics 
} from '../types.ts';
import { 
    fetchSpendingTrends, 
    fetchCategorySpending, 
    fetchMonthlyComparison,
    fetchAnalyticsInsights,
    fetchPredictiveAnalytics
} from '../services/api.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { ChartBarIcon, TrendingUpIcon, TrendingDownIcon, SparklesIcon } from '../components/Icons.tsx';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNotification } from '../context/NotificationContext.tsx';

interface AnalyticsViewProps {
    onBack: () => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
    const [spendingTrends, setSpendingTrends] = useState<SpendingTrend[]>([]);
    const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
    const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison | null>(null);
    const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
    const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'6months' | '12months' | 'ytd'>('6months');
    const { addNotification } = useNotification();

    useEffect(() => {
        const loadAnalyticsData = async () => {
            setIsLoading(true);
            try {
                const [trends, categories, comparison, insightsData, predictive] = await Promise.all([
                    fetchSpendingTrends(),
                    fetchCategorySpending(),
                    fetchMonthlyComparison(),
                    fetchAnalyticsInsights(),
                    fetchPredictiveAnalytics(),
                ]);
                
                setSpendingTrends(trends);
                setCategorySpending(categories);
                setMonthlyComparison(comparison);
                setInsights(insightsData);
                setPredictiveAnalytics(predictive);
            } catch (error) {
                console.error('Failed to load analytics data:', error);
                addNotification('Failed to load analytics data', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        
        loadAnalyticsData();
    }, [addNotification, selectedTimeframe]);

    const handleExportData = () => {
        addNotification('Export feature coming soon!', 'info');
        // In a real app, this would export to CSV/PDF
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'success': return 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-green-400';
            case 'warning': return 'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-800/30 border-orange-400';
            case 'tip': return 'from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-800/30 border-blue-400';
            case 'prediction': return 'from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-800/30 border-purple-400';
            default: return 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-400';
        }
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <button 
                    onClick={onBack} 
                    className="mb-4 sm:mb-6 text-sm text-brand-primary hover:underline flex items-center transition-all duration-300 hover:translate-x-1"
                >
                    &larr; Back to Dashboard
                </button>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-brand-primary to-purple-600 rounded-xl shadow-lg animate-pulse-slow">
                                <ChartBarIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    Advanced Analytics
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    Deep insights into your spending patterns
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportData}
                            className="px-4 py-2 bg-brand-secondary hover:bg-brand-secondary/90 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            📥 Export Data
                        </button>
                    </div>
                </div>

                {/* Monthly Comparison Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <SkeletonLoader className="h-32 w-full rounded-xl" />
                        <SkeletonLoader className="h-32 w-full rounded-xl" />
                        <SkeletonLoader className="h-32 w-full rounded-xl" />
                    </div>
                ) : monthlyComparison && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        {/* Spending Comparison */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Spending</h3>
                                {monthlyComparison.percentageChange.spending < 0 ? (
                                    <TrendingDownIcon className="w-5 h-5 text-green-500 animate-bounce-slow" />
                                ) : (
                                    <TrendingUpIcon className="w-5 h-5 text-red-500 animate-bounce-slow" />
                                )}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {formatCurrency(monthlyComparison.currentMonth.spending)}
                            </div>
                            <div className={`text-sm font-medium ${monthlyComparison.percentageChange.spending < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {monthlyComparison.percentageChange.spending > 0 ? '+' : ''}{monthlyComparison.percentageChange.spending}% from last month
                            </div>
                        </div>

                        {/* Savings Comparison */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Savings</h3>
                                {monthlyComparison.percentageChange.savings > 0 ? (
                                    <TrendingUpIcon className="w-5 h-5 text-green-500 animate-bounce-slow" />
                                ) : (
                                    <TrendingDownIcon className="w-5 h-5 text-red-500 animate-bounce-slow" />
                                )}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {formatCurrency(monthlyComparison.currentMonth.savings)}
                            </div>
                            <div className={`text-sm font-medium ${monthlyComparison.percentageChange.savings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {monthlyComparison.percentageChange.savings > 0 ? '+' : ''}{monthlyComparison.percentageChange.savings}% from last month
                            </div>
                        </div>

                        {/* Transactions Comparison */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Transactions</h3>
                                {monthlyComparison.percentageChange.transactions > 0 ? (
                                    <TrendingUpIcon className="w-5 h-5 text-blue-500 animate-bounce-slow" />
                                ) : (
                                    <TrendingDownIcon className="w-5 h-5 text-blue-500 animate-bounce-slow" />
                                )}
                            </div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {monthlyComparison.currentMonth.transactions}
                            </div>
                            <div className={`text-sm font-medium text-blue-600 dark:text-blue-400`}>
                                {monthlyComparison.percentageChange.transactions > 0 ? '+' : ''}{monthlyComparison.percentageChange.transactions}% from last month
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Spending Trends Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <SparklesIcon className="w-5 h-5 mr-2 text-brand-primary" />
                            Spending & Savings Trends
                        </h3>
                        {isLoading ? (
                            <SkeletonLoader className="h-80 w-full rounded-lg" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={spendingTrends}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0,0,0,0.8)', 
                                            border: 'none', 
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="spending" 
                                        stroke="#3B82F6" 
                                        strokeWidth={3}
                                        dot={{ fill: '#3B82F6', r: 5 }}
                                        activeDot={{ r: 8 }}
                                        name="Spending ($)"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="savings" 
                                        stroke="#10B981" 
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', r: 5 }}
                                        activeDot={{ r: 8 }}
                                        name="Savings ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Category Spending Pie Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <SparklesIcon className="w-5 h-5 mr-2 text-brand-primary" />
                            Category Distribution
                        </h3>
                        {isLoading ? (
                            <SkeletonLoader className="h-80 w-full rounded-lg" />
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categorySpending as any}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ category, percentage }) => `${category}: ${percentage}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="amount"
                                    >
                                        {categorySpending.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0,0,0,0.8)', 
                                            border: 'none', 
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Category Breakdown Table */}
                {!isLoading && categorySpending.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Detailed Category Breakdown
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {categorySpending.map((category, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div 
                                                        className="w-3 h-3 rounded-full mr-3"
                                                        style={{ backgroundColor: category.color }}
                                                    ></div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {category.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(category.amount)}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {category.percentage}%
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {category.trend === 'up' && (
                                                    <span className="inline-flex items-center text-red-600 dark:text-red-400 text-sm">
                                                        <TrendingUpIcon className="w-4 h-4 mr-1" />
                                                        Rising
                                                    </span>
                                                )}
                                                {category.trend === 'down' && (
                                                    <span className="inline-flex items-center text-green-600 dark:text-green-400 text-sm">
                                                        <TrendingDownIcon className="w-4 h-4 mr-1" />
                                                        Declining
                                                    </span>
                                                )}
                                                {category.trend === 'stable' && (
                                                    <span className="inline-flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                                        ➡️ Stable
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* AI Insights Grid */}
                {!isLoading && insights.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <SparklesIcon className="w-6 h-6 mr-2 text-brand-primary animate-pulse-slow" />
                            AI-Powered Insights
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insights.map((insight) => (
                                <div
                                    key={insight.id}
                                    className={`bg-gradient-to-br ${getInsightColor(insight.type)} border-2 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="text-4xl animate-bounce-slow">{insight.icon}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white">
                                                    {insight.title}
                                                </h4>
                                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                                    insight.impact === 'high' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                                                    insight.impact === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                                                    'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                                                }`}>
                                                    {insight.impact}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {insight.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Predictive Analytics */}
                {!isLoading && predictiveAnalytics && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-800/30 rounded-xl shadow-lg p-6 border-2 border-purple-400">
                        <div className="flex items-start space-x-4">
                            <div className="text-5xl animate-pulse-slow">🔮</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    Predictive Analytics - Next Month Forecast
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Predicted Spending</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(predictiveAnalytics.nextMonthSpending)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confidence Level</p>
                                        <div className="flex items-center">
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mr-2">
                                                {predictiveAnalytics.confidence}%
                                            </p>
                                            <div className="flex-1">
                                                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                                                        style={{ width: `${predictiveAnalytics.confidence}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mb-3">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Prediction Factors:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                        {predictiveAnalytics.factors.map((factor, index) => (
                                            <li key={index}>{factor}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                        💡 Recommendation:
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {predictiveAnalytics.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AnalyticsView;
