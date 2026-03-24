import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { SearchIcon } from '../components/Icons.tsx';
import { formatINR, formatINRThousands } from '../utils/formatters.ts';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import {
    fetchIndianPrices,
    fetchCoupons,
    IndianProductResult,
    IndianPriceMerchant,
    CouponResult,
} from '../services/priceService.ts';

interface PriceComparisonViewProps {
    onBack: () => void;
}

const SUGGESTED_SEARCHES = [
    'Wireless Headphones', 'Smart Watch', 'Laptop', 'Smartphone', 'Air Conditioner', 'Rice Cooker',
];

const MerchantBadge: React.FC<{ merchant: string }> = ({ merchant }) => {
    const colors: Record<string, string> = {
        'Amazon.in': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        'Flipkart': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        'Croma': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        'IndiaMart (Wholesale)': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[merchant] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
            {merchant}
        </span>
    );
};

const AvailabilityDot: React.FC<{ availability: IndianPriceMerchant['availability'] }> = ({ availability }) => {
    const cls =
        availability === 'In Stock' ? 'bg-teal-500' :
        availability === 'Limited Stock' ? 'bg-amber-500' : 'bg-red-500';
    return <span className={`inline-block w-2 h-2 rounded-full ${cls} mr-1.5`} />;
};

const PriceComparisonView: React.FC<PriceComparisonViewProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState<IndianProductResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [coupons, setCoupons] = useState<CouponResult[]>([]);
    const [isFetchingCoupons, setIsFetchingCoupons] = useState(false);
    const [couponMerchant, setCouponMerchant] = useState('');
    const [showCoupons, setShowCoupons] = useState(false);
    const { addNotification } = useNotification();

    const handleSearch = async (query: string) => {
        const q = query.trim();
        if (!q) return;
        setSearchQuery(q);
        setIsSearching(true);
        setResult(null);
        setCoupons([]);
        setShowCoupons(false);
        try {
            const data = await fetchIndianPrices(q);
            setResult(data);
        } catch {
            addNotification('Failed to fetch prices. Please try again.', 'error');
        } finally {
            setIsSearching(false);
        }
    };

    const handleCouponDetect = async (merchant: string) => {
        if (!result) return;
        setCouponMerchant(merchant);
        setIsFetchingCoupons(true);
        setShowCoupons(true);
        try {
            const data = await fetchCoupons(result.productName, merchant);
            setCoupons(data);
            addNotification(`Found ${data.length} coupons for ${merchant}!`, 'success');
        } catch {
            addNotification('Could not fetch coupons.', 'error');
        } finally {
            setIsFetchingCoupons(false);
        }
    };

    const bestDeal = result
        ? result.merchants.reduce((a, b) => a.totalCost < b.totalCost ? a : b)
        : null;

    const maxSavings = result ? result.highestPrice - result.lowestPrice : 0;
    const savingsPct = result ? Math.round((maxSavings / result.highestPrice) * 100) : 0;

    // Price history formatted for Recharts
    const chartData = result?.priceHistory.map(p => ({
        date: p.date.slice(5), // MM-DD
        price: p.price,
    })) ?? [];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <button onClick={onBack} className="mb-4 text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                    ← Back to Dashboard
                </button>
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Price Intelligence</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time prices from Amazon.in, Flipkart, Croma & IndiaMart – powered by Gemini AI</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search a product (e.g. Wireless Headphones, Smart Watch…)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => handleSearch(searchQuery)}
                            disabled={isSearching || !searchQuery.trim()}
                            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {isSearching ? 'Searching…' : 'Search'}
                        </button>
                    </div>
                    {/* Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {SUGGESTED_SEARCHES.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSearch(s)}
                                className="text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isSearching && (
                    <div className="space-y-4">
                        <SkeletonLoader className="h-28 w-full rounded-xl" />
                        <SkeletonLoader className="h-64 w-full rounded-xl" />
                        <SkeletonLoader className="h-48 w-full rounded-xl" />
                    </div>
                )}

                {/* Results */}
                {result && !isSearching && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Summary Card */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{result.productName}</h2>
                                    <span className="inline-block text-xs px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">{result.category}</span>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">Last updated: {result.lastUpdated}</p>
                                </div>
                                <div className="flex gap-4 sm:text-right">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Lowest Price</p>
                                        <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{formatINR(result.lowestPrice)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Save up to</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{savingsPct}%</p>
                                        <p className="text-xs text-gray-400">{formatINR(maxSavings)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Merchant Comparison Table */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price Comparison</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Retailer</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Price</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">MRP</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden sm:table-cell">Shipping</th>
                                            <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden md:table-cell">Stock</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide hidden lg:table-cell">Delivery</th>
                                            <th className="px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {result.merchants.map((m, idx) => {
                                            const isBest = bestDeal?.merchant === m.merchant;
                                            return (
                                                <tr key={idx} className={`${isBest ? 'bg-teal-50/50 dark:bg-teal-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'} transition-colors`}>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <MerchantBadge merchant={m.merchant} />
                                                            {isBest && <span className="text-xs font-medium text-teal-600 dark:text-teal-400">★ Best</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                                        {formatINR(m.price)}
                                                        {m.discount && m.discount > 0 && (
                                                            <span className="ml-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">{m.discount}% off</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-400 line-through text-xs whitespace-nowrap hidden sm:table-cell">
                                                        {m.originalPrice ? formatINR(m.originalPrice) : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap hidden sm:table-cell">
                                                        {m.shipping === 0 ? <span className="text-teal-600 dark:text-teal-400 font-medium">FREE</span> : formatINR(m.shipping)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                        {formatINR(m.totalCost)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                                                        <span className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                                                            <AvailabilityDot availability={m.availability} />
                                                            {m.availability}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap hidden lg:table-cell">{m.deliveryDays}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleCouponDetect(m.merchant)}
                                                            className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                                                        >
                                                            Coupons
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Coupons Panel */}
                        {showCoupons && (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-fade-in">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Coupons for {couponMerchant}</h3>
                                    <button onClick={() => setShowCoupons(false)} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
                                </div>
                                {isFetchingCoupons ? (
                                    <div className="space-y-2">
                                        <SkeletonLoader className="h-10 w-full rounded-lg" />
                                        <SkeletonLoader className="h-10 w-full rounded-lg" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {coupons.map((c, i) => (
                                            <div key={i} className="border border-dashed border-teal-300 dark:border-teal-700 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <code className="text-sm font-bold text-teal-700 dark:text-teal-400 tracking-wider">{c.code}</code>
                                                    {c.isVerified && <span className="text-xs text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-1.5 py-0.5 rounded-full">✓ Verified</span>}
                                                </div>
                                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{c.discount}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.description}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{c.expiresIn}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Price History Chart */}
                        {chartData.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5">
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">30-Day Price History</h3>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Lowest price across all retailers</p>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                                            tickLine={false}
                                            axisLine={false}
                                            interval={4}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={formatINRThousands}
                                            width={40}
                                        />
                                        <Tooltip
                                            formatter={(value: number) => [formatINR(value), 'Price']}
                                            contentStyle={{
                                                fontSize: 12,
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 8,
                                                background: 'white',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#0D9488"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4, fill: '#0D9488' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!result && !isSearching && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
                        <SearchIcon className="w-12 h-12 text-gray-200 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">Search for a product</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Compare live prices from Amazon.in, Flipkart, Croma & IndiaMart</p>
                    </div>
                )}

                {/* How it works */}
                <div className="mt-6 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl p-4">
                    <p className="text-xs text-teal-700 dark:text-teal-400">
                        <strong>Real-time Price Intelligence</strong> – Prices are fetched live via Gemini AI simulating IndiaMart, Amazon.in, Flipkart & Croma APIs. 
                        Coupon detection finds active promo codes for each retailer. Price history shows the lowest price trend over 30 days.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default PriceComparisonView;
