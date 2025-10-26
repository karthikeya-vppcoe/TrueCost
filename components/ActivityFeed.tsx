import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { ActivityLogItem, ActivityType } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import { CheckCircleIcon, WarningIcon, XCircleIcon, InformationCircleIcon } from './Icons.tsx';

interface ActivityFeedProps {
  activities: ActivityLogItem[];
}

const activityStyles: { [key in ActivityType]: { icon: React.ReactNode; color: string } } = {
  [ActivityType.SUCCESS]: { icon: <CheckCircleIcon className="w-5 h-5" />, color: 'text-green-500' },
  [ActivityType.RISK]: { icon: <WarningIcon className="w-5 h-5" />, color: 'text-yellow-500' },
  [ActivityType.ERROR]: { icon: <XCircleIcon className="w-5 h-5" />, color: 'text-red-500' },
  [ActivityType.INFO]: { icon: <InformationCircleIcon className="w-5 h-5" />, color: 'text-blue-500' },
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-[24rem] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex-shrink-0">Live Activity Feed</h3>
      <div className="overflow-y-auto pr-2 -mr-2">
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3 animate-fade-in">
              <div className={`mt-1 ${activityStyles[activity.type].color}`}>
                {activityStyles[activity.type].icon}
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{activity.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityFeed;