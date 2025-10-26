import React, { useState } from 'react';
import EditGoalModal from './EditGoalModal.tsx';
import SkeletonLoader from './SkeletonLoader.tsx';
import { PiggyBankIcon } from './Icons.tsx';

interface SavingsGoalProps {
    currentAmount: number;
    goalAmount: number;
    onUpdateGoal: (newGoal: number) => void;
    isLoading: boolean;
}

const SavingsGoal: React.FC<SavingsGoalProps> = ({ currentAmount, goalAmount, onUpdateGoal, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const progress = Math.min((currentAmount / goalAmount) * 100, 100);

    const handleSave = (newGoal: number) => {
        onUpdateGoal(newGoal);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                {isLoading ? (
                    <div className="w-full">
                        <SkeletonLoader className="h-6 w-3/4 mb-4" />
                        <SkeletonLoader className="h-4 w-full mb-2" />
                        <SkeletonLoader className="h-8 w-1/2" />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Monthly Savings Goal</h4>
                             <button onClick={() => setIsModalOpen(true)} className="text-xs text-brand-primary hover:underline">Edit Goal</button>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                            <div
                                className="bg-brand-secondary h-4 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-bold text-gray-800 dark:text-white">${currentAmount.toFixed(2)}</span> / ${goalAmount.toFixed(2)}
                        </p>
                    </>
                )}
            </div>
            <EditGoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                currentGoal={goalAmount}
            />
        </>
    );
};

export default SavingsGoal;
