import React, { useState, useEffect } from 'react';
import { Subscription } from '../types.ts';
import { fetchSubscriptions } from '../services/api.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';
import DataTable from '../components/DataTable.tsx';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import { ReceiptIcon } from '../components/Icons.tsx';

interface SubscriptionsViewProps {
    onBack: () => void;
}

const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ onBack }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const subs = await fetchSubscriptions();
                setSubscriptions(subs);
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const totalMonthlyCost = subscriptions
        .filter(s => s.cycle === 'monthly')
        .reduce((acc, sub) => acc + sub.amount, 0);

    const columns = [
        { header: 'Subscription', accessor: 'name' as keyof Subscription },
        { header: 'Amount', accessor: 'amount' as keyof Subscription, render: (item: Subscription) => `${formatCurrency(item.amount)} / ${item.cycle === 'monthly' ? 'mo' : 'yr'}`},
        { header: 'Next Payment', accessor: 'nextPaymentDate' as keyof Subscription, render: (item: Subscription) => formatDate(item.nextPaymentDate) },
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <button onClick={onBack} className="mb-6 text-sm text-brand-primary hover:underline">
                    &larr; Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscription Tracker</h1>
                    <div className="mt-4 md:mt-0 text-center md:text-right bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Monthly Recurring</p>
                        <p className="text-2xl font-bold text-brand-primary">{formatCurrency(totalMonthlyCost)}</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <SkeletonLoader className="h-8 w-1/3 mb-4" />
                        <SkeletonLoader className="h-64 w-full" />
                    </div>
                ) : (
                    <DataTable 
                        title="Active Subscriptions" 
                        columns={columns} 
                        data={subscriptions} 
                    />
                )}
            </div>
        </main>
    );
};

export default SubscriptionsView;