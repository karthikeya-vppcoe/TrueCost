
import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { ApiHealth, ApiStatusEnum } from '../types.ts';

const statusStyles: { [key in ApiStatusEnum]: { dot: string; text: string; bg: string } } = {
  [ApiStatusEnum.OPERATIONAL]: { 
    dot: 'bg-green-500', 
    text: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20'
  },
  [ApiStatusEnum.DEGRADED]: { 
    dot: 'bg-yellow-500', 
    text: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  [ApiStatusEnum.DOWN]: { 
    dot: 'bg-red-500', 
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20'
  },
};

const ApiStatusIndicator: React.FC<{ status: ApiHealth[] }> = ({ status }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <div className="animate-pulse-slow">
          <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Partner API Health</h3>
      </div>
      <ul className="space-y-3">
        {status.map((api, index) => (
          <li 
            key={api.name} 
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${statusStyles[api.status].bg}
              border border-gray-200 dark:border-gray-600
              transition-all duration-300 hover:scale-[1.02] hover:shadow-md
              animate-slide-in-left
            `}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className={`block h-3 w-3 rounded-full ${statusStyles[api.status].dot} animate-pulse-slow`}></span>
                {api.status === ApiStatusEnum.OPERATIONAL && (
                  <span className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-75"></span>
                )}
                {api.status === ApiStatusEnum.DOWN && (
                  <span className="absolute inset-0 h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75"></span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{api.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {api.status !== ApiStatusEnum.DOWN ? `${api.responseTime}ms` : 'N/A'}
                </p>
              </div>
              <div className={`
                px-3 py-1 rounded-full text-xs font-bold
                ${statusStyles[api.status].text}
                border-2 ${api.status === ApiStatusEnum.OPERATIONAL ? 'border-green-300 dark:border-green-600' : 
                           api.status === ApiStatusEnum.DEGRADED ? 'border-yellow-300 dark:border-yellow-600' : 
                           'border-red-300 dark:border-red-600'}
                transition-all duration-300
              `}>
                {api.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiStatusIndicator;