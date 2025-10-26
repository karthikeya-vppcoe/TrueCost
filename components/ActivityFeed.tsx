import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { ActivityLogItem, ActivityType } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import { CheckCircleIcon, WarningIcon, XCircleIcon, InformationCircleIcon } from './Icons.tsx';

interface ActivityFeedProps {
  activities: ActivityLogItem[];
}

const activityStyles: { [key in ActivityType]: { icon: React.ReactNode; color: string; bg: string } } = {
  [ActivityType.SUCCESS]: { 
    icon: <CheckCircleIcon className="w-5 h-5" />, 
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30'
  },
  [ActivityType.RISK]: { 
    icon: <WarningIcon className="w-5 h-5" />, 
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  [ActivityType.ERROR]: { 
    icon: <XCircleIcon className="w-5 h-5" />, 
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30'
  },
  [ActivityType.INFO]: { 
    icon: <InformationCircleIcon className="w-5 h-5" />, 
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30'
  },
};

const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-[24rem] flex flex-col animate-fade-in">
      <div className="flex items-center space-x-2 mb-4 flex-shrink-0">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></div>
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Live Activity Feed</h3>
      </div>
      <div className="overflow-y-auto pr-2 -mr-2 space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`
              flex items-start space-x-3 p-3 rounded-lg
              transition-all duration-300 hover:scale-[1.02] hover:shadow-md
              border border-gray-200 dark:border-gray-600
              animate-slide-in-left
              ${activityStyles[activity.type].bg}
            `}
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div className={`mt-0.5 ${activityStyles[activity.type].color} flex-shrink-0`}>
              {activityStyles[activity.type].icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{activity.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatTimeAgo(activity.timestamp)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;