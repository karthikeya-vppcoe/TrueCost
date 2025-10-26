import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters.ts';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    target: number;
    reward: string;
}

interface RewardsAchievementsProps {
    totalSavings: number;
    checkoutCount: number;
}

const RewardsAchievements: React.FC<RewardsAchievementsProps> = ({ totalSavings, checkoutCount }) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    const achievements: Achievement[] = [
        {
            id: '1',
            title: 'First Steps',
            description: 'Complete your first checkout',
            icon: '🎯',
            unlocked: checkoutCount >= 1,
            progress: Math.min(checkoutCount, 1),
            target: 1,
            reward: '10 points'
        },
        {
            id: '2',
            title: 'Smart Shopper',
            description: 'Save $50 in total',
            icon: '💰',
            unlocked: totalSavings >= 50,
            progress: Math.min(totalSavings, 50),
            target: 50,
            reward: '25 points'
        },
        {
            id: '3',
            title: 'Bargain Hunter',
            description: 'Save $100 in total',
            icon: '🏆',
            unlocked: totalSavings >= 100,
            progress: Math.min(totalSavings, 100),
            target: 100,
            reward: '50 points'
        },
        {
            id: '4',
            title: 'Shopping Streak',
            description: 'Complete 10 checkouts',
            icon: '🔥',
            unlocked: checkoutCount >= 10,
            progress: Math.min(checkoutCount, 10),
            target: 10,
            reward: '30 points'
        },
        {
            id: '5',
            title: 'Savings Master',
            description: 'Save $250 in total',
            icon: '👑',
            unlocked: totalSavings >= 250,
            progress: Math.min(totalSavings, 250),
            target: 250,
            reward: '100 points'
        },
        {
            id: '6',
            title: 'Elite Saver',
            description: 'Save $500 in total',
            icon: '💎',
            unlocked: totalSavings >= 500,
            progress: Math.min(totalSavings, 500),
            target: 500,
            reward: '200 points'
        }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalPoints = achievements
        .filter(a => a.unlocked)
        .reduce((sum, a) => sum + parseInt(a.reward.split(' ')[0]), 0);

    useEffect(() => {
        // Trigger confetti when new achievement unlocked
        const recentlyUnlocked = achievements.find(a => a.unlocked && a.progress === a.target);
        if (recentlyUnlocked) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }, [totalSavings, checkoutCount]);

    const handleAchievementClick = (achievement: Achievement) => {
        setSelectedAchievement(achievement);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                animationDelay: `${Math.random() * 0.5}s`,
                                animationDuration: `${2 + Math.random()}s`
                            }}
                        >
                            <div 
                                className="text-2xl"
                                style={{
                                    transform: `rotate(${Math.random() * 360}deg)`
                                }}
                            >
                                {['🎉', '⭐', '✨', '🎊', '💫'][Math.floor(Math.random() * 5)]}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="text-3xl animate-bounce-slow">🏆</div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Achievements & Rewards
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Unlock rewards as you save more
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-brand-secondary">{totalPoints}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Points</div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="text-sm font-bold text-brand-primary">
                        {unlockedCount} / {achievements.length}
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-1000 ease-out animate-pulse-slow"
                        style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        onClick={() => handleAchievementClick(achievement)}
                        className={`
                            relative group cursor-pointer
                            bg-gradient-to-br ${achievement.unlocked 
                                ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30' 
                                : 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'
                            }
                            rounded-xl p-4 border-2 transition-all duration-300
                            ${achievement.unlocked 
                                ? 'border-green-400 dark:border-green-600' 
                                : 'border-gray-300 dark:border-gray-600'
                            }
                            hover:scale-105 hover:shadow-xl hover:-translate-y-1
                            transform-gpu perspective-1000
                        `}
                        style={{
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {/* 3D Glow Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 to-brand-secondary/0 group-hover:from-brand-primary/10 group-hover:to-brand-secondary/10 rounded-xl transition-all duration-300" />
                        
                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`text-4xl transform transition-transform duration-300 ${achievement.unlocked ? 'animate-bounce-slow' : 'grayscale'}`}>
                                    {achievement.icon}
                                </div>
                                {achievement.unlocked && (
                                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                        ✓ Unlocked
                                    </div>
                                )}
                            </div>
                            
                            <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {achievement.title}
                            </h4>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                {achievement.description}
                            </p>

                            {/* Progress Bar */}
                            {!achievement.unlocked && (
                                <div>
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        <span>Progress</span>
                                        <span>
                                            {achievement.id === '2' || achievement.id === '3' || achievement.id === '5' || achievement.id === '6'
                                                ? formatCurrency(achievement.progress)
                                                : achievement.progress
                                            } / 
                                            {achievement.id === '2' || achievement.id === '3' || achievement.id === '5' || achievement.id === '6'
                                                ? formatCurrency(achievement.target)
                                                : achievement.target
                                            }
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-500"
                                            style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Reward Badge */}
                            <div className={`mt-3 text-center text-xs font-bold ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                🎁 {achievement.reward}
                            </div>
                        </div>

                        {/* Shimmer Effect for Locked Achievements */}
                        {!achievement.unlocked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        )}
                    </div>
                ))}
            </div>

            {/* Achievement Detail Modal (Simple) */}
            {selectedAchievement && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                    onClick={() => setSelectedAchievement(null)}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-slide-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4 animate-bounce-slow">{selectedAchievement.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedAchievement.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {selectedAchievement.description}
                            </p>
                            {selectedAchievement.unlocked ? (
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-bold">
                                    ✨ Achievement Unlocked! ✨
                                </div>
                            ) : (
                                <div className="text-gray-600 dark:text-gray-400">
                                    <div className="mb-2">
                                        Keep going! You're {Math.round((selectedAchievement.progress / selectedAchievement.target) * 100)}% there
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Reward: {selectedAchievement.reward}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedAchievement(null)}
                            className="mt-6 w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 rounded-lg transition-all duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardsAchievements;
