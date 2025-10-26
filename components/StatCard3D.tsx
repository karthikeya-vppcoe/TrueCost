import React, { useState, useRef, useEffect } from 'react';

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

const StatCard3D: React.FC<StatCard3DProps> = ({
    title,
    value,
    icon,
    trend,
    colorClass = 'from-blue-500 to-purple-600',
    onClick
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={onClick}
            className={`
                relative group
                ${onClick ? 'cursor-pointer' : ''}
                transition-all duration-300 ease-out
                animate-scale-in
            `}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
        >
            {/* Card Inner */}
            <div
                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.2s ease-out'
                }}
            >
                {/* Gradient Background */}
                <div className={`bg-gradient-to-br ${colorClass} p-6`}>
                    {/* Animated Circles Background */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full animate-pulse-slow" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full animate-float" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Icon and Title */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
                                {title}
                            </div>
                            <div className={`
                                transform transition-transform duration-300
                                ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}
                            `}>
                                {icon}
                            </div>
                        </div>

                        {/* Value */}
                        <div className="text-white">
                            <div className="text-3xl sm:text-4xl font-bold mb-2 animate-slide-in-left">
                                {value}
                            </div>
                            
                            {/* Trend Indicator */}
                            {trend && (
                                <div className="flex items-center space-x-2">
                                    <span className={`
                                        text-xs px-2 py-1 rounded-full font-medium
                                        ${trend.isPositive !== false 
                                            ? 'bg-green-500/30 text-green-100' 
                                            : 'bg-red-500/30 text-red-100'
                                        }
                                    `}>
                                        {trend.isPositive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
                                    </span>
                                    <span className="text-xs text-white/70">
                                        {trend.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shine Effect */}
                    <div 
                        className={`
                            absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                            transform -translate-x-full transition-transform duration-700
                            ${isHovered ? 'translate-x-full' : ''}
                        `}
                        style={{
                            transform: `translateZ(20px)`
                        }}
                    />
                </div>

                {/* 3D Border Glow */}
                <div 
                    className={`
                        absolute inset-0 rounded-2xl transition-opacity duration-300
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{
                        boxShadow: '0 0 40px rgba(79, 70, 229, 0.6)',
                        transform: 'translateZ(-1px)'
                    }}
                />
            </div>

            {/* Click Hint */}
            {onClick && (
                <div className={`
                    absolute -bottom-2 left-1/2 transform -translate-x-1/2
                    text-xs text-gray-500 dark:text-gray-400
                    transition-opacity duration-300
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                `}>
                    Click to view details
                </div>
            )}
        </div>
    );
};

export default StatCard3D;
