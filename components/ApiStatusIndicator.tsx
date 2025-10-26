

import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { ApiHealth, ApiStatusEnum } from '../types.ts';

const statusStyles: { [key in ApiStatusEnum]: { dot: string; text: string } } = {
  [ApiStatusEnum.OPERATIONAL]: { dot: 'bg-green-500', text: 'text-green-500' },
  [ApiStatusEnum.DEGRADED]: { dot: 'bg-yellow-500', text: 'text-yellow-500' },
  [ApiStatusEnum.DOWN]: { dot: 'bg-red-500', text: 'text-red-500' },
};

const ApiStatusIndicator: React.FC<{ status: ApiHealth[] }> = ({ status }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Partner API Health</h3>
      <ul className="space-y-4">
        {status.map((api) => (
          <li key={api.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-3 ${statusStyles[api.status].dot}`}></span>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{api.name}</p>
            </div>
            <div className="flex items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mr-4">
                {api.status !== ApiStatusEnum.DOWN ? `${api.responseTime}ms` : 'N/A'}
              </p>
              <p className={`text-sm font-semibold ${statusStyles[api.status].text}`}>{api.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiStatusIndicator;