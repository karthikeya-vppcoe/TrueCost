import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { DetailedCheckout } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import { XCircleIcon } from './Icons.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { formatCurrency, formatDate } from '../utils/formatters.ts';
// FIX: Add file extension to import to fix module resolution error.
import SkeletonLoader from './SkeletonLoader.tsx';

interface CheckoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkout: DetailedCheckout | null;
  isLoading: boolean;
}

const CheckoutDetailModal: React.FC<CheckoutDetailModalProps> = ({ isOpen, onClose, checkout, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 my-8 transform transition-transform duration-300 ease-out scale-95 animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            {isLoading || !checkout ? (
                 <SkeletonLoader className="h-6 w-1/2" />
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {checkout.merchant} - {formatDate(checkout.date)}
                    </p>
                </div>
            )}
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            {isLoading || !checkout ? (
                <div className="space-y-4">
                    <SkeletonLoader className="h-8 w-1/3" />
                    <SkeletonLoader className="h-24 w-full" />
                    <SkeletonLoader className="h-8 w-1/3" />
                    <SkeletonLoader className="h-16 w-full" />
                </div>
            ) : (
                <>
                    {/* Items Breakdown */}
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Items Purchased ({checkout.items.length})</h3>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 mb-6">
                        {checkout.items.map(item => (
                            <li key={item.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</p>
                            </li>
                        ))}
                    </ul>

                    {/* Cost Summary */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                         <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>{formatCurrency(checkout.subtotal)}</span></div>
                         <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Taxes</span><span>{formatCurrency(checkout.tax)}</span></div>
                         <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300"><span>Shipping</span><span>{formatCurrency(checkout.shipping)}</span></div>
                         <div className="flex justify-between font-bold text-gray-900 dark:text-white"><span>Total Paid</span><span>{formatCurrency(checkout.total)}</span></div>
                    </div>

                    {/* Savings Breakdown */}
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Savings Breakdown</h3>
                     <ul className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
                        {checkout.savingsBreakdown.map((saving, index) => (
                            <li key={index} className="flex justify-between items-center text-sm">
                                <span className="text-green-800 dark:text-green-300">{saving.description}</span>
                                <span className="font-bold text-green-600 dark:text-green-400">-{formatCurrency(saving.amount)}</span>
                            </li>
                        ))}
                         <li className="flex justify-between items-center font-bold text-lg border-t border-green-200 dark:border-green-700 pt-2 mt-2">
                             <span className="text-green-700 dark:text-green-300">Total Saved</span>
                             <span className="text-green-600 dark:text-green-400">-{formatCurrency(checkout.savings)}</span>
                         </li>
                    </ul>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailModal;