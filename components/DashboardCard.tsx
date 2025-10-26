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
                    <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${colorClass} transform transition-all duration-300 ${isClickable ? 'group-hover:scale-110 group-hover:rotate-6' : ''}`}>
                        {icon}
                        {/* Animated background circles */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden opacity-30">
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full animate-pulse-slow" />
                            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white rounded-full animate-float" />
                        </div>
                    </div>
                </>
            )}
        </>
    );
    
    const baseClasses = "relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between animate-fade-in overflow-hidden";
    const interactiveClasses = "transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-primary dark:hover:border-brand-primary cursor-pointer group";

    if (isClickable) {
        return (
            <button onClick={onClick} className={`${baseClasses} ${interactiveClasses} text-left w-full`}>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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