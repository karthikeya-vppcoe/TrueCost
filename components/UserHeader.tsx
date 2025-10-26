import React from 'react';
// FIX: Import Theme type for stronger typing.
// FIX: Add file extension to import to fix module resolution error.
import { User, Theme } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import ThemeToggle from './ThemeToggle.tsx';
// FIX: Add file extension to import to fix module resolution error.
import { LogoIcon, UserCircleIcon } from './Icons.tsx';

// FIX: Update UserHeaderProps to use the specific Theme type to resolve type mismatches.
interface UserHeaderProps {
  user: User;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onNavigateProfile: () => void;
}

const LogoutIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const UserHeader: React.FC<UserHeaderProps> = ({ user, onLogout, theme, setTheme, onNavigateProfile }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-sm flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                    <LogoIcon className="h-8 w-8 text-brand-secondary" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">TrueCost</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center space-x-3">
                        <button onClick={onNavigateProfile} className="flex items-center space-x-3 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                             <img className="h-9 w-9 rounded-full" src={`https://i.pravatar.cc/150?u=${user.email}`} alt="User avatar" />
                            <div className="hidden md:flex flex-col items-start">
                                 <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                                 <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
                            </div>
                        </button>
                        <button onClick={onLogout} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" aria-label="Logout">
                           <LogoutIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default UserHeader;