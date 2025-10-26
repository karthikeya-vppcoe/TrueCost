import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { LogoIcon } from '../components/Icons.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { UserRole } from '../types.ts';

interface AuthViewProps {
  onSelectRole: (role: UserRole) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onSelectRole }) => {
  return (
    // The `justify-center` class ensures the card is always centered horizontally, regardless of screen size.
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-brand-secondary to-green-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300">
            <LogoIcon className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Welcome to TrueCost
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Your smart shopping companion
          </p>
        </div>
        
        <div className="space-y-4 pt-4">
          <button
            onClick={() => onSelectRole('admin')}
            className="w-full py-4 px-6 font-semibold text-white bg-gradient-to-r from-brand-primary to-blue-700 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-primary/50 transition-all duration-300 hover:-translate-y-1 transform hover:scale-105"
          >
            <span className="text-lg">Login As Admin</span>
          </button>
          <button
            onClick={() => onSelectRole('user')}
            className="w-full py-4 px-6 font-semibold text-white bg-gradient-to-r from-brand-secondary to-green-700 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-secondary/50 transition-all duration-300 hover:-translate-y-1 transform hover:scale-105"
          >
            <span className="text-lg">Login As User</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;