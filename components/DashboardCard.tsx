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
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {prefix}
                            {typeof value === 'number' ? countUpValue.toLocaleString() : value}
                            {suffix}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${colorClass}`}>
                        {icon}
                    </div>
                </>
            )}
        </>
    );
    
    const baseClasses = "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between";
    const interactiveClasses = "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer";

    if (isClickable) {
        return (
            <button onClick={onClick} className={`${baseClasses} ${interactiveClasses} text-left`}>
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