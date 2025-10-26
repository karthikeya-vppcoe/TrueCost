import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { MenuIcon } from './Icons.tsx';
// FIX: Add file extension to import to fix module resolution error.
import ThemeToggle from './ThemeToggle.tsx';
// FIX: Import AdminView and Theme types for stronger typing.
// FIX: Add file extension to import to fix module resolution error.
import { User, AdminView, Theme } from '../types.ts';

// FIX: Update HeaderProps to use specific AdminView and Theme types for better type safety.
interface HeaderProps {
  currentView: AdminView;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User;
}

// FIX: Use AdminView as key type for viewTitles for type safety.
const viewTitles: { [key in AdminView]: string } = {
  dashboard: 'Dashboard',
  mapping: 'Product Mapping',
  settings: 'Settings',
};

const LogoutIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, setIsSidebarOpen, onLogout, theme, setTheme, user }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Hamburger menu for mobile */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-4 md:ml-0">
              {viewTitles[currentView] || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle theme={theme} setTheme={setTheme} />
             <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center space-x-3">
                <img className="h-9 w-9 rounded-full" src={`https://i.pravatar.cc/150?u=${user.name}`} alt="User avatar" />
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                     <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
                </div>
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

export default Header;