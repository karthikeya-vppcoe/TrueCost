import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingListItem, PriceAlertNotification } from '../types.ts';
import { fetchShoppingList, fetchPriceAlerts } from '../services/api.ts';
import { formatINR, formatDate } from '../utils/formatters.ts';
import { useNotification } from '../context/NotificationContext.tsx';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import { BellIcon, TrashIcon, CheckIcon, ChartBarIcon } from '../components/Icons.tsx';
import { fetchIndianPrices } from '../services/priceService.ts';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface ShoppingListViewProps {
    onBack: () => void;
}

// Convert API items (USD) to INR representation for Indian context
const toINR = (usdPrice: number) => Math.round(usdPrice * 84);

const ShoppingListView: React.FC<ShoppingListViewProps> = ({ onBack }) => {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [alerts, setAlerts] = useState<PriceAlertNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [trackingItemId, setTrackingItemId] = useState<string | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const { addNotification } = useNotification();

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [listData, alertsData] = await Promise.all([
                fetchShoppingList(),
                fetchPriceAlerts(),
            ]);
            setItems(listData);
            setAlerts(alertsData);
        } catch {
            addNotification('Failed to load shopping list', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        addNotification('Item removed', 'success');
    };

    const handlePurchased = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        addNotification('Marked as purchased!', 'success');
    };

    const handleToggleAlert = (id: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, priceAlert: !i.priceAlert } : i));
        addNotification('Price alert updated', 'info');
    };

    const handleTrackPrice = async (item: ShoppingListItem) => {
        setTrackingItemId(item.id);
        try {
            const result = await fetchIndianPrices(item.name);
            // Update the item with fresh price history from Gemini
            setItems(prev => prev.map(i =>
                i.id === item.id
                    ? {
                        ...i,
                        currentPrice: result.lowestPrice / 84, // store as USD equivalent
                        priceHistory: result.priceHistory.map(p => ({
                            date: p.date,
                            price: p.price / 84,
                            merchant: result.merchants[0]?.merchant ?? 'IndiaMart',
                        })),
                    }
                    : i
            ));
            setExpandedItemId(item.id);
            addNotification(`Price tracked for ${item.name}! Best: ${formatINR(result.lowestPrice)}`, 'success');
        } catch {
            addNotification('Could not fetch live price data', 'error');
        } finally {
            setTrackingItemId(null);
        }
    };

    const filteredItems = filter === 'all' ? items : items.filter(i => i.priority === filter);

    const potentialSavings = items.reduce((acc, i) => {
        const diff = toINR(i.currentPrice) - toINR(i.targetPrice);
        return acc + (diff > 0 ? diff : 0);
    }, 0);

    const priorityBadge = (p: string) => {
        if (p === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        if (p === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <button onClick={onBack} className="mb-4 text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                    &larr; Back to Dashboard
                </button>

                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Shopping List</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track items, monitor prices & get alerts when price drops</p>
                </div>

                {/* Price Alerts Banner */}
                {alerts.length > 0 && (
                    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-3 mb-5">
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-2">�� Recent Price Drops</p>
                        <div className="flex flex-wrap gap-2">
                            {alerts.map(a => (
                                <span key={a.id} className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-full">
                                    {a.itemName}: {formatINR(toINR(a.newPrice))}
                                    <span className="text-teal-500 ml-1">↓ {formatINR(toINR(a.oldPrice - a.newPrice))} off</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary + Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div className="flex gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">{items.length} items tracked</span>
                        {potentialSavings > 0 && (
                            <span className="text-teal-600 dark:text-teal-400 font-medium">Potential savings: {formatINR(potentialSavings)}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'high', 'medium', 'low'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${
                                    filter === f
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-teal-400'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(n => <SkeletonLoader key={n} className="h-24 w-full rounded-xl" />)}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No items found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredItems.map(item => {
                            const currentINR = toINR(item.currentPrice);
                            const targetINR = toINR(item.targetPrice);
                            const diff = currentINR - targetINR;
                            const atTarget = diff <= 0;
                            const expanded = expandedItemId === item.id;
                            const chartData = item.priceHistory.map(p => ({
                                date: p.date.slice(5),
                                price: toINR(p.price),
                            }));

                            return (
                                <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                            {/* Left: Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${priorityBadge(item.priority)}`}>{item.priority}</span>
                                                    {atTarget && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">At Target Price!</span>}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.category} · Added {formatDate(item.addedDate)}</p>
                                                {item.notes && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">{item.notes}</p>}
                                            </div>

                                            {/* Right: Prices */}
                                            <div className="flex items-end gap-4 sm:text-right flex-shrink-0">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">Current</p>
                                                    <p className={`text-lg font-bold ${atTarget ? 'text-teal-600 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`}>{formatINR(currentINR)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-0.5">Target</p>
                                                    <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">{formatINR(targetINR)}</p>
                                                </div>
                                                {!atTarget && (
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-0.5">Gap</p>
                                                        <p className="text-lg font-semibold text-red-500">{formatINR(diff)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <button
                                                onClick={() => handleTrackPrice(item)}
                                                disabled={trackingItemId === item.id}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg transition-colors"
                                            >
                                                <ChartBarIcon className="w-3.5 h-3.5" />
                                                {trackingItemId === item.id ? 'Fetching…' : 'Track Price'}
                                            </button>
                                            <button
                                                onClick={() => setExpandedItemId(expanded ? null : item.id)}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-teal-400 rounded-lg transition-colors"
                                            >
                                                {expanded ? 'Hide Chart' : 'Price History'}
                                            </button>
                                            <button
                                                onClick={() => handleToggleAlert(item.id)}
                                                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                                                    item.priceAlert
                                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700'
                                                        : 'border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-400'
                                                }`}
                                            >
                                                <BellIcon className="w-3.5 h-3.5" />
                                                {item.priceAlert ? 'Alert On' : 'Set Alert'}
                                            </button>
                                            <button
                                                onClick={() => handlePurchased(item.id)}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-teal-400 rounded-lg transition-colors"
                                            >
                                                <CheckIcon className="w-3.5 h-3.5" />
                                                Purchased
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                            >
                                                <TrashIcon className="w-3.5 h-3.5" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price History Chart */}
                                    {expanded && chartData.length > 0 && (
                                        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-4 animate-fade-in">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Price trend · {item.merchant}</p>
                                            <ResponsiveContainer width="100%" height={140}>
                                                <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={3} />
                                                    <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} width={36} />
                                                    <Tooltip
                                                        formatter={(value: number) => [formatINR(value), 'Price']}
                                                        contentStyle={{ fontSize: 11, border: '1px solid #e5e7eb', borderRadius: 8 }}
                                                    />
                                                    <Line type="monotone" dataKey="price" stroke="#0D9488" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ShoppingListView;
