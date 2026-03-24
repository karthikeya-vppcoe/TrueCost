import React, { useState, useEffect } from 'react';
import {
    SpendingTrend,
    CategorySpending,
    MonthlyComparison,
    AnalyticsInsight,
    PredictiveAnalytics,
} from '../types.ts';
import {
    fetchSpendingTrends,
    fetchCategorySpending,
    fetchMonthlyComparison,
    fetchAnalyticsInsights,
    fetchPredictiveAnalytics,
} from '../services/api.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { ChartBarIcon, TrendingUpIcon, TrendingDownIcon } from '../components/Icons.tsx';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useNotification } from '../context/NotificationContext.tsx';

interface AnalyticsViewProps {
    onBack: () => void;
}

const CHART_COLORS = ['#0D9488', '#6366F1', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16'];

const StatTile: React.FC<{ label: string; value: string; change: number; inverse?: boolean }> = ({ label, value, change, inverse }) => {
    const isGood = inverse ? change < 0 : change > 0;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
            <span className={`text-xs font-medium ${isGood ? 'text-teal-600 dark:text-teal-400' : 'text-red-500'}`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
            </span>
        </div>
    );
};

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onBack }) => {
    const [spendingTrends, setSpendingTrends] = useState<SpendingTrend[]>([]);
    const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
    const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison | null>(null);
    const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
    const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotification();

    useEffect(() => {
        const load = async () => {
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
            } catch {
                addNotification('Failed to load analytics data', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [addNotification]);

    const insightBorder = (type: string) => {
        if (type === 'success') return 'border-l-teal-500';
        if (type === 'warning') return 'border-l-amber-500';
        if (type === 'tip') return 'border-l-blue-500';
        if (type === 'prediction') return 'border-l-purple-500';
        return 'border-l-gray-300';
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <button onClick={onBack} className="mb-4 text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                    &larr; Back to Dashboard
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Spending trends, category breakdown & AI insights</p>
                    </div>
                    <button
                        onClick={() => addNotification('Export feature coming soon!', 'info')}
                        className="text-sm text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    >
                        Export
                    </button>
                </div>

                {/* KPI Tiles */}
                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {[1,2,3].map(n => <SkeletonLoader key={n} className="h-24 rounded-xl" />)}
                    </div>
                ) : monthlyComparison && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <StatTile
                            label="This Month Spending"
                            value={formatCurrency(monthlyComparison.currentMonth.spending)}
                            change={monthlyComparison.percentageChange.spending}
                            inverse
                        />
                        <StatTile
                            label="This Month Savings"
                            value={formatCurrency(monthlyComparison.currentMonth.savings)}
                            change={monthlyComparison.percentageChange.savings}
                        />
                        <StatTile
                            label="Transactions"
                            value={monthlyComparison.currentMonth.transactions.toString()}
                            change={monthlyComparison.percentageChange.transactions}
                        />
                    </div>
                )}

                {/* Spending Trends Chart */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <ChartBarIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Spending vs Savings</h2>
                    </div>
                    {isLoading ? <SkeletonLoader className="h-56 w-full rounded-lg" /> : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={spendingTrends} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} />
                                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
                                <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="spending" name="Spending" fill="#6366F1" radius={[4,4,0,0]} />
                                <Bar dataKey="savings" name="Savings" fill="#0D9488" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Category Breakdown + Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Category Breakdown</h2>
                        {isLoading ? <SkeletonLoader className="h-48 w-full rounded-lg" /> : (
                            <div className="space-y-2.5">
                                {categorySpending.slice(0, 6).map((cat, i) => (
                                    <div key={cat.category}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-600 dark:text-gray-300">{cat.category}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-gray-900 dark:text-white">{formatCurrency(cat.amount)}</span>
                                                <span className={`text-xs ${cat.trend === 'up' ? 'text-red-500' : cat.trend === 'down' ? 'text-teal-500' : 'text-gray-400'}`}>
                                                    {cat.trend === 'up' ? '↑' : cat.trend === 'down' ? '↓' : '–'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full"
                                                style={{ width: `${cat.percentage}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5">
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Spending Distribution</h2>
                        {isLoading ? <SkeletonLoader className="h-48 w-full rounded-lg" /> : (
                            <ResponsiveContainer width="100%" height={190}>
                                <PieChart>
                                    <Pie
                                        data={categorySpending.slice(0, 6)}
                                        dataKey="amount"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {categorySpending.slice(0, 6).map((_, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 mb-4">
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">AI-Powered Insights</h2>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[1,2].map(n => <SkeletonLoader key={n} className="h-16 w-full rounded-lg" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {insights.map(insight => (
                                <div key={insight.id} className={`border-l-4 ${insightBorder(insight.type)} bg-gray-50 dark:bg-gray-700/40 rounded-r-lg p-3`}>
                                    <div className="flex items-start gap-2">
                                        <span className="text-base">{insight.icon}</span>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{insight.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{insight.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Predictive Analytics */}
                {!isLoading && predictiveAnalytics && (
                    <div className="bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUpIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    <h2 className="text-sm font-semibold text-teal-700 dark:text-teal-300">Next Month Forecast</h2>
                                </div>
                                <p className="text-xs text-teal-600 dark:text-teal-400 mb-2">Confidence: {predictiveAnalytics.confidence}%</p>
                                <p className="text-xs text-teal-700 dark:text-teal-300">{predictiveAnalytics.recommendation}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{formatCurrency(predictiveAnalytics.nextMonthSpending)}</p>
                                <p className="text-xs text-teal-500">predicted</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default AnalyticsView;
