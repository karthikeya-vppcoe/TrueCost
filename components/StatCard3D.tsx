import React from 'react';

interface StatCard3DProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    colorClass?: string;
    onClick?: () => void;
}

// Simplified card – no 3D tilt or heavy animations for a clean fintech look.
const StatCard3D: React.FC<StatCard3DProps> = ({
    title,
    value,
    icon,
    trend,
    colorClass = 'bg-teal-600',
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                relative overflow-hidden rounded-xl p-5
                ${colorClass}
                ${onClick ? 'cursor-pointer hover:brightness-105 transition-all duration-150' : ''}
                animate-fade-in
            `}
        >
            {/* Content */}
            <div className="flex items-start justify-between mb-3">
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</p>
                <div className="text-white/90">{icon}</div>
            </div>

            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{value}</div>

            {trend && (
                <div className="flex items-center space-x-2">
                    <span className={`
                        text-xs px-2 py-0.5 rounded-full font-medium
                        ${trend.isPositive !== false
                            ? 'bg-white/20 text-white'
                            : 'bg-white/20 text-white'
                        }
                    `}>
                        {trend.isPositive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                    <span className="text-xs text-white/70">{trend.label}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard3D;
