import React, { useState } from 'react';

// FIX: A modal component for editing the savings goal is created, enabling users to set and update their financial targets.
interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGoal: number) => void;
  currentGoal: number;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onSave, currentGoal }) => {
    const [goal, setGoal] = useState(currentGoal);

    if (!isOpen) return null;

    const handleSave = () => {
        if (goal > 0) {
            onSave(goal);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Savings Goal</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Set a new monthly savings goal.</p>
                <div className="mt-4">
                    <label htmlFor="goal" className="sr-only">Goal Amount</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            name="goal"
                            id="goal"
                            className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                            value={goal}
                            onChange={(e) => setGoal(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditGoalModal;
