import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { useNotification } from '../context/NotificationContext.tsx';
// FIX: Add file extension to import to fix module resolution error.
import useFormValidation from '../hooks/useFormValidation.ts';
// FIX: Add file extension to import to fix module resolution error.
import { User } from '../types.ts';

interface SettingsViewProps {
    user: User;
    onUpdate: (updatedUser: Partial<User>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdate }) => {
    const { addNotification } = useNotification();
    
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

    const { values, errors, isFormValid, handleChange } = useFormValidation({
        name: user.name,
        email: user.email,
    }, validate);

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onUpdate(values);
            addNotification('Settings saved successfully!', 'success');
        }
    };
    
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSaveChanges} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
                    
                    <div className="space-y-8">
                        {/* Profile Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input 
                                      type="text" 
                                      id="name"
                                      name="name" 
                                      value={values.name}
                                      onChange={handleChange}
                                      className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm text-gray-900 dark:text-gray-100 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} 
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input 
                                      type="email" 
                                      id="email" 
                                      name="email"
                                      value={values.email}
                                      onChange={handleChange}
                                      className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm text-gray-900 dark:text-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} 
                                    />
                                     {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Notifications</h3>
                            <div className="space-y-4">
                                <label className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-secondary border-gray-300 rounded" defaultChecked />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Email notifications for API outages</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-brand-primary focus:ring-brand-secondary border-gray-300 rounded" />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Weekly performance summary</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit"
                                disabled={!isFormValid}
                                className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default SettingsView;