import React from 'react';
import SkeletonLoader from './SkeletonLoader.tsx';
import useCountUp from '../hooks/useCountUp.ts';

interface DashboardCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    isLoading: boolean;
    colorClass: string;
    prefix?: string;
    suffix?: string;
    onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, isLoading, colorClass, prefix = '', suffix = '', onClick }) => {
    const isClickable = !!onClick;
    const numericValue = typeof value === 'number' ? value : 0;
    const countUpValue = useCountUp(numericValue, 1500);

    const cardContent = (
        <>
            {isLoading ? (
                <div className="w-full">
                    <SkeletonLoader className="h-6 w-3/4 mb-2" />
                    <SkeletonLoader className="h-10 w-1/2" />
                </div>
            ) : (
                <>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {prefix}
                            {typeof value === 'number' ? countUpValue.toLocaleString() : value}
                            {suffix}
                        </p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${colorClass} transform transition-transform duration-300 ${isClickable ? 'group-hover:scale-110 group-hover:rotate-3' : ''}`}>
                        {icon}
                    </div>
                </>
            )}
        </>
    );
    
    const baseClasses = "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between animate-fade-in";
    const interactiveClasses = "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-primary dark:hover:border-brand-primary cursor-pointer group";

    if (isClickable) {
        return (
            <button onClick={onClick} className={`${baseClasses} ${interactiveClasses} text-left w-full`}>
                {cardContent}
            </button>
        );
    }

    return (
        <div className={baseClasses}>
            {cardContent}
        </div>
    );
};

export default DashboardCard;