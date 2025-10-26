import React, { useState } from 'react';
import { PriceComparisonItem, PriceComparisonMerchant } from '../types.ts';
import { SearchIcon, ChartBarIcon } from '../components/Icons.tsx';
import { formatCurrency } from '../utils/formatters.ts';

interface PriceComparisonViewProps {
    onBack: () => void;
}

// Mock data for demonstration
const mockProducts: PriceComparisonItem[] = [
    {
        id: '1',
        productName: 'Organic Extra Virgin Olive Oil, 1L',
        category: 'Groceries',
        merchants: [
            { merchant: 'Walmart', price: 12.99, availability: 'In Stock', shipping: 5.99, totalCost: 18.98, rating: 4.5, estimatedDelivery: '2-3 days' },
            { merchant: 'Target', price: 13.49, availability: 'In Stock', shipping: 4.99, totalCost: 18.48, rating: 4.3, estimatedDelivery: '3-4 days' },
            { merchant: 'Whole Foods', price: 15.99, availability: 'In Stock', shipping: 0, totalCost: 15.99, rating: 4.8, estimatedDelivery: '1-2 days' },
            { merchant: 'Amazon', price: 11.99, availability: 'In Stock', shipping: 0, totalCost: 11.99, rating: 4.6, estimatedDelivery: 'Next day' },
        ],
        lowestPrice: 11.99,
        highestPrice: 15.99,
        averagePrice: 13.62,
    },
    {
        id: '2',
        productName: 'Premium Wireless Headphones',
        category: 'Electronics',
        merchants: [
            { merchant: 'Best Buy', price: 149.99, availability: 'In Stock', shipping: 0, totalCost: 149.99, rating: 4.7, estimatedDelivery: 'Store pickup' },
            { merchant: 'Amazon', price: 139.99, availability: 'In Stock', shipping: 0, totalCost: 139.99, rating: 4.5, estimatedDelivery: 'Next day' },
            { merchant: 'Walmart', price: 144.99, availability: 'Limited Stock', shipping: 5.99, totalCost: 150.98, rating: 4.4, estimatedDelivery: '3-5 days' },
            { merchant: 'Target', price: 149.99, availability: 'In Stock', shipping: 0, totalCost: 149.99, rating: 4.6, estimatedDelivery: '2-3 days' },
        ],
        lowestPrice: 139.99,
        highestPrice: 150.98,
        averagePrice: 147.74,
    },
    {
        id: '3',
        productName: 'Organic Coffee Beans, 2lb Bag',
        category: 'Groceries',
        merchants: [
            { merchant: 'Whole Foods', price: 24.99, availability: 'In Stock', shipping: 0, totalCost: 24.99, rating: 4.9, estimatedDelivery: '1-2 days' },
            { merchant: 'Trader Joes', price: 19.99, availability: 'In Stock', shipping: 0, totalCost: 19.99, rating: 4.7, estimatedDelivery: 'Store pickup' },
            { merchant: 'Amazon', price: 22.49, availability: 'In Stock', shipping: 0, totalCost: 22.49, rating: 4.6, estimatedDelivery: 'Next day' },
            { merchant: 'Costco', price: 18.99, availability: 'In Stock', shipping: 5.99, totalCost: 24.98, rating: 4.8, estimatedDelivery: '2-4 days' },
        ],
        lowestPrice: 18.99,
        highestPrice: 24.99,
        averagePrice: 21.62,
    },
];

const PriceComparisonView: React.FC<PriceComparisonViewProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<PriceComparisonItem[]>(mockProducts);

    const categories = ['All', 'Groceries', 'Electronics', 'Home & Garden', 'Clothing'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getBestDeal = (merchants: PriceComparisonMerchant[]) => {
        return merchants.reduce((best, current) => 
            current.totalCost < best.totalCost ? current : best
        );
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'In Stock': return 'text-green-600 dark:text-green-400';
            case 'Limited Stock': return 'text-yellow-600 dark:text-yellow-400';
            case 'Out of Stock': return 'text-red-600 dark:text-red-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <button onClick={onBack} className="mb-4 sm:mb-6 text-sm text-brand-primary hover:underline flex items-center">
                    &larr; Back to Dashboard
                </button>

                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <ChartBarIcon className="w-8 h-8 text-brand-secondary" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Price Comparison Tool</h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Compare prices across multiple retailers to find the best deals</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all"
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                        <SearchIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No products found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredProducts.map((product) => {
                            const bestDeal = getBestDeal(product.merchants);
                            const maxSavings = product.highestPrice - product.lowestPrice;

                            return (
                                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                                    {/* Product Header */}
                                    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">{product.productName}</h3>
                                                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">{product.category}</span>
                                            </div>
                                            <div className="text-center sm:text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Save up to</p>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(maxSavings)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Merchants Comparison */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Retailer</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Shipping</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Availability</th>
                                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Delivery</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {product.merchants.map((merchant, idx) => {
                                                    const isBestDeal = merchant.merchant === bestDeal.merchant;
                                                    return (
                                                        <tr key={idx} className={`${isBestDeal ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' : ''} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{merchant.merchant}</span>
                                                                    {isBestDeal && (
                                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                            Best Deal
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                                                                {formatCurrency(merchant.price)}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                                                {merchant.shipping === 0 ? 'FREE' : formatCurrency(merchant.shipping)}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                                {formatCurrency(merchant.totalCost)}
                                                            </td>
                                                            <td className={`px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell ${getAvailabilityColor(merchant.availability)}`}>
                                                                {merchant.availability}
                                                            </td>
                                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                                {merchant.estimatedDelivery}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">How it works</h3>
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                Our price comparison tool aggregates real-time pricing data from major retailers. 
                                The "Best Deal" badge highlights the lowest total cost including shipping. 
                                Prices are updated regularly to ensure accuracy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PriceComparisonView;
