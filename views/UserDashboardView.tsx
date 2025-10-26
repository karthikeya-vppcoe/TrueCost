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
import StatCard3D from '../components/StatCard3D.tsx';
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
        // In a real app, you would also make an API call to save this.
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
        { header: 'Savings', accessor: 'savings' as keyof UserCheckoutActivity, render: (item: UserCheckoutActivity) => <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(item.savings)}</span> },
    ];

    return (
        <>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">Welcome back, {user.name}!</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="sm:col-span-2 xl:col-span-1">
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
                            icon={<PiggyBankIcon className="h-6 w-6" />}
                            colorClass="bg-gradient-to-br from-green-400 to-green-600"
                            isLoading={isLoading}
                        />
                        <DashboardCard 
                            title="Potential Risks Detected"
                            value={savings?.risksDetected || 0}
                            icon={<WarningIcon className="h-6 w-6" />}
                            colorClass="bg-gradient-to-br from-yellow-400 to-yellow-600"
                            isLoading={isLoading}
                        />
                        <DashboardCard 
                            title="Active Subscriptions"
                            value={subscriptionsCount}
                            icon={<ReceiptIcon className="h-6 w-6" />}
                            colorClass="bg-gradient-to-br from-purple-400 to-purple-600"
                            isLoading={isLoading}
                            onClick={() => onNavigate('subscriptions')}
                        />
                    </div>

                    {/* Quick Access Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
                        <button 
                            onClick={() => onNavigate('priceComparison')}
                            className="w-full bg-gradient-to-r from-brand-secondary to-green-600 hover:from-green-600 hover:to-brand-secondary text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-lg animate-pulse-slow">
                                        <ChartBarIcon className="w-8 h-8" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg sm:text-xl font-bold mb-1">Price Comparison Tool</h3>
                                        <p className="text-sm sm:text-base text-white/90">Compare prices across retailers and find the best deals</p>
                                    </div>
                                </div>
                                <svg className="w-6 h-6 hidden sm:block transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        <button 
                            onClick={() => onNavigate('analytics')}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 p-3 rounded-lg animate-pulse-slow">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg sm:text-xl font-bold mb-1">Advanced Analytics</h3>
                                        <p className="text-sm sm:text-base text-white/90">Deep insights and AI-powered spending predictions</p>
                                    </div>
                                </div>
                                <svg className="w-6 h-6 hidden sm:block transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* New Features Section - Rewards & Milestones */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        {isLoading ? (
                            <>
                                <SkeletonLoader className="h-96 w-full rounded-xl" />
                                <SkeletonLoader className="h-96 w-full rounded-xl" />
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

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="lg:col-span-3">
                            {isLoading ? <SkeletonLoader className="h-80 sm:h-96 w-full rounded-xl" /> : <UserSavingsChart data={activity} />}
                        </div>
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                            {/* Budget Insights Component */}
                            {isLoading ? (
                                <SkeletonLoader className="h-96 w-full rounded-xl" />
                            ) : (
                                <BudgetInsights
                                    totalSpent={320.45}
                                    monthlyBudget={500}
                                    topCategories={[
                                        { name: 'Groceries', amount: 145.30, color: '#10B981' },
                                        { name: 'Electronics', amount: 85.50, color: '#3B82F6' },
                                        { name: 'Household', amount: 54.65, color: '#F59E0B' },
                                        { name: 'Personal Care', amount: 35.00, color: '#8B5CF6' }
                                    ]}
                                />
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="mb-4 sm:mb-6">
                        {isLoading ? <SkeletonLoader className="h-96 w-full rounded-xl" /> : 
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