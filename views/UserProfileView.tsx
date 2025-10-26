import React, { useState, useEffect } from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { User, UserSavings, UserCheckoutActivity, DetailedCheckout } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import { fetchUserData, fetchCheckoutDetail } from '../services/api.ts';
// FIX: Add file extension to import to fix module resolution error.
import DashboardCard from '../components/DashboardCard.tsx';
// FIX: Add file extension to import to fix module resolution error.
import DataTable from '../components/DataTable.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { PiggyBankIcon, WarningIcon } from '../components/Icons.tsx';
// FIX: Add file extension to import to fix module resolution error.
import useFormValidation from '../hooks/useFormValidation.ts';
// FIX: Add file extension to import to fix module resolution error.
import { useNotification } from '../context/NotificationContext.tsx';
// FIX: Add file extension to import to fix module resolution error.
import CheckoutDetailModal from '../components/CheckoutDetailModal.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { formatCurrency, formatDate } from '../utils/formatters.ts';
// FIX: Add file extension to import to fix module resolution error.
import SkeletonLoader from '../components/SkeletonLoader.tsx';

interface UserProfileViewProps {
  user: User;
  onBack: () => void;
  onUpdate: (updatedUser: Partial<User>) => void;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onBack, onUpdate }) => {
    const [savings, setSavings] = useState<UserSavings | null>(null);
    const [activity, setActivity] = useState<UserCheckoutActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const { addNotification } = useNotification();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCheckout, setSelectedCheckout] = useState<DetailedCheckout | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const validate = (values: { name: string; email: string; }) => {
        const errors: { name?: string; email?: string; } = {};
        if (!values.name) {
            errors.name = 'Full name is required.';
        }
        if (!values.email) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Email address is invalid.';
        }
        return errors;
    };

    const { values, errors, isFormValid, handleChange, setValues } = useFormValidation(
      { name: user.name, email: user.email }, 
      validate
    );

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const { savings, activity } = await fetchUserData();
                setSavings(savings);
                setActivity(activity);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSave = () => {
        if(isFormValid) {
            onUpdate(values);
            addNotification('Profile updated successfully!', 'success');
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setValues({ name: user.name, email: user.email });
        setIsEditing(false);
    }
    
     const handleRowClick = async (item: UserCheckoutActivity) => {
        setIsModalOpen(true);
        setIsModalLoading(true);
        try {
            const details = await fetchCheckoutDetail(item.id);
            setSelectedCheckout(details);
        } catch (error) {
            console.error("Failed to fetch checkout details:", error);
        } finally {
            setIsModalLoading(false);
        }
    };
    
    const activityColumns = [
        { header: 'Date', accessor: 'date' as keyof UserCheckoutActivity, render: (item: UserCheckoutActivity) => formatDate(item.date) },
        { header: 'Merchant', accessor: 'merchant' as keyof UserCheckoutActivity },
        { header: 'Items', accessor: 'items' as keyof UserCheckoutActivity },
        { header: 'Savings', accessor: 'savings' as keyof UserCheckoutActivity, render: (item: UserCheckoutActivity) => formatCurrency(item.savings) },
    ];

  return (
    <>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                 <button onClick={onBack} className="mb-6 text-sm text-brand-primary hover:underline">
                    &larr; Back to Dashboard
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8">
                        <img 
                            className="h-24 w-24 rounded-full ring-4 ring-brand-secondary" 
                            src={`https://i.pravatar.cc/150?u=${user.email}`} 
                            alt="User avatar" 
                        />
                        {!isEditing ? (
                            <div className="text-center md:text-left flex-grow">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                <p className="text-md text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        ) : (
                             <div className="flex-grow space-y-4">
                                <div>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={values.name} 
                                        onChange={handleChange}
                                        className={`w-full md:w-2/3 px-3 py-2 text-2xl font-bold bg-gray-100 dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>
                                 <div>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={values.email} 
                                        onChange={handleChange}
                                        className={`w-full md:w-2/3 px-3 py-2 text-md bg-gray-100 dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                        )}
                        <div>
                             {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-brand-secondary text-white font-semibold rounded-lg shadow-sm hover:bg-green-700">
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button onClick={handleSave} disabled={!isFormValid} className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50">
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-t border-gray-200 dark:border-gray-700 pt-6">Account Overview</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <DashboardCard 
                            title="Total Savings"
                            value={savings?.totalSavings || 0}
                            prefix="$"
                            icon={<PiggyBankIcon className="h-6 w-6 text-white" />}
                            colorClass="bg-green-500"
                            isLoading={isLoading}
                        />
                        <DashboardCard 
                            title="Average Savings / Checkout"
                            value={savings?.averageSavings || 0}
                            prefix="$"
                            icon={<PiggyBankIcon className="h-6 w-6 text-white" />}
                            colorClass="bg-blue-500"
                            isLoading={isLoading}
                        />
                        <DashboardCard 
                            title="Potential Risks Detected"
                            value={savings?.risksDetected || 0}
                            icon={<WarningIcon className="h-6 w-6 text-white" />}
                            colorClass="bg-yellow-500"
                            isLoading={isLoading}
                        />
                    </div>
                    
                    {isLoading ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                            <SkeletonLoader className="h-8 w-1/3 mb-4" />
                            <SkeletonLoader className="h-64 w-full" />
                        </div>
                    ) : (
                        <DataTable 
                            title="Recent Checkout Activity" 
                            columns={activityColumns} 
                            data={activity} 
                            onRowClick={handleRowClick}
                        />
                    )}

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

export default UserProfileView;