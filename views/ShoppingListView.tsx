import React, { useState, useEffect } from 'react';
import { ShoppingListItem, PriceAlertNotification } from '../types.ts';
import { fetchShoppingList, fetchPriceAlerts } from '../services/api.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';
import { useNotification } from '../context/NotificationContext.tsx';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import EmptyState from '../components/EmptyState.tsx';
import { 
    ShoppingCartIcon, 
    PlusIcon, 
    BellIcon, 
    TrendingDownIcon,
    TrendingUpIcon,
    ChartBarIcon,
    TrashIcon,
    CheckIcon
} from '../components/Icons.tsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ShoppingListViewProps {
    onBack: () => void;
}

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ onBack }) => {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [alerts, setAlerts] = useState<PriceAlertNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const { addNotification } = useNotification();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [listData, alertsData] = await Promise.all([
                fetchShoppingList(),
                fetchPriceAlerts()
            ]);
            setItems(listData);
            setAlerts(alertsData);
        } catch (error) {
            console.error('Failed to load shopping list:', error);
            addNotification('Failed to load shopping list', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = (itemId: string) => {
        setItems(items.filter(item => item.id !== itemId));
        addNotification('Item removed from shopping list', 'success');
    };

    const handleMarkAsPurchased = (itemId: string) => {
        setItems(items.filter(item => item.id !== itemId));
        addNotification('Item marked as purchased!', 'success');
    };

    const handleTogglePriceAlert = (itemId: string) => {
        setItems(items.map(item => 
            item.id === itemId 
                ? { ...item, priceAlert: !item.priceAlert }
                : item
        ));
        addNotification('Price alert updated', 'info');
    };

    const filteredItems = filter === 'all' 
        ? items 
        : items.filter(item => item.priority === filter);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    const calculatePotentialSavings = () => {
        return items.reduce((total, item) => {
            const savings = item.currentPrice - item.targetPrice;
            return total + (savings > 0 ? savings : 0);
        }, 0);
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
                                <ShoppingCartIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    Smart Shopping List
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                    Track prices and get alerts when items go on sale
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Item
                    </button>
                </div>

                {/* Price Alerts Banner */}
                {alerts.length > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border border-green-400 rounded-xl p-4 animate-fade-in">
                        <div className="flex items-start space-x-3">
                            <BellIcon className="w-6 h-6 text-green-600 dark:text-green-400 animate-bounce" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
                                    🎉 Price Drop Alerts!
                                </h3>
                                <div className="space-y-2">
                                    {alerts.slice(0, 3).map(alert => (
                                        <div key={alert.id} className="text-sm text-green-800 dark:text-green-200">
                                            <span className="font-semibold">{alert.itemName}</span> dropped from{' '}
                                            <span className="line-through">{formatCurrency(alert.oldPrice)}</span> to{' '}
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(alert.newPrice)}
                                            </span>{' '}
                                            at {alert.merchant}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{items.length}</p>
                            </div>
                            <ShoppingCartIcon className="w-12 h-12 text-brand-primary opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Potential Savings</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(calculatePotentialSavings())}
                                </p>
                            </div>
                            <TrendingDownIcon className="w-12 h-12 text-green-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Price Alerts</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {items.filter(i => i.priceAlert).length}
                                </p>
                            </div>
                            <BellIcon className="w-12 h-12 text-purple-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {items.filter(i => i.priority === 'high').length}
                                </p>
                            </div>
                            <div className="text-3xl">🔥</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            filter === 'all'
                                ? 'bg-brand-primary text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        All Items ({items.length})
                    </button>
                    <button
                        onClick={() => setFilter('high')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            filter === 'high'
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        High Priority ({items.filter(i => i.priority === 'high').length})
                    </button>
                    <button
                        onClick={() => setFilter('medium')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            filter === 'medium'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Medium Priority ({items.filter(i => i.priority === 'medium').length})
                    </button>
                    <button
                        onClick={() => setFilter('low')}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            filter === 'low'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        Low Priority ({items.filter(i => i.priority === 'low').length})
                    </button>
                </div>

                {/* Shopping List Items */}
                {isLoading ? (
                    <div className="space-y-4">
                        <SkeletonLoader className="h-48 w-full rounded-xl" />
                        <SkeletonLoader className="h-48 w-full rounded-xl" />
                        <SkeletonLoader className="h-48 w-full rounded-xl" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <EmptyState
                        title="No items in your shopping list"
                        description="Start adding items to track prices and get alerts when they go on sale"
                        icon={<ShoppingCartIcon className="w-16 h-16 text-gray-400" />}
                        actionLabel="Add Your First Item"
                        onAction={() => setShowAddModal(true)}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] animate-fade-in"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Item Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                                                        {item.priority.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.category} • Added {formatDate(item.addedDate)}
                                                </p>
                                                {item.notes && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 italic">
                                                        {item.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(item.currentPrice)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target Price</p>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(item.targetPrice)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price Difference</p>
                                                <p className={`text-2xl font-bold ${
                                                    item.currentPrice <= item.targetPrice 
                                                        ? 'text-green-600 dark:text-green-400' 
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                    {item.currentPrice <= item.targetPrice ? (
                                                        <span className="flex items-center">
                                                            <TrendingDownIcon className="w-6 h-6 mr-1" />
                                                            {formatCurrency(item.targetPrice - item.currentPrice)}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center">
                                                            <TrendingUpIcon className="w-6 h-6 mr-1" />
                                                            {formatCurrency(item.currentPrice - item.targetPrice)}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Merchant</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {item.merchant}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price History Chart */}
                                        {item.priceHistory.length > 1 && (
                                            <div className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    <ChartBarIcon className="w-4 h-4 mr-2 text-brand-primary" />
                                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Price History
                                                    </p>
                                                </div>
                                                <ResponsiveContainer width="100%" height={120}>
                                                    <LineChart data={item.priceHistory}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                                        <XAxis 
                                                            dataKey="date" 
                                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        />
                                                        <YAxis 
                                                            tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                                            tickFormatter={(value) => `$${value}`}
                                                        />
                                                        <Tooltip 
                                                            contentStyle={{ 
                                                                backgroundColor: '#1F2937', 
                                                                border: 'none', 
                                                                borderRadius: '8px',
                                                                color: '#fff'
                                                            }}
                                                            formatter={(value: number) => [formatCurrency(value), 'Price']}
                                                            labelFormatter={(label) => formatDate(label)}
                                                        />
                                                        <Line 
                                                            type="monotone" 
                                                            dataKey="price" 
                                                            stroke="#3B82F6" 
                                                            strokeWidth={2}
                                                            dot={{ fill: '#3B82F6', r: 3 }}
                                                            activeDot={{ r: 5 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleTogglePriceAlert(item.id)}
                                                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                                                    item.priceAlert
                                                        ? 'bg-purple-500 text-white shadow-lg'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                }`}
                                            >
                                                <BellIcon className="w-4 h-4 mr-2" />
                                                {item.priceAlert ? 'Alert ON' : 'Enable Alert'}
                                            </button>
                                            <button
                                                onClick={() => setSelectedItem(item)}
                                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                <ChartBarIcon className="w-4 h-4 mr-2" />
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleMarkAsPurchased(item.id)}
                                                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                <CheckIcon className="w-4 h-4 mr-2" />
                                                Mark Purchased
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-2" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ShoppingListView;
