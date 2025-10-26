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
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 animate-fade-in">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
        <div className="flex flex-col items-center space-y-3">
          <LogoIcon className="w-16 h-16 text-brand-secondary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to TrueCost
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select a role to continue
          </p>
        </div>
        
        <div className="space-y-4 pt-4">
          <button
            onClick={() => onSelectRole('admin')}
            className="w-full py-3 px-4 font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Login As Admin
          </button>
          <button
            onClick={() => onSelectRole('user')}
            className="w-full py-3 px-4 font-semibold text-white bg-brand-secondary rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Login As User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;