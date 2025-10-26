import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters.ts';

interface Milestone {
    id: string;
    amount: number;
    title: string;
    icon: string;
    color: string;
    reached: boolean;
}

interface SavingsMilestonesProps {
    currentSavings: number;
}

const SavingsMilestones: React.FC<SavingsMilestonesProps> = ({ currentSavings }) => {
    const [showCelebration, setShowCelebration] = useState(false);

    const milestones: Milestone[] = [
        {
            id: '1',
            amount: 25,
            title: 'First Steps',
            icon: '🌱',
            color: 'bg-green-500',
            reached: currentSavings >= 25
        },
        {
            id: '2',
            amount: 50,
            title: 'Getting Started',
            icon: '🚀',
            color: 'bg-blue-500',
            reached: currentSavings >= 50
        },
        {
            id: '3',
            amount: 100,
            title: 'Century Club',
            icon: '💯',
            color: 'bg-purple-500',
            reached: currentSavings >= 100
        },
        {
            id: '4',
            amount: 250,
            title: 'Quarter Master',
            icon: '⭐',
            color: 'bg-yellow-500',
            reached: currentSavings >= 250
        },
        {
            id: '5',
            amount: 500,
            title: 'Half Grand',
            icon: '🏆',
            color: 'bg-orange-500',
            reached: currentSavings >= 500
        },
        {
            id: '6',
            amount: 1000,
            title: 'Grand Master',
            icon: '👑',
            color: 'bg-red-500',
            reached: currentSavings >= 1000
        }
    ];

    const nextMilestone = milestones.find(m => !m.reached);
    const progressToNext = nextMilestone 
        ? Math.min((currentSavings / nextMilestone.amount) * 100, 100)
        : 100;

    const completedCount = milestones.filter(m => m.reached).length;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                        <span className="animate-float text-2xl">🎯</span>
                        <span>Savings Milestones</span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track your savings journey
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-brand-primary">
                        {completedCount}/{milestones.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                </div>
            </div>

            {/* Current Progress Card */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg p-4 mb-6 animate-slide-in-up">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Current Savings
                        </div>
                        <div className="text-3xl font-bold text-brand-primary">
                            {formatCurrency(currentSavings)}
                        </div>
                    </div>
                    {nextMilestone && (
                        <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Next Milestone
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                                <span>{nextMilestone.icon}</span>
                                <span>{formatCurrency(nextMilestone.amount)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar to Next Milestone */}
                {nextMilestone && (
                    <div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                            <span>{Math.round(progressToNext)}% Complete</span>
                            <span>{formatCurrency(nextMilestone.amount - currentSavings)} to go</span>
                        </div>
                        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressToNext}%` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/50 to-white/30 animate-shimmer" 
                                style={{ 
                                    backgroundSize: '200% 100%',
                                    width: `${progressToNext}%`
                                }}
                            />
                        </div>
                    </div>
                )}

                {completedCount === milestones.length && (
                    <div className="text-center text-green-600 dark:text-green-400 font-bold animate-bounce-slow">
                        🎉 All milestones completed! You're a savings champion! 🎉
                    </div>
                )}
            </div>

            {/* Milestones Timeline */}
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700" />
                
                {/* Progress Line */}
                <div 
                    className="absolute left-6 top-0 w-1 bg-gradient-to-b from-brand-primary to-brand-secondary transition-all duration-1000 ease-out"
                    style={{ 
                        height: `${(completedCount / milestones.length) * 100}%`
                    }}
                />

                {/* Milestone Items */}
                <div className="space-y-6">
                    {milestones.map((milestone, index) => (
                        <div
                            key={milestone.id}
                            className={`
                                relative pl-16 animate-slide-in-left
                                transition-all duration-300
                                ${milestone.reached ? 'opacity-100' : 'opacity-60'}
                            `}
                            style={{
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {/* Milestone Icon Circle */}
                            <div
                                className={`
                                    absolute left-0 w-12 h-12 rounded-full
                                    flex items-center justify-center
                                    ${milestone.reached 
                                        ? `${milestone.color} shadow-lg scale-110` 
                                        : 'bg-gray-300 dark:bg-gray-600'
                                    }
                                    transition-all duration-500
                                    ${milestone.reached ? 'animate-bounce-slow' : ''}
                                `}
                            >
                                <span className="text-2xl filter drop-shadow-md">
                                    {milestone.reached ? milestone.icon : '🔒'}
                                </span>
                                
                                {/* Ripple Effect for Reached Milestones */}
                                {milestone.reached && (
                                    <>
                                        <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                                        <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse-slow" />
                                    </>
                                )}
                            </div>

                            {/* Milestone Content */}
                            <div
                                className={`
                                    bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md
                                    ${milestone.reached 
                                        ? 'border-2 border-green-400 dark:border-green-600' 
                                        : 'border-2 border-gray-200 dark:border-gray-600'
                                    }
                                    hover:shadow-lg hover:scale-105 transition-all duration-300
                                    cursor-pointer group
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h4 className={`
                                                font-bold
                                                ${milestone.reached 
                                                    ? 'text-gray-900 dark:text-white' 
                                                    : 'text-gray-600 dark:text-gray-400'
                                                }
                                            `}>
                                                {milestone.title}
                                            </h4>
                                            {milestone.reached && (
                                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Save {formatCurrency(milestone.amount)}
                                        </div>
                                    </div>
                                    
                                    {/* Amount Badge */}
                                    <div className={`
                                        text-right ml-4
                                        ${milestone.reached ? 'animate-pulse-slow' : ''}
                                    `}>
                                        <div className={`
                                            text-lg font-bold
                                            ${milestone.reached 
                                                ? 'text-green-600 dark:text-green-400' 
                                                : 'text-gray-500 dark:text-gray-400'
                                            }
                                        `}>
                                            {formatCurrency(milestone.amount)}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar for Active Milestone */}
                                {nextMilestone && nextMilestone.id === milestone.id && (
                                    <div className="mt-3">
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${progressToNext}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Shine Effect on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SavingsMilestones;
