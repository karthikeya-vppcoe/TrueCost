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
    const countUpValue = useCountUp(numericValue, 1200);

    const cardContent = (
        <>
            {isLoading ? (
                <div className="w-full">
                    <SkeletonLoader className="h-5 w-3/4 mb-3" />
                    <SkeletonLoader className="h-9 w-1/2" />
                </div>
            ) : (
                <>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 truncate">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {prefix}
                            {typeof value === 'number' ? countUpValue.toLocaleString() : value}
                            {suffix}
                        </p>
                    </div>
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${colorClass}`}>
                        {icon}
                    </div>
                </>
            )}
        </>
    );

    const baseClasses = "bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between animate-fade-in";
    const interactiveClasses = "transition-colors duration-150 hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer";

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