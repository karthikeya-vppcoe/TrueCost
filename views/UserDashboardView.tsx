import React, { useState, useEffect } from 'react';
import { User, UserSavings, UserCheckoutActivity, UserView, DetailedCheckout } from '../types.ts';
import { fetchUserData, fetchCheckoutDetail, fetchSubscriptions } from '../services/api.ts';
import DashboardCard from '../components/DashboardCard.tsx';
import DataTable from '../components/DataTable.tsx';
import UserSavingsChart from '../components/UserSavingsChart.tsx';
import SavingsGoal from '../components/SavingsGoal.tsx';
import BudgetInsights from '../components/BudgetInsights.tsx';
import RewardsAchievements from '../components/RewardsAchievements.tsx';
import SavingsMilestones from '../components/SavingsMilestones.tsx';
import { PiggyBankIcon, WarningIcon, ReceiptIcon, ChartBarIcon } from '../components/Icons.tsx';
import { formatCurrency, formatDate } from '../utils/formatters.ts';
import SkeletonLoader from '../components/SkeletonLoader.tsx';
import CheckoutDetailModal from '../components/CheckoutDetailModal.tsx';
import { useNotification } from '../context/NotificationContext.tsx';

interface UserDashboardViewProps {
  user: User;
  onNavigate: (view: UserView) => void;
}

const UserDashboardView: React.FC<UserDashboardViewProps> = ({ user, onNavigate }) => {
    const [savings, setSavings] = useState<UserSavings | null>(null);
    const [activity, setActivity] = useState<UserCheckoutActivity[]>([]);
    const [subscriptionsCount, setSubscriptionsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [savingsGoal, setSavingsGoal] = useState(250);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCheckout, setSelectedCheckout] = useState<DetailedCheckout | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const { addNotification } = useNotification();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [userData, subs] = await Promise.all([
                    fetchUserData(),
                    fetchSubscriptions()
                ]);
                setSavings(userData.savings);
                setActivity(userData.activity);
                setSubscriptionsCount(subs.length);
                if (userData.savings.savingsGoal) {
                    setSavingsGoal(userData.savings.savingsGoal);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                addNotification("Could not load dashboard data.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [addNotification]);

    const handleUpdateGoal = (newGoal: number) => {
        setSavingsGoal(newGoal);
        addNotification("Savings goal updated!", "success");
    };

    const handleRowClick = async (item: UserCheckoutActivity) => {
        setIsModalOpen(true);
        setIsModalLoading(true);
        try {
            const details = await fetchCheckoutDetail(item.id);
            setSelectedCheckout(details);
        } catch (error) {
            console.error("Failed to fetch checkout details:", error);
            addNotification("Could not load checkout details.", "error");
        } finally {
            setIsModalLoading(false);
        }
    };

    const activityColumns = [
        { header: 'Date', accessor: 'date' as keyof UserCheckoutActivity, render: (item: UserCheckoutActivity) => formatDate(item.date) },
        { header: 'Merchant', accessor: 'merchant' as keyof UserCheckoutActivity },
        { header: 'Items', accessor: 'items' as keyof UserCheckoutActivity },
        { header: 'Savings', accessor: 'savings' as keyof UserCheckoutActivity, render: (item: UserCheckoutActivity) => <span className="font-semibold text-teal-600 dark:text-teal-400">{formatCurrency(item.savings)}</span> },
    ];

    const quickNavItems: { label: string; sub: string; view: UserView; icon: React.ReactNode }[] = [
        {
            label: 'Price Comparison',
            sub: 'Compare across retailers',
            view: 'priceComparison',
            icon: <ChartBarIcon className="w-5 h-5" />,
        },
        {
            label: 'Analytics',
            sub: 'Spending trends & insights',
            view: 'analytics',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            label: 'Shopping List',
            sub: 'Track prices & get alerts',
            view: 'shoppingList',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 animate-fade-in overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Welcome back, {user.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Here's your savings summary.</p>

                    {/* Hidden Fee Banner */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Hidden Fee Detected at Checkout</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400">Platform convenience fee of ₹49 was added on your last order. TrueCost saved you from this.</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-full whitespace-nowrap">Saved ₹49</span>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        <div className="col-span-2 xl:col-span-1">
                            <SavingsGoal
                                currentAmount={savings?.totalSavings || 0}
                                goalAmount={savingsGoal}
                                onUpdateGoal={handleUpdateGoal}
                                isLoading={isLoading}
                            />
                        </div>
                        <DashboardCard
                            title="Total Savings"
                            value={savings?.totalSavings || 0}
                            prefix="$"
                            icon={<PiggyBankIcon className="h-5 w-5" />}
                            colorClass="bg-teal-600"
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Risks Detected"
                            value={savings?.risksDetected || 0}
                            icon={<WarningIcon className="h-5 w-5" />}
                            colorClass="bg-amber-500"
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            title="Subscriptions"
                            value={subscriptionsCount}
                            icon={<ReceiptIcon className="h-5 w-5" />}
                            colorClass="bg-indigo-500"
                            isLoading={isLoading}
                            onClick={() => onNavigate('subscriptions')}
                        />
                    </div>

                    {/* Quick Navigation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {quickNavItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                className="flex items-center justify-between w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors duration-150 text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
                                    </div>
                                </div>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </div>

                    {/* Milestones & Rewards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {isLoading ? (
                            <>
                                <SkeletonLoader className="h-72 w-full rounded-xl" />
                                <SkeletonLoader className="h-72 w-full rounded-xl" />
                            </>
                        ) : (
                            <>
                                <SavingsMilestones currentSavings={savings?.totalSavings || 0} />
                                <RewardsAchievements
                                    totalSavings={savings?.totalSavings || 0}
                                    checkoutCount={activity.length}
                                />
                            </>
                        )}
                    </div>

                    {/* Chart + Budget Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                        <div className="lg:col-span-3">
                            {isLoading ? <SkeletonLoader className="h-72 w-full rounded-xl" /> : <UserSavingsChart data={activity} />}
                        </div>
                        <div className="lg:col-span-2">
                            {isLoading ? (
                                <SkeletonLoader className="h-72 w-full rounded-xl" />
                            ) : (
                                <BudgetInsights
                                    totalSpent={320.45}
                                    monthlyBudget={500}
                                    topCategories={[
                                        { name: 'Groceries', amount: 145.30, color: '#0D9488' },
                                        { name: 'Electronics', amount: 85.50, color: '#6366F1' },
                                        { name: 'Household', amount: 54.65, color: '#F59E0B' },
                                        { name: 'Personal Care', amount: 35.00, color: '#8B5CF6' }
                                    ]}
                                />
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mb-4">
                        {isLoading ? <SkeletonLoader className="h-72 w-full rounded-xl" /> :
                            <DataTable
                                title="Recent Activity"
                                columns={activityColumns}
                                data={activity.slice(0, 7)}
                                onRowClick={handleRowClick}
                            />
                        }
                    </div>
                </div>
            </main>
            <CheckoutDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                checkout={selectedCheckout}
                isLoading={isModalLoading}
            />
        </>
    );
};

export default UserDashboardView;
